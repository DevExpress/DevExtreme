/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const WHITE = 'white';
const GRAY = 'gray';
const BLACK = 'black';

const routines = {
  maxOfArray(arr, callback?) {
    let m = 0;
    let callback_function = (v) => v;
    if (callback) {
      callback_function = callback;
    }
    for (let i = 0; i < arr.length; i++) { if (callback_function(arr[i]) > m) m = callback_function(arr[i]); }
    return m;
  },
};

const getVertices = function (links) {
  const vert = [];

  links.forEach((link) => {
    // @ts-expect-error
    if (!vert.includes(link[0])) {
      // @ts-expect-error
      vert.push(link[0]);
    }
    // @ts-expect-error
    if (!vert.includes(link[1])) {
      // @ts-expect-error
      vert.push(link[1]);
    }
  });

  return vert;
};

const getAdjacentVertices = function (links, vertex) {
  const avert = [];

  links.forEach((link) => {
    // @ts-expect-error
    if (link[0] === vertex && !avert.includes(link[1])) {
      // @ts-expect-error
      avert.push(link[1]);
    }
  });

  return avert;
};

const getReverseAdjacentVertices = function (links, vertex) {
  const avert = [];

  links.forEach((link) => {
    // @ts-expect-error
    if (link[1] === vertex && !avert.includes(link[0])) {
      // @ts-expect-error
      avert.push(link[0]);
    }
  });

  return avert;
};

const struct = {
  _hasCycle: false,
  _sortedList: [],

  hasCycle(links) {
    // detects if the graph has cycle
    // sorts the vertices (modifies the _sortedList variable)
    this._hasCycle = false;
    this._sortedList = [];
    const vertices = {};
    const allVertices = getVertices(links);
    allVertices.forEach((vertex) => {
      // @ts-expect-error
      vertices[vertex] = {
        color: WHITE,
      };
    });
    allVertices.forEach((vertex) => {
      // @ts-expect-error
      if (vertices[vertex].color === WHITE) {
        this._depthFirstSearch(links, vertices, vertex);
      }
    });
    this._sortedList.reverse();
    return this._hasCycle;
  },

  _depthFirstSearch(links, vertices, vertex) {
    vertices[vertex].color = GRAY;
    const averts = getAdjacentVertices(links, vertex);
    for (let a = 0; a < averts.length; a++) {
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

  computeLongestPaths(links) {
    // calculates longets paths for all vertices
    // method expects sorted vertices array to be in this._sortedList
    const sortedVertices = this._sortedList;
    sortedVertices.forEach((vertex) => {
      const averts = getReverseAdjacentVertices(links, vertex.name); // neigbours who INCOME to the vertex
      if (averts.length === 0) {
        vertex.lp = 0; // 'lp' means 'Longest Path'
      } else {
        const maxLP = [];
        // get max through avertex.lp and add 1 to it
        averts.forEach((adjacentVertex) => {
          // @ts-expect-error
          maxLP.push(sortedVertices.filter((sv) => sv.name === adjacentVertex)[0].lp);
        });
        vertex.lp = routines.maxOfArray(maxLP) + 1;
      }
    });
    return this._sortedList;
  },
};

export default {
  struct,
  routines,
  getVertices,
  getAdjacentVertices,
  getReverseAdjacentVertices,
};
