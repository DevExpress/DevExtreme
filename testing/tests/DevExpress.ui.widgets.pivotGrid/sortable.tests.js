import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";

var HORIZONTAL_WIDTH_LARGE = 1500,
    HORIZONTAL_WIDTH_SMALL = 900;

import "common.css!";
import "ui/pivot_grid/ui.sortable";
import "ui/scroll_view/ui.scrollable";

QUnit.testStart(function() {
    var markup =
        '<style>\
            .test-item {\
                border: 1px solid black;\
                height: 10px;\
                width: 200px;\
            }\
            .test-container {\
                border: 1px solid black;\
            }\
            .hidden-source {\
                display: none;\
            }\
            .group {\
                border: 1px solid red;\
            }\
            .horizontal .test-item {\
                display: inline-block;\
            }\
            #qunit-fixture {\
                left: 0;\
                top: 0;\
            }\
        </style>\
        <div id="sortable" style="height: 300px; width: 300px" class="test-items">\
            <div class="test-container">\
                <div class="test-item">1</div>\
                <div class="test-item">2</div>\
                <div class="test-item">3</div>\
                <div class="test-item">4</div>\
            </div>\
        </div>\
        \
        <div class="dx-swatch-1">\
            <div id="swatchSortable" style="height: 300px; width: 300px" class="test-items">\
                <div class="test-container">\
                    <div class="test-item">1</div>\
                    <div class="test-item">2</div>\
                    <div class="test-item">3</div>\
                    <div class="test-item">4</div>\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);

});

function createHorizontalMarkUp(width, addItems, createTable) {

    $("#sortable").css("width", width);

    if(addItems) {
        $("<div>").addClass("test-item").text("5").appendTo(".test-container");
        $("<div>").addClass("test-item").text("6").appendTo(".test-container");
    }

    $.each($("#sortable").find(".test-item"), function(_, item) {
        $(item).css("display", "inline-block");
        if(!createTable) {
            return;
        }

        var td = $("<span>").appendTo(".test-container");
        $(item).appendTo(td);

    });
}


QUnit.module("sortable without containers");

QUnit.test("sortable render without parameters", function(assert) {
    var $sortable = $("#sortable").dxSortableOld({});

    assert.ok($sortable.hasClass("dx-sortable-old"), "dx-sortable-old class attached");
});

QUnit.test("vertical dragging", function(assert) {
    var changedArgs,
        draggingArgs = [];
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onDragging: function(e) {
            draggingArgs.push(e);
        },
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "1", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.equal(draggingArgs.length, 2, "fired two times");

    assert.strictEqual(draggingArgs[0].sourceIndex, 0, "source index");
    assert.strictEqual(draggingArgs[0].targetIndex, -1, "target index"); // TODO: real index

    assert.strictEqual(draggingArgs[1].sourceIndex, 0, "source index");
    assert.strictEqual(draggingArgs[1].targetIndex, -1, "target index"); // TODO: real index

    assert.strictEqual(changedArgs.sourceIndex, 0, "source index");
    assert.strictEqual(changedArgs.targetIndex, 2, "target index");
});

QUnit.test("set onChanged arg's fields", function(assert) {
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            e.removeSourceElement = false,
            e.removeTargetElement = true,
            e.removeSourceClass = false;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22)
        .up();

    assert.ok($("#sortable").find(".dx-drag-source").length);
    assert.equal($("#sortable").find(".dx-drag-target").length, 0);
});

QUnit.test("horizontal dragging - right", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE);

    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        direction: "horizontal",
        itemContainerSelector: ".test-container"
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left + 400, offset.top)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "1", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");
});

// QUnit.test("horizontal dragging between lines", function(assert) {
//    createHorizontalMarkUp(HORIZONTAL_WIDTH, true);

//    var $sortable = $("#sortable").dxSortableOld({
//        itemSelector: ".test-item",
//        itemContainerSelector: ".test-container",
//        direction: "auto"
//    });

//    var $item = $sortable.find(".test-item").eq(0);
//    var offset = $item.offset();

//    // act
//    pointerMock($item)
//        .start()
//        .down()
//        .move(offset.left + 3, offset.top + 3)
//        .move(offset.left + 350, offset.top + 15)
//        .up();

//    // assert
//    var $items = $sortable.find(".test-item");

//    assert.equal($items.length, 6, "item count");
//    assert.equal($items.eq(0).text(), "2", "item 0 text");
//    assert.equal($items.eq(1).text(), "3", "item 1 text");
//    assert.equal($items.eq(2).text(), "4", "item 2 text");
//    assert.equal($items.eq(3).text(), "5", "item 3 text");
//    assert.equal($items.eq(4).text(), "1", "item 4 text");
//    assert.equal($items.eq(5).text(), "6", "item 5 text");
// });

// QUnit.test("horizontal dragging between lines to the end of the first line", function(assert) {
//    createHorizontalMarkUp(HORIZONTAL_WIDTH, true);

//    var $sortable = $("#sortable").dxSortableOld({
//        itemSelector: ".test-item",
//        itemContainerSelector: ".test-container",
//        direction: "auto"
//    });

//    var $item = $sortable.find(".test-item").eq(0);
//    var offset = $item.offset();

//    // act
//    pointerMock($item)
//        .start()
//        .down()
//        .move(offset.left + 3, offset.top + 3)
//        .move(offset.left + 551, offset.top)
//        .up();

//    // assert
//    var $items = $sortable.find(".test-item");

//    assert.equal($items.length, 6, "item count");
//    assert.equal($items.eq(0).text(), "2", "item 0 text");
//    assert.equal($items.eq(1).text(), "3", "item 1 text");
//    assert.equal($items.eq(2).text(), "1", "item 2 text");
//    assert.equal($items.eq(3).text(), "4", "item 3 text");
//    assert.equal($items.eq(4).text(), "5", "item 4 text");
//    assert.equal($items.eq(5).text(), "6", "item 5 text");
// });

QUnit.test("dragging inside table", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE, true, true);

    var changedArgs,
        draggingArgs = [],
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            direction: "auto",
            itemContainerSelector: ".test-container",
            onDragging: function(e) {
                draggingArgs.push(e);
            },
            onChanged: function(e) {
                changedArgs = e;
            }
        });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left + 500, offset.top)
        .up();

    var $items = $sortable.find(".test-item");

    assert.equal(draggingArgs.length, 2, "fired two times");

    assert.strictEqual(draggingArgs[0].sourceIndex, 1, "source index");
    assert.strictEqual(draggingArgs[0].targetIndex, -1, "target index"); // TODO: real index

    assert.strictEqual(draggingArgs[1].sourceIndex, 1, "source index");
    assert.strictEqual(draggingArgs[1].targetIndex, -1, "target index"); // TODO: real index

    assert.strictEqual(changedArgs.sourceIndex, 1, "source index");
    assert.strictEqual(changedArgs.targetIndex, 4, "target index");

    assert.equal($items.length, 6, "item count");
    assert.equal($items.eq(0).text(), "1", "item 0 text");
    assert.equal($items.eq(1).text(), "3", "item 1 text");
    assert.equal($items.eq(2).text(), "4", "item 2 text");
    assert.equal($items.eq(3).text(), "2", "item 3 text");
    assert.equal($items.eq(4).text(), "5", "item 4 text");
    assert.equal($items.eq(5).text(), "6", "item 5 text");
});

QUnit.test("dragging move over half of item height", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 25)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "3", "item 1 text");
    assert.equal($items.eq(2).text(), "1", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.ok(changedArgs, "changed called");
    assert.strictEqual(changedArgs.sourceIndex, 0, "source index");
    assert.strictEqual(changedArgs.targetIndex, 3, "target index");
});

QUnit.test("dragging - to end of container", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 200)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "3", "item 1 text");
    assert.equal($items.eq(2).text(), "4", "item 2 text");
    assert.equal($items.eq(3).text(), "1", "item 3 text");

    assert.strictEqual(changedArgs.sourceIndex, 0, "source index");
    assert.strictEqual(changedArgs.targetIndex, 4, "target index");
});

QUnit.test("dragging - to end of container without dragend", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 200);

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 5, "item count");
    assert.equal($items.eq(0).text(), "1", "item 0 text");
    assert.equal($items.eq(1).text(), "2", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    var $draggable = $(".dx-drag");
    assert.ok($draggable.hasClass("test-item"));
    assert.ok($draggable.css("position"), "absolute");
    assert.ok($draggable.hasClass($sortable.dxSortableOld("instance").option("dragClass")));
    assert.ok($items.eq(4).hasClass($sortable.dxSortableOld("instance").option("targetClass")));
    assert.ok($items.eq(0).hasClass($sortable.dxSortableOld("instance").option("sourceClass")));

    assert.ok(!changedArgs, "change callback not called");
    assert.ok($sortable.hasClass($sortable.dxSortableOld("instance").option("targetClass")));
});

QUnit.test("dragging - out from container", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top - 400)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "1", "item 0 text");
    assert.equal($items.eq(1).text(), "2", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.ok(!changedArgs, "changed called");
});

QUnit.test("dragging - out from container without dragend", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top - 400);

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "1", "item 0 text");
    assert.equal($items.eq(1).text(), "2", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.equal($(".dx-drag.test-item").length, 1, "drag element exists");
    assert.ok($items.eq(0).hasClass($sortable.dxSortableOld("instance").option("sourceClass")));

    assert.ok(!$sortable.hasClass($sortable.dxSortableOld("instance").option("targetClass")));

    assert.ok(!changedArgs, "changed called");
});

QUnit.skip("dragging not allowed item", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".not-test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left + 5, offset.top + 25)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "1", "item 0 text");
    assert.equal($items.eq(1).text(), "2", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.ok(!$sortable.hasClass($sortable.dxSortableOld("instance").option("targetClass")));
    assert.ok(!changedArgs, "changed not called");
});

QUnit.test("dragging when no itemContainer", function(assert) {
    var changedArgs;
    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".no",
        onChanged: function(e) {
            changedArgs = e;
        }
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left + 5, offset.top + 25)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "1", "item 0 text");
    assert.equal($items.eq(1).text(), "2", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.ok(!changedArgs, "changed not called");
});

QUnit.test("dragging with color swatch", function(assert) {
    var $sortable = $("#swatchSortable").dxSortableOld({
        itemSelector: ".test-item",
        itemContainerSelector: ".test-container"
    });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5);

    // assert
    assert.equal($("body > .dx-swatch-1 > .test-item.dx-drag").length, 1, "Dragging item rendered in container with swatch class");
});


QUnit.module("'useIndicator' option");

QUnit.test("indicator is shown on right dragging", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE, true, true);

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1),
        $targetItem = $sortable.find(".dx-drag-target");
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left + 500, offset.top);

    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");
    assert.notOk($targetItem.is(":visible"));

    assert.ok(indicator.offset().left <= $sortable.find(".test-item").eq(5).offset().left, "indicator was rendered before 5 item");
    assert.ok(indicator.offset().left > $sortable.find(".test-item").eq(3).offset().left, "indicator was rendered after 4 item");
    assert.ok(indicator.hasClass("dx-position-indicator-horizontal"));
    assert.ok(!indicator.hasClass("dx-position-indicator-vertical"));
    assert.ok(!indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("indicator should not be shown on small dragging", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE, true, true);

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 153, offset.top + 3);

    indicator = $(".dx-position-indicator");

    assert.ok(!indicator.length, "indicator is rendered");
});

QUnit.test("indicator is shown on left dragging", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE, true, true);

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left - 3, offset.top + 3)
        .move(offset.left - 302, offset.top);

    indicator = $(".dx-position-indicator");


    assert.ok(indicator.length, "indicator is rendered");
    assert.ok(indicator.offset().left <= $sortable.find(".test-item").eq(1).offset().left, "indicator is rendered before 1 item");
});

QUnit.test("indicator is shown after last item dragging", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE * 2, true, true);

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left + 1500, offset.top);

    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");
    assert.ok(indicator.offset().left > $sortable.find(".test-item").eq(5).offset().left, "indicator was rendered after 4 item");
    assert.ok(indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("indicator was removed", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE * 2, true, true);

    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        direction: "auto",
        useIndicator: true,
        itemContainerSelector: ".test-container"
    });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left + 1500, offset.top)
        .up();

    assert.notOk($(".dx-position-indicator").length, "indicator is removed");
});

QUnit.test("remove indicator when item dragged out from container", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE * 2, true, true);

    var $sortable = $("#sortable").dxSortableOld({
        itemSelector: ".test-item",
        direction: "auto",
        useIndicator: true,
        itemContainerSelector: ".test-container"
    });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left - 3, offset.top + 3)
        .move(offset.left - 302, offset.top)
        .move(offset.left - 302, offset.top - 100);


    assert.strictEqual($(".dx-position-indicator").length, 0, "indicator is removed");
});

QUnit.test("indicator should be shown on dragging between groups", function(assert) {
    $("#sortable").width(1700).html("").append('<div group="group1" class="group">\
                                            <div class="test-container">\
                                                <div class="test-item" style="display: inline-block;">1</div>\
                                                <div class="test-item" style="display: inline-block;">2</div>\
                                                <div class="test-item" style="display: inline-block;">3</div>\
                                                <div class="test-item" style="display: inline-block;">4</div>\
                                            </div>\
                                        </div>');

    $("#sortable").append('<div group="group2" class="group">\
                                            <div class="test-container">\
                                                <div class="test-item" style="display: inline-block;">2-1</div>\
                                                <div class="test-item" style="display: inline-block;">2-2</div>\
                                                <div class="test-item" style="display: inline-block;">2-3</div>\
                                                <div class="test-item" style="display: inline-block;">2-4</div>\
                                            </div>\
                                        </div>');

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            groupSelector: ".group",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left, offset.top + 20);

    indicator = $(".dx-position-indicator");
    assert.ok(indicator.length);
});

QUnit.test("dragging to empty group", function(assert) {
    $("#sortable").width(1700).html("").append('<div group="group1" class="group">\
                                            <div class="test-container">\
                                                <div class="test-item" style="display: inline-block;">1</div>\
                                                <div class="test-item" style="display: inline-block;">2</div>\
                                                <div class="test-item" style="display: inline-block;">3</div>\
                                                <div class="test-item" style="display: inline-block;">4</div>\
                                            </div>\
                                        </div>');

    $("#sortable").append('<div group="group2" class="group">\
                                            <div class="test-container" style="height: 30px;"></div>\
                                        </div>');

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            groupSelector: ".group",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1);
    var offset = $item.offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 3)
        .move(offset.left, offset.top + 20);

    indicator = $(".dx-position-indicator");
    assert.ok(!indicator.length); // TODO: indicator should be shown
});

QUnit.test("indicator is shown on bottom dragging when items are set in two lines", function(assert) {
    createHorizontalMarkUp(HORIZONTAL_WIDTH_SMALL, true, true);

    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            direction: "auto",
            useIndicator: true,
            itemContainerSelector: ".test-container"
        });

    var $item = $sortable.find(".test-item").eq(1),
        $targetItem = $sortable.find(".dx-drag-target");
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left - 3, offset.top + 3)
        .move(offset.left - 103, offset.top + 15);

    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");
    assert.notOk($targetItem.is(":visible"));

    assert.ok(indicator.offset().left <= $sortable.find(".test-item").eq(5).offset().left, "indicator was rendered before 5 item");
    assert.ok(indicator.offset().left > $sortable.find(".test-item").eq(4).offset().left, "indicator was rendered after 4 item");
    assert.ok(indicator.hasClass("dx-position-indicator-horizontal"));
    assert.ok(!indicator.hasClass("dx-position-indicator-vertical"));
    assert.ok(!indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("indicator is shown on bottom dragging", function(assert) {
    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            itemContainerSelector: ".test-container",
            useIndicator: true
        });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22);

    // assert
    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");

    var $items = $sortable.find(".test-item");
    assert.ok(indicator.offset().top <= $items.eq(3).offset().top, "indicator was rendered before 2 item");
    assert.ok(indicator.offset().top > $items.eq(1).offset().top, "indicator was rendered after 1 item");
    assert.ok(!indicator.hasClass("dx-position-indicator-horizontal"));
    assert.ok(indicator.hasClass("dx-position-indicator-vertical"));
    assert.ok(!indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("indicator is shown on bottom dragging. RTL", function(assert) {
    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            itemContainerSelector: ".test-container",
            useIndicator: true,
            rtlEnabled: true
        });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22);

    // assert
    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");

    var $items = $sortable.find(".test-item");
    assert.ok(indicator.offset().top <= $items.eq(3).offset().top, "indicator was rendered before 2 item");
    assert.ok(indicator.offset().top > $items.eq(1).offset().top, "indicator was rendered after 1 item");
    assert.ok(!indicator.hasClass("dx-position-indicator-horizontal"));
    assert.ok(indicator.hasClass("dx-position-indicator-vertical"));
    assert.ok(!indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("indicator is shown after last item bottom dragging", function(assert) {
    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            itemContainerSelector: ".test-container",
            useIndicator: true
        });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 45);

    // assert
    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");

    var $items = $sortable.find(".test-item");
    assert.ok(indicator.offset().top >= $items.eq(3).offset().top, "indicator was rendered after 4 item");

    assert.ok(indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("indicator is shown after last item bottom dragging. RTL", function(assert) {
    var indicator,
        $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            itemContainerSelector: ".test-container",
            useIndicator: true,
            rtlEnabled: true
        });

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 45);

    // assert
    indicator = $(".dx-position-indicator");

    assert.ok(indicator.length, "indicator is rendered");

    var $items = $sortable.find(".test-item");
    assert.ok(indicator.offset().top >= $items.eq(3).offset().top, "indicator was rendered after 4 item");

    assert.ok(indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("drag without source element", function(assert) {
    var $sortable = $("#sortable").dxSortableOld({
            itemSelector: ".test-item",
            itemContainerSelector: ".test-container",
            useIndicator: true,
        }),
        $item = $sortable.find(".test-container"),
        offset = $sortable.find(".test-item").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + $item.width() / 2 + 10, offset.top);

    // assert
    var indicator = $(".dx-position-indicator");

    assert.ok(!indicator.length);
});

QUnit.test("Indicator should not be shown on dragging to the same item at another sortable", function(assert) {
    $("#sortable").css("display", "none");
    $("<div id='sortable1'><div id='second-group' group='groupFilter' class='group horizontal' style='height: 150px'><div class='test-container'><div class='test-item'>1</div><div class='test-item'>2</div><div class='test-item'>3</div></div></div>")
        .insertAfter("#sortable")
        .css({
            width: "3000px",
            height: "200px"
        });
    $("<div id='sortable2'><div id='second-group' group='groupFilter' class='group horizontal' style='height: 150px'><div class='test-container'><div class='test-item'>1</div><div class='test-item'>2</div><div class='test-item'>3</div></div></div>")
        .insertAfter("#sortable1")
        .css({
            width: "3000px",
            height: "200px"
        });

    var sortableDown = $("#sortable1").dxSortableOld({
        selector: "#sortable1",
        itemSelector: ".test-item",
        groupSelector: ".group",
        direction: "auto",
        groupFilter: function() {
            return $(this).attr("group") === "groupFilter";
        },
        itemContainerSelector: ".test-container",
        useIndicator: true,
    });

    $("#sortable2").dxSortableOld({
        selector: "#sortable2",
        itemSelector: ".test-item",
        groupSelector: ".group",
        direction: "auto",
        groupFilter: function() {
            return $(this).attr("group") === "groupFilter";
        },
        itemContainerSelector: ".test-container",
        useIndicator: true
    });

    var $item = sortableDown.find(".test-item").eq(1);

    // act
    pointerMock($item)
        .start()
        .down()
        .move(305, 200);

    var indicator = $(".dx-position-indicator");
    assert.ok(!indicator.length);
});


QUnit.module("sortable when source item is hidden", {
    beforeEach: function() {
        this.createSortable = function(options) {
            options = options || {};
            return $(options.selector || "#sortable").dxSortableOld($.extend({
                itemSelector: ".test-item",
                itemContainerSelector: ".test-container",
                onChanged: sinon.stub(),
                sourceClass: "hidden-source",
                itemRender: function($sourceItem, target) {
                    var $item = $sourceItem.clone().css({
                        width: $sourceItem.width(),
                        height: $sourceItem.height(),
                    });

                    if(target === "target") {
                        $item.insertBefore($sourceItem);
                    }

                    return $item;
                }
            }, options));
        };
    }
});

QUnit.test("dragging", function(assert) {
    var $sortable = this.createSortable();

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "1", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].sourceIndex, 0);
    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].targetIndex, 2);
});

QUnit.test("dragging move over half of item height", function(assert) {
    var $sortable = this.createSortable();

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 25)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "3", "item 1 text");
    assert.equal($items.eq(2).text(), "1", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].sourceIndex, 0);
    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].targetIndex, 3);
});

QUnit.test("dragging - to end of container", function(assert) {
    var $sortable = this.createSortable();

    var $item = $sortable.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 200)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "3", "item 1 text");
    assert.equal($items.eq(2).text(), "4", "item 2 text");
    assert.equal($items.eq(3).text(), "1", "item 3 text");

    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].sourceIndex, 0);
    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].targetIndex, 4);
});

QUnit.test("dragging - add element to empty container", function(assert) {
    var $sortable = $("#sortable"),
        $container = $sortable.find(".test-container").remove();

    $("<div id='first-group' group='first' class='group'>").css({
        height: 150
    }).append($container).appendTo($sortable);

    $("<div id='second-group' group='second' class='group'>").css({
        height: 150
    }).append($("<div class='test-container'>")).appendTo($sortable);

    this.createSortable({
        groupSelector: ".group"
    });

    var firstGroup = $("#first-group"),
        $item = firstGroup.find(".test-item").eq(2),
        secondGroup = $("#second-group");

    // act
    pointerMock($item)
        .start()
        .down()
        .move(5, 155)
        .up();

    // assert
    var $firstGroupItems = firstGroup.find(".test-item"),
        $secondGroupItems = secondGroup.find(".test-item"),
        onChangedArgs = $sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0];

    assert.equal($secondGroupItems.length, 1, "item count in second group");
    assert.equal($secondGroupItems.eq(0).text(), "3", "item 0 text");

    assert.equal($firstGroupItems.length, 3, "item count in first group");
    assert.equal($firstGroupItems.eq(0).text(), "1", "item 0 text");
    assert.equal($firstGroupItems.eq(1).text(), "2", "item 1 text");
    assert.equal($firstGroupItems.eq(2).text(), "4", "item 3 text");

    assert.deepEqual(onChangedArgs.sourceIndex, 2);
    assert.deepEqual(onChangedArgs.sourceGroup, "first");
    assert.deepEqual(onChangedArgs.targetIndex, 0);
    assert.deepEqual(onChangedArgs.targetGroup, "second");
});

QUnit.test("dragging between different sortables by groupFilter callback to empty container", function(assert) {
    var $sortable = $("#sortable"),
        $container = $sortable.find(".test-container").remove();

    $("<div id='first-group' group='first' class='group'>")
        .append($container).appendTo($sortable);

    $("<div id='sortable2'><div id='second-group' group='second' class='group' style='height: 150px'><div class='test-container'></div></div>")
        .insertAfter($sortable);

    this.createSortable({
        groupSelector: ".group",
        groupFilter: function() {
            return $(this).attr("group") === "second";
        }
    });

    this.createSortable({
        selector: "#sortable2",
        groupSelector: ".group"
    });

    var firstGroup = $("#first-group"),
        $item = firstGroup.find(".test-item").eq(2),
        secondGroup = $("#second-group");

    // act
    pointerMock($item)
        .start()
        .down()
        .move(5, 305)
        .up();

    // assert
    var $firstGroupItems = firstGroup.find(".test-item"),
        $secondGroupItems = secondGroup.find(".test-item"),
        onChangedArgs = $sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0];

    assert.equal($secondGroupItems.length, 1, "item count in second group");
    assert.equal($secondGroupItems.eq(0).text(), "3", "item 0 text");

    assert.equal($firstGroupItems.length, 3, "item count in first group");
    assert.equal($firstGroupItems.eq(0).text(), "1", "item 0 text");
    assert.equal($firstGroupItems.eq(1).text(), "2", "item 1 text");
    assert.equal($firstGroupItems.eq(2).text(), "4", "item 3 text");

    assert.deepEqual(onChangedArgs.sourceIndex, 2);
    assert.deepEqual(onChangedArgs.sourceGroup, "first");
    assert.deepEqual(onChangedArgs.targetIndex, 0);
    assert.deepEqual(onChangedArgs.targetGroup, "second");
});

QUnit.test("disable dragging between different sortables by groupFilter callback", function(assert) {
    var $sortable = $("#sortable"),
        $container = $sortable.find(".test-container").remove();

    $("<div id='first-group' group='first' class='group'>")
        .append($container).appendTo($sortable);

    $("<div id='sortable2'><div id='second-group' group='second' class='group' style='height: 150px'><div class='test-container'></div></div>")
        .insertAfter($sortable);

    this.createSortable({
        groupSelector: ".group",
        groupFilter: function() {
            return $(this).attr("group") !== "second";
        }
    });

    this.createSortable({
        selector: "#sortable2",
        groupSelector: ".group"
    });

    var firstGroup = $("#first-group"),
        $item = firstGroup.find(".test-item").eq(2);

    // act
    pointerMock($item)
        .start()
        .down()
        .move(5, 305)
        .up();

    // assert
    var onChangedCalled = $sortable.dxSortableOld("instance").option("onChanged").called;

    assert.strictEqual(onChangedCalled, false, "onChanged is not called");
});

QUnit.test("dragging between different sortables by groupFilter callback to non-empty container with another direction", function(assert) {
    var $sortable = $("#sortable"),
        $container = $sortable.find(".test-container").remove();

    $("<div id='first-group' group='first' class='group'>")
        .append($container).appendTo($sortable);

    $("<div id='sortable2'><div id='second-group' group='second' class='group horizontal' style='height: 150px'><div class='test-container'><div class='test-item'>10</div><div class='test-item'>11</div><div class='test-item'>12</div></div></div>")
        .insertAfter($sortable);

    this.createSortable({
        groupSelector: ".group",
        groupFilter: function() {
            return $(this).attr("group") === "second";
        }
    });

    this.createSortable({
        selector: "#sortable2",
        direction: "horizontal",
        groupSelector: ".group"
    });

    var firstGroup = $("#first-group"),
        $item = firstGroup.find(".test-item").eq(2),
        secondGroup = $("#second-group");

    // act
    pointerMock($item)
        .start()
        .down()
        .move(400, 300)
        .up();

    // assert
    var $firstGroupItems = firstGroup.find(".test-item"),
        $secondGroupItems = secondGroup.find(".test-item"),
        onChangedArgs = $sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0];

    assert.equal($secondGroupItems.length, 4, "item count in second group");
    assert.equal($secondGroupItems.eq(0).text(), "10", "item 0 text");
    assert.equal($secondGroupItems.eq(1).text(), "11", "item 1 text");
    assert.equal($secondGroupItems.eq(2).text(), "3", "item 2 text");
    assert.equal($secondGroupItems.eq(3).text(), "12", "item 3 text");

    assert.equal($firstGroupItems.length, 3, "item count in first group");
    assert.equal($firstGroupItems.eq(0).text(), "1", "item 0 text");
    assert.equal($firstGroupItems.eq(1).text(), "2", "item 1 text");
    assert.equal($firstGroupItems.eq(2).text(), "4", "item 3 text");

    assert.deepEqual(onChangedArgs.sourceIndex, 2);
    assert.deepEqual(onChangedArgs.sourceGroup, "first");
    assert.deepEqual(onChangedArgs.targetIndex, 2);
    assert.deepEqual(onChangedArgs.targetGroup, "second");
});

QUnit.test("dragging between different sortables by groupFilter callback to non-empty container with another useIndicator option value", function(assert) {
    var $sortable = $("#sortable"),
        $container = $sortable.find(".test-container").remove();

    $("<div id='first-group' group='first' class='group'>")
        .append($container).appendTo($sortable);

    $("<div id='sortable2'><div id='second-group' group='second' class='group horizontal' style='height: 150px'><div class='test-container'><div class='test-item'>10</div><div class='test-item'>11</div><div class='test-item'>12</div></div></div>")
        .insertAfter($sortable);

    this.createSortable({
        groupSelector: ".group",
        groupFilter: function() {
            return $(this).attr("group") === "second";
        },
        useIndicator: false
    });

    this.createSortable({
        selector: "#sortable2",
        direction: "horizontal",
        groupSelector: ".group",
        useIndicator: true
    });

    var firstGroup = $("#first-group"),
        $item = firstGroup.find(".test-item").eq(2);

    // act
    var pointer = pointerMock($item)
        .start()
        .down()
        .move(400, 300);


    // assert
    assert.strictEqual($(".dx-position-indicator").length, 1);

    // act
    pointer.up();

    // assert
    assert.strictEqual($(".dx-position-indicator").length, 0);
});

QUnit.test("dragging between different sortables positioned one on another", function(assert) {
    $("<div id='sortable1'><div id='second-group' group='groupFilter' class='group horizontal' style='height: 150px'><div class='test-container'><div class='test-item'>1</div><div class='test-item'>2</div></div></div>")
        .insertAfter("#sortable")
        .css({
            position: "absolute",
            left: "20px",
            top: "0px",
            width: "300px",
            height: "150px"
        });

    $("<div id='sortable2'><div id='second-group' group='groupFilter' class='group horizontal' style='height: 150px'><div class='test-container'></div></div>")
        .insertAfter("#sortable1")
        .css({
            position: "absolute",
            left: "20px",
            top: "0px",
            width: "300px",
            height: "150px"
        });

    var sortableDown = this.createSortable({
        selector: "#sortable1",
        itemSelector: ".test-item",
        groupSelector: ".group",
        direction: "auto",
        groupFilter: function() {
            return $(this).attr("group") === "groupFilter";
        },
        itemContainerSelector: ".test-container"
    });

    var sortableUp = this.createSortable({
        selector: "#sortable2",
        itemSelector: ".test-item",
        groupSelector: ".group",
        direction: "auto",
        groupFilter: function() {
            return $(this).attr("group") === "groupFilter";
        },
        itemContainerSelector: ".test-container"
    });

    var $item = sortableDown.find(".test-item").eq(0);
    var offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left + 20, offset.top + 22)
        .up();

    // assert
    var $items1 = sortableDown.find(".test-item"),
        $items2 = sortableUp.find(".test-item");

    assert.equal($items1.length, 1, "item count");
    assert.equal($items1.eq(0).text(), "2", "item 1 text");
    assert.equal($items2.eq(0).text(), "1", "item 0 text");
});

QUnit.test("Disable dragging", function(assert) {
    var $sortable = this.createSortable({
            allowDragging: false
        }),
        $item = $sortable.find(".test-item").eq(0),
        offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22)
        .up();

    // assert
    assert.ok(!$sortable.dxSortableOld("instance").option("onChanged").called, "dragging should be disabled");
});

QUnit.test("Enable dragging at runtime", function(assert) {
    var $sortable = this.createSortable({
            allowDragging: false
        }),
        $item = $sortable.find(".test-item").eq(0),
        offset = $item.offset();

    $sortable.dxSortableOld("option", "allowDragging", true);
    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 5)
        .move(offset.left, offset.top + 22)
        .up();

    // assert
    assert.ok($sortable.dxSortableOld("instance").option("onChanged").called, "dragging should be disabled");

    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].sourceIndex, 0);
    assert.deepEqual($sortable.dxSortableOld("instance").option("onChanged").lastCall.args[0].targetIndex, 2);
});


QUnit.module("Group items", {
    beforeEach: function() {
        this.createSortable = function(options) {
            options = options || {};
            return $(options.selector || "#sortable").dxSortableOld($.extend({
                itemSelector: ".test-item",
                itemContainerSelector: ".test-container",
                onChanged: sinon.stub()
            }, options));
        };
    }
});

QUnit.test("Groups dragging", function(assert) {
    $(".test-item").eq(0).attr("item-group", "group1");
    $(".test-item").eq(1).attr("item-group", "group1");

    $(".test-container").css("border", "none");

    var $sortable = this.createSortable({
            groupSelector: ".test-container"
        }),

        $item = $sortable.find(".test-item").eq(0),
        offset1 = $item.offset(),
        offset2 = $sortable.find(".test-item").eq(1).offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset1.left + 5, offset1.top + 5);

    var dragElements = $(".dx-drag");

    assert.strictEqual(dragElements.length, 2);

    assert.strictEqual(dragElements.eq(0).text(), "1");
    assert.strictEqual(dragElements.eq(1).text(), "2");

    assert.strictEqual(parseInt(dragElements.eq(0).css("left")), parseInt(offset1.left + 5));
    assert.strictEqual(parseInt(dragElements.eq(1).css("left")), parseInt(offset2.left + 5));

    assert.strictEqual(parseInt(dragElements.eq(0).css("top")), parseInt(offset1.top + 5));
    assert.strictEqual(parseInt(dragElements.eq(1).css("top")), parseInt(offset2.top + 5));

});

QUnit.test("Groups dragging. get correct source index for no group item", function(assert) {
    $(".test-item").eq(1).attr("item-group", "group1");
    $(".test-item").eq(2).attr("item-group", "group1");

    $(".test-container").css("border", "none");

    var $sortable = this.createSortable({

        }),

        $item = $sortable.find(".test-item").eq(3),
        offset = $item.offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top - 25)
        .up();

    var changedArgs = $sortable.dxSortableOld("option", "onChanged").lastCall.args[0];

    assert.strictEqual(changedArgs.sourceIndex, 2, "sourceIndex");
    assert.strictEqual(changedArgs.targetIndex, 1, "targetIndex");
});

QUnit.test("Groups dragging. get correct source index for group item", function(assert) {
    $(".test-item").eq(1).attr("item-group", "group1");
    $(".test-item").eq(2).attr("item-group", "group1");

    $(".test-container").css("border", "none");

    var $sortable = this.createSortable({

        }),

        $item = $sortable.find(".test-item").eq(2),
        offset = $sortable.find(".test-item").eq(1).offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top + 25)
        .up();

    var changedArgs = $sortable.dxSortableOld("option", "onChanged").lastCall.args[0];

    assert.strictEqual(changedArgs.sourceIndex, 1, "sourceIndex");
    assert.strictEqual(changedArgs.targetIndex, 2, "targetIndex");
});

QUnit.test("do not change index on small dragging inside group. horizontal", function(assert) {
    createHorizontalMarkUp(1500, false, false);

    $(".test-item").eq(1).attr("item-group", "group1");
    $(".test-item").eq(2).attr("item-group", "group1");

    $(".test-container").css("border", "none");

    var $sortable = this.createSortable({
            direction: "auto",
            useIndicator: true
        }),

        $item = $sortable.find(".test-item").eq(0),
        offset = $sortable.find(".test-item").eq(0).offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 350, offset.top + 5)
        .up();

    assert.ok(!$sortable.dxSortableOld("option", "onChanged").called);
});

QUnit.test("do not change index on small dragging inside group. horizontal", function(assert) {
    $(".test-item").eq(1).attr("item-group", "group1");
    $(".test-item").eq(2).attr("item-group", "group1");

    $(".test-container").css("border", "none");

    var $sortable = this.createSortable({
            useIndicator: true
        }),

        $item = $sortable.find(".test-item").eq(0),
        offset = $sortable.find(".test-item").eq(0).offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 3, offset.top + 10)
        .up();

    assert.ok(!$sortable.dxSortableOld("option", "onChanged").called);
});

QUnit.test("Get correct source index for last item", function(assert) {
    var $sortable = this.createSortable({

        }),
        $item = $sortable.find(".test-item").eq(3),
        offset = $item.offset();

    pointerMock($item)
        .start()
        .down()
        .move(offset.left + 5, offset.top - 25)
        .up();

    var changedArgs = $sortable.dxSortableOld("option", "onChanged").lastCall.args[0];

    assert.strictEqual(changedArgs.sourceIndex, 3, "sourceIndex");
    assert.strictEqual(changedArgs.targetIndex, 1, "targetIndex");
});


QUnit.module("Horizontal direction. RTL", {
    beforeEach: function() {
        var that = this;
        createHorizontalMarkUp(HORIZONTAL_WIDTH_LARGE);

        this.createSortable = function(options) {
            options = options || {};

            var $sortable = $(options.selector || "#sortable").dxSortableOld($.extend({
                itemSelector: ".test-item",
                itemContainerSelector: ".test-container",
                onChanged: sinon.stub(),
                rtlEnabled: true,
                direction: "horizontal"
            }, options));

            that.sortable = $sortable.dxSortableOld("instance");

            return $sortable;
        };
    }
});

QUnit.test("horizontal dragging - left", function(assert) {

    var $sortable = this.createSortable({}),
        $item = $sortable.find(".test-item").eq(0),
        offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + $item.width() - 400, offset.top)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "1", "item 1 text");
    assert.equal($items.eq(2).text(), "3", "item 2 text");
    assert.equal($items.eq(3).text(), "4", "item 3 text");

    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].sourceIndex, 0);
    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].targetIndex, 2);
});

// QUnit.test("horizontal dragging between lines", function (assert) {
//    createHorizontalMarkUp(HORIZONTAL_WIDTH, true);

//    var $sortable = this.createSortable({}),
//        $item = $sortable.find(".test-item").eq(0),
//        offset = $item.offset();

//    // act
//    pointerMock($item)
//        .start()
//        .down()
//        .move(offset.left + $item.width() - 350, offset.top + 15)
//        .up();

//    // assert
//    var $items = $sortable.find(".test-item");

//    assert.equal($items.length, 6, "item count");
//    assert.equal($items.eq(0).text(), "2", "item 0 text");
//    assert.equal($items.eq(1).text(), "3", "item 1 text");
//    assert.equal($items.eq(2).text(), "4", "item 2 text");
//    assert.equal($items.eq(3).text(), "5", "item 3 text");
//    assert.equal($items.eq(4).text(), "1", "item 4 text");
//    assert.equal($items.eq(5).text(), "6", "item 5 text");

//    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].sourceIndex, 0);
//    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].targetIndex, 5);
// });

QUnit.test("drag to the end of the container", function(assert) {
    var $sortable = this.createSortable({}),
        $item = $sortable.find(".test-item").eq(0),
        offset = $sortable.find(".test-item").eq(3).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left - 10, offset.top)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "2", "item 0 text");
    assert.equal($items.eq(1).text(), "3", "item 1 text");
    assert.equal($items.eq(2).text(), "4", "item 2 text");
    assert.equal($items.eq(3).text(), "1", "item 3 text");

    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].sourceIndex, 0);
    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].targetIndex, 4);
});

QUnit.test("drag to begin of the container", function(assert) {
    var $sortable = this.createSortable({}),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-item").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + $item.width() / 2 + 10, offset.top)
        .up();

    // assert
    var $items = $sortable.find(".test-item");

    assert.equal($items.length, 4, "item count");
    assert.equal($items.eq(0).text(), "4", "item 0 text");
    assert.equal($items.eq(1).text(), "1", "item 1 text");
    assert.equal($items.eq(2).text(), "2", "item 2 text");
    assert.equal($items.eq(3).text(), "3", "item 3 text");

    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].sourceIndex, 3);
    assert.strictEqual(this.sortable.option("onChanged").lastCall.args[0].targetIndex, 0);
});

QUnit.test("horizontal dragging - left. Render Indicator", function(assert) {
    var $sortable = this.createSortable({
            useIndicator: true
        }),
        $item = $sortable.find(".test-item").eq(0),
        offset = $item.offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + $item.width() - 400, offset.top);

    // assert
    var indicator = $(".dx-position-indicator");

    assert.ok(indicator.length);

    assert.roughEqual(parseInt(indicator.css("left")), $sortable.find(".test-item").eq(2).offset().left + $sortable.find(".test-item").eq(2).outerWidth(true), 1);
    assert.ok(indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("drag to the end of the container. Render Indicator", function(assert) {
    var $sortable = this.createSortable({
            useIndicator: true
        }),
        $item = $sortable.find(".test-item").eq(0),
        offset = $sortable.find(".test-item").eq(3).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left - 10, offset.top);

    // assert
    var indicator = $(".dx-position-indicator");

    assert.ok(indicator.length);

    assert.roughEqual(parseInt(indicator.css("left")), $sortable.find(".test-item").eq(3).offset().left, 1);
    assert.ok(!indicator.hasClass("dx-position-indicator-last"));
});

QUnit.test("drag to begin of the container. Render Indicator", function(assert) {
    var $sortable = this.createSortable({
            useIndicator: true
        }),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-item").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + $item.width() / 2 + 10, offset.top);

    // assert
    var indicator = $(".dx-position-indicator");

    assert.ok(indicator.length);

    assert.roughEqual(parseInt(indicator.css("left")), $sortable.find(".test-item").eq(0).offset().left + $sortable.find(".test-item").eq(0).outerWidth(true), 1);
    assert.ok(indicator.hasClass("dx-position-indicator-last"));
});


QUnit.module("Scroll group content", {
    beforeEach: function() {
        this.createSortable = function(options) {
            options = options || {};
            return $(options.selector || "#sortable").dxSortableOld($.extend({
                itemSelector: ".test-item",
                itemContainerSelector: ".test-container",
                groupSelector: ".test-container",
                sourceClass: "hidden-source",
                itemRender: function($sourceItem, target) {
                    var $item = $sourceItem.clone().css({
                        width: $sourceItem.width(),
                        height: $sourceItem.height(),
                    });

                    if(target === "target") {
                        $item.insertBefore($sourceItem);
                    }

                    return $item;
                }
            }, options));
        };

        this.onScroll = sinon.stub();

        $(".test-container")
            .attr("allow-scrolling", true)
            .height(150)
            .dxScrollable({
                onScroll: this.onScroll,
                disabled: true,
                useNative: false
            });

        $(".test-item").height(75);
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("No scroll group content", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-item").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left + $item.width() / 2 + 10, offset.top);

    this.clock.tick();

    assert.ok(!this.onScroll.called);
});

QUnit.test("Scroll down group content", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 30)
        .move(offset.left, offset.top + $(".test-container").height());

    assert.strictEqual(this.onScroll.callCount, 1);
    assert.strictEqual(this.onScroll.lastCall.args[0].scrollOffset.top, $sortable.dxSortableOld("instance").__SCROLL_STEP);
});

QUnit.test("Scroll down group content", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 30)
        .move(offset.left, offset.top + $(".test-container").height());

    assert.strictEqual(this.onScroll.callCount, 1);
    assert.strictEqual(this.onScroll.lastCall.args[0].scrollOffset.top, $sortable.dxSortableOld("instance").__SCROLL_STEP);
});

QUnit.test("Scroll down group content second time after clock tick if pointer at the bottom", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 30)
        .move(offset.left, offset.top + $(".test-container").height());

    this.onScroll.reset();

    this.clock.tick(10);

    assert.strictEqual(this.onScroll.callCount, 1);
    assert.strictEqual(this.onScroll.lastCall.args[0].scrollOffset.top, 2 * $sortable.dxSortableOld("instance").__SCROLL_STEP);
});

QUnit.test("Scroll down group content while pointer at the bottom", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 30)
        .move(offset.left, offset.top + $(".test-container").height());

    this.clock.tick(100);

    assert.strictEqual(this.onScroll.callCount, 11);
    assert.strictEqual(this.onScroll.lastCall.args[0].scrollOffset.top, 11 * $sortable.dxSortableOld("instance").__SCROLL_STEP);
});

QUnit.test("Scroll up group content", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    $sortable.find(".test-container").dxScrollable("scrollTo", 50);
    this.onScroll.reset();
    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 1)
        .move(offset.left, offset.top + 8);

    assert.strictEqual(this.onScroll.callCount, 1);
    assert.strictEqual(this.onScroll.lastCall.args[0].scrollOffset.top, 50 - $sortable.dxSortableOld("instance").__SCROLL_STEP);
});

QUnit.test("Scroll up group content to begin when pointer above area", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    $sortable.find(".test-container").dxScrollable("scrollTo", 50);
    this.onScroll.reset();
    // act
    pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 1)
        .move(offset.left, offset.top - 10);

    this.clock.tick(1000);

    assert.strictEqual(this.onScroll.callCount, 25);
    assert.strictEqual(this.onScroll.lastCall.args[0].scrollOffset.top, 0);
});

QUnit.test("Stop scrolling affer return pointer in the middle of group", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    $sortable.find(".test-container").dxScrollable("scrollTo", 50);
    this.onScroll.reset();

    var pointer = pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 1)
        .move(offset.left, offset.top - 10);
    this.clock.tick(20);
    this.onScroll.reset();

    // act
    pointer.move(offset.left, offset.top + 40);
    this.clock.tick(100);

    assert.strictEqual(this.onScroll.callCount, 0);
});

QUnit.test("Stop scrolling affer drag end", function(assert) {
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    $sortable.find(".test-container").dxScrollable("scrollTo", 50);
    this.onScroll.reset();
    var pointer = pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 1)
        .move(offset.left, offset.top - 10);
    this.clock.tick(20);

    this.onScroll.reset();
    // act
    pointer.up();
    this.clock.tick(100);

    assert.strictEqual(this.onScroll.callCount, 0);
    assert.strictEqual($sortable.find(".test-container").dxScrollable("instance")._eventsStrategy.hasEvent("scroll"), false);
});

QUnit.test("Stop scrolling affer drag to another group", function(assert) {
    $("#sortable").append('<div id="second-group" class="test-container"><div class="test-item">1</div><div class="test-item">2</div></div>');
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    $sortable.find(".test-container").eq(0).dxScrollable("scrollTo", 50);
    this.onScroll.reset();
    // act
    var pointer = pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 1)
        .move(offset.left, offset.top + 5);
    this.clock.tick(20);

    this.onScroll.reset();

    // act
    var secondGroupOffset = $("#second-group").offset();
    pointer.move(secondGroupOffset.left + 10, secondGroupOffset.top + 15);
    this.clock.tick(100);

    assert.strictEqual(this.onScroll.callCount, 0);
    assert.strictEqual($sortable.find(".test-container").eq(0).dxScrollable("instance")._eventsStrategy.hasEvent("scroll"), false);
});

QUnit.test("Stop scrolling affer drag from emty space(no group) to another group", function(assert) {
    $("#sortable").append('<div id="second-group" class="test-container"><div class="test-item">1</div><div class="test-item">2</div></div>');
    var $sortable = this.createSortable(),
        $item = $sortable.find(".test-item").eq(3),
        offset = $sortable.find(".test-container").eq(0).offset();

    $sortable.find(".test-container").eq(0).dxScrollable("scrollTo", 50);
    this.onScroll.reset();
    // act
    var pointer = pointerMock($item)
        .start()
        .down()
        .move(offset.left, offset.top + 1)
        .move(offset.left, offset.top - 10);
    this.clock.tick(20);

    this.onScroll.reset();

    // act
    var secondGroupOffset = $("#second-group").offset();
    pointer.move(secondGroupOffset.left + 10, secondGroupOffset.top + 15);
    this.clock.tick(100);

    assert.strictEqual(this.onScroll.callCount, 0);
    assert.strictEqual($sortable.find(".test-container").eq(0).dxScrollable("instance")._eventsStrategy.hasEvent("scroll"), false);
});


