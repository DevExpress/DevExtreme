import * as fs from 'fs';
import * as path from 'path';

import { discoverSourceFiles } from '../shared/file-discovery';
import {
  DEFAULT_FEATURE_AREA,
  EXCLUDED_DIRS,
  EXCLUDED_FILE_NAMES,
  EXTERNAL_MODULE_ROOTS,
  getFeatureAreaFromPath,
  GRIDS_ROOT,
} from './constants';
import { parseFile } from './parser';
import { resolveModuleClassRefs, resolveSpecifierToRelPath } from './resolver';
import type { GlobalClassInfo, ModuleInfo, ParsedFile } from './types';

const REGISTER_CALL = '.registerModule(';

function pickBy<T>(entries: Record<string, T>, keep: (entry: T) => boolean): Record<string, T> {
  return Object.fromEntries(Object.entries(entries).filter(([, entry]) => keep(entry)));
}

function countEntries(mod: ModuleInfo): number {
  return Object.keys(mod.controllers).length
    + Object.keys(mod.views).length
    + Object.keys(mod.extenders.controllers).length
    + Object.keys(mod.extenders.views).length;
}

/** True when `localName` was imported from a file inside grid_core. */
function isFromGridCore(pf: ParsedFile, localName: string): boolean {
  const spec = pf.importSources.get(localName);
  const relPath = spec ? resolveSpecifierToRelPath(spec, pf.filePath) : null;

  return !!relPath && !relPath.startsWith('..');
}

/**
 * Keep only the parts grid_core owns. The same registration usually also carries
 * DataGrid- or TreeList-specific classes and extenders, which belong to those
 * diagrams instead.
 */
function adoptModule(
  mod: ModuleInfo,
  pf: ParsedFile,
  globalClasses: Map<string, GlobalClassInfo>,
): ModuleInfo | null {
  const isGridCoreClass = (className: string): boolean => isFromGridCore(pf, className)
    && globalClasses.has(pf.importedNames.get(className) ?? className);

  const adopted: ModuleInfo = {
    ...mod,
    controllers: pickBy(mod.controllers, (c) => isGridCoreClass(c.className)),
    views: pickBy(mod.views, (v) => isGridCoreClass(v.className)),
    extenders: {
      controllers: pickBy(mod.extenders.controllers, (e) => isFromGridCore(pf, e.extenderName)),
      views: pickBy(mod.extenders.views, (e) => isFromGridCore(pf, e.extenderName)),
    },
    registrationFiles: [mod.sourceFile],
  };

  return countEntries(adopted) > 0 ? adopted : null;
}

/** Take the feature area from where the parts live, not from the registering file. */
function applyGridCoreFeatureArea(mod: ModuleInfo): void {
  const members = [...Object.values(mod.controllers), ...Object.values(mod.views)];

  for (const member of members) {
    member.featureArea = getFeatureAreaFromPath(member.sourceFile);
  }

  mod.featureArea = members[0]?.featureArea ?? mod.featureArea;
}

function fillMissing<T>(target: Record<string, T>, source: Record<string, T>): void {
  for (const [name, entry] of Object.entries(source)) {
    if (!(name in target)) {
      target[name] = entry;
    }
  }
}

/** DataGrid and TreeList register the same module separately; show it once. */
function mergeInto(merged: Map<string, ModuleInfo>, mod: ModuleInfo): void {
  const existing = merged.get(mod.moduleName);

  if (!existing) {
    merged.set(mod.moduleName, mod);
    return;
  }

  fillMissing(existing.controllers, mod.controllers);
  fillMissing(existing.views, mod.views);
  fillMissing(existing.extenders.controllers, mod.extenders.controllers);
  fillMissing(existing.extenders.views, mod.extenders.views);
  existing.hasDefaultOptions = existing.hasDefaultOptions || mod.hasDefaultOptions;
  existing.registrationFiles?.push(...mod.registrationFiles ?? []);

  if (existing.featureArea === DEFAULT_FEATURE_AREA) {
    existing.featureArea = mod.featureArea;
  }
}

/**
 * Collect modules that are registered from data_grid / tree_list but built out of
 * grid_core parts (`toast`, `aiColumn`, `aiAssistant`). Without them those parts
 * would show up as standalone controllers and views.
 *
 * The registering files are added to `fileByRelPath` so extender lookups reach them.
 */
export function collectExternalModules(
  globalClasses: Map<string, GlobalClassInfo>,
  fileByRelPath: Map<string, ParsedFile>,
  globalAliasMap: Map<string, string>,
): ModuleInfo[] {
  const merged = new Map<string, ModuleInfo>();
  const files = EXTERNAL_MODULE_ROOTS
    .flatMap((root) => discoverSourceFiles(
      path.join(GRIDS_ROOT, root),
      EXCLUDED_DIRS,
      EXCLUDED_FILE_NAMES,
    ))
    .filter((file) => fs.readFileSync(file, 'utf-8').includes(REGISTER_CALL));

  for (const file of files) {
    const pf = parseFile(file);
    fileByRelPath.set(pf.relPath, pf);

    for (const mod of pf.modules) {
      const adopted = adoptModule(mod, pf, globalClasses);

      if (adopted) {
        resolveModuleClassRefs(adopted, pf, globalClasses, fileByRelPath, globalAliasMap);
        applyGridCoreFeatureArea(adopted);
        mergeInto(merged, adopted);
      }
    }
  }

  return [...merged.values()];
}
