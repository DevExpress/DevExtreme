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

  // ─── Grid Core module nodes (barrel shape, dashed orange) ─────────────────
  const usedGcModules = new Set<string>();
  for (const mod of data.modules) {
    const gc = findGridCoreModule(mod.moduleName, data.gridCoreModules);
    if (gc) usedGcModules.add(gc.moduleName);
  }

  for (const gcMod of data.gridCoreModules) {
    if (!usedGcModules.has(gcMod.moduleName)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const gcId = `gc-${gcMod.moduleName}`;
    const labelParts: string[] = [gcMod.registeredAs ?? gcMod.moduleName];
    const ctrls = Object.keys(gcMod.controllers);
    const vws = Object.keys(gcMod.views);
    const extCtrls = Object.keys(gcMod.extenders.controllers);
    const extVws = Object.keys(gcMod.extenders.views);
    if (ctrls.length > 0) labelParts.push(`ctrl: ${ctrls.join(', ')}`);
    if (vws.length > 0) labelParts.push(`view: ${vws.join(', ')}`);
    if (extCtrls.length > 0) labelParts.push(`ext ctrl: ${extCtrls.join(', ')}`);
    if (extVws.length > 0) labelParts.push(`ext view: ${extVws.join(', ')}`);

    addNode(gcId, {
      label: labelParts.join('\n'),
      nodeType: 'gridCoreModule',
      category: 'grid-core',
      sourceFile: gcMod.sourceFile,
      featureArea: gcMod.featureArea,
      registrationOrder: -1,
      moduleName: gcMod.registeredAs ?? gcMod.moduleName,
      controllers: JSON.stringify(gcMod.controllers),
      views: JSON.stringify(gcMod.views),
      extenders: JSON.stringify(gcMod.extenders),
    }, 'module grid-core');
  }

  // ─── Data Grid module nodes ───────────────────────────────────────────────
  for (const mod of data.modules) {
    const moduleId = `mod-${mod.moduleName}`;
    const orderNum = mod.registrationOrder + 1;
    const labelParts: string[] = [`#${orderNum} ${mod.moduleName}`];
    if (mod.category !== 'passthrough') labelParts.push(`[${mod.category}]`);

    const extCtrl = mod.overriddenExtenderControllers;
    const extView = mod.overriddenExtenderViews;
    if (extCtrl.length > 0) labelParts.push(`ext ctrl: ${extCtrl.join(', ')}`);
    if (extView.length > 0) labelParts.push(`ext view: ${extView.join(', ')}`);
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
  }

  // ─── Grid Core → Data Grid source edges ───────────────────────────────────
  for (const mod of data.modules) {
    const gcMod = findGridCoreModule(mod.moduleName, data.gridCoreModules);
    if (gcMod) {
      addEdge(`gc-${gcMod.moduleName}`, `mod-${mod.moduleName}`, {
        edgeType: 'grid-core-source',
        label: mod.category === 'passthrough' ? 'passthrough' : mod.category,
      }, 'edge-gc-source');
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

  // ─── Extender chain edges ─────────────────────────────────────────────────
  for (const pipeline of data.extenderPipelines) {
    const { targetName, targetType, steps } = pipeline;
    const edgeClass = targetType === 'controller' ? 'edge-ext-ctrl' : 'edge-ext-view';
    for (let i = 0; i < steps.length - 1; i += 1) {
      addEdge(`mod-${steps[i].moduleName}`, `mod-${steps[i + 1].moduleName}`, {
        edgeType: 'extender-chain',
        targetName,
        targetType,
        label: targetName,
        chainIndex: i,
        chainLength: steps.length,
      }, edgeClass);
    }
  }

  // ─── DataSourceAdapter chain edges ────────────────────────────────────────
  const dsaOrder: { moduleName: string }[] = [];
  for (const ext of data.dataSourceAdapterChain) {
    const mod = data.modules.find((m) => m.relPath === ext.relPath);
    if (mod) dsaOrder.push({ moduleName: mod.moduleName });
  }
  for (let i = 0; i < dsaOrder.length - 1; i += 1) {
    addEdge(`mod-${dsaOrder[i].moduleName}`, `mod-${dsaOrder[i + 1].moduleName}`, {
      edgeType: 'dsa-chain', targetName: 'DataSourceAdapter', label: 'DSA',
    }, 'edge-dsa');
  }

  // ─── Cross-dependency edges ───────────────────────────────────────────────
  for (const dep of data.crossDependencies) {
    const sourceId = `mod-${dep.fromModule}`;
    let targetId: string | null = null;

    if (dep.toModule) {
      targetId = `mod-${dep.toModule}`;
    } else {
      const utilId = `util-${dep.toRelPath}`;
      const fileName = dep.toRelPath.split('/').pop() ?? dep.toRelPath;
      const shortName = fileName.replace(/\.ts$/, '').replace(/^m_/, '');
      addNode(utilId, {
        label: shortName,
        nodeType: 'utility',
        sourceFile: dep.toRelPath,
        featureArea: 'Shared',
        moduleName: shortName,
      }, 'module utility');
      targetId = utilId;
    }

    if (targetId && nodeIds.has(sourceId) && nodeIds.has(targetId)) {
      addEdge(sourceId, targetId, {
        edgeType: 'cross-dep',
        label: dep.importedNames.join(', '),
        targetName: dep.importedNames.join(', '),
        toRelPath: dep.toRelPath,
      }, 'edge-cross-dep');
    }
  }

  return elements;
}
