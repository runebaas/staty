import { KeyValue, } from './helperTypes';
import { ModuleManager, } from '../modules/moduleManager';

export interface Scope {
  variables: KeyValue;
  globalVariables: KeyValue;
  path: string;
  moduleManager: ModuleManager;
}
