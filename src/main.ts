import { parseComponentInfo } from './lib/parser/componentParser';
import * as path from 'path';
import * as parse5 from 'parse5';
import { domManager } from './lib/domHandler';
import { TreeElement } from './models/treeElementModel';
import { html_beautify } from 'js-beautify';

(async () => {
  const root = await parseComponentInfo(path.resolve('./example'));
  const dom = parse5.parse(root.document.html()) as TreeElement;
  const res = await domManager(dom, {
    path: root.path,
    useCssModules: false,
    variables: root.propData
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
