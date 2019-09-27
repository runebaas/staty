import { parseComponentInfo } from './lib/parser/componentParser';
import * as path from 'path';
import * as parse5 from 'parse5';
import { domManager } from './lib/vdom/domHandler';
import { TreeElement } from './models/treeElementModel';

(async () => {
  const root = await parseComponentInfo(path.resolve('./example'));
  const dom = parse5.parse(root.document.html()) as TreeElement;
  const res = await domManager(dom, {
    path: root.path,
    useCssModules: false,
    variables: root.propData
  });
  const final = parse5.serialize(res);
  console.log(final);
})().catch(console.error);
