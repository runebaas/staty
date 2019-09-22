import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { ComponentInfo } from '../../models/componentModel';
import { ParserOptions } from './parserOptionsModel';

const readFile = promisify(fs.readFile);

export async function parser(basePath: string, options: ParserOptions): Promise<Document> {
  const filePath = path.resolve(basePath, options.componentPath);

  const entry = await readFile(filePath);
  const dom = new JSDOM(entry);
  const { document } = dom.window;

  const refs = Array.from(document.getElementsByTagName('ref'));
  for (const ref of refs) {
    const refName = ref.attributes.getNamedItem('name');
    try {
      ref.replaceWith(options.props[refName.value || '']);
    } catch (e) {
      throw new Error(`failed to substitute ${refName.value}`);
    }
  }

  // eslint-disable-next-line unicorn/prefer-spread
  const components = Array.from(document.getElementsByTagName('component'));
  for (const comp of components) {
    const info = parseComponentInfo(comp);
    comp.id = v4();
    const res = await parser(path.dirname(filePath), { componentPath: info.path, props: info.props });
    comp.replaceWith(res.querySelector('slot').children.item(0));
  }

  return document;
}

function parseComponentInfo(component: Element): ComponentInfo {
  // @ts-ignore
  const { path: componentPath, ...props } = Array.from(component.attributes)
    .reduce((result, attr) => {
      result[attr.name] = attr.value;
      return result;
    }, {}) as {[name: string]: string };
  return {
    path: componentPath,
    props: props
  };
}
