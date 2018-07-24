"use strict";

var logicModule = require("viz/sankey/graph"),
    common = require("./commonParts/common.js"),
    environment = common.environment;

const noCycle0 = [['A', 'B', 2], ['B', 'C', 2], ['C', 'D', 2], ['D', 'F', 2]];
const noCycle1 = [['A', 'B', 2], ['B', 'C1', 2], ['B', 'C2', 2], ['C1', 'D', 2], ['C2', 'D', 2], ['D', 'F', 2]];
const noCycle2 = [['A', 'X', 2], ['A', 'Y', 1], ['A', 'Z', 3], ['B', 'X', 5], ['B', 'Z', 2], ['C', 'Z', 1], ['C', 'N', 1], ['C', 'M', 1], ['B', 'M', 2], ['M', 'X', 2], ['M', 'Y', 2], ['N', 'X', 4], ['N', 'Y', 3]];
const noCycle3 = [['A', 'B', 2], ['A', 'C', 1], ['A', 'D', 3], ['A', 'E', 5], ['B', 'D', 2], ['C', 'D', 1], ['C', 'E', 1], ['D', 'E', 1]];

const cycle1 = [['A', 'B', 2], ['B', 'C', 2], ['C', 'A', 2]];
const cycle2 = [['A', 'B', 2], ['B', 'C1', 2], ['B', 'C2', 2], ['C1', 'D', 2], ['C2', 'D', 2], ['D', 'A', 2]];
const cycle3 = [['A', 'B', 2], ['B', 'C1', 2], ['C1', 'D', 2], ['C1', 'A', 2], ['D', 'F', 2]];
const cycle4 = [['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'E', 1], ['E', 'F', 1], ['C', 'C1', 1], ['C1', 'C2', 1], ['C2', 'B', 1]];
const cycle5 = [['A', 'X', 1], ['A', 'Y', 1], ['A', 'M', 1], ['A', 'N', 1], ['N', 'X', 1], ['M', 'X', 1], ['N', 'Y', 1], ['M', 'Y', 1], ['N', 'A', 1]];

QUnit.module("Graph utils", environment);

QUnit.test("Vertices extracting from links", function(assert) {
    let links = [['A', 'B', 2], ['B', 'C', 2]];
    let vertices = logicModule.getVertices(links);
    assert.deepEqual(['A', 'B', 'C'], vertices);

    links = [['A', 'B', 2]];
    vertices = logicModule.getVertices(links);
    assert.deepEqual(['A', 'B'], vertices);

    links = [['A', 'B', 2], ['B', 'C', 2], ['C', 'A', 2]];
    vertices = logicModule.getVertices(links);
    assert.deepEqual(['A', 'B', 'C'], vertices);

    links = [['A', 'B', 2], ['B', 'C', 2], ['C', 'D', 2]];
    vertices = logicModule.getVertices(links);
    assert.deepEqual(['A', 'B', 'C', 'D'], vertices);

    links = [['A', 'B', 2], ['B', 'A', 2]];
    vertices = logicModule.getVertices(links);
    assert.deepEqual(['A', 'B'], vertices);
});


QUnit.test("Adjacent vertices extracting from links", function(assert) {
    let links = [['A', 'B', 2], ['B', 'C', 2], ['C', 'D', 2]],
        vertices = logicModule.getAdjacentVertices(links, 'A');

    assert.deepEqual(['B'], vertices);

    links = [['A', 'B', 2], ['B', 'C', 2], ['C', 'D', 2]];
    vertices = logicModule.getAdjacentVertices(links, 'B');
    assert.deepEqual(['C'], vertices);

    links = [['A', 'B', 2], ['A', 'C', 2], ['A', 'D', 2]];
    vertices = logicModule.getAdjacentVertices(links, 'A');
    assert.deepEqual(['B', 'C', 'D'], vertices);

    vertices = logicModule.getAdjacentVertices([['A', 'X', 1], ['A', 'Y', 1], ['A', 'M', 1], ['A', 'N', 1], ['N', 'X', 1], ['M', 'X', 1], ['N', 'Y', 1], ['M', 'Y', 1], ['N', 'A', 1]], 'N');
    assert.deepEqual(['X', 'Y', 'A'], vertices);
});

QUnit.test("Reverse adjacent vertices extracting from links", function(assert) {
    let links = [['A', 'B', 2], ['B', 'C', 2], ['C', 'D', 2]],
        vertices = logicModule.getReverseAdjacentVertices(links, 'A');

    assert.deepEqual([], vertices);

    links = [['A', 'B', 2], ['B', 'C', 2], ['C', 'D', 2]];
    vertices = logicModule.getReverseAdjacentVertices(links, 'B');
    assert.deepEqual(['A'], vertices);

    links = [['A', 'Z', 2], ['B', 'Z', 2], ['C', 'Z', 2]];
    vertices = logicModule.getReverseAdjacentVertices(links, 'Z');
    assert.deepEqual(['A', 'B', 'C'], vertices);

    vertices = logicModule.getReverseAdjacentVertices([['A', 'X', 1], ['A', 'Y', 1], ['A', 'M', 1], ['A', 'N', 1], ['N', 'X', 1], ['M', 'X', 1], ['N', 'Y', 1], ['M', 'Y', 1], ['N', 'A', 1]], 'N');
    assert.deepEqual(['A'], vertices);
});

QUnit.test("Cycle detection", function(assert) {
    assert.equal(logicModule.struct.hasCycle(noCycle1), false);
    assert.equal(logicModule.struct.hasCycle(noCycle2), false);
    assert.equal(logicModule.struct.hasCycle(noCycle3), false);

    assert.equal(logicModule.struct.hasCycle(cycle1), true);
    assert.equal(logicModule.struct.hasCycle(cycle2), true);
    assert.equal(logicModule.struct.hasCycle(cycle3), true);
    assert.equal(logicModule.struct.hasCycle(cycle4), true);
    assert.equal(logicModule.struct.hasCycle(cycle5), true);
});

QUnit.test("maxOfArray, no callback", function(assert) {
    assert.equal(logicModule.routines.maxOfArray([5, 7, 1, 9, 8, 2, 3]), 9);
    assert.equal(logicModule.routines.maxOfArray([5]), 5);
});

QUnit.test("maxOfArray, callback", function(assert) {
    assert.deepEqual(logicModule.routines.maxOfArray(
        [{ val: 5 }, { val: 7 }, { val: 1 }, { val: 9 }, { val: 8 }, { val: 2 }, { val: 3 }],
        function(item) { return item.val; }),
        9
    );
});

QUnit.test("Toposort and computing longest paths in graph", function(assert) {
    let vertices, expected;

    logicModule.struct.hasCycle(noCycle0);
    vertices = logicModule.struct.computeLongestPaths(noCycle0);
    expected = { A: 0, B: 1, C: 2, D: 3, F: 4 };
    assert.deepEqual(vertices.length, 5);
    vertices.forEach(function(vertex) { assert.equal(vertex.lp, expected[vertex.name]); });

    logicModule.struct.hasCycle(noCycle1);
    vertices = logicModule.struct.computeLongestPaths(noCycle1);
    expected = { A: 0, B: 1, C1: 2, C2: 2, D: 3, F: 4 };
    assert.deepEqual(vertices.length, 6);
    vertices.forEach(function(vertex) { assert.equal(vertex.lp, expected[vertex.name]); });

    logicModule.struct.hasCycle(noCycle2);
    vertices = logicModule.struct.computeLongestPaths(noCycle2);
    expected = { A: 0, B: 0, C: 0, M: 1, N: 1, X: 2, Y: 2, Z: 1 };
    assert.deepEqual(vertices.length, 8);
    vertices.forEach(function(vertex) { assert.equal(vertex.lp, expected[vertex.name]); });
});
