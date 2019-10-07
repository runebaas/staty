import { Attribute as DomAttribute, } from 'parse5';
import { KeyValue, } from './helperTypes';
import { TreeElement, } from './treeElementModel';
import { Scope, } from './scopeModel';
import { Component, } from './componentModel';

export interface PluginsDefinition {
  tags: KeyValue<PluginInfo<TagPlugin>[]>;
  attributes: PluginInfo<AttributePlugin>[];
  resolvers: KeyValue<PluginInfo<ResolverPlugin>>;
}

export interface PluginInfo<T> {
  name: string;
  func: T;
}

export type TagPlugin = (doc: TreeElement, scope: Scope) => (TreeElement|Promise<TreeElement>)
export type ResolverPlugin = (filePath: string, scope: Scope) => (Component|Promise<Component>)
export type AttributePlugin = (attributes: DomAttribute[], scope: Scope) => (DomAttribute[]|Promise<DomAttribute[]>)
