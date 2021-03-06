import marked from 'marked';
import parse5 from 'parse5';
import highlight from 'highlight.js';
import { TreeElement, } from '../core/models/treeElementModel';
import { removeTextOffset, } from '../core/lib/helpers';
import { Scope, } from '../core/models/scopeModel';
import { generateErrorNode, } from '../core/lib/errorGenerators';
import { PluginInfo, TagPlugin, } from '../core/models/pluginsModel';
import { ErrorLevel, MessageManager, } from '../core/modules/messageManager';

function handleMarkdown(doc: TreeElement, scope: Scope): TreeElement {
  const lang = doc.attrs.find(att => att.name === 'lang') || { value: 'text', };

  if (lang.value !== 'md' && lang.value !== 'markdown') {
    return doc;
  }

  try {
    const content = removeTextOffset(doc.childNodes[0].value);
    const parseResult = marked.parse(content, { highlight: (code: string, language: string): string => highlight.highlight(language, code).value, });
    const fragment = parse5.parseFragment(`<rplc>${parseResult}</rplc>`) as TreeElement;

    return fragment.childNodes[0];
  } catch (error) {
    const messageHandler = scope.moduleManager.tryGetModule<MessageManager>('messageManager');
    messageHandler.addMessage({
      level: ErrorLevel.Error,
      message: 'Failed to parse markdown',
      source: scope.path,
      error: error,
    });

    return generateErrorNode('Failed to parse markdown', scope.path, error);
  }
}

export const markdownParsePlugin: PluginInfo<TagPlugin> = {
  name: 'Markdown',
  func: handleMarkdown,
};
