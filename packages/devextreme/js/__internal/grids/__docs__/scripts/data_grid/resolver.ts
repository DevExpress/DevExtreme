/* eslint-disable spellcheck/spell-checker,max-depth */
import type { ModificationCategory } from './constants';
import { getFeatureAreaFromPath } from './constants';
import type {
  ClassifiedModule,
  CrossDependency,
  DataSourceAdapterExtension,
  ExtenderPipeline,
  ExtenderPipelineStep,
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
    if (ext.isDefinedLocally) return true;
    if (ext.isImportedFromGridCore) return false;
    return parsedFile.localVars.has(ext.extenderName)
      || parsedFile.classes.has(ext.extenderName);
  });
}

function classifyModule(
  reg: RegisterModuleCall,
  parsedFile: ParsedFile,
): ModificationCategory {
  if (!reg.referencesGridCoreModule) return 'new';
  if (reg.argIsIdentifier) return 'passthrough';

  const hasGridCoreSpreads = reg.spreadSources.some((src) => {
    const importInfo = parsedFile.imports.get(src);
    return importInfo?.isFromGridCore ?? false;
  });

  if (hasGridCoreSpreads) {
    if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
      return 'extended';
    }
    return 'passthrough';
  }

  if (reg.hasInlineControllers || reg.hasInlineViews) {
    const hasLocalControllers = Object.values(reg.controllers).some((c) => c.isDefinedLocally);
    const hasLocalViews = Object.values(reg.views).some((v) => v.isDefinedLocally);
    if (hasLocalControllers || hasLocalViews) return 'replaced';
    if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
      return 'extended';
    }
    return 'passthrough';
  }

  if (reg.hasDefaultOptions) return 'replaced';
  if (reg.hasInlineExtenders && hasLocallyDefinedExtenders(reg, parsedFile)) {
    return 'extended';
  }

  return 'passthrough';
}

// ─── Module Details ──────────────────────────────────────────────────────────

function buildDetails(category: ModificationCategory, reg: RegisterModuleCall): string {
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
      if (reg.hasDefaultOptions) replaced.push('defaultOptions overridden');
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

// ─── Public: classifyModules ─────────────────────────────────────────────────

export function classifyModules(
  parsedFiles: ParsedFile[],
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
        .filter(([, ext]) => !ext.isImportedFromGridCore)
        .map(([name]) => name);
      const overriddenExtenderViews = Object.entries(reg.extenders.views)
        .filter(([, ext]) => !ext.isImportedFromGridCore)
        .map(([name]) => name);

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

// ─── Public: collectDataSourceAdapterChain ───────────────────────────────────

export function collectDataSourceAdapterChain(
  parsedFiles: ParsedFile[],
): DataSourceAdapterExtension[] {
  const all: DataSourceAdapterExtension[] = [];
  for (const pf of parsedFiles) {
    all.push(...pf.dataSourceAdapterExtensions);
  }
  all.forEach((ext, i) => { ext.order = i; });
  return all;
}

// ─── Public: buildExtenderPipelines ──────────────────────────────────────────

export function buildExtenderPipelines(modules: ClassifiedModule[]): ExtenderPipeline[] {
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
      if (existing) { existing.push(step); } else { controllerSteps.set(targetName, [step]); }
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
      if (existing) { existing.push(step); } else { viewSteps.set(targetName, [step]); }
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

// ─── Public: buildInheritanceChains ──────────────────────────────────────────

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
  for (const mixin of info.mixins) { chain.push(`[mixin] ${mixin}`); }

  let rawBase = info.baseClass;
  const mixinMatch = /^\w+\((.+)\)$/.exec(rawBase);
  if (mixinMatch) { [, rawBase] = mixinMatch; }

  chain.push(rawBase);
  if (allClasses.has(rawBase)) {
    chain.push(...buildInheritanceChain(rawBase, allClasses, visited));
  }
  return chain;
}

export function buildInheritanceChains(parsedFiles: ParsedFile[]): InheritanceEntry[] {
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
        entries.push({ className, chain, sourceFile: info.sourceFile });
      }
    }
  }
  return entries.sort((a, b) => a.className.localeCompare(b.className));
}

// ─── Public: buildCrossDependencies ──────────────────────────────────────────

function resolveImportToRelPath(fromRelPath: string, importPath: string): string | null {
  const fromDir = fromRelPath.split('/').slice(0, -1).join('/');
  const segments = importPath.split('/');
  const resolved: string[] = fromDir ? fromDir.split('/') : [];
  for (const seg of segments) {
    if (seg === '.') { /* current */ } else if (seg === '..') { resolved.pop(); } else { resolved.push(seg); }
  }
  return resolved.join('/') || null;
}

function findTargetFile(resolved: string, relPaths: Set<string>): string | null {
  if (relPaths.has(resolved)) return resolved;
  const withTs = `${resolved}.ts`;
  if (relPaths.has(withTs)) return withTs;
  const asIndex = `${resolved}/index.ts`;
  if (relPaths.has(asIndex)) return asIndex;
  return null;
}

export function buildCrossDependencies(
  parsedFiles: ParsedFile[],
  modules: ClassifiedModule[],
): CrossDependency[] {
  const relPathToModule = new Map<string, string>();
  for (const mod of modules) { relPathToModule.set(mod.relPath, mod.moduleName); }

  const allRelPaths = new Set<string>();
  for (const pf of parsedFiles) { allRelPaths.add(pf.relPath); }

  const deps: CrossDependency[] = [];
  const seen = new Set<string>();

  for (const pf of parsedFiles) {
    const fromModule = relPathToModule.get(pf.relPath);
    if (!fromModule) {
      // eslint-disable-next-line no-continue
      continue;
    }

    for (const [localName, imp] of pf.imports) {
      if (imp.isFromGridCore) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (!imp.fromPath.startsWith('.') && !imp.fromPath.startsWith('..')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const resolvedTarget = resolveImportToRelPath(pf.relPath, imp.fromPath);
      if (!resolvedTarget) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const targetFile = findTargetFile(resolvedTarget, allRelPaths);
      if (!targetFile) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const toModule = relPathToModule.get(targetFile) ?? null;
      if (toModule === fromModule) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Skip boring internal imports
      if (resolvedTarget.includes('m_core') || resolvedTarget.includes('m_data_source_adapter')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const key = `${fromModule}→${targetFile}`;
      if (seen.has(key)) {
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
