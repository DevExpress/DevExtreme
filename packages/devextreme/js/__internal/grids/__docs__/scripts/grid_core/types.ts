import type { BaseClassInfo, HeritageInfo, InheritanceEntry } from '../shared/types';

export type { InheritanceEntry };

export interface ClassRegistrationInfo extends BaseClassInfo {
  featureArea: string;
}

export interface ExtenderInfo {
  extenderName: string;
  pattern: 'mixin-function' | 'object';
  /** Name of the class expression the mixin returns, e.g. StateStoringDataExtender. */
  extenderClass?: string;
  /** Path (relative to grid_core) of the file the extender is defined in. */
  sourceFile?: string;
}

export type ExtenderKind = 'controllers' | 'views';

/** Identifies a single extender node: a module's extender for one target. */
export interface ExtenderRef {
  module: string;
  kind: ExtenderKind;
  target: string;
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
  /** Owner of the call site: `class:<ClassName>` or `ext:<relPath>#<varName>`. */
  fromRef: string;
  /** Set when the call site is inside an extender registered by a module. */
  fromExtender?: ExtenderRef;
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

/** A `const foo = (Base) => class Bar extends Base {}` declaration. */
export interface ExtenderDefinition {
  varName: string;
  /** Name of the returned class expression, empty for anonymous ones. */
  className: string;
}

export interface ParsedFile {
  filePath: string;
  relPath: string;
  modules: ModuleInfo[];
  classes: Map<string, HeritageInfo & { isExported: boolean }>;
  runtimeDeps: RuntimeDependency[];
  localVars: Map<string, string>;
  importAliases: Map<string, ImportAlias>;
  importedNames: Map<string, string>;
  /** Extender mixins defined in this file, keyed by variable name. */
  extenderDefs: Map<string, ExtenderDefinition>;
  /** Module specifier every imported name came from, keyed by local name. */
  importSources: Map<string, string>;
}

export interface GlobalClassInfo extends BaseClassInfo {}
