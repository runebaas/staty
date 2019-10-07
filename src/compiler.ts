import * as path from 'path';
import * as parse5 from 'parse5';
import { html_beautify as htmlBeautify, } from 'js-beautify';
import { readFile, } from './core/lib/helpers';
import { TreeElement, } from './core/models/treeElementModel';
import { CompilerOptions, checkCompilerOptions, } from './compilerOptions';
import { ModuleManager, } from './core/modules/moduleManager';
import { ElementManager, } from './core/modules/elementManager';

export class Compiler {
  private readonly options: CompilerOptions;
  private readonly moduleManager: ModuleManager;

  constructor(options: CompilerOptions, moduleManager: ModuleManager) {
    this.moduleManager = moduleManager;
    this.options = checkCompilerOptions(options);
  }

  public async compile(filePath: string): Promise<string> {
    const resolvedPath = path.resolve(filePath);
    const root = await readFile(resolvedPath);

    const dom = parse5.parse(root.toString()) as TreeElement;

    const elementManager = new ElementManager(dom, {
      path: resolvedPath,
      variables: {},
      globalVariables: this.options.globalVariables,
      moduleManager: this.moduleManager,
    });

    const result = await elementManager.handleElement();

    const html = parse5.serialize(result);

    return this.beautifyOutput(html);
  }

  private beautifyOutput(html: string): string {
    return htmlBeautify(html, {
      /* eslint-disable camelcase,@typescript-eslint/camelcase */
      end_with_newline: this.options.outputFormatting.endWithNewLine,
      indent_body_inner_html: this.options.outputFormatting.indentBodyInnerHtml,
      indent_size: this.options.outputFormatting.indentSize,
      preserve_newlines: this.options.outputFormatting.preserveNewlines,
      /* eslint-enable camelcase,@typescript-eslint/camelcase */
    });
  }
}
