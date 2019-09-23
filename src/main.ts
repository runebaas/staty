import * as fs from 'fs';
import * as path from 'path';
import { parser } from './lib/parser/componentParser';
import cheerio from 'cheerio';
import { promisify } from 'util';

(async () => {
  const entryFile = './example/index.sty';
  const res = await parser(path.resolve('.'), {
    componentPath: entryFile
  });
  const entryFileContent = await promisify(fs.readFile)(entryFile);
  const dom = cheerio.load(entryFileContent);
  dom('body').replaceWith(res('body'));
  console.log(dom.html({
    normalizeWhitespace: true
  }));
})();
