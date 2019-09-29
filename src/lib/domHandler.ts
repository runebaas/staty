import { TreeElement } from '../models/treeElementModel';
import { Scope } from '../models/scopeModel';
import { nodeHandlerFunctions } from './nodeHandlers/handlers';
import { Attribute } from 'parse5';

export async function domManager(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  const newDoc = doc;

  newDoc.attrs = substituteAttributes(newDoc.attrs, scope);

  const parseFunction = nodeHandlerFunctions[newDoc.nodeName];
  if (parseFunction !== undefined) {
    return parseFunction(newDoc, scope);
  }

  if (newDoc.childNodes === undefined) {
    return newDoc;
  }

  const results = (await Promise.all(newDoc.childNodes.map(node => domManager(node, scope)))).filter(d => d !== null);

  if (results.length === 0) {
    return newDoc;
  }

  newDoc.childNodes = results
    .map(r => [r])
    .map(r => r[0].nodeName === 'rplc' ? r[0].childNodes : r)
    .flat();

  return newDoc;
}

function substituteAttributes(attributes: (Attribute[]|undefined), scope: Scope): Attribute[] {
  if (attributes === undefined || attributes.length === 0) { return attributes || []; }

  return attributes.map(attr => {
    if (attr.name.startsWith(':')) {
      attr.name = attr.name.slice(1);
      attr.value = scope.variables[attr.value] || scope.globalVariables[attr.value] || attributeVariableNotFound(scope, attr);
    }
    return attr;
  });
}

function attributeVariableNotFound(scope: Scope, attr: Attribute): string {
  console.info(scope.path, 'Unable to replace prop', attr);
  return '';
}
