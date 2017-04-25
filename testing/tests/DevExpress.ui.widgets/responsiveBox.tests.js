"use strict";

var $ = require("jquery"),
    devices = require("core/devices"),
    errors = require("ui/widget/ui.errors"),
    registerComponent = require("core/component_registrator"),
    Widget = require("ui/widget/ui.widget"),
    ResponsiveBox = require("ui/responsive_box"),
    responsiveBoxScreenMock = require("../../helpers/responsiveBoxScreenMock.js");

require("common.css!");
require("ui/box");

QUnit.testStart(function() {
    var markup =
        '<div id="responsiveBox"></div>\
        \
        <div id="responsiveBoxWithTemplate">\
            <div data-options="dxItem: { location: { row: 0 , col: 0 } }">test</div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var BOX_CLASS = "dx-box",
    BOX_ITEM_CLASS = "dx-box-item",
    RESPONSIVE_BOX_CLASS = "dx-responsivebox",
    SCREEN_SIZE_CLASS_PREFIX = RESPONSIVE_BOX_CLASS + "-screen-";


var moduleConfig = {
    beforeEach: function() {
        responsiveBoxScreenMock.setup.call(this);
    },
    afterEach: function() {
        responsiveBoxScreenMock.teardown.call(this);
    }
};


QUnit.module("render", moduleConfig);

QUnit.test("render", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        items: [{ text: 1 }, { text: 2 }]
    });

    assert.ok($responsiveBox.hasClass(RESPONSIVE_BOX_CLASS), "necessary class attached");
    var $items = $responsiveBox.find("." + BOX_ITEM_CLASS);
    assert.equal($items.length, 2, "items rendered when rows and columns are not defined (using single column layout)");
});

QUnit.test("empty widget shouldn't raise exception on resize (T259132)", function(assert) {
    assert.expect(0);

    $("#responsiveBox").dxResponsiveBox({});
    this.updateScreenSize();
});


QUnit.module("layouting", moduleConfig);

QUnit.test("grid without items", function(assert) {
    var rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
    var cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
    var height = 600;
    var width = 600;
    var heightWithoutBaseSize = height - rows[0].baseSize - rows[1].baseSize;
    var widthWithoutBaseSize = width - cols[0].baseSize - cols[1].baseSize;
    var heightRatioUnit = heightWithoutBaseSize / (rows[0].ratio + rows[1].ratio);
    var widthRatioUnit = widthWithoutBaseSize / (cols[0].ratio + cols[1].ratio);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: rows,
        cols: cols,
        width: width,
        height: height
    });

    var $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(0);

    assert.equal($rowBox.dxBox("option", "direction"), "col", "rowBox wraps inner content");

    var $columnBoxes = $rowBox.find("." + BOX_CLASS);
    var columnBoxFirst = $columnBoxes.eq(0).dxBox("instance");
    var columnBoxSecond = $columnBoxes.eq(1).dxBox("instance");

    assert.equal($columnBoxes.length, 2, "two row boxes");
    assert.equal(columnBoxFirst.option("direction"), "row");
    assert.equal(columnBoxSecond.option("direction"), "row");

    assert.equal(columnBoxFirst.option("items").length, 2);
    assert.equal(columnBoxSecond.option("items").length, 2);

    var $firstRow = $columnBoxes.eq(0).find("." + BOX_ITEM_CLASS);
    assert.equal($firstRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, "empty item 11 width");
    assert.equal($firstRow.eq(0).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, "empty item 11 height");

    assert.equal($firstRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, "empty item 12 width");
    assert.equal($firstRow.eq(1).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, "empty item 12 height");

    var $secondRow = $columnBoxes.eq(1).find("." + BOX_ITEM_CLASS);
    assert.equal($secondRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, "empty item 21 width");
    assert.equal($secondRow.eq(0).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, "empty item 21 height");

    assert.equal($secondRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, "empty item 22 width");
    assert.equal($secondRow.eq(1).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, "empty item 22 height");
});

QUnit.test("grid with items", function(assert) {
    var rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
    var cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
    var height = 600;
    var width = 600;
    var heightWithoutBaseSize = height - rows[0].baseSize - rows[1].baseSize;
    var widthWithoutBaseSize = width - cols[0].baseSize - cols[1].baseSize;
    var heightRatioUnit = heightWithoutBaseSize / (rows[0].ratio + rows[1].ratio);
    var widthRatioUnit = widthWithoutBaseSize / (cols[0].ratio + cols[1].ratio);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: rows,
        cols: cols,
        items: [
            { location: { row: 0, col: 0 }, text: "item11" },
            { location: { row: 1, col: 1 }, text: "item22" },
            { location: { row: 1, col: 0 }, text: "item21" },
            { location: { row: 0, col: 1 }, text: "item12" }
        ],
        width: width,
        height: height
    });

    var $boxes = $responsiveBox.find("." + BOX_CLASS);

    var $rootBox = $boxes.eq(0);
    assert.equal($rootBox.text(), "item11item12item21item22", "items rendered correctly");

    var $firstRow = $boxes.eq(1).find("." + BOX_ITEM_CLASS);
    assert.equal($firstRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, "item11 width");
    assert.equal($firstRow.eq(0).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, "item11 height");

    assert.equal($firstRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, "item12 width");
    assert.equal($firstRow.eq(1).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, "item12 height");

    var $secondRow = $boxes.eq(2).find("." + BOX_ITEM_CLASS);
    assert.equal($secondRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, "item21 width");
    assert.equal($secondRow.eq(0).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, "item21 height");

    assert.equal($secondRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, "item22 width");
    assert.equal($secondRow.eq(1).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, "item22 height");
});

QUnit.test("grid with factors", function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200

    this.updateScreenSize(500);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}, { screen: "sm md lg" }, { screen: "md lg" }, { screen: "lg" }],
        cols: [{}, { screen: "sm md lg" }, { screen: "md lg" }, { screen: "lg" }],
        items: [
            { location: { row: 0, col: 0, screen: "lg" }, text: "item(0,0)-lg" },
            { location: { row: 0, col: 0, screen: "md" }, text: "item(0,0)-md" },
            { location: { row: 0, col: 0, screen: "sm" }, text: "item(0,0)-sm" },
            { location: { row: 0, col: 0, screen: "xs" }, text: "item(0,0)-xs" },
            { location: { row: 0, col: 1 }, text: " item(0,1)" },
            { location: { row: 0, col: 2 }, text: " item(0,2)" },
            { location: { row: 0, col: 3 }, text: " item(0,3)" },

            { location: { row: 1, col: 0 }, text: " item(1,0)" },
            { location: { row: 1, col: 1 }, text: " item(1,1)" },
            { location: { row: 1, col: 2 }, text: " item(1,2)" },
            { location: { row: 1, col: 3 }, text: " item(1,3)" },

            { location: { row: 2, col: 0 }, text: " item(2,0)" },
            { location: { row: 2, col: 1 }, text: " item(2,1)" },
            { location: { row: 2, col: 2 }, text: " item(2,2)" },
            { location: { row: 2, col: 3 }, text: " item(2,3)" },

            { location: { row: 3, col: 0 }, text: " item(3,0)" },
            { location: { row: 3, col: 1 }, text: " item(3,1)" },
            { location: { row: 3, col: 2 }, text: " item(3,2)" },
            { location: { row: 3, col: 3 }, text: " item(3,3)" }
        ]
    });

    // xs screen
    var xsExpectedText = "item(0,0)-xs";
    assert.equal($responsiveBox.text(), xsExpectedText);

    // sm screen
    var smallExpectedText = "item(0,0)-sm item(0,1) item(1,0) item(1,1)";
    this.updateScreenSize(800);

    assert.equal($responsiveBox.text(), smallExpectedText);

    // md screen
    var mediumExpectedText = "item(0,0)-md item(0,1) item(0,2) item(1,0) item(1,1) item(1,2) item(2,0) item(2,1) item(2,2)";
    this.updateScreenSize(1000);

    assert.equal($responsiveBox.text(), mediumExpectedText);

    // lg screen
    var lgExpectedText = "item(0,0)-lg item(0,1) item(0,2) item(0,3) item(1,0) item(1,1) item(1,2) item(1,3) item(2,0) item(2,1) item(2,2) item(2,3) item(3,0) item(3,1) item(3,2) item(3,3)";
    this.updateScreenSize(1500);

    assert.equal($responsiveBox.text(), lgExpectedText);
});

QUnit.test("colspan", function(assert) {
    var cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
    var size = 900;

    var sizeWithoutBaseSize = size - cols[0].baseSize - cols[1].baseSize - cols[2].baseSize;
    var ratioUnit = sizeWithoutBaseSize / (cols[0].ratio + cols[1].ratio + cols[2].ratio);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: cols,
        width: size,
        items: [{ location: { row: 0, col: 0, colspan: 2 } }, { location: { row: 0, col: 2 } }]
    });

    var $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(1);
    var $boxItems = $rowBox.find("." + BOX_ITEM_CLASS);

    assert.equal($boxItems.length, 2, "two items were rendered");

    var firstColumnSize = cols[0].baseSize + cols[0].ratio * ratioUnit;
    var secondColumnSize = cols[1].baseSize + cols[1].ratio * ratioUnit;
    var thirdColumnSize = cols[2].baseSize + cols[2].ratio * ratioUnit;

    assert.equal($boxItems.eq(0).width(), firstColumnSize + secondColumnSize, "first item size");
    assert.equal($boxItems.eq(1).width(), thirdColumnSize, "second item size");
});

QUnit.test("rowspan", function(assert) {
    var rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
    var size = 900;

    var sizeWithoutBaseSize = size - rows[0].baseSize - rows[1].baseSize - rows[2].baseSize;
    var ratioUnit = sizeWithoutBaseSize / (rows[0].ratio + rows[1].ratio + rows[2].ratio);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: rows,
        cols: [{}],
        height: size,
        items: [{ location: { row: 0, col: 0, rowspan: 2 } }, { location: { row: 2, col: 0 } }]
    });

    var $boxItems = $responsiveBox.find("." + BOX_ITEM_CLASS);

    assert.equal($boxItems.length, 2, "two items were rendered");

    var firstRowSize = rows[0].baseSize + rows[0].ratio * ratioUnit;
    var secondRowSize = rows[1].baseSize + rows[1].ratio * ratioUnit;
    var thirdRowSize = rows[2].baseSize + rows[2].ratio * ratioUnit;

    assert.equal($boxItems.eq(0).height(), firstRowSize + secondRowSize, "first item size");
    assert.equal($boxItems.eq(1).height(), thirdRowSize, "second item size");
});


QUnit.test("rowspan and colspan", function(assert) {
    var rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
    var cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
    var size = 900;

    var sizeWithoutBaseSize = size - rows[0].baseSize - rows[1].baseSize - rows[2].baseSize;
    var ratioUnit = sizeWithoutBaseSize / (rows[0].ratio + rows[1].ratio + rows[2].ratio);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: rows,
        cols: cols,
        items: [
            { location: { row: 0, col: 0, rowspan: 2 } },
            { location: { row: 0, col: 1, colspan: 2 } }
        ],
        width: size,
        height: size
    });

    var $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(1);

    assert.equal($rowBox.height(), rows[0].baseSize + rows[1].baseSize + ratioUnit * rows[0].ratio + ratioUnit * rows[1].ratio, "rowspan height");

    var $colBox = $rowBox.find("." + BOX_CLASS).eq(0);

    assert.equal($colBox.width(), cols[1].baseSize + cols[2].baseSize + ratioUnit * cols[1].ratio + ratioUnit * cols[2].ratio, "colspan width");

    assert.equal($rowBox.height(), $colBox.height(), "inner boxes are equal");
});

QUnit.test("rowspan and colspan simultaneously", function(assert) {
    var rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
    var cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
    var size = 900;

    var sizeWithoutBaseSize = size - rows[0].baseSize - rows[1].baseSize - rows[2].baseSize;
    var ratioUnit = sizeWithoutBaseSize / (rows[0].ratio + rows[1].ratio + rows[2].ratio);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: rows,
        cols: cols,
        items: [{
            location: { col: 0, row: 0, colspan: 2, rowspan: 2 }
        }],
        width: size,
        height: size
    });

    var $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(1);
    var $firstItem = $rowBox.find("." + BOX_ITEM_CLASS).eq(0);

    var firstItemWidth = rows[0].baseSize + rows[1].baseSize + ratioUnit * rows[0].ratio + ratioUnit * rows[1].ratio;
    var firstItemHeight = cols[0].baseSize + cols[1].baseSize + ratioUnit * cols[0].ratio + ratioUnit * cols[1].ratio;

    assert.equal($firstItem.width(), firstItemWidth, "item width");
    assert.equal($firstItem.height(), firstItemHeight, "item height");
});

QUnit.test("overlapping rowspan and colspan", function(assert) {
    var size = 100;
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}, {}, {}],
        cols: [{}, {}, {}, {}],
        items: [
            { location: { col: 0, row: 0, rowspan: 3 } },
            { location: { col: 1, row: 1, rowspan: 2 } },
            { location: { col: 1, row: 0, colspan: 2 } },
            { location: { col: 2, row: 1, colspan: 2 } }
        ],
        width: 4 * size,
        height: 3 * size
    });

    var $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(1);

    assert.equal($rowBox.height(), 3 * size, "first row box height");

    var $colBox = $rowBox.find("." + BOX_CLASS).eq(1);

    assert.equal($colBox.width(), 3 * size, "second col box width");
});

QUnit.test("recalculation on size changing", function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200
    var $responsiveBox = $("#responsiveBox");

    this.setScreenSize(500);

    $responsiveBox.dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { screen: "sm", row: 0, col: 0 }, text: "sm" },
            { location: { screen: "xs", row: 0, col: 0 }, text: "xs" },
            { location: { screen: "md", row: 0, col: 0 }, text: "md" }
        ]
    });
    var responsiveBox = $responsiveBox.dxResponsiveBox("instance");

    this.setScreenSize(1000);
    responsiveBox.repaint();
    assert.equal($.trim($responsiveBox.text()), "md", "md item apply");
});

QUnit.test("repaint should not detach items", function(assert) {
    assert.expect(0);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [{ location: { row: 0, col: 0 }, text: 'test' }]
    });

    var $childrenResponsiveBox;

    try {
        var $dxItem = $responsiveBox.find("." + BOX_ITEM_CLASS).first().children();
        $childrenResponsiveBox = $("<div>").dxResponsiveBox({
            onDisposing: function() {
                assert.ok(false, "widget disposed");
            }
        }).appendTo($dxItem);

        $responsiveBox.dxResponsiveBox("repaint");
    } finally {
        $childrenResponsiveBox.dxResponsiveBox("option", "onDisposing", null);
    }
});

QUnit.test("minSize and maxSize", function(assert) {
    var size = 100;
    var minSize = 80;
    var maxSize = 5;

    var device = devices.real(),
        version = device.version,
        isAndroid = device.android;

    if(isAndroid && (version[0] < 4 || (version[0] === 4 && version[1] === 0))) {
        assert.ok(true, "old android min/max height problem");
        return;
    }

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{ baseSize: 0, minSize: minSize, ratio: 1 }, { maxSize: maxSize, ratio: 1 }, { ratio: 1 }],
        cols: [{ baseSize: 0, minSize: minSize, ratio: 1 }, { maxSize: maxSize, ratio: 1 }, { ratio: 1 }],
        items: [
            { location: { row: 0, col: 0 }, html: "<div class='first'></div>" },
            { location: { row: 1, col: 1 }, html: "<div class='second'></div>" }
        ],
        width: size,
        height: size
    });

    var $first = $responsiveBox.find(".first").parent();
    var $second = $responsiveBox.find(".second").parent();

    assert.equal($first.width(), minSize, "width is min-width");
    assert.equal($first.height(), minSize, "height is min-height");

    assert.equal($second.width(), maxSize, "width is max-width");
    assert.equal($second.height(), maxSize, "height is max-height");
});

QUnit.test("singleColumnScreen render items in one column", function(assert) {
    this.updateScreenSize(500);

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}, {}],
        cols: [{}, {}],
        singleColumnScreen: "xs",
        items: [
            { location: { row: 0, col: 0, rowspan: 2 }, text: "1" },
            { location: { row: 1, col: 1, colspan: 2 }, text: "4" },
            { location: { row: 0, col: 1, screen: 'sm md lg' }, text: "2" },
            { location: { row: 1, col: 0, screen: 'xs sm' }, text: "3" }
        ]
    });

    var responsiveBox = $responsiveBox.dxResponsiveBox("instance");

    var checkLayoutByScreen = $.proxy(function(screenWidth, expectedText) {
        this.updateScreenSize(screenWidth);

        var $box = $responsiveBox.find("." + BOX_CLASS);
        assert.equal($box.length, 1, "one box rendered");

        var $items = $box.find("." + BOX_ITEM_CLASS);
        assert.equal($items.length, expectedText.length, $items.length + " items rendered");

        assert.equal($.trim($responsiveBox.text()), expectedText, "rendered only needed items");
    }, this);

    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200
    checkLayoutByScreen(500, "134");

    responsiveBox.option("singleColumnScreen", "xs sm");

    checkLayoutByScreen(800, "1234");
});

QUnit.test("too complex layout", function(assert) {
    assert.throws(function() {
        var size = 900;

        $("#responsiveBox").dxResponsiveBox({
            rows: [
                { ratio: 1 },
                { ratio: 1 },
                { ratio: 1 },
                { ratio: 1 }
            ],
            cols: [
                { ratio: 1 },
                { ratio: 1 },
                { ratio: 1 },
                { ratio: 1 }
            ],
            items: [
                { location: { row: 0, col: 0, colspan: 3 }, html: "<div class='div_0_0'/>" },
                { location: { row: 1, col: 0, rowspan: 3 }, html: "<div class='div_1_0'/>" },
                { location: { row: 1, col: 1, rowspan: 2, colspan: 2 }, html: "<div class='div_1_1'/>" },
                { location: { row: 0, col: 3, rowspan: 3 }, html: "<div class='div_0_3'/>" },
                { location: { row: 3, col: 1, colspan: 3 }, html: "<div class='div_3_1'/>" }
            ],
            width: size,
            height: size
        });
    },
        errors.Error("E1025"),
        "raised error E1025");
});

QUnit.test("singleColumnScreen render items with baseSize: auto", function(assert) {
    this.updateScreenSize(500);

    var $responsiveBox = $("#responsiveBox").css("height", "auto").dxResponsiveBox({
        rows: [{}, {}],
        cols: [{}],
        singleColumnScreen: "xs",
        items: [
            { location: { row: 0, col: 0 }, text: "1" },
            { location: { row: 0, col: 1 }, text: "2" }
        ]
    });

    assert.notEqual($responsiveBox.height(), 0, "item has height: auto");
});

QUnit.test("width and height rendered correctly when dxResponsiveBox has one row and column", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        width: "auto",
        height: "auto",
        rows: [{ ratio: 1, baseSize: "auto" }],
        cols: [{ ratio: 1, baseSize: "auto" }],
        items: [{ location: { row: 0, col: 0 }, html: "<div style='height: 100px;'></div>" }]
    });

    assert.equal($responsiveBox.height(), 100, "height calculated correctly");

    var $item = $responsiveBox.find(".dx-box-item");

    assert.equal($item.width(), $responsiveBox.width(), "item width calculated correctly");
});

QUnit.test("dxUpdate trigger async after render and dimension changed", function(assert) {
    var clock = sinon.useFakeTimers();
    try {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200
        this.updateScreenSize(900);
        var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            width: "auto",
            height: "auto",
            rows: [{ ratio: 1, baseSize: "auto" }],
            cols: [{ ratio: 1, baseSize: "auto" }],
            items: [{ location: { row: 0, col: 0 } }]
        });

        var $box = $responsiveBox.find(".dx-box").eq(0);
        var dxUpdateEventCounter = 0;
        $box.on("dxupdate", function() {
            dxUpdateEventCounter++;
        });

        assert.equal(dxUpdateEventCounter, 0, "dxupdate was not fired sync after render");

        clock.tick();
        assert.equal(dxUpdateEventCounter, 1, "dxupdate was fired async after render");

        dxUpdateEventCounter = 0;
        this.updateScreenSize(1000);
        $box = $responsiveBox.find(".dx-box").eq(0);
        $box.on("dxupdate", function() {
            dxUpdateEventCounter++;
        });

        assert.equal(dxUpdateEventCounter, 0, "dxupdate was not fired sync after dimensionChanged");

        clock.tick();
        assert.equal(dxUpdateEventCounter, 1, "dxupdate was fired async after dimensionChanged");

    } finally {
        clock.restore();
    }
});

QUnit.test("Box should has a class appropriate a screen resolution", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        width: "auto",
        height: "auto"
    });

    this.updateScreenSize(600);
    assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "xs"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "sm"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "md"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "lg"));

    this.updateScreenSize(800);
    assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "sm"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "xs"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "md"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "lg"));

    this.updateScreenSize(1000);
    assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "md"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "xs"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "sm"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "lg"));

    this.updateScreenSize(1300);
    assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "lg"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "xs"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "sm"));
    assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + "md"));
});

QUnit.test("dxUpdate should not be bubbling to parent container", function(assert) {
    var clock = sinon.useFakeTimers();
    var $parentContainer = $("<div>");

    $parentContainer.appendTo("#qunit-fixture");

    try {
        var dxUpdateStub = sinon.stub();
        var $responsiveBox = $("<div>").dxResponsiveBox({
            width: "auto",
            height: "auto",
            rows: [{ ratio: 1, baseSize: "auto" }],
            cols: [{ ratio: 1, baseSize: "auto" }],
            items: [{ location: { row: 0, col: 0 } }],
            _layoutStrategy: "fallback"
        });
        $responsiveBox.appendTo($parentContainer);

        $parentContainer.on("dxupdate", dxUpdateStub);

        $responsiveBox.dxResponsiveBox("repaint");
        clock.tick();

        assert.equal(dxUpdateStub.callCount, 0, "dxupdate was not fired after repaint");
    } finally {
        $parentContainer.remove();
        clock.restore();
    }
});


QUnit.module("behavior");

QUnit.test("update does not rerender items", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [{ location: { col: 0, row: 0 }, html: "<div class='test'>" }]
    });

    var $div = $responsiveBox.find(".test");
    $responsiveBox.dxResponsiveBox("repaint");

    assert.equal($responsiveBox.find(".test").get(0), $div.get(0), "item was not rerendered");
});


QUnit.module("templates");

QUnit.test("custom item templates", function(assert) {
    var $responsiveBox = $("#responsiveBoxWithTemplate").dxResponsiveBox({
        rows: [{}],
        cols: [{}]
    });
    assert.equal($.trim($responsiveBox.text()), "test", "item template rendered");
});

QUnit.test("custom item renderer", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        itemTemplate: function() {
            return $("<div>test</div>");
        },
        items: [{ location: { row: 0, col: 0 } }]
    });

    assert.equal($.trim($responsiveBox.text()), "test", "item rendered");
});


QUnit.module("template rendering", moduleConfig);

QUnit.test("widget inside item is not disposed", function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200

    this.updateScreenSize(1000);

    registerComponent("dxWidget", Widget.inherit({}));

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            {
                location: { row: 0, col: 0, screen: 'md' }, template: function() {
                    return $("<div>").dxWidget();
                }
            }
        ]
    });

    var $widget = $responsiveBox.find(".dx-item .dx-widget");
    var initialWidget = $widget.dxWidget("instance");

    this.updateScreenSize(700);
    this.updateScreenSize(1000);

    $widget = $responsiveBox.find(".dx-item .dx-widget");
    assert.equal($widget.dxWidget("instance"), initialWidget, "widget was rendered correctly");
});

QUnit.test("template rendered when it set after creation", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [{
            location: { row: 0, col: 0, text: "before rendering" }
        }]
    });

    $responsiveBox.dxResponsiveBox("option", "itemTemplate", function() {
        return $("<div>").text("after rendering");
    });

    assert.equal($.trim($responsiveBox.text()), "after rendering", "item template was rendered");
});

QUnit.test("widget rendered correctly after rows option was changed", function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200

    this.updateScreenSize(1000);

    registerComponent("dxWidget", Widget.inherit({}));

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            {
                location: { row: 0, col: 0, screen: 'md' }, template: function() {
                    return $("<div>").dxWidget();
                }
            }
        ]
    });

    $responsiveBox.dxResponsiveBox("option", "rows", [{}]);
    assert.ok($responsiveBox.find(".dx-item .dx-widget").dxWidget("instance"), "widget is created");
});


QUnit.module("collision", moduleConfig);

QUnit.test("item located at the same cell of another item", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}, {}],
        cols: [{}, {}],
        items: [
            { location: { row: 0, col: 0 }, text: "0" },
            { location: { row: 0, col: 0 }, text: "1" },
            { location: { row: 1, col: 1 }, text: "2" },
            { location: { row: 1, col: 1 }, text: "3" }
        ]
    });

    assert.equal($.trim($responsiveBox.text()), "02", "the former item rendered");
});

QUnit.test("item located at spanning cell", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}, {}],
        items: [
            { location: { row: 0, col: 0, colspan: 2 }, text: "0" },
            { location: { row: 0, col: 1 }, text: "1" }
        ]
    });

    assert.equal($.trim($responsiveBox.text()), "0", "the former item rendered");
});

QUnit.test("item spanning located at spanning of another item", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}, {}],
        cols: [{}, {}],
        items: [
            { location: { row: 0, col: 1, rowspan: 2 }, text: "0" },
            { location: { row: 1, col: 0, colspan: 2 }, text: "1" }
        ]
    });

    assert.equal($.trim($responsiveBox.text()), "0", "the former item rendered");
});

QUnit.test("item spanning out of bounds", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}, {}],
        cols: [{}],
        items: [
            { location: { row: 0, col: 0, colspan: 2 }, text: "0" },
            { location: { row: 1, col: 0, rowspan: 2 }, text: "1" }
        ]
    });

    assert.equal($.trim($responsiveBox.text()), "01", "the former item rendered");
});


QUnit.module("events", moduleConfig);

QUnit.test("onLayoutChanged", function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200

    this.updateScreenSize(500);
    var onLayoutChangedSpy = sinon.stub();
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { row: 0, col: 0 }, text: "item(0,0)" }
        ],
        onLayoutChanged: onLayoutChangedSpy
    });

    assert.equal(onLayoutChangedSpy.called, false, "onLayoutChanged not triggered on start");

    // sm screen
    this.updateScreenSize(800);

    assert.ok(onLayoutChangedSpy.calledOnce, "onLayoutChanged was triggered");

    // md screen
    this.updateScreenSize(1000);

    assert.ok(onLayoutChangedSpy.calledTwice, "onLayoutChanged was triggered twice");

    this.updateScreenSize(1001);

    assert.ok(onLayoutChangedSpy.calledTwice, "onLayoutChanged was not triggered when screen was not changed");

    $responsiveBox.dxResponsiveBox("repaint");
    assert.ok(onLayoutChangedSpy.calledThrice, "onLayoutChanged was triggered after repaint");
});

QUnit.test("onItemClick", function(assert) {
    var responsiveBox = new ResponsiveBox($("#responsiveBox"), {
        items: [{ text: 1 }, { text: 2 }]
    });
    responsiveBox.on("itemClick", function() {
        assert.ok(true, "clicked");
    });

    responsiveBox.itemElements().eq(0).trigger("dxclick");
});


QUnit.module("option", moduleConfig);

QUnit.test("currentScreenFactor", function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200

    this.updateScreenSize(500);
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { row: 0, col: 0 }, text: "item(0,0)" }
        ]
    });

    var responsiveBox = $responsiveBox.dxResponsiveBox("instance");

    assert.equal(responsiveBox.option("currentScreenFactor"), "xs", "currentScreenFactor update on start");

    // sm screen
    this.updateScreenSize(800);

    assert.equal(responsiveBox.option("currentScreenFactor"), "sm", "currentScreenFactor update after restart");
});

QUnit.test("_layoutStrategy pass to internal box", function(assert) {
    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { row: 0, col: 0 } }
        ],
        _layoutStrategy: "test"
    });

    var box = $responsiveBox.find(".dx-box").eq(0).dxBox("instance");

    assert.equal(box.option("_layoutStrategy"), "test", "_layoutStrategy was passed to internal box");
});

QUnit.test("Changing visibility should update simulated strategy", function(assert) {
    var clock = sinon.useFakeTimers();
    try {
        var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            visible: false,
            _layoutStrategy: "fallback",
            height: 400,
            rows: [
                { ratio: 1 },
                { ratio: 1 }
            ],
            cols: [{}],
            items: [{ location: { row: 0, col: 0 }, template: function() { return $("<div>").prop("id", "cellTest"); } }]
        });
        var responsiveBox = $responsiveBox.dxResponsiveBox("instance");

        clock.tick();

        responsiveBox.option("visible", true);

        clock.tick();

        var $firstItem = $("#cellTest").closest(".dx-item");

        assert.equal($firstItem.height(), 200, "height calculate correctly");
    } finally {
        clock.restore();
    }
});

QUnit.test("onOptionChanged should not be fired after click on item", function(assert) {
    var onOptionChangedStub = sinon.stub();

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
                { location: { row: 0, col: 0 }, text: "item(0,0)" }
        ],
        onOptionChanged: onOptionChangedStub
    });
    var initCallCount = onOptionChangedStub.callCount;

    $responsiveBox.find(".dx-item").trigger("dxclick");

    assert.equal(onOptionChangedStub.callCount, initCallCount, "onOptionChanged wasn't fired");
});
