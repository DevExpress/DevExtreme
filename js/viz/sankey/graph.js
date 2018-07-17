"use strict";

const WHITE = 'white';
const GRAY = 'gray';
const BLACK = 'black';

let inArray = require("../../core/utils/array").inArray;

let routines = {
    maxOfArray: function(arr, callback) {
        let m = 0, callback_function = (v) => { return v; };
        if(callback) {
            callback_function = callback;
        }
        for(let i = 0; i < arr.length; i++) { if(callback_function(arr[i]) > m) m = callback_function(arr[i]); }
        return m;
    }
};

let getVertices = function(links) {
    let vert = [];

    links.forEach(link => {
        if(inArray(link[0], vert) === -1) {
            vert.push(link[0]);
        }

        if(inArray(link[1], vert) === -1) {
            vert.push(link[1]);
        }
    });

    return vert;
};

let getAdjacentVertices = function(links, vertex) {
    let avert = [];

    links.forEach(link => {
        if(link[0] === vertex && inArray(link[1], avert) === -1) {
            avert.push(link[1]);
        }
    });

    return avert;
};

let getReverseAdjacentVertices = function(links, vertex) {
    let avert = [];

    links.forEach(link => {
        if(link[1] === vertex && inArray(link[0], avert) === -1) {
            avert.push(link[0]);
        }
    });

    return avert;
};

let struct = {
    _hasCycle: false,
    _sortedList: [],

    hasCycle: function(links) {
        // detects if the graph has cycle
        // sorts the vertices (modifies the _sortedList variable)
        this._hasCycle = false;
        this._sortedList = [];
        let vertices = {}, allVertices = getVertices(links);
        allVertices.forEach((vertex) => {
            vertices[vertex] = {
                color: WHITE
            };
        });
        allVertices.forEach((vertex) => {
            if(vertices[vertex].color === WHITE) {
                this._depthFirstSearch(links, vertices, vertex);
            }
        });
        this._sortedList.reverse();
        return this._hasCycle;
    },

    _depthFirstSearch: function(links, vertices, vertex) {
        vertices[vertex].color = GRAY;
        let averts = getAdjacentVertices(links, vertex);
        for(let a = 0; a < averts.length; a++) {
            if(vertices[averts[a]].color === WHITE) {
                this._depthFirstSearch(links, vertices, averts[a]);
            } else if(vertices[averts[a]].color === GRAY) {
                this._hasCycle = true;
            }
        }
        this._sortedList.push({
            name: vertex,
            lp: null,
            incoming: getReverseAdjacentVertices(links, vertex),
            outgoing: getAdjacentVertices(links, vertex)
        });
        vertices[vertex].color = BLACK;
    },

    computeLongestPaths(links) {
        // calculates longets paths for all vertices
        // method expects sorted vertices array to be in this._sortedList
        let sortedVertices = this._sortedList;
        sortedVertices.forEach(vertex => {
            let averts = getReverseAdjacentVertices(links, vertex.name); // neigbours who INCOME to the vertex
            if(averts.length === 0) {
                vertex.lp = 0; // 'lp' means 'Longest Path'
            } else {
                let maxLP = [];
                // get max through avertex.lp and add 1 to it
                averts.forEach(adjacentVertex => {
                    let sortedVertexIdx;
                    for(let i = 0; i < sortedVertices.length; i++) {
                        if(sortedVertices[i].name === adjacentVertex) {
                            sortedVertexIdx = i;
                        }
                    }
                    maxLP.push(sortedVertices[sortedVertexIdx].lp);
                });
                vertex.lp = routines.maxOfArray(maxLP) + 1;
            }
        });
        return this._sortedList;
    }
};

module.exports = {
    struct: struct,
    routines: routines,
    getVertices: getVertices,
    getAdjacentVertices: getAdjacentVertices,
    getReverseAdjacentVertices: getReverseAdjacentVertices
};
