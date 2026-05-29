/* eslint-disable max-depth,no-continue */
import { buildInheritanceChainCore } from '../shared/inheritance';
import type { HeritageInfo } from '../shared/types';
import type { ModificationCategory } from './constants';
import { CROSS_DEP_IGNORED_SEGMENTS, getFeatureAreaFromPath } from './constants';
import type {
  ClassifiedModule,
  CrossDependency,
  DataSourceAdapterExtension,
  ExtenderPipeline,
  ExtenderPipelineStep,
  GridCoreModuleInfo,
  InheritanceEntry,
  ParsedFile,
  RegisterModuleCall,
} from './types';

// ─── Module Classification ───────────────────────────────────────────────────

function hasLocallyDefinedExtenders(
  reg: RegisterModuleCall,
  parsedFile: ParsedFile,
): boolean {
  const allExtenders = [
    ...Object.values(reg.extenders.controllers),
    ...Object.values(reg.extenders.views),
  ];

  return allExtenders.some((ext) => {
    if (ext.isDefinedLocally) {
      return true;
    }

    if (ext.isImportedFromGridCore) {
      return false;
    }

    return parsedFile.localVars.has(ext.extenderName)
      || parsedFile.classes.has(ext.extenderName);
  });
}

function classifyModule(
  reg: RegisterModuleCall,
  parsedFile: ParsedFile,
): ModificationCategory {
  // No grid_core reference at all → new (data_grid-only module)
  if (!reg.referencesGridCoreModule) {
    return 'new';
  }

  // Direct passthrough: gridCore.registerModule('sorting', sortingModule)
  if (reg.argIsIdentifier) {
    return 'passthrough';
  }

  // Check for locally-defined controllers/views (→ replaced)
  const hasLocalControllers = Object.values(reg.controllers).some((c) => c.isDefinedLocally);
  const hasLocalViews = Object.values(reg.views).some((v) => v.isDefinedLocally);
  if (hasLocalControllers || hasLocalViews) {
    return 'replaced';
  }

  // Check for locally-defined extenders (→ extended)
  if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
    return 'extended';
  }

  // Everything else (including defaultOptions-only overrides) is passthrough
  // defaultOptions are initial property values and do NOT affect classification
  return 'passthrough';
}

// ─── Resolve forwarded controllers/views from grid_core module data ──────────

function buildGcSourceLookup(
  gridCoreModules: GridCoreModuleInfo[],
): Map<string, GridCoreModuleInfo> {
  const map = new Map<string, GridCoreModuleInfo>();
  for (const gc of gridCoreModules) {
    const key = gc.sourceFile.replace(/\.ts$/, '');
    map.set(key, gc);
  }
  return map;
}

/** Build a lookup map: registeredAs → GridCoreModuleInfo for O(1) access. */
export function buildGcRegistrationLookup(
  gridCoreModules: GridCoreModuleInfo[],
): Map<string, GridCoreModuleInfo> {
  const map = new Map<string, GridCoreModuleInfo>();
  for (const gc of gridCoreModules) {
    if (gc.registeredAs) {
      map.set(gc.registeredAs, gc);
    }
  }
  return map;
}

/** Build a lookup map: sourceFile → ClassifiedModule for O(1) access. */
export function buildModulesBySourceFile(
  modules: ClassifiedModule[],
): Map<string, ClassifiedModule> {
  return new Map(modules.map((m) => [m.sourceFile, m]));
}

function resolveForwardedRefs(
  reg: RegisterModuleCall,
  pf: ParsedFile,
  gcSourceLookup: Map<string, GridCoreModuleInfo>,
  kind: 'controllers' | 'views',
): void {
  const forwardedRef = kind === 'controllers'
    ? reg.forwardedControllersRef
    : reg.forwardedViewsRef;
  const target = reg[kind];

  if (!forwardedRef || Object.keys(target).length > 0) {
    return;
  }

  const imp = pf.imports.get(forwardedRef);
  if (!imp?.isFromGridCore) {
    return;
  }

  const normalized = imp.fromPath
    .replace(/^@ts\/grids\/grid_core\//, '')
    .replace(/\.ts$/, '');
  const gcMod = gcSourceLookup.get(normalized);

  if (gcMod) {
    for (const [regName, info] of Object.entries(gcMod[kind])) {
      target[regName] = {
        regName,
        className: info.className,
        isImportedFromGridCore: true,
        isDefinedLocally: false,
        baseClass: info.baseClass,
        mixins: info.mixins ?? [],
        sourceFile: info.sourceFile,
      };
    }
  } else {
    console.warn(`WARN: gc module not found for forwarded ${kind} ref '${forwardedRef}' (from ${imp.fromPath}). Ensure grid_core JSON is up-to-date.`);
  }
}

// ─── Public: classifyModules ─────────────────────────────────────────────────

export function classifyModules(
  parsedFiles: ParsedFile[],
  modulesOrder: string[],
  gridCoreModules: GridCoreModuleInfo[],
): ClassifiedModule[] {
  const results: ClassifiedModule[] = [];
  const orderMap = new Map(modulesOrder.map((name, i) => [name, i]));
  const gcSourceLookup = buildGcSourceLookup(gridCoreModules);

  for (const pf of parsedFiles) {
    for (const reg of pf.registerModuleCalls) {
      // Resolve forwarded controllers/views from gc module data before classification
      resolveForwardedRefs(reg, pf, gcSourceLookup, 'controllers');
      resolveForwardedRefs(reg, pf, gcSourceLookup, 'views');

      const category = classifyModule(reg, pf);
      const orderIndex = orderMap.get(reg.moduleName) ?? -1;

      let gridCoreSourceModule: string | null = null;
      for (const ref of reg.gridCoreRefs) {
        const imp = pf.imports.get(ref);
        if (imp?.isFromGridCore) {
          gridCoreSourceModule = imp.fromPath.replace(/^@ts\/grids\//, '');
          break;
        }
      }

      results.push({
        moduleName: reg.moduleName,
        category,
        sourceFile: reg.relPath,
        featureArea: getFeatureAreaFromPath(reg.relPath),
        registrationOrder: orderIndex >= 0 ? orderIndex : modulesOrder.length,
        gridCoreModuleName: reg.argIsIdentifier ? reg.argIdentifierName : null,
        gridCoreSourceModule,
        controllers: reg.controllers,
        views: reg.views,
        extenders: reg.extenders,
        hasDefaultOptionsOverride: reg.hasDefaultOptions,
      });
    }
  }

  results.sort((a, b) => a.registrationOrder - b.registrationOrder);
  return results;
}

// ─── Public: collectDataSourceAdapterChain ───────────────────────────────────

export function collectDataSourceAdapterChain(
  parsedFiles: ParsedFile[],
): DataSourceAdapterExtension[] {
  const all: DataSourceAdapterExtension[] = [];
  for (const pf of parsedFiles) {
    all.push(...pf.dataSourceAdapterExtensions);
  }
  return all.map((ext, i) => ({ ...ext, order: i }));
}

// ─── Public: buildExtenderPipelines ──────────────────────────────────────────

function addPipelineStep(
  stepsMap: Map<string, ExtenderPipelineStep[]>,
  targetName: string,
  step: ExtenderPipelineStep,
): void {
  const existing = stepsMap.get(targetName);
  if (existing) {
    existing.push(step);
  } else {
    stepsMap.set(targetName, [step]);
  }
}

function collectExtenderSteps(
  mod: ClassifiedModule,
  gcMod: GridCoreModuleInfo | undefined,
  kind: 'controllers' | 'views',
  stepsMap: Map<string, ExtenderPipelineStep[]>,
): void {
  // 1. Extenders explicitly declared in data_grid registerModule call
  const declaredTargets = new Set(Object.keys(mod.extenders[kind]));
  for (const [targetName, ext] of Object.entries(mod.extenders[kind])) {
    addPipelineStep(stepsMap, targetName, {
      moduleName: mod.moduleName,
      relPath: mod.sourceFile,
      extenderName: ext.extenderName,
      isFromGridCore: ext.isImportedFromGridCore,
      registrationOrder: mod.registrationOrder,
      category: mod.category,
    });
  }
  // 2. GC extenders from passthrough/extended modules (not already declared by dg)
  if (gcMod && (mod.category === 'passthrough' || mod.category === 'extended')) {
    for (const [targetName, ext] of Object.entries(gcMod.extenders[kind])) {
      if (!declaredTargets.has(targetName)) {
        addPipelineStep(stepsMap, targetName, {
          moduleName: mod.moduleName,
          relPath: mod.sourceFile,
          extenderName: ext.extenderName,
          isFromGridCore: true,
          registrationOrder: mod.registrationOrder,
          category: mod.category,
        });
      }
    }
  }
}

export function buildExtenderPipelines(
  modules: ClassifiedModule[],
  gridCoreModules: GridCoreModuleInfo[],
): ExtenderPipeline[] {
  const controllerSteps = new Map<string, ExtenderPipelineStep[]>();
  const viewSteps = new Map<string, ExtenderPipelineStep[]>();
  const gcRegLookup = buildGcRegistrationLookup(gridCoreModules);

  for (const mod of modules) {
    const gcMod = gcRegLookup.get(mod.moduleName);
    collectExtenderSteps(mod, gcMod, 'controllers', controllerSteps);
    collectExtenderSteps(mod, gcMod, 'views', viewSteps);
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

// ─── Public: buildInheritanceChains ──────────────────────────────────────────

const MAX_INHERITANCE_DEPTH = 50;

export function buildInheritanceChains(parsedFiles: ParsedFile[]): InheritanceEntry[] {
  const allClasses = new Map<string, HeritageInfo & { sourceFile: string }>();
  for (const pf of parsedFiles) {
    for (const [name, info] of pf.classes) {
      if (allClasses.has(name)) {
        const existing = allClasses.get(name);
        console.warn(`WARN: Duplicate class "${name}" found in ${existing?.sourceFile ?? 'unknown'} and ${info.sourceFile}; keeping last-seen entry.`);
      }
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
      const chain = buildInheritanceChainCore(
        className,
        (name) => allClasses.get(name),
        visited,
        { maxDepth: MAX_INHERITANCE_DEPTH, formatMixin: (m) => `[mixin] ${m}` },
      );
      if (chain.length > 0) {
        entries.push({ className, chain, sourceFile: info.sourceFile });
      }
    }
  }
  return entries.sort((a, b) => a.className.localeCompare(b.className));
}

// ─── Public: buildCrossDependencies ──────────────────────────────────────────

function resolveRelativeImportPath(fromRelPath: string, importPath: string): string | null {
  const fromDir = fromRelPath.split('/').slice(0, -1).join('/');
  const segments = importPath.split('/');
  const resolved: string[] = fromDir ? fromDir.split('/') : [];
  for (const seg of segments) {
    if (seg === '.') { /* current */ } else if (seg === '..') { resolved.pop(); } else { resolved.push(seg); }
  }
  return resolved.join('/') || null;
}

function findTargetFile(resolved: string, relPaths: Set<string>): string | null {
  if (relPaths.has(resolved)) {
    return resolved;
  }

  const withTs = `${resolved}.ts`;
  if (relPaths.has(withTs)) {
    return withTs;
  }

  const asIndex = `${resolved}/index.ts`;
  if (relPaths.has(asIndex)) {
    return asIndex;
  }

  return null;
}

export function buildCrossDependencies(
  parsedFiles: ParsedFile[],
  modules: ClassifiedModule[],
): CrossDependency[] {
  const relPathToModule = new Map<string, string>();
  for (const mod of modules) {
    relPathToModule.set(mod.sourceFile, mod.moduleName);
  }

  const allRelPaths = new Set<string>();
  for (const pf of parsedFiles) {
    allRelPaths.add(pf.relPath);
  }

  const depsMap = new Map<string, CrossDependency>();

  for (const pf of parsedFiles) {
    const fromModule = relPathToModule.get(pf.relPath);
    if (!fromModule) {
      continue;
    }

    for (const [localName, imp] of pf.imports) {
      if (imp.isFromGridCore) {
        continue;
      }
      if (!imp.fromPath.startsWith('.') && !imp.fromPath.startsWith('..')) {
        continue;
      }

      const resolvedTarget = resolveRelativeImportPath(pf.relPath, imp.fromPath);
      if (!resolvedTarget) {
        continue;
      }

      const targetFile = findTargetFile(resolvedTarget, allRelPaths);
      if (!targetFile) {
        continue;
      }

      const toModule = relPathToModule.get(targetFile) ?? null;
      if (toModule === fromModule) {
        continue;
      }

      // Skip boring internal imports (exact path segment match)
      const targetSegments = resolvedTarget.split('/');
      if (targetSegments.some((seg) => CROSS_DEP_IGNORED_SEGMENTS.has(seg))) {
        continue;
      }

      const key = `${fromModule}→${targetFile}`;
      const existing = depsMap.get(key);
      if (existing) {
        if (!existing.importedNames.includes(localName)) {
          existing.importedNames.push(localName);
        }
        continue;
      }

      depsMap.set(key, {
        fromModule,
        fromRelPath: pf.relPath,
        toRelPath: targetFile,
        toModule,
        importedNames: [localName],
        importPath: imp.fromPath,
      });
    }
  }

  return [...depsMap.values()].sort((a, b) => a.fromModule.localeCompare(b.fromModule));
}
