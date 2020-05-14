interface MetaItem {
  Key?: string;
  Name?: string;
  Value?: string;
  Type?: string;
  TypeValues?: string;
  Path?: string;
  [key: string]: string;
}

interface ConfigMetaItem {
  key: string;
  value: string;
}

interface LessCompilerInterface {
  render: Function;
}

interface ConfigSettings {
  themeName?: string;
  colorScheme?: string;
  makeSwatch?: boolean;
  outColorScheme?: string;
  assetsBasePath?: string;
  base?: boolean;
  items?: Array<ConfigMetaItem>;
  data?: string;
  widgets?: Array<string>;

  fileFormat?: string;
  baseTheme?: string;
  themeId?: string | number;

  isBootstrap?: boolean;
  bootstrapVersion?: number;

  outputFile?: string;
  outputColorScheme?: string;
  outputFormat?: string;

  command?: string;
  inputFile?: string;
  lessPath?: string;
  scssPath?: string;
  out?: string; // TODO need?

  reader?: Function; // TODO need?
  lessCompiler?: LessCompilerInterface; // TODO need?
}

interface CompilerResult {
  result: import('node-sass').Result;
  changedVariables: Array<MetaItem>;
}

interface PackageResult {
  css: string;
  compiledMetadata: Array<MetaItem>;
}

interface Metadata {
  metadata: Array<MetaItem>;
  version: string;
}

interface FileInfo {
  path: string;
  content: string;
}
