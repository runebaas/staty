import { KeyValue, } from '../models/helperTypes';

export class ModuleManager {
  private readonly modules: KeyValue<unknown> = {};

  constructor(modules: KeyValue<unknown>) {
    this.modules = modules;
  }

  public tryGetModule<T>(moduleName: string): T {
    if (this.modules[moduleName] === undefined) {
      throw new Error(`Module with name "${moduleName}" doesn't exist`);
    }

    return this.modules[moduleName] as T;
  }
}
