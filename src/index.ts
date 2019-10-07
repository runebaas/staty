import { Compiler, } from './core/compiler';
import { CompilerOptions, } from './core/compilerOptions';
import { PluginManager, } from './core/modules/pluginManager';
import { ModuleManager, } from './core/modules/moduleManager';
import { MessageManager, } from './core/modules/messageManager';

// eslint-disable-next-line import/no-default-export
export default class {
  private readonly options: StatyOptions;
  private readonly moduleManager: ModuleManager;
  private readonly pluginManager: PluginManager;
  public readonly messages: MessageManager;

  constructor(options: StatyOptions = {}) {
    this.options = options;

    this.pluginManager = new PluginManager();
    this.pluginManager.addDefaultPlugins();

    this.messages = new MessageManager();

    this.moduleManager = new ModuleManager({
      pluginManager: this.pluginManager,
      messageManager: this.messages,
    });
  }

  public compile(filePath: string): Promise<string> {
    const compiler = new Compiler(this.options.compiler, this.moduleManager);

    return compiler.compile(filePath);
  }

  public addPlugin(pluginFunc: (pluginManager: PluginManager) => void): void {
    pluginFunc(this.pluginManager);
  }
}

export interface StatyOptions {
  compiler?: CompilerOptions;
}
