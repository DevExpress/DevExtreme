import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";
import viewPort from "core/utils/view_port";

import "common.css!";
import "ui/sortable";

viewPort.value($("body").css({ margin: "0px", padding: "0px", height: "600px" }).addClass("dx-viewport"));

QUnit.testStart(function() {
    let markup =
        `<div id="items" style="display: inline-block; vertical-align: top; width: 300px; height: 250px; position: relative; background: grey;">
            <div id="item1" class="draggable" style="width: 300px; height: 30px; background: yellow;">item1</div>
            <div id="item2" class="draggable" style="width: 300px; height: 30px; background: red;">item2</div>
            <div id="item3" class="draggable" style="width: 300px; height: 30px; background: blue;">item3</div>
        </div>
        <div id="items2" style="display: inline-block; vertical-align: top; width: 300px; height: 250px; position: relative; background: grey;">
            <div id="item4" class="draggable" style="width: 300px; height: 30px; background: yellow;">item4</div>
            <div id="item5" class="draggable" style="width: 300px; height: 30px; background: red;">item5</div>
            <div id="item6" class="draggable" style="width: 300px; height: 30px; background: blue;">item6</div>
        </div>
        <div id="items3" style="vertical-align: top; width: 300px; height: 250px; position: relative; background: grey;">
        </div>`;

    $("#qunit-fixture").html(markup);
});

var SORTABLE_CLASS = "dx-sortable";

var moduleConfig = {
    beforeEach: function() {
        $("#qunit-fixture").addClass("qunit-fixture-visible");
        this.$element = $("#items");

        this.createSortable = (options) => {
            return this.sortableInstance = this.$element.dxSortable(options).dxSortable("instance");
        };
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
        filter: ".draggable"
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
        filter: ".draggable",
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
        filter: ".draggable"
    });

    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down().move(10, 0);

    // assert
    items = this.$element.children();
    assert.ok(items.eq(0).hasClass("dx-sortable-placeholder"), "element has right class");

    // act
    pointerMock($dragItemElement).up();

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
        filter: ".draggable"
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
        filter: ".draggable"
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
        filter: ".draggable",
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
        filter: ".draggable",
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
        filter: ".draggable"
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

QUnit.test("onDragChange - check args when dragging an item down", function(assert) {
    // arrange
    let items,
        args,
        onDragChange = sinon.spy();


    this.createSortable({
        filter: ".draggable",
        onDragChange: onDragChange
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(0), "source element");
    assert.strictEqual(args[0].fromIndex, 0, "fromIndex");
    assert.strictEqual(args[0].toIndex, 1, "toIndex");
});

QUnit.test("onDragChange - check args when dragging an item up", function(assert) {
    // arrange
    let items,
        args,
        onDragChange = sinon.spy();


    this.createSortable({
        filter: ".draggable",
        onDragChange: onDragChange
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(2)).start().down().move(0, 30);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(2), "source element");
    assert.strictEqual(args[0].fromIndex, 2, "fromIndex");
    assert.strictEqual(args[0].toIndex, 1, "toIndex");
});

QUnit.test("onDragChange - check args when dragging to last position", function(assert) {
    // arrange
    let items,
        args,
        onDragChange = sinon.spy();

    this.createSortable({
        filter: ".draggable",
        onDragChange: onDragChange
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 90);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(0), "source element");
    assert.strictEqual(args[0].fromIndex, 0, "fromIndex");
    assert.strictEqual(args[0].toIndex, 2, "toIndex");
});

QUnit.test("'onDragChange' option changing", function(assert) {
    // arrange
    let args,
        items,
        onDragChange = sinon.spy();

    this.createSortable({
        filter: ".draggable"
    });

    items = this.$element.children();

    // act
    this.sortableInstance.option("onDragChange", onDragChange);

    // arrange
    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(0), "source element");
    assert.strictEqual(args[0].fromIndex, 0, "fromIndex");
    assert.strictEqual(args[0].toIndex, 1, "toIndex");
});

QUnit.test("'onDragChange' event - not drag item when eventArgs.cancel is true", function(assert) {
    // arrange
    let items,
        $dragItemElement;

    this.createSortable({
        filter: ".draggable",
        onDragChange: function(e) {
            e.cancel = true;
        }
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    items = this.$element.children();
    assert.strictEqual(items.eq(0).attr("id"), "item1", "first item");
    assert.strictEqual(items.eq(1).attr("id"), "item2", "second item");
    assert.strictEqual(items.eq(2).attr("id"), "item3", "third item");
});

QUnit.test("onDragEnd - check args when dragging an item down", function(assert) {
    // arrange
    let items,
        args,
        onDragEnd = sinon.spy();


    this.createSortable({
        filter: ".draggable",
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(0), "source element");
    assert.strictEqual(args[0].fromIndex, 0, "fromIndex");
    assert.strictEqual(args[0].toIndex, 1, "toIndex");
});

QUnit.test("onDragEnd - check args when dragging an item up", function(assert) {
    // arrange
    let items,
        args,
        onDragEnd = sinon.spy();


    this.createSortable({
        filter: ".draggable",
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(2)).start().down().move(0, 30).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(2), "source element");
    assert.strictEqual(args[0].fromIndex, 2, "fromIndex");
    assert.strictEqual(args[0].toIndex, 1, "toIndex");
});

QUnit.test("onDragEnd - check args when dragging to last position", function(assert) {
    // arrange
    let items,
        args,
        onDragEnd = sinon.spy();

    this.createSortable({
        filter: ".draggable",
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 90).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].sourceElement).get(0), items.get(0), "source element");
    assert.strictEqual(args[0].fromIndex, 0, "fromIndex");
    assert.strictEqual(args[0].toIndex, 2, "toIndex");
});

QUnit.test("onDragEnd with eventArgs.cancel is true - the draggable element should not change position", function(assert) {
    // arrange
    let items;

    this.createSortable({
        filter: ".draggable",
        placeholderTemplate: function() {
            return $("<div/>").text("test");
        },
        onDragEnd: function(e) {
            e.cancel = true;
        }
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

    // assert
    items = this.$element.children();
    assert.strictEqual(items.eq(0).attr("id"), "item1", "first item");
    assert.strictEqual(items.eq(1).attr("id"), "item2", "second item");
    assert.strictEqual(items.eq(2).attr("id"), "item3", "third item");
});


QUnit.module("Cross-Component Drag and Drop", {
    createComponent: function(componentName, options, $element) {
        let instance = $element[componentName](options)[componentName]("instance");
        this.instances.push(instance);
        return instance;
    },
    beforeEach: function() {
        $("#qunit-fixture").addClass("qunit-fixture-visible");

        this.instances = [];
        this.createSortable = this.createComponent.bind(this, "dxSortable");
        this.createDraggable = this.createComponent.bind(this, "dxDraggable");
    },
    afterEach: function() {
        $("#qunit-fixture").removeClass("qunit-fixture-visible");
        this.instances.forEach((instance) => {
            instance.dispose();
        });
    }
});

QUnit.test("Dragging item to another the sortable widget", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");
    assert.strictEqual(items1.filter("#item1").length, 0, "first list - first item is removed");
    assert.strictEqual(items2.filter("#item1").length, 1, "second list - first item of the first list was added");
});

QUnit.test("Dragging item to another the sortable widget when group as object", function(assert) {
    // arrange
    let items1,
        items2,
        group = {};

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: group
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: group
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");
    assert.strictEqual(items1.filter("#item1").length, 0, "first list - first item is removed");
    assert.strictEqual(items2.filter("#item1").length, 1, "second list - first item of the first list was added");
});

QUnit.test("Dragging item should not work when another the sortable widget does not have a group", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, "first list - item count");
    assert.strictEqual(items2.length, 3, "second list - item count");
});

QUnit.test("Dropping item to another the sortable widget", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");
    assert.strictEqual(items1.filter("#item1").length, 0, "first list - first item is removed");
    assert.strictEqual(items2.filter("#item1").length, 1, "second list - first item of the first list was added");
});

QUnit.test("Dragging item to another the sortable widget when placeholderTemplate is specified", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared",
        placeholderTemplate: function() {
            return $("<div id='myPlaceholder'/>").text("Test");
        }
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");
    assert.ok(items2.first().hasClass("dx-sortable-placeholder"), 1, "second list - first item is a placeholder");
    assert.strictEqual(items2.first().find("#myPlaceholder").length, 1, "second list - there is custom placeholder");
});

QUnit.test("Dropping item to another the sortable widget when placeholderTemplate is specified", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared",
        placeholderTemplate: function() {
            return $("<div id='myPlaceholder'/>").text("Test");
        }
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");
    assert.strictEqual(items1.filter("#item1").length, 0, "first list - first item is removed");
    assert.strictEqual(items2.filter("#item1").length, 1, "second list - first item of the first list was added");
});

QUnit.test("Dragging items between sortable widgets", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = $(sortable1.$element()).children();
    items2 = $(sortable2.$element()).children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");

    // act
    pointerMock(sortable2.$element().children().eq(1)).start({ x: 304, y: 0 }).down().move(-250, 30).move(-50, 0).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, "first list - item count");
    assert.strictEqual(items2.length, 3, "second list - item count");
    assert.strictEqual(items1.eq(0).attr("id"), "item2", "first list - first item");
    assert.strictEqual(items1.eq(1).attr("id"), "item4", "first list - second item");
    assert.strictEqual(items2.eq(0).attr("id"), "item1", "second list - first item");
    assert.strictEqual(items2.eq(1).attr("id"), "item5", "second list - second item");
});

QUnit.test("Update item points when dragging an item to another the sortable widget", function(assert) {
    // arrange
    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    assert.deepEqual(sortable2._dragInfo.itemPoints[0].top, 30, "top of the first point");
    assert.deepEqual(sortable2._dragInfo.itemPoints[0].index, 0, "index of the first point");
    assert.deepEqual(sortable2._dragInfo.itemPoints[1].top, 60, "top of the second point");
    assert.deepEqual(sortable2._dragInfo.itemPoints[1].index, 1, "index of the second point");
    assert.deepEqual(sortable2._dragInfo.itemPoints[2].top, 90, "top of the third point");
    assert.deepEqual(sortable2._dragInfo.itemPoints[2].index, 2, "index of the third point");
});

QUnit.test("Drag and drop item from draggable to sortable", function(assert) {
    // arrange
    let items1, items2;

    let draggable = this.createDraggable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(draggable.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = draggable.$element().children();
    items2 = sortable.$element().children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 4, "second list - item count");
    assert.strictEqual(items1.filter("#item1").length, 0, "first list - draggable item is removed");
    assert.strictEqual(items2.filter("#item1").length, 1, "second list - item from second list");
    assert.strictEqual(items2.first().attr("id"), "item1", "second list - new item in first position");
});

QUnit.test("Drag and drop item from sortable to draggable", function(assert) {
    // arrange
    let items1, items2;

    let draggable = this.createDraggable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items2"));

    // act
    pointerMock(sortable.$element().children().eq(0)).start({ x: 304, y: 0 }).down().move(-250, 0).move(-50, 0).up();

    // assert
    items1 = draggable.$element().children();
    items2 = sortable.$element().children();
    assert.strictEqual(items1.length, 4, "first list - item count");
    assert.strictEqual(items2.length, 2, "second list - item count");
    assert.strictEqual(items1.filter("#item4").length, 1, "first list - item from second list");
    assert.strictEqual(items1.last().attr("id"), "item4", "first list - new item in last position");
    assert.strictEqual(items2.filter("#item4").length, 0, "second list - draggable item is removed");
});

QUnit.test("Drag and drop item to empty sortable", function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items3"));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(0, 300).move(0, 10).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, "first list - item count");
    assert.strictEqual(items2.length, 1, "second list - item count");
    assert.strictEqual(items1.filter("#item1").length, 0, "first list - draggable item is removed");
    assert.strictEqual(items2.filter("#item1").length, 1, "second list - item from first list");
});

QUnit.test("Dragging an item to another sortable and back when it is alone in the collection", function(assert) {
    // arrange
    let items1, items2;

    $("#items3").append("<div id='item7' class='draggable' style='width: 300px; height: 30px; background: blue;'>item7</div>");

    let sortable1 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items"));

    let sortable2 = this.createSortable({
        filter: ".draggable",
        group: "shared"
    }, $("#items3"));

    // act
    let pointer = pointerMock(sortable2.$element().children().eq(0)).start({ x: 0, y: 310 }).down().move(0, -300).move(0, -10);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 4, "first list - item count");
    assert.strictEqual(items1.first().attr("id"), "item7", "first list - item from second list");
    assert.strictEqual(items2.length, 0, "second list - item count");

    // act
    pointer.move(0, 300).move(0, 10);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, "first list - item count");
    assert.strictEqual(items2.length, 1, "second list - item count");
    assert.strictEqual(items2.first().attr("id"), "item7", "second list - first item");
});
