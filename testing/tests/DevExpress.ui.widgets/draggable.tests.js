import $ from "jquery";
import { noop } from "core/utils/common";
import pointerMock from "../../helpers/pointerMock.js";
import viewPort from "core/utils/view_port";
import GestureEmitter from "events/gesture/emitter.gesture.js";
import animationFrame from "animation/frame";
import translator from "animation/translator";

import "common.css!";
import "ui/draggable";
import "ui/scroll_view";

$("body").css({
    minHeight: "800px",
    minWidth: "800px",
    margin: "0px",
    padding: "0px"
});

QUnit.testStart(function() {
    var markup =
        '<style>.fixedPosition.dx-draggable-dragging { position: fixed; }</style>\
        <div id="area" style="width: 300px; height: 250px; position: relative; background: green;">\
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

var DRAGGABLE_CLASS = "dx-draggable";

var setupDraggable = function(that, $element) {
    $("#qunit-fixture").addClass("qunit-fixture-visible");

    that.$element = $element;
    that.createDraggable = function(options, $element) {
        return that.draggableInstance = ($element || that.$element).dxDraggable($.extend({ boundary: $("body") }, options)).dxDraggable("instance");
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


QUnit.module("Initialization", moduleConfig);

QUnit.test("Initialize draggable component", function(assert) {
    assert.ok(this.createDraggable().$element().hasClass(DRAGGABLE_CLASS), "element has the 'dx-draggable' class");
    assert.strictEqual(this.$element.text(), "", "element is empty");
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


QUnit.module("Events", moduleConfig);

QUnit.test("component arg in events if component option is defined", function(assert) {
    // arrange
    const myComponent = $("<div>").dxScrollView().dxScrollView("instance");

    const options = {
        component: myComponent,
        onDragStart: sinon.spy(),
        onDragMove: sinon.spy(),
        onDragEnd: sinon.spy()
    };

    this.createDraggable(options);

    // act
    this.pointer.down().move(0, 20).up();

    // assert
    assert.strictEqual(options.onDragStart.getCall(0).args[0].component, myComponent, "onDragStart component");
    assert.strictEqual(options.onDragStart.getCall(0).args[0].element, myComponent.element(), "onDragStart element");

    assert.strictEqual(options.onDragMove.getCall(0).args[0].component, myComponent, "onDragMove component");
    assert.strictEqual(options.onDragMove.getCall(0).args[0].element, myComponent.element(), "onDragMove element");

    assert.strictEqual(options.onDragEnd.getCall(0).args[0].component, myComponent, "onDragEnd component");
    assert.strictEqual(options.onDragEnd.getCall(0).args[0].fromComponent, myComponent, "onDragEnd fromComponent");
    assert.strictEqual(options.onDragEnd.getCall(0).args[0].toComponent, myComponent, "onDragEnd toComponent");
    assert.strictEqual(options.onDragEnd.getCall(0).args[0].element, myComponent.element(), "onDragEnd element");
});

QUnit.test("onDragStart - check args", function(assert) {
    // arrange
    let onDragStartSpy = sinon.spy();

    let draggable = this.createDraggable({
        onDragStart: onDragStartSpy
    });

    // act
    this.pointer.down().move(0, 20);

    // assert
    assert.ok(onDragStartSpy.calledOnce, "event fired");
    assert.deepEqual($(onDragStartSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
    assert.strictEqual(onDragStartSpy.getCall(0).args[0].component, draggable, "component");
});

QUnit.test("'onDragStart' option changing", function(assert) {
    // arrange
    let onDragStartSpy = sinon.spy(),
        draggable = this.createDraggable();

    // act
    draggable.option("onDragStart", onDragStartSpy);
    this.pointer.down().move(0, 20);

    // assert
    assert.ok(onDragStartSpy.calledOnce, "event fired");
    assert.deepEqual($(onDragStartSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
});

QUnit.test("onDragStart - not drag item when eventArgs.cancel is true", function(assert) {
    // arrange
    let onDragStartSpy = sinon.spy((e) => { e.cancel = true; });

    this.createDraggable({
        onDragStart: onDragStartSpy
    });

    // act
    this.pointer.down().move(0, 20);

    // assert
    assert.ok(onDragStartSpy.calledOnce, "event fired");
    assert.notOk(this.$element.hasClass("dx-draggable-dragging"), "element isn't dragged");
});

QUnit.test("onDragMove - check args", function(assert) {
    // arrange
    let onDragMoveSpy = sinon.spy();

    this.createDraggable({
        onDragMove: onDragMoveSpy
    });

    // act
    this.pointer.down().move(0, 20);

    // assert
    assert.ok(onDragMoveSpy.calledOnce, "event fired");
    assert.deepEqual($(onDragMoveSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
});

QUnit.test("'onDragMove' option changing", function(assert) {
    // arrange
    let onDragMoveSpy = sinon.spy(),
        draggable = this.createDraggable();

    // act
    draggable.option("onDragMove", onDragMoveSpy);
    this.pointer.down().move(0, 20);

    // assert
    assert.ok(onDragMoveSpy.calledOnce, "event fired");
    assert.deepEqual($(onDragMoveSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
});

["same", "another"].forEach(function(group) {
    QUnit.test("onDragMove - check args when cross-component dragging to " + group + " group", function(assert) {
        // arrange
        let onDragMoveSpy = sinon.spy();

        let draggable1 = this.createDraggable({
            onDragMove: onDragMoveSpy,
            group: "shared"
        });

        let draggable2 = this.createDraggable({
            group: group === "same" ? "shared" : "another"
        }, $("#items"));

        // act
        this.pointer.down().move(0, 300).move(0, 10);

        // assert
        assert.strictEqual(onDragMoveSpy.callCount, 2, "event was called twice");
        assert.deepEqual($(onDragMoveSpy.getCall(1).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
        assert.deepEqual(onDragMoveSpy.getCall(1).args[0].fromComponent, draggable1, "fromComponent");
        assert.deepEqual(onDragMoveSpy.getCall(1).args[0].toComponent, group === "same" ? draggable2 : draggable1, "toComponent");
    });
});

QUnit.test("onDragEnd - check args", function(assert) {
    // arrange
    let onDragEndSpy = sinon.spy();

    this.createDraggable({
        onDragEnd: onDragEndSpy
    });

    // act
    this.pointer.down().move(0, 20).up();

    // assert
    assert.ok(onDragEndSpy.calledOnce, "event fired");
    assert.deepEqual($(onDragEndSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
});

QUnit.test("'onDragEnd' option changing", function(assert) {
    // arrange
    let onDragEndSpy = sinon.spy(),
        draggable = this.createDraggable();

    // act
    draggable.option("onDragEnd", onDragEndSpy);
    this.pointer.down().move(0, 20).up();

    // assert
    assert.ok(onDragEndSpy.calledOnce, "event fired");
    assert.deepEqual($(onDragEndSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
});

QUnit.test("onDragEnd - check args when cross-component dragging", function(assert) {
    // arrange
    let onDragEndSpy = sinon.spy();

    let draggable1 = this.createDraggable({
        onDragEnd: onDragEndSpy,
        group: "shared"
    });

    let draggable2 = this.createDraggable({
        group: "shared"
    }, $("#items"));

    // act
    this.pointer.down().move(0, 300).move(0, 10).up();

    // assert
    assert.strictEqual(onDragEndSpy.callCount, 1, "event fired");
    assert.deepEqual($(onDragEndSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
    assert.deepEqual(onDragEndSpy.getCall(0).args[0].fromComponent, draggable1, "fromComponent");
    assert.deepEqual(onDragEndSpy.getCall(0).args[0].toComponent, draggable2, "toComponent");
});

QUnit.test("onDragEnd - not drag item when eventArgs.cancel is true", function(assert) {
    // arrange
    let onDragEndSpy = sinon.spy((e) => { e.cancel = true; });

    this.createDraggable({
        onDragEnd: onDragEndSpy
    });

    let initialPosition = translator.locate(this.$element);

    // act
    this.pointer.down().move(0, 40).up();

    // assert
    assert.ok(onDragEndSpy.calledOnce, "event fired");
    assert.deepEqual(translator.locate(this.$element), initialPosition, "element position");
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

QUnit.test("onDrop - check args", function(assert) {
    // arrange
    let onDropSpy = sinon.spy(function(e) {
        if(e.fromComponent !== e.toComponent) {
            $(e.element).append(e.itemElement);
        }
    });

    let draggable1 = this.createDraggable({
        group: "shared"
    });

    let draggable2 = this.createDraggable({
        onDrop: onDropSpy,
        group: "shared"
    }, $("#items"));

    // act
    this.pointer.down().move(0, 300).up();

    // assert
    assert.strictEqual(onDropSpy.callCount, 1, "onDrop is called");
    assert.deepEqual($(onDropSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
    assert.strictEqual(onDropSpy.getCall(0).args[0].toComponent, draggable2, "component");
    assert.strictEqual(onDropSpy.getCall(0).args[0].fromComponent, draggable1, "sourceComponent");
    assert.strictEqual($(draggable2.element()).children("#draggable").length, 1, "dropped item");
});

QUnit.test("onDrop - check args when clone is true", function(assert) {
    // arrange
    let onDropSpy = sinon.spy(function(e) {
        if(e.fromComponent !== e.toComponent) {
            $(e.element).append(e.itemElement);
        }
    });

    let draggable1 = this.createDraggable({
        group: "shared",
        data: "x",
        clone: true
    });

    let draggable2 = this.createDraggable({
        group: "shared",
        data: "y",
        onDrop: onDropSpy
    }, $("#items"));

    // act
    this.pointer.down().move(0, 400).up();

    // assert
    assert.strictEqual(onDropSpy.callCount, 1, "onDrop is called");
    assert.deepEqual($(onDropSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "itemElement");
    assert.strictEqual(onDropSpy.getCall(0).args[0].fromComponent, draggable1, "fromComponent");
    assert.strictEqual(onDropSpy.getCall(0).args[0].toComponent, draggable2, "toComponent");
    assert.strictEqual(onDropSpy.getCall(0).args[0].fromData, "x", "fromData");
    assert.strictEqual(onDropSpy.getCall(0).args[0].toData, "y", "toData");
    assert.strictEqual($(draggable2.element()).children("#draggable").length, 1, "dropped item");
});

QUnit.test("onDrop - not drop item when eventArgs.cancel is true", function(assert) {
    // arrange
    let onDropSpy = sinon.spy((e) => { e.cancel = true; });

    this.createDraggable({
        group: "shared"
    });

    let draggable2 = this.createDraggable({
        group: "shared",
        onDrop: onDropSpy
    }, $("#items"));

    // act
    this.pointer.down().move(0, 400).up();

    // assert
    assert.strictEqual(onDropSpy.callCount, 1, "onDrop is called");
    assert.strictEqual($(draggable2.element()).children("#draggable").length, 0, "item isn't droped");
});

QUnit.test("onDragStart - add item data to event arguments", function(assert) {
    // arrange
    let itemData = { test: true },
        onDragStartSpy = sinon.spy((e) => { e.itemData = itemData; });

    let draggable = this.createDraggable({
        data: "x",
        onDragStart: onDragStartSpy
    });

    // act
    this.pointer.down().move(0, 400).up();

    // assert
    assert.strictEqual(onDragStartSpy.callCount, 1, "onDragStart is called");
    assert.deepEqual(onDragStartSpy.getCall(0).args[0].fromData, "x", "fromData arg");
    assert.deepEqual(draggable.option("itemData"), itemData, "itemData option");
});

QUnit.test("onDrop - check itemData arg", function(assert) {
    // arrange
    let itemData = { test: true },
        onDropSpy = sinon.spy(),
        onDragStartSpy = sinon.spy((e) => { e.itemData = itemData; });

    let draggable1 = this.createDraggable({
        group: "shared",
        onDragStart: onDragStartSpy
    });

    this.createDraggable({
        group: "shared",
        onDrop: onDropSpy
    }, $("#items"));

    // act
    this.pointer.down().move(0, 400).up();

    // assert
    assert.strictEqual(onDragStartSpy.callCount, 1, "onDragStart is called");
    assert.deepEqual(draggable1.option("itemData"), itemData, "itemData");
    assert.strictEqual(onDropSpy.callCount, 1, "onDrop is called");
    assert.deepEqual(onDropSpy.getCall(0).args[0].itemData, itemData, "itemData in onDrop event arguments");
});

QUnit.test("onDragEnd - the position should be correctly reset when eventArgs.cancel is true and element has a fixed position", function(assert) {
    // arrange
    $("#items").children().css("float", "right");

    this.createDraggable({
        filter: ">.draggable",
        onDragStart: function(e) {
            $(e.itemElement).addClass("fixedPosition");
        },
        onDragEnd: function(e) {
            e.cancel = true;
        }
    }, $("#items"));
    let initialLocate = translator.locate($("#items").children().eq(0));

    // act
    pointerMock($("#items").children().eq(0)).start({ x: 275, y: 255 }).down().move(100, 100).up();

    // assert
    assert.deepEqual(translator.locate($("#items").children().eq(0)), initialLocate);
});

QUnit.test("onDragEnd - the position should be correctly reset when eventArgs.cancel is true and element has a specified location", function(assert) {
    // arrange
    translator.move($("#items").children().first(), { left: 50, top: 50 });
    $("#items").children().css("float", "right");

    this.createDraggable({
        filter: ">.draggable",
        onDragStart: function(e) {
            $(e.itemElement).addClass("fixedPosition");
        },
        onDragEnd: function(e) {
            e.cancel = true;
        }
    }, $("#items"));
    let initialLocate = translator.locate($("#items").children().eq(0));

    // act
    pointerMock($("#items").children().eq(0)).start({ x: 325, y: 305 }).down().move(100, 100).up();

    // assert
    assert.deepEqual(translator.locate($("#items").children().eq(0)), initialLocate);
});

QUnit.test("onDragEnd - the position should be reset if an error occurs during drag", function(assert) {
    // arrange
    this.createDraggable({
        filter: ">.draggable",
        onDragEnd: function(e) {
            e.cancel = true;
            throw new Error("test");
        }
    }, $("#items"));

    let initialLocate = translator.locate($("#items").children().eq(0));

    try {
        // act
        pointerMock($("#items").children().eq(0)).start({ x: 325, y: 305 }).down().move(100, 100).up();
    } catch(e) {
        // assert
        assert.deepEqual(translator.locate($("#items").children().eq(0)), initialLocate);
        assert.notOk($("#items").children().eq(0).hasClass("dx-draggable-dragging"), "item hasn't 'dx-draggable-dragging' class");
    }
});

QUnit.test("The onDrop event should be called regardless of the order to subscribe to drag event", function(assert) {
    // arrange
    let onDropSpy = sinon.spy();

    const draggable2 = this.createDraggable({
        group: "shared",
        onDrop: onDropSpy
    }, $("#items"));

    const draggable1 = this.createDraggable({
        group: "shared"
    });
    const dragElementOffset1 = $(draggable1.element()).offset();
    const dragElementOffset2 = $(draggable2.element()).offset();

    // act
    this.pointer
        .down(dragElementOffset1.left, dragElementOffset1.top)
        .move(dragElementOffset2.left - dragElementOffset1.left, dragElementOffset2.top - dragElementOffset1.top)
        .up();

    // assert
    assert.strictEqual(onDropSpy.callCount, 1, "onDrop is called");
});

QUnit.test("onDragEnd - eventArgs.cancel as a promise that is resolved with false", function(assert) {
    // arrange
    let d = $.Deferred(),
        onDragEndSpy = sinon.spy((e) => { e.cancel = d.promise(); });

    this.createDraggable({
        onDragEnd: onDragEndSpy
    });

    let initialOffset = this.$element.offset();

    // act
    this.pointer.down().move(0, 40).up();

    // assert
    assert.ok(this.$element.hasClass("dx-draggable-dragging"), "element is dragged");
    assert.deepEqual(this.$element.offset(), {
        left: initialOffset.left,
        top: initialOffset.top + 40
    }, "element position");

    // act
    d.resolve(false);

    // assert
    assert.notOk(this.$element.hasClass("dx-draggable-dragging"), "element isn't dragged");
    assert.deepEqual(this.$element.offset(), {
        left: initialOffset.left,
        top: initialOffset.top + 40
    }, "element position");
});

QUnit.test("onDragEnd - eventArgs.cancel as a promise that is resolved with true", function(assert) {
    // arrange
    let d = $.Deferred(),
        onDragEndSpy = sinon.spy((e) => { e.cancel = d.promise(); });

    this.createDraggable({
        onDragEnd: onDragEndSpy
    });

    let initialOffset = this.$element.offset();

    // act
    this.pointer.down().move(0, 40).up();

    // assert
    assert.ok(this.$element.hasClass("dx-draggable-dragging"), "element is dragged");
    assert.deepEqual(this.$element.offset(), {
        left: initialOffset.left,
        top: initialOffset.top + 40
    }, "element position");

    // act
    d.resolve(true);

    // assert
    assert.notOk(this.$element.hasClass("dx-draggable-dragging"), "element isn't dragged");
    assert.deepEqual(this.$element.offset(), {
        left: initialOffset.left,
        top: initialOffset.top
    }, "element position");
});

QUnit.test("onDragEnd - eventArgs.cancel as a promise that is rejected", function(assert) {
    // arrange
    let d = $.Deferred(),
        onDragEndSpy = sinon.spy((e) => { e.cancel = d.promise(); });

    this.createDraggable({
        onDragEnd: onDragEndSpy
    });

    let initialOffset = this.$element.offset();

    // act
    this.pointer.down().move(0, 40).up();

    // assert
    assert.ok(this.$element.hasClass("dx-draggable-dragging"), "element is dragged");
    assert.deepEqual(this.$element.offset(), {
        left: initialOffset.left,
        top: initialOffset.top + 40
    }, "element position");

    // act
    d.reject();

    // assert
    assert.notOk(this.$element.hasClass("dx-draggable-dragging"), "element isn't dragged");
    assert.deepEqual(this.$element.offset(), {
        left: initialOffset.left,
        top: initialOffset.top
    }, "element position");
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
        areaWidth = $area.outerWidth(),
        areaHeight = $area.outerHeight();

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

    pointerMock(viewPort.value()).down(100, 100);

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
    pointerMock(viewPort.value()).down(100, 100);

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

QUnit.test("Start position should be correct when the element has a fixed position", function(assert) {
    // arrange
    $("#items").children().css("float", "right");

    this.createDraggable({
        filter: ">.draggable",
        onDragStart: function(e) {
            $(e.itemElement).addClass("fixedPosition");
        }
    }, $("#items"));

    // act
    pointerMock($("#items").children().eq(0)).start({ x: 275, y: 255 }).down().move(100, 100);

    // assert
    this.checkPosition(370, 350, assert, $("#items").children().eq(0));
});

QUnit.test("Start position should be correct when the element has a fixed position and clone is true", function(assert) {
    // arrange
    $("#items").children().css("float", "right");

    this.createDraggable({
        filter: ">.draggable",
        clone: true,
        onDragStart: function(e) {
            $(e.itemElement).addClass("fixedPosition");
        }
    }, $("#items"));

    // act
    pointerMock($("#items").children().eq(0)).start({ x: 275, y: 255 }).down().move(100, 100);

    // assert
    this.checkPosition(370, 350, assert, $("body").children(".dx-draggable-dragging"));
});

QUnit.test("Start position should be correct when element has a fixed position and a specified location", function(assert) {
    // arrange
    translator.move($("#items").children().first(), { left: 50, top: 50 });
    $("#items").children().css("float", "right");

    this.createDraggable({
        filter: ">.draggable",
        onDragStart: function(e) {
            $(e.itemElement).addClass("fixedPosition");
        }
    }, $("#items"));

    // act
    pointerMock($("#items").children().eq(0)).start({ x: 325, y: 305 }).down().move(100, 100);

    // assert
    this.checkPosition(420, 400, assert, $("#items").children().eq(0));
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
    $cloneElement = $("body").children(".dx-draggable-dragging").children("#draggable");
    assert.strictEqual($cloneElement.length, 1, "cloned element");
    assert.ok($cloneElement.parent().hasClass("dx-draggable-dragging"), "parent of cloned element has dragging class");
    assert.ok(this.$element.hasClass("dx-draggable-source"), "element has source class");
    assert.notOk(this.$element.hasClass("dx-draggable-dragging"), "original element hasn't dragging class");
    assert.notOk($cloneElement.hasClass("dx-draggable-source"), "cloned element hasn't source class");
    assert.ok($cloneElement.parent().hasClass("dx-draggable-clone"), "cloned element has dragging class");
    assert.strictEqual($cloneElement.parent().css("z-index"), "2147483647", "z-index of the cloned element");
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
    $cloneElement = $("body").children(".dx-draggable-dragging").children("#draggable");
    assert.strictEqual($cloneElement.length, 1, "there is a cloned element");

    // act
    this.pointer.up();

    // assert
    $cloneElement = $("body").children(".dx-draggable-dragging").children("#draggable");
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
    $cloneElement = $("body").children(".dx-draggable-dragging").children("#draggable");
    assert.strictEqual($cloneElement.length, 1, "there is a cloned element");

    // act
    this.draggableInstance.dispose();

    // assert
    $cloneElement = $("body").children(".dx-draggable-dragging").children("#draggable");
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
    this.checkPosition(310, 310, assert, $("body").children(".dx-draggable-dragging").children("#draggable"));
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
    assert.strictEqual($("body").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children(".dx-draggable-dragging").children("#draggable").length, 1, "there is a cloned element");
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
    this.checkPosition(310, 310, assert, $("#other").children(".dx-draggable-dragging").children("#draggable"));
});

QUnit.test("Remove element from the container after the drop end", function(assert) {
    // arrange
    this.createDraggable({
        clone: true,
        container: "#other"
    });

    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children(".dx-draggable-dragging").children("#draggable").length, 1, "there is a cloned element");

    // act
    this.pointer.up();

    // assert
    assert.strictEqual($("body").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
});

QUnit.test("Remove element from the container when disposing", function(assert) {
    // arrange
    this.createDraggable({
        clone: true,
        container: "#other"
    });

    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children(".dx-draggable-dragging").children("#draggable").length, 1, "there is a cloned element");

    // act
    this.draggableInstance.dispose();

    // assert
    assert.strictEqual($("body").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
    assert.strictEqual($("#other").children(".dx-draggable-dragging").children("#draggable").length, 0, "there isn't a cloned element");
});


QUnit.module("dragTemplate", moduleConfig);

QUnit.test("Set dragTemplate", function(assert) {
    // arrange
    var template = sinon.spy(function() {
        return $("<div id='myDragElement'/>").text("test");
    });

    this.createDraggable({
        dragTemplate: template
    });

    // act
    this.pointer.down().move(10, 10);

    // assert
    assert.strictEqual($("body").children(".dx-draggable-dragging").children("#myDragElement").length, 1, "there is a drag element");
    assert.strictEqual(template.callCount, 1, "template is called");
    assert.deepEqual($(template.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "args[0].itemElement");
    assert.deepEqual($(template.getCall(0).args[1]).get(0), $(viewPort.value()).children(".dx-draggable-dragging").get(0), "args[1] - container");
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
    assert.strictEqual($("#myDragElement").length, 1, "there is a cloned element");

    // act
    this.pointer.up();

    // assert
    assert.strictEqual($("#myDragElement").length, 0, "there isn't a cloned element");
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
    assert.strictEqual($("#myDragElement").length, 1, "there is a cloned element");

    // act
    this.draggableInstance.dispose();

    // assert
    assert.strictEqual($("#myDragElement").length, 0, "there isn't a cloned element");
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
    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.down().move(0, 240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.move(0, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 1, "scrollTop");

    this.pointer.down().move(0, 4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 6, "scrollTop");

    this.pointer.down().move(0, 4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 23, "scrollTop");

    this.pointer.move(0, -239);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 23, "scrollTop");

    this.pointer.move(0, -1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 22, "scrollTop");

    this.pointer.down().move(0, -4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 17, "scrollTop");

    this.pointer.down().move(0, -4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
});

QUnit.test("onDragMove should be fired during scrolling", function(assert) {
    // arrange
    var onDragMoveSpy = sinon.spy();

    this.createDraggable({
        scrollSensitivity: 10,
        onDragMove: onDragMoveSpy,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.down().move(0, 240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.down().move(0, 1);

    for(let i = 1; i < 10; i++) {
        this.clock.tick(10);

        assert.equal(onDragMoveSpy.callCount, i + 2, "onDragMove called");
    }
});

QUnit.test("Horizontal scrolling", function(assert) {
    // arrange
    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");

    this.pointer.down().move(240, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");

    this.pointer.move(1, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 1, "scrollLeft");

    this.pointer.down().move(4, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 6, "scrollLeft");

    this.pointer.down().move(4, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 23, "scrollLeft");

    this.pointer.move(-239, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 23, "scrollLeft");

    this.pointer.move(-1, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 22, "scrollLeft");

    this.pointer.down().move(-4, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 17, "scrollLeft");

    this.pointer.down().move(-4, 0);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
});

QUnit.test("Horizontal and vertical scrolling", function(assert) {
    // arrange
    this.createDraggable({
        scrollSensitivity: 10,
        scrollSpeed: 20
    });

    // act, assert
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");

    this.pointer.down().move(240, 240);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");

    this.pointer.move(1, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 1, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 1, "scrollLeft");

    this.pointer.down().move(4, 4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 6, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 6, "scrollLeft");

    this.pointer.down().move(4, 4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 23, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 23, "scrollLeft");

    this.pointer.move(-239, -239);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 23, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 23, "scrollLeft");

    this.pointer.move(-1, -1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 22, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 22, "scrollLeft");

    this.pointer.down().move(-4, -4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 17, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 17, "scrollLeft");

    this.pointer.down().move(-4, -4);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");
    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
});

QUnit.test("Vertical scrolling should not start if on drag start cursor is close to the scrollable border", function(assert) {
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

QUnit.test("Horizontal scrolling should not start if on drag start cursor is close to the scrollable border", function(assert) {
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

    assert.deepEqual(scrollView.scrollOffset(), { top: 1, left: 1 }, "scrollOffset");

    this.pointer.move(-1, -1);
    this.clock.tick(10);

    assert.deepEqual(scrollView.scrollOffset(), { top: 1, left: 1 }, "scrollOffset");
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

    this.pointer.move(245, 245).down();
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.move(-5, -5);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 0, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 0, "scrollTop");

    this.pointer.move(1, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 1, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 1, "scrollTop");

    this.pointer.up().move(1, 1);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 1, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 1, "scrollTop");

    this.pointer.down().move(3, 3);
    this.clock.tick(10);

    assert.equal($("#scrollable").scrollLeft(), 1, "scrollLeft");
    assert.equal($("#scrollable").scrollTop(), 1, "scrollTop");
});

QUnit.module("cursorOffset", moduleConfig);

QUnit.test("set cursorOffset as string", function(assert) {
    // arrange
    this.createDraggable({
        cursorOffset: "20 20"
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    assert.strictEqual(this.$element.length, 1, "there is a drag element");
    assert.deepEqual(this.$element.offset(), { left: 30, top: 30 }, "drag element offset");
});

QUnit.test("set cursorOffset as object", function(assert) {
    // arrange
    this.createDraggable({
        cursorOffset: {
            x: 20,
            y: 20
        }
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    assert.strictEqual(this.$element.length, 1, "there is a drag element");
    assert.deepEqual(this.$element.offset(), { left: 30, top: 30 }, "drag element offset");
});

QUnit.test("set cursorOffset as function", function(assert) {
    // arrange
    let cursorOffsetSpy = sinon.spy(() => { return { x: 20, y: 20 }; });

    this.createDraggable({
        cursorOffset: cursorOffsetSpy
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    assert.strictEqual(this.$element.length, 1, "there is a drag element");
    assert.deepEqual(this.$element.offset(), { left: 30, top: 30 }, "drag element offset");
    assert.deepEqual($(cursorOffsetSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "item element");
    assert.deepEqual($(cursorOffsetSpy.getCall(0).args[0].dragElement).get(0), this.$element.get(0), "drag element");
});

QUnit.test("set cursorOffset as string when clone is true", function(assert) {
    // arrange
    let $dragElement;

    this.createDraggable({
        cursorOffset: "20 20",
        clone: true
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    $dragElement = $("body").children(".dx-draggable-dragging");
    assert.strictEqual($dragElement.length, 1, "there is a drag element");
    assert.deepEqual($dragElement.offset(), { left: 30, top: 30 }, "drag element offset");
});

QUnit.test("set cursorOffset as object when clone is true", function(assert) {
    // arrange
    let $dragElement;

    this.createDraggable({
        cursorOffset: {
            x: 20,
            y: 20
        },
        clone: true
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    $dragElement = $("body").children(".dx-draggable-dragging");
    assert.strictEqual($dragElement.length, 1, "there is a drag element");
    assert.deepEqual($dragElement.offset(), { left: 30, top: 30 }, "drag element offset");
});

QUnit.test("set cursorOffset as function when clone is true", function(assert) {
    // arrange
    let $dragElement,
        cursorOffsetSpy = sinon.spy(() => { return { x: 20, y: 20 }; });

    this.createDraggable({
        cursorOffset: cursorOffsetSpy,
        clone: true
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    $dragElement = $("body").children(".dx-draggable-dragging");
    assert.strictEqual($dragElement.length, 1, "there is a drag element");
    assert.deepEqual($dragElement.offset(), { left: 30, top: 30 }, "drag element offset");
    assert.deepEqual($(cursorOffsetSpy.getCall(0).args[0].itemElement).get(0), this.$element.get(0), "item element");
    assert.deepEqual($(cursorOffsetSpy.getCall(0).args[0].dragElement).get(0), $dragElement.get(0), "drag element");
});

QUnit.test("cursorOffset should be correct when the 'y' coordinate is zero", function(assert) {
    // arrange
    let $dragElement;

    this.createDraggable({
        cursorOffset: {
            x: 20,
            y: 0
        },
        clone: true
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    $dragElement = $("body").children(".dx-draggable-dragging");
    assert.strictEqual($dragElement.length, 1, "there is a drag element");
    assert.deepEqual($dragElement.offset(), { left: 30, top: 50 }, "drag element offset");
});

QUnit.test("cursorOffset should be correct when the 'x' coordinate is zero", function(assert) {
    // arrange
    let $dragElement;

    this.createDraggable({
        cursorOffset: {
            x: 0,
            y: 20
        },
        clone: true
    });

    // act
    this.pointer.down(40, 40).move(10, 10);

    // assert
    $dragElement = $("body").children(".dx-draggable-dragging");
    assert.strictEqual($dragElement.length, 1, "there is a drag element");
    assert.deepEqual($dragElement.offset(), { left: 50, top: 30 }, "drag element offset");
});

QUnit.test("cursorOffset should be correct when the dragTemplate is specified", function(assert) {
    // arrange
    this.$element.width(150).height(150);

    this.createDraggable({
        cursorOffset: {
            x: 20,
            y: 20
        },
        dragTemplate: function(options) {
            return $(options.itemElement).clone().width(50).height(50);
        }
    });

    // act
    this.pointer.down(100, 100).move(10, 10);

    // assert
    const $dragElement = $("body").children(".dx-draggable-dragging");
    assert.deepEqual($dragElement.offset(), { left: 90, top: 90 }, "drag element offset");
});

QUnit.test("cursorOffset should be correct when 'y' coordinate isn't set and dragTemplate is specified", function(assert) {
    // arrange
    this.$element.width(150).height(150);

    this.createDraggable({
        cursorOffset: {
            x: 20
        },
        dragTemplate: function(options) {
            return $(options.itemElement).clone().width(50).height(50);
        }
    });

    // act
    this.pointer.down(100, 100).move(10, 10);

    // assert
    const $dragElement = $("body").children(".dx-draggable-dragging");
    assert.deepEqual($dragElement.offset(), { left: 90, top: 10 }, "drag element offset");
});

QUnit.test("cursorOffset should be correct when 'x' coordinate isn't set and dragTemplate is specified", function(assert) {
    // arrange
    this.$element.width(150).height(150);

    this.createDraggable({
        cursorOffset: {
            y: 20
        },
        dragTemplate: function(options) {
            return $(options.itemElement).clone().width(50).height(50);
        }
    });

    // act
    this.pointer.down(100, 100).move(10, 10);

    // assert
    const $dragElement = $("body").children(".dx-draggable-dragging");
    assert.deepEqual($dragElement.offset(), { left: 10, top: 90 }, "drag element offset");
});
