import {TreeElement} from '../../models/treeElementModel';
import {ComponentDefinition} from '../../models/componentModel';
import {loadDefinitionFromHtml} from './definitionParsers/htmlDefinitionParser';
import {loadDefinitionFromJson} from './definitionParsers/jsonDefinitionParser';
import {loadDefinitionFromYaml} from './definitionParsers/yamlDefinitionParser';

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
