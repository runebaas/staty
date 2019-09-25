import { parser, parseComponentInfo } from './lib/parser/componentParser';
import * as path from 'path';

(async () => {
  const root = await parseComponentInfo(path.resolve('./example'));
  const res = await parser(root);
  root.document('body').replaceWith(res('body'));
  console.log(root.document.html({
    normalizeWhitespace: true
  }));
})().catch(console.error);
