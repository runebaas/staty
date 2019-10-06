import { PluginInfo, TagPlugin, } from '../models/pluginsModel';
import { TreeElement, } from '../models/treeElementModel';
import { Scope, } from '../models/scopeModel';
import { generateErrorNode, } from '../lib/errorGenerators';
import { ErrorLevel, MessageManager, } from '../modules/messageManager';

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
