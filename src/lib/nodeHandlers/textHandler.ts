import {TreeElement} from '../../models/treeElementModel';
import {Scope} from '../../models/scopeModel';
import {generateErrorNode} from '../errorGenerators';

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
      textNode.value = strings.map(section => {
        if (isVar) {
          isVar = false;
          const key = section.trim();
          if (Object.keys(variables).includes(key)) {
            return variables[key];
          }

          return section;
        }
        isVar = true;

        return section;
      }).join('');
    }
  } catch (error) {
    return generateErrorNode('text substitution failed', scope.path, error);
  }

  return textNode;
}
