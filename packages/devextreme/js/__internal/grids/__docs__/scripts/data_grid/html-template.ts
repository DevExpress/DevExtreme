/* eslint-disable spellcheck/spell-checker */
import { buildCytoscapeElements } from './graph-builder';
import type { DataGridArchitectureData } from './types';

export function generateHtml(data: DataGridArchitectureData): string {
  const cytoscapeElements = buildCytoscapeElements(data);
  const elementsJson = JSON.stringify(cytoscapeElements, null, 2);
  const pipelinesJson = JSON.stringify(data.extenderPipelines);
  const dsaJson = JSON.stringify(data.dataSourceAdapterChain);
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
    relPath: m.relPath,
    featureArea: m.featureArea,
    registrationOrder: m.registrationOrder,
    details: m.details,
    gridCoreSourceModule: m.gridCoreSourceModule,
    newControllers: m.newControllers,
    newViews: m.newViews,
    overriddenControllers: m.overriddenControllers,
    overriddenExtenderControllers: m.overriddenExtenderControllers,
    overriddenExtenderViews: m.overriddenExtenderViews,
    hasDefaultOptionsOverride: m.hasDefaultOptionsOverride,
  })));
  const featureAreas = [...new Set(data.modules.map((m) => m.featureArea))].sort();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DataGrid Extensions Architecture</title>
<!-- AUTO-GENERATED. npx tsx __docs__/scripts/data_grid/generate.ts -->
<script src="https://unpkg.com/cytoscape@3.30.4/dist/cytoscape.min.js"></script>
<script src="https://unpkg.com/elkjs@0.9.3/lib/elk.bundled.js"></script>
<script src="https://unpkg.com/cytoscape-elk@2.2.0/dist/cytoscape-elk.js"></script>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; height: 100vh; background: #1a1a2e; color: #e0e0e0; }

#sidebar {
  width: 300px; min-width: 300px; background: #16213e; border-right: 1px solid #2a2a4a;
  padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;
}
#sidebar h2 { font-size: 12px; color: #a0a0b0; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
#sidebar label { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; padding: 1px 0; }
#sidebar input[type="checkbox"] { accent-color: #0ea5e9; }
#sidebar input[type="text"] {
  width: 100%; padding: 6px 10px; border: 1px solid #2a2a4a; border-radius: 4px;
  font-size: 13px; background: #0f3460; color: #e0e0e0; outline: none;
}
#sidebar input[type="text"]:focus { border-color: #0ea5e9; }
#sidebar button {
  padding: 6px 12px; border: 1px solid #2a2a4a; border-radius: 4px; background: #0f3460;
  cursor: pointer; font-size: 13px; color: #e0e0e0; transition: background .15s;
}
#sidebar button:hover { background: #1a3a6e; }
.radio-group { display: flex; flex-direction: column; gap: 3px; }
.radio-group label { font-size: 12px; }

.summary-box { background: #0f3460; border-radius: 6px; padding: 10px; font-size: 12px; line-height: 1.7; }
.summary-row { display: flex; justify-content: space-between; }
.summary-count { font-weight: 600; }
.c-pass { color: #8a8a8a; } .c-ext { color: #e94560; } .c-repl { color: #0ea5e9; } .c-new { color: #4ade80; } .c-gc { color: #f59e0b; }

.select-all-row { border-bottom: 1px solid #2a2a4a; padding-bottom: 3px; margin-bottom: 2px; }

#main { flex: 1; display: flex; flex-direction: column; }
#cy { flex: 1; background: #1a1a2e; }

#info-panel {
  height: 260px; min-height: 100px; background: #16213e; border-top: 1px solid #2a2a4a;
  padding: 12px 16px; overflow-y: auto; font-size: 13px; line-height: 1.6;
}
#info-panel h3 { font-size: 15px; margin-bottom: 6px; color: #e0e0e0; }
#info-panel .lbl { color: #a0a0b0; font-weight: 500; }
#info-panel .tag { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin: 1px 2px; }
#info-panel .t-pass { background: #1a1a2e; color: #8a8a8a; border: 1px solid #333; }
#info-panel .t-ext { background: #3a1020; color: #e94560; border: 1px solid #e9456044; }
#info-panel .t-repl { background: #0a2040; color: #0ea5e9; border: 1px solid #0ea5e944; }
#info-panel .t-new { background: #0a2a10; color: #4ade80; border: 1px solid #4ade8044; }

.chain-box { margin: 6px 0; padding: 8px 10px; background: #0f3460; border-radius: 6px; font-size: 12px; line-height: 1.8; border-left: 3px solid #0ea5e9; }
.chain-box.chain-view { border-left-color: #a855f7; }
.chain-box.chain-dsa { border-left-color: #f59e0b; }
.chain-box h4 { font-size: 12px; color: #a0a0b0; margin-bottom: 4px; }
.chain-step { display: flex; align-items: center; gap: 4px; }
.chain-arr { color: #555; font-size: 13px; margin: 1px 0 1px 8px; }
.s-base { color: #0ea5e9; font-weight: 600; }
.s-ext { color: #e94560; }
.s-ext-gc { color: #8a8a8a; }
.s-final { color: #4ade80; font-weight: 600; }
.s-idx { color: #555; font-size: 11px; min-width: 18px; }
.s-file { color: #555; font-size: 11px; }

#legend { padding: 8px; font-size: 11px; border-top: 1px solid #2a2a4a; }
.leg-item { display: flex; align-items: center; gap: 6px; margin: 2px 0; }
.leg-sw { width: 16px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.leg-ln { width: 22px; height: 0; flex-shrink: 0; }
</style>
</head>
<body>
<div id="sidebar">
  <div>
    <h2>Search</h2>
    <input type="text" id="search" placeholder="Type to search modules..." />
  </div>
  <div>
    <h2>Summary</h2>
    <div class="summary-box">
      <div class="summary-row"><span>Total modules:</span><span class="summary-count">${data.summary.total}</span></div>
      <div class="summary-row"><span class="c-pass">Passthrough:</span><span class="summary-count c-pass">${data.summary.passthrough}</span></div>
      <div class="summary-row"><span class="c-repl">Replaced:</span><span class="summary-count c-repl">${data.summary.replaced}</span></div>
      <div class="summary-row"><span class="c-ext">Extended:</span><span class="summary-count c-ext">${data.summary.extended}</span></div>
      <div class="summary-row"><span class="c-new">New:</span><span class="summary-count c-new">${data.summary.new}</span></div>
    </div>
  </div>
  <div>
    <h2>Edge Types</h2>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-order" checked> Registration Order</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-gc-source" checked> Grid Core Source</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-ext-ctrl" checked> Controller Chains</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-dsa" checked> DSA Chain</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-cross-dep" checked> Cross-dependencies</label>
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-dsa" checked> DataSourceAdapter</label>
  </div>
  <div>
    <h2>Module Categories</h2>
    <label><input type="checkbox" class="cat-toggle" data-cat="passthrough" checked> <span class="c-pass">Passthrough</span></label>
    <label><input type="checkbox" class="cat-toggle" data-cat="replaced" checked> <span class="c-repl">Replaced</span></label>
    <label><input type="checkbox" class="cat-toggle" data-cat="extended" checked> <span class="c-ext">Extended</span></label>
    <label><input type="checkbox" class="cat-toggle" data-cat="new" checked> <span class="c-new">New</span></label>
    <label><input type="checkbox" class="cat-toggle" data-cat="grid-core" checked> <span class="c-gc">Grid Core</span></label>
  </div>
  <div>
    <h2>Feature Areas</h2>
    <label class="select-all-row"><input type="checkbox" id="toggle-all-areas" checked> Select / Unselect All</label>
    ${featureAreas.map((a) => `<label><input type="checkbox" class="area-toggle" data-area="${a}" checked> ${a}</label>`).join('\n    ')}
  </div>
  <div>
    <h2>Layout</h2>
    <div class="radio-group">
      <label><input type="radio" name="orient" value="TB" checked> Top to Bottom</label>
      <label><input type="radio" name="orient" value="LR"> Left to Right</label>
    </div>
  </div>
  <div>
    <h2>Edge Routing</h2>
    <div class="radio-group">
      <label><input type="radio" name="edge-routing" value="bezier" checked> Bezier</label>
      <label><input type="radio" name="edge-routing" value="taxi"> Taxi (orthogonal)</label>
    </div>
  </div>
  <div style="display:flex;gap:8px">
    <button id="btn-fit">Fit View</button>
    <button id="btn-reset">Reset</button>
  </div>
  <div id="legend">
    <h2>Legend &mdash; Nodes</h2>
    <div class="leg-item"><div class="leg-sw" style="background:#1a1a2e;border:1px solid #555"></div> Passthrough</div>
    <div class="leg-item"><div class="leg-sw" style="background:#0a2040;border:2px solid #0ea5e9"></div> Replaced</div>
    <div class="leg-item"><div class="leg-sw" style="background:#3a1020;border:2px solid #e94560"></div> Extended</div>
    <div class="leg-item"><div class="leg-sw" style="background:#0a2a10;border:2px dashed #4ade80"></div> New</div>
    <div class="leg-item"><div class="leg-sw" style="background:#1a1a2e;border:2px dashed #f59e0b"></div> Grid Core Source</div>
    <div class="leg-item"><div class="leg-sw" style="background:#0a2a1a;border:2px dashed #10b981;clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)"></div> Shared Mixin / Utility</div>
    <h2 style="margin-top:6px">Legend &mdash; Edges</h2>
    <div class="leg-item"><div class="leg-ln" style="border-top:1px dotted #c1c1c1"></div> Registration Order</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:1.5px dashed #f59e0b"></div> Grid Core &rarr; DataGrid</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #0ea5e9"></div> Controller Chain</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #f59e0b"></div> DSA Chain</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2px dashed #10b981"></div> Cross-dependency</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #f59e0b"></div> DataSourceAdapter</div>
  </div>
</div>
<div id="main">
  <div id="cy"></div>
  <div id="info-panel">
    <p style="color:#a0a0b0">Click a module to see its extension and inheritance chains.</p>
  </div>
</div>

<script>
var ELS = ${elementsJson};
var PIPELINES = ${pipelinesJson};
var DSA = ${dsaJson};
var MODULES = ${modulesJson};
var GC_MODULES = ${gridCoreModulesJson};
var CROSS_DEPS = ${JSON.stringify(data.crossDependencies)};

var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: ELS,
  style: [
    { selector: 'node.module', style: {
      'shape': 'round-rectangle',
      'background-color': '#1a1a2e', 'border-width': 1, 'border-color': '#444',
      'label': 'data(label)', 'text-valign': 'center', 'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '200px',
      'font-size': 11, 'color': '#e0e0e0',
      'padding': '10px', 'width': 'label', 'height': 'label', 'min-width': 90, 'min-height': 34,
    }},
    { selector: 'node.module.passthrough', style: {
      'background-color': '#1a1a2e', 'border-color': '#444', 'color': '#888', 'background-opacity': .4,
    }},
    { selector: 'node.module.replaced', style: {
      'background-color': '#0a2040', 'border-width': 2, 'border-color': '#0ea5e9', 'color': '#b0d8f0',
    }},
    { selector: 'node.module.extended', style: {
      'background-color': '#3a1020', 'border-width': 2, 'border-color': '#e94560', 'color': '#f0b0b8',
    }},
    { selector: 'node.module.new', style: {
      'background-color': '#0a2a10', 'border-width': 2, 'border-style': 'dashed', 'border-color': '#4ade80', 'color': '#b0f0c0',
    }},
    { selector: 'node.module.grid-core', style: {
      'background-color': '#1a1a2e', 'border-width': 2, 'border-style': 'dashed', 'border-color': '#f59e0b', 'color': '#f5c040',
      'background-opacity': 0.5, 'shape': 'barrel',
    }},
    { selector: 'node.module.utility', style: {
      'background-color': '#0a2a1a', 'border-width': 2, 'border-style': 'dashed', 'border-color': '#10b981', 'color': '#6ee7b7',
      'shape': 'diamond',
    }},

    { selector: 'edge.edge-gc-source', style: {
      'line-color': '#f59e0b', 'target-arrow-color': '#f59e0b', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1.5, 'arrow-scale': .7,
      'line-style': 'dashed', 'opacity': .5,
      'label': 'data(label)', 'font-size': 9, 'color': '#f5c040',
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '3px', 'text-background-shape': 'round-rectangle',
    }},

    { selector: 'edge.edge-order', style: {
      'line-color': '#c1c1c1', 'target-arrow-color': '#c1c1c1', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1, 'arrow-scale': .5,
      'line-style': 'dotted', 'opacity': .3,
    }},
    { selector: 'edge.edge-ext-ctrl', style: {
      'line-color': '#0ea5e9', 'target-arrow-color': '#0ea5e9', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2.5, 'arrow-scale': .8,
      'label': 'data(label)', 'font-size': 9, 'color': '#5bb8e8',
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '3px', 'text-background-shape': 'round-rectangle',
      'text-rotation': 'none',
    }},
    { selector: 'edge.edge-ext-view', style: {
      'line-color': '#a855f7', 'target-arrow-color': '#a855f7', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2.5, 'arrow-scale': .8,
      'label': 'data(label)', 'font-size': 9, 'color': '#c090f0',
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '3px', 'text-background-shape': 'round-rectangle',
      'text-rotation': 'none',
    }},
    { selector: 'edge.edge-dsa', style: {
      'line-color': '#f59e0b', 'target-arrow-color': '#f59e0b', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2.5, 'arrow-scale': .8,
      'label': 'data(label)', 'font-size': 9, 'color': '#f5c040',
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '3px', 'text-background-shape': 'round-rectangle',
      'text-rotation': 'none',
    }},

    { selector: 'edge.edge-cross-dep', style: {
      'line-color': '#10b981', 'target-arrow-color': '#10b981', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2, 'arrow-scale': .7,
      'line-style': 'dashed', 'opacity': .6,
      'label': 'data(label)', 'font-size': 8, 'color': '#6ee7b7',
      'text-background-color': '#0a2a1a', 'text-background-opacity': .9,
      'text-background-padding': '3px', 'text-background-shape': 'round-rectangle',
      'text-rotation': 'none',
    }},

    { selector: '.highlighted', style: { 'opacity': 1, 'z-index': 999 }},
    { selector: 'edge.highlighted', style: { 'opacity': 1, 'z-index': 999, 'width': 4 }},
    { selector: '.faded', style: { 'opacity': .05 }},
    { selector: 'node.search-match', style: { 'border-width': 3, 'border-color': '#FF6B6B' }},
  ],
  layout: { name: 'preset' },
});

/* ── ELK Layout ── */
function getOrient() { var c = document.querySelector('input[name="orient"]:checked'); return c ? c.value : 'TB'; }
function elkDir(o) { return { TB: 'DOWN', LR: 'RIGHT' }[o] || 'DOWN'; }
function taxiDir(o) { return { TB: 'downward', LR: 'rightward' }[o] || 'downward'; }
function getEdgeRouting() { var c = document.querySelector('input[name="edge-routing"]:checked'); return c ? c.value : 'bezier'; }

function updateEdgeStyles(orient) {
  var routing = getEdgeRouting();
  if (routing === 'taxi') {
    var dir = taxiDir(orient);
    cy.edges().style({ 'curve-style': 'taxi', 'taxi-direction': dir, 'taxi-turn': '50%' });
    cy.edges().forEach(function(edge) {
      var sb = edge.source().boundingBox();
      var tb = edge.target().boundingBox();
      var overlaps = !(sb.x2 < tb.x1 || tb.x2 < sb.x1 || sb.y2 < tb.y1 || tb.y2 < sb.y1);
      if (overlaps) {
        edge.style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
      }
    });
  } else {
    cy.edges().style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
  }
}

function layoutOpts(o) {
  var routing = getEdgeRouting();
  var elkRouting = routing === 'taxi' ? 'ORTHOGONAL' : 'POLYLINE';
  return {
    name: 'elk',
    elk: {
      algorithm: 'layered',
      'elk.direction': elkDir(o),
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
      'elk.layered.spacing.edgeNodeBetweenLayers': '50',
      'elk.spacing.nodeNode': '40',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.mergeEdges': 'true',
      'elk.edgeRouting': elkRouting,
    },
    nodeDimensionsIncludeLabels: true,
    animate: true,
    animationDuration: 400,
    stop: function() { updateEdgeStyles(o); applyEdgeFilters(); },
  };
}
cy.layout(layoutOpts('TB')).run();

/* ── Highlight ── */
function highlightSet(t) {
  if (t.isEdge()) return cy.collection().union(t).union(t.source()).union(t.target());
  var edges = t.connectedEdges().filter(function(e) { return e.style('display') !== 'none'; });
  return cy.collection().union(t).union(edges).union(edges.connectedNodes());
}
function doHighlight(set) { cy.elements().addClass('faded').removeClass('highlighted'); set.removeClass('faded').addClass('highlighted'); }
function clearHL() { cy.elements().removeClass('faded highlighted'); }

var sel = null, infoP = document.getElementById('info-panel');
cy.on('tap', 'node, edge', function(e) {
  var t = e.target;
  if (sel && sel.id() === t.id()) { sel = null; clearHL(); showDefault(); return; }
  sel = t; doHighlight(highlightSet(t)); showInfo(t);
});
cy.on('tap', function(e) { if (e.target === cy && sel) { sel = null; clearHL(); showDefault(); } });

/* ── Info Panel ── */
function showDefault() { infoP.innerHTML = '<p style="color:#a0a0b0">Click a module to see its extension and inheritance chains.</p>'; }
function tagFor(cat) { return '<span class="tag t-' + cat + '">' + cat.toUpperCase() + '</span>'; }
function findModuleInfo(name) { return MODULES.find(function(m) { return m.moduleName === name; }); }
function findGcModule(name) { return GC_MODULES.find(function(gc) { return gc.registeredAs === name || gc.moduleName === name; }); }

function renderChain(p, cls) {
  var h = '<div class="chain-box ' + cls + '"><h4>' + (p.targetType === 'controller' ? 'Controller' : 'View') + ': ' + p.targetName + '</h4>';
  h += '<div class="chain-step"><span class="s-base">grid_core: ' + p.targetName + '</span></div>';
  for (var i = 0; i < p.steps.length; i++) {
    var s = p.steps[i];
    h += '<div class="chain-arr">&darr; extends</div>';
    var c = s.isFromGridCore ? 's-ext-gc' : 's-ext';
    h += '<div class="chain-step"><span class="s-idx">' + (i + 1) + '.</span> <span class="' + c + '">' + s.moduleName + '</span> <span class="s-file">(' + s.relPath + ')</span></div>';
  }
  h += '<div class="chain-arr">&darr;</div>';
  h += '<div class="chain-step"><span class="s-final">Final ' + p.targetName + '</span></div>';
  h += '</div>';
  return h;
}

function renderDsaChain() {
  if (!DSA || !DSA.length) return '';
  var h = '<div class="chain-box chain-dsa"><h4>DataSourceAdapter</h4>';
  h += '<div class="chain-step"><span class="s-base">DataSourceAdapterType (base)</span></div>';
  for (var i = 0; i < DSA.length; i++) {
    var d = DSA[i];
    var mod = MODULES.find(function(m) { return m.relPath === d.relPath; });
    var name = mod ? mod.moduleName : d.relPath;
    h += '<div class="chain-arr">&darr; .extend()</div>';
    var c = d.isImportedFromGridCore ? 's-ext-gc' : 's-ext';
    h += '<div class="chain-step"><span class="s-idx">' + (i + 1) + '.</span> <span class="' + c + '">' + name + '</span> <span class="s-file">(' + d.relPath + ')</span></div>';
  }
  h += '<div class="chain-arr">&darr;</div>';
  h += '<div class="chain-step"><span class="s-final">Final DataSourceAdapterType</span></div>';
  h += '</div>';
  return h;
}

function showInfo(t) {
  var d = t.data(), h = '';

  if (t.isNode() && d.nodeType === 'gridCoreModule') {
    h = '<h3>' + d.moduleName + ' <span class="tag" style="background:#3a2a00;color:#f59e0b;border:1px solid #f59e0b44">GRID CORE</span></h3>';
    h += '<p><span class="lbl">Source:</span> grid_core/' + d.sourceFile + '</p>';
    h += '<p><span class="lbl">Area:</span> ' + d.featureArea + '</p>';
    try {
      var gcCtrls = JSON.parse(d.controllers || '{}');
      var gcViews = JSON.parse(d.views || '{}');
      var gcExts = JSON.parse(d.extenders || '{}');
      var ctrlNames = Object.keys(gcCtrls);
      var viewNames = Object.keys(gcViews);
      if (ctrlNames.length > 0) {
        h += '<h3 style="margin-top:8px">Controllers:</h3>';
        for (var ci = 0; ci < ctrlNames.length; ci++) {
          var cn = ctrlNames[ci]; var cc = gcCtrls[cn];
          h += '<p style="font-size:12px;margin-left:8px"><b>' + cn + '</b>: ' + cc.className + ' extends ' + cc.baseClass + ' <span class="s-file">(' + cc.sourceFile + ')</span></p>';
        }
      }
      if (viewNames.length > 0) {
        h += '<h3 style="margin-top:8px">Views:</h3>';
        for (var vi = 0; vi < viewNames.length; vi++) {
          var vn = viewNames[vi]; var vc = gcViews[vn];
          h += '<p style="font-size:12px;margin-left:8px"><b>' + vn + '</b>: ' + vc.className + ' extends ' + vc.baseClass + ' <span class="s-file">(' + vc.sourceFile + ')</span></p>';
        }
      }
      var extCtrlNames = Object.keys(gcExts.controllers || {});
      var extViewNames = Object.keys(gcExts.views || {});
      if (extCtrlNames.length > 0) {
        h += '<h3 style="margin-top:8px">Extender Controllers:</h3>';
        for (var ei = 0; ei < extCtrlNames.length; ei++) {
          var en = extCtrlNames[ei]; var ec = gcExts.controllers[en];
          h += '<p style="font-size:12px;margin-left:8px"><b>' + en + '</b>: ' + ec.extenderName + ' (' + ec.pattern + ')</p>';
        }
      }
      if (extViewNames.length > 0) {
        h += '<h3 style="margin-top:8px">Extender Views:</h3>';
        for (var evi = 0; evi < extViewNames.length; evi++) {
          var evn = extViewNames[evi]; var evc = gcExts.views[evn];
          h += '<p style="font-size:12px;margin-left:8px"><b>' + evn + '</b>: ' + evc.extenderName + ' (' + evc.pattern + ')</p>';
        }
      }
    } catch(e) { /* ignore parse errors */ }
  } else if (t.isNode() && d.nodeType === 'utility') {
    h = '<h3>' + d.label + ' <span class="tag" style="background:#0a2a1a;color:#10b981;border:1px solid #10b98144">SHARED</span></h3>';
    h += '<p><span class="lbl">Source:</span> ' + d.sourceFile + '</p>';
    h += '<p style="font-size:12px;color:#888;margin-top:4px">This file does not register a module. It provides shared code (mixin, utility, base class) used by other modules.</p>';
    var crossDepsTo = CROSS_DEPS.filter(function(cd) { return cd.toRelPath === d.sourceFile; });
    if (crossDepsTo.length > 0) {
      h += '<h3 style="margin-top:8px">Used by:</h3>';
      for (var ui = 0; ui < crossDepsTo.length; ui++) {
        h += '<p style="font-size:12px;margin-left:8px"><b>' + crossDepsTo[ui].fromModule + '</b> imports <span style="color:#6ee7b7">' + crossDepsTo[ui].importedNames.join(', ') + '</span></p>';
      }
    }
  } else if (t.isNode() && d.nodeType === 'module') {
    h = '<h3>#' + (d.registrationOrder + 1) + ' ' + d.moduleName + ' ' + tagFor(d.category) + '</h3>';
    h += '<p><span class="lbl">Source:</span> ' + d.sourceFile + '</p>';
    h += '<p><span class="lbl">Area:</span> ' + d.featureArea + '</p>';
    if (d.details) h += '<p><span class="lbl">Details:</span> ' + d.details + '</p>';
    if (d.gridCoreSource) h += '<p><span class="lbl">Grid Core Source:</span> ' + d.gridCoreSource + '</p>';

    var gc = findGcModule(d.moduleName);
    if (gc) {
      h += '<div style="margin-top:8px;padding:6px 8px;background:#2a2000;border:1px solid #f59e0b44;border-radius:4px;font-size:12px">';
      h += '<b style="color:#f59e0b">Grid Core Source Module:</b> ' + gc.moduleName + ' <span class="s-file">(' + gc.sourceFile + ')</span>';
      var gcCtrlNames = Object.keys(gc.controllers);
      var gcViewNames = Object.keys(gc.views);
      if (gcCtrlNames.length > 0) h += '<br>Controllers: ' + gcCtrlNames.join(', ');
      if (gcViewNames.length > 0) h += '<br>Views: ' + gcViewNames.join(', ');
      var gcExtCtrls = Object.keys(gc.extenders.controllers || {});
      var gcExtViews = Object.keys(gc.extenders.views || {});
      if (gcExtCtrls.length > 0) h += '<br>Extender Ctrls: ' + gcExtCtrls.join(', ');
      if (gcExtViews.length > 0) h += '<br>Extender Views: ' + gcExtViews.join(', ');
      h += '</div>';
    }

    var ctrlPips = PIPELINES.filter(function(p) { return p.targetType === 'controller' && p.steps.some(function(s) { return s.moduleName === d.moduleName; }); });
    var viewPips = PIPELINES.filter(function(p) { return p.targetType === 'view' && p.steps.some(function(s) { return s.moduleName === d.moduleName; }); });

    if (ctrlPips.length > 0) {
      h += '<h3 style="margin-top:8px">Controller Chains:</h3>';
      for (var i = 0; i < ctrlPips.length; i++) h += renderChain(ctrlPips[i], '');
    }
    if (viewPips.length > 0) {
      h += '<h3 style="margin-top:8px">View Chains:</h3>';
      for (var j = 0; j < viewPips.length; j++) h += renderChain(viewPips[j], 'chain-view');
    }

    var inDsa = DSA.some(function(dd) { return MODULES.find(function(m) { return m.relPath === dd.relPath && m.moduleName === d.moduleName; }); });
    if (inDsa) {
      h += '<h3 style="margin-top:8px">DataSourceAdapter:</h3>';
      h += '<p style="font-size:12px;color:#a0a0b0;margin-bottom:4px">This module calls <code style="color:#f5c040">dataSourceAdapterProvider.extend()</code>, wrapping the base DataSourceAdapterType. Each <code>.extend()</code> adds a behavior layer (grouping, virtual scrolling, summaries).</p>';
      h += renderDsaChain();
    }

    if (d.category === 'passthrough') {
      h += '<p style="margin-top:8px;font-size:12px;color:#666">This module directly re-exports a grid_core module without modifications.</p>';
    }
  } else if (t.isEdge()) {
    var et = d.edgeType;
    h = '<h3>Edge: ' + et + '</h3>';
    h += '<p><span class="lbl">From:</span> ' + (d.source || '').replace('mod-', '') + '</p>';
    h += '<p><span class="lbl">To:</span> ' + (d.target || '').replace('mod-', '') + '</p>';
    if (d.targetName) h += '<p><span class="lbl">Target:</span> ' + d.targetName + '</p>';
    if (et === 'extender-chain') {
      h += '<p style="font-size:12px;color:#a0a0b0;margin-top:4px">Module <b>' + (d.source || '').replace('mod-', '') + '</b> extends ' + d.targetType + ' <b>' + d.targetName + '</b>, then the result is further extended by <b>' + (d.target || '').replace('mod-', '') + '</b>.</p>';
      var pip = PIPELINES.find(function(p) { return p.targetName === d.targetName && p.targetType === d.targetType; });
      if (pip) {
        var cls = d.targetType === 'view' ? 'chain-view' : '';
        h += renderChain(pip, cls);
      }
    }
    if (et === 'dsa-chain') {
      h += '<p style="font-size:12px;color:#a0a0b0;margin-top:4px">Both modules sequentially wrap the DataSourceAdapterType via <code style="color:#f59e0b">.extend()</code>.</p>';
      h += renderDsaChain();
    }
    if (et === 'grid-core-source') {
      h += '<p style="font-size:12px;color:#a0a0b0;margin-top:4px">The data_grid module <b>' + (d.target || '').replace('mod-', '').replace('gc-', '') + '</b> is derived from the grid_core module <b>' + (d.source || '').replace('gc-', '').replace('mod-', '') + '</b>.</p>';
    }
    if (et === 'cross-dep') {
      h += '<p style="font-size:12px;color:#a0a0b0;margin-top:4px">Module <b>' + (d.source || '').replace('mod-', '') + '</b> imports <span style="color:#6ee7b7">' + (d.label || '') + '</span> from <b>' + (d.toRelPath || (d.target || '').replace('mod-', '')) + '</b>';
      if (d.importPath) h += ' <span class="s-file">(import path: ' + d.importPath + ')</span>';
      h += '</p>';
      h += '<p style="font-size:12px;color:#888;margin-top:4px">This is a direct code dependency between data_grid modules — the source file imports a class, mixin, or utility from the target.</p>';
    }
  }
  infoP.innerHTML = h;
}

/* ── Search ── */
document.getElementById('search').addEventListener('input', function(e) {
  var q = e.target.value.toLowerCase();
  cy.nodes().removeClass('search-match');
  if (!q) return;
  var m = cy.nodes().filter(function(n) { return (n.data('label') || '').toLowerCase().includes(q) || n.data('id').toLowerCase().includes(q); });
  m.addClass('search-match');
  if (m.length === 1) cy.animate({ center: { eles: m }, zoom: 1.5 }, { duration: 300 });
  else if (m.length > 0) cy.animate({ fit: { eles: m, padding: 50 } }, { duration: 300 });
});

/* ── Edge Toggles ── */
function applyEdgeFilters() {
  document.querySelectorAll('.edge-toggle').forEach(function(cb) {
    var cls = cb.dataset.cls, show = cb.checked;
    cy.edges('.' + cls).style('display', show ? 'element' : 'none');
  });
}
document.querySelectorAll('.edge-toggle').forEach(function(cb) { cb.addEventListener('change', applyEdgeFilters); });

/* ── Category Toggles ── */
function applyCatFilters() {
  document.querySelectorAll('.cat-toggle').forEach(function(cb) {
    var cat = cb.dataset.cat, show = cb.checked;
    cy.nodes('.module.' + cat).forEach(function(n) {
      n.style('display', show ? 'element' : 'none');
      n.connectedEdges().forEach(function(e) { if (!show) e.style('display', 'none'); });
    });
  });
  applyEdgeFilters();
}
document.querySelectorAll('.cat-toggle').forEach(function(cb) { cb.addEventListener('change', applyCatFilters); });

/* ── Area Toggles ── */
function applyAreaFilters() {
  document.querySelectorAll('.area-toggle').forEach(function(cb) {
    var area = cb.dataset.area, show = cb.checked;
    cy.nodes('[featureArea="' + area + '"]').forEach(function(n) {
      n.style('display', show ? 'element' : 'none');
      n.connectedEdges().forEach(function(e) { if (!show) e.style('display', 'none'); });
    });
  });
  applyEdgeFilters();
}
document.getElementById('toggle-all-areas').addEventListener('change', function() {
  var c = this.checked;
  document.querySelectorAll('.area-toggle').forEach(function(cb) { cb.checked = c; });
  applyAreaFilters();
});
document.querySelectorAll('.area-toggle').forEach(function(cb) {
  cb.addEventListener('change', function() {
    applyAreaFilters();
    var all = document.querySelectorAll('.area-toggle');
    var ac = Array.from(all).every(function(t) { return t.checked; });
    var nc = Array.from(all).every(function(t) { return !t.checked; });
    var sa = document.getElementById('toggle-all-areas');
    sa.checked = ac; sa.indeterminate = !ac && !nc;
  });
});

/* ── Layout & Edge Routing ── */
function rerun() { cy.layout(layoutOpts(getOrient())).run(); }
document.querySelectorAll('input[name="orient"]').forEach(function(r) { r.addEventListener('change', rerun); });
document.querySelectorAll('input[name="edge-routing"]').forEach(function(r) { r.addEventListener('change', rerun); });

/* ── Buttons ── */
document.getElementById('btn-fit').addEventListener('click', function() { cy.fit(undefined, 40); });
document.getElementById('btn-reset').addEventListener('click', function() {
  sel = null; clearHL();
  document.getElementById('search').value = '';
  cy.nodes().removeClass('search-match');
  document.querySelectorAll('.edge-toggle').forEach(function(cb) {
    cb.checked = cb.dataset.cls !== 'edge-order';
  });
  document.querySelectorAll('.cat-toggle').forEach(function(cb) { cb.checked = true; });
  document.getElementById('toggle-all-areas').checked = true;
  document.getElementById('toggle-all-areas').indeterminate = false;
  document.querySelectorAll('.area-toggle').forEach(function(cb) { cb.checked = true; });
  cy.elements().style('display', 'element');
  document.querySelector('input[name="orient"][value="TB"]').checked = true;
  document.querySelector('input[name="edge-routing"][value="bezier"]').checked = true;
  cy.layout(layoutOpts('TB')).run();
  showDefault();
});
</script>
</body>
</html>`;
}
