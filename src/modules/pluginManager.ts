import { AttributePlugin, PluginInfo, PluginsDefinition, TagPlugin, } from '../models/pluginsModel';
import { markdownPlugin, } from '../plugins/markdownPlugin';
import { stringInterpolerationPlugin, } from '../plugins/stringInterpolerationPlugin';
import { attributeInterpolerationPlugin, } from '../plugins/attributeInterpolerationPlugin';
import { componentPlugin, } from '../plugins/component/componentPlugin';
import { KeyValue, } from '../models/helperTypes';
import uuid from 'uuid';

export class PluginManager {
  private readonly secretKey = uuid.v4();
  private loadedPlugins: PluginsDefinition = {
    attributes: [],
    tags: {},
  };

  public addDefaultPlugins(): void {
    this.addTagPlugin('parse', markdownPlugin);
    this.addTagPlugin('#text', stringInterpolerationPlugin);
    this.addTagPlugin(this.secretKey, componentPlugin);

    this.addAttributePlugin(attributeInterpolerationPlugin);
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

  get tagPlugins(): KeyValue<PluginInfo<TagPlugin>[]> {
    return this.loadedPlugins.tags;
  }

  get attributePlugins(): PluginInfo<AttributePlugin>[] {
    return this.loadedPlugins.attributes;
  }
}
