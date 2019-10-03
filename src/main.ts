import { Compiler, } from './compiler';
import { PluginManager, } from './modules/pluginManager';
import { CompilerOptions, } from './compilerOptions';
import { ModuleManager, } from './modules/moduleManager';
import { ErrorManager, } from './modules/errorManager';

export class Staty {
  private readonly options: StatyOptions;
  private moduleManager: ModuleManager;

  constructor(options: StatyOptions) {
    this.options = options;
    this.initModules();
  }

  private initModules(): void {
    const pluginManager = new PluginManager();
    pluginManager.addDefaultPlugins();

    const errorManager = new ErrorManager();

    this.moduleManager = new ModuleManager({
      pluginManager,
      errorManager,
    });
  }

  public compile(filePath: string): Promise<string> {
    const compiler = new Compiler(this.options.compiler, this.moduleManager);

    return compiler.compile(filePath);
  }
}

export interface StatyOptions {
  compiler?: CompilerOptions;
}
