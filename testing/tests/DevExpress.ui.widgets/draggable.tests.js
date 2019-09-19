var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    dragEvents = require("events/drag"),
    pointerMock = require("../../helpers/pointerMock.js"),
    viewPort = require("core/utils/view_port").value,
    GestureEmitter = require("events/gesture/emitter.gesture.js"),
    animationFrame = require("animation/frame");

require("common.css!");
require("ui/draggable");
require("ui/scroll_view");

QUnit.testStart(function() {
    var markup =
        '<div id="area" style="width: 300px; height: 250px; position: relative; background: green;">\
            <div style="width: 30px; height: 50px; background: yellow;" id="draggable"></div>\
            <div style="width: 100px; height: 100px; background: grey;" id="draggableWithHandle">\
                <div id="handle" style="width: 30px; height: 30px; background: grey;"></div>\
            </div>\
        </div>\
        <div id="items" style="width: 300px; height: 250px; position: relative; background: grey;">\
            <div id="item1" class="draggable" style="width: 30px; height: 50px; background: yellow;"></div>\
            <div id="item2" class="draggable" style="width: 30px; height: 50px; background: red;"></div>\
            <div id="item3" class="draggable" style="width: 30px; height: 50px; background: blue;"></div>\
        </div>\
        <div id="other"></div>\
        <div id="scrollable" style="display: none; width: 250px; height: 250px; overflow: auto; position: absolute; left: 0; top: 0;">\
            <div id="scrollable-container" style="width: 500px; height: 500px;">\
                <div id="scrollableItem" class="draggable" style="width: 30px; height: 50px; background: black;"></div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DRAGGABLE_CLASS = "dx-draggable",
    DRAGGABLE_ACTION_TO_EVENT_MAP = {
        "onDragStart": dragEvents.start,
        "onDragMove": dragEvents.move,
        "onDragEnd": dragEvents.end
    };

var setupDraggable = function(that, $element) {
    $("#qunit-fixture").addClass("qunit-fixture-visible");

    that.$element = $element;
    that.createDraggable = function(options) {
        return that.draggableInstance = that.$element.dxDraggable($.extend({ boundary: $("body") }, options)).dxDraggable("instance");
    };
    that.pointer = pointerMock(that.$element).start();

    that.checkPosition = function(left, top, assert, $element) {
        assert.deepEqual(($element || that.$element).offset(), { left: left, top: top }, "position of the draggable element");
    };
};

var moduleConfig = {
    beforeEach: function() {
        setupDraggable(this, $("#draggable"));
    },
    afterEach: function() {
        $("#qunit-fixture").removeClass("qunit-fixture-visible");
        this.draggableInstance && this.draggableInstance.dispose();
    }
};


QUnit.module("rendering", moduleConfig);

QUnit.test("element has class", function(assert) {
    assert.ok(this.createDraggable().$element().hasClass(DRAGGABLE_CLASS));
});

QUnit.test("'immediate' option", function(assert) {
    this.createDraggable({ immediate: false });
    GestureEmitter.touchBoundary(10);

    try {
        this.pointer.down().move(5, 0).up();
    } finally {
        GestureEmitter.touchBoundary(0);
        this.checkPosition(0, 0, assert);
    }
});

QUnit.module("callbacks", moduleConfig);

$.each(DRAGGABLE_ACTION_TO_EVENT_MAP, function(callbackName, eventName) {
    var checkCallback = function(draggable, spy, assert) {
        assert.ok(spy.calledOnce, "callback fired");

        var firstCall = spy.getCall(0),
            arg = firstCall.args[0],
            context = firstCall.thisValue;

        assert.strictEqual(context, draggable, "context equals to component");
        assert.strictEqual(arg.component, draggable);
        assert.strictEqual($(arg.element)[0], this.$element[0]);
        assert.equal(arg.event.type, eventName);
    };

    QUnit.test("'" + callbackName + "' callback fired", function(assert) {
        var callbackSpy = sinon.spy(noop),
            options = {},
            draggable;

        options[callbackName] = callbackSpy;
        draggable = this.createDraggable(options);

        this.pointer.dragStart().drag().dragEnd();
        checkCallback.call(this, draggable, callbackSpy, assert);
    });

    QUnit.test("'" + callbackName + "' option changing", function(assert) {
        var draggable = this.createDraggable(),
            callbackSpy = sinon.spy(noop);
        draggable.option(callbackName, callbackSpy);

        this.pointer.dragStart().drag().dragEnd();
        checkCallback.call(this, draggable, callbackSpy, assert);
    });
});

QUnit.test("'disabled' option", function(assert) {
    var instance = this.createDraggable({ dragDirection: 'horizontal' });

    instance.option("disabled", true);
    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 0, assert);

    instance.option("disabled", false);
    this.pointer.down().move(100, 0).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test("'dx-state-disabled' class (T284305)", function(assert) {
    var instance = this.createDraggable({ dragDirection: 'horizontal' });

    instance.$element().addClass("dx-state-disabled");
    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 0, assert);

    instance.$element().removeClass("dx-state-disabled");
    this.pointer.down().move(100, 0).up();
    this.checkPosition(100, 0, assert);
});


QUnit.module("'dragDirection' option", moduleConfig);

QUnit.test("'horizontal'", function(assert) {
    this.createDraggable({ dragDirection: 'horizontal' });

    this.pointer.down().move(100).up();
    this.checkPosition(100, 0, assert);

    this.pointer.down().move(0, 100).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test("'vertical'", function(assert) {
    this.createDraggable({ dragDirection: 'vertical' });

    this.pointer.down().move(0, 100).up();
    this.checkPosition(0, 100, assert);

    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 100, assert);
});

QUnit.test("'both'", function(assert) {
    this.createDraggable({ });

    this.pointer.down().move(100, 100).up();
    this.checkPosition(100, 100, assert);
});

QUnit.test("changing", function(assert) {
    var draggable = this.createDraggable({ });
    draggable.option("dragDirection", "horizontal");

    this.pointer.down().move(100).up();
    this.checkPosition(100, 0, assert);

    this.pointer.down().move(0, 100).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test("dragging-class toggling", function(assert) {
    var draggable = this.createDraggable({});
    draggable.option("dragDirection", "horizontal");

    assert.ok(!this.$element.hasClass("dx-draggable-dragging"), "element has not appropriate class before dragging");

    this.pointer.down().move(100);
    assert.ok(this.$element.hasClass("dx-draggable-dragging"), "element has right class");

    this.pointer.up();
    assert.ok(!this.$element.hasClass("dx-draggable-dragging"), "element has not appropriate class");
});

QUnit.test("source-class toggling", function(assert) {
    this.createDraggable({});

    assert.ok(!this.$element.hasClass("dx-draggable-source"), "element has not appropriate class before dragging");

    this.pointer.down().move(100);
    assert.ok(this.$element.hasClass("dx-draggable-source"), "element has right class");

    this.pointer.down().up();
    assert.ok(!this.$element.hasClass("dx-draggable-source"), "element has not appropriate class");
});


QUnit.module("bounds", moduleConfig);

QUnit.test("'boundary' option as element", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        boundary: "#area"
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
});

QUnit.test("'boundary' option as window", function(assert) {
    var $area = $(window),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        autoScroll: false,
        boundary: $area
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
});

QUnit.test("'boundary' option as function", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        lastAreaContext = null,
        draggable = this.createDraggable({
            boundary: function() {
                lastAreaContext = this;
                return $area;
            }
        });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
    assert.strictEqual(lastAreaContext, draggable);
});

QUnit.test("'boundOffsets' option as plain object, pair", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        boundOffset = {
            h: 1,
            v: 2
        };

    this.createDraggable({
        boundary: $area,
        boundOffset: boundOffset
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - boundOffset.h, areaHeight - this.$element.height() - boundOffset.v, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(boundOffset.h, boundOffset.v, assert);
});

QUnit.test("'boundOffsets' option as plain object, quad", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        boundOffset = {
            left: 1,
            top: 2,
            right: 3,
            bottom: 4
        };

    this.createDraggable({
        boundary: $area,
        boundOffset: boundOffset
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - boundOffset.right, areaHeight - this.$element.height() - boundOffset.bottom, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(boundOffset.left, boundOffset.top, assert);
});

QUnit.test("'boundOffsets' option as function", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height(),
        boundOffset = {
            h: 1,
            v: -2
        },
        draggable = this.createDraggable({
            boundary: $area,
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

QUnit.test("'boundOffset' option as string, pair", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        boundary: $area,
        boundOffset: "1 -2"
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - 1, areaHeight - this.$element.height() - (-2), assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(1, -2, assert);
});

QUnit.test("'boundOffset' option as string, quad", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        boundary: $area,
        boundOffset: "1 2 3 4"
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();
    this.checkPosition(areaWidth - this.$element.width() - 3, areaHeight - this.$element.height() - 4, assert);

    this.pointer.down().move(-areaWidth - 150, -areaHeight - 150).up();
    this.checkPosition(1, 2, assert);
});


QUnit.module("'allowMoveByClick' option", moduleConfig);

QUnit.test("enabled", function(assert) {
    this.createDraggable({
        allowMoveByClick: true
    });

    pointerMock(viewPort()).down(100, 100);

    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});

QUnit.test("enabled in rtl mode", function(assert) {
    var $area = $("#area");
    $area.css("direction", "rtl");

    this.createDraggable({
        allowMoveByClick: true,
        rtlEnabled: true,
        "area": $area
    });

    pointerMock($area).down(100, 100);

    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});

QUnit.test("Dragging an element should work correctly after click when it is positioned relative to an adjacent element", function(assert) {
    // arragne
    var $items = $("#items");

    $items.children().css("display", "inline-block");
    setupDraggable(this, $("#item2"));

    this.createDraggable({
        allowMoveByClick: true,
        boundary: $items
    });

    // act
    pointerMock($items).down(100, 300);

    // assert
    this.checkPosition(100 - this.$element.width() / 2, 300 - this.$element.height() / 2, assert);
});

QUnit.test("changing", function(assert) {
    var draggable = this.createDraggable({ });

    draggable.option("allowMoveByClick", true);
    pointerMock(viewPort()).down(100, 100);

    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});

QUnit.test("behaviour depends from 'area' option", function(assert) {
    var $area = $("#area");

    this.createDraggable({
        allowMoveByClick: true,
        boundary: $area
    });

    pointerMock($area).down(100, 100);
    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);

    pointerMock($("#other")).down(-100, -100);
    this.checkPosition(100 - this.$element.width() / 2, 100 - this.$element.height() / 2, assert);
});


QUnit.module("regressions", moduleConfig);

QUnit.test("start element position on second gesture should not be equal to initial", function(assert) {
    this.createDraggable();
    this.pointer
        .down().move(100, 100).up()
        .down().move(50, 50).up();

    this.checkPosition(150, 150, assert);
});

QUnit.test("immediate drag after click should work correctly", function(assert) {
    var $area = $("#area");
    this.createDraggable({
        boundary: $area,
        allowMoveByClick: true
    });

    pointerMock($area).start().down(50, 50);
    this.pointer.move(60, 60).up();

    this.checkPosition(60 - this.$element.width() / 2, 60 - this.$element.height() / 2, assert);
});

QUnit.test("'onDragMove' callback should be fired on area click", function(assert) {
    var $area = $("#area"),
        onDragMoveSpy = sinon.spy(noop);

    this.createDraggable({
        boundary: $area,
        allowMoveByClick: true,
        onDragMove: onDragMoveSpy
    });

    this.pointer.down();
    assert.ok(onDragMoveSpy.calledOnce);
});

QUnit.test("element position on click should be updated considering dragDirection", function(assert) {
    var $area = $("#area"),
        elementHeight = this.$element.height(),
        elementPosition = this.$element.position();

    this.createDraggable({
        boundary: $area,
        allowMoveByClick: true,
        dragDirection: "vertical"
    });

    pointerMock($area).down(elementPosition.left + 10, elementPosition.top + elementHeight + 5);
    this.checkPosition(elementPosition.left, elementPosition.top + elementHeight / 2 + 5, assert);
});


QUnit.module("clone", moduleConfig);

QUnit.test("Clone an element when dragging", function(assert) {
    // arrange
    var $cloneElement;

    this.createDraggable({
        clone: true
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    $cloneElement = $("body").children("#draggable");
    assert.strictEqual($cloneElement.length, 1, "cloned element");
    assert.ok($cloneElement.hasClass("dx-draggable-dragging"), "cloned element has dragging class");
    assert.ok(this.$element.hasClass("dx-draggable-source"), "element has source class");
    assert.notOk(this.$element.hasClass("dx-draggable-dragging"), "original element hasn't dragging class");
    assert.notOk($cloneElement.hasClass("dx-draggable-source"), "cloned element hasn't source class");
    assert.ok($cloneElement.hasClass("dx-draggable-clone"), "cloned element has dragging class");
    this.checkPosition(10, 10, assert, $cloneElement);
    this.checkPosition(0, 0, assert);
});

QUnit.test("Remove cloned element after the drop end", function(assert) {
    // arrange
    var $cloneElement;

    this.createDraggable({
        clone: true
    });

    this.pointer.down().move(10, 10);

    // assert
    $cloneElement = $("body").children("#draggable");
    assert.strictEqual($cloneElement.length, 1, "there is a cloned element");

    // act
    this.pointer.up();

    // assert
    $cloneElement = $("body").children("#draggable");
    assert.strictEqual($cloneElement.length, 0, "there isn't a cloned element");
});

QUnit.test("Remove cloned element when disposing", function(assert) {
    // arrange
    var $cloneElement;

    this.createDraggable({
        clone: true
    });

    this.pointer.down().move(10, 10);

    // assert
    $cloneElement = $("body").children("#draggable");
    assert.strictEqual($cloneElement.length, 1, "there is a cloned element");

    // act
    this.draggableInstance.dispose();

    // assert
    $cloneElement = $("body").children("#draggable");
    assert.strictEqual($cloneElement.length, 0, "there isn't a cloned element");
});

QUnit.test("The cloned element offset should be correct when the parent container has offset", function(assert) {
    // arrange
    $("#area").css({
        top: "300px",
        left: "300px"
    });

    this.createDraggable({
        clone: true
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    this.checkPosition(310, 310, assert, $("body").children("#draggable"));
});

QUnit.test("The drag element offset should be correct when the parent container has offset", function(assert) {
    // arrange
    $("#area").css({
        top: "300px",
        left: "300px"
    });

    this.createDraggable({});

    // act
    this.pointer.down().move(10, 10);

    // assert
    this.checkPosition(310, 310, assert);
});


QUnit.module("container", moduleConfig);

QUnit.test("Set container", function(assert) {
    // arrange
    this.createDraggable({
        clone: true,
        container: "#other"
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children("#draggable").length, 1, "there is a cloned element");
});

QUnit.test("The drag element offset should be correct when the parent container has offset and the container is specified", function(assert) {
    // arrange
    $("#area").css({
        top: "300px",
        left: "300px"
    });

    $("#other").css({
        position: "relative",
        left: "600px",
        top: "600px"
    });

    this.createDraggable({
        clone: true,
        container: "#other"
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    this.checkPosition(310, 310, assert, $("#other").children("#draggable"));
});

QUnit.test("Remove element from the container after the drop end", function(assert) {
    // arrange
    this.createDraggable({
        clone: true,
        container: "#other"
    });

    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children("#draggable").length, 1, "there is a cloned element");

    // act
    this.pointer.up();

    // assert
    assert.strictEqual($("body").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children("#draggable").length, 0, "there isn't a cloned element");
});

QUnit.test("Remove element from the container when disposing", function(assert) {
    // arrange
    this.createDraggable({
        clone: true,
        container: "#other"
    });

    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children("#draggable").length, 1, "there is a cloned element");

    // act
    this.draggableInstance.dispose();

    // assert
    assert.strictEqual($("body").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children("#draggable").length, 0, "there isn't a cloned element");
});


QUnit.module("template", moduleConfig);

QUnit.test("Set template", function(assert) {
    // arrange
    var template = sinon.spy(function() {
        return $("<div id='myDragElement'/>").text("test");
    });

    this.createDraggable({
        template: template
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#myDragElement").length, 1, "there is a drag element");
    assert.strictEqual(template.callCount, 1, "template is called");
    assert.deepEqual($(template.getCall(0).args[0].sourceElement).get(0), this.$element.get(0), "args[0].sourceElement");
    assert.deepEqual($(template.getCall(0).args[1]).get(0), $(viewPort()).get(0), "args[1] - container");
});

QUnit.test("Remove my element after the drop end", function(assert) {
    // arrange
    this.createDraggable({
        template: function() {
            return $("<div id='myDragElement'/>").text("test");
        }
    });

    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#myDragElement").length, 1, "there is a cloned element");

    // act
    this.pointer.up();

    // assert
    assert.strictEqual($("body").children("#myDragElement").length, 0, "there isn't a cloned element");
});

QUnit.test("Remove my element when disposing", function(assert) {
    // arrange
    this.createDraggable({
        template: function() {
            return $("<div id='myDragElement'/>").text("test");
        }
    });

    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#myDragElement").length, 1, "there is a cloned element");

    // act
    this.draggableInstance.dispose();

    // assert
    assert.strictEqual($("body").children("#myDragElement").length, 0, "there isn't a cloned element");
});


QUnit.module("filter", $.extend({}, moduleConfig, {
    beforeEach: function() {
        setupDraggable(this, $("#items"));
    }
}));

QUnit.test("Set filter", function(assert) {
    // arrange
    var items,
        $dragItemElement;

    this.createDraggable({
        filter: ".draggable"
    });
    items = this.$element.children();

    // act
    $dragItemElement = items.eq(0);
    pointerMock($dragItemElement).start().down().move(20, 20).up();

    // assert
    this.checkPosition(20, 270, assert, items.eq(0));

    // act
    $dragItemElement = items.eq(1);
    pointerMock($dragItemElement).start().down().move(20, 20).up();

    // assert
    this.checkPosition(20, 320, assert, items.eq(1));

    // act
    $dragItemElement = items.eq(2);
    pointerMock($dragItemElement).start().down().move(20, 20).up();

    // assert
    this.checkPosition(20, 370, assert, items.eq(2));
});

QUnit.test("No exceptions on area click", function(assert) {
    // arrange
    this.createDraggable({
        filter: ".draggable",
        boundary: "#items"
    });

    try {
        // act
        pointerMock($("#items")).start().down().move(10, 10);

        // assert
        assert.ok(true, "No exceptions");
    } catch(e) {
        assert.ok(false, "exception");
    }
});


QUnit.module("handle", $.extend({}, moduleConfig, {
    beforeEach: function() {
        setupDraggable(this, $("#draggableWithHandle"));
    }
}));

QUnit.test("Set handle", function(assert) {
    // arrange
    this.createDraggable({
        handle: "#handle"
    });

    // act
    this.pointer.down().move(10, 10).up();

    // assert
    this.checkPosition(0, 50, assert);

    // act
    pointerMock(this.$element.find("#handle").first()).start().down().move(10, 10);

    // assert
    this.checkPosition(10, 60, assert);
});

QUnit.module("autoScroll", $.extend({}, moduleConfig, {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        setupDraggable(this, $("#scrollableItem"));

        this.originalRAF = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            return window.setTimeout(callback, 10);
        };

        $("#area").hide();
        $("#items").hide();
        $("#other").hide();

        $("#scrollable").show();

        $("#scrollable").scrollTop(0);
        $("#scrollable").scrollLeft(0);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();

        animationFrame.requestAnimationFrame = this.originalRAF;

        $("#scrollable").hide();

        $("#area").show();
        $("#items").show();
        $("#other").show();
    }
}));

QUnit.test("Vertical scrolling", function(assert) {
    // arrange
    var etalonScrollTop = 0,
        scrollSensitivity = 10,
        scrollSpeed = 20,
        speedIncreasePerPixel = scrollSpeed / scrollSensitivity,
        speed = 0;

    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.down().move(0, 240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    for(let i = 1; i < 10; i++) {
        this.pointer.move(0, 1);
        this.clock.tick(10);

        speed += speedIncreasePerPixel;
        etalonScrollTop += speed;

        assert.equal($("#scrollable").scrollTop(), etalonScrollTop, "scrollTop");
    }

    this.pointer.down().move(0, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), etalonScrollTop, "scrollTop");

    speed = 0;

    this.pointer.move(0, -240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), etalonScrollTop, "scrollTop");

    for(let i = 1; i < 10; i++) {
        this.pointer.move(0, -1);
        this.clock.tick(10);

        speed += speedIncreasePerPixel;
        etalonScrollTop -= speed;

        assert.equal($("#scrollable").scrollTop(), etalonScrollTop, "scrollTop");
    }

    this.pointer.down().move(0, -1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
});

QUnit.test("Horizontal scrolling", function(assert) {
    // arrange
    var etalonScrollLeft = 0,
        speedIncreasePerPixel = 2,
        speed = 0;

    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");

    this.pointer.down().move(240, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");

    for(let i = 1; i < 10; i++) {
        this.pointer.move(1, 0);
        this.clock.tick(10);

        speed += speedIncreasePerPixel;
        etalonScrollLeft += speed;

        assert.equal($("#scrollable").scrollLeft(), etalonScrollLeft, "scrollLeft");
    }

    this.pointer.down().move(1, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), etalonScrollLeft, "scrollLeft");

    speed = 0;

    this.pointer.move(-240, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), etalonScrollLeft, "scrollLeft");

    for(let i = 1; i < 10; i++) {
        this.pointer.move(-1, 0);
        this.clock.tick(10);

        speed += speedIncreasePerPixel;
        etalonScrollLeft -= speed;

        assert.equal($("#scrollable").scrollLeft(), etalonScrollLeft, "scrollLeft");
    }

    this.pointer.down().move(-1, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
});

QUnit.test("Horizontal and vertical scrolling", function(assert) {
    // arrange
    var etalonScrollValue = 0,
        speedIncreasePerPixel = 2,
        speed = 2;

    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.down().move(240, 240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    for(let i = 1; i < 10; i++) {
        this.pointer.move(1, 1);
        this.clock.tick(10);

        etalonScrollValue += speed;
        speed += speedIncreasePerPixel;

        assert.equal($("#scrollable").scrollLeft(), etalonScrollValue, "scrollLeft");
        assert.equal($("#scrollable").scrollTop(), etalonScrollValue, "scrollTop");
    }

    this.pointer.move(1, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), etalonScrollValue, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), etalonScrollValue, "scrollTop");

    speed = 0;

    this.pointer.move(-240, -240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), etalonScrollValue, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), etalonScrollValue, "scrollTop");

    for(let i = 1; i < 10; i++) {
        this.pointer.move(-1, -1);
        this.clock.tick(10);

        speed += speedIncreasePerPixel;
        etalonScrollValue -= speed;

        assert.equal($("#scrollable").scrollLeft(), etalonScrollValue, "scrollLeft");
        assert.equal($("#scrollable").scrollTop(), etalonScrollValue, "scrollTop");
    }

    this.pointer.move(-1, -1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
});

QUnit.test("Vertical scrolling should not start if on drag start cursor ", function(assert) {
    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    $("#scrollableItem").offset({
        top: 200,
        left: 0
    });

    this.pointer.down().move(0, 245);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
});

QUnit.test("Horizontal scrolling should not start if on drag start cursor ", function(assert) {
    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    $("#scrollableItem").offset({
        top: 0,
        left: 200
    });

    this.pointer.down().move(245, 0);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
});

QUnit.test("Scrolling with scrollView", function(assert) {
    // arrange
    var scrollView = $("#scrollable").dxScrollView({
        direction: 'both',
        useNative: false
    }).dxScrollView("instance");

    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.deepEqual(scrollView.scrollOffset(), { top: 0, left: 0 }, "scrollOffset");

    this.pointer.down().move(240, 240);

    this.pointer.move(1, 1);
    this.clock.tick(10);

    assert.deepEqual(scrollView.scrollOffset(), { top: 2, left: 2 }, "scrollOffset");

    this.pointer.move(-1, -1);
    this.clock.tick(10);

    assert.deepEqual(scrollView.scrollOffset(), { top: 2, left: 2 }, "scrollOffset");
});

QUnit.test("Autoscroll should work fine if element was dropped and dragged again", function(assert) {
    // arrange
    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.down().move(240, 240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.up().down().move(1, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 4, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 4, "scrollTop");
});
