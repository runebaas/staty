import { TreeElement, } from '../../../core/models/treeElementModel';
import { ComponentDefinition, } from '../../../core/models/componentModel';

export function loadDefinitionFromJson(dom: TreeElement): ComponentDefinition {
  return JSON.parse(dom.childNodes[0].value);
}
