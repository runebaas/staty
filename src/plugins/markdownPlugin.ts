import * as path from 'path';
import marked from 'marked';
import parse5 from 'parse5';
import { TreeElement, } from '../models/treeElementModel';
import { readFile, removeTextOffset, } from '../lib/helpers';
import { Scope, } from '../models/scopeModel';
import { generateErrorNode, } from '../lib/errorGenerators';
import highlight from 'highlight.js';
import { PluginInfo, TagPlugin, } from '../models/pluginsModel';
import { ErrorLevel, MessageManager, } from '../modules/messageManager';

async function handleMarkdown(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  const lang = doc.attrs.find(att => att.name === 'lang') || { value: 'text', };

  if (lang.value !== 'md' && lang.value !== 'markdown') {
    return doc;
  }

  const filePath = doc.attrs.find(att => att.name === 'path') || { value: '', };

  let content: string;

  try {
    if (filePath.value !== '') {
      const fileContents = await readFile(path.join(path.dirname(scope.path), filePath.value));
      content = fileContents.toString();
    } else {
      content = removeTextOffset(doc.childNodes[0].value);
    }

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

export const markdownPlugin: PluginInfo<TagPlugin> = {
  func: handleMarkdown,
  name: 'Markdown',
};
