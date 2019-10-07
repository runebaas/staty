import { TreeElement, } from '../models/treeElementModel';
import { Scope, } from '../models/scopeModel';
import { PluginManager, } from './pluginManager';
import { ErrorLevel, MessageManager, } from './messageManager';

export class ElementManager {
  private readonly doc: TreeElement;
  private readonly scope: Scope;
  private readonly pluginManager: PluginManager;
  private readonly messageManager: MessageManager;

  constructor(doc: TreeElement, scope: Scope) {
    this.doc = doc;
    this.scope = scope;
    this.pluginManager = scope.moduleManager.tryGetModule<PluginManager>('pluginManager');
    this.messageManager = scope.moduleManager.tryGetModule<MessageManager>('messageManager');
  }

  public async handleElement(): Promise<TreeElement> {
    let newDoc: TreeElement = this.doc;

    const { attributePlugins, tagPlugins, } = this.pluginManager;
    for (const plugin of attributePlugins) {
      try {
        newDoc.attrs = await plugin.func(newDoc.attrs, this.scope);
      } catch (error) {
        this.messageManager.addMessage({ level: ErrorLevel.Fatal, error: error, message: `${plugin.name}: ${error.message}`, source: this.scope.path, });
        throw error;
      }
    }

    const parseFunctions = tagPlugins[newDoc.nodeName];

    if (parseFunctions !== undefined) {
      for (const plugin of parseFunctions) {
        try {
          newDoc = await plugin.func(newDoc, this.scope);
        } catch (error) {
          error.message = `${plugin.name}: ${error.message}`;
          throw error;
        }
      }

      return newDoc;
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
