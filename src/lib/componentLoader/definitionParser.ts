import { TreeElement } from '../../models/treeElementModel';
import { ComponentDefinition } from '../../models/componentModel';
import yaml from 'js-yaml';
import { RemoveTextOffset } from '../helpers';

export function LoadDefinition(dom: TreeElement, filePath: string): ComponentDefinition {
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
  const content = RemoveTextOffset(dom.childNodes[0].value);
  return yaml.safeLoad(content);
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
