import {TreeElement} from '../../models/treeElementModel';
import * as path from 'path';
import {loadComponent} from '../componentLoader/componentLoader';
import {domManager} from '../domHandler';
import {Scope} from '../../models/scopeModel';
import {KeyValue} from '../../models/helperTypes';

export async function HandleComponent(comp: TreeElement, scope: Scope): Promise<TreeElement> {
  const {path: compPath, ...attrs} = comp.attrs.reduce<KeyValue>((res, val) => {
    res[val.name] = val.value;

    return res;
  }, {});

  const filePath = path.resolve(path.dirname(scope.path), compPath);
  const newComp = await loadComponent(filePath);

  const defaultAttributes = newComp.definition.props.reduce<KeyValue>((result, prop) => {
    result[prop.name] = prop.default;

    return result;
  }, {});

  return domManager(newComp.slot, {
    path: newComp.definition.path,
    variables: {
      ...defaultAttributes,
      ...attrs
    },
    globalVariables: scope.globalVariables,
    useCssModules: false
  });
}
