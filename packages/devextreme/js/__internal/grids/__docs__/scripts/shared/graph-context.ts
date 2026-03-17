/* eslint-disable spellcheck/spell-checker */
/**
 * Shared types used by both grid_core and data_grid graph builders.
 */

export interface CytoscapeElement {
  group: 'nodes' | 'edges';
  data: Record<string, unknown>;
  classes?: string;
}

/**
 * Provides shared addNode/addEdge helpers backed by common state (elements, nodeIds, edgeIds).
 * Each graph-builder creates its own context and can extend edge creation via `buildEdgeId`.
 */
export interface GraphContext {
  elements: CytoscapeElement[];
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  addNode: (id: string, nodeData: Record<string, unknown>, classes: string) => void;
}

export interface GraphContextOptions {
  /**
   * If true, track each node's parent in a Map for compound-graph queries.
   * The Map is returned in the context as `nodeParent`.
   */
  trackParent?: boolean;
}

export interface GraphContextWithParent extends GraphContext {
  nodeParent: Map<string, string>;
}

export function createGraphContext(opts?: GraphContextOptions): GraphContextWithParent {
  const elements: CytoscapeElement[] = [];
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  const nodeParent = new Map<string, string>();
  const trackParent = opts?.trackParent ?? false;

  function addNode(id: string, nodeData: Record<string, unknown>, classes: string): void {
    if (nodeIds.has(id)) {
      return;
    }
    nodeIds.add(id);
    if (trackParent && nodeData.parent) {
      nodeParent.set(id, nodeData.parent as string);
    }
    elements.push({ group: 'nodes', data: { id, ...nodeData }, classes });
  }

  return {
    elements, nodeIds, edgeIds, nodeParent, addNode,
  };
}
