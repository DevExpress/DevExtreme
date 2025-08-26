import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import { ScrollBar } from 'viz/chart_components/scroll_bar';
import translator2DModule from 'viz/translators/translator2d';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'common/core/events/drag';

const Translator = vizMocks.stubClass(translator2DModule.Translator2D);

const canvas = {
    top: 10,
    bottom: 15,
    left: 20,
    right: 25,
    width: 600,
    height: 400
};
const range = {
    min: 10,
    max: 100,
    minVisible: 30,
    maxVisible: 90,
    categories: [],
    visibleCategories: [],
    inverted: true
};
const environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        this.group = this.renderer.g();

        sinon.stub(translator2DModule, 'Translator2D').callsFake(function() {
            const stub = new Translator();
            stub.getScale = sinon.stub().returns(1);
            stub.stub('getCanvasVisibleArea');
            return stub;
        });

        this.options = {
            rotated: false,
            color: 'fill',
            width: 10,
            offset: 5,
            opacity: 0.5,
            visible: true
        };
    },

    afterEach: function() {
        this.renderer.dispose();
        this.renderer = null;
        this.options = null;
        translator2DModule.Translator2D.restore();
    }

};

QUnit.module('_applyPosition method tests', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.group = new vizMocks.Element();
        this.scrollBar = new ScrollBar(this.renderer, this.group);
        this.scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;
    },
    afterEach: function() {
        environment.afterEach.call(this);
    }
}, () => {
    QUnit.test('No visible area available (max <= min)', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 50,
            max: 50
        });

        this.scrollBar._applyPosition(10, 90);

        assert.ok(!this.group.children[0].attr.called, 'no attributes set when no visible area');
    });

    QUnit.test('x1 > x2, should swap coordinates', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(90, 30);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 30,
            height: 60
        }, 'coordinates swapped correctly');
    });

    QUnit.test('Extremely small scroll bar (x2 - x1 < MIN_SCROLL_BAR_SIZE) with center positioning', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(45, 47);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 41,
            height: 10
        }, 'min size applied and centered correctly');
    });

    QUnit.test('Minimum size with center near boundaries', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(12, 13);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 10
        }, 'min size applied and adjusted to min edge');

        this.scrollBar._applyPosition(97, 98);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 90,
            height: 10
        }, 'min size applied and adjusted to max edge');

        this.scrollBar._applyPosition(10, 15);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 10
        }, 'correctly handles minimum size at exact boundary');
    });

    QUnit.test('Small visible area (less than MIN_SCROLL_BAR_SIZE)', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 15
        });

        this.scrollBar._applyPosition(11, 13);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 5
        }, 'scrollbar takes entire available area');
    });

    QUnit.test('Position outside visible area (x1 < min, x2 > max)', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(5, 120);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 90
        }, 'scrollbar limited to visible area');
    });

    QUnit.test('Position partially outside visible area (x1 < min)', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(5, 50);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 40
        }, 'scrollbar x1 adjusted to min');
    });

    QUnit.test('Position partially outside visible area (x2 > max)', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(50, 120);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 50,
            height: 50
        }, 'scrollbar x2 adjusted to max');
    });

    QUnit.test('High zoom levels with small visible area', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 20
        });

        this.scrollBar._applyPosition(14, 15);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 10
        }, 'min size applied and adjusted within small visible area');
    });

    QUnit.test('Extreme case - zero height after calculations', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });
        this.group.children[0].attr = sinon.spy(function(settings) {
            this._stored_settings = settings;
            return this;
        });

        this.scrollBar._applyPosition(50, 50);

        assert.deepEqual(this.group.children[0]._stored_settings, {
            y: 45,
            height: 10
        }, 'height is set to MIN_SCROLL_BAR_SIZE and centered when positions are identical');
    });

    QUnit.test('Handle x2 < x1 after boundary adjustments', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 50,
            max: 60
        });

        this.scrollBar._applyPosition(100, 20);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 50,
            height: 10
        }, 'scrollbar corrected after boundary adjustments');
    });

    QUnit.test('Negative coordinates', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: -50,
            max: 50
        });

        this.scrollBar._applyPosition(-30, -10);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: -30,
            height: 20
        }, 'correctly handles negative coordinates within bounds');
    });

    QUnit.test('Negative and positive coordinates', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: -50,
            max: 50
        });

        this.scrollBar._applyPosition(-30, 20);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: -30,
            height: 50
        }, 'correctly handles mix of negative and positive coordinates');
    });

    QUnit.test('Extremely large coordinates outside boundaries', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 100
        });

        this.scrollBar._applyPosition(-10000, 10000);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 0,
            height: 100
        }, 'limits extremely large coordinates to visible area');
    });

    QUnit.test('Transition from no visible area to visible area', function(assert) {
        const scrollBar = this.scrollBar;
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub();

        // First, no visible area
        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 50,
            max: 50
        });

        scrollBar._applyPosition(10, 90);
        assert.ok(!this.group.children[0].attr.called, 'no attributes set when no visible area');

        // Then visible area appears
        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 10,
            max: 100
        });

        scrollBar._applyPosition(40, 60);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 40,
            height: 20
        }, 'correctly transitions from no visible area to visible area');
    });

    QUnit.test('ScrollBar natural size enforcement scenarios', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(45, 48);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 41.5,
            height: 10
        }, '3 pixel natural size limited to minimum');

        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 0,
            max: 200
        });

        this.scrollBar._applyPosition(100, 101);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 95.5,
            height: 10
        }, '1 pixel natural size enforced to minimum');

        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(50, 50);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 45,
            height: 10
        }, 'zero natural size enforced to minimum');

        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 0,
            max: 1000
        });

        this.scrollBar._applyPosition(500, 500.5);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 495.25,
            height: 10
        }, 'fractional natural size enforced to minimum');

        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 0,
            max: 100
        });

        this.scrollBar._applyPosition(40, 50);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 40,
            height: 10
        }, 'natural size exactly equal to minimum works correctly');
    });

    QUnit.test('Minimum size scrollbar at boundary edge cases', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 20
        });

        this.scrollBar._applyPosition(2, 3);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 0,
            height: 10
        }, 'minimum size scrollbar properly adjusted when too close to min edge');

        this.scrollBar._applyPosition(17, 18);
        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 10,
            height: 10
        }, 'minimum size scrollbar properly adjusted when too close to max edge');
    });

    QUnit.test('Invalid coordinates with NaN should be handled gracefully', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(NaN, 50);

        assert.ok(this.group.children[0].attr.called, 'method executes without crashing when NaN coordinates provided');
    });

    QUnit.test('Coordinates with Infinity should be handled gracefully', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 10,
            max: 100
        });

        this.scrollBar._applyPosition(Infinity, 50);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 50,
            height: 50
        }, 'Infinity coordinates handled by existing Math operations');
    });

    QUnit.test('High zoom level creates tiny natural size but enforces minimum', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 500
        });

        this.scrollBar._applyPosition(249, 251);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 245,
            height: 10
        }, 'high zoom level tiny size enforced to minimum');
    });

    QUnit.test('Very large minimum size enforcement in tiny visible area', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 5,
            max: 8
        });

        this.scrollBar._applyPosition(6, 7);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 5,
            height: 3
        }, 'when visible area smaller than min size, uses full available space');
    });

    QUnit.test('Edge case: visible area exactly equals MIN_SCROLL_BAR_SIZE', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 10
        });

        this.scrollBar._applyPosition(4, 5);

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 0,
            height: 10
        }, 'when visible area equals min size, scrollbar fills entire area');
    });

    QUnit.test('Sequential calls with different sizes maintain minimum constraint', function(assert) {
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 200
        });

        this.scrollBar._applyPosition(50, 52);
        const firstCall = this.group.children[0].attr.lastCall.args[0];

        this.scrollBar._applyPosition(100, 100.5);
        const secondCall = this.group.children[0].attr.lastCall.args[0];

        assert.ok(firstCall.height >= 10, 'first call maintains minimum height: ' + firstCall.height);
        assert.ok(secondCall.height >= 10, 'second call maintains minimum height: ' + secondCall.height);
        assert.deepEqual(secondCall, {
            y: 95.25,
            height: 10
        }, 'sequential calls both enforce minimum size correctly');
    });
});

QUnit.module('ScrollBar integration tests', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.group = new vizMocks.Element();
        this.scrollBar = new ScrollBar(this.renderer, this.group);
        this.scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;
    },
    afterEach: function() {
        environment.afterEach.call(this);
    }
}, () => {
}, () => {
    QUnit.test('High zoom level integration with setPosition', function(assert) {
        this.scrollBar.update(this.options);

        this.scrollTranslator.translate = sinon.stub();
        this.scrollTranslator.translate.withArgs('99.9').returns(50);
        this.scrollTranslator.translate.withArgs('100').returns(50.1);
        this.scrollTranslator.getScale = sinon.stub().returns(100);
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 100
        });

        this.scrollBar.setPosition('99.9', '100');

        assert.deepEqual(this.group.children[0].attr.lastCall.args[0], {
            y: 45.05,
            height: 10
        }, 'applies minimum size at high zoom levels');
    });

    QUnit.test('Integration with drag events at high zoom levels', function(assert) {
        this.scrollBar.update(this.options);

        this.scrollTranslator.translate = sinon.stub();
        this.scrollTranslator.translate.withArgs('99.9').returns(45);
        this.scrollTranslator.translate.withArgs('100').returns(45.1);
        this.scrollTranslator.getScale = sinon.stub().returns(100);
        this.scrollTranslator.getCanvasVisibleArea = sinon.stub().returns({
            min: 0,
            max: 100
        });
        this.scrollTranslator.canvasLength = 100;

        this.scrollBar.setPosition('99.9', '100');

        this.scrollBar._offset = 45;

        this.scrollBar._applyPosition(40, 40.1);

        assert.ok(this.group.children[0].attr.called, 'scrollbar updated during drag');
        const lastCallArgs = this.group.children[0].attr.lastCall.args[0];
        assert.ok(lastCallArgs.height >= 10, 'minimum size maintained during drag: ' + lastCallArgs.height);
    });
});

QUnit.module('dxChart scrollBar', environment);

QUnit.test('create scrollBar', function(assert) {
    const group = new vizMocks.Element();
    // act
    const scrollBar = new ScrollBar(this.renderer, group);
    // assert
    assert.ok(scrollBar);
    assert.ok(translator2DModule.Translator2D.calledOnce);
    assert.deepEqual(translator2DModule.Translator2D.lastCall.args, [{}, {}, {}]);

    assert.equal(this.renderer.rect.callCount, 1);
    assert.deepEqual(this.renderer.rect.firstCall.args, []);

    assert.equal(group.children.length, 1);
    assert.equal(group.children[0].typeOfNode, 'rect');
});

QUnit.test('init scrollBar', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    scrollBar.update(this.options).updateSize(canvas);
    // act
    scrollBar.init(range, false);
    // Assert
    assert.ok(translator2DModule.Translator2D.calledOnce);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    assert.ok(scrollTranslator.update.calledOnce);

    assert.deepEqual(scrollTranslator.update.lastCall.args, [{
        categories: [],
        inverted: true,
        max: 100,
        maxVisible: null,
        min: 10,
        minVisible: null,
        visibleCategories: null
    }, canvas, {
        isHorizontal: true,
        stick: false
    }]
    );
});

QUnit.test('init scrollBar. Rotated', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    this.options.rotated = true;
    scrollBar.update(this.options).updateSize(canvas);
    // act
    scrollBar.init(range, false);
    // Assert
    assert.ok(translator2DModule.Translator2D.calledOnce);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    assert.ok(scrollTranslator.update.calledOnce);

    assert.deepEqual(scrollTranslator.update.lastCall.args, [{
        categories: [],
        inverted: true,
        max: 100,
        maxVisible: null,
        min: 10,
        minVisible: null,
        visibleCategories: null
    }, canvas, {
        isHorizontal: false,
        stick: false
    }]
    );
});

QUnit.test('init scrollBar. Remove min and max ', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const discreteRange = $.extend({}, range, { axisType: 'discrete' });
    scrollBar.update(this.options).updateSize(canvas);

    // act
    scrollBar.init(discreteRange, false);
    // Assert
    assert.ok(translator2DModule.Translator2D.calledOnce);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    assert.ok(scrollTranslator.update.calledOnce);

    assert.deepEqual(scrollTranslator.update.lastCall.args, [{
        categories: [],
        inverted: true,
        max: null,
        maxVisible: null,
        min: null,
        minVisible: null,
        visibleCategories: null,
        axisType: 'discrete'
    }, canvas, {
        isHorizontal: true,
        stick: false
    }]);
});

QUnit.test('update scrollBar', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    // act
    scrollBar.update(this.options);
    // Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        fill: 'fill',
        rotate: -90,
        rotateX: 0,
        rotateY: 0,
        width: 10,
        opacity: 0.5
    });

    assert.deepEqual(scrollBar.getOptions(), {
        offset: 5,
        vertical: false,
        position: 'top',
        width: 10
    });
});

QUnit.test('update scrollBar. Rotated', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    this.options.rotated = true;
    // act
    scrollBar.update(this.options);
    // Assert

    assert.deepEqual(group.children[0]._stored_settings, {
        fill: 'fill',
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 0.5,
        width: 10
    });
    assert.deepEqual(scrollBar.getOptions(), {
        offset: 5,
        vertical: true,
        position: 'right',
        width: 10
    });
});

QUnit.test('setPosition by arguments. Both arguments in range', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.withArgs('40').returns(45);
    scrollTranslator.translate.withArgs('70').returns(75);
    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '70');
    // Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 45,
        height: 30
    });
});

QUnit.test('setPosition by arguments. Discrete axis. stick false', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range, {
        axisType: 'discrete'
    }), false);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs('40', -1).returns(40);
    scrollTranslator.translate.withArgs('40', +1).returns(50);
    scrollTranslator.translate.withArgs('40').returns(45);


    scrollTranslator.translate.withArgs('70', -1).returns(70);
    scrollTranslator.translate.withArgs('70', +1).returns(80);
    scrollTranslator.translate.withArgs('70').returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '70');
    // Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 40,
        height: 40
    });
});

QUnit.test('setPosition by arguments. Discrete axis. stick true', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range, {
        axisType: 'discrete'
    }), true);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs('40', -1).returns(40);
    scrollTranslator.translate.withArgs('40', +1).returns(50);
    scrollTranslator.translate.withArgs('40').returns(45);


    scrollTranslator.translate.withArgs('70', -1).returns(70);
    scrollTranslator.translate.withArgs('70', +1).returns(80);
    scrollTranslator.translate.withArgs('70').returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '70');
    // Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 45,
        height: 30
    });
});

QUnit.test('setPosition by arguments. Stick false', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range), false);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs('40', -1).returns(40);
    scrollTranslator.translate.withArgs('40', +1).returns(50);
    scrollTranslator.translate.withArgs('40').returns(45);


    scrollTranslator.translate.withArgs('70', -1).returns(70);
    scrollTranslator.translate.withArgs('70', +1).returns(80);
    scrollTranslator.translate.withArgs('70').returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '70');
    // Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 45,
        height: 30
    });
});

QUnit.test('setPosition by arguments.Stick true', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range), true);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs('40', -1).returns(40);
    scrollTranslator.translate.withArgs('40', +1).returns(50);
    scrollTranslator.translate.withArgs('40').returns(45);


    scrollTranslator.translate.withArgs('70', -1).returns(70);
    scrollTranslator.translate.withArgs('70', +1).returns(80);
    scrollTranslator.translate.withArgs('70').returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '70');
    // Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 45,
        height: 30
    });
});

QUnit.test('setPosition by arguments. Both arguments are undefined', function(assert) {

    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs('canvas_position_start').returns(10);
    scrollTranslator.translate.withArgs('canvas_position_end').returns(100);
    scrollTranslator.translate.returns(null);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });

    // act
    scrollBar.setPosition(undefined, undefined);
    // Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10,
        height: 90
    });
});

QUnit.test('setPosition by arguments. Both arguments out of canvas', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.translate.withArgs('40').returns(5);
    scrollTranslator.translate.withArgs('70').returns(110);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });

    // act
    scrollBar.setPosition('40', '70');
    // Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10,
        height: 90
    });
});

QUnit.test('setPosition by arguments. min = max', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.withArgs('40').returns(45);
    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '40');
    // Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 40,
        height: 10
    });
});

QUnit.test('setPosition by arguments. minSize', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.withArgs('40').returns(45);
    scrollTranslator.translate.withArgs('41').returns(46.9);
    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    // act
    scrollBar.setPosition('40', '41');
    // Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 40.95,
        height: 10
    });
});

QUnit.test('Disposing', function(assert) {
    const group = new vizMocks.Element();
    const scrollBar = new ScrollBar(this.renderer, group);
    const element = group.children[0];
    // act
    scrollBar.dispose();
    // Assert
    assert.ok(!this.renderer.stub('dispose').called);

    assert.ok(!group.children.length);
    assert.ok(element.dispose.called);
});

QUnit.module('Scroll moving', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.group = new vizMocks.Element();
        this.scrollBar = new ScrollBar(this.renderer, this.group).update(this.options);

        this.scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;
        this.scrollTranslator.translate = sinon.stub();
        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 10,
            max: 100
        });
        this.scrollTranslator.canvasLength = 90;

        this.startEventsHandler = sinon.spy();
        this.moveEventsHandler = sinon.spy();
        this.endEventsHandler = sinon.spy();

        $(this.group.children[0].element).on('dxc-scroll-start', this.startEventsHandler);
        $(this.group.children[0].element).on('dxc-scroll-move', this.moveEventsHandler);
        $(this.group.children[0].element).on('dxc-scroll-end', this.endEventsHandler);

        this.pointer = pointerMock(this.group.children[0].element);
    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.scrollBar.dispose();
        this.scrollBar = null;
        $(this.group.element).removeData();
        this.group = null;
        this.scrollTranslator = null;

        this.startEventsHandler = null;
        this.moveEventsHandler = null;
        this.endEventsHandler = null;
    }
});

QUnit.test('pointer down on scroll', function(assert) {
    this.pointer.start({ x: 100, y: 200 }).dragStart();

    assert.ok(this.startEventsHandler.calledOnce);
    assert.deepEqual(this.startEventsHandler.firstCall.args[0].originalEvent.type, dragEvents.start);
});

QUnit.test('move scroll when scale = 1', function(assert) {
    this.scrollTranslator.translate.withArgs(40).returns(10);
    this.scrollTranslator.translate.withArgs(70).returns(100);

    this.scrollBar.setPosition(40, 70);
    // act
    this.pointer.start({ x: 100, y: 200 }).dragStart().drag(-70, -130).drag(-50, -150);
    // assert
    assert.ok(this.startEventsHandler.calledOnce);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].originalEvent.type, dragEvents.move);
    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].offset, {
        x: -30,
        y: -70
    });
    assert.deepEqual(this.moveEventsHandler.lastCall.args[0].offset, {
        x: 20,
        y: 80
    });

    assert.equal(this.moveEventsHandler.callCount, 2);

    assert.equal(this.group.children[0]._stored_settings.height, 70);
    assert.equal(this.group.children[0]._stored_settings.y, 10);
});

QUnit.test('move scroll when scale != 1', function(assert) {
    this.scrollTranslator.translate.withArgs(40).returns(30);
    this.scrollTranslator.translate.withArgs(70).returns(75);
    this.scrollTranslator.getScale.withArgs(40, 70).returns(2);

    this.scrollBar.setPosition(40, 70);
    // act
    this.pointer.start({ x: 100, y: 200 }).dragStart().drag(-70, -130).drag(-50, -150);
    // assert
    assert.ok(this.startEventsHandler.calledOnce);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].offset, {
        x: -60,
        y: -140
    });
    assert.deepEqual(this.moveEventsHandler.lastCall.args[0].offset, {
        x: 40,
        y: 160
    });

    assert.equal(this.moveEventsHandler.callCount, 2);

    assert.equal(this.group.children[0]._stored_settings.height, 45);
    assert.equal(this.group.children[0]._stored_settings.y, 10);
});

QUnit.test('move scroll when scale != 1. Rotated', function(assert) {
    this.options.rotated = true;
    this.scrollBar.update(this.options);
    this.scrollTranslator.translate.withArgs(40).returns(30);
    this.scrollTranslator.translate.withArgs(70).returns(75);
    this.scrollTranslator.getScale.withArgs(40, 70).returns(2);

    this.scrollBar.setPosition(40, 70);
    // act
    this.pointer.start({ x: 200, y: 100 }).dragStart().drag(-130, -70).drag(-150, -50);
    // assert
    assert.ok(this.startEventsHandler.calledOnce);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].offset, {
        x: -140,
        y: -60
    });
    assert.deepEqual(this.moveEventsHandler.lastCall.args[0].offset, {
        x: 160,
        y: 40
    });

    assert.equal(this.moveEventsHandler.callCount, 2);

    assert.equal(this.group.children[0]._stored_settings.height, 45);
    assert.equal(this.group.children[0]._stored_settings.y, 10);
});

QUnit.test('Fire scrollEnd event on dragend', function(assert) {
    this.scrollTranslator.translate.withArgs(40).returns(10);
    this.scrollTranslator.translate.withArgs(70).returns(100);

    this.scrollBar.setPosition(40, 70);
    this.pointer.start({ x: 100, y: 200 }).dragStart().drag(-70, -130).dragEnd();

    // assert
    assert.ok(this.moveEventsHandler.calledOnce);
    assert.ok(this.endEventsHandler.calledOnce);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].offset, {
        x: -30,
        y: -70
    });

    assert.deepEqual(this.endEventsHandler.firstCall.args[0].offset, {
        x: -30,
        y: -70
    });

    assert.deepEqual(this.endEventsHandler.firstCall.args[0].originalEvent.type, dragEvents.end);
});

QUnit.module('scrollBar layouting', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.getOptions = function(options) {
            return $.extend(true, {}, this.options, options);
        };
        this.panes = [{ name: 'pane1', canvas: { left: 10, top: 100, right: 15, bottom: 150, width: 20, height: 200 } },
            { name: 'pane2', canvas: { left: 70, right: 75, bottom: 350, top: 700, width: 80, height: 800 } }];
    },
    afterEach: function() {
        environment.afterEach.call(this);
    }
});

QUnit.test('Set position for horizontal scrollBar', function(assert) {
    const scrollBar = new ScrollBar(this.renderer, this.group);
    // act
    const pos1 = scrollBar.update(this.getOptions({})).getOptions().position;
    const pos2 = scrollBar.update(this.getOptions({ position: 'top' })).getOptions().position;
    const pos3 = scrollBar.update(this.getOptions({ position: 'bottom' })).getOptions().position;
    const pos4 = scrollBar.update(this.getOptions({ position: 'left' })).getOptions().position;
    const pos5 = scrollBar.update(this.getOptions({ position: 'right' })).getOptions().position;
    const pos6 = scrollBar.update(this.getOptions({ position: 'invalid' })).getOptions().position;

    // Assert
    assert.strictEqual(pos1, 'top');
    assert.strictEqual(pos2, 'top');
    assert.strictEqual(pos3, 'bottom');
    assert.strictEqual(pos4, 'top');
    assert.strictEqual(pos5, 'top');
    assert.strictEqual(pos6, 'top');
});

QUnit.test('Set position for vertical scrollBar', function(assert) {
    this.options.rotated = true;
    const scrollBar = new ScrollBar(this.renderer, this.group);
    // act
    const pos1 = scrollBar.update(this.getOptions({})).getOptions().position;
    const pos2 = scrollBar.update(this.getOptions({ position: 'top' })).getOptions().position;
    const pos3 = scrollBar.update(this.getOptions({ position: 'bottom' })).getOptions().position;
    const pos4 = scrollBar.update(this.getOptions({ position: 'left' })).getOptions().position;
    const pos5 = scrollBar.update(this.getOptions({ position: 'right' })).getOptions().position;
    const pos6 = scrollBar.update(this.getOptions({ position: 'invalid' })).getOptions().position;

    // Assert
    assert.strictEqual(pos1, 'right');
    assert.strictEqual(pos2, 'right');
    assert.strictEqual(pos3, 'right');
    assert.strictEqual(pos4, 'left');
    assert.strictEqual(pos5, 'right');
    assert.strictEqual(pos6, 'right');
});

QUnit.test('setPane', function(assert) {
    const scrollBar = new ScrollBar(this.renderer, this.group);

    const p1 = scrollBar.update(this.getOptions({ position: 'top' })).setPane(this.panes).pane;
    const p2 = scrollBar.update(this.getOptions({ position: 'bottom' })).setPane(this.panes).pane;

    assert.strictEqual(p1, 'pane1');
    assert.strictEqual(p2, 'pane2');
});

QUnit.test('setPane. Rotated', function(assert) {
    this.options.rotated = true;
    const scrollBar = new ScrollBar(this.renderer, this.group);

    const p1 = scrollBar.update(this.getOptions({ position: 'left' })).setPane(this.panes).pane;
    const p2 = scrollBar.update(this.getOptions({ position: 'right' })).setPane(this.panes).pane;

    assert.strictEqual(p1, 'pane1');
    assert.strictEqual(p2, 'pane2');
});

QUnit.test('getMargins', function(assert) {
    const scrollBar = new ScrollBar(this.renderer, this.group);
    const pane = {
        name: 'testPane'
    };
    const b1 = scrollBar.update(this.getOptions({ position: 'top' })).setPane([pane]).getMargins();
    const b2 = scrollBar.update(this.getOptions({ position: 'bottom' })).setPane([pane]).getMargins();

    assert.deepEqual(b1, {
        top: 15,
        bottom: 0,
        left: 0,
        right: 0
    }, 'top scrollBar');
    assert.deepEqual(b2, {
        top: 0,
        bottom: 15,
        left: 0,
        right: 0
    }, 'bottom scrollBar');
});

QUnit.test('getMargins. Rotated', function(assert) {
    this.options.rotated = true;
    const scrollBar = new ScrollBar(this.renderer, this.group);
    const pane = {
        name: 'testPane'
    };
    const b1 = scrollBar.update(this.getOptions({ position: 'right' })).setPane([pane]).getMargins();
    const b2 = scrollBar.update(this.getOptions({ position: 'left' })).setPane([pane]).getMargins();

    assert.deepEqual(b1, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 15
    }, 'top scrollBar');
    assert.deepEqual(b2, {
        top: 0,
        bottom: 0,
        left: 15,
        right: 0
    }, 'bottom scrollBar');
});

QUnit.test('UpdateSize', function(assert) {
    const scrollBar = new ScrollBar(this.renderer, this.group);

    scrollBar.update(this.getOptions({ position: 'top' })).setPane(this.panes).updateSize(this.panes[0].canvas);
    scrollBar.update(this.getOptions({ position: 'bottom' })).setPane(this.panes).updateSize(this.panes[1].canvas);

    assert.deepEqual(this.group.children[0].attr.getCall(1).args, [{
        translateX: 0,
        translateY: 95
    }], 'top scrollBar');

    assert.deepEqual(this.group.children[0].attr.getCall(3).args, [{
        translateX: 0,
        translateY: 465
    }], 'top scrollBar');
});

QUnit.test('Apply layout. Rotated', function(assert) {
    this.options.rotated = true;
    const scrollBar = new ScrollBar(this.renderer, this.group);

    scrollBar.update(this.getOptions({ position: 'right' })).setPane(this.panes).updateSize(this.panes[1].canvas);
    scrollBar.update(this.getOptions({ position: 'left' })).setPane(this.panes).updateSize(this.panes[0].canvas);

    assert.deepEqual(this.group.children[0].attr.getCall(1).args, [{
        translateX: 10,
        translateY: 0
    }], 'right scrollBar');

    assert.deepEqual(this.group.children[0].attr.getCall(3).args, [{
        translateX: -5,
        translateY: 0
    }], 'left scrollBar');
});

QUnit.test('getMultipleAxesSpacing', function(assert) {
    this.options.rotated = true;
    const scrollBar = new ScrollBar(this.renderer, this.group);
    // act
    const res = scrollBar.getMultipleAxesSpacing();

    assert.strictEqual(res, 0);
});
