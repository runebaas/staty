import * as parse5 from 'parse5';
import { TreeElement } from '../models/treeElementModel';
import { ReadFile } from './helpers';

export async function LoadComponent(filePath: string): Promise<TreeElement> {
  const entry = await ReadFile(filePath);
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
