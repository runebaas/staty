import uuid from 'uuid';
import { AttributePlugin, PluginInfo, PluginsDefinition, TagPlugin, ResolverPlugin, } from '../models/pluginsModel';
import { markdownParsePlugin, } from '../../plugins/markdownParsePlugin';
import { stringInterpolerationPlugin, } from '../../plugins/stringInterpolerationPlugin';
import { attributeInterpolerationPlugin, } from '../../plugins/attributeInterpolerationPlugin';
import { componentResolverPlugin, } from './componentResolver';
import { KeyValue, } from '../models/helperTypes';
import { statyResolverPlugin, } from '../../plugins/statyResolver/statyResolver';
import { markdownResolverPlugin, } from '../../plugins/markdownResolverPlugin';

export class PluginManager {
  private readonly secretKey = uuid.v4();
  private loadedPlugins: PluginsDefinition = {
    attributes: [],
    tags: {},
    resolvers: {},
  };

  public addDefaultPlugins(): void {
    this.addTagPlugin('parse', markdownParsePlugin);
    this.addTagPlugin('#text', stringInterpolerationPlugin);
    this.addTagPlugin(this.secretKey, componentResolverPlugin);

    this.addAttributePlugin(attributeInterpolerationPlugin);

    this.addResolverPlugin('staty', statyResolverPlugin);
    this.addResolverPlugin('md', markdownResolverPlugin);
  }

  public addTagPlugin(tag: string, plugin: PluginInfo<TagPlugin>): void {
    let pluginTag = tag;

    if (pluginTag === 'component') {
      throw new Error('You cannot add a plugin that affects the <component> tag');
    }

    if (pluginTag === this.secretKey) {
      pluginTag = 'component';
    }

    if (this.loadedPlugins.tags[pluginTag] === undefined) {
      this.loadedPlugins.tags[pluginTag] = [];
    }

    this.loadedPlugins.tags[pluginTag].push(plugin);
  }

  public addAttributePlugin(plugin: PluginInfo<AttributePlugin>): void {
    this.loadedPlugins.attributes.push(plugin);
  }

  public addResolverPlugin(fileExtension: string, plugin: PluginInfo<ResolverPlugin>): void {
    if (this.loadedPlugins.resolvers[fileExtension] !== undefined) {
      throw new Error(`A resolver for "${fileExtension}" has already been defined`);
    }

    this.loadedPlugins.resolvers[fileExtension] = plugin;
  }

  get tagPlugins(): KeyValue<PluginInfo<TagPlugin>[]> {
    return this.loadedPlugins.tags;
  }

  get attributePlugins(): PluginInfo<AttributePlugin>[] {
    return this.loadedPlugins.attributes;
  }

  get resolverPlugins(): KeyValue<PluginInfo<ResolverPlugin>> {
    return this.loadedPlugins.resolvers;
  }
}
