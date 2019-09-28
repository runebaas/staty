/*
 * Disclaimer for anyone ever looking this far back in the commit history,
 * this is super WIP, hacked and doesn't even work properly
 */

import { TreeElement } from '../models/treeElementModel';
import { HandleComponent } from './nodeHandlers/componentHandler';
import { HandleText } from './nodeHandlers/testHandler';
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
  }))))
    .filter(d => d !== null);

  if (results.length === 0) {
    return doc;
  }

  const rplc = results.filter(r => r.nodeName === 'rplc').flatMap(r => r.childNodes);
  const elements = [...results.filter(r => r.nodeName !== 'rplc'), ...rplc];

  const newDoc = doc;
  newDoc.childNodes = elements;
  return newDoc;
}

