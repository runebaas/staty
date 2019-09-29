import { TreeElement } from '../../models/treeElementModel';
import { Scope } from '../../models/scopeModel';
import { GenerateErrorNode } from '../errorGenerators';

export function HandleText(doc: TreeElement, scope: Scope): TreeElement {
  const textNode = doc;
  try {
    const matches = textNode.value.match(/{{(.+)}}/);
    if (matches !== null) {
      const variables = {
        ...scope.globalVariables,
        ...scope.variables
      };
      const key = matches[1].trim();
      if (Object.keys(variables).includes(key)) {
        textNode.value = variables[key];
      }
    }
  } catch (e) {
    GenerateErrorNode('text substitution failed', scope.path, e);
  }

  return textNode;
}
