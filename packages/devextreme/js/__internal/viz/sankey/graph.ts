/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { SankeyDataItem } from '@ts/viz/sankey/sankey';

export interface GraphVertex {
  name: string;
  lp: number | null;
  incoming: string[];
  outgoing: string[];
}

export type RankedVertex = GraphVertex & { lp: number };

type VertexColors = Record<string, { color: string }>;

interface GraphStruct {
  _hasCycle: boolean;
  _sortedList: GraphVertex[];
  hasCycle: (links: SankeyDataItem[]) => boolean;
  _depthFirstSearch: (links: SankeyDataItem[], vertices: VertexColors, vertex: string) => void;
  computeLongestPaths: (links: SankeyDataItem[]) => RankedVertex[];
}

const WHITE = 'white';
const GRAY = 'gray';
const BLACK = 'black';

const routines = {
  maxOfArray(arr: ThemeValue[], callback?: (value: ThemeValue) => number): number {
    let m = 0;
    let callback_function = (v: ThemeValue): ThemeValue => v;
    if (callback) {
      callback_function = callback;
    }
    for (let i = 0; i < arr.length; i += 1) {
      if (callback_function(arr[i]) > m) m = callback_function(arr[i]);
    }
    return m;
  },
};

const getVertices = function (links: SankeyDataItem[]): string[] {
  const vert: string[] = [];

  links.forEach((link) => {
    if (!vert.includes(link[0])) {
      vert.push(link[0]);
    }
    if (!vert.includes(link[1])) {
      vert.push(link[1]);
    }
  });

  return vert;
};

const getAdjacentVertices = function (links: SankeyDataItem[], vertex: string): string[] {
  const avert: string[] = [];

  links.forEach((link) => {
    if (link[0] === vertex && !avert.includes(link[1])) {
      avert.push(link[1]);
    }
  });

  return avert;
};

const getReverseAdjacentVertices = function (links: SankeyDataItem[], vertex: string): string[] {
  const avert: string[] = [];

  links.forEach((link) => {
    if (link[1] === vertex && !avert.includes(link[0])) {
      avert.push(link[0]);
    }
  });

  return avert;
};

const struct: GraphStruct = {
  _hasCycle: false,
  _sortedList: [],

  hasCycle(this: GraphStruct, links: SankeyDataItem[]): boolean {
    // detects if the graph has cycle
    // sorts the vertices (modifies the _sortedList variable)
    this._hasCycle = false;
    this._sortedList = [];
    const vertices: VertexColors = {};
    const allVertices = getVertices(links);
    allVertices.forEach((vertex) => {
      vertices[vertex] = {
        color: WHITE,
      };
    });
    allVertices.forEach((vertex) => {
      if (vertices[vertex].color === WHITE) {
        this._depthFirstSearch(links, vertices, vertex);
      }
    });
    this._sortedList.reverse();
    return this._hasCycle;
  },

  _depthFirstSearch(
    this: GraphStruct,
    links: SankeyDataItem[],
    vertices: VertexColors,
    vertex: string,
  ): void {
    vertices[vertex].color = GRAY;
    const averts = getAdjacentVertices(links, vertex);
    for (let a = 0; a < averts.length; a += 1) {
      if (vertices[averts[a]].color === WHITE) {
        this._depthFirstSearch(links, vertices, averts[a]);
      } else if (vertices[averts[a]].color === GRAY) {
        this._hasCycle = true;
      }
    }
    this._sortedList.push({
      name: vertex,
      lp: null,
      incoming: getReverseAdjacentVertices(links, vertex),
      outgoing: getAdjacentVertices(links, vertex),
    });
    vertices[vertex].color = BLACK;
  },

  computeLongestPaths(this: GraphStruct, links: SankeyDataItem[]): RankedVertex[] {
    // calculates longets paths for all vertices
    // method expects sorted vertices array to be in this._sortedList
    const sortedVertices = this._sortedList;
    sortedVertices.forEach((vertex) => {
      const averts = getReverseAdjacentVertices(
        links,
        vertex.name,
      ); // neigbours who INCOME to the vertex
      if (averts.length === 0) {
        vertex.lp = 0; // 'lp' means 'Longest Path'
      } else {
        const maxLP: (number | null)[] = [];
        // get max through avertex.lp and add 1 to it
        averts.forEach((adjacentVertex) => {
          maxLP.push(sortedVertices.filter((sv) => sv.name === adjacentVertex)[0].lp);
        });
        vertex.lp = routines.maxOfArray(maxLP) + 1;
      }
    });
    return this._sortedList as RankedVertex[];
  },
};

export default {
  struct,
  routines,
  getVertices,
  getAdjacentVertices,
  getReverseAdjacentVertices,
};
