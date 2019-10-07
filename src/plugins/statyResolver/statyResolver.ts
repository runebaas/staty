import * as parse5 from 'parse5';
import { TreeElement, } from '../../models/treeElementModel';
import { Component, ComponentDefinition, } from '../../models/componentModel';
import { readFile, } from '../../lib/helpers';
import { loadDefinition, } from './definitionParser';
import { generateErrorNode, } from '../../lib/errorGenerators';
import { PluginInfo, ResolverPlugin, } from '../../models/pluginsModel';

function loadSlotContent(dom: TreeElement): TreeElement {
  const nodes = dom
    .childNodes.find(node => node.tagName === 'slot')
    .childNodes.filter(node => !(node.value && node.value.startsWith('\n')))
    .map(({ nodeName, tagName, attrs, childNodes, }) => ({ nodeName, tagName, attrs, childNodes, }));

  return {
    nodeName: 'rplc',
    tagName: 'rplc',
    attrs: [],
    childNodes: nodes,
  };
}


export async function loadStatyComponent(filePath: string): Promise<Component> {
  const entry = await readFile(filePath);
  const dom = parse5.parseFragment(entry.toString(), { scriptingEnabled: false, }) as TreeElement;
  const componentNode = dom.childNodes.find(node => node.tagName === 'component');

  let content: TreeElement;
  try {
    content = loadSlotContent(componentNode);
  } catch (error) {
    content = generateErrorNode('Failed to decode slot content', filePath, error);
  }

  let definition: ComponentDefinition = {
    name: 'anonymous',
    path: filePath,
    props: [],
  };
  try {
    definition = {
      ...definition,
      ...loadDefinition(componentNode, filePath),
    };
  } catch (error) {
    console.log('definition', filePath, error.message);
    content = generateErrorNode('Failed to decode component definition', filePath, error);
  }

  return {
    definition: definition,
    slot: content,
  };
}

export const statyResolverPlugin: PluginInfo<ResolverPlugin> = {
  name: 'Staty Component Resolver',
  func: loadStatyComponent,
};
