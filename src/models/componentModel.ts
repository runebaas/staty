export interface Component {
  path: string;
  propData: {[name: string]: string };
  definition: ComponentDefinition;
  document: CheerioStatic;
}

export interface ComponentDefinition {
  name: string;
  props: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  default: string;
}
