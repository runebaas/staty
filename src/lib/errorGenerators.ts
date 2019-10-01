import {TreeElement} from '../models/treeElementModel';

export function generateErrorNode(message: string, filePath: string, error: Error): TreeElement {
  const errorMessage = `--- ERROR | ${message} | ${filePath} | ${error.message} ---`;

  return {
    nodeName: 'div',
    tagName: 'error',
    attrs: [],
    childNodes: [{
      nodeName: '#text',
      value: errorMessage
    }]
  };
}
