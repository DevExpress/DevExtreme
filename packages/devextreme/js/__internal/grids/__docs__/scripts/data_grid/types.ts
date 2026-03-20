import type { BaseClassInfo, HeritageInfo, InheritanceEntry as SharedInheritanceEntry } from '../shared/types';
import type { ModificationCategory } from './constants';

// ─── Parsed file data ────────────────────────────────────────────────────────

export interface ImportInfo {
  localName: string;
  originalName: string;
  fromPath: string;
  isFromGridCore: boolean;
}

export interface ClassInfo extends BaseClassInfo {}

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
  /** When controllers is a property access like `someModule.controllers` from gc */
  forwardedControllersRef: string | null;
  /** When views is a property access like `someModule.views` from gc */
  forwardedViewsRef: string | null;
}

export interface ControllerViewRef extends HeritageInfo {
  regName: string;
  className: string;
  isImportedFromGridCore: boolean;
  isDefinedLocally: boolean;
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

  hasDefaultOptionsOverride: boolean;
}

export interface ExtenderPipelineStep {
  moduleName: string;
  relPath: string;
  extenderName: string;
  isFromGridCore: boolean;
  registrationOrder: number;
  category: ModificationCategory;
}

export interface ExtenderPipeline {
  targetName: string;
  targetType: 'controller' | 'view';
  steps: ExtenderPipelineStep[];
}

export interface InheritanceEntry extends SharedInheritanceEntry {
  sourceFile: string;
}

export interface CrossDependency {
  fromModule: string;
  fromRelPath: string;
  toRelPath: string;
  toModule: string | null;
  importedNames: string[];
  importPath: string;
}

/** Controller/view entry as serialized in the grid_core JSON output. */
export interface GridCoreControllerViewInfo extends HeritageInfo {
  regName: string;
  className: string;
  sourceFile: string;
}

export interface GridCoreModuleInfo {
  moduleName: string;
  registeredAs: string | null;
  sourceFile: string;
  featureArea: string;
  controllers: Record<string, GridCoreControllerViewInfo>;
  views: Record<string, GridCoreControllerViewInfo>;
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
  summary: Record<ModificationCategory, number> & { total: number };
}
