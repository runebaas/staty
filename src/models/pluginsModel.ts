import { KeyValue, } from './helperTypes';
import { TreeElement, } from './treeElementModel';
import { Scope, } from './scopeModel';
import { Attribute as DomAttribute, } from 'parse5';

export interface PluginsDefinition {
  tags: KeyValue<PluginInfo<TagPlugin>[]>;
  attributes: PluginInfo<AttributePlugin>[];
}

export interface PluginInfo<T> {
  name: string;
  func: T;
}

export type TagPlugin = (doc: TreeElement, scope: Scope) => (TreeElement|Promise<TreeElement>)
export type AttributePlugin = (attributes: DomAttribute[], scope: Scope) => (DomAttribute[]|Promise<DomAttribute[]>)
