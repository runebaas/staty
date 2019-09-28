import * as parse5 from 'parse5';
import { TreeElement } from '../../models/treeElementModel';
import { Component, ComponentDefinition } from '../../models/componentModel';
import { ReadFile } from '../helpers';
import yaml from 'js-yaml';

export async function LoadComponent(filePath: string): Promise<Component> {
  const entry = await ReadFile(filePath);
  const dom = parse5.parseFragment(entry.toString(), { scriptingEnabled: false }) as TreeElement;
  const componentNode = dom.childNodes.find(s => s.tagName === 'component');

  let content: TreeElement;
  try {
    content = LoadSlotContent(componentNode);
  } catch (e) {
    content = GenerateError('Failed to decode slot content', filePath, e);
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
    content = GenerateError('Failed to decode component definition', filePath, e);
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

function LoadDefinition(dom: TreeElement, filePath: string): ComponentDefinition {
  const definitionNode = dom.childNodes.find(s => s.tagName === 'definition');
  const lang = definitionNode.attrs.find(l => l.name === 'lang') || { value: 'html' };
  const defaultDefinition: ComponentDefinition = {
    name: 'anonymous',
    path: filePath,
    props: []
  };
  let definition: ComponentDefinition;

  switch (lang.value) {
    case 'yaml':
      definition = {
        ...defaultDefinition,
        ...LoadDefinitionFromYaml(definitionNode)
      };
      break;
    case 'json':
      definition = {
        ...defaultDefinition,
        ...LoadDefinitionFromJson(definitionNode)
      };
      break;
    default:
      definition = {
        ...defaultDefinition,
        ...LoadDefinitionFromHtml(definitionNode)
      };
      break;
  }

  return definition;
}

function LoadDefinitionFromYaml(dom: TreeElement): ComponentDefinition {
  return yaml.safeLoad(dom.childNodes[0].value);
}

function LoadDefinitionFromHtml(dom: TreeElement): ComponentDefinition {
  const definition: ComponentDefinition = {
    props: []
  };

  dom.childNodes.forEach(({ tagName, attrs }) => {
    if (tagName === 'meta') {
      const attributes = attrs.reduce<{[key: string]: string}>((result, att) => {
        result[att.name] = att.value;
        return result;
      }, {});

      switch (attributes.name) {
        case 'name':
          definition.name = attributes.content;
          break;
        case 'prop':
          definition.props.push({
            name: attributes.content,
            default: attributes.default
          });
          break;
        default:
          break;
      }
    }
  });

  return definition;
}

function LoadDefinitionFromJson(dom: TreeElement): ComponentDefinition {
  return JSON.parse(dom.childNodes[0].value);
}

function GenerateError(message: string, filePath: string, error: Error): TreeElement {
  const errorMessage = `
  ---ERROR
  | ${message}
  | ${filePath} 
  | ${error.message}
  ---`;

  return {
    nodeName: 'div',
    tagName: 'div',
    attrs: [],
    childNodes: [{
      nodeName: '#text',
      value: errorMessage
    }]
  };

}
