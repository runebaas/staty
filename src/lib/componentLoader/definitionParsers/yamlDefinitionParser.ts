import {TreeElement} from '../../../models/treeElementModel';
import {ComponentDefinition} from '../../../models/componentModel';
import {removeTextOffset} from '../../helpers';
import yaml from 'js-yaml';

export function loadDefinitionFromYaml(dom: TreeElement): ComponentDefinition {
  const content = removeTextOffset(dom.childNodes[0].value);

  return yaml.safeLoad(content);
}
