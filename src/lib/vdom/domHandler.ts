/*
 * Disclaimer for anyone ever looking this far back in the commit history,
 * this is super WIP, hacked and doesn't even work properly
 */

import {
  default as parse5,
  DefaultTreeElement,
  DefaultTreeNode,
  DefaultTreeTextNode,
  DefaultTreeChildNode,
  DefaultTreeParentNode
} from 'parse5';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

const readFile = promisify(fs.readFile);

export async function domManager(doc: DefaultTreeElement, scope: Scope): Promise<DefaultTreeNode> {
  switch (doc.nodeName) {
    case '#text':
      return handleText(doc, scope);
    case 'component':
      return handleComponent(doc, scope);
    default:
      break;
  }

  if (doc.childNodes === undefined) {
    return doc;
  }

  const results = (await Promise.all(doc.childNodes.map(node => domManager(<DefaultTreeElement>node, {
    path: scope.path,
    useCssModule: false,
    variables: scope.variables
  })))).filter(d => d !== null);

  if (results.length > 0) {
    // eslint-disable-next-line require-atomic-updates
    doc.childNodes = results;
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
  const dom = parse5.parse(entry.toString()) as TreeElement;
  return dom.childNodes[0].childNodes[1].childNodes.find(f => f.tagName === 'slot').childNodes[1];
}

function handleText(doc: DefaultTreeChildNode, scope: Scope): DefaultTreeChildNode {
  const textNode = doc as DefaultTreeTextNode;
  const matches = textNode.value.match(/{{(.+)}}/);
  if (matches !== null) {
    textNode.value = scope.variables[matches[1].trim()];
  }

  return textNode;
}

export interface Scope {
  variables: {[key: string]: string}
  path: string;
  useCssModule: boolean
}

interface TreeElement extends DefaultTreeParentNode, DefaultTreeElement  {
  childNodes: TreeElement[];
}
