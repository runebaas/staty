import { TreeElement } from '../../models/treeElementModel';
import { Scope } from '../../models/scopeModel';
import { HandleText } from './textHandler';
import { HandleComponent } from './componentHandler';
import { HandleParseNode } from './parseNodeHandler';

export const nodeHandlerFunctions: {[tagName: string]: (doc: TreeElement, scope: Scope) => (TreeElement|Promise<TreeElement>)} = {
  '#text': HandleText,
  'component': HandleComponent,
  'parse': HandleParseNode
};
