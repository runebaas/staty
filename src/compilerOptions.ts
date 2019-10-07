import { KeyValue, } from './core/models/helperTypes';

export function checkCompilerOptions(options: CompilerOptions = {}): CompilerOptions {
  const defaultOptions: CompilerOptions = {
    globalVariables: {},
    outputFormatting: {
      endWithNewLine: true,
      indentBodyInnerHtml: true,
      indentSize: 2,
      preserveNewlines: false,
    },
  };

  return {
    globalVariables: {
      ...defaultOptions.globalVariables,
      ...(options.globalVariables ? options.globalVariables : {}),
    },
    outputFormatting: {
      ...defaultOptions.outputFormatting,
      ...(options.outputFormatting ? options.outputFormatting : {}),
    },
  };
}

export interface CompilerOptions {
  globalVariables?: KeyValue;
  outputFormatting?: CompilerOptionOutputFormatting;
}

interface CompilerOptionOutputFormatting {
  endWithNewLine?: boolean;
  indentBodyInnerHtml?: boolean;
  indentSize?: number;
  preserveNewlines?: boolean;
}
