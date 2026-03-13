#!/usr/bin/env tsx
/* eslint-disable no-console, spellcheck/spell-checker */
import * as fs from 'fs';
import * as path from 'path';

import { DATA_GRID_ROOT, OUTPUT_DIR } from './constants';
import { generateHtml } from './html-template';
import {
  discoverDataGridFiles,
  getRelativePath,
  parseDataGridFile,
  parseModulesOrder,
} from './parser';
import {
  buildCrossDependencies,
  buildExtenderPipelines,
  buildInheritanceChains,
  classifyModules,
  collectDataSourceAdapterChain,
} from './resolver';
import type { ArchitectureData, GridCoreModuleInfo, ParsedFile } from './types';

const GC_JSON_PATH = path.join(OUTPUT_DIR, 'grid_core_architecture.generated.json');

interface CliArgs {
  jsonOnly: boolean;
  htmlOnly: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { jsonOnly: false, htmlOnly: false };

  for (const arg of args) {
    switch (arg) {
      case '--json':
        result.jsonOnly = true;
        break;
      case '--html':
        result.htmlOnly = true;
        break;
      default:
        console.error(`Error: Unknown argument "${arg}"`);
        process.exit(1);
    }
  }

  if (result.jsonOnly && result.htmlOnly) {
    console.error('Error: Cannot specify both --json and --html. Use neither to generate both.');
    process.exit(1);
  }

  return result;
}

function loadGridCoreModules(): GridCoreModuleInfo[] {
  if (!fs.existsSync(GC_JSON_PATH)) {
    console.error(`ERROR: grid_core_architecture.generated.json not found at ${GC_JSON_PATH}`);
    console.error('Please run the grid_core architecture script first:');
    console.error('  npx tsx __docs__/scripts/grid_core/generate-architecture-doc.ts');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(GC_JSON_PATH, 'utf-8'));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: GridCoreModuleInfo[] = (raw.modules ?? []).map((m: any) => ({
    moduleName: m.moduleName,
    registeredAs: m.registeredAs ?? null,
    sourceFile: m.sourceFile,
    featureArea: m.featureArea,
    controllers: m.controllers ?? {},
    views: m.views ?? {},
    extenders: m.extenders ?? { controllers: {}, views: {} },
    hasDefaultOptions: m.hasDefaultOptions ?? false,
  }));

  console.log(`Loaded ${modules.length} grid_core modules from ${GC_JSON_PATH}`);
  return modules;
}

function appendMissingModuleNames(modulesOrder: string[], parsedFiles: ParsedFile[]): void {
  for (const pf of parsedFiles) {
    for (const reg of pf.registerModuleCalls) {
      if (!modulesOrder.includes(reg.moduleName)) {
        modulesOrder.push(reg.moduleName);
      }
    }
  }
}

function main(): void {
  console.log('DataGrid Architecture Documentation Generator');
  console.log(`DataGrid root: ${DATA_GRID_ROOT}`);
  console.log(`Output dir: ${OUTPUT_DIR}`);

  try {
    // 1. Parse module order from source
    // NOTE: registerModulesOrder defines ascending priority.
    // processModules (m_modules.ts) sorts by: orderIndex1 - orderIndex2,
    // which means index 0 processes first and the last index processes last.
    // Extenders are applied in the same ascending order.
    const modulesOrder = parseModulesOrder();
    console.log(`Parsed ${modulesOrder.length} modules from registerModulesOrder (ascending order)`);

    // 2. Load grid_core modules from pre-generated JSON (prerequisite check)
    const gridCoreModules = loadGridCoreModules();

    // 3. Discover data_grid source files
    const sourceFiles = discoverDataGridFiles(DATA_GRID_ROOT);
    console.log(`Discovered ${sourceFiles.length} data_grid source files`);

    // 4. Parse all files
    const allParsedFiles = sourceFiles.flatMap((file) => {
      console.log(`  Parsing: ${getRelativePath(file)}`);
      try {
        return [parseDataGridFile(file)];
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn(`  WARN: Failed to parse ${getRelativePath(file)}: ${msg}`);
        return [];
      }
    });

    // 5. Build full module order
    appendMissingModuleNames(modulesOrder, allParsedFiles);

    // 6. Classify modules
    const allModules = classifyModules(allParsedFiles, modulesOrder, gridCoreModules);
    console.log(`\nClassified ${allModules.length} modules:`);
    const counts = {
      passthrough: 0, extended: 0, replaced: 0, new: 0,
    };
    for (const mod of allModules) {
      counts[mod.category] += 1;
      console.log(`  [${mod.category.toUpperCase().padEnd(11)}] ${mod.moduleName} (${mod.relPath})`);
    }
    console.log(`  Passthrough: ${counts.passthrough}, Replaced: ${counts.replaced}, Extended: ${counts.extended}, New: ${counts.new}`);

    // 7. Build extender pipelines (including gc extenders from passthrough modules)
    const extenderPipelines = buildExtenderPipelines(allModules, gridCoreModules);
    console.log(`\nBuilt ${extenderPipelines.length} extender pipelines:`);
    for (const p of extenderPipelines) {
      console.log(`  ${p.targetType} '${p.targetName}' — ${p.steps.length} step(s): ${p.steps.map((s) => `${s.moduleName}${s.isFromGridCore ? '(gc)' : '(dg)'}`).join(' → ')}`);
    }

    // 8. Collect DataSourceAdapter chain
    const dsaChain = collectDataSourceAdapterChain(allParsedFiles);
    console.log(`\nDataSourceAdapter chain (${dsaChain.length} extensions):`);
    for (const ext of dsaChain) {
      console.log(`  ${ext.order + 1}. ${ext.extenderName} (${ext.relPath})${ext.isImportedFromGridCore ? ' [from grid_core]' : ''}`);
    }

    // 9. Build inheritance chains
    const inheritanceChains = buildInheritanceChains(allParsedFiles);
    console.log(`\nBuilt ${inheritanceChains.length} inheritance chains`);

    // 10. Build cross-dependencies
    const crossDependencies = buildCrossDependencies(allParsedFiles, allModules);
    console.log(`\nFound ${crossDependencies.length} cross-dependencies:`);
    for (const dep of crossDependencies) {
      const toLabel = dep.toModule ?? dep.toRelPath;
      console.log(`  ${dep.fromModule} → ${toLabel} [${dep.importedNames.join(', ')}]`);
    }

    // 11. Build output data
    const data: ArchitectureData = {
      generatedAt: new Date().toISOString(),
      dataGridRoot: 'packages/devextreme/js/__internal/grids/data_grid',
      gridCoreRoot: 'packages/devextreme/js/__internal/grids/grid_core',
      modulesOrder,
      modules: allModules,
      gridCoreModules,
      extenderPipelines,
      dataSourceAdapterChain: dsaChain,
      inheritanceChains,
      crossDependencies,
      summary: { total: allModules.length, ...counts },
    };

    // 12. Write output files
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const args = parseArgs();

    if (!args.htmlOnly) {
      const jsonPath = path.join(OUTPUT_DIR, 'data_grid_architecture.generated.json');
      fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
      console.log(`\nJSON written to: ${jsonPath}`);
    }

    if (!args.jsonOnly) {
      const htmlPath = path.join(OUTPUT_DIR, 'data_grid_architecture.generated.html');
      fs.writeFileSync(htmlPath, generateHtml(data));
      console.log(`HTML written to: ${htmlPath}`);
    }

    console.log('\nDone.');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`ERROR: ${msg}`);
    if (e instanceof Error && e.stack) {
      console.error(e.stack);
    }
    process.exit(1);
  }
}

main();
