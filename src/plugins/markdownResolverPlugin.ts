import path from 'path';
import marked from 'marked';
import highlight from 'highlight.js';
import parse5 from 'parse5';
import { readFile, } from '../core/lib/helpers';
import { Component, } from '../core/models/componentModel';
import { TreeElement, } from '../core/models/treeElementModel';
import { PluginInfo, ResolverPlugin, } from '../core/models/pluginsModel';

async function loadMarkdownComponent(filePath: string): Promise<Component> {
  const content = await readFile(filePath);

  const parseResult = marked.parse(
      content.toString(),
      { highlight: (code: string, language: string): string => highlight.highlight(language, code).value, }
  );

  const fragment = parse5.parseFragment(`<rplc>${parseResult}</rplc>`) as TreeElement;

  return {
    definition: {
      name: path.basename(filePath),
      path: filePath,
    },
    slot: fragment.childNodes[0],
    leaveUntouched: true,
  };
}

export const markdownResolverPlugin: PluginInfo<ResolverPlugin> = {
  name: 'Markdown Resolver',
  func: loadMarkdownComponent,
};
