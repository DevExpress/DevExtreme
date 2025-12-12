export type Framework = 'react' | 'vue';
export type QuoteStyle = 'single' | 'double';

export interface ComponentGeneratorTplConfig {
  createComponentFn?: {
    name: string;
    path: string;
  };
  prepareComponentConfigFn?: {
    name: string;
    path: string;
  };
  prepareExtensionComponentConfigFn?: {
    name: string;
    path: string;
  };
  prepareConfigurationComponentConfigFn?: {
    name: string;
    path: string;
  };
}

export interface GenerateReactComponentsExecutorSchema {
  metadataPath: string;
  framework?: Framework;
  generatorConfig?: string;
  componentsDir?: string;
  indexFileName?: string;
  baseComponent?: string;
  extensionComponent?: string;
  configComponent?: string;
  quotes?: QuoteStyle;
  explicitIndexInImports?: boolean;
  componentGeneratorTplConfig?: ComponentGeneratorTplConfig;
}
