import yaml from 'js-yaml';
import { TreeElement, } from '../../../core/models/treeElementModel';
import { ComponentDefinition, } from '../../../core/models/componentModel';
import { removeTextOffset, } from '../../../core/lib/helpers';

export function loadDefinitionFromYaml(dom: TreeElement): ComponentDefinition {
  const content = removeTextOffset(dom.childNodes[0].value);

  return yaml.safeLoad(content);
}
