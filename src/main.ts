import { ReadFile } from './lib/helpers';
import * as path from 'path';
import * as parse5 from 'parse5';
import { domManager } from './lib/domHandler';
import { TreeElement } from './models/treeElementModel';
import { html_beautify } from 'js-beautify';

(async () => {
  const rootPath = path.resolve('./example/index.sty');
  const root = await ReadFile(rootPath);

  const dom = parse5.parse(root.toString()) as TreeElement;
  const res = await domManager(dom, {
    path: rootPath,
    useCssModules: false,
    variables: {}
  });
  const html = parse5.serialize(res);
  const final = html_beautify(html, {
    end_with_newline: true,
    indent_body_inner_html: true,
    indent_size: 2,
    preserve_newlines: false
  });
  console.log(final);
})().catch(console.error);
