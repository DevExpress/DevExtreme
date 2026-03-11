/* eslint-disable spellcheck/spell-checker,max-depth */
import type { ModificationCategory } from './constants';
import { getFeatureAreaFromPath } from './constants';
import type {
  ClassifiedModule,
  CrossDependency,
  DataGridParsedFile,
  DataSourceAdapterExtension,
  ExtenderPipeline,
  ExtenderPipelineStep,
  InheritanceEntry,
  RegisterModuleCall,
} from './types';

// ─── Module Classification ───────────────────────────────────────────────────

function hasLocallyDefinedExtenders(
  reg: RegisterModuleCall,
  parsedFile: DataGridParsedFile,
): boolean {
  const allExtenders = [
    ...Object.values(reg.extenders.controllers),
    ...Object.values(reg.extenders.views),
  ];

  return allExtenders.some((ext) => {
    if (ext.isDefinedLocally) return true;
    if (ext.isImportedFromGridCore) return false;

    // Local variable (arrow-function extender) or local class
    return parsedFile.localVars.has(ext.extenderName)
      || parsedFile.classes.has(ext.extenderName);
  });
}

function classifyModule(
  reg: RegisterModuleCall,
  parsedFile: DataGridParsedFile,
): ModificationCategory {
  // If the module doesn't reference any grid_core module at all → new
  if (!reg.referencesGridCoreModule) {
    return 'new';
  }

  // Pattern 1: direct identifier reference → passthrough
  // e.g. gridCore.registerModule('sorting', sortingModule)
  if (reg.argIsIdentifier) {
    return 'passthrough';
  }

  // Pattern 2: object literal with spread of grid_core module
  const hasGridCoreSpreads = reg.spreadSources.some((src) => {
    const importInfo = parsedFile.imports.get(src);
    return importInfo?.isFromGridCore ?? false;
  });

  if (hasGridCoreSpreads) {
    // Spread + locally defined extenders → extended
    if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
      return 'extended';
    }
    // Spread but no local modifications → passthrough
    return 'passthrough';
  }

  // Pattern 3: object literal with inline controllers/views
  if (reg.hasInlineControllers || reg.hasInlineViews) {
    const hasLocalControllers = Object.values(reg.controllers).some((c) => c.isDefinedLocally);
    const hasLocalViews = Object.values(reg.views).some((v) => v.isDefinedLocally);

    if (hasLocalControllers || hasLocalViews) {
      return 'replaced';
    }

    // All controllers/views are from grid_core (reassembled module)
    if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
      return 'extended';
    }
    return 'passthrough';
  }

  // Pattern 4: only defaultOptions override with forwarded controllers → replaced
  if (reg.hasDefaultOptions) {
    return 'replaced';
  }

  // Pattern 5: extenders modifying grid_core module → extended
  if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
    return 'extended';
  }

  return 'passthrough';
}

// ─── Module Details ──────────────────────────────────────────────────────────

function buildDetails(
  category: ModificationCategory,
  reg: RegisterModuleCall,
): string {
  switch (category) {
    case 'passthrough':
      return 'Re-registers grid_core module as-is';

    case 'replaced': {
      const replaced: string[] = [];
      for (const [name, ref] of Object.entries(reg.controllers)) {
        if (ref.isDefinedLocally) {
          replaced.push(`controller '${name}' → ${ref.className} extends ${ref.baseClass}`);
        }
      }
      for (const [name, ref] of Object.entries(reg.views)) {
        if (ref.isDefinedLocally) {
          replaced.push(`view '${name}' → ${ref.className} extends ${ref.baseClass}`);
        }
      }
      if (reg.hasDefaultOptions) {
        replaced.push('defaultOptions overridden');
      }
      return replaced.join('; ') || 'Controller/view replacement';
    }

    case 'extended': {
      const exts: string[] = [];
      for (const [target, ext] of Object.entries(reg.extenders.controllers)) {
        if (!ext.isImportedFromGridCore) {
          exts.push(`extends controller '${target}' via ${ext.extenderName}`);
        }
      }
      for (const [target, ext] of Object.entries(reg.extenders.views)) {
        if (!ext.isImportedFromGridCore) {
          exts.push(`extends view '${target}' via ${ext.extenderName}`);
        }
      }
      return exts.join('; ') || 'Extends grid_core module with new extenders';
    }

    case 'new': {
      const parts: string[] = [];
      for (const [name, ref] of Object.entries(reg.controllers)) {
        parts.push(`new controller '${name}': ${ref.className}`);
      }
      for (const [name, ref] of Object.entries(reg.views)) {
        parts.push(`new view '${name}': ${ref.className}`);
      }
      for (const [target] of Object.entries(reg.extenders.controllers)) {
        parts.push(`extends controller '${target}'`);
      }
      for (const [target] of Object.entries(reg.extenders.views)) {
        parts.push(`extends view '${target}'`);
      }
      return parts.join('; ') || 'New data_grid module';
    }

    default:
      return '';
  }
}

// ─── Inheritance Chain Building ──────────────────────────────────────────────

function buildInheritanceChain(
  className: string,
  allClasses: Map<string, { baseClass: string; mixins: string[]; sourceFile: string }>,
  visited: Set<string>,
): string[] {
  if (visited.has(className)) return [];
  visited.add(className);

  const info = allClasses.get(className);
  if (!info?.baseClass) return [];

  const chain: string[] = [];

  for (const mixin of info.mixins) {
    chain.push(`[mixin] ${mixin}`);
  }

  let rawBase = info.baseClass;
  const mixinMatch = /^\w+\((.+)\)$/.exec(rawBase);
  if (mixinMatch) {
    const [, inner] = mixinMatch;
    rawBase = inner;
  }

  chain.push(rawBase);

  if (allClasses.has(rawBase)) {
    chain.push(...buildInheritanceChain(rawBase, allClasses, visited));
  }

  return chain;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function classifyModules(
  parsedFiles: DataGridParsedFile[],
  modulesOrder: string[],
): ClassifiedModule[] {
  const results: ClassifiedModule[] = [];

  for (const pf of parsedFiles) {
    for (const reg of pf.registerModuleCalls) {
      const category = classifyModule(reg, pf);
      const orderIndex = modulesOrder.indexOf(reg.moduleName);

      const newControllers = Object.entries(reg.controllers)
        .filter(([, ref]) => ref.isDefinedLocally && !ref.isImportedFromGridCore)
        .map(([name]) => name);

      const newViews = Object.entries(reg.views)
        .filter(([, ref]) => ref.isDefinedLocally && !ref.isImportedFromGridCore)
        .map(([name]) => name);

      const overriddenControllers = Object.entries(reg.controllers)
        .filter(([, ref]) => ref.isDefinedLocally && ref.baseClass)
        .map(([name]) => name);

      const overriddenExtenderControllers = Object.entries(reg.extenders.controllers)
        .filter(([, ext]) => !ext.isImportedFromGridCore && (ext.isDefinedLocally || true))
        .map(([name]) => name);

      const overriddenExtenderViews = Object.entries(reg.extenders.views)
        .filter(([, ext]) => !ext.isImportedFromGridCore && (ext.isDefinedLocally || true))
        .map(([name]) => name);

      // Determine grid_core source module
      let gridCoreSourceModule: string | null = null;
      for (const ref of reg.gridCoreRefs) {
        const imp = pf.imports.get(ref);
        if (imp?.isFromGridCore) {
          gridCoreSourceModule = imp.fromPath;
          break;
        }
      }

      results.push({
        moduleName: reg.moduleName,
        category,
        sourceFile: pf.filePath,
        relPath: reg.relPath,
        featureArea: getFeatureAreaFromPath(reg.relPath),
        registrationOrder: orderIndex >= 0 ? orderIndex : 999,

        gridCoreModuleName: reg.argIsIdentifier ? reg.argIdentifierName : null,
        gridCoreSourceModule,

        controllers: reg.controllers,
        views: reg.views,
        extenders: reg.extenders,

        newControllers,
        newViews,
        overriddenControllers,
        overriddenExtenderControllers,
        overriddenExtenderViews,
        hasDefaultOptionsOverride: reg.hasDefaultOptions && category !== 'passthrough',

        details: buildDetails(category, reg),
      });
    }
  }

  results.sort((a, b) => a.registrationOrder - b.registrationOrder);
  return results;
}

export function collectDataSourceAdapterChain(
  parsedFiles: DataGridParsedFile[],
): DataSourceAdapterExtension[] {
  const allExtensions: DataSourceAdapterExtension[] = [];
  for (const pf of parsedFiles) {
    allExtensions.push(...pf.dataSourceAdapterExtensions);
  }
  // Assign global order based on collection order
  allExtensions.forEach((ext, i) => { ext.order = i; });
  return allExtensions;
}

export function buildExtenderPipelines(
  modules: ClassifiedModule[],
): ExtenderPipeline[] {
  const controllerSteps = new Map<string, ExtenderPipelineStep[]>();
  const viewSteps = new Map<string, ExtenderPipelineStep[]>();

  for (const mod of modules) {
    for (const [targetName, ext] of Object.entries(mod.extenders.controllers)) {
      const step: ExtenderPipelineStep = {
        moduleName: mod.moduleName,
        relPath: mod.relPath,
        extenderName: ext.extenderName,
        isFromGridCore: ext.isImportedFromGridCore,
        registrationOrder: mod.registrationOrder,
      };

      const existing = controllerSteps.get(targetName);
      if (existing) {
        existing.push(step);
      } else {
        controllerSteps.set(targetName, [step]);
      }
    }
    for (const [targetName, ext] of Object.entries(mod.extenders.views)) {
      const step: ExtenderPipelineStep = {
        moduleName: mod.moduleName,
        relPath: mod.relPath,
        extenderName: ext.extenderName,
        isFromGridCore: ext.isImportedFromGridCore,
        registrationOrder: mod.registrationOrder,
      };

      const existing = viewSteps.get(targetName);
      if (existing) {
        existing.push(step);
      } else {
        viewSteps.set(targetName, [step]);
      }
    }
  }

  const pipelines: ExtenderPipeline[] = [];

  for (const [targetName, steps] of controllerSteps) {
    steps.sort((a, b) => a.registrationOrder - b.registrationOrder);
    pipelines.push({ targetName, targetType: 'controller', steps });
  }
  for (const [targetName, steps] of viewSteps) {
    steps.sort((a, b) => a.registrationOrder - b.registrationOrder);
    pipelines.push({ targetName, targetType: 'view', steps });
  }

  return pipelines.sort((a, b) => a.targetName.localeCompare(b.targetName));
}

export function buildInheritanceChains(
  parsedFiles: DataGridParsedFile[],
): InheritanceEntry[] {
  // Build a unified class map from all parsed data_grid files
  const allClasses = new Map<string, { baseClass: string; mixins: string[]; sourceFile: string }>();
  for (const pf of parsedFiles) {
    for (const [name, info] of pf.classes) {
      allClasses.set(name, {
        baseClass: info.baseClass,
        mixins: info.mixins,
        sourceFile: info.sourceFile,
      });
    }
  }

  const entries: InheritanceEntry[] = [];
  for (const [className, info] of allClasses) {
    if (info.baseClass) {
      const visited = new Set<string>();
      const chain = buildInheritanceChain(className, allClasses, visited);
      if (chain.length > 0) {
        entries.push({
          className,
          chain,
          sourceFile: info.sourceFile,
        });
      }
    }
  }

  return entries.sort((a, b) => a.className.localeCompare(b.className));
}

// ─── Cross-Dependency Detection ──────────────────────────────────────────────

function resolveImportToRelPath(
  fromRelPath: string,
  importPath: string,
): string | null {
  const fromDir = fromRelPath.split('/').slice(0, -1).join('/');
  const segments = importPath.split('/');
  const resolved: string[] = fromDir ? fromDir.split('/') : [];

  for (const seg of segments) {
    if (seg === '.') {
      // current dir
    } else if (seg === '..') {
      resolved.pop();
    } else {
      resolved.push(seg);
    }
  }

  return resolved.join('/') || null;
}

function findTargetFile(
  resolvedPath: string,
  relPathToFile: Map<string, DataGridParsedFile>,
): string | null {
  // Try exact match
  if (relPathToFile.has(resolvedPath)) return resolvedPath;

  // Try with .ts extension
  const withTs = `${resolvedPath}.ts`;
  if (relPathToFile.has(withTs)) return withTs;

  // Try index file
  const asIndex = `${resolvedPath}/index.ts`;
  if (relPathToFile.has(asIndex)) return asIndex;

  return null;
}

/**
 * Detect import dependencies between data_grid files.
 * Returns edges where one data_grid module file imports from another data_grid file.
 * This captures patterns like:
 * - Shared mixins (e.g. ColumnKeyboardNavigationMixin used by multiple modules)
 * - Direct class imports between modules (e.g. importing a base controller)
 * - Utility imports shared across modules
 */
export function buildCrossDependencies(
  parsedFiles: DataGridParsedFile[],
  modules: ClassifiedModule[],
): CrossDependency[] {
  // Build map: relPath → moduleName (for files that register modules)
  const relPathToModule = new Map<string, string>();
  for (const mod of modules) {
    relPathToModule.set(mod.relPath, mod.moduleName);
  }

  // Build map: relPath → file data
  const relPathToFile = new Map<string, DataGridParsedFile>();
  for (const pf of parsedFiles) {
    relPathToFile.set(pf.relPath, pf);
  }

  const deps: CrossDependency[] = [];
  const seen = new Set<string>();

  for (const pf of parsedFiles) {
    // Find which module(s) this file belongs to
    const fromModule = relPathToModule.get(pf.relPath);
    if (!fromModule) {
      // eslint-disable-next-line no-continue
      continue;
    }

    for (const [localName, imp] of pf.imports) {
      // Skip grid_core imports — those are already handled
      if (imp.isFromGridCore) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Only track imports from other data_grid files (relative paths)
      if (!imp.fromPath.startsWith('.') && !imp.fromPath.startsWith('..')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Resolve the import to a data_grid relPath
      const resolvedTarget = resolveImportToRelPath(pf.relPath, imp.fromPath);
      if (!resolvedTarget) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Find the target file
      const targetFile = findTargetFile(resolvedTarget, relPathToFile);
      if (!targetFile) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Determine the target module
      const toModule = relPathToModule.get(targetFile) ?? null;

      // Don't include self-imports or imports to the same module
      if (toModule === fromModule) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Skip m_core imports (boring internal wiring)
      if (resolvedTarget.includes('m_core')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const key = `${fromModule}→${targetFile}`;
      if (seen.has(key)) {
        // Merge importedNames
        const existing = deps.find(
          (d) => d.fromModule === fromModule && d.toRelPath === targetFile,
        );
        if (existing && !existing.importedNames.includes(localName)) {
          existing.importedNames.push(localName);
          existing.label = existing.importedNames.join(', ');
        }
        // eslint-disable-next-line no-continue
        continue;
      }
      seen.add(key);

      deps.push({
        fromModule,
        fromRelPath: pf.relPath,
        toRelPath: targetFile,
        toModule,
        importedNames: [localName],
        importPath: imp.fromPath,
        label: localName,
      });
    }
  }

  return deps.sort((a, b) => a.fromModule.localeCompare(b.fromModule));
}
