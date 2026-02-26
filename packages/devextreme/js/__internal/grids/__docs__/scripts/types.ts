/* eslint-disable spellcheck/spell-checker */
/**
 * Type definitions for Grid Core Architecture Documentation Generator.
 */

// ─── Class Registration ──────────────────────────────────────────────────────

/**
 * Information about a controller or view class registered within a module.
 */
export interface ClassRegistrationInfo {
  className: string;
  baseClass: string;
  mixins: string[];
  sourceFile: string;
  isExported: boolean;
}

// ─── Extenders ───────────────────────────────────────────────────────────────

export interface ExtenderInfo {
  extenderName: string;
  pattern: 'mixin-function' | 'object';
}

// ─── Module ──────────────────────────────────────────────────────────────────

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

// ─── Runtime Dependencies ────────────────────────────────────────────────────

export interface RuntimeDependency {
  from: string;
  fromModule: string;
  to: string;
  toType: 'controller' | 'view';
  via: 'getController' | 'getView';
  location: string;
}

// ─── Inheritance ─────────────────────────────────────────────────────────────

export interface InheritanceEntry {
  class: string;
  chain: string[];
}

// ─── Top-Level Output ────────────────────────────────────────────────────────

export interface ArchitectureData {
  generatedAt: string;
  sourceRoot: string;
  modules: ModuleInfo[];
  standaloneControllers: Record<string, ClassRegistrationInfo>;
  standaloneViews: Record<string, ClassRegistrationInfo>;
  runtimeDependencies: RuntimeDependency[];
  inheritanceChains: InheritanceEntry[];
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

export interface CliArgs {
  jsonOnly: boolean;
  htmlOnly: boolean;
}

// ─── Parser Internal Types ───────────────────────────────────────────────────

export interface ImportAlias {
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

// ─── Cytoscape ───────────────────────────────────────────────────────────────

export interface CytoscapeElement {
  group: 'nodes' | 'edges';
  data: Record<string, unknown>;
  classes?: string;
}

// ─── Externally Registered Class Info ────────────────────────────────────────

export interface ExternalClassInfo {
  role: 'controller' | 'view';
  registeredAs: string;
  featureArea: string;
}

// ─── Global Class Info (used in registry) ────────────────────────────────────

export interface GlobalClassInfo {
  baseClass: string;
  mixins: string[];
  sourceFile: string;
  isExported: boolean;
}
