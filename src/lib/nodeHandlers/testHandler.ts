import { TreeElement } from '../../models/treeElementModel';
import { Scope } from '../../models/scopeModel';

export function HandleText(doc: TreeElement, scope: Scope): TreeElement {
  const textNode = doc;
  const matches = textNode.value.match(/{{(.+)}}/);
  if (matches !== null) {
    textNode.value = scope.variables[matches[1].trim()];
  }

  return textNode;
}
