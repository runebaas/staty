import {TreeElement} from '../../../models/treeElementModel';
import {ComponentDefinition} from '../../../models/componentModel';

export function loadDefinitionFromJson(dom: TreeElement): ComponentDefinition {
  return JSON.parse(dom.childNodes[0].value);
}
