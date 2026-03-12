/* eslint-disable spellcheck/spell-checker */
import type { ArchitectureData, GridCoreModuleInfo } from './types';

interface CytoscapeElement {
  group: 'nodes' | 'edges';
  data: Record<string, unknown>;
  classes?: string;
}

interface EdgeData extends Record<string, unknown> {
  edgeType: string;
  targetName?: string;
}

function findGridCoreModule(
  dgModuleName: string,
  gridCoreModules: GridCoreModuleInfo[],
): GridCoreModuleInfo | undefined {
  return gridCoreModules.find((gc) => gc.registeredAs === dgModuleName);
}

interface ClassInfo {
  className: string;
  baseClass: string;
  sourceFile: string;
}

function buildGcLabel(gcMod: GridCoreModuleInfo): string {
  const parts: string[] = [gcMod.registeredAs ?? gcMod.moduleName];
  const ctrls = Object.keys(gcMod.controllers);
  const vws = Object.keys(gcMod.views);
  if (ctrls.length > 0) parts.push(`ctrl: ${ctrls.join(', ')}`);
  if (vws.length > 0) parts.push(`view: ${vws.join(', ')}`);
  return parts.join('\n');
}

function buildSynthGcData(
  mod: ArchitectureData['modules'][number],
  parentId: string,
): { id: string; data: Record<string, unknown> } | null {
  const gcCtrls = Object.entries(mod.controllers)
    .filter(([, ref]) => ref.isImportedFromGridCore);
  const gcViews = Object.entries(mod.views)
    .filter(([, ref]) => ref.isImportedFromGridCore);
  if (gcCtrls.length === 0 && gcViews.length === 0) return null;

  const labelParts: string[] = [mod.moduleName];
  if (gcCtrls.length > 0) {
    labelParts.push(`ctrl: ${gcCtrls.map(([n]) => n).join(', ')}`);
  }
  if (gcViews.length > 0) {
    labelParts.push(`view: ${gcViews.map(([n]) => n).join(', ')}`);
  }

  const ctrlInfo: Record<string, ClassInfo> = {};
  for (const [regName, ref] of gcCtrls) {
    ctrlInfo[regName] = {
      className: ref.className,
      baseClass: ref.baseClass,
      sourceFile: ref.sourceFile,
    };
  }
  const viewInfo: Record<string, ClassInfo> = {};
  for (const [regName, ref] of gcViews) {
    viewInfo[regName] = {
      className: ref.className,
      baseClass: ref.baseClass,
      sourceFile: ref.sourceFile,
    };
  }

  return {
    id: `gc-synth-${mod.moduleName}`,
    data: {
      label: labelParts.join('\n'),
      nodeType: 'gridCoreModule',
      category: 'grid-core',
      sourceFile: mod.gridCoreSourceModule ?? mod.relPath,
      featureArea: mod.featureArea,
      registrationOrder: -1,
      moduleName: mod.moduleName,
      controllers: JSON.stringify(ctrlInfo),
      views: JSON.stringify(viewInfo),
      extenders: JSON.stringify(mod.extenders),
      parent: parentId,
    },
  };
}

export function buildCytoscapeElements(data: ArchitectureData): CytoscapeElement[] {
  const elements: CytoscapeElement[] = [];
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  function addNode(id: string, nodeData: Record<string, unknown>, classes: string): void {
    if (nodeIds.has(id)) return;
    nodeIds.add(id);
    elements.push({ group: 'nodes', data: { id, ...nodeData }, classes });
  }

  function addEdge(source: string, target: string, edgeData: EdgeData, classes: string): void {
    const tName = edgeData.targetName ?? '';
    const id = `e-${source}-${target}-${edgeData.edgeType}-${tName}`;
    if (!nodeIds.has(source) || !nodeIds.has(target) || edgeIds.has(id)) return;
    edgeIds.add(id);
    elements.push({
      group: 'edges',
      data: {
        id, source, target, ...edgeData,
      },
      classes,
    });
  }

  // ─── Collect all controller/view targets ───────────────────────────────────
  // Targets come from: (1) extender pipelines (gc or dg origin),
  // (2) dg module new controllers/views (always shown even if not extended).
  // GC-defined targets that nobody extends are omitted — they add noise.
  // Track origin: 'gc' if defined by any grid_core module, 'dg' if only data_grid.
  const gcDefinedNames = new Set<string>();
  for (const gcMod of data.gridCoreModules) {
    for (const name of Object.keys(gcMod.controllers)) gcDefinedNames.add(name);
    for (const name of Object.keys(gcMod.views)) gcDefinedNames.add(name);
  }

  const allTargets = new Map<string, { type: 'controller' | 'view'; origin: 'gc' | 'dg' }>();

  for (const pipeline of data.extenderPipelines) {
    allTargets.set(pipeline.targetName, {
      type: pipeline.targetType,
      origin: gcDefinedNames.has(pipeline.targetName) ? 'gc' : 'dg',
    });
  }
  // DataSourceAdapter has the same mixin nature as other extender targets
  if (data.dataSourceAdapterChain.length > 0) {
    allTargets.set('dataSourceAdapter', {
      type: 'controller', origin: 'gc',
    });
  }
  for (const mod of data.modules) {
    for (const name of mod.newControllers) {
      if (!allTargets.has(name)) {
        const origin = gcDefinedNames.has(name) ? 'gc' : 'dg';
        allTargets.set(name, { type: 'controller', origin });
      }
    }
    for (const name of mod.newViews) {
      if (!allTargets.has(name)) {
        const origin = gcDefinedNames.has(name) ? 'gc' : 'dg';
        allTargets.set(name, { type: 'view', origin });
      }
    }
  }

  // ─── Target nodes (each defined controller/view) ──────────────────────────
  for (const [targetName, info] of allTargets) {
    const targetId = `gc-target-${targetName}`;
    const typeLabel = info.type === 'controller' ? 'ctrl' : 'view';
    const originClass = info.origin === 'dg' ? 'dg-target' : 'gc-target';
    addNode(targetId, {
      label: `${targetName}\n(${typeLabel})`,
      nodeType: 'gcTarget',
      category: 'gc-target',
      targetName,
      targetType: info.type,
      targetOrigin: info.origin,
      featureArea: info.origin === 'dg' ? 'DataGrid' : 'Core',
      moduleName: targetName,
    }, `gc-target gc-target-${info.type} ${originClass}`);
  }

  // ─── Identify which gc modules are used ───────────────────────────────────
  const usedGcModules = new Set<string>();
  for (const mod of data.modules) {
    const gc = findGridCoreModule(mod.moduleName, data.gridCoreModules);
    if (gc) {
      usedGcModules.add(gc.moduleName);
    }
  }

  // ─── Data Grid module nodes + embedded GC module nodes ────────────────────
  for (const mod of data.modules) {
    const moduleId = `mod-${mod.moduleName}`;
    const orderNum = mod.registrationOrder + 1;
    const labelParts: string[] = [`#${orderNum} ${mod.moduleName}`];
    if (mod.category !== 'passthrough') labelParts.push(`[${mod.category}]`);
    if (mod.newControllers.length > 0) labelParts.push(`ctrl: ${mod.newControllers.join(', ')}`);
    if (mod.newViews.length > 0) labelParts.push(`view: ${mod.newViews.join(', ')}`);

    addNode(moduleId, {
      label: labelParts.join('\n'),
      nodeType: 'module',
      category: mod.category,
      sourceFile: mod.relPath,
      featureArea: mod.featureArea,
      registrationOrder: mod.registrationOrder,
      details: mod.details,
      gridCoreSource: mod.gridCoreSourceModule ?? '',
      moduleName: mod.moduleName,
    }, `module ${mod.category}`);

    // GC module node — always embedded inside the dg module
    const gc = findGridCoreModule(mod.moduleName, data.gridCoreModules);
    if (gc) {
      const gcId = `gc-${gc.moduleName}`;
      addNode(gcId, {
        label: buildGcLabel(gc),
        nodeType: 'gridCoreModule',
        category: 'grid-core',
        sourceFile: gc.sourceFile,
        featureArea: gc.featureArea,
        registrationOrder: -1,
        moduleName: gc.registeredAs ?? gc.moduleName,
        controllers: JSON.stringify(gc.controllers),
        views: JSON.stringify(gc.views),
        extenders: JSON.stringify(gc.extenders),
        parent: moduleId,
      }, 'module grid-core');
    } else if (mod.category === 'passthrough') {
      // No matching gc module, but controllers/views imported from gc.
      const synth = buildSynthGcData(mod, moduleId);
      if (synth) addNode(synth.id, synth.data, 'module grid-core');
    }
  }

  // ─── "defines" edges ──────────────────────────────────────────────────────
  // From the embedded gc module → gc-target node.
  // Also from dg modules that define their own controllers/views (replaced/new).
  for (const [targetName, { type: targetType }] of allTargets) {
    const targetId = `gc-target-${targetName}`;
    if (!nodeIds.has(targetId)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    for (const gcMod of data.gridCoreModules) {
      if (!usedGcModules.has(gcMod.moduleName)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const defines = (targetType === 'controller' && targetName in gcMod.controllers)
        || (targetType === 'view' && targetName in gcMod.views);
      if (!defines) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const gcId = `gc-${gcMod.moduleName}`;
      if (nodeIds.has(gcId)) {
        addEdge(gcId, targetId, {
          edgeType: 'gc-defines',
          label: 'defines',
          targetName,
        }, 'edge-gc-defines');
      }
    }

    for (const dgMod of data.modules) {
      if (dgMod.category === 'passthrough') {
        // eslint-disable-next-line no-continue
        continue;
      }
      const defines = (targetType === 'controller' && dgMod.newControllers.includes(targetName))
        || (targetType === 'view' && dgMod.newViews.includes(targetName));
      if (defines) {
        addEdge(`mod-${dgMod.moduleName}`, targetId, {
          edgeType: 'gc-defines',
          label: 'defines',
          targetName,
        }, 'edge-gc-defines');
      }
    }
  }

  // ─── Registration order spine ─────────────────────────────────────────────
  for (let i = 0; i < data.modules.length - 1; i += 1) {
    addEdge(
      `mod-${data.modules[i].moduleName}`,
      `mod-${data.modules[i + 1].moduleName}`,
      { edgeType: 'order' },
      'edge-order',
    );
  }

  // ─── DG module extends gc-target edges ────────────────────────────────────
  for (const pipeline of data.extenderPipelines) {
    const { targetName, targetType, steps } = pipeline;
    const targetId = `gc-target-${targetName}`;
    const edgeClass = targetType === 'controller' ? 'edge-ext-ctrl' : 'edge-ext-view';
    for (let i = 0; i < steps.length; i += 1) {
      addEdge(`mod-${steps[i].moduleName}`, targetId, {
        edgeType: 'extender-target',
        targetName,
        targetType,
        label: `#${i + 1}`,
        chainIndex: i,
        chainLength: steps.length,
        stepIsFromGc: steps[i].isFromGridCore,
        stepCategory: steps[i].category,
      }, edgeClass);
    }
  }

  // ─── DataSourceAdapter extender edges (same pattern as other targets) ──────
  const dsaTargetId = 'gc-target-dataSourceAdapter';
  if (nodeIds.has(dsaTargetId)) {
    for (let i = 0; i < data.dataSourceAdapterChain.length; i += 1) {
      const ext = data.dataSourceAdapterChain[i];
      const mod = data.modules.find((m) => m.relPath === ext.relPath);
      if (!mod) {
        // eslint-disable-next-line no-continue
        continue;
      }
      addEdge(`mod-${mod.moduleName}`, dsaTargetId, {
        edgeType: 'extender-target',
        targetName: 'dataSourceAdapter',
        targetType: 'controller',
        label: `#${i + 1}`,
        chainIndex: i,
        chainLength: data.dataSourceAdapterChain.length,
        stepIsFromGc: ext.isImportedFromGridCore,
        stepCategory: mod.category,
      }, 'edge-ext-ctrl');
    }
  }

  return elements;
}
