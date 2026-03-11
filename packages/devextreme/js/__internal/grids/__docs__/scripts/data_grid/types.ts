/* eslint-disable spellcheck/spell-checker */
import type { ModificationCategory } from './constants';

// ─── Parsed file data ────────────────────────────────────────────────────────

export interface ImportInfo {
  localName: string;
  originalName: string;
  fromPath: string;
  isFromGridCore: boolean;
}

export interface ClassInfo {
  className: string;
  baseClass: string;
  mixins: string[];
  sourceFile: string;
  isExported: boolean;
}

export interface RegisterModuleCall {
  moduleName: string;
  sourceFile: string;
  relPath: string;
  argIsIdentifier: boolean;
  argIdentifierName: string | null;
  spreadSources: string[];
  hasInlineControllers: boolean;
  hasInlineViews: boolean;
  hasInlineExtenders: boolean;
  hasDefaultOptions: boolean;
  referencesGridCoreModule: boolean;
  gridCoreRefs: string[];
  controllers: Record<string, ControllerViewRef>;
  views: Record<string, ControllerViewRef>;
  extenders: {
    controllers: Record<string, ExtenderRef>;
    views: Record<string, ExtenderRef>;
  };
}

export interface ControllerViewRef {
  regName: string;
  className: string;
  isImportedFromGridCore: boolean;
  isDefinedLocally: boolean;
  baseClass: string;
  mixins: string[];
  sourceFile: string;
}

export interface ExtenderRef {
  targetName: string;
  extenderName: string;
  isImportedFromGridCore: boolean;
  isDefinedLocally: boolean;
}

export interface DataSourceAdapterExtension {
  sourceFile: string;
  relPath: string;
  extenderName: string;
  isImportedFromGridCore: boolean;
  order: number;
}

export interface ParsedFile {
  filePath: string;
  relPath: string;
  registerModuleCalls: RegisterModuleCall[];
  dataSourceAdapterExtensions: DataSourceAdapterExtension[];
  classes: Map<string, ClassInfo>;
  imports: Map<string, ImportInfo>;
  localVars: Map<string, string>;
}

// ─── Resolved architecture data ──────────────────────────────────────────────

export interface ClassifiedModule {
  moduleName: string;
  category: ModificationCategory;
  sourceFile: string;
  relPath: string;
  featureArea: string;
  registrationOrder: number;

  gridCoreModuleName: string | null;
  gridCoreSourceModule: string | null;

  controllers: Record<string, ControllerViewRef>;
  views: Record<string, ControllerViewRef>;
  extenders: {
    controllers: Record<string, ExtenderRef>;
    views: Record<string, ExtenderRef>;
  };

  newControllers: string[];
  newViews: string[];
  overriddenControllers: string[];
  overriddenExtenderControllers: string[];
  overriddenExtenderViews: string[];
  hasDefaultOptionsOverride: boolean;

  details: string;
}

export interface ExtenderPipelineStep {
  moduleName: string;
  relPath: string;
  extenderName: string;
  isFromGridCore: boolean;
  registrationOrder: number;
}

export interface ExtenderPipeline {
  targetName: string;
  targetType: 'controller' | 'view';
  steps: ExtenderPipelineStep[];
}

export interface InheritanceEntry {
  className: string;
  chain: string[];
  sourceFile: string;
}

export interface CrossDependency {
  fromModule: string;
  fromRelPath: string;
  toRelPath: string;
  toModule: string | null;
  importedNames: string[];
  importPath: string;
  label: string;
}

export interface GridCoreModuleInfo {
  moduleName: string;
  registeredAs: string | null;
  sourceFile: string;
  featureArea: string;
  controllers: Record<string, {
    regName: string;
    className: string;
    baseClass: string;
    mixins: string[];
    sourceFile: string;
  }>;
  views: Record<string, {
    regName: string;
    className: string;
    baseClass: string;
    mixins: string[];
    sourceFile: string;
  }>;
  extenders: {
    controllers: Record<string, { extenderName: string; pattern: string }>;
    views: Record<string, { extenderName: string; pattern: string }>;
  };
  hasDefaultOptions: boolean;
}

export interface ArchitectureData {
  generatedAt: string;
  dataGridRoot: string;
  gridCoreRoot: string;
  modulesOrder: string[];
  modules: ClassifiedModule[];
  gridCoreModules: GridCoreModuleInfo[];
  extenderPipelines: ExtenderPipeline[];
  dataSourceAdapterChain: DataSourceAdapterExtension[];
  inheritanceChains: InheritanceEntry[];
  crossDependencies: CrossDependency[];
  summary: {
    total: number;
    passthrough: number;
    extended: number;
    replaced: number;
    new: number;
  };
}
