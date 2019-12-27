import $ from 'jquery';
import sizeUtils from 'core/utils/size';

const testStyles = [
    '',
    'width: 40px; height: 50px;',
    'width: 50%; height: 50%;',
    'width: inherit; height: inherit;',
    'width: auto; height: auto;'
];

const windowHeight = $(window).height();

QUnit.module('get width and height', {
    beforeEach: function() {
        this.$parent = $('<div style=\'width: 100px; height: 110px\'></div>').appendTo('#qunit-fixture');
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
        this.$element.attr('style', testStyles[i]);
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }
});

QUnit.test('invisible element in parent with fixed size', function(assert) {
    const that = this;

    const testParams = [{
        style: 'display: none;',
        width: 0,
        height: 0
    }, {
        style: 'width: 40px; height: 50px; display: none;',
        width: 40,
        height: 50
    }, {
        style: 'width: inherit; height: inherit; display: none;',
        width: 100,
        height: 110
    }, {
        style: 'width: auto; height: auto; display: none;',
        width: 0,
        height: 0
    }];

    testParams.forEach(function(params) {
        that.$element.attr('style', params.style);
        assert.equal(sizeUtils.getSize(that.$element[0], 'width', {}), params.width);
        assert.equal(sizeUtils.getSize(that.$element[0], 'height', {}), params.height);
    });
});

QUnit.test('element with padding, marging, border without params', function(assert) {
    let expected; let i;

    expected = [
        { width: 80, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr('style', testStyles[i] + ' padding: 10px;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);

        this.$element.attr('style', testStyles[i] + ' margin: 10px;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }

    expected = [
        { width: 96, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 96, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr('style', testStyles[i] + ' border: 2px solid black;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }
});

QUnit.test('element with padding, marging, border with params', function(assert) {
    this.$element.attr('style', 'width: 40px; height: 50px; padding: 5px; margin: 10px; border: 2px solid black;');

    assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), 40);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), 50);

    assert.equal(sizeUtils.getSize(this.$element[0], 'width', { paddings: true }), 50);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', { paddings: true }), 60);

    assert.equal(sizeUtils.getSize(this.$element[0], 'width', { borders: true }), 44);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', { borders: true }), 54);

    assert.equal(sizeUtils.getSize(this.$element[0], 'width', { borders: true, margins: true }), 64);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', { borders: true, margins: true }), 74);

    assert.equal(sizeUtils.getSize(this.$element[0], 'width', { paddings: true, borders: true, margins: true }), 74);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', { paddings: true, borders: true, margins: true }), 84);
});

QUnit.test('element with box-sizing = border-box', function(assert) {
    let expected; let i;

    expected = [
        { width: 100, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 100, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr('style', testStyles[i] + ' box-sizing: border-box;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }

    expected = [
        { width: 80, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr('style', testStyles[i] + ' margin: 10px; box-sizing: border-box;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }

    expected = [
        { width: 80, height: 0 },
        { width: 20, height: 30 },
        { width: 30, height: 35 },
        { width: 80, height: 90 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr('style', testStyles[i] + ' padding: 10px; box-sizing: border-box;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }

    expected = [
        { width: 96, height: 0 },
        { width: 36, height: 46 },
        { width: 46, height: 51 },
        { width: 96, height: 106 },
        { width: 96, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr('style', testStyles[i] + ' border: 2px solid black; box-sizing: border-box;');
        assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), expected[i].height);
    }
});

QUnit.test('element with box-sizing = border-box and parent is invisible', function(assert) {
    this.$parent.attr('style', 'width: 100px; height: 110px; display: none;');
    this.$element.attr('style', 'width: 100%; height: 100%; box-sizing: border-box;');
    assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), 100);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), 100);

    this.$parent.attr('style', 'width: 100px; height: 110px; display: none;');
    this.$element.attr('style', 'width: 100%; height: 100%; padding: 10px; box-sizing: border-box;');
    assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), 100);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), 100);

    this.$parent.attr('style', 'width: 100px; height: 110px; display: none;');
    this.$element.attr('style', 'width: 40px; height: 50px; padding: 10px; box-sizing: border-box;');
    assert.equal(sizeUtils.getSize(this.$element[0], 'width', {}), 20);
    assert.equal(sizeUtils.getSize(this.$element[0], 'height', {}), 30);
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
        this.$freeElement.attr('style', testStyles[i]);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], 'height', {}), expected[i].height);

        this.$freeElement.attr('style', testStyles[i] + ' display: none;');
        assert.equal(sizeUtils.getSize(this.$freeElement[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], 'height', {}), expected[i].height);

        this.$freeElement.attr('style', testStyles[i] + ' box-sizing: border-box;');
        assert.equal(sizeUtils.getSize(this.$freeElement[0], 'width', {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], 'height', {}), expected[i].height);
    }
});


QUnit.module('getElementBoxParams');

QUnit.test('element in parent with fixed size', function(assert) {
    const $element = $('<div>').appendTo('#qunit-fixture');
    const element = $element.get(0);

    $element.attr('style', 'width: 40px; height: 50px; border: 1px solid black; padding: 3px 4px; margin: 5px 6px');

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
        this.container = $('<div style=\'width: 100px; height: 100px; padding: 10px; box-sizing: border-box; margin: 5px\'></div>').appendTo('#qunit-fixture').get(0);
        this.invisibleElement = $('<div style=\'width: 50px; height: 50px; display: none; padding: 5px;\'></div>').get(0);
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
