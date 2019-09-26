/*
 * Disclaimer for anyone ever looking this far back in the commit history,
 * this is super WIP, hacked and doesn't even work properly
 */

import { default as parse5, DefaultTreeElement, DefaultTreeNode } from 'parse5';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

const readFile = promisify(fs.readFile);

export async function domManager(doc: DefaultTreeElement, scope: Scope): Promise<DefaultTreeNode> {
  switch (doc.nodeName) {
    case 'component':
      return handleComponent(doc, scope);
    case 'ref':
      return handleRef(doc, scope);
    default:
      break;
  }

  if (doc.childNodes === undefined) {
    return doc;
  }

  const f = (await Promise.all(doc.childNodes.map(n => domManager(<DefaultTreeElement>n, {
    path: scope.path,
    useCssModule: false,
    variables: scope.variables
  })))).filter(d => d !== null);

  if (f.length > 0) {
    // eslint-disable-next-line require-atomic-updates
    doc.childNodes = f;
  }

  return doc;
}

async function handleComponent(comp: DefaultTreeElement, scope: Scope): Promise<DefaultTreeNode> {
  // this is just ridiculous
  // @ts-ignore
  const { path: compPath, ...attrs } = comp.attrs.reduce((res, val) => {
    res[val.name] = val.value;
    return res;
  }, {});

  const filePath = path.resolve(path.dirname(scope.path), compPath);
  const newComp = await loadComponent(filePath);
  return domManager(newComp, {
    path: filePath,
    // @ts-ignore
    variables: attrs,
    useCssModule: false
  });
}

async function loadComponent(filePath: string): Promise<DefaultTreeElement> {
  const entry = await readFile(filePath);
  const dom = parse5.parse(entry.toString()) as DefaultTreeElement;
  // @ts-ignore
  return dom.childNodes[0].childNodes[1].childNodes.find(f => f.tagName === 'slot');
}

function handleRef(element: DefaultTreeElement, scope: Scope): DefaultTreeElement {
  return parse5
    .parseFragment(scope.variables[element.attrs.find(f => f.name === 'name').value])
    // @ts-ignore
    .childNodes[0];
}

export interface Scope {
  variables: {[key: string]: string}
  path: string;
  useCssModule: boolean
}
