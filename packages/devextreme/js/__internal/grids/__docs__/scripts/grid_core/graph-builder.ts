/* eslint-disable spellcheck/spell-checker, max-depth */
import { MODULE_ITEM_CLASS, MODULES_PREFIX } from './constants';
import type { ArchitectureData } from './types';

interface CytoscapeElement {
  group: 'nodes' | 'edges';
  data: Record<string, unknown>;
  classes?: string;
}

function nonEmpty(value: string): string | undefined {
  return value || undefined;
}

function buildNodeIdMap(data: ArchitectureData): Map<string, string> {
  const map = new Map<string, string>();

  for (const mod of data.modules) {
    for (const [regName, ctrl] of Object.entries(mod.controllers)) {
      const nodeId = `ctrl-${regName}`;
      map.set(ctrl.className, nodeId);
      map.set(regName, nodeId);
    }
    for (const [regName, view] of Object.entries(mod.views)) {
      const nodeId = `view-${regName}`;
      map.set(view.className, nodeId);
      map.set(regName, nodeId);
    }
  }

  for (const [regName, ctrl] of Object.entries(data.standaloneControllers)) {
    const nodeId = `ctrl-${regName}`;
    map.set(ctrl.className, nodeId);
    map.set(regName, nodeId);
  }
  for (const [regName, view] of Object.entries(data.standaloneViews)) {
    const nodeId = `view-${regName}`;
    map.set(view.className, nodeId);
    map.set(regName, nodeId);
  }

  return map;
}

export function buildCytoscapeElements(data: ArchitectureData): CytoscapeElement[] {
  const elements: CytoscapeElement[] = [];
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  const nodeParent = new Map<string, string>(); // nodeId → parentId
  const nodeIdMap = buildNodeIdMap(data);

  function addNode(id: string, nodeData: Record<string, unknown>, classes: string): void {
    if (nodeIds.has(id)) {
      return;
    }

    nodeIds.add(id);
    if (nodeData.parent) {
      nodeParent.set(id, nodeData.parent as string);
    }
    elements.push({ group: 'nodes', data: { id, ...nodeData }, classes });
  }

  function addEdge(
    source: string,
    target: string,
    edgeData: Record<string, unknown>,
    classes: string,
  ): void {
    const id = `e-${source}-${target}-${classes}`;

    if (!nodeIds.has(source) || !nodeIds.has(target) || edgeIds.has(id)) {
      return;
    }

    edgeIds.add(id);

    // Detect edges that will cause "invalid endpoints" with taxi routing
    const srcParent = nodeParent.get(source);
    const tgtParent = nodeParent.get(target);
    const isParentChild = (tgtParent === source) || (srcParent === target);
    const areSiblings = !!(srcParent && srcParent === tgtParent);

    const finalClasses = (isParentChild || areSiblings) ? `${classes} cross-compound` : classes;

    elements.push({
      group: 'edges',
      data: {
        id, source, target, ...edgeData,
      },
      classes: finalClasses,
    });
  }

  // 1. Add module compound nodes and their children
  for (const mod of data.modules) {
    const hasNoControllers = Object.keys(mod.controllers).length === 0;
    const hasNoViews = Object.keys(mod.views).length === 0;
    const isExtOnly = hasNoControllers && hasNoViews;
    const moduleId = `mod-${mod.moduleName}`;

    addNode(moduleId, {
      label: mod.registeredAs ?? mod.moduleName,
      nodeType: 'module',
      sourceFile: mod.sourceFile,
      featureArea: mod.featureArea,
      definesControllers: nonEmpty(Object.keys(mod.controllers).join(', ')),
      definesViews: nonEmpty(Object.keys(mod.views).join(', ')),
      extendsControllers: nonEmpty(Object.keys(mod.extenders.controllers).join(', ')),
      extendsViews: nonEmpty(Object.keys(mod.extenders.views).join(', ')),
    }, isExtOnly ? 'module ext-only' : 'module');

    // Add controller children
    for (const [regName, ctrl] of Object.entries(mod.controllers)) {
      const nodeId = `ctrl-${regName}`;
      addNode(nodeId, {
        label: regName,
        parent: moduleId,
        nodeType: 'controller',
        className: ctrl.className,
        baseClass: ctrl.baseClass,
        mixins: nonEmpty(ctrl.mixins.join(', ')),
        sourceFile: ctrl.sourceFile,
        featureArea: mod.featureArea,
      }, 'gc-target gc-target-controller');
    }

    // Add view children
    for (const [regName, view] of Object.entries(mod.views)) {
      const nodeId = `view-${regName}`;
      addNode(nodeId, {
        label: regName,
        parent: moduleId,
        nodeType: 'view',
        className: view.className,
        baseClass: view.baseClass,
        mixins: nonEmpty(view.mixins.join(', ')),
        sourceFile: view.sourceFile,
        featureArea: mod.featureArea,
      }, 'gc-target gc-target-view');
    }
  }

  // 2. Add standalone controller/view nodes (not inside any module)
  for (const [regName, ctrl] of Object.entries(data.standaloneControllers)) {
    const nodeId = `ctrl-${regName}`;
    addNode(nodeId, {
      label: regName,
      nodeType: 'controller',
      className: ctrl.className,
      baseClass: ctrl.baseClass,
      mixins: nonEmpty(ctrl.mixins.join(', ')),
      sourceFile: ctrl.sourceFile,
      featureArea: ctrl.featureArea,
    }, 'gc-target gc-target-controller');
  }

  for (const [regName, view] of Object.entries(data.standaloneViews)) {
    const nodeId = `view-${regName}`;
    addNode(nodeId, {
      label: regName,
      nodeType: 'view',
      className: view.className,
      baseClass: view.baseClass,
      mixins: nonEmpty(view.mixins.join(', ')),
      sourceFile: view.sourceFile,
      featureArea: view.featureArea,
    }, 'gc-target gc-target-view');
  }

  // 3. Add inheritance edges
  for (const entry of data.inheritanceChains) {
    const sourceId = nodeIdMap.get(entry.class);
    if (!sourceId || !nodeIds.has(sourceId)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (entry.chain.length > 0) {
      for (const base of entry.chain) {
        if (base.startsWith(MODULES_PREFIX) || base === MODULE_ITEM_CLASS) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const targetId = nodeIdMap.get(base);
        if (targetId && nodeIds.has(targetId)) {
          const inheritClass = targetId.startsWith('ctrl-') ? 'edge-inherit-ctrl' : 'edge-inherit-view';
          addEdge(sourceId, targetId, { edgeType: 'inheritance' }, inheritClass);
          break;
        }
      }
    }
  }

  // 4. Add extension edges (from module to target controller/view)
  for (const mod of data.modules) {
    const moduleId = `mod-${mod.moduleName}`;

    for (const [targetName, ext] of Object.entries(mod.extenders.controllers)) {
      const targetId = `ctrl-${targetName}`;
      if (nodeIds.has(targetId)) {
        addEdge(moduleId, targetId, {
          edgeType: 'extension',
          extenderName: ext.extenderName,
        }, 'edge-ext-ctrl');
      }
    }

    for (const [targetName, ext] of Object.entries(mod.extenders.views)) {
      const targetId = `view-${targetName}`;
      if (nodeIds.has(targetId)) {
        addEdge(moduleId, targetId, {
          edgeType: 'extension',
          extenderName: ext.extenderName,
        }, 'edge-ext-view');
      }
    }
  }

  // 5. Add runtime dependency edges
  for (const dep of data.runtimeDependencies) {
    const sourceId = nodeIdMap.get(dep.from);
    const targetId = dep.toType === 'controller' ? `ctrl-${dep.to}` : `view-${dep.to}`;

    if (sourceId && nodeIds.has(sourceId) && nodeIds.has(targetId)) {
      addEdge(sourceId, targetId, {
        edgeType: 'runtime',
        via: dep.via,
      }, 'edge-runtime');
    }
  }

  return elements;
}
