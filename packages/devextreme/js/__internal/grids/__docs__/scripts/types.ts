export interface ClassRegistrationInfo {
  className: string;
  baseClass: string;
  mixins: string[];
  sourceFile: string;
  isExported: boolean;
  featureArea: string;
}

export interface ExtenderInfo {
  extenderName: string;
  pattern: 'mixin-function' | 'object';
}

export interface ModuleInfo {
  moduleName: string;
  registeredAs: string | null;
  sourceFile: string;
  featureArea: string;
  controllers: Record<string, ClassRegistrationInfo>;
  views: Record<string, ClassRegistrationInfo>;
  extenders: {
    controllers: Record<string, ExtenderInfo>;
    views: Record<string, ExtenderInfo>;
  };
  hasDefaultOptions: boolean;
}

export interface RuntimeDependency {
  from: string;
  fromModule: string;
  to: string;
  toType: 'controller' | 'view';
  via: 'getController' | 'getView';
  location: string;
}

export interface InheritanceEntry {
  class: string;
  chain: string[];
}

export interface ArchitectureData {
  generatedAt: string;
  sourceRoot: string;
  modules: ModuleInfo[];
  standaloneControllers: Record<string, ClassRegistrationInfo>;
  standaloneViews: Record<string, ClassRegistrationInfo>;
  runtimeDependencies: RuntimeDependency[];
  inheritanceChains: InheritanceEntry[];
}

interface ImportAlias {
  localName: string;
  originalName: string;
  fromPath: string;
}

export interface ParsedFile {
  filePath: string;
  relPath: string;
  modules: ModuleInfo[];
  classes: Map<string, { baseClass: string; mixins: string[]; isExported: boolean }>;
  runtimeDeps: RuntimeDependency[];
  localVars: Map<string, string>;
  importAliases: Map<string, ImportAlias>;
  importedNames: Map<string, string>;
}

export interface GlobalClassInfo {
  baseClass: string;
  mixins: string[];
  sourceFile: string;
  isExported: boolean;
}
