/**
 * Shared CSS for html-templates.
 */
export const BASE_CSS = `
* {
  box-sizing: border-box; margin: 0; padding: 0
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; height: 100vh; background: #1a1a1a; color: #e8e8e8
}
#sidebar {
  width: 270px; min-width: 270px; background: #2a2a2a; border-right: 1px solid #555; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px
}
#sidebar h2 {
  font-size: 13px; color: #aaa; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px
}
#sidebar label {
  display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; padding: 1px 0; color: #e8e8e8
}
#sidebar input[type="checkbox"] {
  accent-color: #5B9BD5
}
#sidebar input[type="text"] {
  width: 100%; padding: 6px 10px; border: 1px solid #444; border-radius: 4px; font-size: 13px; background: #333; color: #e8e8e8; outline: none
}
#sidebar input[type="text"]:focus-visible {
  border-color: #777
}
#sidebar button {
  padding: 5px 10px; border: 1px solid #555; border-radius: 4px; background: #333; cursor: pointer; font-size: 12px; color: #e8e8e8
}
#sidebar button:hover {
  background: #444
}
.radio-group {
  display: flex; flex-direction: column; gap: 3px
}
.radio-group label {
  font-size: 11px
}
#main {
  flex: 1; display: flex; flex-direction: column
}
#cy {
  flex: 1; background: #212121
}
#info-panel {
  height: 180px; min-height: 80px; background: #2a2a2a; border-top: 1px solid #555; padding: 12px 16px; overflow-y: auto; font-size: 12px; line-height: 1.5; color: #e8e8e8
}
#info-panel h3 {
  font-size: 13px; margin-bottom: 4px
}
#info-panel .lbl {
  color: #aaa; font-weight: 500
}
.tag {
  display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin: 1px 2px
}
#legend {
  padding: 8px; font-size: 12px; border-top: 1px solid #555
}
.leg-item {
  display: flex; align-items: center; gap: 6px; margin: 2px 0
}
.leg-sw {
  width: 18px; height: 12px; border-radius: 2px; flex-shrink: 0
}
.leg-ln {
  width: 24px; height: 0; flex-shrink: 0
}
.select-all-row {
  border-bottom: 1px solid #444; padding-bottom: 3px; margin-bottom: 2px
}
`;

/**
 * Cytoscape styles for highlight/faded/search states.
 */
export const HIGHLIGHT_CYTOSCAPE_STYLES = `
    { selector: '.highlighted',
      style: { 'opacity': 1, 'z-index': 999 }
    },
    { selector: 'edge.highlighted',
      style: { 'opacity': 1, 'z-index': 999, 'width': 3 }
    },
    { selector: '.faded',
      style: { 'opacity': 0.08 }
    },
    { selector: 'node.search-match',
      style: { 'border-width': 3, 'border-color': '#FF6B6B' }
    },`;

/**
 * Cytoscape styles for gc-target nodes (controllers & views).
 */
export const GC_TARGET_CYTOSCAPE_STYLES = `
    { selector: 'node.gc-target',
      style: {
        'background-color': '#1e1e3a',
        'background-opacity': 0.6,
        'border-width': 2,
        'border-style': 'dashed',
        'border-color': '#c084fc',
        'color': '#d8b4fe',
        'font-size': 9,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'padding': '12px',
        'label': 'data(label)',
      }
    },
    { selector: 'node.gc-target-controller',
      style: {
        'border-color': '#7dd3fc',
        'color': '#bae6fd',
        'shape': 'hexagon',
      }
    },
    { selector: 'node.gc-target-view',
      style: {
        'border-color': '#c084fc',
        'color': '#d8b4fe',
        'shape': 'ellipse',
      }
    },`;

/**
 * Base Cytoscape styles for extender edges (controller & view).
 */
export const EXTENDER_EDGE_BASE_STYLES = `
    { selector: 'edge.edge-ext-ctrl',
      style: {
        'line-color': '#0ea5e9',
        'target-arrow-color': '#0ea5e9',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'width': 2,
        'arrow-scale': 0.8,
      }
    },
    { selector: 'edge.edge-ext-view',
      style: {
        'line-color': '#a855f7',
        'target-arrow-color': '#a855f7',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'width': 2,
        'arrow-scale': 0.8,
      }
    },`;

/**
 * Shared interactive JavaScript helpers for diagram templates.
 * Contains: highlight/clear, edge toggle wiring, search, click handlers,
 * fit button, getEdgeRouting(), and overlap-detection for taxi routing.
 *
 * NOT included (template-specific): reset button, feature area/category toggles.
 *
 * Templates must define before interpolating:
 *   - `cy` — the cytoscape instance
 *   - `computeHighlightSet(target)` — returns the collection to highlight for a given target
 *   - `showInfo(target)` — renders info panel content for a given target
 *   - `selectedTarget` — mutable state variable (will be set/cleared by this code)
 *   - `updateEdgeStyles()` — applies current edge routing to all edges
 *
 * Optional hooks:
 *   - `normalizeClickTarget(target)` — transform click target before
 *     info/selection (e.g. gc child → dg parent)
 */
export const SHARED_INTERACTIVE_JS = `
/* ── Shared: Highlight helpers ── */
function applyHighlight(s) {
  cy.elements().addClass('faded').removeClass('highlighted');
  s.removeClass('faded').addClass('highlighted');
}
function clearHighlight() {
  cy.elements().removeClass('faded').removeClass('highlighted');
}

/* ── Shared: Edge routing helper ── */
function getEdgeRouting() {
  var c = document.querySelector('input[name="edge-routing"]:checked');
  return c ? c.value : 'bezier';
}

function hasOverlappingBounds(edge) {
  var sb = edge.source().boundingBox();
  var tb = edge.target().boundingBox();
  return !(sb.x2 < tb.x1 || tb.x2 < sb.x1 || sb.y2 < tb.y1 || tb.y2 < sb.y1);
}

/* ── Shared: Edge type toggles ── */
document.querySelectorAll('.edge-toggle').forEach(function(cb) {
  cb.addEventListener('change', function() {
    var cls = this.getAttribute('data-cls');
    cy.edges('.' + cls).style('display', this.checked ? 'element' : 'none');
  });
  if (!cb.checked) {
    var cls = cb.getAttribute('data-cls');
    cy.edges('.' + cls).style('display', 'none');
  }
});

/* ── Shared: Search ── */
document.getElementById('search').addEventListener('input', function() {
  var q = this.value.toLowerCase().trim();
  cy.nodes().removeClass('search-match');
  if (!q) return;
  cy.nodes().forEach(function(n) {
    var label = (n.data('label') || '').toLowerCase();
    var name = (n.data('moduleName') || n.data('id') || '').toLowerCase();
    if (label.indexOf(q) >= 0 || name.indexOf(q) >= 0) n.addClass('search-match');
  });
});

/* ── Shared: Click-to-select / deselect ── */
var infoPanel = document.getElementById('info-panel');
var defaultInfoHtml = '<p style="color:#888;">Click a node or edge to see details.</p>';

cy.on('tap', 'node, edge', function(e) {
  var t = e.target;
  var infoTarget = typeof normalizeClickTarget === 'function' ? normalizeClickTarget(t) : t;
  var checkId = infoTarget.id();
  if (selectedTarget && selectedTarget.id() === checkId) {
    selectedTarget = null;
    clearHighlight();
    infoPanel.innerHTML = defaultInfoHtml;
    return;
  }
  selectedTarget = infoTarget;
  applyHighlight(computeHighlightSet(t));
  showInfo(infoTarget);
});
cy.on('tap', function(e) {
  if (e.target === cy && selectedTarget) {
    selectedTarget = null;
    clearHighlight();
    infoPanel.innerHTML = defaultInfoHtml;
  }
});

/* ── Shared: Fit button ── */
document.getElementById('btn-fit').addEventListener('click', function() { cy.fit(undefined, 30); });

/* ── Shared: Edge routing radio ── */
document.querySelectorAll('input[name="edge-routing"]').forEach(function(r) {
  r.addEventListener('change', function() { updateEdgeStyles(); });
});
`;
