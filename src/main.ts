import { Compiler, } from './compiler';
import { PluginManager, } from './core/modules/pluginManager';
import { CompilerOptions, } from './compilerOptions';
import { ModuleManager, } from './core/modules/moduleManager';
import { MessageManager, } from './core/modules/messageManager';

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

    const messageManager = new MessageManager();

    this.moduleManager = new ModuleManager({
      pluginManager,
      messageManager,
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
