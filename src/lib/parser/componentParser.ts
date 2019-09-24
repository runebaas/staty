import cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { ComponentInfo } from '../../models/componentModel';
import { ParserOptions } from './parserOptionsModel';

const readFile = promisify(fs.readFile);

export async function parser(basePath: string, options: ParserOptions): Promise<CheerioStatic> {
  const filePath = path.resolve(basePath, options.componentPath);

  const entry = await readFile(filePath);
  const document = cheerio.load(entry);

  document('ref').map((i, e) => e.attribs.id = v4());
  document('ref').each((i, ref) => {
    try {
      document(`#${ref.attribs.id}`).replaceWith(options.props[ref.attribs.name]);
    } catch (e) {
      throw new Error(`failed to substitute ref "${ref.attribs.name || '(anonymous)'}" in ${filePath}`);
    }
  });

  document('component').map((i, e) => e.attribs.id = v4());
  
  const componentReplace: Promise<void>[] = [];
  document('component').each((i, comp) => componentReplace.push((async () => {
    const info = parseComponentInfo(comp);
    const res = await parser(path.dirname(filePath), { componentPath: info.path, props: info.props });
    document(`#${comp.attribs.id}`).replaceWith(res('slot').html());
  })()));
  await Promise.all(componentReplace);

  return document;
}

function parseComponentInfo(component: CheerioElement): ComponentInfo {
  const { path: componentPath, ...props } = component.attribs;
  return {
    path: componentPath,
    props: props
  };
}
