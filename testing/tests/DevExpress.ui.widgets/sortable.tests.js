import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";
import viewPort from "core/utils/view_port";
import { noop } from "core/utils/common";

import "common.css!";
import "ui/sortable";

viewPort.value($("body").css({ margin: "0px", padding: "0px", height: "600px" }).addClass("dx-viewport"));

QUnit.testStart(function() {
    let markup =
        `<div id="items" style="width: 300px; height: 250px; position: relative; background: grey;">
            <div id="item1" class="draggable" style="width: 50px; height: 30px; background: yellow;"></div>
            <div id="item2" class="draggable" style="width: 50px; height: 30px; background: red;"></div>
            <div id="item3" class="draggable" style="width: 50px; height: 30px; background: blue;"></div>
        </div>`;

    $("#qunit-fixture").html(markup);
});

var SORTABLE_CLASS = "dx-sortable";

var setupDraggable = function(that, $element) {
    $("#qunit-fixture").addClass("qunit-fixture-visible");

    that.$element = $element;
    that.createSortable = function(options) {
        return that.sortableInstance = that.$element.dxSortable(options).dxSortable("instance");
    };
    that.pointer = pointerMock(that.$element).start();

    that.checkPosition = function(left, top, assert, $element) {
        assert.deepEqual(($element || that.$element).offset(), { left: left, top: top });
    };
};

var moduleConfig = {
    beforeEach: function() {
        setupDraggable(this, $("#items"));
    },
    afterEach: function() {
        $("#qunit-fixture").removeClass("qunit-fixture-visible");
        this.sortableInstance && this.sortableInstance.dispose();
    }
};


QUnit.module("rendering", moduleConfig);

QUnit.test("Element has class", function(assert) {
    assert.ok(this.createSortable().$element().hasClass(SORTABLE_CLASS));
});


QUnit.module("placeholder", moduleConfig);

QUnit.test("initial placeholder", function(assert) {
    // arrange
    let items,
        $placeholder,
        $dragItemElement;

    this.createSortable({
        items: ".draggable"
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // assert
    assert.strictEqual(items.length, 3, "item count");

    // act
    pointerMock($dragItemElement).start().down().move(10, 0);

    // assert
    items = this.$element.children();
    $placeholder = items.eq(0);
    assert.strictEqual(items.length, 3, "item count");
    assert.ok($placeholder.hasClass("dx-sortable-placeholder"), "there is a placeholder");
});

QUnit.test("initial placeholder when placeholderTemplate is specified", function(assert) {
    // arrange
    let items,
        $placeholder,
        $dragItemElement,
        placeholderTemplate = sinon.spy(function() {
            return $("<div id='myPlaceholder'/>").text("Test");
        });

    this.createSortable({
        items: ".draggable",
        placeholderTemplate: placeholderTemplate
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 25);

    // assert
    items = this.$element.children();
    assert.strictEqual(items.length, 3, "item count");
    assert.strictEqual(this.$element.find("#myPlaceholder").length, 0, "there isn't a custom placeholder");

    pointerMock($dragItemElement).up();

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    items = this.$element.children();
    $placeholder = items.eq(2);
    assert.strictEqual(items.length, 4, "item count");
    assert.strictEqual($placeholder.children("#myPlaceholder").length, 1, "there is a custom placeholder");
    assert.ok($placeholder.hasClass("dx-sortable-placeholder"), "element has right class");
});

QUnit.test("placeholder-class toggling", function(assert) {
    // arrange
    this.createSortable({
        items: ".draggable"
    });

    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down().move(10, 0);

    // assert
    items = this.$element.children();
    assert.ok(items.eq(0).hasClass("dx-sortable-placeholder"), "element has right class");

    // act
    this.pointer.up();

    // assert
    items = this.$element.children();
    assert.ok(!items.eq(0).hasClass("dx-sortable-placeholder"), "element has not appropriate class");
});

QUnit.test("Change placeholder position after dragging", function(assert) {
    // arrange
    let items,
        $placeholder,
        $dragItemElement;

    this.createSortable({
        items: ".draggable"
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // assert
    assert.strictEqual(items.length, 3, "item count");

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    items = this.$element.children();
    $placeholder = items.eq(1);
    assert.strictEqual(items.length, 3, "item count");
    assert.strictEqual($placeholder.attr("id"), "item1", "first item is a placeholder");
    assert.ok($placeholder.hasClass("dx-sortable-placeholder"), "has placeholder class");
});

QUnit.test("Drop when placeholderTemplate isn't specified", function(assert) {
    // arrange
    let items,
        $dragItemElement;

    this.createSortable({
        items: ".draggable"
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30).up();

    // assert
    items = this.$element.children();
    assert.strictEqual(items.eq(0).attr("id"), "item2", "second item");
    assert.strictEqual(items.eq(1).attr("id"), "item1", "first item");
    assert.strictEqual(items.eq(2).attr("id"), "item3", "third item");
});

QUnit.test("Drop when placeholderTemplate is specified", function(assert) {
    // arrange
    let items,
        $dragItemElement,
        placeholderTemplate = sinon.spy(function() {
            return $("<div id='myPlaceholder'/>").text("Test");
        });

    this.createSortable({
        items: ".draggable",
        placeholderTemplate: placeholderTemplate
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30).up();

    // assert
    items = this.$element.children();
    assert.strictEqual(items.eq(0).attr("id"), "item2", "second item");
    assert.strictEqual(items.eq(1).attr("id"), "item1", "first item");
    assert.strictEqual(items.eq(2).attr("id"), "item3", "third item");
});

QUnit.test("Remove my placeholder after the drop end", function(assert) {
    // arrange
    this.createSortable({
        items: ".draggable",
        placeholderTemplate: function() {
            return $("<div id='myPlaceholder'/>").text("Test");
        }
    });

    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    assert.strictEqual(this.$element.children(".dx-sortable-placeholder").length, 1, "there is a placeholder element");

    // act
    pointerMock($dragItemElement).up();

    // assert
    assert.strictEqual(this.$element.children(".dx-sortable-placeholder").length, 0, "there isn't a placeholder element");
});

QUnit.test("The placeholder should be correct after drag and drop items", function(assert) {
    // arrange
    let items,
        $placeholder;

    this.createSortable({
        items: ".draggable"
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down().move(10, 0);

    // assert
    $placeholder = items.eq(0);
    assert.ok($placeholder.hasClass("dx-sortable-placeholder"), "there is a placeholder");
    assert.strictEqual($placeholder.attr("id"), "item1", "placeholder id");

    // arrange
    pointerMock(items.eq(0)).up();

    // act
    pointerMock(items.eq(1)).start().down().move(10, 0);

    $placeholder = items.eq(1);
    assert.ok($placeholder.hasClass("dx-sortable-placeholder"), "there is a placeholder");
    assert.strictEqual($placeholder.attr("id"), "item2", "placeholder id");
});


QUnit.module("Events", moduleConfig);

var checkCallback = function(sortable, spy, assert) {
    assert.ok(spy.calledOnce, "callback fired");

    var firstCall = spy.getCall(0),
        arg = firstCall.args[0],
        context = firstCall.thisValue;

    assert.strictEqual(context, sortable, "context equals to component");
    assert.strictEqual(arg.component, sortable);
    assert.strictEqual($(arg.element)[0], this.$element[0]);
};

QUnit.test("'onDragChange' callback fired", function(assert) {
    // arrange
    var callbackSpy = sinon.spy(noop),
        options = {
            items: ".draggable",
            onDragChange: callbackSpy
        },
        sortable;

    sortable = this.createSortable(options);

    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    checkCallback.call(this, sortable, callbackSpy, assert);
});

QUnit.test("'onDragChange' option changing", function(assert) {
    // arrange
    var callbackSpy = sinon.spy(noop),
        options = {
            items: ".draggable"
        },
        sortable;

    sortable = this.createSortable(options);

    // act
    sortable.option("onDragChange", callbackSpy);

    // arrange
    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    checkCallback.call(this, sortable, callbackSpy, assert);
});

QUnit.test("'onDragChange' event - hide placeholder when eventArgs.cancel is true", function(assert) {
    // arrange
    let items,
        $dragItemElement;

    this.createSortable({
        items: ".draggable",
        onDragChange: function(e) {
            e.cancel = true;
        }
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30).up();

    // assert
    items = this.$element.children();
    assert.strictEqual(items.eq(0).attr("id"), "item1", "second item");
    assert.strictEqual(items.eq(1).attr("id"), "item2", "first item");
    assert.strictEqual(items.eq(2).attr("id"), "item3", "third item");
});
