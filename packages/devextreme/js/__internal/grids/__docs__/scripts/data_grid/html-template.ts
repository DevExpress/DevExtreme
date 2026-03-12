/* eslint-disable spellcheck/spell-checker */
import { buildCytoscapeElements } from './graph-builder';
import type { ArchitectureData } from './types';

export function generateHtml(data: ArchitectureData): string {
  const cytoscapeElements = buildCytoscapeElements(data);
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
        const mod = data.modules.find((m) => m.relPath === ext.relPath);
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
    controllers: m.controllers,
    views: m.views,
    extenders: m.extenders,
  })));

  const categories = ['passthrough', 'extended', 'replaced', 'new', 'grid-core', 'gc-target'];
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
<script src="https://unpkg.com/elkjs@0.9.3/lib/elk.bundled.js"></script>
<script src="https://unpkg.com/cytoscape-elk@2.2.0/dist/cytoscape-elk.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;height:100vh;background:#1a1a1a;color:#e8e8e8}
#sidebar{width:270px;min-width:270px;background:#2a2a2a;border-right:1px solid #555;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}
#sidebar h2{font-size:13px;color:#aaa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
#sidebar label{display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;padding:1px 0;color:#e8e8e8}
#sidebar input[type="checkbox"]{accent-color:#5B9BD5}
#sidebar input[type="text"]{width:100%;padding:6px 10px;border:1px solid #444;border-radius:4px;font-size:13px;background:#333;color:#e8e8e8;outline:none}
#sidebar input[type="text"]:focus-visible{border-color:#777}
#sidebar button{padding:5px 10px;border:1px solid #555;border-radius:4px;background:#333;cursor:pointer;font-size:12px;color:#e8e8e8}
#sidebar button:hover{background:#444}
.radio-group{display:flex;flex-direction:column;gap:3px}
.radio-group label{font-size:11px}
#main{flex:1;display:flex;flex-direction:column}
#cy{flex:1;background:#212121}
#info-panel{height:180px;min-height:80px;background:#2a2a2a;border-top:1px solid #555;padding:12px 16px;overflow-y:auto;font-size:12px;line-height:1.5;color:#e8e8e8}
#info-panel h3{font-size:13px;margin-bottom:4px}
#info-panel .lbl{color:#aaa;font-weight:500}
.tag{display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;margin:1px 2px}
.s-file{color:#888;font-size:11px}
.c-pt{background:#2a3a2a;color:#68d391;border:1px solid #68d39133}
.c-ext{background:#2a2a3a;color:#90cdf4;border:1px solid #90cdf433}
.c-rep{background:#3a2a2a;color:#fc8181;border:1px solid #fc818133}
.c-new{background:#3a3a2a;color:#f6e05e;border:1px solid #f6e05e33}
.c-gc{background:#3a2a00;color:#f5c040;border:1px solid #f5c04033}
.c-util{background:#0a2a1a;color:#6ee7b7;border:1px solid #10b98133}
#legend{padding:8px;font-size:12px;border-top:1px solid #555}
.leg-item{display:flex;align-items:center;gap:6px;margin:2px 0}
.leg-sw{width:18px;height:12px;border-radius:2px;flex-shrink:0}
.leg-ln{width:24px;height:0;flex-shrink:0}
.chain-box{margin:4px 0;padding:6px;background:#1a1a2e;border:1px solid #334;border-radius:4px;font-size:11px}
.chain-step{padding:2px 6px;border-radius:3px;margin:2px 0;display:inline-block}
.chain-arr{color:#666;font-size:10px;margin:1px 0}
.s-current{background:#2a3a5a;color:#90cdf4}
.s-gc{background:#3a2a1a;color:#f5c040}
.s-final{background:#1a3a1a;color:#68d391}
.select-all-row{border-bottom:1px solid #555;padding-bottom:3px;margin-bottom:2px}
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
    <label><input type="checkbox" class="edge-toggle" data-cls="edge-gc-defines" checked> GC Defines (ctrl/view)</label>
  </div>
  <div>
    <h2>Categories</h2>
    <label class="select-all-row"><input type="checkbox" id="cat-all" checked> All</label>
    ${categories.map((c) => `<label><input type="checkbox" class="cat-toggle" data-cat="${c}" checked> ${c}</label>`).join('\n    ')}
  </div>
  <div>
    <h2>Feature Areas</h2>
    <label class="select-all-row"><input type="checkbox" id="area-all" checked> All</label>
    ${featureAreas.map((a) => `<label><input type="checkbox" class="area-toggle" data-area="${a}" checked> ${a}</label>`).join('\n    ')}
  </div>
  <div>
    <h2>Orientation</h2>
    <div class="radio-group">
      <label><input type="radio" name="orient" value="TB" checked> Top → Bottom</label>
      <label><input type="radio" name="orient" value="LR"> Left → Right</label>
    </div>
    <h2 style="margin-top:8px">Edge Routing</h2>
    <div class="radio-group">
      <label><input type="radio" name="edge-routing" value="taxi" checked> Orthogonal</label>
      <label><input type="radio" name="edge-routing" value="bezier"> Bezier</label>
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
    <div class="leg-item"><div class="leg-sw" style="background:#1e1e3a;border:2px solid #c084fc;border-radius:50%"></div> GC Target (ctrl/view)</div>
    <div class="leg-item"><div class="leg-sw" style="background:#2a2a1e;border:2px dashed #f6e05e;clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)"></div> DG Target (ctrl/view)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:1px dotted #c1c1c1"></div> Registration Order</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #0ea5e9"></div> Extender (ctrl → target)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:2.5px solid #a855f7"></div> Extender (view → target)</div>
    <div class="leg-item"><div class="leg-ln" style="border-top:1.5px dashed #a78bfa"></div> GC Defines (ctrl/view)</div>
  </div>
</div>
<div id="main">
  <div id="cy"></div>
  <div id="info-panel"><p style="color:#888">Click a node or edge to see details.</p></div>
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
      'text-valign': 'top', 'text-margin-y': 6, 'padding': '30px',
      'min-width': '80px',
    }},
    { selector: 'node.module.extended', style: { 'background-color': '#2a3a3a', 'border-color': '#90cdf4',
      'text-valign': 'top', 'text-margin-y': 6, 'padding': '30px',
      'min-width': '80px',
    }},
    { selector: 'node.module.replaced', style: { 'background-color': '#3a2a2a', 'border-color': '#fc8181',
      'text-valign': 'top', 'text-margin-y': 6, 'padding': '30px',
      'min-width': '80px',
    }},
    { selector: 'node.module.new', style: { 'background-color': '#3a3a2a', 'border-color': '#f6e05e' }},
    { selector: 'node.module.grid-core', style: {
      'background-color': '#1a1a2e', 'border-width': 2, 'border-style': 'dashed', 'border-color': '#f59e0b',
      'color': '#f5c040', 'background-opacity': 0.5, 'shape': 'barrel',
      'padding': '12px',
    }},
    { selector: 'node.module.utility', style: {
      'background-color': '#0a2a1a', 'border-width': 2, 'border-style': 'dashed',
      'border-color': '#10b981', 'color': '#6ee7b7', 'shape': 'diamond',
    }},
    { selector: 'node.gc-target', style: {
      'background-color': '#1e1e3a', 'border-width': 2, 'border-style': 'solid',
      'border-color': '#c084fc', 'color': '#d8b4fe', 'shape': 'ellipse',
      'background-opacity': 0.6, 'font-size': 9,
      'text-valign': 'center', 'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '120px',
      'padding': '10px', 'width': 'label', 'height': 'label',
      'label': 'data(label)',
    }},
    { selector: 'node.gc-target-controller', style: {
      'border-color': '#7dd3fc', 'color': '#bae6fd',
    }},
    { selector: 'node.gc-target-view', style: {
      'border-color': '#c084fc', 'color': '#d8b4fe',
    }},
    { selector: 'node.dg-target', style: {
      'background-color': '#2a2a1e', 'border-style': 'dashed',
      'border-color': '#f6e05e', 'color': '#fde68a', 'shape': 'round-diamond',
    }},
    { selector: 'node.dg-target.gc-target-controller', style: {
      'border-color': '#f6e05e', 'color': '#fde68a',
    }},
    { selector: 'node.dg-target.gc-target-view', style: {
      'border-color': '#fbbf24', 'color': '#fde68a',
    }},
    { selector: 'edge.edge-order', style: {
      'line-color': '#c1c1c1', 'target-arrow-color': '#c1c1c1', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1, 'arrow-scale': .5,
      'line-style': 'dotted', 'opacity': .25,
    }},
    { selector: 'edge.edge-ext-ctrl', style: {
      'line-color': '#0ea5e9', 'target-arrow-color': '#0ea5e9', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2.5, 'arrow-scale': .8,
      'label': 'data(label)', 'font-size': 8, 'color': '#5bb8e8',
      'text-rotation': 'autorotate', 'text-margin-y': -8,
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
    }},
    { selector: 'edge.edge-ext-view', style: {
      'line-color': '#a855f7', 'target-arrow-color': '#a855f7', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 2.5, 'arrow-scale': .8,
      'label': 'data(label)', 'font-size': 8, 'color': '#c090f0',
      'text-rotation': 'autorotate', 'text-margin-y': -8,
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
    }},
    { selector: 'edge.edge-gc-defines', style: {
      'line-color': '#a78bfa', 'target-arrow-color': '#a78bfa', 'target-arrow-shape': 'triangle',
      'curve-style': 'bezier', 'width': 1.5, 'arrow-scale': .6,
      'line-style': 'dashed', 'opacity': .4,
      'label': 'data(label)', 'font-size': 7, 'color': '#c4b5fd',
      'text-rotation': 'autorotate', 'text-margin-y': -8,
      'text-background-color': '#1a1a2e', 'text-background-opacity': .9,
      'text-background-padding': '2px', 'text-background-shape': 'round-rectangle',
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
      if (overlaps) edge.style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
    });
  } else {
    cy.edges().style({ 'curve-style': 'bezier', 'taxi-direction': null, 'taxi-turn': null });
  }
}

function runLayout() {
  var orient = getOrient();
  var elkEdgeRouting = getEdgeRouting() === 'taxi' ? 'ORTHOGONAL' : 'POLYLINE';
  var opts = {
    name: 'elk',
    elk: {
      algorithm: 'layered', 'elk.direction': elkDir(orient),
      'elk.layered.spacing.nodeNodeBetweenLayers': '120',
      'elk.layered.spacing.edgeNodeBetweenLayers': '60',
      'elk.spacing.nodeNode': '50',
      'elk.spacing.edgeEdge': '20',
      'elk.spacing.edgeNode': '30',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.edgeRouting': elkEdgeRouting,
    },
    nodeDimensionsIncludeLabels: true,
    animate: true,
    animationDuration: 400,
    stop: function() { updateEdgeStyles(orient); },
  };
  cy.layout(opts).run();
}
runLayout();

/* ── Orientation & routing ── */
document.querySelectorAll('input[name="orient"]').forEach(function(r) { r.addEventListener('change', runLayout); });
document.querySelectorAll('input[name="edge-routing"]').forEach(function(r) { r.addEventListener('change', runLayout); });

/* ── Edge toggles ── */
document.querySelectorAll('.edge-toggle').forEach(function(cb) {
  cb.addEventListener('change', function() {
    var cls = this.getAttribute('data-cls');
    cy.edges('.' + cls).style('display', this.checked ? 'element' : 'none');
  });
  if (!cb.checked) { var cls = cb.getAttribute('data-cls'); cy.edges('.' + cls).style('display', 'none'); }
});

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
  return seeds.union(edges).union(edges.connectedNodes());
}
function highlightSet(t) {
  if (t.isEdge()) return cy.collection().union(t).union(t.source()).union(t.target());
  var group = compoundGroup(t);
  return connSet(group);
}
function applyHighlight(s) { cy.elements().addClass('faded').removeClass('highlighted'); s.removeClass('faded').addClass('highlighted'); }
function clearHighlight() { cy.elements().removeClass('faded').removeClass('highlighted'); }

cy.on('tap', 'node, edge', function(e) {
  var t = e.target;
  // For passthrough pair, normalize: clicking embedded gc → treat as clicking dg parent
  var infoTarget = t;
  if (t.isNode() && t.data('nodeType') === 'gridCoreModule' && t.data('parent')) {
    var p = t.parent();
    if (p && p.nonempty()) infoTarget = p;
  }
  var checkId = infoTarget.id();
  if (selectedTarget && selectedTarget.id() === checkId) { selectedTarget = null; clearHighlight(); infoP.innerHTML = '<p style="color:#888">Click a node or edge to see details.</p>'; return; }
  selectedTarget = infoTarget;
  applyHighlight(highlightSet(t));
  showInfo(infoTarget);
});
cy.on('tap', function(e) {
  if (e.target === cy && selectedTarget) { selectedTarget = null; clearHighlight(); infoP.innerHTML = '<p style="color:#888">Click a node or edge to see details.</p>'; }
});

/* ── Buttons ── */
document.getElementById('btn-fit').addEventListener('click', function() { cy.fit(undefined, 30); });
document.getElementById('btn-reset').addEventListener('click', function() { clearHighlight(); runLayout(); });

/* ── Search ── */
var searchInput = document.getElementById('search');
searchInput.addEventListener('input', function() {
  var q = this.value.toLowerCase().trim();
  cy.nodes().removeClass('search-match');
  if (!q) return;
  cy.nodes().forEach(function(n) {
    var label = (n.data('label') || '').toLowerCase();
    var name = (n.data('moduleName') || '').toLowerCase();
    if (label.indexOf(q) >= 0 || name.indexOf(q) >= 0) n.addClass('search-match');
  });
});

/* ── Info Panel ── */
var infoP = document.getElementById('info-panel');

function tagFor(cat) {
  var map = { passthrough: 'c-pt', extended: 'c-ext', replaced: 'c-rep', 'new': 'c-new', 'grid-core': 'c-gc', 'gc-target': 'c-gc' };
  var cls = map[cat] || 'c-pt';
  return '<span class="tag ' + cls + '">' + cat.toUpperCase() + '</span>';
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
    h = '<h3>' + d.moduleName + ' ' + tagFor('grid-core') + '</h3>';
    h += '<p><span class="lbl">Source:</span> grid_core/' + d.sourceFile + '</p>';
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
    h = '<h3>' + d.targetName + ' ' + originTag + ' <span style="font-size:11px;color:#888">(' + d.targetType + ', ' + originLabel + ')</span></h3>';
    var pip = PIPELINES.find(function(p) { return p.targetName === d.targetName && p.targetType === d.targetType; });
    if (pip) {
      h += '<p><span class="lbl">Extended by ' + pip.steps.length + ' module(s):</span></p>';
      h += renderChain(pip, d.targetType === 'view' ? 'chain-view' : '');
    } else {
      h += '<p style="font-size:11px;color:#888;margin-top:4px">Not extended by any module.</p>';
    }

  } else if (t.isNode() && d.nodeType === 'module') {
    h = '<h3>#' + (d.registrationOrder + 1) + ' ' + d.moduleName + ' ' + tagFor(d.category) + '</h3>';
    h += '<p><span class="lbl">Source:</span> ' + d.sourceFile + '</p>';
    h += '<p><span class="lbl">Area:</span> ' + d.featureArea + '</p>';
    if (d.details) h += '<p><span class="lbl">Details:</span> ' + d.details + '</p>';
    if (d.gridCoreSource) h += '<p><span class="lbl">Grid Core Source:</span> ' + d.gridCoreSource + '</p>';

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
  infoP.innerHTML = h;
}
</script>
</body>
</html>`;
}
