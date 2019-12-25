var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    dragEvents = require('events/drag'),
    pointerMock = require('../../helpers/pointerMock.js'),
    GestureEmitter = require('events/gesture/emitter.gesture.js');

require('common.css!');
require('ui/draggable');

QUnit.testStart(function() {
    var markup =
        '<div id="area" style="width: 300px; height: 250px; position: relative; background: green;">\
            <div style="width: 30px; height: 50px; background: yellow;" id="draggable"></div>\
        </div>\
        <div id="other"></div>';

    $('#qunit-fixture').html(markup);
});

var DRAGGABLE_CLASS = 'dx-draggable',
    DRAGGABLE_ACTION_TO_EVENT_MAP = {
        'onDragStart': dragEvents.start,
        'onDrag': dragEvents.move,
        'onDragEnd': dragEvents.end
    };

var moduleConfig = {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-visible');

        this.$element = $('#draggable');
        this.createDraggable = function(options) {
            return this.$element.dxDraggable(options).dxDraggable('instance');
        };
        this.pointer = pointerMock(this.$element).start();
        this.checkPosition = function(left, top, assert) {
            assert.deepEqual(this.$element.offset(), { left: left, top: top });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-visible');
    }
};


QUnit.module('rendering', moduleConfig);

QUnit.test('element has class', function(assert) {
    assert.ok(this.createDraggable().$element().hasClass(DRAGGABLE_CLASS));
});

QUnit.test('\'immediate\' option', function(assert) {
    this.createDraggable({ immediate: false });
    GestureEmitter.touchBoundary(10);

    try {
        this.pointer.down().move(5, 0).up();
    } finally {
        GestureEmitter.touchBoundary(0);
        this.checkPosition(0, 0, assert);
    }
});

QUnit.module('callbacks', moduleConfig);

$.each(DRAGGABLE_ACTION_TO_EVENT_MAP, function(callbackName, eventName) {
    var checkCallback = function(draggable, spy, assert) {
        assert.ok(spy.calledOnce, 'callback fired');

        var firstCall = spy.getCall(0),
            arg = firstCall.args[0],
            context = firstCall.thisValue;

        assert.strictEqual(context, draggable, 'context equals to component');
        assert.strictEqual(arg.component, draggable);
        assert.strictEqual($(arg.element)[0], this.$element[0]);
        assert.equal(arg.event.type, eventName);
    };

    QUnit.test('\'' + callbackName + '\' callback fired', function(assert) {
        var callbackSpy = sinon.spy(noop),
            options = {},
            draggable;

        options[callbackName] = callbackSpy;
        draggable = this.createDraggable(options);

        this.pointer.dragStart().drag().dragEnd();
        checkCallback.call(this, draggable, callbackSpy, assert);
    });

    QUnit.test('\'' + callbackName + '\' option changing', function(assert) {
        var draggable = this.createDraggable(),
            callbackSpy = sinon.spy(noop);
        draggable.option(callbackName, callbackSpy);

        this.pointer.dragStart().drag().dragEnd();
        checkCallback.call(this, draggable, callbackSpy, assert);
    });
});

QUnit.test('\'disabled\' option', function(assert) {
    var instance = this.createDraggable({ direction: 'horizontal' });

    instance.option('disabled', true);
    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 0, assert);

    instance.option('disabled', false);
    this.pointer.down().move(100, 0).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test('\'dx-state-disabled\' class (T284305)', function(assert) {
    var instance = this.createDraggable({ direction: 'horizontal' });

    instance.$element().addClass('dx-state-disabled');
    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 0, assert);

    instance.$element().removeClass('dx-state-disabled');
    this.pointer.down().move(100, 0).up();
    this.checkPosition(100, 0, assert);
});

QUnit.module('\'direction\' option', moduleConfig);

QUnit.test('\'horizontal\'', function(assert) {
    this.createDraggable({ direction: 'horizontal' });

    this.pointer.down().move(100).up();
    this.checkPosition(100, 0, assert);

    this.pointer.down().move(0, 100).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test('\'vertical\'', function(assert) {
    this.createDraggable({ direction: 'vertical' });

    this.pointer.down().move(0, 100).up();
    this.checkPosition(0, 100, assert);

    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 100, assert);
});

QUnit.test('\'both\'', function(assert) {
    this.createDraggable({ });

    this.pointer.down().move(100, 100).up();
    this.checkPosition(100, 100, assert);
});

QUnit.test('changing', function(assert) {
    var draggable = this.createDraggable({ });
    draggable.option('direction', 'horizontal');

    this.pointer.down().move(100).up();
    this.checkPosition(100, 0, assert);

    this.pointer.down().move(0, 100).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test('dragging-class toggling', function(assert) {
    var draggable = this.createDraggable({});
    draggable.option('direction', 'horizontal');

    assert.ok(!this.$element.hasClass('dx-draggable-dragging'), 'element has not appropriate class before dragging');

    this.pointer.down().move(100);
    assert.ok(this.$element.hasClass('dx-draggable-dragging'), 'element has right class');

    this.pointer.down().up();
    assert.ok(!this.$element.hasClass('dx-draggable-dragging'), 'element has not appropriate class');
});

QUnit.module('bounds', moduleConfig);

QUnit.test('\'area\' option as element', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: '#area'
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
});

QUnit.test('\'area\' option as window', function(assert) {
    var $area = $(window),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: $area
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
});

QUnit.test('\'area\' option as function', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        lastAreaContext = null,
        draggable = this.createDraggable({
            area: function() {
                lastAreaContext = this;
                return $area;
            }
        });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
    assert.strictEqual(lastAreaContext, draggable);
});

QUnit.test('\'boundOffsets\' option as plain object, pair', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        boundOffset = {
            h: 1,
            v: 2
        };

    this.createDraggable({
        area: $area,
        boundOffset: boundOffset
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - boundOffset.h, areaHeight - this.$element.height() - boundOffset.v, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(boundOffset.h, boundOffset.v, assert);
});

QUnit.test('\'boundOffsets\' option as plain object, quad', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        boundOffset = {
            left: 1,
            top: 2,
            right: 3,
            bottom: 4
        };

    this.createDraggable({
        area: $area,
        boundOffset: boundOffset
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - boundOffset.right, areaHeight - this.$element.height() - boundOffset.bottom, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(boundOffset.left, boundOffset.top, assert);
});

QUnit.test('\'boundOffsets\' option as function', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        boundOffset = {
            h: 1,
            v: -2
        },
        draggable = this.createDraggable({
            area: $area,
            boundOffset: function() {
                assert.strictEqual(this, draggable);
                return boundOffset;
            }
        });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - boundOffset.h, areaHeight - this.$element.height() - boundOffset.v, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(boundOffset.h, boundOffset.v, assert);
});

QUnit.test('\'boundOffset\' option as string, pair', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: $area,
        boundOffset: '1 -2'
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - 1, areaHeight - this.$element.height() - (-2), assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(1, -2, assert);
});

QUnit.test('\'boundOffset\' option as string, quad', function(assert) {
    var $area = $('#area'),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: $area,
        boundOffset: '1 2 3 4'
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - 3, areaHeight - this.$element.height() - 4, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(1, 2, assert);
});

QUnit.module('\'allowMoveByClick\' option', moduleConfig);

QUnit.test('enabled', function(assert) {
    this.createDraggable({
        allowMoveByClick: true
    });

    pointerMock(window).down(100, 100);

    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});

QUnit.test('enabled in rtl mode', function(assert) {
    var $area = $('#area');
    $area.css('direction', 'rtl');

    this.createDraggable({
        allowMoveByClick: true,
        rtlEnabled: true,
        'area': $area
    });

    pointerMock($area).down(100, 100);

    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});

QUnit.test('changing', function(assert) {
    var draggable = this.createDraggable({ });

    draggable.option('allowMoveByClick', true);
    pointerMock(window).down(100, 100);

    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});

QUnit.test('behaviour depends from \'area\' option', function(assert) {
    var $area = $('#area');

    this.createDraggable({
        'allowMoveByClick': true,
        'area': $area
    });

    pointerMock($area).down(100, 100);
    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);

    pointerMock($('#other')).down(-100, -100);
    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});


QUnit.module('regressions', moduleConfig);

QUnit.test('start element position on second gesture should not be equal to initial', function(assert) {
    this.createDraggable();
    this.pointer
        .down().move(100, 100).up()
        .down().move(50, 50).up();

    this.checkPosition(150, 150, assert);
});

QUnit.test('immediate drag after click should work correctly', function(assert) {
    var $area = $('#area');
    this.createDraggable({
        area: $area,
        allowMoveByClick: true
    });

    pointerMock($area).start().down(50, 50);
    this.pointer.move(60, 60).up();

    this.checkPosition(60 - this.$element.width() / 2, 60 - this.$element.height() / 2, assert);
});

QUnit.test('\'onDrag\' callback should be fired on area click', function(assert) {
    var $area = $('#area'),
        onDragSpy = sinon.spy(noop);

    this.createDraggable({
        area: $area,
        allowMoveByClick: true,
        onDrag: onDragSpy
    });

    this.pointer.down();
    assert.ok(onDragSpy.calledOnce);
});

QUnit.test('element position on click should be updated considering direction', function(assert) {
    var $area = $('#area'),
        elementHeight = this.$element.height(),
        elementPosition = this.$element.position();

    this.createDraggable({
        area: $area,
        allowMoveByClick: true,
        direction: 'vertical'
    });

    pointerMock($area).down(elementPosition.left + 10, elementPosition.top + elementHeight + 5);
    this.checkPosition(elementPosition.left, elementPosition.top + elementHeight / 2 + 5, assert);
});
