import {TreeElement} from '../../models/treeElementModel';
import {ComponentDefinition} from '../../models/componentModel';
import yaml from 'js-yaml';
import {removeTextOffset} from '../helpers';
import {KeyValue} from '../../models/helperTypes';

export function loadDefinition(dom: TreeElement, filePath: string): ComponentDefinition {
  const definitionNode = dom.childNodes.find(node => node.tagName === 'definition');
  const lang = definitionNode.attrs.find(att => att.name === 'lang') || {value: 'html'};
  const defaultDefinition: ComponentDefinition = {
    name: 'anonymous',
    path: filePath,
    props: []
  };
  let definition: ComponentDefinition;

  switch (lang.value) {
    case 'yaml' :
      definition = {
        ...defaultDefinition,
        ...loadDefinitionFromYaml(definitionNode)
      };
      break;
    case 'json' :
      definition = {
        ...defaultDefinition,
        ...loadDefinitionFromJson(definitionNode)
      };
      break;
    default :
      definition = {
        ...defaultDefinition,
        ...loadDefinitionFromHtml(definitionNode)
      };
      break;
  }

  return definition;
}

function loadDefinitionFromYaml(dom: TreeElement): ComponentDefinition {
  const content = removeTextOffset(dom.childNodes[0].value);

  return yaml.safeLoad(content);
}

function loadDefinitionFromHtml(dom: TreeElement): ComponentDefinition {
  const definition: ComponentDefinition = {
    props: []
  };

  dom.childNodes.forEach(({tagName, attrs}) => {
    if (tagName === 'meta') {
      const attributes = attrs.reduce<KeyValue>((result, att) => {
        result[att.name] = att.value;

        return result;
      }, {});

      switch (attributes.name) {
        case 'name' :
          definition.name = attributes.content;
          break;
        case 'prop' :
          definition.props.push({
            'name': attributes.content,
            'default': attributes.default
          });
          break;
        default :
          break;
      }
    }
  });

  return definition;
}

function loadDefinitionFromJson(dom: TreeElement): ComponentDefinition {
  return JSON.parse(dom.childNodes[0].value);
}
