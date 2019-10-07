import { TreeElement, } from '../../../models/treeElementModel';
import { ComponentDefinition, } from '../../../models/componentModel';
import { KeyValue, } from '../../../models/helperTypes';

export function loadDefinitionFromHtml(dom: TreeElement): ComponentDefinition {
  const definition: ComponentDefinition = {
    props: [],
  };

  dom.childNodes.forEach(({ tagName, attrs, }) => {
    if (tagName === 'meta') {
      const attributes = attrs.reduce<KeyValue>((result, att) => {
        result[att.name] = att.value;

        return result;
      }, {});

      switch (attributes.name) {
        case 'name' :
          definition.name = attributes.content;
          break;
        case 'prop' :
          definition.props.push({
            'name': attributes.content,
            'default': attributes.default,
          });
          break;
        default :
          break;
      }
    }
  });

  return definition;
}
