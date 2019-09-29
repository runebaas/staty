import * as parse5 from 'parse5';
import { TreeElement } from '../../models/treeElementModel';
import { Component, ComponentDefinition } from '../../models/componentModel';
import { ReadFile } from '../helpers';
import { LoadDefinition } from './definitionParser';
import { GenerateErrorNode } from '../errorGenerators';

export async function LoadComponent(filePath: string): Promise<Component> {
  const entry = await ReadFile(filePath);
  const dom = parse5.parseFragment(entry.toString(), { scriptingEnabled: false }) as TreeElement;
  const componentNode = dom.childNodes.find(s => s.tagName === 'component');

  let content: TreeElement;
  try {
    content = LoadSlotContent(componentNode);
  } catch (e) {
    content = GenerateErrorNode('Failed to decode slot content', filePath, e);
  }

  let definition: ComponentDefinition = {
    name: 'anonymous',
    path: filePath,
    props: []
  };
  try {
    definition = {
      ...definition,
      ...LoadDefinition(componentNode, filePath)
    };
  } catch (e) {
    console.log('definition', filePath, e.message);
    content = GenerateErrorNode('Failed to decode component definition', filePath, e);
  }

  return {
    definition: definition,
    slot: content
  };
}

function LoadSlotContent(dom: TreeElement): TreeElement {
  const nodes = dom
    .childNodes.find(s => s.tagName === 'slot')
    .childNodes.filter(s => !(s.value && s.value.startsWith('\n')))
    .map(({ nodeName, tagName, attrs, childNodes }) => ({ nodeName, tagName, attrs, childNodes }));
  return {
    nodeName: 'rplc',
    tagName: 'rplc',
    attrs: [],
    childNodes: nodes
  };
}
