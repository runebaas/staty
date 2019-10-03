import { TreeElement, } from './treeElementModel';

export interface Component {
  definition: ComponentDefinition;
  slot: TreeElement;
}

export interface ComponentDefinition {
  name?: string;
  path?: string;
  props?: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  default: string;
}
