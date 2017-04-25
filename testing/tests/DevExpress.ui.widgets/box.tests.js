"use strict";

var $ = require("jquery"),
    Box = require("ui/box"),
    domUtils = require("core/utils/dom"),
    registerComponent = require("core/component_registrator");

require("common.css!");
require("ui/scroll_view/ui.scrollable");

QUnit.testStart(function() {
    var markup =
        '<div id="box"></div>\
        \
        <div id="boxWithInnerBox">\
            <div data-options="dxTemplate: { name: \'testTemplate\'}">\
                test\
            </div>\
        </div>\
        \
        <div id="nestedBox">\
            <div data-options="dxItem: {baseSize: 272, ratio: 0, box: {direction: \'col\'}}">\
                <div data-options="dxItem: {baseSize: \'auto\', ratio: 0}">\
                    <h2>Box1</h2>\
                </div>\
            </div>\
        </div>\
        \
        <div id="boxWithScrollable">\
            <div data-options="dxItem: { ratio: 1 }">\
                <div id="isScrollable">\
                    <div style="height: 200px;"></div>\
                </div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var BOX_CLASS = "dx-box",
    BOX_ITEM_CLASS = "dx-box-item";

var relativeOffset = function($element, $relativeElement) {
    $relativeElement = $relativeElement || $element.parent();

    var elementOffset = $element.offset();
    var relativeElementOffset = $relativeElement.offset();

    return {
        top: elementOffset.top - relativeElementOffset.top,
        left: elementOffset.left - relativeElementOffset.left
    };
};


QUnit.module("render");

QUnit.test("render", function(assert) {
    var $box = $("#box").dxBox({
        items: [1, 2]
    });

    assert.ok($box.hasClass(BOX_CLASS), "necessary class attached");
    var $items = $box.find("." + BOX_ITEM_CLASS);
    assert.equal($items.length, 2, "items rendered");

    assert.equal($items.eq(0).text(), "1", "first item rendered");
    assert.equal($items.eq(1).text(), "2", "second item rendered");
});

QUnit.test("strategy class", function(assert) {
    var $box = $("#box").dxBox({
        _layoutStrategy: "test"
    });

    assert.ok($box.hasClass("dx-box-test"), "class attached");
});

QUnit.module("Scrollable integration");

QUnit.test("Scrollable placed in dxBox stretch correctly", function(assert) {
    var $box = $("#boxWithScrollable");

    $box.dxBox({
        height: 100,
        direction: "col"
    });

    var $scrollable = $box.find("#isScrollable").dxScrollable();

    assert.equal($scrollable.height(), 100, "Scrollable height is correct");
});


QUnit.module("layouting");

QUnit.test("direction column", function(assert) {
    var size = 100;
    var $box = $("#box").dxBox({
        direction: "col",
        items: [{ ratio: 1 }, { ratio: 1 }],
        width: size,
        height: size
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);

    var $firstItem = $items.eq(0);
    var firstItemLayout = $.extend(relativeOffset($firstItem), {
        width: $firstItem.width(),
        height: $firstItem.height()
    });

    var firstItemExpectedLayout = {
        top: 0,
        left: 0,
        width: size,
        height: size / 2
    };

    assert.deepEqual(firstItemLayout, firstItemExpectedLayout, "first item positioned correctly");


    var $secondItem = $items.eq(1);
    var secondItemLayout = $.extend(relativeOffset($secondItem), {
        width: $secondItem.width(),
        height: $secondItem.height()
    });

    var secondItemExpectedLayout = {
        top: size / 2,
        left: 0,
        width: size,
        height: size / 2
    };

    assert.deepEqual(secondItemLayout, secondItemExpectedLayout, "second item positioned correctly");
});

QUnit.test("direction row", function(assert) {
    var size = 100;
    var $box = $("#box").dxBox({
        direction: "row",
        items: [{ ratio: 1 }, { ratio: 1 }],
        width: size,
        height: size
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);

    var $firstItem = $items.eq(0);
    var firstItemLayout = $.extend(relativeOffset($firstItem), {
        width: $firstItem.width(),
        height: $firstItem.height()
    });

    var firstItemExpectedLayout = {
        top: 0,
        left: 0,
        width: size / 2,
        height: size
    };

    assert.deepEqual(firstItemLayout, firstItemExpectedLayout, "first item positioned correctly");

    var $secondItem = $items.eq(1);
    var secondItemLayout = $.extend(relativeOffset($secondItem), {
        width: $secondItem.width(),
        height: $secondItem.height()
    });

    var secondItemExpectedLayout = {
        top: 0,
        left: size / 2,
        width: size / 2,
        height: size
    };

    assert.deepEqual(secondItemLayout, secondItemExpectedLayout, "second item positioned correctly");
});

QUnit.test("align for column direction", function(assert) {
    var baseSize = 40;
    var boxSize = baseSize * 5;
    var $box = $("#box").dxBox({
        direction: "col",
        align: 'start',
        items: [{ baseSize: baseSize }, { baseSize: baseSize }],
        height: boxSize
    });

    var $boxItems = $box.find("." + BOX_ITEM_CLASS);

    var $firstItem = $boxItems.eq(0);
    assert.equal(relativeOffset($firstItem).top, 0, "first item positioned correctly for align: start");

    var $secondItem = $boxItems.eq(1);
    assert.equal(relativeOffset($secondItem).top, baseSize, "second item positioned correctly for align: start");

    var box = $box.dxBox("instance");
    box.option("align", "end");

    assert.equal(relativeOffset($firstItem).top, boxSize - 2 * baseSize, "first item positioned correctly for align: end");
    assert.equal(relativeOffset($secondItem).top, boxSize - baseSize, "second item positioned correctly for align: end");

    box.option("align", "space-between");

    assert.equal(relativeOffset($firstItem).top, 0, "first item positioned correctly for align: space-between");
    assert.equal(relativeOffset($secondItem).top, boxSize - baseSize, "second item positioned correctly for align: space-between");

    box.option("align", "center");

    assert.equal(relativeOffset($firstItem).top, (boxSize - 2 * baseSize) / 2, "first item positioned correctly for align: center");
    assert.equal(relativeOffset($secondItem).top, (boxSize - 2 * baseSize) / 2 + baseSize, "second item positioned correctly for align: center");

    box.option("align", "space-around");

    assert.equal(relativeOffset($firstItem).top, (boxSize / 2 - baseSize) / 2, "first item positioned correctly for align: space-around");
    assert.equal(relativeOffset($secondItem).top, (boxSize / 2) + (boxSize / 2 - baseSize) / 2, "second item positioned correctly for align: space-around");
});

QUnit.test("align for row direction", function(assert) {
    var baseSize = 40;
    var boxSize = baseSize * 5;
    var $box = $("#box").dxBox({
        direction: "row",
        align: 'start',
        items: [{ baseSize: baseSize }, { baseSize: baseSize }],
        width: boxSize
    });

    var $boxItems = $box.find("." + BOX_ITEM_CLASS);

    var $firstItem = $boxItems.eq(0);
    assert.equal(relativeOffset($firstItem).left, 0, "first item positioned correctly for align: start");

    var $secondItem = $boxItems.eq(1);
    assert.equal(relativeOffset($secondItem).left, baseSize, "second item positioned correctly for align: start");

    var box = $box.dxBox("instance");

    box.option("align", "end");
    assert.equal(relativeOffset($firstItem).left, boxSize - 2 * baseSize, "first item positioned correctly for align: end");
    assert.equal(relativeOffset($secondItem).left, boxSize - baseSize, "second item positioned correctly for align: end");

    box.option("align", "space-between");
    assert.equal(relativeOffset($firstItem).left, 0, "first item positioned correctly for align: space-between");
    assert.equal(relativeOffset($secondItem).left, boxSize - baseSize, "second item positioned correctly for align: space-between");

    box.option("align", "center");
    assert.equal(relativeOffset($firstItem).left, (boxSize - 2 * baseSize) / 2, "first item positioned correctly for align: center");
    assert.equal(relativeOffset($secondItem).left, (boxSize - 2 * baseSize) / 2 + baseSize, "second item positioned correctly for align: center");

    box.option("align", "space-around");
    assert.equal(relativeOffset($firstItem).left, (boxSize / 2 - baseSize) / 2, "first item positioned correctly for align: space-around");
    assert.equal(relativeOffset($secondItem).left, (boxSize / 2) + (boxSize / 2 - baseSize) / 2, "second item positioned correctly for align: space-around");
});

QUnit.test("crossAlign for column direction", function(assert) {
    var size = 50;
    var boxSize = 2 * size;
    var $box = $("#box").dxBox({
        direction: "col",
        crossAlign: "start",
        items: [{ html: "<div style='width: " + size + "px'></div>" }],
        width: boxSize
    });
    var box = $box.dxBox("instance");

    var $item = $box.find("." + BOX_ITEM_CLASS).eq(0);
    assert.equal(relativeOffset($item).left, 0, "item positioned for crossAlign: start");
    assert.equal($item.width(), size, "item is stretched over content");


    box.option("crossAlign", "end");
    assert.equal(relativeOffset($item).left, boxSize - size, "item positioned for crossAlign: end");
    assert.equal($item.width(), size, "item is stretched over content");

    box.option("crossAlign", "center");
    assert.equal(relativeOffset($item).left, (boxSize - size) / 2, "item positioned for crossAlign: center");
    assert.equal($item.width(), size, "item is stretched over content");

    box.option("crossAlign", "stretch");
    assert.equal(relativeOffset($item).left, 0, "item positioned for crossAlign: stretch");
    assert.equal($item.width(), boxSize, "element is stretched over container");
});

QUnit.test("crossAlign for row direction", function(assert) {
    var size = 50;
    var boxSize = 2 * size;
    var $box = $("#box").dxBox({
        direction: "row",
        crossAlign: "start",
        items: [{ html: "<div style='height: " + size + "px'></div>" }],
        height: boxSize
    });
    var box = $box.dxBox("instance");

    var $item = $box.find("." + BOX_ITEM_CLASS).eq(0);
    assert.equal(relativeOffset($item).top, 0, "item positioned for crossAlign: start");
    assert.equal($item.height(), size, "item is stretched over content");


    box.option("crossAlign", "end");
    assert.equal(relativeOffset($item).top, boxSize - size, "item positioned for crossAlign: end");
    assert.equal($item.height(), size, "item is stretched over content");

    box.option("crossAlign", "center");
    assert.equal(relativeOffset($item).top, (boxSize - size) / 2, "item positioned for crossAlign: center");
    assert.equal($item.height(), size, "item is stretched over content");

    box.option("crossAlign", "stretch");
    assert.equal(relativeOffset($item).top, 0, "item positioned for crossAlign: stretch");
    assert.equal($item.height(), boxSize, "element is stretched over container");
});

QUnit.test("percent baseSize", function(assert) {
    var firstItemDimension = { baseSize: "60%" };
    var secondItemDimension = { baseSize: "40%" };

    var boxSize = 300;
    var $box = $("#box").dxBox({
        direction: "row",
        items: [firstItemDimension, secondItemDimension],
        width: boxSize
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);
    var $firstItem = $items.eq(0);
    var $secondItem = $items.eq(1);

    assert.equal($firstItem.width(), 0.6 * boxSize, "first item has correct size");
    assert.equal($secondItem.width(), 0.4 * boxSize, "second item has correct size");
});

QUnit.test("items with auto baseSize should have size of content", function(assert) {
    var firstItemDimension = { ratio: 0, baseSize: "auto" };
    var secondItemDimension = { ratio: 0, baseSize: "auto" };

    var boxSize = 300;
    var $box = $("#box").dxBox({
        direction: "row",
        items: [firstItemDimension, secondItemDimension],
        width: boxSize,
        onItemRendered: function(args) {
            var $content = $("<div>").width(50);
            args.itemElement.children().append($content);
        }
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);
    var $firstItem = $items.eq(0);
    var $secondItem = $items.eq(1);

    assert.equal($firstItem.width(), 50, "first item has correct size");
    assert.equal($secondItem.width(), 50, "second item has correct size");
});

QUnit.test("items should have baseSize 0 by default", function(assert) {
    var firstItemDimension = { ratio: 1 };
    var secondItemDimension = { ratio: 1 };
    var itemWidth = 50;
    var boxSize = 300;

    var $box = $("#box").dxBox({
        direction: "row",
        items: [firstItemDimension, secondItemDimension],
        width: boxSize,
        onItemRendered: function(args) {
            var $content = $("<div>").width(itemWidth);
            args.itemElement.children().append($content);
            itemWidth += 50;
        }
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);
    var $firstItem = $items.eq(0);
    var $secondItem = $items.eq(1);

    assert.equal($firstItem.width(), $secondItem.width(), "items has same width");
});

QUnit.test("baseSize and ratio option", function(assert) {
    var firstItemDimension = { ratio: 1, baseSize: 100 };
    var secondItemDimension = { ratio: 3, baseSize: 20 };
    var boxSize = 300;
    var $box = $("#box").dxBox({
        direction: "row",
        items: [firstItemDimension, secondItemDimension],
        width: boxSize
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);
    var $firstItem = $items.eq(0);
    var $secondItem = $items.eq(1);

    var freeSpace = boxSize - firstItemDimension.baseSize - secondItemDimension.baseSize;
    var partsCount = firstItemDimension.ratio + secondItemDimension.ratio;
    var partSpace = freeSpace / partsCount;

    assert.equal($firstItem.width(), firstItemDimension.baseSize + firstItemDimension.ratio * partSpace, "first item has correct size");
    assert.equal($secondItem.width(), secondItemDimension.baseSize + secondItemDimension.ratio * partSpace, "second item has correct size");
});


QUnit.test("default shrink option", function(assert) {
    var firstItemDimension = { ratio: 1, baseSize: 160 };
    var secondItemDimension = { ratio: 3, baseSize: 40 };
    var thirdItemDimension = { ratio: 3 };
    var boxSize = 100;
    var $box = $("#box").dxBox({
        direction: "row",
        items: [firstItemDimension, secondItemDimension, thirdItemDimension],
        width: boxSize
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);
    var $firstItem = $items.eq(0);
    var $secondItem = $items.eq(1);
    var $thirdItem = $items.eq(2);

    var totalBaseSize = firstItemDimension.baseSize + secondItemDimension.baseSize,
        firstItemWidth = boxSize * firstItemDimension.baseSize / totalBaseSize,
        secondItemWidth = boxSize * secondItemDimension.baseSize / totalBaseSize;

    assert.equal($firstItem.width(), firstItemWidth, "first item has correct size");
    assert.equal($secondItem.width(), secondItemWidth, "second item has correct size");
    assert.equal($thirdItem.width(), 0, "third item has correct size");
});

QUnit.test("render box in dxBox", function(assert) {
    var $box = $("#box").dxBox({
        items: [{ box: { direction: "row" } }]
    });

    var $innerBox = $box.find("." + BOX_CLASS);
    assert.equal($innerBox.length, 1, "box was rendered");
    var innerBox = $innerBox.dxBox("instance");
    assert.ok(innerBox instanceof Box, "box was created inside box");
});

QUnit.test("box pass _layoutStrategy to children box", function(assert) {
    var $box = $("#box").dxBox({
        _layoutStrategy: 'test',
        items: [{ box: {} }]
    });

    var innerBox = $box.find(".dx-box").dxBox("instance");

    assert.equal(innerBox.option("_layoutStrategy"), "test", "_layoutStrategy was passed to children box");
});

QUnit.test("minSize & maxSize", function(assert) {
    var boxSize = 100;
    var minSize = 80;
    var maxSize = 5;

    var $box = $("#box").dxBox({
        items: [
            { baseSize: 0, ratio: 1, minSize: minSize },
            { ratio: 1, maxSize: maxSize },
            { ratio: 1 }
        ],
        direction: "row",
        width: boxSize,
        height: boxSize
    });

    var $firstItem = $box.find("." + BOX_ITEM_CLASS).eq(0);
    var $secondItem = $box.find("." + BOX_ITEM_CLASS).eq(1);

    assert.equal($firstItem.width(), minSize, "first item width is min-width");
    assert.equal($secondItem.width(), maxSize, "second item width is max-width");

    $box.dxBox("option", "direction", "col");
    $firstItem = $box.find("." + BOX_ITEM_CLASS).eq(0);
    $secondItem = $box.find("." + BOX_ITEM_CLASS).eq(1);
    var $thirdItem = $box.find("." + BOX_ITEM_CLASS).eq(2);

    assert.equal($firstItem.height(), minSize, "first item height is min-height");
    assert.equal($secondItem.height(), maxSize, "second item height is max-height");
    assert.equal($thirdItem.css("minHeight"), "0px", "min-height is 0 by default");
});


QUnit.test("rendering after visibility changing", function(assert) {
    var clock = sinon.useFakeTimers();
    try {
        var $box = $("#box").dxBox({
            direction: "row",
            items: [{ ratio: 1, baseSize: 0 }, { ratio: 1, baseSize: 0 }],
            visible: false,
            _layoutStrategy: 'fallback'
        });

        clock.tick();

        $box.parent().width(100);

        $box.dxBox("option", "visible", true);

        var $items = $box.find("." + BOX_ITEM_CLASS);
        var $firstItem = $items.eq(0);
        var $secondItem = $items.eq(1);

        assert.equal($firstItem.width(), $box.width() / 2, "first item has correct size");
        assert.equal($secondItem.width(), $box.width() / 2, "second item has correct size");
    } finally {
        clock.restore();
    }
});

QUnit.test("shrink", function(assert) {
    var boxSize = 100,
        itemBaseSize = 100,
        shrinkRatio1 = 1,
        shrinkRatio2 = 3;
    var $box = $("#box").height(boxSize).dxBox({
        direction: "col",
        items: [{ baseSize: boxSize, shrink: shrinkRatio1 }, { baseSize: boxSize, shrink: shrinkRatio2 }]
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);

    assert.equal($items.eq(0).height(), itemBaseSize - (itemBaseSize * 2 - boxSize) / (shrinkRatio1 + shrinkRatio2) * shrinkRatio1);
    assert.equal($items.eq(1).height(), itemBaseSize - (itemBaseSize * 2 - boxSize) / (shrinkRatio1 + shrinkRatio2) * shrinkRatio2);
});

QUnit.test("shrink may be set to 0", function(assert) {
    var boxSize = 100,
        firstItemSize = 75,
        secondItemSize = 100,
        firstItemShrink = 0,
        secondItemShrink = 1;

    var $box = $("#box").height(boxSize).dxBox({
        direction: "col",
        items: [{ baseSize: firstItemSize, shrink: firstItemShrink }, { baseSize: secondItemSize, shrink: secondItemShrink }]
    });

    var $items = $box.find("." + BOX_ITEM_CLASS);

    assert.equal($items.eq(0).height(), firstItemSize - (firstItemSize + secondItemSize - boxSize) / (firstItemShrink + secondItemShrink) * firstItemShrink);
    assert.equal($items.eq(1).height(), secondItemSize - (firstItemSize + secondItemSize - boxSize) / (firstItemShrink + secondItemShrink) * secondItemShrink);
});


QUnit.module("template rendering");

QUnit.test("innerBox with template", function(assert) {
    var $box = $("#boxWithInnerBox").dxBox({
        items: [
            {
                box: {
                    items: [{ template: "testTemplate" }]
                }
            }
        ]
    });

    assert.equal($.trim($box.text()), "test", "inner box rendered with template");
});

QUnit.test("innerBox with item renderer", function(assert) {
    var $box = $("#box").dxBox({
        items: [
            {
                box: {
                    items: [{ test: function() { return "1"; } }, { test: function() { return "2"; } }]
                }
            }
        ],
        itemTemplate: function(item) {
            return "test" + item.test();
        }
    });

    assert.equal($.trim($box.text()), "test1test2", "inner box rendered");
});

QUnit.test("innerBox with nested box item", function(assert) {
    var $box = $("#nestedBox").dxBox({});

    assert.equal($.trim($box.text()), "Box1", "inner box rendered");
});


QUnit.module("fallback strategy");

QUnit.test("total baseSize should be used when size is zero", function(assert) {
    var baseSize1 = 100;
    var baseSize2 = 200;

    var $box = $("#box").dxBox({
        _layoutStrategy: "fallback",
        direction: "col",
        items: [{ baseSize: baseSize1, ratio: 2 }, { baseSize: baseSize2, ratio: 1 }],
        height: "auto"
    });

    assert.equal($box.height(), baseSize1 + baseSize2, "box height calculated based on total baseSize");
});

QUnit.test("baseSize in % in invisible area", function(assert) {
    var $box = $("#box").hide().dxBox({
        height: 100,
        _layoutStrategy: "fallback",
        direction: "col",
        items: [{ baseSize: "50%", ratio: 0 }, { baseSize: "50%", ratio: 0 }]
    });
    var $items = $box.find("." + BOX_ITEM_CLASS);
    var round = Math.round;
    $box.show();
    domUtils.triggerShownEvent($box);

    assert.equal(round($items.eq(0).outerHeight()), round($box.outerHeight() * 0.5), "first item has correct width");
    assert.equal(round($items.eq(0).outerHeight()), round($box.outerHeight() * 0.5), "second item has correct width");
});

QUnit.test("items size should be changed after dxupdate event inside fieldset", function(assert) {
    var $box = $("#box");
    var $wrapper = $box.wrap("<fieldset>").parent();
    $wrapper.width(400);

    $box.dxBox({
        _layoutStrategy: "fallback",
        direction: "row",
        items: [{ baseSize: 0, ratio: 1 }, { baseSize: 0, ratio: 1 }]
    });

    $wrapper.width(200);

    $box.trigger("dxupdate");

    var $items = $box.find("." + BOX_ITEM_CLASS);

    assert.equal($items.eq(0).outerWidth(), 100, "items rendered correctly");
});


QUnit.module("layouting in RTL (fallback strategy)");

QUnit.test("align for row direction", function(assert) {
    var baseSize = 40;
    var boxSize = baseSize * 5;
    var $box = $("#box").dxBox({
        direction: "row",
        align: 'start',
        items: [{ baseSize: baseSize }, { baseSize: baseSize }],
        width: boxSize,
        rtlEnabled: true,
        _layoutStrategy: "fallback"
    });

    var $boxItems = $box.find("." + BOX_ITEM_CLASS);

    var $firstItem = $boxItems.eq(0);
    assert.equal(relativeOffset($firstItem).left, boxSize - baseSize, "first item positioned correctly for align: start");

    var $secondItem = $boxItems.eq(1);
    assert.equal(relativeOffset($secondItem).left, boxSize - 2 * baseSize, "second item positioned correctly for align: start");

    var box = $box.dxBox("instance");
    box.option("align", "end");

    assert.equal(relativeOffset($firstItem).left, baseSize, "first item positioned correctly for align: end");
    assert.equal(relativeOffset($secondItem).left, 0, "second item positioned correctly for align: end");

    box.option("align", "center");

    assert.equal(relativeOffset($firstItem).left, (boxSize - 2 * baseSize) / 2 + baseSize, "first item positioned correctly for align: center");
    assert.equal(relativeOffset($secondItem).left, (boxSize - 2 * baseSize) / 2, "second item positioned correctly for align: center");

    box.option("align", "space-between");

    assert.equal(relativeOffset($firstItem).left, boxSize - baseSize, "first item positioned correctly for align: space-between");
    assert.equal(relativeOffset($secondItem).left, 0, "second item positioned correctly for align: space-between");

    box.option("align", "space-around");
    assert.equal(relativeOffset($firstItem).left, (boxSize / 2) + (boxSize / 2 - baseSize) / 2, "first item positioned correctly for align: space-around");
    assert.equal(relativeOffset($secondItem).left, (boxSize / 2 - baseSize) / 2, "second item positioned correctly for align: space-around");
});

QUnit.test("crossAlign for column direction", function(assert) {
    var size = 50;
    var boxSize = 2 * size;
    var $box = $("#box").dxBox({
        direction: "col",
        crossAlign: "start",
        items: [{ html: "<div style='width: " + size + "px'></div>" }],
        width: boxSize,
        rtlEnabled: true,
        _layoutStrategy: "fallback"
    });
    var box = $box.dxBox("instance");

    var $item = $box.find("." + BOX_ITEM_CLASS).eq(0);
    assert.equal(relativeOffset($item).left, size, "item positioned for crossAlign: start");
    assert.equal($item.width(), size, "item is stretched over content");

    box.option("crossAlign", "end");
    assert.equal(relativeOffset($item).left, 0, "item positioned for crossAlign: end");
    assert.equal($item.width(), size, "item is stretched over content");

    box.option("crossAlign", "center");
    assert.equal(relativeOffset($item).left, (boxSize - size) / 2, "item positioned for crossAlign: center");
    assert.equal($item.width(), size, "item is stretched over content");

    box.option("crossAlign", "stretch");
    assert.equal(relativeOffset($item).left, 0, "item positioned for crossAlign: stretch");
    assert.equal($item.width(), boxSize, "element is stretched over container");
});


QUnit.module("rendering box item");

QUnit.test("callstack should not grow when nesting is growing", function(assert) {
    var originalBox = Box;
    var deep = 0;
    registerComponent(
        "dxBox",
        Box.inherit({
            _render: function() {
                deep++;
                this.callBase.apply(this, arguments);
            },
            _renderItem: function() {
                var currentDeep = deep;
                this.callBase.apply(this, arguments);
                assert.equal(deep, currentDeep, "deep is normal");
            }
        })
    );
    try {
        $("#box").dxBox({
            items: [{
                box:
                {
                    items: [{
                        box: { items: ['1'] }
                    }]
                }
            }]
        });
    } finally {
        registerComponent("dxBox", originalBox);
    }
});

QUnit.test("onItemStateChanged action should fire after item visibility changed", function(assert) {
    var items = [{ text: "Item 1" }],
        itemStateChangedHandler = sinon.spy(),
        $box = $("#box").dxBox({ items: items, onItemStateChanged: itemStateChangedHandler }),
        box = $box.dxBox("instance");

    box.option("items[0].visible", false);

    var callArguments = itemStateChangedHandler.getCall(0).args[0];

    assert.equal(itemStateChangedHandler.callCount, 1, "itemStateChanged handler was called");
    assert.equal(callArguments.name, "visible", "name argument is correct");
    assert.equal(callArguments.state, false, "state argument is correct");
    assert.equal(callArguments.oldState, true, "oldState argument is correct");
});
