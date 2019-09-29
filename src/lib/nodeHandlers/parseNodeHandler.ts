import * as path from 'path';
import marked from 'marked';
import parse5 from 'parse5';
import { TreeElement } from '../../models/treeElementModel';
import { ReadFile } from '../helpers';
import { Scope } from '../../models/scopeModel';

export async function HandleParseNode(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  const lang = doc.attrs.find(l => l.name === 'lang') || { value: 'text' };
  const filePath = doc.attrs.find(l => l.name === 'path') || { value: '' };

  let content: string;

  if (filePath.value !== '') {
    const fileContents = await ReadFile(path.join(path.dirname(scope.path), filePath.value));
    content = fileContents.toString();
  } else {
    // this is just horrible, there needs to be something better than this...
    let contentStartsAt = -1;
    content = doc.childNodes[0].value
      .split('\n')
      .map(f => {
        if (contentStartsAt === -1) {
          if (f.length === 0) { return f; }
          contentStartsAt = f.match(/^(\s+)/gm)[0].length;
        }
        return f.slice(contentStartsAt);
      })
      .join('\n');
  }

  let parseResult: string = '';

  switch (lang.value) {
    case 'md':
    case 'markdown':
      parseResult = marked.parse(content, {});
      break;
    default:
      break;
  }

  const fragment = parse5.parseFragment(`<rplc>${parseResult}</rplc>`) as TreeElement;

  return fragment.childNodes[0];
}
