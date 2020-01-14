const WHITE = 'white';
const GRAY = 'gray';
const BLACK = 'black';

const routines = {
    maxOfArray: function(arr, callback) {
        let m = 0; let callback_function = (v) => { return v; };
        if(callback) {
            callback_function = callback;
        }
        for(let i = 0; i < arr.length; i++) { if(callback_function(arr[i]) > m) m = callback_function(arr[i]); }
        return m;
    }
};

const getVertices = function(links) {
    const vert = [];

    links.forEach(link => {
        if(vert.indexOf(link[0]) === -1) {
            vert.push(link[0]);
        }

        if(vert.indexOf(link[1]) === -1) {
            vert.push(link[1]);
        }
    });

    return vert;
};

const getAdjacentVertices = function(links, vertex) {
    const avert = [];

    links.forEach(link => {
        if(link[0] === vertex && avert.indexOf(link[1]) === -1) {
            avert.push(link[1]);
        }
    });

    return avert;
};

const getReverseAdjacentVertices = function(links, vertex) {
    const avert = [];

    links.forEach(link => {
        if(link[1] === vertex && avert.indexOf(link[0]) === -1) {
            avert.push(link[0]);
        }
    });

    return avert;
};

const struct = {
    _hasCycle: false,
    _sortedList: [],

    hasCycle: function(links) {
        // detects if the graph has cycle
        // sorts the vertices (modifies the _sortedList variable)
        this._hasCycle = false;
        this._sortedList = [];
        const vertices = {}; const allVertices = getVertices(links);
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
        const averts = getAdjacentVertices(links, vertex);
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
        const sortedVertices = this._sortedList;
        sortedVertices.forEach(vertex => {
            const averts = getReverseAdjacentVertices(links, vertex.name); // neigbours who INCOME to the vertex
            if(averts.length === 0) {
                vertex.lp = 0; // 'lp' means 'Longest Path'
            } else {
                const maxLP = [];
                // get max through avertex.lp and add 1 to it
                averts.forEach(adjacentVertex => {
                    maxLP.push(sortedVertices.filter(sv => sv.name === adjacentVertex)[0].lp);
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
