import { parseComponentInfo } from './lib/parser/componentParser';
import * as path from 'path';
import { default as parse5, DefaultTreeElement } from 'parse5';
import { domManager } from './lib/vdom/domHandler';

(async () => {
  const root = await parseComponentInfo(path.resolve('./example'));
  const dom = parse5.parse(root.document.html());
  const res = await domManager(<DefaultTreeElement>dom, {
    path: root.path,
    useCssModule: false,
    variables: root.propData
  });
  const final = parse5.serialize(res);
  console.log(final);
})().catch(console.error);
