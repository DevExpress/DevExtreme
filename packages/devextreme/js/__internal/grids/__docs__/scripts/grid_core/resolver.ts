/* eslint-disable spellcheck/spell-checker, no-restricted-syntax, max-depth */
import {
  BARE_MODULE_BASES,
  getFeatureAreaFromPath,
  M_MODULES_PATH,
  MODULES_PREFIX,
} from './constants';
import type {
  ClassRegistrationInfo,
  GlobalClassInfo,
  InheritanceEntry,
  ModuleInfo,
  ParsedFile,
  RuntimeDependency,
} from './types';

// ─── Global Class Registry ───────────────────────────────────────────────────

/**
 * Build a global map of all classes across all parsed files.
 * Key: className, Value: class info + sourceFile.
 *
 * When there are duplicate class names across files (e.g. KeyboardNavigationController
 * in both m_keyboard_navigation_core.ts and m_keyboard_navigation.ts), we keep BOTH:
 * - The "base" version (doesn't extend a class of the same name) goes in the main registry
 * - The "shadow" version goes in a separate list to be handled during chain building
 */
export function buildGlobalClassRegistry(
  allParsedFiles: ParsedFile[],
): Map<string, GlobalClassInfo> {
  const registry = new Map<string, GlobalClassInfo>();
  const duplicates = new Map<string, GlobalClassInfo[]>();

  for (const pf of allParsedFiles) {
    for (const [className, info] of pf.classes) {
      const entry: GlobalClassInfo = { ...info, sourceFile: pf.relPath };
      const existingEntry = registry.get(className);
      if (!existingEntry) {
        registry.set(className, entry);
      } else {
        const existing = duplicates.get(className);
        if (existing) {
          existing.push(entry);
        } else {
          duplicates.set(className, [existingEntry, entry]);
        }
      }
    }
  }

  // For duplicates, prefer the one that does NOT extend something that resolves to itself
  // (i.e., the "original" base class, not the shadow)
  for (const [className, entries] of duplicates) {
    const baseEntry = entries.find((e) => {
      const base = e.baseClass;
      return base.startsWith('modules.') || base.startsWith('Modules.') || base.startsWith('core.');
    });
    if (baseEntry) {
      registry.set(className, baseEntry);
    }
  }

  return registry;
}

// ─── Global Alias Map ────────────────────────────────────────────────────────

/**
 * Build a global map: alias name → original class name.
 * Collects all `import { X as Y }` patterns across all files.
 * Only tracks aliases where the original name is a class found in the global registry.
 */
export function buildGlobalAliasMap(
  allParsedFiles: ParsedFile[],
): Map<string, string> {
  const aliasMap = new Map<string, string>();

  for (const pf of allParsedFiles) {
    for (const [localName, alias] of pf.importAliases) {
      if (localName !== alias.originalName) {
        aliasMap.set(localName, alias.originalName);
      }
    }
  }

  return aliasMap;
}

// ─── Alias Resolution ────────────────────────────────────────────────────────

/**
 * Resolve alias names in a base class string.
 * Handles patterns like "AliasName", "Mixin(AliasName)", etc.
 */
export function resolveAliasInString(text: string, aliasMap: Map<string, string>): string {
  if (!text) {
    return text;
  }

  // Direct match
  const alias = aliasMap.get(text);
  if (alias) {
    return alias;
  }

  // Mixin pattern: "Mixin(AliasName)" -> "Mixin(RealName)"
  const mixinMatch = /^(\w+)\((.+)\)$/.exec(text);
  if (mixinMatch) {
    const [, mixinPart, innerPart] = mixinMatch;
    const mixin = resolveAliasInString(mixinPart, aliasMap);
    const inner = resolveAliasInString(innerPart, aliasMap);
    return `${mixin}(${inner})`;
  }

  return text;
}

/**
 * Resolve import aliases in class base class names in the global registry.
 * E.g., if class X extends KeyboardNavigationControllerCore, and
 * KeyboardNavigationControllerCore is an alias for KeyboardNavigationController,
 * update X's baseClass to reference the real name.
 */
export function resolveAliasesInClasses(
  globalClasses: Map<string, GlobalClassInfo>,
  aliasMap: Map<string, string>,
): void {
  for (const [, info] of globalClasses) {
    info.baseClass = resolveAliasInString(info.baseClass, aliasMap);
    info.mixins = info.mixins.map((m) => resolveAliasInString(m, aliasMap));
  }
}

// ─── Module Reference Normalization ──────────────────────────────────────────

/**
 * Normalize base class references that use different module import styles.
 * E.g., "Modules.ViewController" → "modules.ViewController",
 *        "core.ViewController" → "modules.ViewController"
 */
export function normalizeModuleRef(baseClass: string): string {
  let result = baseClass.replace(/^Modules\./, 'modules.');
  result = result.replace(/^core\./, 'modules.');

  // Also normalize inside mixin calls: "Mixin(Modules.View)" → "Mixin(modules.View)"
  const mixinMatch = /^(\w+)\((.+)\)$/.exec(result);
  if (mixinMatch) {
    const [, mixinName, mixinInner] = mixinMatch;
    return `${mixinName}(${normalizeModuleRef(mixinInner)})`;
  }

  return result;
}

/**
 * Normalize bare imports of Controller/View/ViewController from m_modules.
 * When a file does `import { Controller } from '../m_modules'`, the heritage
 * string is just "Controller" instead of "modules.Controller".
 */
export function normalizeBareModuleImports(
  baseClass: string,
  parsedFile: ParsedFile,
): string {
  if (!BARE_MODULE_BASES.includes(baseClass)) {
    return baseClass;
  }

  // Check all import aliases to see if this was imported from m_modules
  for (const [localName, aliasInfo] of parsedFile.importAliases) {
    if (localName === baseClass && aliasInfo.fromPath.includes(M_MODULES_PATH)) {
      return `${MODULES_PREFIX}${aliasInfo.originalName}`;
    }
  }

  // If there's no local class with this name, it's almost certainly from m_modules
  if (!parsedFile.classes.has(baseClass)) {
    return `${MODULES_PREFIX}${baseClass}`;
  }

  return baseClass;
}

// ─── Standalone Class Detection ──────────────────────────────────────────────

/**
 * Derive a registration name from a class name by converting to camelCase.
 * Handles leading uppercase runs: "AIColumnController" → "aiColumnController",
 * "ColumnsView" → "columnsView", "SeparatorView" → "separatorView"
 */
function deriveRegisteredName(className: string): string {
  const match = /^([A-Z]+)([A-Z][a-z].*)$/.exec(className);
  if (match) {
    return match[1].toLowerCase() + match[2];
  }
  return className.charAt(0).toLowerCase() + className.slice(1);
}

/**
 * Check whether a class ultimately descends from a module base
 * (modules.Controller, modules.View, modules.ViewController).
 */
function isModuleBaseDescendant(
  className: string,
  globalClasses: Map<string, GlobalClassInfo>,
  visited = new Set<string>(),
): boolean {
  if (visited.has(className)) {
    return false;
  }
  visited.add(className);

  const info = globalClasses.get(className);
  if (!info?.baseClass) {
    return false;
  }

  let baseClass = normalizeModuleRef(info.baseClass);
  if (BARE_MODULE_BASES.includes(baseClass)
    && !globalClasses.has(baseClass)
  ) {
    baseClass = `${MODULES_PREFIX}${baseClass}`;
  }

  // Strip mixin wrapper to get the innermost base
  let rawBase = baseClass;
  let match = /^\w+\((.+)\)$/.exec(rawBase);
  while (match) {
    [, rawBase] = match;
    match = /^\w+\((.+)\)$/.exec(rawBase);
  }

  if (rawBase.startsWith(MODULES_PREFIX)) {
    return true;
  }

  return isModuleBaseDescendant(rawBase, globalClasses, visited);
}

/**
 * Find exported classes that are not registered in any module but should appear
 * in the diagram as standalone controller/view nodes (outside any module).
 *
 * A class qualifies if it is exported, not registered in any module, and either:
 * - used as a base class by other classes, or
 * - descends from a module base class (Controller/View/ViewController)
 */
export function findStandaloneRegistrations(
  modules: ModuleInfo[],
  globalClasses: Map<string, GlobalClassInfo>,
): {
  controllers: Record<string, ClassRegistrationInfo>;
  views: Record<string, ClassRegistrationInfo>;
} {
  // Collect all class names that are registered in modules
  const registeredClasses = new Set<string>();
  for (const mod of modules) {
    for (const ctrl of Object.values(mod.controllers)) {
      registeredClasses.add(ctrl.className);
    }
    for (const view of Object.values(mod.views)) {
      registeredClasses.add(view.className);
    }
  }

  const controllers: Record<string, ClassRegistrationInfo> = {};
  const views: Record<string, ClassRegistrationInfo> = {};

  for (const [className, info] of globalClasses) {
    if (!info.isExported || registeredClasses.has(className)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // Include if used as a base class OR if it descends from a module base
    let isUsed = false;
    for (const [otherName, otherInfo] of globalClasses) {
      if (otherName !== className
        && (otherInfo.baseClass.includes(className) || otherInfo.mixins.includes(className))
      ) {
        isUsed = true;
        break;
      }
    }
    if (!isUsed && !isModuleBaseDescendant(className, globalClasses)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    let baseClass = normalizeModuleRef(info.baseClass);
    if (BARE_MODULE_BASES.includes(baseClass)
      && !globalClasses.has(baseClass)
    ) {
      baseClass = `${MODULES_PREFIX}${baseClass}`;
    }

    // Determine role and registeredAs from heuristic
    const role = className.endsWith('View') ? 'view' : 'controller';
    const registeredAs = deriveRegisteredName(className);

    const entry: ClassRegistrationInfo = {
      className,
      baseClass,
      mixins: info.mixins,
      sourceFile: info.sourceFile,
      isExported: info.isExported,
      featureArea: getFeatureAreaFromPath(info.sourceFile),
    };

    if (role === 'controller') {
      controllers[registeredAs] = entry;
    } else {
      views[registeredAs] = entry;
    }
  }

  return { controllers, views };
}

// ─── Inheritance Chain Building ──────────────────────────────────────────────

export function buildInheritanceChains(
  modules: ModuleInfo[],
  standaloneControllers: Record<string, ClassRegistrationInfo>,
  standaloneViews: Record<string, ClassRegistrationInfo>,
  globalClasses: Map<string, GlobalClassInfo>,
): InheritanceEntry[] {
  const allClasses = new Map<string, { baseClass: string; mixins: string[] }>();
  const bareModuleBasesSet = new Set<string>(BARE_MODULE_BASES);

  for (const [className, info] of globalClasses) {
    let baseClass = normalizeModuleRef(info.baseClass);
    if (bareModuleBasesSet.has(baseClass) && !globalClasses.has(baseClass)) {
      baseClass = `${MODULES_PREFIX}${baseClass}`;
    }
    allClasses.set(className, { baseClass, mixins: info.mixins });
  }

  const entries: InheritanceEntry[] = [];
  const processed = new Set<string>();

  function buildChain(className: string): string[] {
    if (processed.has(className)) {
      console.warn(`Circular inheritance detected in class hierarchy involving "${className}".`);
      return [];
    }
    processed.add(className);
    const info = allClasses.get(className);
    if (!info?.baseClass) {
      return [];
    }

    const chain: string[] = [];

    for (const mixin of info.mixins) {
      chain.push(mixin);
    }

    let rawBase = info.baseClass;
    const mixinMatch = /^\w+\((.+)\)$/.exec(rawBase);
    if (mixinMatch) {
      [, rawBase] = mixinMatch;
    }

    chain.push(rawBase);

    const baseName = rawBase.replace(MODULES_PREFIX, '');
    if (allClasses.has(baseName)) {
      chain.push(...buildChain(baseName));
    } else if (rawBase.startsWith(MODULES_PREFIX)) {
      if (rawBase === 'modules.View' || rawBase === 'modules.Controller') {
        chain.push('ModuleItem');
      } else if (rawBase === 'modules.ViewController') {
        chain.push('modules.Controller', 'ModuleItem');
      }
    }

    return chain;
  }

  // Build chains for all controllers and views in modules
  for (const mod of modules) {
    for (const ctrl of Object.values(mod.controllers)) {
      processed.clear();
      const chain = buildChain(ctrl.className);
      if (chain.length > 0) {
        entries.push({ class: ctrl.className, chain });
      }
    }
    for (const view of Object.values(mod.views)) {
      processed.clear();
      const chain = buildChain(view.className);
      if (chain.length > 0) {
        entries.push({ class: view.className, chain });
      }
    }
  }

  // Build chains for standalone controllers and views
  const standAloneEntries = [
    ...Object.values(standaloneControllers),
    ...Object.values(standaloneViews),
  ];
  for (const entry of standAloneEntries) {
    processed.clear();
    const chain = buildChain(entry.className);
    if (chain.length > 0) {
      entries.push({ class: entry.className, chain });
    }
  }

  return entries.sort((a, b) => a.class.localeCompare(b.class));
}

// ─── Runtime Dependency Resolution ───────────────────────────────────────────

export function resolveRuntimeDeps(
  allParsedFiles: ParsedFile[],
  modules: ModuleInfo[],
): RuntimeDependency[] {
  const allDeps: RuntimeDependency[] = [];

  // Build a map: className → moduleName
  const classToModule = new Map<string, string>();
  for (const mod of modules) {
    for (const ctrl of Object.values(mod.controllers)) {
      classToModule.set(ctrl.className, mod.moduleName);
    }
    for (const view of Object.values(mod.views)) {
      classToModule.set(view.className, mod.moduleName);
    }
  }

  // Build a map: extenderName → moduleName
  const extenderToModule = new Map<string, string>();
  for (const mod of modules) {
    for (const ext of Object.values(mod.extenders.controllers)) {
      extenderToModule.set(ext.extenderName, mod.moduleName);
    }
    for (const ext of Object.values(mod.extenders.views)) {
      extenderToModule.set(ext.extenderName, mod.moduleName);
    }
  }

  for (const pf of allParsedFiles) {
    for (const dep of pf.runtimeDeps) {
      let fromModule = classToModule.get(dep.from) ?? '';
      if (!fromModule) {
        fromModule = extenderToModule.get(dep.from) ?? '';
      }
      if (!fromModule) {
        for (const mod of modules) {
          if (mod.sourceFile === pf.relPath) {
            fromModule = mod.moduleName;
            break;
          }
        }
      }

      allDeps.push({ ...dep, fromModule });
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique: RuntimeDependency[] = [];
  for (const dep of allDeps) {
    const key = `${dep.from}|${dep.to}|${dep.via}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(dep);
    }
  }

  return unique.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
}

// ─── Module Class Reference Resolution ───────────────────────────────────────

/**
 * Re-resolve controllers and views in a module definition using the global class registry.
 * This fixes the case where a class is defined in one file and referenced
 * in the module definition in another file.
 */
export function resolveModuleClassRefs(
  mod: ModuleInfo,
  parsedFile: ParsedFile,
  globalClasses: Map<string, GlobalClassInfo>,
  allParsedFiles: ParsedFile[],
  globalAliasMap: Map<string, string>,
): void {
  const fileByRelPath = new Map<string, ParsedFile>();
  for (const pf of allParsedFiles) {
    fileByRelPath.set(pf.relPath, pf);
  }

  const resolveEntry = (
    entry: {
      baseClass: string;
      mixins: string[];
      sourceFile: string;
      isExported: boolean;
      className: string
    },
  ): void => {
    if (entry.baseClass === 'unknown' || entry.baseClass === '') {
      const originalName = parsedFile.importedNames.get(entry.className) ?? entry.className;
      const globalInfo = globalClasses.get(originalName) ?? globalClasses.get(entry.className);
      if (globalInfo) {
        entry.baseClass = globalInfo.baseClass;
        entry.mixins = globalInfo.mixins;
        entry.sourceFile = globalInfo.sourceFile;
        entry.isExported = globalInfo.isExported;
      }
    }

    // Resolve import aliases in baseClass
    entry.baseClass = resolveAliasInString(entry.baseClass, globalAliasMap);
    entry.mixins = entry.mixins.map((m) => resolveAliasInString(m, globalAliasMap));

    // Normalize module references
    entry.baseClass = normalizeModuleRef(entry.baseClass);

    // Normalize bare module base imports using the original class's file context
    const classFile = fileByRelPath.get(entry.sourceFile);
    entry.baseClass = normalizeBareModuleImports(entry.baseClass, classFile ?? parsedFile);
  };

  for (const ctrl of Object.values(mod.controllers)) {
    resolveEntry(ctrl);
  }
  for (const view of Object.values(mod.views)) {
    resolveEntry(view);
  }
}

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateData(
  modules: ModuleInfo[],
  standaloneControllers: Record<string, ClassRegistrationInfo>,
  standaloneViews: Record<string, ClassRegistrationInfo>,
  runtimeDependencies: RuntimeDependency[],
): void {
  const knownControllers = new Set<string>();
  const knownViews = new Set<string>();
  for (const mod of modules) {
    for (const name of Object.keys(mod.controllers)) {
      knownControllers.add(name);
    }
    for (const name of Object.keys(mod.views)) {
      knownViews.add(name);
    }
  }
  for (const name of Object.keys(standaloneControllers)) {
    knownControllers.add(name);
  }
  for (const name of Object.keys(standaloneViews)) {
    knownViews.add(name);
  }

  // Check extender targets
  for (const mod of modules) {
    for (const target of Object.keys(mod.extenders.controllers)) {
      if (!knownControllers.has(target)) {
        console.warn(`WARN: Module "${mod.moduleName}" extends unknown controller "${target}"`);
      }
    }
    for (const target of Object.keys(mod.extenders.views)) {
      if (!knownViews.has(target)) {
        console.warn(`WARN: Module "${mod.moduleName}" extends unknown view "${target}"`);
      }
    }
  }

  // Log runtime dependency warnings for unknown targets
  // (some controllers/views are defined in data_grid/tree_list specific modules)
  for (const dep of runtimeDependencies) {
    if (dep.toType === 'controller' && !knownControllers.has(dep.to)) {
      console.warn(`WARN: Runtime dependency from "${dep.from}" to unknown controller "${dep.to}" (may be defined in data_grid/tree_list)`);
    }
    if (dep.toType === 'view' && !knownViews.has(dep.to)) {
      console.warn(`WARN: Runtime dependency from "${dep.from}" to unknown view "${dep.to}" (may be defined in data_grid/tree_list)`);
    }
  }
}
