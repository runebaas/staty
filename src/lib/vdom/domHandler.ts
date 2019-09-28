/*
 * Disclaimer for anyone ever looking this far back in the commit history,
 * this is super WIP, hacked and doesn't even work properly
 */

import * as parse5 from 'parse5';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
import { TreeElement } from '../../models/treeElementModel';

const readFile = promisify(fs.readFile);

export async function domManager(doc: TreeElement, scope: Scope): Promise<TreeElement> {
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

  const results = (await Promise.all(doc.childNodes.map(node => domManager(node, {
    path: scope.path,
    useCssModules: false,
    variables: scope.variables
  }))))
    .filter(d => d !== null);

  if (results.length === 0) {
    return doc;
  }

  const rplc = results.filter(r => r.nodeName === 'rplc').flatMap(r => r.childNodes);
  const elements = [...results.filter(r => r.nodeName !== 'rplc'), ...rplc];

  const newDoc = doc;
  newDoc.childNodes = elements;
  return newDoc;
}

async function handleComponent(comp: TreeElement, scope: Scope): Promise<TreeElement> {
  const { path: compPath, ...attrs } = comp.attrs.reduce<{[key: string]: string}>((res, val) => {
    res[val.name] = val.value;
    return res;
  }, {});

  const filePath = path.resolve(path.dirname(scope.path), compPath);
  const newComp = await loadComponent(filePath);

  return domManager(newComp, {
    path: filePath,
    variables: attrs,
    useCssModules: false
  });
}

async function loadComponent(filePath: string): Promise<TreeElement> {
  const entry = await readFile(filePath);
  const dom = parse5.parseFragment(entry.toString(), { scriptingEnabled: false }) as TreeElement;
  try {
    const nodes = dom
      .childNodes.find(s => s.tagName === 'component')
      .childNodes.find(s => s.tagName === 'slot')
      .childNodes.filter(s => !(s.value && s.value.startsWith('\n')))
      .map(({ nodeName, tagName, attrs, childNodes }) => ({ nodeName, tagName, attrs, childNodes }));
    return {
      nodeName: 'rplc',
      tagName: 'rplc',
      attrs: [],
      childNodes: nodes
    };
  } catch (e) {
    return {
      nodeName: '#text',
      value: `---\nRENDER FAILED FOR\n ${filePath}\n ${e.message}\n---`
    };
  }
}

function handleText(doc: TreeElement, scope: Scope): TreeElement {
  const textNode = doc;
  const matches = textNode.value.match(/{{(.+)}}/);
  if (matches !== null) {
    textNode.value = scope.variables[matches[1].trim()];
  }

  return textNode;
}

export interface Scope {
  variables: {[key: string]: string}
  path: string;
  useCssModules: boolean
}

