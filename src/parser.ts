import { ReadFile } from './lib/helpers';
import * as path from 'path';
import * as parse5 from 'parse5';
import { domManager } from './lib/domHandler';
import { TreeElement } from './models/treeElementModel';
import { html_beautify } from 'js-beautify';

export async function parse(rootPath: string): Promise<string> {
  const resolvedPath = path.resolve(rootPath);
  const root = await ReadFile(resolvedPath);

  const dom = parse5.parse(root.toString()) as TreeElement;

  const result = await domManager(dom, {
    path: resolvedPath,
    useCssModules: false,
    variables: {}
  });

  const html = parse5.serialize(result);
  return html_beautify(html, {
    end_with_newline: true,
    indent_body_inner_html: true,
    indent_size: 2,
    preserve_newlines: false
  });
}
