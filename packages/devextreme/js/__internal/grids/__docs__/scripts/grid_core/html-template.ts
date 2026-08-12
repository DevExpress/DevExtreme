/* eslint-disable spellcheck/spell-checker */
/**
 * HTML visualization template for Grid Core Architecture Documentation Generator.
 * Generates an interactive Cytoscape.js visualization.
 */

import {
  BASE_CSS,
  EXTENDER_EDGE_BASE_STYLES,
  GC_TARGET_CYTOSCAPE_STYLES,
  HIGHLIGHT_CYTOSCAPE_STYLES,
  LABEL_SIZE_HELPERS_JS,
  SHARED_INTERACTIVE_JS,
} from '../shared/html-helpers';
import { buildCytoscapeElements } from './graph-builder';
import type { ArchitectureData } from './types';

export function generateHtml(data: ArchitectureData): string {
  const cytoscapeElements = buildCytoscapeElements(data);
  const elementsJson = JSON.stringify(cytoscapeElements, null, 2);
  const featureAreas = [...new Set([
    ...data.modules.map((m) => m.featureArea),
    ...Object.values(data.standaloneControllers).map((c) => c.featureArea),
    ...Object.values(data.standaloneViews).map((v) => v.featureArea),
  ])].sort();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Grid Core Architecture</title>
<!-- AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. -->
<!-- Generated at: ${data.generatedAt} -->
<script src="https://unpkg.com/cytoscape@3.30.4/dist/cytoscape.min.js"></script>
<style>
${BASE_CSS}
.tag-ctrl{background:#1e1e3a;color:#bae6fd;border:1px solid #7dd3fc33}
.tag-view{background:#1e1e3a;color:#d8b4fe;border:1px solid #c084fc33}
.tag-ext{background:#3a2a00;color:#f5c040;border:1px solid #f5c04033}
.hint{margin:4px 0 0;font-size:10px;color:#888;line-height:1.4}
</style>
</head>
<body>
<div id="sidebar">
  <div>
    <h2>Search</h2>
    <input type="text" id="search" placeholder="Type to search..." />
  </div>
  <div>
    <h2>View</h2>
    <div class="radio-group">
      <label><input type="radio" name="view-mode" value="dense" checked> Dense (collapse all)</label>
      <label><input type="radio" name="view-mode" value="detailed"> Detailed (expand all)</label>
    </div>
    <p class="hint">Use <b>+</b> / <b>&minus;</b> inside a module to expand it on its own.</p>
  </div>
  <div>
    <h2>Edge Types</h2>
    <label class="select-all-row"><input type="checkbox" id="toggle-all-edges" checked> Select / Unselect All</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-inherit-ctrl" checked> Inheritance (ctrl)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-inherit-view" checked> Inheritance (view)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-ext-ctrl" checked> Extender Chain (ctrl)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-ext-view" checked> Extender Chain (view)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-runtime" checked> Runtime Dependencies</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-owns" checked> Ownership</label>
  </div>
  <div>
    <h2>Feature Areas</h2>
    <label class="select-all-row"><input type="checkbox" id="toggle-all-areas" checked> Select / Unselect All</label>
    ${featureAreas.map((area) => `<label><input type="checkbox" class="area-toggle" data-area="${area}" checked> ${area}</label>`).join('\n    ')}
  </div>
  <div>
    <h2>Edge Routing</h2>
    <div class="radio-group">
      <label><input type="radio" name="edge-routing" value="bezier" checked> Bezier</label>
      <label><input type="radio" name="edge-routing" value="taxi"> Orthogonal</label>
    </div>
  </div>
  <div>
    <button id="btn-fit">Fit View</button>
    <button id="btn-reset">Reset</button>
  </div>
  <div id="legend">
    <h2>Legend</h2>
    <div class="leg-item"><div class="leg-sw" style="background:#1e1e3a;border:2px solid #7dd3fc;clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);width:20px;height:16px"></div> Controller</div>
    <div class="leg-item"><div class="leg-sw" style="background:#1e1e3a;border:2px solid #c084fc;border-radius:50%"></div> View</div>
    <div class="leg-item"><div class="leg-sw" style="background:#1a1a2e;border:2px dashed #f59e0b"></div> Module (compound)</div>
    <div class="leg-item"><div class="leg-sw" style="background:#2a2410;border:2px solid #f5c040;clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);width:20px;height:16px"></div> Extender of controller</div>
    <div class="leg-item"><div class="leg-sw" style="background:#2a2410;border:2px solid #f5c040;border-radius:50%"></div> Extender of view</div>
    <div class="leg-item"><div class="leg-sw" style="background:#10312e;border:2px dotted #5eead4;clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);width:20px;height:16px"></div> Owned (not registered)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2px dashed #0ea5e9"></div> Inheritance (ctrl)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2px dashed #a855f7"></div> Inheritance (view)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #0ea5e9"></div> Extender (ctrl)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #a855f7"></div> Extender (view)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2px dotted #f6e05e;opacity:0.5"></div> Runtime Dependency</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2px solid #5eead4"></div> Ownership</div>
  </div>
</div>
<div id="main">
  <div id="cy"></div>
  <div id="info-panel-wrap">
    <div id="info-panel">
      <button id="btn-toggle-panel" title="Move panel to right">&#x2192;</button>
      <div id="info-content">
        <p style="color:#888;">Click a node or edge to see details.</p>
      </div>
    </div>
  </div>
</div>

<script>
const ELEMENTS = ${elementsJson};

// Shared label sizing helpers (replaces deprecated 'width': 'label' / 'height': 'label')
${LABEL_SIZE_HELPERS_JS}

const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: ELEMENTS,
  style: [
    // Compound nodes (modules) — grid-core barrel style with label overrides
    { selector: 'node.module',
      style: {
        'shape': 'barrel',
        'background-color': '#1a1a2e',
        'background-opacity': 0.5,
        'border-width': 2,
        'border-style': 'dashed',
        'border-color': '#f59e0b',
        'label': 'data(label)',
        'text-valign': 'top',
        'text-halign': 'center',
        'font-size': 11,
        'font-weight': 'bold',
        'color': '#E8E8E8',
        'padding': '12px',
        'text-margin-y': -4,
      }
    },
    // Extension-only modules
    { selector: 'node.module.ext-only',
      style: { 'min-width': 80, 'min-height': 30 }
    },
    // GC-target nodes (shared styles for controller/view)
    ${GC_TARGET_CYTOSCAPE_STYLES}
    // Grid_core-specific: explicit sizing for gc-target nodes
    { selector: 'node.gc-target-controller',
      style: { 'width': labelWidth(9), 'height': 30 }
    },
    { selector: 'node.gc-target-view',
      style: { 'width': labelWidth(9), 'height': 26 }
    },
    // Extender nodes — same shape as the target they extend, amber accent
    { selector: 'node.gc-ext',
      style: {
        'background-color': '#2a2410',
        'background-opacity': 0.75,
        'border-width': 2,
        'border-style': 'solid',
        'border-color': '#f5c040',
        'color': '#f5c040',
        'font-size': 8,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '110px',
        'padding': '10px',
        'label': 'data(label)',
      }
    },
    { selector: 'node.gc-ext-controller',
      style: { 'shape': 'hexagon', 'width': labelWidth(8), 'height': 26 }
    },
    { selector: 'node.gc-ext-view',
      style: { 'shape': 'ellipse', 'width': labelWidth(8), 'height': 24 }
    },
    // Per-module expand/collapse button
    { selector: 'node.mod-toggle',
      style: {
        'shape': 'round-rectangle',
        'width': 16,
        'height': 16,
        'background-color': '#3a2a00',
        'background-opacity': 1,
        'border-width': 1,
        'border-color': '#f59e0b',
        'label': 'data(label)',
        'color': '#f5c040',
        'font-size': 12,
        'font-weight': 'bold',
        'text-valign': 'center',
        'text-halign': 'center',
        'z-index': 900,
      }
    },
    { selector: 'node.mod-toggle.expanded',
      style: { 'background-color': '#f59e0b', 'color': '#1a1a2e' }
    },
    // Inheritance edges (ctrl) — dashed, same color as extension ctrl
    { selector: 'edge.edge-inherit-ctrl',
      style: {
        'line-color': '#0ea5e9', 'target-arrow-color': '#0ea5e9',
        'target-arrow-shape': 'triangle', 'line-style': 'dashed',
        'curve-style': 'bezier', 'width': 2, 'arrow-scale': 0.8, 'opacity': 0.8,
        'target-label': 'data(label)', 'font-size': 8, 'color': '#5bb8e8',
        'target-text-offset': 80,
        'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
        'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
      }
    },
    // Inheritance edges (view) — dashed, same color as extension view
    { selector: 'edge.edge-inherit-view',
      style: {
        'line-color': '#a855f7', 'target-arrow-color': '#a855f7',
        'target-arrow-shape': 'triangle', 'line-style': 'dashed',
        'curve-style': 'bezier', 'width': 2, 'arrow-scale': 0.8, 'opacity': 0.8,
        'target-label': 'data(label)', 'font-size': 8, 'color': '#c090f0',
        'target-text-offset': 80,
        'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
        'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
      }
    },
    // Extension edges (shared base styles)
    ${EXTENDER_EDGE_BASE_STYLES}
    // Grid_core-specific: add opacity and label styles to extender edges
    { selector: 'edge.edge-ext-ctrl',
      style: {
        'opacity': 0.8,
        'target-label': 'data(label)', 'font-size': 8, 'color': '#5bb8e8',
        'target-text-offset': 80,
        'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
        'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
      }
    },
    { selector: 'edge.edge-ext-view',
      style: {
        'opacity': 0.8,
        'target-label': 'data(label)', 'font-size': 8, 'color': '#c090f0',
        'target-text-offset': 80,
        'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
        'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
      }
    },
    // Runtime dependency edges — dotted, yellow
    { selector: 'edge.edge-runtime',
      style: {
        'line-color': '#f6e05e', 'target-arrow-color': '#f6e05e',
        'target-arrow-shape': 'triangle', 'line-style': 'dotted',
        'curve-style': 'bezier', 'width': 1, 'arrow-scale': 0.6, 'opacity': 0.5,
      }
    },
    // Owned classes — created with 'new', never reachable through the registry
    { selector: 'node.gc-owned',
      style: {
        'border-style': 'dotted',
        'border-color': '#5eead4',
        'color': '#99f6e4',
        'background-color': '#10312e',
      }
    },
    // Ownership edges — solid, arrow from the owner to what it creates
    { selector: 'edge.edge-owns',
      style: {
        'line-color': '#5eead4', 'target-arrow-color': '#5eead4',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier', 'width': 1.5, 'arrow-scale': 0.7, 'opacity': 0.75,
      }
    },
    // Highlighted state
    ${HIGHLIGHT_CYTOSCAPE_STYLES}
    { selector: 'node.gc-target, node.gc-ext, node.mod-toggle',
      style: {
        'z-compound-depth': 'top',
        'background-opacity': 1,
        'text-outline-width': 2,
        'text-outline-opacity': 1,
      }
    },
    { selector: 'node.gc-target',
      style: { 'text-outline-color': '#1e1e3a' }
    },
    { selector: 'node.gc-owned',
      style: { 'text-outline-color': '#10312e' }
    },
    { selector: 'node.gc-ext',
      style: { 'text-outline-color': '#2a2410' }
    },
    { selector: 'node.mod-toggle',
      style: { 'text-outline-color': '#3a2a00' }
    },
    { selector: 'edge',
      style: { 'control-point-step-size': 34 }
    },
    { selector: 'edge[label]',
      style: {
        'text-background-opacity': 1,
        'text-background-padding': '3px',
        'text-border-width': 1,
        'text-border-color': '#2f2f4a',
        'text-border-opacity': 1,
      }
    },
    // Cross-compound edges must use bezier to avoid "invalid endpoints" warnings with taxi routing
    { selector: 'edge.cross-compound',
      style: { 'curve-style': 'bezier' }
    },
  ],
  layout: { name: 'preset' },
});

// ── Edge Routing Helper ─────────────────────────
// Note: getEdgeRouting() and hasOverlappingBounds() are provided by SHARED_INTERACTIVE_JS

/** Give each edge in a same-pair bundle its own taxi turn so they stay distinct. */
function separateParallelTaxiEdges() {
  var groups = {};
  cy.edges().not('.cross-compound').forEach(function(edge) {
    if (edge.style('curve-style') !== 'taxi') return;
    var key = edge.data('source') + '|' + edge.data('target');
    if (!groups[key]) groups[key] = [];
    groups[key].push(edge);
  });
  Object.keys(groups).forEach(function(key) {
    var group = groups[key];
    if (group.length < 2) return;
    group.sort(function(a, b) { return a.id().localeCompare(b.id()); });
    for (var i = 0; i < group.length; i++) {
      group[i].style('taxi-turn', (35 + i * 18) + '%');
    }
  });
}

function updateEdgeStyles() {
  const curveStyle = getEdgeRouting();

  if (curveStyle === 'taxi') {
    // Apply taxi only to non-cross-compound edges
    cy.edges().not('.cross-compound').style({
      'curve-style': 'taxi',
      'taxi-direction': 'downward',
      'taxi-turn': '50%',
    });
    // Force bezier for cross-compound edges (siblings / parent-child)
    cy.edges('.cross-compound').style({
      'curve-style': 'bezier',
      'taxi-direction': null,
      'taxi-turn': null,
    });
    // Revert to bezier for edges with overlapping/adjacent endpoints
    cy.edges().not('.cross-compound').forEach(function(edge) {
      const src = edge.source();
      const tgt = edge.target();
      if (tgt.data('parent') === src.id() || src.data('parent') === tgt.id() || hasOverlappingBounds(edge)) {
        edge.style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
      }
    });
    // Taxi routing has no equivalent of bezier's parallel-edge bundling, so
    // edges sharing a node pair would trace one path. Stagger their turns.
    separateParallelTaxiEdges();
  } else {
    cy.edges().not('.cross-compound').style({
      'curve-style': curveStyle,
      'taxi-direction': null,
      'taxi-turn': null,
    });
    cy.edges('.cross-compound').style({
      'curve-style': 'bezier',
      'taxi-direction': null,
      'taxi-turn': null,
    });
    cy.edges().not('.cross-compound').forEach(function(edge) {
      var src = edge.source();
      var tgt = edge.target();
      if (tgt.data('parent') === src.id() || src.data('parent') === tgt.id() || hasOverlappingBounds(edge)) {
        edge.style({ 'curve-style': 'bezier' });
      }
    });
  }
}

// ── Expansion state: which modules show their extenders ──
// Collapsed (dense) is the default. The View radios expand/collapse every
// module at once; the +/- button on a module toggles just that one.

var expandedModules = new Set();

function isExpanded(modId) {
  return expandedModules.has(modId);
}

/** The controller/view node an extender node binds to. */
function extenderTargetId(n) {
  var prefix = n.data('extenderKind') === 'controller' ? 'ctrl-' : 'view-';
  return prefix + n.data('extendsTarget');
}

/** Children that take part in the current layout (toggles are placed by hand). */
function visibleChildren(mod) {
  var expanded = isExpanded(mod.id());
  return mod.children().filter(function(c) {
    if (c.hasClass('mod-toggle')) return false;
    return expanded || !c.hasClass('gc-ext');
  });
}

// ── Dependency-levels custom layout ──────────────

function runDepLevelsLayout() {
  // 1. Collect targets (leaf nodes: controllers & views)
  var targets = cy.nodes('.gc-target-controller, .gc-target-view');
  var extenders = cy.nodes('.gc-ext');
  var modules = cy.nodes('.module');

  // 2. Build dependency map: target → set of target ids it depends on.
  //    Inheritance alone leaves nearly every module on level 0, so extension
  //    counts too: a module's own targets sit above everything it extends.
  var deps = {};
  targets.forEach(function(n) { deps[n.id()] = new Set(); });

  // Inheritance: target → target
  cy.edges('.edge-inherit-ctrl, .edge-inherit-view').forEach(function(e) {
    var src = e.source().id();
    var tgt = e.target().id();
    if (deps[src]) deps[src].add(tgt);
  });

  // Extension: module → target, taken from the collapsed edges so the source is
  // the module itself. Every child of that module depends on the extended target.
  cy.edges('.edge-ext-ctrl.view-dense, .edge-ext-view.view-dense').forEach(function(e) {
    var extTarget = e.target().id();
    e.source().children().forEach(function(child) {
      if (deps[child.id()] && child.id() !== extTarget) {
        deps[child.id()].add(extTarget);
      }
    });
  });

  // 3. Compute global levels via recursive topological sort
  var level = {};
  function getLevel(id, visiting) {
    if (level[id] !== undefined) return level[id];
    if (!visiting) visiting = {};
    if (visiting[id]) return 0; // cycle guard
    visiting[id] = true;
    var maxDep = -1;
    deps[id].forEach(function(depId) {
      var dl = getLevel(depId, visiting);
      if (dl > maxDep) maxDep = dl;
    });
    level[id] = maxDep + 1;
    delete visiting[id];
    return level[id];
  }
  targets.forEach(function(n) { getLevel(n.id()); });

  // 4. An extender sits one level above the target it binds.
  var extLevel = {};
  extenders.forEach(function(n) {
    var tgtId = extenderTargetId(n);
    var tgtLv = level[tgtId];
    extLevel[n.id()] = (tgtLv === undefined ? 0 : tgtLv) + 1;
  });

  // 5. Module level = highest level among its own targets and its extenders.
  //    Extension-only modules land above everything they extend, as before.
  var moduleLevel = {};
  modules.forEach(function(mod) {
    var ownMax = -1;
    var extMax = -1;
    mod.children().forEach(function(c) {
      if (c.hasClass('gc-ext')) {
        var el = extLevel[c.id()];
        if (el !== undefined && el > extMax) extMax = el;
      } else {
        var tl = level[c.id()];
        if (tl !== undefined && tl > ownMax) ownMax = tl;
      }
    });
    // Step 2 already lifted own targets above everything the module extends, so
    // extender levels only decide the position of extension-only modules.
    moduleLevel[mod.id()] = ownMax >= 0 ? ownMax : (extMax >= 0 ? extMax : 0);
  });

  targets.forEach(function(n) {
    if (!n.data('parent')) {
      moduleLevel[n.id()] = level[n.id()] || 0;
    }
  });

  // 6. Compute inner levels for children within each module.
  //    Own controllers/views are ordered by inheritance between siblings;
  //    extenders occupy the row above them.
  var innerLevel = {}; // childId → inner level within its module
  modules.forEach(function(mod) {
    var children = visibleChildren(mod);
    var ownChildren = children.filter(function(c) { return !c.hasClass('gc-ext'); });
    var extChildren = children.filter(function(c) { return c.hasClass('gc-ext'); });

    var childIds = new Set();
    ownChildren.forEach(function(c) { childIds.add(c.id()); });

    // Build sibling inheritance deps (only edges between children of this module)
    var sibDeps = {};
    ownChildren.forEach(function(c) { sibDeps[c.id()] = new Set(); });
    cy.edges('.edge-inherit-ctrl, .edge-inherit-view').forEach(function(e) {
      var src = e.source().id();
      var tgt = e.target().id();
      if (childIds.has(src) && childIds.has(tgt)) {
        sibDeps[src].add(tgt);
      }
    });

    // Compute inner levels
    var innerLv = {};
    function getInnerLevel(id, vis) {
      if (innerLv[id] !== undefined) return innerLv[id];
      if (!vis) vis = {};
      if (vis[id]) return 0;
      vis[id] = true;
      var maxD = -1;
      sibDeps[id].forEach(function(did) {
        var dl = getInnerLevel(did, vis);
        if (dl > maxD) maxD = dl;
      });
      innerLv[id] = maxD + 1;
      delete vis[id];
      return innerLv[id];
    }
    ownChildren.forEach(function(c) { getInnerLevel(c.id()); });

    var maxOwnInner = -1;
    ownChildren.forEach(function(c) {
      var lv = innerLv[c.id()] || 0;
      innerLevel[c.id()] = lv;
      if (lv > maxOwnInner) maxOwnInner = lv;
    });
    extChildren.forEach(function(c) { innerLevel[c.id()] = maxOwnInner + 1; });
  });

  // 7. Group top-level items by level
  var byLevel = {};
  modules.forEach(function(mod) {
    var lv = moduleLevel[mod.id()] || 0;
    if (!byLevel[lv]) byLevel[lv] = [];
    byLevel[lv].push(mod);
  });
  targets.forEach(function(n) {
    if (!n.data('parent')) {
      var lv = level[n.id()] || 0;
      if (!byLevel[lv]) byLevel[lv] = [];
      byLevel[lv].push(n);
    }
  });

  // 7. Compute child sub-layouts within each module to determine real module dimensions.
  //    For each module, arrange children in sub-rows by inner level.
  var CHILD_COL_GAP = 16;
  var CHILD_ROW_GAP = 12;
  var CHILD_PAD = 24; // padding inside module for label at top + border
  var CHILD_MAX_ROW_WIDTH = 320; // wrap children instead of stretching the module

  // childLayout[modId] = { width, height, childPositions: { childId: {dx, dy} } }
  var childLayout = {};
  modules.forEach(function(mod) {
    var children = visibleChildren(mod);
    if (children.length === 0) {
      childLayout[mod.id()] = { width: mod.outerWidth() || 100, height: mod.outerHeight() || 50, childPositions: {} };
      return;
    }

    // Group children by inner level
    var byInner = {};
    var maxInner = 0;
    children.forEach(function(c) {
      var il = innerLevel[c.id()] || 0;
      if (!byInner[il]) byInner[il] = [];
      byInner[il].push(c);
      if (il > maxInner) maxInner = il;
    });

    // Break each inner level into lines, so a module with many children grows
    // downwards instead of stretching its whole level sideways
    var lines = [];
    for (var il = maxInner; il >= 0; il--) {
      var row = byInner[il];
      if (!row) continue;
      row.sort(function(a, b) { return (a.data('label') || '').localeCompare(b.data('label') || ''); });
      var line = [];
      var lineW = 0;
      for (var ri = 0; ri < row.length; ri++) {
        var cw = row[ri].outerWidth() || 80;
        if (line.length && lineW + CHILD_COL_GAP + cw > CHILD_MAX_ROW_WIDTH) {
          lines.push(line);
          line = [];
          lineW = 0;
        }
        lineW += (line.length ? CHILD_COL_GAP : 0) + cw;
        line.push(row[ri]);
      }
      if (line.length) lines.push(line);
    }

    var innerYAccum = CHILD_PAD;
    var maxRowWidth = 0;
    var cp = {};
    var lineWidths = [];

    lines.forEach(function(ln) {
      var rowX = 0;
      var rowH = 0;
      ln.forEach(function(child) {
        var cw = child.outerWidth() || 80;
        var ch = child.outerHeight() || 30;
        if (ch > rowH) rowH = ch;
        cp[child.id()] = { dx: rowX + cw / 2, dy: innerYAccum + ch / 2 };
        rowX += cw + CHILD_COL_GAP;
      });
      var rw = rowX - CHILD_COL_GAP;
      lineWidths.push(rw);
      if (rw > maxRowWidth) maxRowWidth = rw;
      innerYAccum += rowH + CHILD_ROW_GAP;
    });

    var modW = Math.max(maxRowWidth + CHILD_PAD * 2, 100);
    var modH = innerYAccum - CHILD_ROW_GAP + CHILD_PAD;

    // Center each line horizontally within modW
    lines.forEach(function(ln, li) {
      var rowOff = (modW - CHILD_PAD * 2 - lineWidths[li]) / 2;
      ln.forEach(function(c) { cp[c.id()].dx += rowOff; });
    });

    childLayout[mod.id()] = { width: modW, height: modH, childPositions: cp };
  });

  // 8. Position top-level items in rows by level.
  //    All items on the same level share the same Y center.
  //    Ext-only modules (no children) are sized as squares matching the row height.
  var ROW_GAP = 120;      // between levels
  var SUB_ROW_GAP = 60;   // between the wrapped lines of one level
  var COL_GAP = 50;
  var MAX_ROW_WIDTH = 2400;
  var positions = {};
  var maxGlobalLevel = 0;
  Object.keys(byLevel).forEach(function(k) { if (+k > maxGlobalLevel) maxGlobalLevel = +k; });

  // First pass: compute row heights (find the tallest item per level)
  var rowHeights = {};
  for (var lvH = 0; lvH <= maxGlobalLevel; lvH++) {
    var itemsH = byLevel[lvH];
    if (!itemsH || itemsH.length === 0) continue;
    var maxH = 0;
    for (var iH = 0; iH < itemsH.length; iH++) {
      var nH = itemsH[iH];
      var isModH = nH.data('nodeType') === 'module';
      var clH = isModH ? childLayout[nH.id()] : null;
      var hH = clH ? clH.height : (nH.outerHeight() || 40);
      if (hH > maxH) maxH = hH;
    }
    rowHeights[lvH] = maxH;
  }

  // Resize ext-only modules (no children) to squares matching their row height
  modules.forEach(function(mod) {
    var cl = childLayout[mod.id()];
    if (cl && Object.keys(cl.childPositions).length === 0) {
      var modLv = moduleLevel[mod.id()] || 0;
      var rh = rowHeights[modLv] || 50;
      cl.width = rh;
      cl.height = rh;
    }
  });

  function itemWidth(node) {
    var cl = childLayout[node.id()];
    return cl ? cl.width : (node.outerWidth() || 80);
  }

  // A level holding a dozen modules runs thousands of pixels wide, so break it
  // into lines of comparable length rather than one strip.
  function wrapIntoLines(items) {
    var total = -COL_GAP;
    items.forEach(function(n) { total += itemWidth(n) + COL_GAP; });

    var lineCount = Math.max(1, Math.ceil(total / MAX_ROW_WIDTH));
    var target = total / lineCount;
    var lines = [];
    var line = [];
    var lineW = 0;

    items.forEach(function(n) {
      var w = itemWidth(n);
      if (line.length && lineW + COL_GAP + w > target && lines.length < lineCount - 1) {
        lines.push(line);
        line = [];
        lineW = 0;
      }
      lineW += (line.length ? COL_GAP : 0) + w;
      line.push(n);
    });
    if (line.length) lines.push(line);

    return lines;
  }

  // Second pass: position items, center-aligning vertically within each row
  var placedRows = [];
  var yAccum = 0;
  for (var lv = 0; lv <= maxGlobalLevel; lv++) {
    var items = byLevel[lv];
    if (!items || items.length === 0) continue;

    items.sort(function(a, b) {
      var aIsModule = a.data('nodeType') === 'module' ? 0 : 1;
      var bIsModule = b.data('nodeType') === 'module' ? 0 : 1;
      if (aIsModule !== bIsModule) return aIsModule - bIsModule;
      return (a.data('label') || '').localeCompare(b.data('label') || '');
    });

    var lines = wrapIntoLines(items);
    lines.forEach(function(lineItems, li) {
      var rowHeight = 0;
      lineItems.forEach(function(n) {
        var clH = childLayout[n.id()];
        var hh = clH ? clH.height : (n.outerHeight() || 40);
        if (hh > rowHeight) rowHeight = hh;
      });

      var rowCenterY = -yAccum - rowHeight / 2;
      var xAccum = 0;
      lineItems.forEach(function(node) {
        var isModule = node.data('nodeType') === 'module';
        var cl = isModule ? childLayout[node.id()] : null;
        var w = cl ? cl.width : (node.outerWidth() || 80);
        var h = cl ? cl.height : (node.outerHeight() || 40);

        positions[node.id()] = { x: xAccum + w / 2, y: rowCenterY };

        // Position children using computed sub-layout offsets, centered within the module
        if (isModule && cl && Object.keys(cl.childPositions).length > 0) {
          var originX = xAccum;
          var originY = rowCenterY - h / 2;
          Object.keys(cl.childPositions).forEach(function(cid) {
            var off = cl.childPositions[cid];
            positions[cid] = { x: originX + CHILD_PAD + off.dx, y: originY + off.dy };
          });
        }

        // The expand/collapse button rides in the module's top-right corner,
        // outside the child flow.
        if (isModule) {
          var toggle = node.children('.mod-toggle');
          if (toggle.nonempty()) {
            positions[toggle.id()] = { x: xAccum + w - 14, y: rowCenterY - h / 2 + 14 };
          }
        }

        xAccum += w + COL_GAP;
      });

      placedRows.push(lineItems);
      yAccum += rowHeight + (li === lines.length - 1 ? ROW_GAP : SUB_ROW_GAP);
    });
  }

  // 9. Center rows horizontally
  var globalMaxX = 0;
  placedRows.forEach(function(rowItems) {
    rowItems.forEach(function(n) {
      var p = positions[n.id()];
      var hw = itemWidth(n) / 2;
      if (p && p.x + hw > globalMaxX) globalMaxX = p.x + hw;
    });
  });

  placedRows.forEach(function(rowItems) {
    var minX = Infinity, maxX = -Infinity;
    rowItems.forEach(function(n) {
      var p = positions[n.id()];
      if (p) {
        var hw = itemWidth(n) / 2;
        if (p.x - hw < minX) minX = p.x - hw;
        if (p.x + hw > maxX) maxX = p.x + hw;
      }
    });
    var offset = (globalMaxX - (maxX - minX)) / 2 - minX;
    rowItems.forEach(function(n) {
      var p = positions[n.id()];
      if (p) p.x += offset;
      // Shift children too
      n.children().forEach(function(child) {
        var cp = positions[child.id()];
        if (cp) cp.x += offset;
      });
    });
  });

  // 10. Apply positions
  cy.layout({
    name: 'preset',
    positions: function(node) {
      return positions[node.id()] || { x: 0, y: 0 };
    },
    animate: true,
    animationDuration: 400,
    stop: function() { updateEdgeStyles(); staggerEdgeLabels(); },
  }).run();
}

/* ── Stagger edge labels near arrow to avoid overlap ── */
function staggerEdgeLabels() {
  var byTarget = {};
  cy.edges('[label]').forEach(function(e) {
    if (e.style('display') === 'none') return;
    var tgt = e.data('target');
    if (!byTarget[tgt]) byTarget[tgt] = [];
    byTarget[tgt].push(e);
  });
  for (var tgt in byTarget) {
    var edges = byTarget[tgt];
    edges.sort(function(a, b) { return (a.data('label') || '').localeCompare(b.data('label') || ''); });
    // Expanding a module adds edges around the same targets, so labels need a
    // wider spread than a single alternating pair to stay apart.
    var step = 18;
    var baseOffset = 80;
    var maxOffset = 340;
    var MARGINS = [-18, 0, 18, -36, 36];
    for (var i = 0; i < edges.length; i++) {
      var offset = Math.min(baseOffset + i * step, maxOffset);
      edges[i].style('target-text-offset', offset);
      edges[i].style('target-text-margin-y', MARGINS[i % MARGINS.length]);
    }
  }
}

/** Show/hide elements according to per-module expansion, without re-laying out. */
function applyViewMode() {
  cy.nodes('.gc-ext').forEach(function(n) {
    n.style('display', isExpanded(n.data('ownerModule')) ? 'element' : 'none');
  });
  cy.edges('.view-detailed').forEach(function(e) {
    e.style('display', isExpanded(e.data('ownerModule')) ? 'element' : 'none');
  });
  cy.edges('.view-dense').forEach(function(e) {
    e.style('display', isExpanded(e.data('ownerModule')) ? 'none' : 'element');
  });
  cy.nodes('.mod-toggle').forEach(function(n) {
    var expanded = isExpanded(n.data('ownerModule'));
    n.data('label', expanded ? '\\u2212' : '+');
    n.toggleClass('expanded', expanded);
  });

  // Feature-area and edge-type filters win over expansion state
  document.querySelectorAll('.area-toggle').forEach(function(cb) {
    if (cb.checked) return;
    var area = cb.getAttribute('data-area');
    cy.nodes('[featureArea="' + area + '"]').forEach(function(n) {
      n.style('display', 'none');
      n.children().style('display', 'none');
      n.connectedEdges().style('display', 'none');
      n.children().connectedEdges().style('display', 'none');
    });
  });
  document.querySelectorAll('.edge-toggle').forEach(function(cb) {
    if (!cb.checked) cy.edges('.' + cb.getAttribute('data-cls')).style('display', 'none');
  });

  syncViewRadios();
}

/** Reflect a mixed expansion state by leaving both radios unchecked. */
function syncViewRadios() {
  var toggles = cy.nodes('.mod-toggle');
  var total = toggles.length;
  var expanded = toggles.filter(function(n) { return isExpanded(n.data('ownerModule')); }).length;
  var dense = document.querySelector('input[name="view-mode"][value="dense"]');
  var detailed = document.querySelector('input[name="view-mode"][value="detailed"]');
  dense.checked = expanded === 0;
  detailed.checked = total > 0 && expanded === total;
}

function setAllExpanded(expand) {
  expandedModules.clear();
  if (expand) {
    cy.nodes('.mod-toggle').forEach(function(n) { expandedModules.add(n.data('ownerModule')); });
  }
}

document.querySelectorAll('input[name="view-mode"]').forEach(function(r) {
  r.addEventListener('change', function() {
    setAllExpanded(this.value === 'detailed');
    applyViewMode();
    runDepLevelsLayout();
  });
});

/* Per-module expand/collapse button */
cy.on('tap', 'node.mod-toggle', function(e) {
  var modId = e.target.data('ownerModule');
  if (expandedModules.has(modId)) {
    expandedModules.delete(modId);
  } else {
    expandedModules.add(modId);
  }
  applyViewMode();
  runDepLevelsLayout();
});

// Run initial layout
applyViewMode();
runDepLevelsLayout();

// ── Interactivity: hover / click-to-pin / edge highlight ──

function getVisibleEdges(eles) {
  return eles.filter(function(ele) {
    if (!ele.isEdge()) return false;
    return ele.style('display') !== 'none';
  });
}

function connectedSet(seeds) {
  const edges = getVisibleEdges(seeds.connectedEdges());
  const neighbors = edges.connectedNodes();
  const parents = neighbors.parent();
  return seeds.union(edges).union(neighbors).union(parents);
}

function computeHighlightSet(target) {
  if (target.isEdge()) {
    const src = target.source();
    const tgt = target.target();
    return cy.collection().union(target).union(src).union(tgt)
      .union(src.parent()).union(tgt.parent());
  }
  const nodeType = target.data('nodeType');
  if (nodeType === 'module') {
    const children = target.children();
    const seeds = cy.collection().union(target).union(children);
    return connectedSet(seeds);
  }
  let leafSet = cy.collection().union(target);
  const par = target.parent();
  if (par.nonempty()) { leafSet = leafSet.union(par); }
  return connectedSet(leafSet);
}

// ── State ──────────────
var selectedTarget = null;

// ── Info Panel (grid_core-specific) ─────
function pathWrap(p) {
  return '<span class="path">' + p.split('/').join('/<wbr>') + '</span>';
}

function showInfo(target) {
  var d = target.data();
  var html = '<h3>' + (d.label || d.id) + '</h3>';
  if (target.isEdge()) {
    html = '<h3>Edge: ' + d.edgeType + '</h3>'
      + '<p><span class="lbl">From:</span> ' + d.source + '</p>'
      + '<p><span class="lbl">To:</span> ' + d.target + '</p>'
      + (d.extenderName ? '<p><span class="lbl">Extender:</span> ' + d.extenderName + '</p>' : '')
      + (d.extenderClass ? '<p><span class="lbl">Class:</span> ' + d.extenderClass + '</p>' : '')
      + (d.location ? '<p><span class="lbl">Called in:</span> ' + d.location + '()</p>' : '');
  } else if (d.nodeType === 'extender') {
    html = '<h3>' + (d.moduleName || '') + ' &rarr; ' + (d.extendsTarget || '') + '</h3>';
    html += '<p><span class="lbl">Type:</span> extender of ' + (d.extenderKind || '') + '</p>';
    html += '<p><span class="lbl">Extends:</span> ' + (d.extendsTarget || '') + '</p>';
    html += '<p><span class="lbl">Export:</span> ' + (d.extenderName || '') + '</p>';
    if (d.extenderClass) html += '<p><span class="lbl">Class:</span> ' + d.extenderClass + '</p>';
    html += '<p><span class="lbl">Source:</span> ' + pathWrap(d.sourceFile || '') + '</p>';
  } else if (d.nodeType === 'module') {
    html += '<p><span class="lbl">Source:</span> ' + pathWrap(d.sourceFile || '') + '</p>';
    if (d.registeredBy) html += '<p><span class="lbl">Registered by:</span> ' + pathWrap(d.registeredBy) + '</p>';
    html += '<p><span class="lbl">Area:</span> ' + (d.featureArea || '') + '</p>';
    if (d.definesControllers) html += '<p><span class="lbl">Controllers:</span> ' + d.definesControllers + '</p>';
    if (d.definesViews) html += '<p><span class="lbl">Views:</span> ' + d.definesViews + '</p>';
    if (d.extendsControllers) html += '<p><span class="lbl">Extends (ctrl):</span> ' + d.extendsControllers + '</p>';
    if (d.extendsViews) html += '<p><span class="lbl">Extends (view):</span> ' + d.extendsViews + '</p>';
  } else if (d.nodeType === 'owned') {
    html += '<p><span class="lbl">Type:</span> owned, not registered &mdash; created with <code>new</code></p>';
    html += '<p><span class="lbl">Class:</span> ' + (d.className || '') + '</p>';
    html += '<p><span class="lbl">Base:</span> ' + (d.baseClass || '') + '</p>';
    if (d.mixins) html += '<p><span class="lbl">Mixins:</span> ' + d.mixins + '</p>';
    html += '<p><span class="lbl">Source:</span> ' + pathWrap(d.sourceFile || '') + '</p>';
  } else if (d.nodeType === 'controller' || d.nodeType === 'view') {
    html += '<p><span class="lbl">Type:</span> ' + d.nodeType + '</p>';
    html += '<p><span class="lbl">Class:</span> ' + (d.className || '') + '</p>';
    html += '<p><span class="lbl">Base:</span> ' + (d.baseClass || '') + '</p>';
    if (d.mixins) html += '<p><span class="lbl">Mixins:</span> ' + d.mixins + '</p>';
    html += '<p><span class="lbl">Source:</span> ' + pathWrap(d.sourceFile || '') + '</p>';
  }
  document.getElementById('info-content').innerHTML = html;
}

// ── Shared interactive JS (highlight, edge toggles, search, click handlers, fit button, routing radio) ──
${SHARED_INTERACTIVE_JS}

// ── Grid_core-specific: Feature Area Toggles ────────────────────────
document.getElementById('toggle-all-areas').addEventListener('change', function() {
  const checked = this.checked;
  document.querySelectorAll('.area-toggle').forEach(cb => {
    cb.checked = checked;
    cb.dispatchEvent(new Event('change'));
  });
});
document.querySelectorAll('.area-toggle').forEach(cb => {
  cb.addEventListener('change', function() {
    const area = this.dataset.area;
    const show = this.checked;
    cy.nodes('[featureArea="' + area + '"]').forEach(n => {
      n.style('display', show ? 'element' : 'none');
      n.children().style('display', show ? 'element' : 'none');
      n.connectedEdges().forEach(e => {
        if (!show) e.style('display', 'none');
        else e.style('display', 'element');
      });
      n.children().connectedEdges().forEach(e => {
        if (!show) e.style('display', 'none');
        else e.style('display', 'element');
      });
    });
    // Re-apply view mode and edge type visibility after area filter changes
    applyViewMode();
    if (selectedTarget) {
      const set = computeHighlightSet(selectedTarget);
      cy.elements().removeClass('highlighted').addClass('faded');
      set.removeClass('faded').addClass('highlighted');
    }
    const allToggles = document.querySelectorAll('.area-toggle');
    const allChecked = Array.from(allToggles).every(t => t.checked);
    const noneChecked = Array.from(allToggles).every(t => !t.checked);
    const selectAll = document.getElementById('toggle-all-areas');
    selectAll.checked = allChecked;
    selectAll.indeterminate = !allChecked && !noneChecked;
  });
});

// ── Grid_core-specific: Reset Button ─────────────────────────────
document.getElementById('btn-reset').addEventListener('click', () => {
  selectedTarget = null;
  clearHighlight();
  cy.elements().removeClass('search-match');
  document.getElementById('search').value = '';
  document.getElementById('toggle-all-areas').checked = true;
  document.getElementById('toggle-all-areas').indeterminate = false;
  document.querySelectorAll('.area-toggle').forEach(cb => { cb.checked = true; });
  cy.elements().style('display', 'element');
  document.getElementById('toggle-all-edges').checked = true;
  document.querySelectorAll('.edge-toggle').forEach(function(cb) { cb.checked = true; });
  document.querySelector('input[name="edge-routing"][value="bezier"]').checked = true;
  setAllExpanded(false);
  applyViewMode();
  runDepLevelsLayout();
});
</script>
</body>
</html>`;
}
