import { ReadFile } from './lib/helpers';
import * as path from 'path';
import * as parse5 from 'parse5';
import { domManager } from './lib/domHandler';
import { TreeElement } from './models/treeElementModel';
import { html_beautify } from 'js-beautify';
import { KeyValue } from './models/helperTypes';

export async function compile(rootPath: string, userOptions?: CompilerOptions): Promise<string> {
  const options = checkOptions(userOptions);

  const resolvedPath = path.resolve(rootPath);
  const root = await ReadFile(resolvedPath);

  const dom = parse5.parse(root.toString()) as TreeElement;

  const result = await domManager(dom, {
    path: resolvedPath,
    useCssModules: false,
    variables: {},
    globalVariables: options.globalVariables
  });

  const html = parse5.serialize(result);
  return html_beautify(html, {
    end_with_newline: options.outputFormatting.endWithNewLine,
    indent_body_inner_html: options.outputFormatting.indentBodyInnerHtml,
    indent_size: options.outputFormatting.indentSize,
    preserve_newlines: options.outputFormatting.preserveNewlines
  });
}

function checkOptions(options: CompilerOptions = {}): CompilerOptions {
  const defaultOptions: CompilerOptions = {
    globalVariables: {},
    outputFormatting: {
      endWithNewLine: true,
      indentBodyInnerHtml: true,
      indentSize: 2,
      preserveNewlines: false
    }
  };

  return {
    globalVariables: {
      ...defaultOptions.globalVariables,
      ...(options.globalVariables ? options.globalVariables : {})
    },
    outputFormatting: {
      ...defaultOptions.outputFormatting,
      ...(options.outputFormatting ? options.outputFormatting : {})
    }
  };
}

export interface CompilerOptions {
  globalVariables?: KeyValue,
  outputFormatting?: CompilerOptionOutputFormatting
}

interface CompilerOptionOutputFormatting {
  endWithNewLine?: boolean;
  indentBodyInnerHtml?: boolean;
  indentSize?: number
  preserveNewlines?: boolean;
}
