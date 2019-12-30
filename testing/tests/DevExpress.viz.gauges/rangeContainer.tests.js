const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const BaseRangeContainer = require('viz/gauges/base_range_container');
const CircularRangeContainer = require('viz/gauges/circular_range_container');
const LinearRangeContainer = require('viz/gauges/linear_range_container');
const Translator1D = require('viz/translators/translator1d').Translator1D;
const themeManagerModule = require('viz/gauges/theme_manager');

const TestRangeContainer = BaseRangeContainer.inherit({
    _processOptions: function() {
    },
    _createRange: function(range, settings) {
        this.elements = this.elements || [];
        const element = this._renderer.g();
        element.range = range;
        element.data = settings;
        this.elements.push(element);
        return element;
    },
    _isVisible: function() {
        return true;
    }
});

const environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.container = new vizMocks.Element();
        this.translator = new Translator1D();
        this.themeManager = new themeManagerModule.ThemeManager({});
        sinon.stub(this.themeManager, 'createPalette', this.themeManager.createPalette);
        this.rangeContainer = new TestRangeContainer({
            renderer: this.renderer,
            container: this.container,
            translator: this.translator,
            themeManager: this.themeManager
        });
    },

    afterEach: function() {
        this.rangeContainer.dispose();
    }
};

QUnit.module('BaseRangeContainer', environment);

QUnit.test('Creation', function(assert) {
    assert.deepEqual(this.renderer.g.firstCall.returnValue.attr.lastCall.args, [{ 'class': 'dxg-range-container' }], 'root settings');
    assert.deepEqual(this.renderer.g.firstCall.returnValue.linkOn.lastCall.args, [this.container, 'range-container'], 'root is linked to container');
});

QUnit.test('Disposing', function(assert) {
    this.rangeContainer.dispose();
    this.rangeContainer.dispose = noop;
    assert.deepEqual(this.renderer.g.firstCall.returnValue.linkOff.lastCall.args, [], 'root is unlinked');
});

QUnit.test('Render', function(assert) {
    this.rangeContainer.render({
        width: 1,
        ranges: [{ startValue: 0, endValue: 1 }]
    });
    assert.deepEqual(this.renderer.g.firstCall.returnValue.linkAppend.lastCall.args, [], 'root is appended');
});

QUnit.test('Clean', function(assert) {
    this.rangeContainer.clean();
    assert.deepEqual(this.renderer.g.firstCall.returnValue.linkRemove.lastCall.args, [], 'root is removed');
});

//  B232788
QUnit.test('Init with less ranges', function(assert) {
    const rangeContainer = this.rangeContainer;
    rangeContainer.render({
        width: 10,
        ranges: [
            { startValue: 0, endValue: 20, color: 'red' },
            { startValue: 20, endValue: 40, color: 'green' }
        ]
    });
    rangeContainer.render({
        width: 11,
        ranges: [
            { startValue: 0, endValue: 10, color: 'yellow' }
        ]
    });
    assert.deepEqual(rangeContainer._options, {
        width: 11,
        ranges: [
            { startValue: 0, endValue: 10, color: 'yellow' }
        ]
    });
});

//  B232788
QUnit.test('Init with more ranges', function(assert) {
    const rangeContainer = this.rangeContainer;
    rangeContainer.render({
        width: 10,
        ranges: [
            { startValue: 0, endValue: 20, color: 'red' },
            { startValue: 20, endValue: 40, color: 'green' }
        ]
    });
    rangeContainer.render({
        width: 9,
        ranges: [
            { startValue: 0, endValue: 10, color: 'yellow' },
            { startValue: 10, endValue: 20, color: 'blue' },
            { startValue: 20, endValue: 30, color: 'orange' }
        ]
    });
    assert.deepEqual(rangeContainer._options, {
        width: 9,
        ranges: [
            { startValue: 0, endValue: 10, color: 'yellow' },
            { startValue: 10, endValue: 20, color: 'blue' },
            { startValue: 20, endValue: 30, color: 'orange' }
        ]
    });
});

//  B232788
QUnit.test('Init with no ranges', function(assert) {
    const rangeContainer = this.rangeContainer;
    rangeContainer.render({
        width: 10,
        ranges: [
            { startValue: 0, endValue: 20, color: 'red' },
            { startValue: 20, endValue: 40, color: 'green' }
        ]
    });
    rangeContainer.render({ width: 9 });
    assert.deepEqual(rangeContainer._options, {
        width: 9
    });
});

// S170193
QUnit.test('Color for value', function(assert) {
    this.translator.setDomain(0, 100);
    this.rangeContainer.render({
        width: 1,
        backgroundColor: 'color-b',
        ranges: [
            { startValue: 10, endValue: 20, color: 'color-1' },
            { startValue: 30, endValue: 50, color: 'color-2' },
            { startValue: 50, endValue: 80, color: 'color-3' }
        ]
    });

    assert.strictEqual(this.rangeContainer.getColorForValue(0), 'color-b', '0');
    assert.strictEqual(this.rangeContainer.getColorForValue(10), 'color-1', '10');
    assert.strictEqual(this.rangeContainer.getColorForValue(15), 'color-1', '15');
    assert.strictEqual(this.rangeContainer.getColorForValue(20), 'color-1', '20');
    assert.strictEqual(this.rangeContainer.getColorForValue(25), 'color-b', '25');
    assert.strictEqual(this.rangeContainer.getColorForValue(30), 'color-2', '30');
    assert.strictEqual(this.rangeContainer.getColorForValue(50), 'color-2', '50');
    assert.strictEqual(this.rangeContainer.getColorForValue(70), 'color-3', '70');
    assert.strictEqual(this.rangeContainer.getColorForValue(80), 'color-3', '80');
    assert.strictEqual(this.rangeContainer.getColorForValue(100), 'color-b', '100');
});

QUnit.module('BaseRangeContainer - ranges ', $.extend({}, environment, {
    checkRanges: function(assert, ranges, expected) {
        const translatorAsc = new Translator1D(-50, 150, 300, 500);
        const translatorDesc = new Translator1D(50, -150, 300, 500);
        let rangesAsc;
        let rangesDesc;
        const expectedAsc = [];
        const expectedDesc = [];
        let list;

        rangesAsc = ranges.slice(0);
        rangesDesc = $.map(rangesAsc, function(item) {
            return { startValue: -item.startValue, endValue: -item.endValue, color: item.color };
        });

        $.each(expected, function(i, item) {
            const objAsc = {
                start: item.start,
                end: item.end,
                color: item.color,
                startWidth: 10,
                endWidth: 10,
                className: 'dxg-range dxg-' + (item.className >= 0 ? 'range-' + item.className : 'background-range')
            };
            const objDesc = {
                start: -item.start,
                end: -item.end,
                color: item.color,
                startWidth: 10,
                endWidth: 10,
                className: 'dxg-range dxg-' + (item.className >= 0 ? 'range-' + item.className : 'background-range')
            };
            expectedAsc.push(objAsc);
            expectedDesc.push(objDesc);
        });

        this.rangeContainer = new TestRangeContainer({
            renderer: this.renderer,
            container: this.container,
            translator: translatorAsc,
            themeManager: this.themeManager
        });
        this.rangeContainer.render({
            backgroundColor: 'bcolor',
            width: 10,
            ranges: rangesAsc
        }).resize();
        list = this.rangeContainer.elements;
        assert.strictEqual(list.length, expectedAsc.length, 'count (ascending)');
        $.each(list, function(i, item) {
            assert.deepEqual(item.range, expectedAsc[i], 'range ' + i.toString() + ' (ascending)');
        });

        this.rangeContainer = new TestRangeContainer({
            renderer: this.renderer,
            container: this.container,
            translator: translatorDesc,
            themeManager: this.themeManager
        });
        this.rangeContainer.render({
            backgroundColor: 'bcolor',
            width: 10,
            ranges: rangesDesc
        }).resize();
        list = this.rangeContainer.elements;
        assert.strictEqual(list.length, expectedDesc.length, 'count (descending)');
        $.each(list, function(i, item) {
            assert.deepEqual(item.range, expectedDesc[i], 'range ' + i.toString() + ' (descending)');
        });
    }
}));

QUnit.test('ranges', function(assert) {
    this.checkRanges(assert, [
        { startValue: -20, endValue: -10, color: 'c1' },
        { startValue: 0, endValue: 20, color: 'c2' },
        { startValue: 50, endValue: 100, color: 'c3' }
    ], [
        { start: -20, end: -10, color: 'c1', className: 0 },
        { start: 0, end: 20, color: 'c2', className: 1 },
        { start: 50, end: 100, color: 'c3', className: 2 },
        { start: -50, end: -20, color: 'bcolor' },
        { start: -10, end: 0, color: 'bcolor' },
        { start: 20, end: 50, color: 'bcolor' },
        { start: 100, end: 150, color: 'bcolor' }
    ]);
});

QUnit.test('ranges intersections', function(assert) {
    this.checkRanges(assert, [
        { startValue: -60, endValue: -10, color: 'c1' },
        { startValue: -40, endValue: 20, color: 'c2' },
        { startValue: 10, endValue: 70, color: 'c3' },
        { startValue: 50, endValue: 130, color: 'c4' },
        { startValue: 120, endValue: 170, color: 'c5' }
    ], [
        { start: -50, end: -40, color: 'c1', className: 0 },
        { start: -40, end: 10, color: 'c2', className: 1 },
        { start: 10, end: 50, color: 'c3', className: 2 },
        { start: 50, end: 120, color: 'c4', className: 3 },
        { start: 120, end: 150, color: 'c5', className: 4 }
    ]);
});

QUnit.test('ranges overlapping', function(assert) {
    this.checkRanges(assert, [
        { startValue: -40, endValue: 30, color: 'c1' },
        { startValue: -30, endValue: -10, color: 'c2' },
        { startValue: 80, endValue: 110, color: 'c3' },
        { startValue: 50, endValue: 130, color: 'c4' }
    ], [
        { start: -40, end: -30, color: 'c1', className: 0 },
        { start: -10, end: 30, color: 'c1', className: 0 },
        { start: -30, end: -10, color: 'c2', className: 1 },
        { start: 50, end: 130, color: 'c4', className: 3 },
        { start: -50, end: -40, color: 'bcolor' },
        { start: 30, end: 50, color: 'bcolor' },
        { start: 130, end: 150, color: 'bcolor' }
    ]);
});

QUnit.test('ranges out of bounds', function(assert) {
    this.checkRanges(assert, [
        { startValue: -100, endValue: -60, color: 'c1' },
        { startValue: 200, endValue: 210, color: 'c2' },
        { startValue: 0, endValue: 10, color: 'c3' }
    ], [
        { start: 0, end: 10, color: 'c3', className: 2 },
        { start: -50, end: 0, color: 'bcolor' },
        { start: 10, end: 150, color: 'bcolor' }
    ]);
});

QUnit.test('ranges are empty', function(assert) {
    this.checkRanges(assert, [
        { startValue: 10, endValue: 10, color: 'c1' },
        { startValue: 50, endValue: 50, color: 'c2' },
        { startValue: -10, endValue: 140, color: 'c3' }
    ], [
        { start: -10, end: 140, color: 'c3', className: 2 },
        { start: -50, end: -10, color: 'bcolor' },
        { start: 140, end: 150, color: 'bcolor' }
    ]);
});

QUnit.test('ranges are not valid - wrong order', function(assert) {
    this.checkRanges(assert, [
        { startValue: 10, endValue: 20, color: 'c1' },
        { startValue: 30, endValue: 0, color: 'c2' },
        { startValue: -10, endValue: -40, color: 'c3' }
    ], [
        { start: 10, end: 20, color: 'c1', className: 0 },
        { start: -50, end: 10, color: 'bcolor' },
        { start: 20, end: 150, color: 'bcolor' }
    ]);
});

QUnit.test('ranges are not valid - not numbers', function(assert) {
    this.checkRanges(assert, [
        { startValue: 'test', endValue: 10, color: 'c1' },
        { startValue: 20, endValue: null, color: 'c2' },
        { startValue: -40, endValue: 40, color: 'c3' },
        { startValue: undefined, endValue: 100, color: 'c4' },
        { startValue: 10, endValue: [], color: 'c5' },
        { startValue: -30, endValue: {}, color: 'c6' },
        { startValue: NaN, endValue: NaN, color: 'c7' }
    ], [
        { start: -40, end: 40, color: 'c3', className: 2 },
        { start: -50, end: -40, color: 'bcolor' },
        { start: 40, end: 150, color: 'bcolor' }
    ]);
});

QUnit.module('BaseRangeContainer - width', environment);

QUnit.test('ascending width', function(assert) {
    let elements;

    this.rangeContainer = new TestRangeContainer({
        renderer: this.renderer,
        container: this.container,
        translator: new Translator1D(0, 100, 200, 300),
        themeManager: this.themeManager
    });
    this.rangeContainer.render({
        backgroundColor: 'bcolor',
        ranges: [
            { startValue: 10, endValue: 25, color: 'c1' },
            { startValue: 25, endValue: 50, color: 'c2' },
            { startValue: 50, endValue: 90, color: 'c3' }
        ],
        width: { start: 10, end: 20 }
    }).resize();

    elements = this.rangeContainer.elements;
    assert.deepEqual(elements[0].range, { start: 10, end: 25, startWidth: 11, endWidth: 12.5, color: 'c1', className: 'dxg-range dxg-range-0' }, 'range 1 (ascending)');
    assert.deepEqual(elements[1].range, { start: 25, end: 50, startWidth: 12.5, endWidth: 15, color: 'c2', className: 'dxg-range dxg-range-1' }, 'range 2 (ascending)');
    assert.deepEqual(elements[2].range, { start: 50, end: 90, startWidth: 15, endWidth: 19, color: 'c3', className: 'dxg-range dxg-range-2' }, 'range 3 (ascending)');
    assert.deepEqual(elements[3].range, { start: 0, end: 10, startWidth: 10, endWidth: 11, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 4 (ascending)');
    assert.deepEqual(elements[4].range, { start: 90, end: 100, startWidth: 19, endWidth: 20, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 5 (ascending)');

    this.rangeContainer = new TestRangeContainer({
        renderer: this.renderer,
        container: this.container,
        translator: new Translator1D(100, 0, 200, 300),
        themeManager: this.themeManager
    });
    this.rangeContainer.render({
        backgroundColor: 'bcolor',
        ranges: [
            { startValue: 90, endValue: 75, color: 'c1' },
            { startValue: 75, endValue: 50, color: 'c2' },
            { startValue: 50, endValue: 10, color: 'c3' }
        ],
        width: { start: 10, end: 20 }
    }).resize();

    elements = this.rangeContainer.elements;
    assert.deepEqual(elements[0].range, { start: 90, end: 75, startWidth: 11, endWidth: 12.5, color: 'c1', className: 'dxg-range dxg-range-0' }, 'range 1 (descending)');
    assert.deepEqual(elements[1].range, { start: 75, end: 50, startWidth: 12.5, endWidth: 15, color: 'c2', className: 'dxg-range dxg-range-1' }, 'range 2 (descending)');
    assert.deepEqual(elements[2].range, { start: 50, end: 10, startWidth: 15, endWidth: 19, color: 'c3', className: 'dxg-range dxg-range-2' }, 'range 3 (descending)');
    assert.deepEqual(elements[3].range, { start: 100, end: 90, startWidth: 10, endWidth: 11, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 4 (descending)');
    assert.deepEqual(elements[4].range, { start: 10, end: 0, startWidth: 19, endWidth: 20, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 5 (descending)');
});

QUnit.test('descending width', function(assert) {
    let elements;

    this.rangeContainer = new TestRangeContainer({
        renderer: this.renderer,
        container: this.container,
        translator: new Translator1D(0, 100, 200, 300),
        themeManager: this.themeManager
    });
    this.rangeContainer.render({
        backgroundColor: 'bcolor',
        ranges: [
            { startValue: 10, endValue: 25, color: 'c1' },
            { startValue: 25, endValue: 50, color: 'c2' },
            { startValue: 50, endValue: 90, color: 'c3' }
        ],
        width: { start: 20, end: 0 }
    }).resize();

    elements = this.rangeContainer.elements;
    assert.deepEqual(elements[0].range, { start: 10, end: 25, startWidth: 18, endWidth: 15, color: 'c1', className: 'dxg-range dxg-range-0' }, 'range 1 (ascending)');
    assert.deepEqual(elements[1].range, { start: 25, end: 50, startWidth: 15, endWidth: 10, color: 'c2', className: 'dxg-range dxg-range-1' }, 'range 2 (ascending)');
    assert.deepEqual(elements[2].range, { start: 50, end: 90, startWidth: 10, endWidth: 2, color: 'c3', className: 'dxg-range dxg-range-2' }, 'range 3 (ascending)');
    assert.deepEqual(elements[3].range, { start: 0, end: 10, startWidth: 20, endWidth: 18, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 4 (ascending)');
    assert.deepEqual(elements[4].range, { start: 90, end: 100, startWidth: 2, endWidth: 0, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 5 (ascending)');

    this.rangeContainer = new TestRangeContainer({
        renderer: this.renderer,
        container: this.container,
        translator: new Translator1D(100, 0, 200, 300),
        themeManager: this.themeManager
    });
    this.rangeContainer.render({
        backgroundColor: 'bcolor',
        ranges: [
            { startValue: 90, endValue: 75, color: 'c1' },
            { startValue: 75, endValue: 50, color: 'c2' },
            { startValue: 50, endValue: 10, color: 'c3' }
        ],
        width: { start: 20, end: 0 }
    }).resize();

    elements = this.rangeContainer.elements;
    assert.deepEqual(elements[0].range, { start: 90, end: 75, startWidth: 18, endWidth: 15, color: 'c1', className: 'dxg-range dxg-range-0' }, 'range 1 (descending)');
    assert.deepEqual(elements[1].range, { start: 75, end: 50, startWidth: 15, endWidth: 10, color: 'c2', className: 'dxg-range dxg-range-1' }, 'range 2 (descending)');
    assert.deepEqual(elements[2].range, { start: 50, end: 10, startWidth: 10, endWidth: 2, color: 'c3', className: 'dxg-range dxg-range-2' }, 'range 3 (descending)');
    assert.deepEqual(elements[3].range, { start: 100, end: 90, startWidth: 20, endWidth: 18, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 4 (descending)');
    assert.deepEqual(elements[4].range, { start: 10, end: 0, startWidth: 2, endWidth: 0, color: 'bcolor', className: 'dxg-range dxg-background-range' }, 'range 5 (descending)');
});

QUnit.module('BaseRangeContainer - palette', $.extend({}, environment, {
    checkColors: function(assert, rangeColors, palette, expectedColors, paletteExtensionMode) {
        let ranges; let list;
        const step = 100 / (rangeColors.length + 1);
        let pos = 0;
        ranges = $.map(rangeColors, function(color) {
            const range = { startValue: pos, endValue: pos + step, color: color };
            pos += step;
            return range;
        });
        this.rangeContainer._translator = new Translator1D(0, 100, 300, 400);
        paletteExtensionMode = paletteExtensionMode || 'blend';
        this.rangeContainer.render({
            width: 1,
            ranges: ranges,
            palette: palette,
            paletteExtensionMode: paletteExtensionMode
        }).resize();
        list = this.rangeContainer.elements;
        $.each(expectedColors, function(i, color) {
            assert.strictEqual(list[i].range.color, color, 'range ' + i.toString());
        });
        assert.strictEqual(list[list.length - 1].range.color, 'none', 'background color');

        assert.strictEqual(this.themeManager.createPalette.callCount, 1);
        assert.deepEqual(this.themeManager.createPalette.firstCall.args, [palette, { type: 'indicatingSet', keepLastColorInEnd: true, extensionMode: paletteExtensionMode, count: ranges.length }]);
    }
}));

QUnit.test('no palette, no colors', function(assert) {
    this.checkColors(assert, [null, null, null], null, ['#97c95c', '#ffc720', '#f5564a', 'none']);
});

QUnit.test('no palette, colors', function(assert) {
    this.checkColors(assert, ['c1', 'c2', 'c3'], null, ['c1', 'c2', 'c3', 'none']);
});

QUnit.test('palette, colors', function(assert) {
    this.checkColors(assert, ['c1', 'c2', 'c3'], ['p1', 'p2', 'p3'], ['c1', 'c2', 'c3', 'none']);
});

QUnit.test('palette, no colors', function(assert) {
    this.checkColors(assert, [null, null, null], ['p1', 'p2', 'p3'], ['p1', 'p2', 'p3', 'none']);
});

QUnit.test('palette is shorter than ranges when paletteExtensionMode is alternate', function(assert) {
    this.checkColors(assert, [null, null, null, null, null], ['p1', 'p2'], ['p1', 'p2', 'p1', 'p2'], 'alternate');
});

QUnit.test('First range with color', function(assert) {
    this.checkColors(assert, ['#679ec5', null], null, ['#679ec5', '#ffc720']);
});

QUnit.test('palette is shorter than ranges when paletteExtensionMode is blend', function(assert) {
    this.checkColors(assert, [null, null, null, null, null], ['green', 'red'], ['green', '#406000', '#804000', '#bf2000', 'red']);
});

QUnit.test('palette is longer than ranges', function(assert) {
    this.checkColors(assert, [null, null, null], ['p1', 'p2', 'p3', 'p4', 'p5'], ['p1', 'p2', 'p3']);
});

QUnit.module('CircularRangeContainer', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.rangeContainer = new CircularRangeContainer({
            renderer: this.renderer,
            container: this.container,
            translator: new Translator1D(0, 100, 200, 300),
            themeManager: this.themeManager
        });
        this.options = {
            backgroundColor: 'bcolor',
            ranges: [
                { startValue: 10, endValue: 25, color: 'c1' },
                { startValue: 25, endValue: 50, color: 'c2' },
                { startValue: 50, endValue: 90, color: 'c3' }
            ],
            width: { start: 10, end: 20 }
        };
        this.layout = {
            x: 10,
            y: 20,
            radius: 100
        };
    },

    afterEach: environment.afterEach
});

QUnit.test('inside', function(assert) {
    this.options.orientation = 'inside';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        x: 10, y: 20, innerRadius: 88.25, outerRadius: 100, startAngle: 225, endAngle: 210, fill: 'c1', 'class': 'dxg-range dxg-range-0', 'stroke-linejoin': 'round'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        x: 10, y: 20, innerRadius: 86.25, outerRadius: 100, startAngle: 250, endAngle: 225, fill: 'c2', 'class': 'dxg-range dxg-range-1', 'stroke-linejoin': 'round'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        x: 10, y: 20, innerRadius: 83, outerRadius: 100, startAngle: 290, endAngle: 250, fill: 'c3', 'class': 'dxg-range dxg-range-2', 'stroke-linejoin': 'round'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        x: 10, y: 20, innerRadius: 89.5, outerRadius: 100, startAngle: 210, endAngle: 200, fill: 'bcolor', 'class': 'dxg-range dxg-background-range', 'stroke-linejoin': 'round'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        x: 10, y: 20, innerRadius: 80.5, outerRadius: 100, startAngle: 300, endAngle: 290, fill: 'bcolor', 'class': 'dxg-range dxg-background-range', 'stroke-linejoin': 'round'
    }, 'range 5');
});

QUnit.test('outside', function(assert) {
    this.options.orientation = 'outside';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        x: 10, y: 20, innerRadius: 100, outerRadius: 111.75, startAngle: 225, endAngle: 210, fill: 'c1', 'class': 'dxg-range dxg-range-0', 'stroke-linejoin': 'round'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        x: 10, y: 20, innerRadius: 100, outerRadius: 113.75, startAngle: 250, endAngle: 225, fill: 'c2', 'class': 'dxg-range dxg-range-1', 'stroke-linejoin': 'round'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        x: 10, y: 20, innerRadius: 100, outerRadius: 117, startAngle: 290, endAngle: 250, fill: 'c3', 'class': 'dxg-range dxg-range-2', 'stroke-linejoin': 'round'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        x: 10, y: 20, innerRadius: 100, outerRadius: 110.5, startAngle: 210, endAngle: 200, fill: 'bcolor', 'class': 'dxg-range dxg-background-range', 'stroke-linejoin': 'round'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        x: 10, y: 20, innerRadius: 100, outerRadius: 119.5, startAngle: 300, endAngle: 290, fill: 'bcolor', 'class': 'dxg-range dxg-background-range', 'stroke-linejoin': 'round'
    }, 'range 5');
});

QUnit.test('center', function(assert) {
    this.options.orientation = 'center';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        x: 10, y: 20, innerRadius: 94.125, outerRadius: 105.875, startAngle: 225, endAngle: 210, fill: 'c1', 'class': 'dxg-range dxg-range-0', 'stroke-linejoin': 'round'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        x: 10, y: 20, innerRadius: 93.125, outerRadius: 106.875, startAngle: 250, endAngle: 225, fill: 'c2', 'class': 'dxg-range dxg-range-1', 'stroke-linejoin': 'round'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        x: 10, y: 20, innerRadius: 91.5, outerRadius: 108.5, startAngle: 290, endAngle: 250, fill: 'c3', 'class': 'dxg-range dxg-range-2', 'stroke-linejoin': 'round'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        x: 10, y: 20, innerRadius: 94.75, outerRadius: 105.25, startAngle: 210, endAngle: 200, fill: 'bcolor', 'class': 'dxg-range dxg-background-range', 'stroke-linejoin': 'round'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        x: 10, y: 20, innerRadius: 90.25, outerRadius: 109.75, startAngle: 300, endAngle: 290, fill: 'bcolor', 'class': 'dxg-range dxg-background-range', 'stroke-linejoin': 'round'
    }, 'range 5');
});

QUnit.test('measure', function(assert) {
    this.options.orientation = 'inside';
    assert.deepEqual(this.rangeContainer.render(this.options).measure(this.layout), { min: 80, max: 100 }, 'inside');

    this.options.orientation = 'outside';
    assert.deepEqual(this.rangeContainer.render(this.options).measure(this.layout), { min: 100, max: 120 }, 'outside');

    this.options.orientation = 'center';
    assert.deepEqual(this.rangeContainer.render(this.options).measure(this.layout), { min: 90, max: 110 }, 'center');
});

QUnit.test('validation - ranges', function(assert) {
    this.options.ranges = null;
    assert.ok(!this.rangeContainer.render(this.options).enabled);
});

QUnit.test('validation - width', function(assert) {
    this.options.width = null;
    assert.ok(!this.rangeContainer.render(this.options).enabled);
});

QUnit.test('radius is not valid (not rendered)', function(assert) {
    this.layout.radius = 10;
    this.options.orientation = 'inside';
    this.options.width = 20;
    this.rangeContainer.render(this.options).resize(this.layout);

    assert.ok(!this.rangeContainer._root.children.length);
});

QUnit.module('LinearRangeContainer', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.rangeContainer = new LinearRangeContainer({
            renderer: this.renderer,
            container: this.container,
            translator: new Translator1D(0, 100, 200, 300),
            themeManager: this.themeManager
        });
        this.layout = {
            x: 40,
            y: 20
        };
        this.options = {
            backgroundColor: 'bcolor',
            ranges: [
                { startValue: 10, endValue: 25, color: 'c1' },
                { startValue: 25, endValue: 50, color: 'c2' },
                { startValue: 50, endValue: 90, color: 'c3' }
            ],
            width: { start: 10, end: 20 }
        };
    },

    afterEach: environment.afterEach
});

QUnit.test('horizontal - top', function(assert) {
    this.options.verticalOrientation = 'top';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        points: [210, 20, 210, 9, 225, 7.5, 225, 20], fill: 'c1', 'class': 'dxg-range dxg-range-0',
        type: 'area'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        points: [225, 20, 225, 7.5, 250, 5, 250, 20], fill: 'c2', 'class': 'dxg-range dxg-range-1',
        type: 'area'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        points: [250, 20, 250, 5, 290, 1, 290, 20], fill: 'c3', 'class': 'dxg-range dxg-range-2',
        type: 'area'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        points: [200, 20, 200, 10, 210, 9, 210, 20], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        points: [290, 20, 290, 1, 300, 0, 300, 20], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 5');
});

QUnit.test('horizontal - bottom', function(assert) {
    this.options.verticalOrientation = 'bottom';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        points: [210, 31, 210, 20, 225, 20, 225, 32.5], fill: 'c1', 'class': 'dxg-range dxg-range-0',
        type: 'area'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        points: [225, 32.5, 225, 20, 250, 20, 250, 35], fill: 'c2', 'class': 'dxg-range dxg-range-1',
        type: 'area'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        points: [250, 35, 250, 20, 290, 20, 290, 39], fill: 'c3', 'class': 'dxg-range dxg-range-2',
        type: 'area'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        points: [200, 30, 200, 20, 210, 20, 210, 31], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        points: [290, 39, 290, 20, 300, 20, 300, 40], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 5');
});

QUnit.test('vertical - left', function(assert) {
    this.options.vertical = true;
    this.options.horizontalOrientation = 'left';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        points: [29, 210, 27.5, 225, 40, 225, 40, 210], fill: 'c1', 'class': 'dxg-range dxg-range-0',
        type: 'area'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        points: [27.5, 225, 25, 250, 40, 250, 40, 225], fill: 'c2', 'class': 'dxg-range dxg-range-1',
        type: 'area'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        points: [25, 250, 21, 290, 40, 290, 40, 250], fill: 'c3', 'class': 'dxg-range dxg-range-2',
        type: 'area'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        points: [30, 200, 29, 210, 40, 210, 40, 200], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        points: [21, 290, 20, 300, 40, 300, 40, 290], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 5');
});

QUnit.test('vertical - right', function(assert) {
    this.options.vertical = true;
    this.options.horizontalOrientation = 'right';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        points: [40, 210, 40, 225, 52.5, 225, 51, 210], fill: 'c1', 'class': 'dxg-range dxg-range-0',
        type: 'area'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        points: [40, 225, 40, 250, 55, 250, 52.5, 225], fill: 'c2', 'class': 'dxg-range dxg-range-1',
        type: 'area'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        points: [40, 250, 40, 290, 59, 290, 55, 250], fill: 'c3', 'class': 'dxg-range dxg-range-2',
        type: 'area'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        points: [40, 200, 40, 210, 51, 210, 50, 200], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        points: [40, 290, 40, 300, 60, 300, 59, 290], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 5');
});

QUnit.test('vertical - center', function(assert) {
    this.options.vertical = true;
    this.options.horizontalOrientation = 'center';
    const rangeContainer = this.rangeContainer;
    rangeContainer.render(this.options).resize(this.layout);

    assert.ok(rangeContainer._renderer, '_renderer');
    assert.ok(rangeContainer._container, '_container');

    assert.ok(rangeContainer._root, '_root');
    assert.deepEqual(rangeContainer._root._stored_settings, { 'class': 'dxg-range-container' }, '_root settings');

    assert.strictEqual(rangeContainer._root.children.length, 5, 'ranges count');

    assert.deepEqual(rangeContainer._root.children[0]._stored_settings, {
        points: [34.5, 210, 33.75, 225, 46.25, 225, 45.5, 210], fill: 'c1', 'class': 'dxg-range dxg-range-0',
        type: 'area'
    }, 'range 1');
    assert.deepEqual(rangeContainer._root.children[1]._stored_settings, {
        points: [33.75, 225, 32.5, 250, 47.5, 250, 46.25, 225], fill: 'c2', 'class': 'dxg-range dxg-range-1',
        type: 'area'
    }, 'range 2');
    assert.deepEqual(rangeContainer._root.children[2]._stored_settings, {
        points: [32.5, 250, 30.5, 290, 49.5, 290, 47.5, 250], fill: 'c3', 'class': 'dxg-range dxg-range-2',
        type: 'area'
    }, 'range 3');
    assert.deepEqual(rangeContainer._root.children[3]._stored_settings, {
        points: [35, 200, 34.5, 210, 45.5, 210, 45, 200], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 4');
    assert.deepEqual(rangeContainer._root.children[4]._stored_settings, {
        points: [30.5, 290, 30, 300, 50, 300, 49.5, 290], fill: 'bcolor', 'class': 'dxg-range dxg-background-range',
        type: 'area'
    }, 'range 5');
});

QUnit.test('measure', function(assert) {
    const rangeContainer = this.rangeContainer;

    this.options.verticalOrientation = 'top';
    assert.deepEqual(rangeContainer.render(this.options).measure(this.layout), { min: 0, max: 20 }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(rangeContainer.render(this.options).measure(this.layout), { min: 20, max: 40 }, 'horizontal, bottom');

    this.options.vertical = true;

    this.options.horizontalOrientation = 'left';
    assert.deepEqual(rangeContainer.render(this.options).measure(this.layout), { min: 20, max: 40 }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(rangeContainer.render(this.options).measure(this.layout), { min: 40, max: 60 }, 'vertical, right');

    this.options.horizontalOrientation = 'center';
    assert.deepEqual(rangeContainer.render(this.options).measure(this.layout), { min: 30, max: 50 }, 'vertical, center');
});

QUnit.test('validation - ranges', function(assert) {
    this.options.ranges = null;
    assert.ok(!this.rangeContainer.render(this.options).enabled);
});

QUnit.test('validation - width', function(assert) {
    this.options.width = null;
    assert.ok(!this.rangeContainer.render(this.options).enabled);
});
