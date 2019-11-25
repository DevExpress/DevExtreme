var utils = require("viz/core/utils");

QUnit.module("decreaseGaps", {
    beforeEach: function() {
        this.decreaseGaps = utils.decreaseGaps;
    }
});

QUnit.test("decrease one value", function(assert) {
    var margin = { top: 10 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top"], 7);

    assert.equal(margin.top, 3);
    assert.equal(decrease, 0);
});

QUnit.test("decrease two value", function(assert) {
    var margin = { top: 10, bottom: 10 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top", "bottom"], 8);

    assert.equal(margin.top, 6);
    assert.equal(margin.bottom, 6);
    assert.equal(decrease, 0);
});

QUnit.test("One value zero", function(assert) {
    var margin = { top: 10, bottom: 0 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top", "bottom"], 2);

    assert.equal(margin.top, 8);
    assert.equal(margin.bottom, 0);
    assert.equal(decrease, 0);
});

QUnit.test("One value less decrease value", function(assert) {
    var margin = { top: 10, bottom: 1 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top", "bottom"], 3);

    assert.equal(margin.top, 8);
    assert.equal(margin.bottom, 0);
    assert.equal(decrease, 0);
});

QUnit.test("Sum margin less decrease", function(assert) {
    var margin = { top: 5, bottom: 12 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top", "bottom"], 30);

    assert.equal(margin.top, 0);
    assert.equal(margin.bottom, 0);
    assert.equal(decrease, 13);
});

QUnit.test("three value", function(assert) {
    var margin = { top: 5, bottom: 12, left: 30 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top", "bottom", "left"], 30);

    assert.equal(margin.top, 0);
    assert.equal(margin.bottom, 0);
    assert.equal(margin.left, 17);
    assert.equal(decrease, 0);
});

QUnit.test("value round", function(assert) {
    var margin = { top: 10, bottom: 10 },
        decrease;

    decrease = this.decreaseGaps(margin, ["top", "bottom"], 5);

    assert.equal(margin.top, 7);
    assert.equal(margin.bottom, 7);
    assert.equal(decrease, -1);
});

QUnit.module('Other');

QUnit.test('parseScalar', function(assert) {
    assert.strictEqual(utils.parseScalar(undefined, 0), 0);
    assert.strictEqual(utils.parseScalar(undefined, true), true);
    assert.strictEqual(utils.parseScalar(null, true), null);
    assert.strictEqual(utils.parseScalar(1, 'a'), 1);
});

QUnit.test('enumParser', function(assert) {
    var parser = utils.enumParser(['one', 'Two', 'THREE']);
    assert.strictEqual(parser('ONE', 'four'), 'one', 'ONE');
    assert.strictEqual(parser('ONE1', 'four'), 'four', 'ONE1');
    assert.strictEqual(parser('thREE', 'four'), 'three', 'thREE');
});

QUnit.test("convertPolarToXY", function(assert) {
    assert.deepEqual(utils.convertPolarToXY({ x: 0, y: 0 }, 0, 10, 20), { x: 3, y: -20 });
    assert.deepEqual(utils.convertPolarToXY({ x: 10, y: 20 }, 20, 10, 20), { x: 20, y: 3 });
    assert.deepEqual(utils.convertPolarToXY({ x: 0, y: 0 }, 40, 100, 250), { x: 161, y: 192 });
    assert.deepEqual(utils.convertPolarToXY({ x: 10, y: 20 }, 90, 100, 250), { x: -33, y: 266 });
});

QUnit.test("convertXYToPolar", function(assert) {
    assert.deepEqual(utils.convertXYToPolar({ x: 0, y: 0 }, 10, 20), { phi: 63, r: 22 });
    assert.deepEqual(utils.convertXYToPolar({ x: 10, y: 20 }, 10, 20), { phi: 0, r: 0 });
    assert.deepEqual(utils.convertXYToPolar({ x: 0, y: 0 }, 100, 200), { phi: 63, r: 224 });
    assert.deepEqual(utils.convertXYToPolar({ x: 10, y: 20 }, 100, 200), { phi: 63, r: 201 });
});

QUnit.test('map', function(assert) {
    function test(array, callback, expected, messages) {
        assert.deepEqual(utils.map(array, callback), expected, messages);
    }

    test([], function(el, i) { return el * i + 2; }, [], 'empty array');
    test([1, 2, 3], function(el, i) { return el * i + 2; }, [2, 4, 8], 'non-empty array');
    test([1, 2, 3, 4, 5, 6], function(el) { return el % 2 ? el : null; }, [1, 3, 5], 'callback w/ null');
    test([1, 2, 3, 4, 5, 6], function(el) { return el % 2 ? el : undefined; }, [1, undefined, 3, undefined, 5, undefined], 'callback w/ undefined');
});

QUnit.test('unique', function(assert) {
    assert.deepEqual(utils.unique([1, 2, 3, 4, 5, 5, 6, 7, 6, 2, 8, 9, 1, 3, 1]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

QUnit.module("Patch font options");

QUnit.test("Param is empty/undefined", function(assert) {
    assert.deepEqual(utils.patchFontOptions(), {});
    assert.deepEqual(utils.patchFontOptions({}), {});
});

QUnit.test("Check options are processed", function(assert) {
    var options = { font: { size: 14, family: 'FontFamily', weight: 300, color: 'red' } };

    var fontOptions = utils.patchFontOptions(options.font);

    assert.deepEqual(options.font, { size: 14, family: 'FontFamily', weight: 300, color: 'red' });

    assert.deepEqual(fontOptions, {
        'font-size': 14,
        'font-family': 'FontFamily',
        'font-weight': 300,
        fill: 'red'
    });
});

QUnit.test("Check exceptions", function(assert) {
    var options = { font: { color: '#767676', cursor: 'default', opacity: 0.3, size: 14 } };

    var fontOptions = utils.patchFontOptions(options.font);

    assert.deepEqual(options.font, { color: '#767676', cursor: 'default', opacity: 0.3, size: 14 });

    assert.deepEqual(fontOptions, {
        'font-size': 14,
        fill: 'rgba(118,118,118,0.3)',
        cursor: 'default',
        opacity: null
    });
});

QUnit.module('utils graphic', {
    beforeEach: function() {
        this.categories = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
    },

    afterEach: function() {
        this.categories = null;
    },

    getMockRenderer: function(elem) {
        return {
            root: {
                element: elem
            }
        };
    }
});

QUnit.test('getCategoriesInfo. Empty categories', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo([]);

    // assert
    assert.deepEqual(info, {
        categories: []
    });
});

QUnit.test('getCategoriesInfo (no inverted)', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo(this.categories, 'a3', 'a5');

    // assert
    assert.deepEqual(info, {
        start: 'a3',
        end: 'a5',
        inverted: false,
        categories: ['a3', 'a4', 'a5']
    });
});

QUnit.test('getCategoriesInfo (inverted)', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo(this.categories, 'a5', 'a3');

    // assert
    assert.deepEqual(info, {
        start: 'a5',
        end: 'a3',
        inverted: true,
        categories: ['a3', 'a4', 'a5']
    });
});

QUnit.test('getCategoriesInfo. start categories is not set', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo(this.categories, undefined, 'a3');

    // assert
    assert.deepEqual(info, {
        categories: ['a1', 'a2', 'a3'],
        end: 'a3',
        start: 'a1',
        inverted: false
    });
});

QUnit.test('getCategoriesInfo. end categories is not set', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo(this.categories, 'a3', undefined);

    // assert
    assert.deepEqual(info, {
        categories: ['a3', 'a4', 'a5', 'a6', 'a7'],
        start: 'a3',
        end: 'a7',
        inverted: false
    });
});

QUnit.test('getCategoriesInfo. categories is not contains start categories', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo(this.categories, 'someCategories', 'a3');

    // assert
    assert.deepEqual(info, {
        categories: ['a1', 'a2', 'a3'],
        end: 'a3',
        start: 'a1',
        inverted: false
    });
});

QUnit.test('getCategoriesInfo. categories is not contains end categories', function(assert) {
    // arrange,act
    var info = utils.getCategoriesInfo(this.categories, 'a5', 'someCategories');

    // assert
    assert.deepEqual(info, {
        categories: ['a5', 'a6', 'a7'],
        end: 'a7',
        start: 'a5',
        inverted: false
    });
});

QUnit.module("Layout canvas utils", {
    beforeEach: function() {
        this.canvas = {
            width: 1000,
            height: 400,
            top: 10,
            bottom: 20,
            left: 30,
            right: 40
        };
    }
});

QUnit.test('Normalize pane weight', function(assert) {
    var defSingle = [{ name: "default" }];
    utils.normalizePanesHeight(defSingle);

    assert.deepEqual(defSingle, [{
        name: "default",
        height: 1,
        unit: 0
    }], "Default for single pane");

    var defFew = [{ name: "default1" }, { name: "default2" }];
    utils.normalizePanesHeight(defFew);

    assert.deepEqual(defFew, [{
        name: "default1",
        height: 0.5,
        unit: 0
    }, {
        name: "default2",
        height: 0.5,
        unit: 0
    }], "Default for a few panes");

    var simpleMultiPane = [{ name: "pane1", height: 0.6 }, { name: "pane2" }, { name: "pane3" }];
    utils.normalizePanesHeight(simpleMultiPane);

    assert.deepEqual(simpleMultiPane, [{
        name: "pane1",
        height: 0.6,
        unit: 0
    }, {
        name: "pane2",
        height: 0.2,
        unit: 0
    }, {
        name: "pane3",
        height: 0.2,
        unit: 0
    }], "Simple multipane (with unknown weight)");

    var incorrectMultiPane = [{ name: "pane1", height: "abc" }, { name: "pane2", height: -150 }];
    utils.normalizePanesHeight(incorrectMultiPane);

    assert.deepEqual(incorrectMultiPane, [{
        name: "pane1",
        height: 0.5,
        unit: 0
    }, {
        name: "pane2",
        height: 0.5,
        unit: 0
    }], "Simple multipane (with incorrect weight/height)");

    var underWeightMultiPane = [{ name: "pane1", height: 0.2 }, { name: "pane2", height: 0.3 }];
    utils.normalizePanesHeight(underWeightMultiPane);

    assert.deepEqual(underWeightMultiPane, [{
        name: "pane1",
        height: 0.4,
        unit: 0
    }, {
        name: "pane2",
        height: 0.6,
        unit: 0
    }], "Underweight of pane height");

    var overWeightMultiPane = [{ name: "pane1", height: 0.4 }, { name: "pane2", height: 0.4 }, { name: "pane3" }, { name: "pane4", height: 0.4 }];
    utils.normalizePanesHeight(overWeightMultiPane);

    assert.deepEqual(overWeightMultiPane, [{
        name: "pane1",
        height: 0.25,
        unit: 0
    }, {
        name: "pane2",
        height: 0.25,
        unit: 0
    }, {
        name: "pane3",
        height: 0.25,
        unit: 0
    }, {
        name: "pane4",
        height: 0.25,
        unit: 0
    }], "Overweight of pane height (with unknown weight)");
});

QUnit.test('Normalize pane weight (percentages)', function(assert) {
    var simple = [{ name: "perc", height: "60%" }, { name: "pane" }];
    utils.normalizePanesHeight(simple);

    assert.deepEqual(simple, [{
        name: "perc",
        height: 0.6,
        unit: 0
    }, {
        name: "pane",
        height: 0.4,
        unit: 0
    }], "Simple example");

    var overWeight = [{ name: "perc", height: "60%" }, { name: "over", height: "140%" }];
    utils.normalizePanesHeight(overWeight);

    assert.deepEqual(overWeight, [{
        name: "perc",
        height: 0.3,
        unit: 0
    }, {
        name: "over",
        height: 0.7,
        unit: 0
    }], "Overweight of pane height");
});

QUnit.test('Normalize pane height (pixels)', function(assert) {
    var panes = [{ name: "pane1", height: 300 }, { name: "pane2", height: "400px" }];
    utils.normalizePanesHeight(panes);

    assert.deepEqual(panes, [{
        name: "pane1",
        height: 300,
        unit: 1
    }, {
        name: "pane2",
        height: 400,
        unit: 1
    }]);
});

QUnit.test("setCanvasValues", function(assert) {
    var canvas = { top: 11, bottom: 22, left: 33, right: 44 };

    utils.setCanvasValues(canvas);

    assert.equal(canvas.top, 11);
    assert.equal(canvas.bottom, 22);
    assert.equal(canvas.left, 33);
    assert.equal(canvas.right, 44);
    assert.equal(canvas.originalTop, 11);
    assert.equal(canvas.originalBottom, 22);
    assert.equal(canvas.originalLeft, 33);
    assert.equal(canvas.originalRight, 44);
});

QUnit.test('Single pane - main case (no specific options provided)', function(assert) {
    var pane = { name: 'default' };

    utils.setCanvasValues(this.canvas);
    utils.normalizePanesHeight([pane]);
    utils.updatePanesCanvases([pane], this.canvas);

    assert.ok(pane.canvas, 'Canvas added to pane');
    assert.notEqual(this.canvas, pane.canvas, 'Pane canvas should not reference the main object in memory');

    assert.strictEqual(this.canvas.left, 30, 'No change of main canvas on left margin');
    assert.strictEqual(this.canvas.right, 40, 'No change of main canvas  on right margin');
    assert.strictEqual(this.canvas.top, 10, 'No change of main canvas on top margin');
    assert.strictEqual(this.canvas.bottom, 20, 'No change of main canvas on bottom margin');


    assert.strictEqual(pane.canvas.left, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(pane.canvas.right, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(pane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(pane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

    assert.strictEqual(pane.canvas.originalLeft, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(pane.canvas.originalRight, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(pane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(pane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');
});

QUnit.test('Two equal panes - vertical alignment', function(assert) {
    var topPane = {
            name: 'topPane'
        },
        bottomPane = {
            name: 'bottomPane'
        },
        chartCanvasHeight = this.canvas.height - this.canvas.top - this.canvas.bottom,
        panePadding = 10,
        expectedPaneHeight = (chartCanvasHeight - panePadding) / 2;

    utils.setCanvasValues(this.canvas);
    utils.normalizePanesHeight([topPane, bottomPane]);
    utils.updatePanesCanvases([topPane, bottomPane], this.canvas);


    assert.ok(topPane.canvas, 'Canvas added to pane');
    assert.notEqual(this.canvas, topPane.canvas, 'Pane canvas should not reference the main object in memory');

    assert.ok(bottomPane.canvas, 'Canvas added to pane');
    assert.notEqual(this.canvas, bottomPane.canvas, 'Pane canvas should not reference the main object in memory');

    // top pane - height 180, margin top - 10, margin bottom - 210
    assert.strictEqual(topPane.canvas.left, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.right, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.bottom, this.canvas.bottom + expectedPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(topPane.canvas.originalLeft, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.originalRight, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.originalBottom, this.canvas.bottom + expectedPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    // bottom pane - height 180, margin top - 200, margin bottom - 20
    assert.strictEqual(bottomPane.canvas.left, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(bottomPane.canvas.right, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(bottomPane.canvas.top, this.canvas.top + expectedPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

    assert.strictEqual(bottomPane.canvas.originalLeft, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(bottomPane.canvas.originalRight, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(bottomPane.canvas.originalTop, this.canvas.top + expectedPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');
});

QUnit.test('Two not equal panes - vertical alignment (weight)', function(assert) {
    var topPane = {
            name: 'topPane',
            height: 0.7
        },
        bottomPane = {
            name: 'bottomPane'
        },
        chartCanvasHeight = this.canvas.height - this.canvas.top - this.canvas.bottom,
        panePadding = 10,
        expectedBottomPaneHeight = (chartCanvasHeight - panePadding) * 0.3,
        expectedTopPaneHeight = (chartCanvasHeight - panePadding) * 0.7;

    utils.setCanvasValues(this.canvas);
    utils.normalizePanesHeight([topPane, bottomPane]);
    utils.updatePanesCanvases([topPane, bottomPane], this.canvas);

    assert.strictEqual(topPane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.bottom, this.canvas.bottom + expectedBottomPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(topPane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.originalBottom, this.canvas.bottom + expectedBottomPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(bottomPane.canvas.top, this.canvas.top + expectedTopPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

    assert.strictEqual(bottomPane.canvas.originalTop, this.canvas.top + expectedTopPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');
});

QUnit.test('Two not equal panes - vertical alignment (pixels)', function(assert) {
    var expectedBottomPaneHeight = 220,
        topPane = {
            name: 'topPane'
        },
        bottomPane = {
            name: 'bottomPane',
            height: expectedBottomPaneHeight
        },
        chartCanvasHeight = this.canvas.height - this.canvas.top - this.canvas.bottom,
        panePadding = 10,
        expectedTopPaneHeight = chartCanvasHeight - panePadding - expectedBottomPaneHeight;

    utils.setCanvasValues(this.canvas);
    utils.normalizePanesHeight([topPane, bottomPane]);
    utils.updatePanesCanvases([topPane, bottomPane], this.canvas);

    assert.strictEqual(topPane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.bottom, this.canvas.bottom + expectedBottomPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(topPane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.originalBottom, this.canvas.bottom + expectedBottomPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(bottomPane.canvas.top, this.canvas.top + expectedTopPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

    assert.strictEqual(bottomPane.canvas.originalTop, this.canvas.top + expectedTopPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');
});

QUnit.test('Two not equal panes - vertical alignment (both panes sized by pixels)', function(assert) {
    var expectedBottomPaneHeight = 200,
        expectedTopPaneHeight = 160,
        topPane = {
            name: 'topPane',
            height: expectedTopPaneHeight
        },
        bottomPane = {
            name: 'bottomPane',
            height: expectedBottomPaneHeight
        },
        panePadding = 10;

    utils.setCanvasValues(this.canvas);
    utils.normalizePanesHeight([topPane, bottomPane]);
    utils.updatePanesCanvases([topPane, bottomPane], this.canvas);

    assert.strictEqual(topPane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.bottom, this.canvas.bottom + expectedBottomPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(topPane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(topPane.canvas.originalBottom, this.canvas.bottom + expectedBottomPaneHeight + panePadding, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(bottomPane.canvas.top, this.canvas.top + expectedTopPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

    assert.strictEqual(bottomPane.canvas.originalTop, this.canvas.top + expectedTopPaneHeight + panePadding, 'Pane Canvas Top margin should change');
    assert.strictEqual(bottomPane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');
});

QUnit.test('Two equal panes - rotated, horizontal alignment', function(assert) {
    var leftPane = {
            name: 'leftPane',
            height: 1
        },
        rightPane = {
            name: 'rightPane',
            height: 1
        },
        chartCanvasWidth = this.canvas.width - this.canvas.left - this.canvas.right,
        panePadding = 10,
        expectedPaneWidth = (chartCanvasWidth - panePadding) / 2;

    utils.setCanvasValues(this.canvas);
    utils.normalizePanesHeight([leftPane, rightPane]);
    utils.updatePanesCanvases([leftPane, rightPane], this.canvas, true);

    assert.ok(rightPane.canvas, 'Canvas added to pane');
    assert.notEqual(this.canvas, rightPane.canvas, 'Pane canvas should not reference the main object in memory');

    assert.ok(leftPane.canvas, 'Canvas added to pane');
    assert.notEqual(this.canvas, leftPane.canvas, 'Pane canvas should not reference the main object in memory');
    // top pane - width 460, margin left - 30, margin right - 40
    assert.strictEqual(leftPane.canvas.left, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(leftPane.canvas.right, this.canvas.right + expectedPaneWidth + panePadding, 'Pane Canvas Right margin should change');
    assert.strictEqual(leftPane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(leftPane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should change');

    assert.strictEqual(leftPane.canvas.originalLeft, this.canvas.left, 'Pane Canvas Left margin should be equal to main canvas');
    assert.strictEqual(leftPane.canvas.originalRight, this.canvas.right + expectedPaneWidth + panePadding, 'Pane Canvas Right margin should change');
    assert.strictEqual(leftPane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(leftPane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should change');

    // bottom pane - width 460, margin left - 200, margin right - 40
    assert.strictEqual(rightPane.canvas.left, this.canvas.left + expectedPaneWidth + panePadding, 'Pane Canvas Left margin should change');
    assert.strictEqual(rightPane.canvas.right, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(rightPane.canvas.top, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(rightPane.canvas.bottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

    assert.strictEqual(rightPane.canvas.originalLeft, this.canvas.left + expectedPaneWidth + panePadding, 'Pane Canvas Left margin should change');
    assert.strictEqual(rightPane.canvas.originalRight, this.canvas.right, 'Pane Canvas Right margin should be equal to main canvas');
    assert.strictEqual(rightPane.canvas.originalTop, this.canvas.top, 'Pane Canvas Top margin should be equal to main canvas');
    assert.strictEqual(rightPane.canvas.originalBottom, this.canvas.bottom, 'Pane Canvas Bottom margin should be equal to main canvas');

});
