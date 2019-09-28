import { TreeElement } from '../models/treeElementModel';
import { HandleComponent } from './nodeHandlers/componentHandler';
import { HandleText } from './nodeHandlers/textHandler';
import { Scope } from '../models/scopeModel';

export async function domManager(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  switch (doc.nodeName) {
    case '#text':
      return HandleText(doc, scope);
    case 'component':
      return HandleComponent(doc, scope);
    default:
      break;
  }

  if (doc.childNodes === undefined) {
    return doc;
  }

  const results = (await Promise.all(doc.childNodes.map(node => domManager(node, {
    path: scope.path,
    useCssModules: false,
    variables: scope.variables
  })))).filter(d => d !== null);

  if (results.length === 0) {
    return doc;
  }

  const nodes = results
    .map(r => [r])
    .map(r => r[0].nodeName === 'rplc' ? r[0].childNodes : r)
    .flat();

  const newDoc = doc;
  newDoc.childNodes = nodes;
  return newDoc;
}

