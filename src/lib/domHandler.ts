import { TreeElement } from '../models/treeElementModel';
import { Scope } from '../models/scopeModel';
import { nodeHandlerFunctions } from './nodeHandlers/handlers';

export async function domManager(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  const parseFunction = nodeHandlerFunctions[doc.nodeName];
  if (parseFunction !== undefined) {
    return parseFunction(doc, scope);
  }

  if (doc.childNodes === undefined) {
    return doc;
  }

  const results = (await Promise.all(doc.childNodes.map(node => domManager(node, {
    ...scope
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

