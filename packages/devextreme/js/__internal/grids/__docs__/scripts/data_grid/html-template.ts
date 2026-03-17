/* eslint-disable spellcheck/spell-checker */
import { BASE_CSS, HIGHLIGHT_CYTOSCAPE_STYLES, SHARED_INTERACTIVE_JS } from '../shared/html-helpers';
import { buildCytoscapeElements } from './graph-builder';
import { buildModulesBySourceFile } from './resolver';
import type { ArchitectureData } from './types';

export function generateHtml(data: ArchitectureData): string {
  const modulesBySourceFile = buildModulesBySourceFile(data.modules);
  const cytoscapeElements = buildCytoscapeElements(data, modulesBySourceFile);
  const elementsJson = JSON.stringify(cytoscapeElements, null, 2);
  const pipelines = data.extenderPipelines.map((p) => ({
    targetName: p.targetName,
    targetType: p.targetType,
    steps: p.steps.map((s) => ({
      moduleName: s.moduleName,
      relPath: s.relPath,
      extenderName: s.extenderName,
      isFromGridCore: s.isFromGridCore,
      registrationOrder: s.registrationOrder,
      category: s.category,
    })),
  }));
  // Add synthetic pipeline for DataSourceAdapter (same mixin pattern)
  if (data.dataSourceAdapterChain.length > 0) {
    pipelines.push({
      targetName: 'dataSourceAdapter',
      targetType: 'controller',
      steps: data.dataSourceAdapterChain.map((ext) => {
        const mod = modulesBySourceFile.get(ext.relPath);
        return {
          moduleName: mod?.moduleName ?? ext.relPath,
          relPath: ext.relPath,
          extenderName: ext.extenderName,
          isFromGridCore: ext.isImportedFromGridCore,
          registrationOrder: mod?.registrationOrder ?? -1,
          category: mod?.category ?? 'passthrough',
        };
      }),
    });
  }
  const pipelinesJson = JSON.stringify(pipelines);
  const gridCoreModulesJson = JSON.stringify(data.gridCoreModules.map((gc) => ({
    moduleName: gc.moduleName,
    registeredAs: gc.registeredAs,
    sourceFile: gc.sourceFile,
    featureArea: gc.featureArea,
    controllers: gc.controllers,
    views: gc.views,
    extenders: gc.extenders,
    hasDefaultOptions: gc.hasDefaultOptions,
  })));
  const modulesJson = JSON.stringify(data.modules.map((m) => ({
    moduleName: m.moduleName,
    category: m.category,
    sourceFile: m.sourceFile,
    featureArea: m.featureArea,
    registrationOrder: m.registrationOrder,
    gridCoreSourceModule: m.gridCoreSourceModule,
    hasDefaultOptionsOverride: m.hasDefaultOptionsOverride,
    controllers: m.controllers,
    views: m.views,
    extenders: m.extenders,
  })));

  const categories = ['passthrough', 'extended', 'replaced', 'new', 'gc-target'];
  const categoryDisplayNames: Record<string, string> = {
    passthrough: 'Passthrough',
    extended: 'Extended',
    replaced: 'Replaced',
    new: 'New',
    'gc-target': 'Grid Core Target',
  };
  const featureAreas = [...new Set(data.modules.map((m) => m.featureArea))].sort();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DataGrid Architecture</title>
<!-- AUTO-GENERATED. DO NOT EDIT. -->
<!-- Generated at: ${data.generatedAt} -->
<script src="https://unpkg.com/cytoscape@3.30.4/dist/cytoscape.min.js"></script>
<style>
${BASE_CSS}
.s-file{color:#888;font-size:11px}
.c-pt{background:#2a3a2a;color:#68d391;border:1px solid #68d39133}
.c-ext{background:#2a2a3a;color:#90cdf4;border:1px solid #90cdf433}
.c-rep{background:#3a2a2a;color:#fc8181;border:1px solid #fc818133}
.c-new{background:#3a3a2a;color:#f6e05e;border:1px solid #f6e05e33}
.c-gc{background:#3a2a00;color:#f5c040;border:1px solid #f5c04033}
.c-util{background:#0a2a1a;color:#6ee7b7;border:1px solid #10b98133}
.chain-box{margin:4px 0;padding:6px;background:#1a1a2e;border:1px solid #334;border-radius:4px;font-size:11px}
.chain-step{padding:2px 6px;border-radius:3px;margin:2px 0;display:inline-block}
.chain-arr{color:#666;font-size:10px;margin:1px 0}
.s-current{background:#2a3a5a;color:#90cdf4}
.s-gc{background:#3a2a1a;color:#f5c040}
.s-final{background:#1a3a1a;color:#68d391}
</style>
</head>
<body>
<div id="sidebar">
  <div>
    <h2>Search</h2>
    <input type="text" id="search" placeholder="Type to search..." />
  </div>
  <div>
    <h2>Edge Types</h2>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-order" checked> Registration Order</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-ext-ctrl" checked> Extender Chain (ctrl)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-ext-view" checked> Extender Chain (view)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-gc-defines-ctrl" checked> Defines (ctrl)</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-gc-defines-view" checked> Defines (view)</label>
  </div>
  <div>
    <h2>Categories</h2>
    <label class="select-all-row"><input type="checkbox" id="cat-all" checked> Select / Unselect All</label>
    ${categories.map((c) => `<label><input type="checkbox" class="cat-toggle" data-cat="${c}" checked> ${categoryDisplayNames[c] ?? c}</label>`).join('\n    ')}
  </div>
  <div>
    <h2>Feature Areas</h2>
    <label class="select-all-row"><input type="checkbox" id="area-all" checked> Select / Unselect All</label>
    ${featureAreas.map((a) => `<label><input type="checkbox" class="area-toggle" data-area="${a}" checked> ${a}</label>`).join('\n    ')}
  </div>
  <div>
    <h2>Edge Routing</h2>
    <div class="radio-group">
      <label><input type="radio" name="edge-routing" value="taxi"> Orthogonal</label>
      <label><input type="radio" name="edge-routing" value="bezier" checked> Bezier</label>
    </div>
  </div>
  <div>
    <button id="btn-fit">Fit View</button>
    <button id="btn-reset">Reset</button>
  </div>
  <div id="legend">
    <h2>Legend</h2>
    <div class="leg-item"><div class="leg-sw" style="background:#2a3a2a;border:2px solid #68d391"></div> Passthrough</div>
    <div class="leg-item"><div class="leg-sw" style="background:#2a2a3a;border:2px solid #90cdf4"></div> Extended</div>
    <div class="leg-item"><div class="leg-sw" style="background:#3a2a2a;border:2px solid #fc8181"></div> Replaced</div>
    <div class="leg-item"><div class="leg-sw" style="background:#3a3a2a;border:2px solid #f6e05e"></div> New</div>
    <div class="leg-item"><div class="leg-sw" style="background:#1a1a2e;border:2px dashed #f59e0b"></div> Grid Core Module</div>
    <div class="leg-item"><div class="leg-sw" style="background:#1e1e3a;border:2px solid #c084fc;border-radius:50%"></div> Grid Core Target (ctrl/view)</div>
    <div class="leg-item"><div class="leg-sw" style="background:#2a2a1e;border:2px dashed #f6e05e;clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)"></div> DataGrid Target (ctrl/view)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:1px dotted #c1c1c1"></div> Registration Order</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #0ea5e9"></div> Extender (ctrl → target)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #a855f7"></div> Extender (view → target)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:1.5px dashed #0ea5e9;opacity:.8"></div> Defines (ctrl)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:1.5px dashed #a855f7;opacity:.8"></div> Defines (view)</div>
  </div>
</div>
<div id="main">
  <div id="cy"></div>
  <div id="info-panel-wrap">
    <div id="info-panel">
      <button id="btn-toggle-panel" title="Move panel to right">&#x2192;</button>
      <div id="info-content"><p style="color:#888">Click a node or edge to see details.</p></div>
    </div>
  </div>
</div>
<script>
var ELEMENTS = ${elementsJson};
var PIPELINES = ${pipelinesJson};
var MODULES = ${modulesJson};
var GC_MODULES = ${gridCoreModulesJson};

var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: ELEMENTS,
  style: [
    { selector: 'node.module', style: {
      'shape': 'round-rectangle', 'background-opacity': 0.8,
      'border-width': 2, 'label': 'data(label)', 'text-valign': 'center', 'text-halign': 'center',
      'font-size': 10, 'color': '#e8e8e8', 'text-wrap': 'wrap', 'text-max-width': '260px',
      'padding': '14px', 'width': 'label', 'height': 'label',
    }},
    { selector: 'node.module.passthrough', style: { 'background-color': '#2a3a2a', 'border-color': '#68d391',
      'text-valign': 'top', 'text-margin-y': 16, 'padding': '30px',
      'min-width': '80px',
    }},
    { selector: 'node.module.extended', style: { 'background-color': '#2a3a3a', 'border-color': '#90cdf4',
      'text-valign': 'top', 'text-margin-y': 16, 'padding': '30px',
      'min-width': '80px',
    }},
    { selector: 'node.module.replaced', style: { 'background-color': '#3a2a2a', 'border-color': '#fc8181',
      'min-width': '80px', 'padding': '30px',
    }},
    { selector: 'node.module.new', style: {
      'background-color': '#3a3a2a', 'border-color': '#f6e05e', 'padding': '30px',
    }},
    { selector: 'node.module.grid-core', style: {
      'background-color': '#1a1a2e', 'border-width': 2, 'border-style': 'dashed', 'border-color': '#f59e0b',
      'color': '#f5c040', 'background-opacity': 0.5, 'shape': 'barrel',
      'padding': '12px',
    }},
    { selector: 'node.gc-target', style: {
      'background-color': '#1e1e3a', 'border-width': 2, 'border-style': 'dashed',
      'border-color': '#c084fc', 'color': '#d8b4fe',
      'background-opacity': 0.6, 'font-size': 9,
      'text-valign': 'center', 'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '120px',
      'padding': '12px', 'width': 'label', 'height': 'label',
      'label': 'data(label)',
    }},
    { selector: 'node.gc-target-controller', style: {
      'border-color': '#7dd3fc', 'color': '#bae6fd', 'shape': 'hexagon',
    }},
    { selector: 'node.gc-target-view', style: {
      'border-color': '#c084fc', 'color': '#d8b4fe', 'shape': 'ellipse',
    }},
    { selector: 'node.dg-target', style: {
      'background-color': '#3a3a2a', 'border-style': 'solid',
      'padding': '12px',
    }},
    { selector: 'node.dg-target.gc-target-controller', style: {
      'border-color': '#7dd3fc', 'color': '#bae6fd', 'shape': 'hexagon',
    }},
    { selector: 'node.dg-target.gc-target-view', style: {
      'border-color': '#c084fc', 'color': '#d8b4fe', 'shape': 'ellipse',
    }},
    { selector: 'edge.edge-order', style: {
      'line-color': '#c1c1c1', 'target-arrow-color': '#c1c1c1', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1, 'arrow-scale': .5,
      'line-style': 'dotted', 'opacity': .25,
    }},
    { selector: 'edge.edge-ext-ctrl', style: {
      'line-color': '#0ea5e9', 'target-arrow-color': '#0ea5e9', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2, 'arrow-scale': .8,
      'target-label': 'data(label)', 'font-size': 8, 'color': '#5bb8e8',
      'target-text-offset': 150,
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
    }},
    { selector: 'edge.edge-ext-view', style: {
      'line-color': '#a855f7', 'target-arrow-color': '#a855f7', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2, 'arrow-scale': .8,
      'target-label': 'data(label)', 'font-size': 8, 'color': '#c090f0',
      'target-text-offset': 150,
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
    }},
    { selector: 'edge.edge-gc-defines-ctrl', style: {
      'line-color': '#0ea5e9', 'target-arrow-color': '#0ea5e9', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1.5, 'arrow-scale': .6,
      'line-style': 'dashed', 'opacity': .8,
      'label': 'data(label)', 'font-size': 7, 'color': '#5bb8e8',
      'text-rotation': 'autorotate', 'text-margin-y': -8,
      'text-background-color': '#1a1a2e', 'text-background-opacity': 1,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
    }},
    { selector: 'edge.edge-gc-defines-view', style: {
      'line-color': '#a855f7', 'target-arrow-color': '#a855f7', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1.5, 'arrow-scale': .6,
      'line-style': 'dashed', 'opacity': .8,
      'label': 'data(label)', 'font-size': 7, 'color': '#c090f0',
      'text-rotation': 'autorotate', 'text-margin-y': -8,
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
    }},
    ${HIGHLIGHT_CYTOSCAPE_STYLES}
  ],
  layout: { name: 'preset' },
});

/* ── Custom Layout ── */
// Note: getEdgeRouting() and hasOverlappingBounds() are provided by SHARED_INTERACTIVE_JS

function updateEdgeStyles() {
  var routing = getEdgeRouting();
  if (routing === 'taxi') {
    cy.edges().style({ 'curve-style': 'taxi', 'taxi-direction': 'downward', 'taxi-turn': '50%' });
    cy.edges().forEach(function(edge) {
      if (hasOverlappingBounds(edge)) edge.style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
    });
  } else {
    cy.edges().style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
  }
}

function runLayout() {
  // ── Gather dg modules sorted by registrationOrder (last on top → lowest Y) ──
  var dgModules = [];
  cy.nodes('.module').forEach(function(n) {
    if (n.data('nodeType') === 'module') dgModules.push(n);
  });
  dgModules.sort(function(a, b) { return a.data('registrationOrder') - b.data('registrationOrder'); });

  // ── Measure node heights for spacing ──
  var ROW_GAP = 30;
  var COL_GAP = 400;

  // First pass: place modules to get bounding boxes (invisible preset)
  var moduleYMap = {};   // moduleName → y center
  var moduleRowMap = {}; // moduleName → row index (0 = bottom)
  var totalY = 0;

  // Place bottom-up: row 0 = first module (bottom), row N-1 = last module (top)
  // But last on top means we accumulate Y going negative (up)
  var positions = {};
  var yAccum = 0;
  for (var i = 0; i < dgModules.length; i++) {
    var mod = dgModules[i];
    var modId = mod.id();
    var h = mod.outerHeight() || 60;
    var y = -yAccum;  // negative = up; first module at y=0 (bottom), last at top
    positions[modId] = { x: 0, y: y };
    moduleYMap[mod.data('moduleName')] = y;
    moduleRowMap[mod.data('moduleName')] = i;
    yAccum += h + ROW_GAP;

    // Also position embedded gc child at same location (compound parent handles it)
    mod.children().forEach(function(child) {
      positions[child.id()] = { x: 0, y: y };
    });
  }

  // ── Build target → defining module and first-extender maps ──
  var targetDefiner = {};   // targetName → moduleName that defines it
  var targetFirstExt = {};  // targetName → moduleName of first extender (lowest step #)
  cy.edges('.edge-gc-defines-ctrl, .edge-gc-defines-view').forEach(function(e) {
    var tName = e.data('targetName');
    if (!tName) return;
    // Source is either gc-* (embedded in a dg module) or mod-* (dg module itself)
    var srcNode = e.source();
    var definerMod;
    if (srcNode.data('nodeType') === 'gridCoreModule' && srcNode.data('parent')) {
      // Embedded gc → the parent dg module name
      var parent = srcNode.parent();
      if (parent && parent.nonempty()) definerMod = parent.data('moduleName');
    } else {
      definerMod = srcNode.data('moduleName');
    }
    if (definerMod && moduleYMap[definerMod] !== undefined) {
      targetDefiner[tName] = definerMod;
    }
  });

  cy.edges('[edgeType="extender-target"]').forEach(function(e) {
    var tName = e.data('targetName');
    var srcMod = e.source().data('moduleName');
    var idx = e.data('chainIndex') || 0;
    if (!tName || !srcMod) return;
    if (!targetFirstExt[tName] || idx < targetFirstExt[tName].idx) {
      targetFirstExt[tName] = { mod: srcMod, idx: idx };
    }
  });

  // ── Position targets: controllers left, views right ──
  var ctrlTargets = [];
  var viewTargets = [];
  cy.nodes('.gc-target').forEach(function(n) {
    var tName = n.data('targetName');
    var tType = n.data('targetType');
    var y;
    if (targetDefiner[tName] && moduleYMap[targetDefiner[tName]] !== undefined) {
      y = moduleYMap[targetDefiner[tName]];
    } else if (targetFirstExt[tName] && moduleYMap[targetFirstExt[tName].mod] !== undefined) {
      // A bit below the first extender module
      y = moduleYMap[targetFirstExt[tName].mod] + 25;
    } else {
      y = 0; // fallback
    }
    var entry = { node: n, y: y, tName: tName };
    if (tType === 'view') viewTargets.push(entry);
    else ctrlTargets.push(entry);
  });

  // Sort by y to stack without overlap, then assign x columns
  ctrlTargets.sort(function(a, b) { return a.y - b.y; });
  viewTargets.sort(function(a, b) { return a.y - b.y; });

  function assignTargetPositions(targets, xSign) {
    var colWidth = 160;
    var minYGap = 50;
    var lastY = -Infinity;
    for (var t = 0; t < targets.length; t++) {
      var entry = targets[t];
      // Prevent overlap: if too close to previous, push down
      if (entry.y - lastY < minYGap) entry.y = lastY + minYGap;
      lastY = entry.y;
      positions[entry.node.id()] = { x: xSign * (colWidth + COL_GAP), y: entry.y };
    }
    // If many targets, spread to multiple columns
    if (targets.length > 15) {
      var half = Math.ceil(targets.length / 2);
      for (var t2 = half; t2 < targets.length; t2++) {
        var tid = targets[t2].node.id();
        positions[tid].x = xSign * (2 * colWidth + COL_GAP + 100);
      }
    }
  }

  assignTargetPositions(ctrlTargets, -1);  // controllers to the left
  assignTargetPositions(viewTargets, 1);   // views to the right

  // ── Apply positions ──
  cy.layout({
    name: 'preset',
    positions: function(node) {
      return positions[node.id()] || { x: 0, y: 0 };
    },
    animate: true,
    animationDuration: 400,
    stop: function() {
      updateEdgeStyles();
      staggerExtenderLabels();
    },
  }).run();
}

/* ── Stagger extender labels near arrow to avoid overlap ── */
function staggerExtenderLabels() {
  // Group extender edges by target node
  var byTarget = {};
  cy.edges('[edgeType="extender-target"]').forEach(function(e) {
    var tgt = e.data('target');
    if (!byTarget[tgt]) byTarget[tgt] = [];
    byTarget[tgt].push(e);
  });
  for (var tgt in byTarget) {
    var edges = byTarget[tgt];
    // Sort by chainIndex so labels are ordered consistently
    edges.sort(function(a, b) { return (a.data('chainIndex') || 0) - (b.data('chainIndex') || 0); });
    var step = 16; // vertical stagger between labels in pixels
    var baseOffset = 100; // closest label to arrow
    var maxOffset = 250; // all labels must be within 250px from arrow
    for (var i = 0; i < edges.length; i++) {
      var offset = Math.min(baseOffset + i * step, maxOffset);
      edges[i].style('target-text-offset', offset);
      // Alternate text-margin-y to further separate overlapping labels
      var marginY = (i % 2 === 0) ? -16 : 16;
      edges[i].style('target-text-margin-y', marginY);
    }
  }
}
runLayout();


/* ── Category toggles ── */
function applyCatFilters() {
  var cats = {};
  document.querySelectorAll('.cat-toggle').forEach(function(cb) { cats[cb.getAttribute('data-cat')] = cb.checked; });
  cy.nodes('.module, .gc-target').forEach(function(n) {
    var cat = n.data('category');
    n.style('display', cats[cat] !== false ? 'element' : 'none');
  });
}
document.querySelectorAll('.cat-toggle').forEach(function(cb) { cb.addEventListener('change', applyCatFilters); });
document.getElementById('cat-all').addEventListener('change', function() {
  var v = this.checked;
  document.querySelectorAll('.cat-toggle').forEach(function(cb) { cb.checked = v; });
  applyCatFilters();
});

/* ── Feature area toggles ── */
function applyAreaFilters() {
  var areas = {};
  document.querySelectorAll('.area-toggle').forEach(function(cb) { areas[cb.getAttribute('data-area')] = cb.checked; });
  cy.nodes('.module, .gc-target').forEach(function(n) {
    var area = n.data('featureArea');
    if (area && areas[area] === false) n.style('display', 'none');
    else if (n.style('display') === 'none' && areas[area] !== false) n.style('display', 'element');
  });
}
document.querySelectorAll('.area-toggle').forEach(function(cb) { cb.addEventListener('change', applyAreaFilters); });
document.getElementById('area-all').addEventListener('change', function() {
  var v = this.checked;
  document.querySelectorAll('.area-toggle').forEach(function(cb) { cb.checked = v; });
  applyAreaFilters();
});

/* ── Highlight ── */
var selectedTarget = null;

// DG module and its embedded GC module are one logical unit.
// Expand a single node to include its partner.
function compoundGroup(node) {
  var col = cy.collection().union(node);
  var nt = node.data('nodeType');
  if (nt === 'module' && node.children().nonempty()) {
    // dg parent → include gc child inside it
    col = col.union(node.children());
  } else if (nt === 'gridCoreModule' && node.data('parent')) {
    // embedded gc child → include dg parent
    var p = node.parent();
    if (p && p.nonempty()) col = col.union(p);
  }
  return col;
}

function connSet(seeds) {
  var edges = seeds.connectedEdges().filter(function(e) { return e.style('display') !== 'none'; });
  var nodes = edges.connectedNodes();
  // For any embedded gc modules in the result, also include their parent dg modules
  var extra = cy.collection();
  nodes.forEach(function(n) {
    if (n.data('nodeType') === 'gridCoreModule' && n.data('parent')) {
      var p = n.parent();
      if (p && p.nonempty()) extra = extra.union(p);
    }
  });
  return seeds.union(edges).union(nodes).union(extra);
}
function computeHighlightSet(t) {
  if (t.isEdge()) return cy.collection().union(t).union(t.source()).union(t.target());
  var group = compoundGroup(t);
  return connSet(group);
}

// Normalize: clicking embedded gc child → treat as clicking dg parent
function normalizeClickTarget(t) {
  if (t.isNode() && t.data('nodeType') === 'gridCoreModule' && t.data('parent')) {
    var p = t.parent();
    if (p && p.nonempty()) return p;
  }
  return t;
}

/* ── Info Panel ── */

function pathWrap(p) {
  return '<span class="path">' + p.split('/').join('/<wbr>') + '</span>';
}

function tagFor(cat) {
  var map = { passthrough: 'c-pt', extended: 'c-ext', replaced: 'c-rep', 'new': 'c-new', 'grid-core': 'c-gc', 'gc-target': 'c-gc' };
  var displayMap = { passthrough: 'Passthrough', extended: 'Extended', replaced: 'Replaced', 'new': 'New', 'grid-core': 'Grid Core', 'gc-target': 'Grid Core Target' };
  var cls = map[cat] || 'c-pt';
  var label = displayMap[cat] || cat;
  return '<span class="tag ' + cls + '">' + label + '</span>';
}

function findGcModule(name) { return GC_MODULES.find(function(gc) { return gc.registeredAs === name || gc.moduleName === name; }); }

function renderChain(pip, extraClass) {
  var h = '<div class="chain-box ' + extraClass + '">';
  h += '<div style="font-weight:bold;margin-bottom:3px">' + pip.targetType + ' "' + pip.targetName + '" pipeline (' + pip.steps.length + ' steps):</div>';
  for (var i = 0; i < pip.steps.length; i++) {
    var s = pip.steps[i];
    var origin = s.isFromGridCore ? 'gc' : 'dg';
    var catTag = s.category ? ' [' + s.category + ']' : '';
    var cls = s.isFromGridCore ? 's-gc' : 's-current';
    h += '<div class="chain-step ' + cls + '">';
    h += '<b>#' + (i + 1) + '</b> ';
    h += s.moduleName + catTag + ' <span style="opacity:.7">(' + origin + ')</span>';
    h += ' <span style="font-size:10px;opacity:.6">→ ' + s.extenderName + '</span>';
    h += '</div>';
    if (i < pip.steps.length - 1) h += '<div class="chain-arr">&darr; extends</div>';
  }
  h += '<div class="chain-arr">&darr;</div>';
  h += '<div class="chain-step"><span class="s-final">Final ' + pip.targetType + ' "' + pip.targetName + '"</span></div>';
  h += '</div>';
  return h;
}

function showInfo(t) {
  var d = t.data(), h = '';

  if (t.isNode() && d.nodeType === 'gridCoreModule') {
    h = '<div>' + tagFor('grid-core') + '</div>';
    h += '<h3>' + d.moduleName + '</h3>';
    h += '<p><span class="lbl">Source:</span> ' + pathWrap('grid_core/' + d.sourceFile) + '</p>';
    h += '<p><span class="lbl">Area:</span> ' + d.featureArea + '</p>';
    try {
      var gcCtrls = JSON.parse(d.controllers || '{}');
      var gcViews = JSON.parse(d.views || '{}');
      var gcExts = JSON.parse(d.extenders || '{}');
      var ctrlNames = Object.keys(gcCtrls);
      var viewNames = Object.keys(gcViews);
      if (ctrlNames.length) { h += '<h3 style="margin-top:6px">Controllers:</h3>'; for (var ci = 0; ci < ctrlNames.length; ci++) { var cn = ctrlNames[ci]; var cc = gcCtrls[cn]; h += '<p style="font-size:11px;margin-left:8px"><b>' + cn + '</b>: ' + cc.className + ' extends ' + cc.baseClass + '</p>'; } }
      if (viewNames.length) { h += '<h3 style="margin-top:6px">Views:</h3>'; for (var vi = 0; vi < viewNames.length; vi++) { var vn = viewNames[vi]; var vc = gcViews[vn]; h += '<p style="font-size:11px;margin-left:8px"><b>' + vn + '</b>: ' + vc.className + ' extends ' + vc.baseClass + '</p>'; } }
      var extCtrlNames = Object.keys(gcExts.controllers || {});
      var extViewNames = Object.keys(gcExts.views || {});
      if (extCtrlNames.length) { h += '<h3 style="margin-top:6px">Extender Controllers:</h3>'; for (var ei = 0; ei < extCtrlNames.length; ei++) { h += '<p style="font-size:11px;margin-left:8px"><b>' + extCtrlNames[ei] + '</b>: ' + gcExts.controllers[extCtrlNames[ei]].extenderName + ' (' + gcExts.controllers[extCtrlNames[ei]].pattern + ')</p>'; } }
      if (extViewNames.length) { h += '<h3 style="margin-top:6px">Extender Views:</h3>'; for (var evi = 0; evi < extViewNames.length; evi++) { h += '<p style="font-size:11px;margin-left:8px"><b>' + extViewNames[evi] + '</b>: ' + gcExts.views[extViewNames[evi]].extenderName + ' (' + gcExts.views[extViewNames[evi]].pattern + ')</p>'; } }
    } catch(e) {}

  } else if (t.isNode() && d.nodeType === 'gcTarget') {
    var originLabel = d.targetOrigin === 'dg' ? 'DG-defined' : 'GC-defined';
    var originTag = d.targetOrigin === 'dg' ? tagFor('new') : tagFor('gc-target');
    h = '<div>' + originTag + '</div>';
    h += '<h3>' + d.targetName + ' <span style="font-size:11px;color:#888">(' + d.targetType + ', ' + originLabel + ')</span></h3>';
    var pip = PIPELINES.find(function(p) { return p.targetName === d.targetName && p.targetType === d.targetType; });
    if (pip) {
      h += '<p><span class="lbl">Extended by ' + pip.steps.length + ' module(s):</span></p>';
      h += renderChain(pip, d.targetType === 'view' ? 'chain-view' : '');
    } else {
      h += '<p style="font-size:11px;color:#888;margin-top:4px">Not extended by any module.</p>';
    }

  } else if (t.isNode() && d.nodeType === 'module') {
    h = '<div>' + tagFor(d.category) + '</div>';
    h += '<h3>#' + (d.registrationOrder + 1) + ' ' + d.moduleName + '</h3>';
    h += '<p><span class="lbl">Source:</span> ' + pathWrap(d.sourceFile) + '</p>';
    h += '<p><span class="lbl">Area:</span> ' + d.featureArea + '</p>';
    if (d.gridCoreSource) h += '<p><span class="lbl">Grid Core Source:</span> ' + pathWrap(d.gridCoreSource) + '</p>';

    var gc = findGcModule(d.moduleName);
    if (gc) {
      h += '<div style="margin-top:6px;padding:6px 8px;background:#2a2000;border:1px solid #f59e0b44;border-radius:4px;font-size:11px">';
      h += '<b style="color:#f59e0b">Grid Core Module:</b> ' + gc.moduleName;
      var gcCtrlNames = Object.keys(gc.controllers);
      var gcViewNames = Object.keys(gc.views);
      if (gcCtrlNames.length) h += '<br>Controllers: ' + gcCtrlNames.join(', ');
      if (gcViewNames.length) h += '<br>Views: ' + gcViewNames.join(', ');
      h += '</div>';
    }

    var ctrlPips = PIPELINES.filter(function(p) { return p.targetType === 'controller' && p.steps.some(function(s) { return s.moduleName === d.moduleName; }); });
    var viewPips = PIPELINES.filter(function(p) { return p.targetType === 'view' && p.steps.some(function(s) { return s.moduleName === d.moduleName; }); });
    if (ctrlPips.length) { h += '<h3 style="margin-top:6px">Controller Chains:</h3>'; for (var i = 0; i < ctrlPips.length; i++) h += renderChain(ctrlPips[i], ''); }
    if (viewPips.length) { h += '<h3 style="margin-top:6px">View Chains:</h3>'; for (var j = 0; j < viewPips.length; j++) h += renderChain(viewPips[j], 'chain-view'); }

    if (d.category === 'passthrough') h += '<p style="margin-top:6px;font-size:11px;color:#666">Directly re-exports a grid_core module without modifications.</p>';

  } else if (t.isEdge()) {
    var et = d.edgeType;
    h = '<h3>Edge: ' + et + '</h3>';
    h += '<p><span class="lbl">From:</span> ' + (d.source || '').replace('mod-', '').replace('gc-', '') + '</p>';
    h += '<p><span class="lbl">To:</span> ' + (d.target || '').replace('mod-', '').replace('gc-', '') + '</p>';
    if (d.targetName) h += '<p><span class="lbl">Target:</span> ' + d.targetName + '</p>';
    if (et === 'extender-target') {
      h += '<p style="font-size:11px;color:#a0a0b0;margin-top:4px">Module <b>' + (d.source || '').replace('mod-', '') + '</b> extends ' + d.targetType + ' <b>' + d.targetName + '</b> (step ' + d.label + ').</p>';
      var pip = PIPELINES.find(function(p) { return p.targetName === d.targetName && p.targetType === d.targetType; });
      if (pip) h += renderChain(pip, d.targetType === 'view' ? 'chain-view' : '');
    }
    if (et === 'gc-defines') {
      h += '<p style="font-size:11px;color:#a0a0b0;margin-top:4px">Grid core module <b>' + (d.source || '').replace('gc-', '') + '</b> defines ' + d.targetName + '.</p>';
    }
  }
  document.getElementById('info-content').innerHTML = h;
}

// ── Shared interactive JS (highlight, edge toggles, search, click handlers, fit button, routing radio) ──
${SHARED_INTERACTIVE_JS}

// ── Data_grid-specific: Reset Button ──
document.getElementById('btn-reset').addEventListener('click', function() { clearHighlight(); runLayout(); });
</script>
</body>
</html>`;
}
