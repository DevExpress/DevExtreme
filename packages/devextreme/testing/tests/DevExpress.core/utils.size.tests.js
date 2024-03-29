import $ from 'jquery';
import sizeUtils, { getHeight, getWidth, getInnerHeight, getInnerWidth, getOuterHeight, getOuterWidth } from 'core/utils/size';
import browser from 'core/utils/browser';

const testStyles = [
    {},
    { width: '40px', height: '50px' },
    { width: '50%', height: '50%' },
    { width: 'inherit', height: 'inherit' },
    { width: 'auto', height: 'auto' },
];

const windowHeight = $(window).height();

function getScrollbarThickness() {
    if(browser.mozilla) {
        return 0;
    }
    const scrollbarTest = $('<div>')
        .css({
            width: '100px',
            height: '100px',
            overflow: 'scroll',
        })
        .appendTo('#qunit-fixture')
        .get(0);
    const scrollbarWidth = scrollbarTest.offsetWidth - scrollbarTest.clientWidth;
    $(scrollbarTest).remove();

    return scrollbarWidth;
}

function updateElementStyle(that, style) {
    that.$element = $('<div>')
        .css(style)
        .appendTo(that.$parent);
}

QUnit.module('get width and height', {
    beforeEach: function() {
        this.$parent = $('<div></div>')
            .css({
                width: '100px',
                height: '110px',
            })
            .appendTo('#qunit-fixture');
        this.$element = $('<div/>');
        this.$element.appendTo(this.$parent);
    },

    afterEach: function() {
    }
});

QUnit.test('element in parent with fixed size', function(assert) {
    const expected = [
        { width: 100, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 100, height: 0 }
    ];

    for(let i = 0; i < testStyles.length; i++) {
        this.$element.css(testStyles[i]);
        assert.equal(getWidth(this.$element[0]), expected[i].width);
        assert.equal(getHeight(this.$element[0]), expected[i].height);
    }
});

QUnit.test('invisible element in parent with fixed size', function(assert) {
    const that = this;

    const testParams = [{
        style: { display: 'none' },
        width: 0,
        height: 0
    }, {
        style: { width: '40px', height: '50px', display: 'none' },
        width: 40,
        height: 50
    }, {
        style: { width: 'inherit', height: 'inherit', display: 'none' },
        width: 100,
        height: 110
    }, {
        style: { width: 'auto', height: 'auto', display: 'none' },
        width: 0,
        height: 0
    }];

    testParams.forEach(function(params) {
        that.$element.css(params.style);
        assert.equal(getWidth(that.$element[0]), params.width);
        assert.equal(getHeight(that.$element[0]), params.height);
    });
});

QUnit.test('element with padding, marging, border without params', function(assert) {
    let expected;
    let i;

    expected = [
        { width: 80, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        updateElementStyle(this, { ...testStyles[i], padding: '10px' });
        assert.equal(getWidth(this.$element[0]), expected[i].width);
        assert.equal(getHeight(this.$element[0]), expected[i].height);

        updateElementStyle(this, { ...testStyles[i], margin: '10px' });
        assert.equal(getWidth(this.$element[0]), expected[i].width);
        assert.equal(getHeight(this.$element[0]), expected[i].height);
    }

    expected = [
        { width: 96, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 96, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        updateElementStyle(this, { ...testStyles[i], border: '2px solid black' });
        assert.equal(getWidth(this.$element[0]), expected[i].width);
        assert.equal(getHeight(this.$element[0]), expected[i].height);
    }
});

QUnit.test('element with padding, marging, border with params', function(assert) {
    this.$element.css({ width: '40px', height: '50px', padding: '5px', margin: '10px', border: '2px solid black' });

    assert.equal(getWidth(this.$element[0]), 40);
    assert.equal(getHeight(this.$element[0]), 50);

    assert.equal(getInnerWidth(this.$element[0]), 50);
    assert.equal(getInnerHeight(this.$element[0]), 60);

    assert.equal(getOuterWidth(this.$element[0]), 54);
    assert.equal(getOuterHeight(this.$element[0]), 64);

    assert.equal(getOuterWidth(this.$element[0], true), 74);
    assert.equal(getOuterHeight(this.$element[0], true), 84);
});

QUnit.test('element with box-sizing = border-box', function(assert) {
    let expected;
    let i;

    let iteration = 0;
    expected = [
        { width: 100, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 100, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        updateElementStyle(this, { ...testStyles[i], 'box-sizing': 'border-box' });
        assert.equal(getWidth(this.$element[0]), expected[i].width, `${iteration}.${i}-width`);
        assert.equal(getHeight(this.$element[0]), expected[i].height, `${iteration}.${i}-height`);
    }

    iteration = 1;
    expected = [
        { width: 80, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        updateElementStyle(this, { ...testStyles[i], margin: '10px', 'box-sizing': 'border-box' });
        assert.equal(getWidth(this.$element[0]), expected[i].width, `${iteration}.${i}-width`);
        assert.equal(getHeight(this.$element[0]), expected[i].height, `${iteration}.${i}-height`);
    }

    iteration = 2;
    expected = [
        { width: 80, height: 0 },
        { width: 20, height: 30 },
        { width: 30, height: 35 },
        { width: 80, height: 90 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        updateElementStyle(this, { ...testStyles[i], padding: '10px', 'box-sizing': 'border-box' });
        assert.equal(getWidth(this.$element[0]), expected[i].width, `${iteration}.${i}-width`);
        assert.equal(getHeight(this.$element[0]), expected[i].height, `${iteration}.${i}-height`);
    }

    iteration = 3;
    expected = [
        { width: 96, height: 0 },
        { width: 36, height: 46 },
        { width: 46, height: 51 },
        { width: 96, height: 106 },
        { width: 96, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        updateElementStyle(this, { ...testStyles[i], border: '2px solid black', 'box-sizing': 'border-box' });
        assert.equal(getWidth(this.$element[0]), expected[i].width, `${iteration}.${i}-width`);
        assert.equal(getHeight(this.$element[0]), expected[i].height), `${iteration}.${i}-height`;
    }
});

QUnit.test('element with box-sizing = border-box and parent is invisible', function(assert) {
    this.$parent.css({ width: '100px', height: '110px', display: 'none' });
    this.$element.css({ width: '100px', height: '100%', 'box-sizing': 'border-box' });
    assert.equal(getWidth(this.$element[0]), 100);
    assert.equal(getHeight(this.$element[0]), 100);

    this.$parent.css({ width: '100px', height: '110px', display: 'none' });
    this.$element.css({ width: '100%', height: '100%', padding: '10px', 'box-sizing': 'border-box' });
    assert.equal(getOuterWidth(this.$element[0]), 100);
    assert.equal(getOuterHeight(this.$element[0]), 100);

    this.$parent.css({ width: '100px', height: '110px', display: 'none' });
    this.$element.css({ width: '40px', height: '50px', padding: '10px', 'box-sizing': 'border-box' });
    assert.equal(getWidth(this.$element[0]), 20);
    assert.equal(getHeight(this.$element[0]), 30);
});

QUnit.test('element is not in a DOM', function(assert) {
    this.$freeElement = $('<div/>');

    const expected = [
        { width: 0, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 50 },
        { width: 0, height: 0 },
        { width: 0, height: 0 }
    ];

    for(let i = 0; i < testStyles.length; i++) {
        this.$freeElement.css(testStyles[i]);
        assert.equal(getWidth(this.$freeElement[0]), expected[i].width);
        assert.equal(getHeight(this.$freeElement[0]), expected[i].height);

        this.$freeElement.css({ ...testStyles[i], display: 'none' });
        assert.equal(getWidth(this.$freeElement[0]), expected[i].width);
        assert.equal(getHeight(this.$freeElement[0]), expected[i].height);

        this.$freeElement.css({ ...testStyles[i], 'box-sizing': 'border-box' });
        assert.equal(getWidth(this.$freeElement[0]), expected[i].width);
        assert.equal(getHeight(this.$freeElement[0]), expected[i].height);
    }
});


QUnit.module('getElementBoxParams');

QUnit.test('element in parent with fixed size', function(assert) {
    const $element = $('<div>').appendTo('#qunit-fixture');
    const element = $element.get(0);

    $element.css({ width: '40px', height: '50px', border: '1px solid black', padding: '3px 4px', margin: '5px 6px' });

    const computedStyles = window.getComputedStyle(element);

    assert.deepEqual(sizeUtils.getElementBoxParams('width', computedStyles), {
        border: 2,
        margin: 12,
        padding: 8
    }, 'element borders, paddings and margins were computed correctly');

    assert.deepEqual(sizeUtils.getElementBoxParams('height', computedStyles), {
        border: 2,
        margin: 10,
        padding: 6
    }, 'element borders, paddings and margins were computed correctly');
});


QUnit.module('calculate height', {
    beforeEach: function() {
        this.container = $('<div>')
            .css({ width: '100px', height: '100px', padding: '10px', 'box-sizing': 'border-box', margin: '5px' })
            .appendTo('#qunit-fixture')
            .get(0);
        this.invisibleElement = $('<div>')
            .css({ width: '50px', height: '50px', display: 'none', padding: '5px' })
            .get(0);
        $(this.container).append(this.invisibleElement);
    }
});

QUnit.test('check addOffsetToMaxHeight', function(assert) {
    const checkFunc = ({ value, offset, container }, expected) => {
        assert.strictEqual(sizeUtils.addOffsetToMaxHeight(value, offset, container), expected);
    };

    checkFunc({ value: 300, offset: 0, container: null }, 300);
    checkFunc({ value: 300, offset: -100, container: null }, 200);
    checkFunc({ value: '300', offset: -100, container: null }, 200);
    checkFunc({ value: '300px', offset: -100, container: null }, 200);
    checkFunc({ value: '100mm', offset: -50, container: null }, 'calc(100mm - 50px)');
    checkFunc({ value: '100pt', offset: -50, container: null }, 'calc(100pt - 50px)');
    checkFunc({ value: 'auto', offset: -50, container: null }, 'none');
    checkFunc({ value: 'auto', offset: 0, container: null }, 'auto');
    checkFunc({ value: null, offset: -50, container: null }, 'none');

    assert.roughEqual(sizeUtils.addOffsetToMaxHeight('50%', -20, window), windowHeight / 2 - 20, 1, 'string value in percent');
    assert.roughEqual(sizeUtils.addOffsetToMaxHeight('50%', -20, this.container), 30, 1, 'string value in percent with specific container');
});

QUnit.test('check addOffsetToMinHeight', function(assert) {
    const checkFunc = ({ value, offset, container }, expected) => {
        assert.strictEqual(sizeUtils.addOffsetToMinHeight(value, offset, container), expected);
    };

    checkFunc({ value: 300, offset: 0, container: null }, 300);
    checkFunc({ value: 300, offset: -100, container: null }, 200);
    checkFunc({ value: '300', offset: -100, container: null }, 200);
    checkFunc({ value: '300px', offset: -100, container: null }, 200);
    checkFunc({ value: '100mm', offset: -50, container: null }, 'calc(100mm - 50px)');
    checkFunc({ value: '100pt', offset: -50, container: null }, 'calc(100pt - 50px)');
    checkFunc({ value: 'auto', offset: -50, container: null }, 0);
    checkFunc({ value: 'auto', offset: 0, container: null }, 'auto');
    checkFunc({ value: null, offset: -50, container: null }, 0);

    assert.roughEqual(sizeUtils.addOffsetToMinHeight('50%', -20, window), windowHeight / 2 - 20, 1, 'string value in percent');
    assert.roughEqual(sizeUtils.addOffsetToMaxHeight('50%', -20, this.container), 30, 1, 'string value in percent with specific container');
});

QUnit.test('check getVerticalOffsets', function(assert) {
    assert.strictEqual(sizeUtils.getVerticalOffsets(null), 0, 'no element');
    assert.strictEqual(sizeUtils.getVerticalOffsets(this.container), 20, 'container paddings');
    assert.strictEqual(sizeUtils.getVerticalOffsets(this.container, true), 30, 'include margins');
    assert.strictEqual(sizeUtils.getVerticalOffsets(this.invisibleElement), 10, 'invisible element paddings');
});

QUnit.test('check getVisibleHeight', function(assert) {
    assert.strictEqual(sizeUtils.getVerticalOffsets(null), 0, 'no element');
    assert.strictEqual(sizeUtils.getVisibleHeight(this.container), 100, 'container height');
    assert.strictEqual(sizeUtils.getVisibleHeight(this.invisibleElement), 0, 'invisible element height');
});

QUnit.test('height for element with transform', function(assert) {
    const $root = $('<div>')
        .css({ transform: 'scale(1.5)', width: '100px', height: '110px' })
        .appendTo('#qunit-fixture')
        .get(0);
    const $child = $('<div/>')
        .css({ height: '40px', display: 'inline-block' })
        .appendTo($root)
        .get(0);
    const jqHeight = $($child).height();
    const dxHeight = getHeight($child);
    assert.strictEqual(dxHeight, jqHeight, 'getHeight should be equal to $.height');
});

QUnit.test('size helpers should return the same value as jquery. Params: (box-sizing: border-box; overflow: hidden)', function(assert) {
    const $target = $('<div/>')
        .css({
            height: '40px',
            width: '50px',
            padding: '3px',
            margin: '7px',
            border: '9px solid black',
            display: 'inline-block',
            'box-sizing': 'border-box',
            overflow: 'hidden'
        })
        .appendTo('#qunit-fixture')
        .get(0);

    $('<div>')
        .css({ width: '100px', height: '100px' })
        .appendTo($target);

    assert.strictEqual(getHeight($target), 16, 'getHeight');
    assert.strictEqual(getWidth($target), 26, 'getWidth');

    assert.strictEqual(getInnerHeight($target), 22, 'getInnerHeight');
    assert.strictEqual(getInnerWidth($target), 32, 'getInnerWidth');

    assert.strictEqual(getOuterHeight($target), 40, 'getOuterHeight');
    assert.strictEqual(getOuterWidth($target), 50, 'getOuterWidth');

    assert.strictEqual(getOuterHeight($target, true), 54, 'getOuterHeight(true)');
    assert.strictEqual(getOuterWidth($target, true), 64, 'getOuterWidth(true)');
});

QUnit.test('size helpers should return the same value as jquery. Params: (box-sizing: border-box; overflow: auto)', function(assert) {
    const $target = $('<div/>')
        .css({
            height: '40px',
            width: '50px',
            padding: '3px',
            margin: '7px',
            border: '9px solid black',
            display: 'inline-block',
            'box-sizing': 'border-box',
            overflow: 'auto'
        })
        .appendTo('#qunit-fixture')
        .get(0);

    $('<div>')
        .css({ width: '100px', height: '100px' })
        .appendTo($target);

    assert.strictEqual(getHeight($target), 16, 'getHeight');
    assert.strictEqual(getWidth($target), 26, 'getWidth');

    assert.strictEqual(getInnerHeight($target), 22, 'getInnerHeight');
    assert.strictEqual(getInnerWidth($target), 32, 'getInnerWidth');

    assert.strictEqual(getOuterHeight($target), 40, 'getOuterHeight');
    assert.strictEqual(getOuterWidth($target), 50, 'getOuterWidth');

    assert.strictEqual(getOuterHeight($target, true), 54, 'getOuterHeight(true)');
    assert.strictEqual(getOuterWidth($target, true), 64, 'getOuterWidth(true)');

});

QUnit.test('size helpers should return the same value as jquery. Params: (box-sizing: content-box, overflow: hidden)', function(assert) {
    const $target = $('<div/>')
        .css({
            height: '40px',
            width: '50px',
            padding: '3px',
            margin: '7px',
            border: '9px solid black',
            display: 'inline-block',
            'box-sizing': 'content-box',
            overflow: 'hidden'
        })
        .appendTo('#qunit-fixture')
        .get(0);

    $('<div>')
        .css({ width: '100px', height: '100px' })
        .appendTo($target);

    assert.strictEqual(getHeight($target), 40, 'getHeight');
    assert.strictEqual(getWidth($target), 50, 'getWidth');

    assert.strictEqual(getInnerHeight($target), 46, 'getInnerHeight');
    assert.strictEqual(getInnerWidth($target), 56, 'getInnerWidth');

    assert.strictEqual(getOuterHeight($target), 64, 'getOuterHeight');
    assert.strictEqual(getOuterWidth($target), 74, 'getOuterWidth');

    assert.strictEqual(getOuterHeight($target, true), 78, 'getOuterHeight(true)');
    assert.strictEqual(getOuterWidth($target, true), 88, 'getOuterWidth(true)');
});

QUnit.test('height helpers should return the same value as jquery. Params: (box-sizing: content-box, overflow: auto)', function(assert) {
    const $target = $('<div/>')
        .css({
            height: '40px',
            width: '50px',
            padding: '3px',
            margin: '7px',
            border: '9px solid black',
            display: 'inline-block',
            'box-sizing': 'content-box',
            overflow: 'auto'
        })
        .appendTo('#qunit-fixture')
        .get(0);

    $('<div>')
        .css({ width: '100px', height: '100px' })
        .appendTo($target);

    const scrollbarThickness = getScrollbarThickness();

    assert.strictEqual(getHeight($target), 40 - scrollbarThickness, 'getHeight');
    assert.strictEqual(getWidth($target), 50 - scrollbarThickness, 'getWidth');

    assert.strictEqual(getInnerHeight($target), 46, 'getInnerHeight');
    assert.strictEqual(getInnerWidth($target), 56, 'getInnerWidth');

    assert.strictEqual(getOuterHeight($target), 64, 'getOuterHeight');
    assert.strictEqual(getOuterWidth($target), 74, 'getOuterWidth');

    // jQuery produces incorrect result for some reason. You can try it with the following markup:
    // <div id="qunit-fixture" style="border: 7px solid red;padding: 0;display: inline-block;font-size: 0px;letter-spacing: 0px;word-spacing: 0px;"><div id="test" style="height: 40px;width: 50px;padding: 3px;margin: 7px;border: 9px solid black;display: inline-block;font-size: 0px;letter-spacing: 0px;word-spacing: 0px;box-sizing: content-box;overflow: auto;"><div style="width: 100px; height: 100px"></div></div></div>
    // Paste to a html document, open the DevTools and select outer element (#qunit-fixture). In the boxes view you can see that content size is 78x88

    assert.strictEqual(getOuterHeight($target, true), 78, 'getOuterHeight(true)');
    assert.strictEqual(getOuterWidth($target, true), 88, 'getOuterWidth(true)');
});
