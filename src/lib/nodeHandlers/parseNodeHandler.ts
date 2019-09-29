import * as path from 'path';
import marked from 'marked';
import parse5 from 'parse5';
import { TreeElement } from '../../models/treeElementModel';
import { ReadFile, RemoveTextOffset } from '../helpers';
import { Scope } from '../../models/scopeModel';
import { GenerateErrorNode } from '../errorGenerators';

export async function HandleParseNode(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  const lang = doc.attrs.find(l => l.name === 'lang') || { value: 'text' };
  const filePath = doc.attrs.find(l => l.name === 'path') || { value: '' };

  let content: string;

  try {
    if (filePath.value !== '') {
      const fileContents = await ReadFile(path.join(path.dirname(scope.path), filePath.value));
      content = fileContents.toString();
    } else {
      content = RemoveTextOffset(doc.childNodes[0].value);
    }

    let parseResult: string = '';

    switch (lang.value) {
      case 'md':
      case 'markdown':
        parseResult = marked.parse(content);
        break;
      default:
        break;
    }

    const fragment = parse5.parseFragment(`<rplc>${parseResult}</rplc>`) as TreeElement;

    return fragment.childNodes[0];
  } catch (e) {
    return GenerateErrorNode('Failed to parse content', scope.path, e);
  }
}
