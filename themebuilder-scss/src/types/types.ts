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
  noClean?: boolean;

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
  out?: string;
}

interface CompilerResult {
  result: import('node-sass').Result;
  changedVariables: Array<MetaItem>;
}

interface PackageResult {
  css: string;
  compiledMetadata: Array<MetaItem>;
  widgets: Array<string>;
  unusedWidgets: Array<string>;
  swatchSelector: string;
  version?: string;
}

interface Metadata {
  metadata: Array<MetaItem>;
  version: string;
}

interface FileInfo {
  path: string;
  content: string;
}

interface WidgetItem {
  widgetName: string;
  widgetImportString: string;
}

interface WidgetHandlerResult {
  widgets: Array<string>;
  unusedWidgets: Array<string>;
  indexContent: string;
}

interface SwatchSass {
  sass: string;
  selector: string;
}
