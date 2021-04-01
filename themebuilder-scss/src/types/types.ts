export interface MetaItem {
  Key?: string;
  Name?: string;
  Value?: string;
  Type?: string;
  TypeValues?: string;
  [key: string]: string;
}

export interface ThemesMetadata {
  generic: MetaItem[];
  material: MetaItem[];
}

export interface ConfigMetaItem {
  key: string;
  value: string;
}

export interface LessCompilerInterface {
  render: Function;
}

export interface ConfigSettings {
  themeName?: string;
  colorScheme?: string;
  makeSwatch?: boolean;
  outColorScheme?: string;
  assetsBasePath?: string;
  base?: boolean;
  items?: ConfigMetaItem[];
  data?: string;
  widgets?: string[];
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

export interface CompilerResult {
  result: import('node-sass').Result;
  changedVariables: { [key: string]: string };
}

export interface PackageResult {
  css: string;
  compiledMetadata: { [key: string]: string };
  widgets: string[];
  unusedWidgets: string[];
  swatchSelector: string;
  version?: string;
}

export interface Metadata {
  metadata: ThemesMetadata;
  version: string;
}

export interface FileInfo {
  path: string;
  content: string;
}

export interface WidgetItem {
  widgetName: string;
  widgetImportString: string;
}

export interface WidgetHandlerResult {
  widgets: string[];
  unusedWidgets: string[];
  indexContent: string;
}

export interface SwatchSass {
  sass: string;
  selector: string;
}

export interface ScriptsDependencyTree {
  widget: string;
  dependencies: { [key: string]: ScriptsDependencyTree };
}

export interface ScriptsDependencyCache {
  [key: string]: ScriptsDependencyTree;
}

export interface FlatStylesDependencies {
  [key: string]: string[];
}

export interface AstComment {
  value: string;
}

export interface SyntaxTree {
  comments?: AstComment[];
}

export interface DartCompilerConfig {
  data: string;
  file: string;
  index: string;
  items: ConfigMetaItem[];
}

export interface DartCompilerKeepAliveConfig {
  keepAlive: boolean;
}

export interface DartCompilerResult {
  changedVariables?: { [key: string]: string };
  css?: string;
  error?: string;
}

export interface SocketEventListener {
  name: string;
  handler: (e?: Error) => void;
}
