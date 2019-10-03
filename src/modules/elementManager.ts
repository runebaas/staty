import { TreeElement, } from '../models/treeElementModel';
import { Scope, } from '../models/scopeModel';
import { PluginManager, } from './pluginManager';
import { Attribute as DomAttribute, } from 'parse5';

export class ElementManager {
  private readonly doc: TreeElement;
  private readonly scope: Scope;
  private readonly pluginManager: PluginManager;

  constructor(doc: TreeElement, scope: Scope) {
    this.doc = doc;
    this.scope = scope;
    this.pluginManager = scope.moduleManager.tryGetModule<PluginManager>('pluginManager');
  }

  public async handleElement(): Promise<TreeElement> {
    const newDoc = this.doc;

    const { attributePlugins, tagPlugins, } = this.pluginManager;
    newDoc.attrs = attributePlugins.reduce<DomAttribute[]>((attrs, plugin) => {
      try {
        return plugin.func(attrs, this.scope);
      } catch (error) {
        error.message = `${plugin.name}: ${error.message}`;
        throw error;
      }
    }, newDoc.attrs);

    const parseFunctions = tagPlugins[newDoc.nodeName];

    if (parseFunctions !== undefined) {
      return parseFunctions[0].func(newDoc, this.scope);
    }

    if (newDoc.childNodes === undefined) {
      return newDoc;
    }

    const results = (await Promise.all(newDoc.childNodes.map(node => {
      const elementManager = new ElementManager(node, this.scope);

      return elementManager.handleElement();
    }))).filter(node => node !== null);

    if (results.length === 0) {
      return newDoc;
    }

    newDoc.childNodes = results
      .map(res => [ res, ])
      .map(res => (res[0].nodeName === 'rplc' ? res[0].childNodes : res))
      // Would love to use .flat(),
      // but as long as node 10 lts is still a thing it's not happening
      .reduce((result, element) => {
        element.forEach(ell => result.push(ell));

        return result;
      }, []);

    return newDoc;
  }
}
