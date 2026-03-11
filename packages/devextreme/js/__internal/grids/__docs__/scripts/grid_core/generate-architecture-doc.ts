#!/usr/bin/env tsx
/* eslint-disable no-console, no-restricted-syntax */
import * as fs from 'fs';
import * as path from 'path';

import { parseArgs } from './cli';
import { GRID_CORE_ROOT, OUTPUT_DIR } from './constants';
import { generateHtml } from './html-template';
import { discoverSourceFiles, getRelativePath, parseFile } from './parser';
import {
  buildGlobalAliasMap,
  buildGlobalClassRegistry,
  buildInheritanceChains,
  findStandaloneRegistrations,
  resolveAliasesInClasses,
  resolveModuleClassRefs,
  resolveRuntimeDeps,
  validateData,
} from './resolver';
import type { ArchitectureData, ModuleInfo } from './types';

function countItems(modules: ModuleInfo[], key: 'controllers' | 'views'): number {
  return modules.reduce((sum, m) => sum + Object.keys(m[key]).length, 0);
}

function main(): void {
  console.log('Grid Core Architecture Documentation Generator');
  console.log(`Source root: ${GRID_CORE_ROOT}`);
  console.log(`Output dir: ${OUTPUT_DIR}`);

  try {
    // 1. Discover source files
    const sourceFiles = discoverSourceFiles(GRID_CORE_ROOT);
    console.log(`Discovered ${sourceFiles.length} source files`);

    // 2. Parse all files
    const allParsedFiles = sourceFiles.flatMap((file) => {
      console.log(`Parsing: ${getRelativePath(file)}`);
      try {
        return [parseFile(file)];
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn(`WARN: Failed to parse ${getRelativePath(file)}: ${errorMessage}`);

        return [];
      }
    });

    // 2a. Build global class registry
    const globalClasses = buildGlobalClassRegistry(allParsedFiles);
    console.log(`Global class registry: ${globalClasses.size} classes`);

    // 2b. Build global import alias map
    const globalAliasMap = buildGlobalAliasMap(allParsedFiles);
    console.log(`Global alias map: ${globalAliasMap.size} aliases`);

    // 2c. Resolve aliases
    resolveAliasesInClasses(globalClasses, globalAliasMap);

    // 3. Collect modules and re-resolve cross-file class references
    const modules: ModuleInfo[] = [];
    for (const pf of allParsedFiles) {
      for (const mod of pf.modules) {
        resolveModuleClassRefs(mod, pf, globalClasses, allParsedFiles, globalAliasMap);
        modules.push(mod);
      }
    }
    modules.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    console.log(`Found ${modules.length} modules`);

    // 4. Find standalone controllers and views (not registered in any module)
    const {
      controllers: standaloneControllers,
      views: standaloneViews,
    } = findStandaloneRegistrations(modules, globalClasses);
    console.log(`Found ${Object.keys(standaloneControllers).length} standalone controllers, ${Object.keys(standaloneViews).length} standalone views`);

    // 5. Build inheritance chains
    const inheritanceChains = buildInheritanceChains(
      modules,
      standaloneControllers,
      standaloneViews,
      globalClasses,
    );
    console.log(`Built ${inheritanceChains.length} inheritance chains`);

    // 6. Resolve runtime dependencies
    const runtimeDependencies = resolveRuntimeDeps(allParsedFiles, modules);
    console.log(`Found ${runtimeDependencies.length} runtime dependencies`);

    // 7. Validate
    validateData(modules, standaloneControllers, standaloneViews, runtimeDependencies);

    // 8. Build output data
    const data: ArchitectureData = {
      generatedAt: new Date().toISOString(),
      sourceRoot: 'packages/devextreme/js/__internal/grids/grid_core',
      modules,
      standaloneControllers,
      standaloneViews,
      runtimeDependencies,
      inheritanceChains,
    };

    // 9. Write output files
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const args = parseArgs();
    if (!args.htmlOnly) {
      const jsonPath = path.join(OUTPUT_DIR, 'grid_core_architecture.generated.json');
      fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
      console.log(`✓ JSON written to: ${jsonPath}`);
    }

    if (!args.jsonOnly) {
      const htmlPath = path.join(OUTPUT_DIR, 'grid_core_architecture.generated.html');
      fs.writeFileSync(htmlPath, generateHtml(data));
      console.log(`✓ HTML written to: ${htmlPath}`);
    }

    console.log('\nSummary:');
    console.log(`  Modules: ${modules.length}`);
    console.log(`  Controllers: ${countItems(modules, 'controllers')}`);
    console.log(`  Views: ${countItems(modules, 'views')}`);
    console.log(`  Extension-only modules: ${modules.filter((m) => Object.keys(m.controllers).length === 0 && Object.keys(m.views).length === 0).length}`);
    console.log(`  Standalone controllers: ${Object.keys(standaloneControllers).length}`);
    console.log(`  Standalone views: ${Object.keys(standaloneViews).length}`);
    console.log(`  Runtime dependencies: ${runtimeDependencies.length}`);
    console.log(`  Inheritance chains: ${inheritanceChains.length}`);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(`ERROR: ${errorMessage}`);
    process.exit(1);
  }
}

main();
