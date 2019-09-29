import { TreeElement } from '../../models/treeElementModel';
import { Scope } from '../../models/scopeModel';
import { GenerateErrorNode } from '../errorGenerators';

export function HandleText(doc: TreeElement, scope: Scope): TreeElement {
  const textNode = doc;
  try {
    const matches = textNode.value.match(/{{(.+)}}/);
    if (matches !== null) {
      const key = matches[1].trim();
      if (Object.keys(scope.variables).includes(key)) {
        textNode.value = scope.variables[key];
      }
    }
  } catch (e) {
    console.error('text substitution failed', doc.value, scope.variables, e.message);
    GenerateErrorNode('text substitution failed', scope.path, e);
  }

  return textNode;
}
