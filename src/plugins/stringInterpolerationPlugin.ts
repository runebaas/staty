import { PluginInfo, TagPlugin, } from '../core/models/pluginsModel';
import { TreeElement, } from '../core/models/treeElementModel';
import { Scope, } from '../core/models/scopeModel';
import { generateErrorNode, } from '../core/lib/errorGenerators';
import { ErrorLevel, MessageManager, } from '../core/modules/messageManager';

export function handleString(doc: TreeElement, scope: Scope): TreeElement {
  const textNode = doc;
  try {
    const strings = textNode.value.split(/\{\{(.+?)\}\}/gu);

    if (strings.length > 1) {
      const variables = {
        ...scope.globalVariables,
        ...scope.variables,
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
    const messageHandler = scope.moduleManager.tryGetModule<MessageManager>('messageManager');
    messageHandler.addMessage({
      level: ErrorLevel.Error,
      message: 'text substitution failed',
      source: scope.path,
      error: error.stack,
    });

    return generateErrorNode('text substitution failed', scope.path, error);
  }

  return textNode;
}

export const stringInterpolerationPlugin: PluginInfo<TagPlugin> = {
  name: 'StringInterpoleration',
  func: handleString,
};
