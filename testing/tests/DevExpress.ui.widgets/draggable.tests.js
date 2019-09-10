var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    dragEvents = require("events/drag"),
    pointerMock = require("../../helpers/pointerMock.js"),
    viewPort = require("core/utils/view_port").value,
    GestureEmitter = require("events/gesture/emitter.gesture.js");

require("common.css!");
require("ui/draggable");

viewPort($("body").css({ margin: "0px", padding: "0px", height: "600px" }));

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
        <div id="other"></div>';

    $("#qunit-fixture").html(markup);
});

var DRAGGABLE_CLASS = "dx-draggable",
    DRAGGABLE_ACTION_TO_EVENT_MAP = {
        "onDragStart": dragEvents.start,
        "onDrag": dragEvents.move,
        "onDragEnd": dragEvents.end
    };

var setupDraggable = function(that, $element) {
    $("#qunit-fixture").addClass("qunit-fixture-visible");

    that.$element = $element;
    that.createDraggable = function(options) {
        return that.draggableInstance = that.$element.dxDraggable($.extend({ area: $("body") }, options)).dxDraggable("instance");
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
    var instance = this.createDraggable({ direction: 'horizontal' });

    instance.option("disabled", true);
    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 0, assert);

    instance.option("disabled", false);
    this.pointer.down().move(100, 0).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test("'dx-state-disabled' class (T284305)", function(assert) {
    var instance = this.createDraggable({ direction: 'horizontal' });

    instance.$element().addClass("dx-state-disabled");
    this.pointer.down().move(100, 0).up();
    this.checkPosition(0, 0, assert);

    instance.$element().removeClass("dx-state-disabled");
    this.pointer.down().move(100, 0).up();
    this.checkPosition(100, 0, assert);
});


QUnit.module("'direction' option", moduleConfig);

QUnit.test("'horizontal'", function(assert) {
    this.createDraggable({ direction: 'horizontal' });

    this.pointer.down().move(100).up();
    this.checkPosition(100, 0, assert);

    this.pointer.down().move(0, 100).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test("'vertical'", function(assert) {
    this.createDraggable({ direction: 'vertical' });

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
    draggable.option("direction", "horizontal");

    this.pointer.down().move(100).up();
    this.checkPosition(100, 0, assert);

    this.pointer.down().move(0, 100).up();
    this.checkPosition(100, 0, assert);
});

QUnit.test("dragging-class toggling", function(assert) {
    var draggable = this.createDraggable({});
    draggable.option("direction", "horizontal");

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

QUnit.test("'area' option as element", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: "#area"
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
});

QUnit.test("'area' option as window", function(assert) {
    var $area = $(window),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: $area
    });

    this.pointer.down().move(areaWidth + 150, areaHeight + 150).up();

    this.checkPosition(areaWidth - this.$element.width(), areaHeight - this.$element.height(), assert);
});

QUnit.test("'area' option as function", function(assert) {
    var $area = $("#area"),
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

QUnit.test("'boundOffsets' option as plain object, pair", function(assert) {
    var $area = $("#area"),
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
        area: $area,
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

QUnit.test("'boundOffset' option as string, pair", function(assert) {
    var $area = $("#area"),
        areaWidth = $area.width(),
        areaHeight = $area.height();

    this.createDraggable({
        area: $area,
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
        area: $area,
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
        area: $items
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
        "allowMoveByClick": true,
        "area": $area
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
        area: $area,
        allowMoveByClick: true
    });

    pointerMock($area).start().down(50, 50);
    this.pointer.move(60, 60).up();

    this.checkPosition(60 - this.$element.width() / 2, 60 - this.$element.height() / 2, assert);
});

QUnit.test("'onDrag' callback should be fired on area click", function(assert) {
    var $area = $("#area"),
        onDragSpy = sinon.spy(noop);

    this.createDraggable({
        area: $area,
        allowMoveByClick: true,
        onDrag: onDragSpy
    });

    this.pointer.down();
    assert.ok(onDragSpy.calledOnce);
});

QUnit.test("element position on click should be updated considering direction", function(assert) {
    var $area = $("#area"),
        elementHeight = this.$element.height(),
        elementPosition = this.$element.position();

    this.createDraggable({
        area: $area,
        allowMoveByClick: true,
        direction: "vertical"
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


QUnit.module("dragTemplate", moduleConfig);

QUnit.test("Set dragTemplate", function(assert) {
    // arrange
    var dragTemplate = sinon.spy(function() {
        return $("<div id='myDragElement'/>").text("test");
    });

    this.createDraggable({
        dragTemplate: dragTemplate
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children("#myDragElement").length, 1, "there is a drag element");
    assert.strictEqual(dragTemplate.callCount, 1, "dragTemplate is called");
    assert.deepEqual($(dragTemplate.getCall(0).args[0]).get(0), $(viewPort()).get(0), "dragTemplate is called");
});

QUnit.test("Remove my element after the drop end", function(assert) {
    // arrange
    this.createDraggable({
        dragTemplate: function() {
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
        dragTemplate: function() {
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

QUnit.module("items", $.extend({}, moduleConfig, {
    beforeEach: function() {
        setupDraggable(this, $("#items"));
    }
}));

QUnit.test("Set items", function(assert) {
    // arrange
    var items,
        $dragItemElement;

    this.createDraggable({
        items: ".draggable"
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
        items: ".draggable",
        area: "#items"
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
