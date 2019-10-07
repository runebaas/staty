import * as path from 'path';
import { PluginInfo, ResolverPlugin, TagPlugin, } from '../models/pluginsModel';
import { TreeElement, } from '../models/treeElementModel';
import { Scope, } from '../models/scopeModel';
import { KeyValue, } from '../models/helperTypes';
import { ElementManager, } from './elementManager';
import { PluginManager, } from './pluginManager';
import { ModuleManager, } from './moduleManager';

const getResolver = (filePath: string, moduleManager: ModuleManager): PluginInfo<ResolverPlugin> => {
  const fileExtension = path.extname(filePath);

  if (fileExtension === undefined) {
    throw new Error(`File "${filePath}" has no extension`);
  }

  const { resolverPlugins, } = moduleManager.tryGetModule<PluginManager>('pluginManager');
  const resolver = resolverPlugins[fileExtension.slice(1)];

  if (resolver === undefined) {
    throw new Error(`No resolver defined for file extension "${fileExtension}"`);
  }

  return resolver;
};

async function ComponentResolver(comp: TreeElement, scope: Scope): Promise<TreeElement> {
  const { path: compPath, ...attrs } = comp.attrs.reduce<KeyValue>((res, val) => {
    res[val.name] = val.value;

    return res;
  }, {});

  const filePath = path.resolve(path.dirname(scope.path), compPath);
  const resolver = getResolver(filePath, scope.moduleManager);

  const newComp = await resolver.func(filePath, scope);

  const defaultAttributes = newComp.definition.props !== undefined
    ? newComp.definition.props.reduce<KeyValue>((result, prop) => {
      result[prop.name] = prop.default;

      return result;
    }, {})
    : {};

  if (newComp.leaveUntouched) {
    return newComp.slot;
  }

  const elementManager = new ElementManager(newComp.slot, {
    ...scope,
    path: newComp.definition.path,
    variables: {
      ...defaultAttributes,
      ...attrs,
    },
    globalVariables: scope.globalVariables,
  });

  return elementManager.handleElement();
}

export const componentResolverPlugin: PluginInfo<TagPlugin> = {
  name: 'Component Resolver',
  func: ComponentResolver,
};
