import { TreeElement } from '../../models/treeElementModel';
import { Scope } from '../../models/scopeModel';
import { GenerateErrorNode } from '../errorGenerators';

export function HandleText(doc: TreeElement, scope: Scope): TreeElement {
  const textNode = doc;
  try {
    const strings = textNode.value.split(/{{(.+?)}}/g);

    if (strings.length > 1) {
      const variables = {
        ...scope.globalVariables,
        ...scope.variables
      };

      let isVar = false;
      textNode.value = strings.map(m => {
        if (isVar) {
          isVar = false;
          const key = m.trim();
          if (Object.keys(variables).includes(key)) {
            return variables[key];
          }
          return m;
        }
        isVar = true;
        return m;
      }).join('');
    }
  } catch (e) {
    return GenerateErrorNode('text substitution failed', scope.path, e);
  }

  return textNode;
}
