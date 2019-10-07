import { Attribute, } from 'parse5';
import { Scope, } from '../core/models/scopeModel';
import { AttributePlugin, PluginInfo, } from '../core/models/pluginsModel';

function attributeVariableNotFound(scope: Scope, attr: Attribute): string {
  console.info(scope.path, 'Unable to replace prop', attr);

  return '';
}

function substituteAttributes(attributes: (Attribute[]|undefined), scope: Scope): Attribute[] {
  if (attributes === undefined || attributes.length === 0) { return attributes || []; }

  return attributes.map(attr => {
    if (attr.name.startsWith(':')) {
      attr.name = attr.name.slice(1);
      attr.value = scope.variables[attr.value] || scope.globalVariables[attr.value] || attributeVariableNotFound(scope, attr);
    }

    return attr;
  });
}

export const attributeInterpolerationPlugin: PluginInfo<AttributePlugin> = {
  name: 'AttributeInterpoleration',
  func: substituteAttributes,
};
