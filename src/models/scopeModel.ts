import {KeyValue} from './helperTypes';

export interface Scope {
  variables: KeyValue;
  globalVariables: KeyValue;
  path: string;
  useCssModules: boolean;
}
