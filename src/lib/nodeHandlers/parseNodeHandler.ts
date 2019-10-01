import * as path from 'path';
import marked from 'marked';
import parse5 from 'parse5';
import {TreeElement} from '../../models/treeElementModel';
import {readFile, removeTextOffset} from '../helpers';
import {Scope} from '../../models/scopeModel';
import {generateErrorNode} from '../errorGenerators';
import highlight from 'highlight.js';

export async function HandleParseNode(doc: TreeElement, scope: Scope): Promise<TreeElement> {
  const lang = doc.attrs.find(att => att.name === 'lang') || {value: 'text'};
  const filePath = doc.attrs.find(att => att.name === 'path') || {value: ''};

  let content: string;

  try {
    if (filePath.value !== '') {
      const fileContents = await readFile(path.join(path.dirname(scope.path), filePath.value));
      content = fileContents.toString();
    } else {
      content = removeTextOffset(doc.childNodes[0].value);
    }

    let parseResult: string = '';

    switch (lang.value) {
      case 'md' :
      case 'markdown' :
        parseResult = marked.parse(content, {highlight: (code: string, language: string): string => highlight.highlight(language, code).value});
        break;
      default :
        break;
    }

    const fragment = parse5.parseFragment(`<rplc>${parseResult}</rplc>`) as TreeElement;

    return fragment.childNodes[0];
  } catch (error) {
    return generateErrorNode('Failed to parse content', scope.path, error);
  }
}
