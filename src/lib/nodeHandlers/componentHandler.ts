import { TreeElement } from '../../models/treeElementModel';
import * as path from 'path';
import { LoadComponent } from '../componentLoader';
import { domManager } from '../domHandler';
import { Scope } from '../../models/scopeModel';

export async function HandleComponent(comp: TreeElement, scope: Scope): Promise<TreeElement> {
  const { path: compPath, ...attrs } = comp.attrs.reduce<{[key: string]: string}>((res, val) => {
    res[val.name] = val.value;
    return res;
  }, {});

  const filePath = path.resolve(path.dirname(scope.path), compPath);
  const newComp = await LoadComponent(filePath);

  return domManager(newComp, {
    path: filePath,
    variables: attrs,
    useCssModules: false
  });
}
