import {Attribute, ElementLocation} from 'parse5';

export interface TreeElement {
  nodeName: string;
  tagName?: string;
  attrs?: Attribute[];
  sourceCodeLocation?: ElementLocation;
  value?: string;
  childNodes?: TreeElement[];
  parentNode?: TreeElement;
}
