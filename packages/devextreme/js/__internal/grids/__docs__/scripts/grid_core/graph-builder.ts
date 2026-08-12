/* eslint-disable spellcheck/spell-checker, max-depth */
import type { CytoscapeElement } from '../shared/graph-context';
import { createGraphContext } from '../shared/graph-context';
import { MODULE_ITEM_CLASS, MODULES_PREFIX } from './constants';
import type { ArchitectureData, ExtenderKind, ExtenderRef } from './types';

const EXTENDER_KINDS: ExtenderKind[] = ['controllers', 'views'];

function nonEmpty(value: string): string | undefined {
  return value || undefined;
}

function extenderNodeId(ref: ExtenderRef): string {
  return `ext-${ref.module}-${ref.kind}-${ref.target}`;
}

function targetNodeId(kind: ExtenderKind, target: string): string {
  return kind === 'controllers' ? `ctrl-${target}` : `view-${target}`;
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
  const ctx = createGraphContext({ trackParent: true });
  const {
    elements, nodeIds, edgeIds, nodeParent, addNode,
  } = ctx;
  const nodeIdMap = buildNodeIdMap(data);

  function addEdge(
    source: string,
    target: string,
    edgeData: Record<string, unknown>,
    classes: string,
  ): void {
    // ID keyed by classes — safe because each edge type (inheritance, extension,
    // runtime) uses a distinct class string, and at most one edge of each type
    // exists per source→target pair.
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

    // Add one extender child per extended target (shown when the module is expanded)
    for (const kind of EXTENDER_KINDS) {
      for (const [target, ext] of Object.entries(mod.extenders[kind])) {
        const ref: ExtenderRef = { module: mod.moduleName, kind, target };
        const shapeClass = kind === 'controllers' ? 'gc-ext-controller' : 'gc-ext-view';

        addNode(extenderNodeId(ref), {
          label: target,
          parent: moduleId,
          ownerModule: moduleId,
          nodeType: 'extender',
          extenderKind: kind === 'controllers' ? 'controller' : 'view',
          extenderName: ext.extenderName,
          extenderClass: ext.extenderClass,
          extendsTarget: target,
          moduleName: mod.registeredAs ?? mod.moduleName,
          sourceFile: ext.sourceFile ?? mod.sourceFile,
          featureArea: mod.featureArea,
        }, `gc-ext ${shapeClass} view-detailed`);
      }
    }

    // Expand/collapse affordance, only for modules that actually have extenders
    const extenderCount = Object.keys(mod.extenders.controllers).length
      + Object.keys(mod.extenders.views).length;

    if (extenderCount > 0) {
      addNode(`modtoggle-${mod.moduleName}`, {
        label: '+',
        parent: moduleId,
        ownerModule: moduleId,
        nodeType: 'moduleToggle',
        extenderCount,
        featureArea: mod.featureArea,
      }, 'mod-toggle no-select');
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
    const sourceId = nodeIdMap.get(entry.className);
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
          addEdge(sourceId, targetId, { edgeType: 'inheritance', label: sourceId.replace(/^(ctrl|view)-/, '') }, inheritClass);
          break;
        }
      }
    }
  }

  // 4. Add extension edges. Two variants of the same relation:
  //    dense    — module → target, the collapsed overview
  //    detailed — extender node → target, showing which extender binds what
  for (const mod of data.modules) {
    const moduleId = `mod-${mod.moduleName}`;

    for (const kind of EXTENDER_KINDS) {
      const edgeClass = kind === 'controllers' ? 'edge-ext-ctrl' : 'edge-ext-view';

      for (const [target, ext] of Object.entries(mod.extenders[kind])) {
        const targetId = targetNodeId(kind, target);
        if (!nodeIds.has(targetId)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const edgeData = {
          edgeType: 'extension',
          extenderName: ext.extenderName,
          extenderClass: ext.extenderClass,
          ownerModule: moduleId,
          label: mod.registeredAs ?? mod.moduleName,
        };

        addEdge(moduleId, targetId, edgeData, `${edgeClass} view-dense`);
        addEdge(
          extenderNodeId({ module: mod.moduleName, kind, target }),
          targetId,
          edgeData,
          `${edgeClass} view-detailed`,
        );
      }
    }
  }

  // 5. Add runtime dependency edges.
  //    A call inside an extender belongs to that extender, not to the base class
  //    it is named after: collapsed it is drawn from the module, expanded from the
  //    extender — landing on the module's own extender of the target if it has one.
  const classModule = new Map<string, string>();
  for (const mod of data.modules) {
    for (const ctrl of Object.values(mod.controllers)) {
      classModule.set(ctrl.className, mod.moduleName);
    }
    for (const view of Object.values(mod.views)) {
      classModule.set(view.className, mod.moduleName);
    }
  }
  const moduleByName = new Map(data.modules.map((mod) => [mod.moduleName, mod]));

  /** The module's own extender node for `target`, if it registers one. */
  function ownExtenderId(moduleName: string, kind: ExtenderKind, target: string): string | null {
    const mod = moduleByName.get(moduleName);
    if (!mod?.extenders[kind][target]) {
      return null;
    }
    const id = extenderNodeId({ module: moduleName, kind, target });

    return nodeIds.has(id) ? id : null;
  }

  for (const dep of data.runtimeDependencies) {
    const kind: ExtenderKind = dep.toType === 'controller' ? 'controllers' : 'views';
    const targetId = targetNodeId(kind, dep.to);
    if (!nodeIds.has(targetId)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const edgeData = { edgeType: 'runtime', via: dep.via, location: dep.location };

    if (dep.fromExtender) {
      const ownerModule = `mod-${dep.fromExtender.module}`;
      const sourceId = extenderNodeId(dep.fromExtender);
      const own = ownExtenderId(dep.fromExtender.module, kind, dep.to);

      addEdge(sourceId, own && own !== sourceId ? own : targetId, {
        ...edgeData,
        ownerModule,
        extenderName: dep.from,
      }, 'edge-runtime view-detailed');
      addEdge(ownerModule, targetId, { ...edgeData, ownerModule }, 'edge-runtime view-dense');
      // eslint-disable-next-line no-continue
      continue;
    }

    const sourceId = nodeIdMap.get(dep.from);
    if (!sourceId || !nodeIds.has(sourceId)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const ownerName = classModule.get(dep.from);
    const own = ownerName ? ownExtenderId(ownerName, kind, dep.to) : null;

    if (own && own !== sourceId) {
      const ownerModule = `mod-${ownerName}`;
      addEdge(sourceId, targetId, { ...edgeData, ownerModule }, 'edge-runtime view-dense');
      addEdge(sourceId, own, { ...edgeData, ownerModule }, 'edge-runtime view-detailed');
    } else {
      addEdge(sourceId, targetId, edgeData, 'edge-runtime');
    }
  }

  return elements;
}
