/* eslint-disable spellcheck/spell-checker */
import type { ModificationCategory } from './constants';

export interface ImportInfo {
  localName: string;
  originalName: string;
  fromPath: string;
  isFromGridCore: boolean;
}

export interface DataGridClassInfo {
  className: string;
  baseClass: string;
  mixins: string[];
  sourceFile: string;
  isExported: boolean;
  isDefinedInDataGrid: boolean;
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
  controllers: Record<string, DataGridClassRef>;
  views: Record<string, DataGridClassRef>;
  extenders: {
    controllers: Record<string, ExtenderRef>;
    views: Record<string, ExtenderRef>;
  };
}

export interface DataGridClassRef {
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

export interface DataGridParsedFile {
  filePath: string;
  relPath: string;
  registerModuleCalls: RegisterModuleCall[];
  dataSourceAdapterExtensions: DataSourceAdapterExtension[];
  classes: Map<string, DataGridClassInfo>;
  imports: Map<string, ImportInfo>;
  localVars: Map<string, string>;
}

export interface ClassifiedModule {
  moduleName: string;
  category: ModificationCategory;
  sourceFile: string;
  relPath: string;
  featureArea: string;
  registrationOrder: number;

  gridCoreModuleName: string | null;
  gridCoreSourceModule: string | null;

  controllers: Record<string, DataGridClassRef>;
  views: Record<string, DataGridClassRef>;
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

export interface InheritanceEntry {
  className: string;
  chain: string[];
  sourceFile: string;
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

export interface GridCoreControllerOrView {
  regName: string;
  className: string;
  baseClass: string;
  mixins: string[];
  sourceFile: string;
}

export interface GridCoreExtenderInfo {
  extenderName: string;
  pattern: 'mixin-function' | 'object';
}

export interface GridCoreModuleInfo {
  moduleName: string;
  registeredAs: string | null;
  sourceFile: string;
  featureArea: string;
  controllers: Record<string, GridCoreControllerOrView>;
  views: Record<string, GridCoreControllerOrView>;
  extenders: {
    controllers: Record<string, GridCoreExtenderInfo>;
    views: Record<string, GridCoreExtenderInfo>;
  };
  hasDefaultOptions: boolean;
}

export interface DataGridArchitectureData {
  generatedAt: string;
  dataGridRoot: string;
  gridCoreRoot: string;
  modulesOrder: string[];
  modules: ClassifiedModule[];
  gridCoreModules: GridCoreModuleInfo[];
  extenderPipelines: ExtenderPipeline[];
  dataSourceAdapterChain: DataSourceAdapterExtension[];
  inheritanceChains: InheritanceEntry[];
  summary: {
    total: number;
    passthrough: number;
    extended: number;
    replaced: number;
    new: number;
  };
}
