import { KeyValue, } from '../models/helperTypes';

export class ModuleManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly modules: KeyValue<any> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(modules: KeyValue<any>) {
    this.modules = modules;
  }

  public tryGetModule<T>(moduleName: string): T {
    if (this.modules[moduleName] === undefined) {
      throw new Error(`Module with name "${moduleName}" doesn't exist`);
    }

    return this.modules[moduleName] as T;
  }
}
