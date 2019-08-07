import $ from "jquery";
import devices from "core/devices";
import registerComponent from "core/component_registrator";
import Widget from "ui/widget/ui.widget";
import ResponsiveBox from "ui/responsive_box";
import screenMock from "../../helpers/screenMock.js";

import "common.css!";
import "ui/box";

const BOX_CLASS = "dx-box";
const BOX_ITEM_CLASS = "dx-box-item";
const RESPONSIVE_BOX_CLASS = "dx-responsivebox";
const SCREEN_SIZE_CLASS_PREFIX = RESPONSIVE_BOX_CLASS + "-screen-";

QUnit.testStart(function() {
    const markup =
        '<div id="responsiveBox"></div>\
        \
        <div id="responsiveBoxWithTemplate">\
            <div data-options="dxItem: { location: { row: 0 , col: 0 } }">test</div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const moduleConfig = {
    beforeEach: () => {
        this.screenMock = new screenMock();
    },
    afterEach: () => {
        this.screenMock.restore();
    }
};

QUnit.module("layouting", moduleConfig);

QUnit.test("check size of grid without items", (assert) => {
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
    var $columnBoxes = $rowBox.find("." + BOX_CLASS);

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

QUnit.test("check size of grid with items", (assert) => {
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

QUnit.test("root box and it's items should have correct height (T566515)", (assert) => {
    var rows = [{}, {}];
    var cols = [{ ratio: 1 }, { ratio: 1 }];

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: rows,
        cols: cols,
        items: [
            { location: { row: 0, col: 0 }, text: "item11" },
            { location: { row: 1, col: 1 }, text: "item22" },
            { location: { row: 1, col: 0 }, text: "item21" },
            { location: { row: 0, col: 1 }, text: "item12" }
        ],
        height: "auto"
    });

    var $boxes = $responsiveBox.find("." + BOX_CLASS);

    var $rootBox = $boxes.eq(0);
    assert.notEqual($rootBox.height(), 0, "Height of the rootBox is OK");

    var $rootItems = $rootBox.find("." + BOX_ITEM_CLASS);

    assert.roughEqual($rootItems.eq(0).height(), 16, 2.1, "Height of the root item is OK");
    assert.roughEqual($rootItems.eq(1).height(), 16, 2.1, "Height of the root item is OK");
});

QUnit.test("check width of colspan", (assert) => {
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

    var firstColumnSize = cols[0].baseSize + cols[0].ratio * ratioUnit;
    var secondColumnSize = cols[1].baseSize + cols[1].ratio * ratioUnit;
    var thirdColumnSize = cols[2].baseSize + cols[2].ratio * ratioUnit;

    assert.equal($boxItems.eq(0).width(), firstColumnSize + secondColumnSize, "first item size");
    assert.equal($boxItems.eq(1).width(), thirdColumnSize, "second item size");
});

QUnit.test("check height of rowspan", (assert) => {
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

    var firstRowSize = rows[0].baseSize + rows[0].ratio * ratioUnit;
    var secondRowSize = rows[1].baseSize + rows[1].ratio * ratioUnit;
    var thirdRowSize = rows[2].baseSize + rows[2].ratio * ratioUnit;

    assert.equal($boxItems.eq(0).height(), firstRowSize + secondRowSize, "first item size");
    assert.equal($boxItems.eq(1).height(), thirdRowSize, "second item size");
});


QUnit.test("rowspan and colspan", (assert) => {
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

QUnit.test("rowspan and colspan simultaneously", (assert) => {
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

QUnit.test("overlapping rowspan and colspan", (assert) => {
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

    assert.roughEqual($rowBox.height(), 3 * size, 0.1, "first row box height");

    var $colBox = $rowBox.find("." + BOX_CLASS).eq(1);

    assert.roughEqual($colBox.width(), 3 * size, 0.1, "second col box width");
});

QUnit.test("minSize and maxSize", (assert) => {
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

QUnit.test("singleColumnScreen render items with baseSize: auto", (assert) => {
    this.screenMock.updateWindowWidth(500);

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

QUnit.test("width and height rendered correctly when dxResponsiveBox has one row and column", (assert) => {
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

QUnit.test("dxUpdate should not be bubbling to parent container", (assert) => {
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

        $($parentContainer).on("dxupdate", dxUpdateStub);

        $responsiveBox.dxResponsiveBox("repaint");
        clock.tick();

        assert.equal(dxUpdateStub.callCount, 0, "dxupdate was not fired after repaint");
    } finally {
        $parentContainer.remove();
        clock.restore();
    }
});

QUnit.test("empty widget shouldn't raise exception on resize (T259132)", (assert) => {
    assert.expect(0);

    $("#responsiveBox").dxResponsiveBox({});
    this.screenMock.updateWindowWidth();
});

QUnit.test("grid with factors", (assert) => {
    this.screenMock.updateWindowWidth(500);

    let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
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

    let xsExpectedText = "item(0,0)-xs",
        smallExpectedText = "item(0,0)-sm item(0,1) item(1,0) item(1,1)",
        mediumExpectedText = "item(0,0)-md item(0,1) item(0,2) item(1,0) item(1,1) item(1,2) item(2,0) item(2,1) item(2,2)",
        lgExpectedText = "item(0,0)-lg item(0,1) item(0,2) item(0,3) item(1,0) item(1,1) item(1,2) item(1,3) item(2,0) item(2,1) item(2,2) item(2,3) item(3,0) item(3,1) item(3,2) item(3,3)";

    // xs screen
    assert.equal($responsiveBox.text(), xsExpectedText);

    // sm screen
    this.screenMock.updateWindowWidth(800);
    assert.equal($responsiveBox.text(), smallExpectedText);

    // md screen
    this.screenMock.updateWindowWidth(1000);
    assert.equal($responsiveBox.text(), mediumExpectedText);

    // lg screen
    this.screenMock.updateWindowWidth(1500);
    assert.equal($responsiveBox.text(), lgExpectedText);
});

QUnit.test("recalculation on size changing", (assert) => {
    let $responsiveBox = $("#responsiveBox");

    this.screenMock.setWindowWidth(500);

    $responsiveBox.dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { screen: "sm", row: 0, col: 0 }, text: "sm" },
            { location: { screen: "xs", row: 0, col: 0 }, text: "xs" },
            { location: { screen: "md", row: 0, col: 0 }, text: "md" }
        ]
    });
    let responsiveBox = $responsiveBox.dxResponsiveBox("instance");

    this.screenMock.setWindowWidth(1000);
    responsiveBox.repaint();
    assert.equal($.trim($responsiveBox.text()), "md", "md item apply");
});

QUnit.test("singleColumnScreen render items in one column", (assert) => {
    this.screenMock.updateWindowWidth(500);

    let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
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

    let responsiveBox = $responsiveBox.dxResponsiveBox("instance");

    let checkLayoutByScreen = $.proxy(function(screenWidth, expectedText) {
        this.screenMock.updateWindowWidth(screenWidth);

        let $box = $responsiveBox.find("." + BOX_CLASS);
        assert.equal($box.length, 1, "one box rendered");

        let $items = $box.find("." + BOX_ITEM_CLASS);
        assert.equal($items.length, expectedText.length, $items.length + " items rendered");

        assert.equal($.trim($responsiveBox.text()), expectedText, "rendered only needed items");
    }, this);

    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200
    checkLayoutByScreen(500, "134");

    responsiveBox.option("singleColumnScreen", "xs sm");

    checkLayoutByScreen(800, "1234");
});

QUnit.test("dxUpdate trigger async after render and dimension changed", (assert) => {
    let clock = sinon.useFakeTimers();
    try {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200
        this.screenMock.updateWindowWidth(900);
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            width: "auto",
            height: "auto",
            rows: [{ ratio: 1, baseSize: "auto" }],
            cols: [{ ratio: 1, baseSize: "auto" }],
            items: [{ location: { row: 0, col: 0 } }]
        });

        let $box = $responsiveBox.find(".dx-box").eq(0);
        let dxUpdateEventCounter = 0;
        $($box).on("dxupdate", () => {
            dxUpdateEventCounter++;
        });

        assert.equal(dxUpdateEventCounter, 0, "dxupdate was not fired sync after render");

        clock.tick();
        assert.equal(dxUpdateEventCounter, 1, "dxupdate was fired async after render");

        dxUpdateEventCounter = 0;
        this.screenMock.updateWindowWidth(1000);
        $box = $responsiveBox.find(".dx-box").eq(0);
        $($box).on("dxupdate", () => {
            dxUpdateEventCounter++;
        });

        assert.equal(dxUpdateEventCounter, 0, "dxupdate was not fired sync after dimensionChanged");

        clock.tick();
        assert.equal(dxUpdateEventCounter, 1, "dxupdate was fired async after dimensionChanged");

    } finally {
        clock.restore();
    }
});

QUnit.test("Box should has a class appropriate a screen resolution", (assert) => {
    let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        width: "auto",
        height: "auto"
    });

    const checkScreenSizeClasses = (expectedPrefix) => {
        ["xs", "sm", "md", "lg"].forEach((prefix) => {
            assert.strictEqual($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + prefix), prefix === expectedPrefix, `prefix ${prefix} - ${prefix === expectedPrefix}`);
        });
    };

    this.screenMock.updateWindowWidth(600);
    checkScreenSizeClasses("xs");

    this.screenMock.updateWindowWidth(800);
    checkScreenSizeClasses("sm");

    this.screenMock.updateWindowWidth(1000);
    checkScreenSizeClasses("md");

    this.screenMock.updateWindowWidth(1300);
    checkScreenSizeClasses("lg");
});

QUnit.module("template rendering", moduleConfig, () => {
    QUnit.test("template rendered when it set after creation", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{
                location: { row: 0, col: 0, text: "before rendering" }
            }]
        });

        $responsiveBox.dxResponsiveBox("option", "itemTemplate", () => {
            return $("<div>").text("after rendering");
        });

        assert.equal($.trim($responsiveBox.text()), "after rendering", "item template was rendered");
    });

    QUnit.test("widget rendered correctly after rows option was changed", (assert) => {
        this.screenMock.updateWindowWidth(1000);

        registerComponent("dxWidget", Widget.inherit({}));

        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                {
                    location: { row: 0, col: 0, screen: 'md' }, template: () => {
                        return $("<div>").dxWidget();
                    }
                }
            ]
        });

        $responsiveBox.dxResponsiveBox("option", "rows", [{}]);
        assert.ok($responsiveBox.find(".dx-item .dx-widget").dxWidget("instance"), "widget is created");
    });
});

QUnit.test("Set the shrink option of row to box when the singleColumnMode is applied", (assert) => {
    this.screenMock.updateWindowWidth(500);

    const $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        _layoutStrategy: "flex",
        rows: [{
            shrink: 0, screen: "xs"
        }, {
            screen: "xs"
        }, {}],
        cols: [{}, {}],
        singleColumnScreen: "xs",
        items: [
            { location: { row: 0, col: 0 } },
            { location: { row: 1, col: 0 } },
            { location: { row: 0, col: 0 } }
        ]
    });

    const $items = $responsiveBox.find(`.${BOX_ITEM_CLASS}`);
    assert.equal($items.eq(0).css("flex-shrink"), 0, "flex-shrink is applied for first row");
    assert.equal($items.eq(1).css("flex-shrink"), 1, "flex-shrink is applied for second row");
    assert.equal($items.eq(2).css("flex-shrink"), 1, "flex-shrink is applied for third row");
});

QUnit.module("template rendering", moduleConfig);

QUnit.test("widget inside item is not disposed", (assert) => {
    this.screenMock.updateWindowWidth(1000);

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

    this.screenMock.updateWindowWidth(700);
    this.screenMock.updateWindowWidth(1000);

    $widget = $responsiveBox.find(".dx-item .dx-widget");
    assert.equal($widget.dxWidget("instance"), initialWidget, "widget was rendered correctly");
});

QUnit.test("items have no unsafe modifications after dispose", (assert) => {
    this.screenMock.updateWindowWidth(1000);

    var items = [
        {
            location: { row: 0, col: 0, screen: 'md' }, template: "template"
        }
    ];

    var result = [
        {
            // only safe modifications
            baseSize: "auto",
            ratio: 1,
            //
            location: {
                row: 0,
                col: 0,
                screen: "md"
            },
            template: "template"
        }
    ];

    var $responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: items
    });

    assert.ok(items[0].node, "node exists on rendering (unsafe)");

    $responsiveBox.dxResponsiveBox("instance").dispose();

    assert.deepEqual(items, result, "items have no unsafe modifications after dispose");
});


QUnit.module("events", moduleConfig);

QUnit.test("onLayoutChanged", (assert) => {
    this.screenMock.updateWindowWidth(500);
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
    this.screenMock.updateWindowWidth(800);

    assert.ok(onLayoutChangedSpy.calledOnce, "onLayoutChanged was triggered");

    // md screen
    this.screenMock.updateWindowWidth(1000);

    assert.ok(onLayoutChangedSpy.calledTwice, "onLayoutChanged was triggered twice");

    this.screenMock.updateWindowWidth(1001);

    assert.ok(onLayoutChangedSpy.calledTwice, "onLayoutChanged was not triggered when screen was not changed");

    $responsiveBox.dxResponsiveBox("repaint");
    assert.ok(onLayoutChangedSpy.calledThrice, "onLayoutChanged was triggered after repaint");
});

QUnit.test("onItemClick", (assert) => {
    var responsiveBox = new ResponsiveBox($("#responsiveBox"), {
        items: [{ text: 1 }, { text: 2 }]
    });
    responsiveBox.on("itemClick", function() {
        assert.ok(true, "clicked");
    });

    $(responsiveBox.itemElements()).eq(0).trigger("dxclick");
});


QUnit.module("option", moduleConfig);

QUnit.test("currentScreenFactor", (assert) => {
    this.screenMock.updateWindowWidth(500);
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
    this.screenMock.updateWindowWidth(800);

    assert.equal(responsiveBox.option("currentScreenFactor"), "sm", "currentScreenFactor update after restart");
});

QUnit.test("screenByWidth function call count on initialize", (assert) => {
    let screenByWidthHandler = sinon.spy();
    $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { row: 0, col: 0 }, text: "item(0,0)" }
        ],
        screenByWidth: function() {
            screenByWidthHandler();
            return "lg";
        }
    });

    assert.strictEqual(screenByWidthHandler.callCount, 1, "screenByWidth.callCount");
});

QUnit.test("screenByWidth function call count when dimension was changed", (assert) => {
    let screenByWidthHandler = sinon.spy();
    $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [
            { location: { row: 0, col: 0 }, text: "item(0,0)" }
        ],
        screenByWidth: function() {
            screenByWidthHandler();
            return "lg";
        }
    });

    screenByWidthHandler.reset();
    this.screenMock.updateWindowWidth(800);
    assert.strictEqual(screenByWidthHandler.callCount, 1, "screenByWidth.callCount");
});

QUnit.test("_layoutStrategy pass to internal box", (assert) => {
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

QUnit.test("Changing visibility should update simulated strategy", (assert) => {
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

QUnit.test("onOptionChanged should not be fired after click on item", (assert) => {
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

    $($responsiveBox.find(".dx-item")).trigger("dxclick");

    assert.equal(onOptionChangedStub.callCount, initCallCount, "onOptionChanged wasn't fired");
});

QUnit.test("responsive box should work correctly after item option changing", (assert) => {
    var responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        items: [{ location: { col: 0, row: 0 }, html: "<div class='test'>" }]
    }).dxResponsiveBox("instance");

    responsiveBox.option("items[0].visible", false);
    assert.ok($("#responsiveBox").find(".dx-item").eq(0).hasClass("dx-state-invisible"), "responsive box works correctly");
});

QUnit.test("responsive box should render layout correctly after item option changing", (assert) => {
    var responsiveBox = $("#responsiveBox").dxResponsiveBox({
        rows: [{}],
        cols: [{}],
        _layoutStrategy: "flex",
        items: [{ location: { col: 0, row: 0 }, html: "<div class='test'>" }]
    }).dxResponsiveBox("instance");

    responsiveBox.option("items[0].visible", false);
    responsiveBox.option("items[0].visible", true);

    assert.equal($("#responsiveBox").find(".dx-item").eq(0).get(0).style.display, "flex", "Layout is correct");
    assert.equal($("#responsiveBox").find(".dx-item").eq(0).get(0).style.flex, "1 1 auto", "Layout is correct");
});
