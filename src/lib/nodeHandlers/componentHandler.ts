import { TreeElement } from '../../models/treeElementModel';
import * as path from 'path';
import { LoadComponent } from '../componentLoader/componentLoader';
import { domManager } from '../domHandler';
import { Scope } from '../../models/scopeModel';

export async function HandleComponent(comp: TreeElement, scope: Scope): Promise<TreeElement> {
  const { path: compPath, ...attrs } = comp.attrs.reduce<{[key: string]: string}>((res, val) => {
    res[val.name] = val.value;
    return res;
  }, {});

  const filePath = path.resolve(path.dirname(scope.path), compPath);
  const newComp = await LoadComponent(filePath);

  const defaultAttributes = newComp.definition.props.reduce<{[key: string]: string}>((result, prop) => {
    result[prop.name] = prop.default;
    return result;
  }, {});

  return domManager(newComp.slot, {
    path: newComp.definition.path,
    variables: {
      ...defaultAttributes,
      ...attrs
    },
    useCssModules: false
  });
}
