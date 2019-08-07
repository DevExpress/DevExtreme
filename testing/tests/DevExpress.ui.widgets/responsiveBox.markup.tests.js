import $ from "jquery";
import errors from "ui/widget/ui.errors";

import "ui/box";
import "ui/responsive_box";
import "common.css!";

QUnit.testStart(() => {
    const markup =
        '<div id="responsiveBox"></div>\
        \
        <div id="responsiveBoxWithTemplate">\
            <div data-options="dxItem: { location: { row: 0 , col: 0 } }">test</div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const BOX_CLASS = "dx-box";
const BOX_ITEM_CLASS = "dx-box-item";
const RESPONSIVE_BOX_CLASS = "dx-responsivebox";

QUnit.module("render", () => {
    QUnit.test("render", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            items: [{ text: 1 }, { text: 2 }]
        });

        assert.ok($responsiveBox.hasClass(RESPONSIVE_BOX_CLASS), "necessary class attached");
        let $items = $responsiveBox.find("." + BOX_ITEM_CLASS);
        assert.equal($items.length, 2, "items rendered when rows and columns are not defined (using single column layout)");
    });
});

QUnit.module("layouting", () => {
    QUnit.test("grid without items", (assert) => {
        let rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
        let cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
        let height = 600;
        let width = 600;

        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: rows,
            cols: cols,
            width: width,
            height: height
        });

        let $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(0);

        assert.equal($rowBox.dxBox("option", "direction"), "col", "rowBox wraps inner content");

        let $columnBoxes = $rowBox.find("." + BOX_CLASS);
        let columnBoxFirst = $columnBoxes.eq(0).dxBox("instance");
        let columnBoxSecond = $columnBoxes.eq(1).dxBox("instance");

        assert.equal($columnBoxes.length, 2, "two row boxes");
        assert.equal(columnBoxFirst.option("direction"), "row");
        assert.equal(columnBoxSecond.option("direction"), "row");

        assert.equal(columnBoxFirst.option("items").length, 2);
        assert.equal(columnBoxSecond.option("items").length, 2);
    });

    QUnit.test("grid with items", (assert) => {
        let rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
        let cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
        let height = 600;
        let width = 600;

        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
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

        let $boxes = $responsiveBox.find("." + BOX_CLASS);

        let $rootBox = $boxes.eq(0);
        assert.equal($rootBox.text(), "item11item12item21item22", "items rendered correctly");
    });

    QUnit.test("colspan", (assert) => {
        let cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        let size = 900;

        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}],
            cols: cols,
            width: size,
            items: [{ location: { row: 0, col: 0, colspan: 2 } }, { location: { row: 0, col: 2 } }]
        });

        let $rowBox = $responsiveBox.find("." + BOX_CLASS).eq(1);
        let $boxItems = $rowBox.find("." + BOX_ITEM_CLASS);

        assert.equal($boxItems.length, 2, "two items were rendered");
    });

    QUnit.test("rowspan", (assert) => {
        let rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        let size = 900;

        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: rows,
            cols: [{}],
            height: size,
            items: [{ location: { row: 0, col: 0, rowspan: 2 } }, { location: { row: 2, col: 0 } }]
        });

        let $boxItems = $responsiveBox.find("." + BOX_ITEM_CLASS);

        assert.equal($boxItems.length, 2, "two items were rendered");
    });

    QUnit.test("repaint should not detach items", (assert) => {
        assert.expect(0);

        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{ location: { row: 0, col: 0 }, text: 'test' }]
        });

        let $childrenResponsiveBox;

        try {
            let $dxItem = $responsiveBox.find("." + BOX_ITEM_CLASS).first().children();
            $childrenResponsiveBox = $("<div>").dxResponsiveBox({
                onDisposing: () => {
                    assert.ok(false, "widget disposed");
                }
            }).appendTo($dxItem);

            $responsiveBox.dxResponsiveBox("repaint");
        } finally {
            $childrenResponsiveBox.dxResponsiveBox("option", "onDisposing", null);
        }
    });

    QUnit.test("too complex layout", (assert) => {
        assert.throws(() => {
            let size = 900;

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

    QUnit.test("Set the shrink option of row to box", (assert) => {
        const $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            _layoutStrategy: "flex",
            rows: [{
                ratio: 1,
                shrink: 0
            }, {
                ratio: 1
            }],
            cols: [{ ratio: 1 }],
            items: [
                { location: { row: 0, col: 0 } },
                { location: { row: 1, col: 0 } }
            ]
        });

        const $items = $responsiveBox.find("." + BOX_ITEM_CLASS);
        assert.equal($items.eq(0).css("flex-shrink"), 0, "flex-shrink style for first row");
        assert.equal($items.eq(1).css("flex-shrink"), 1, "flex-shrink style for second row");
    });

    QUnit.test("Set the shrink option of column to box", (assert) => {
        const $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            _layoutStrategy: "flex",
            rows: [{ ratio: 1 }],
            cols: [{ ratio: 1 }, { ratio: 1, shrink: 0 }],
            items: [
                { location: { row: 0, col: 0 } },
                { location: { row: 0, col: 1 } }
            ]
        });

        const $items = $responsiveBox.find("." + BOX_ITEM_CLASS);
        assert.equal($items.eq(1).css("flex-shrink"), 1, "flex-shrink style for first column");
        assert.equal($items.eq(2).css("flex-shrink"), 0, "flex-shrink style for second column");
    });
});


QUnit.module("behavior", () => {
    QUnit.test("update does not rerender items", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{ location: { col: 0, row: 0 }, html: "<div class='test'>" }]
        });

        let $div = $responsiveBox.find(".test");
        $responsiveBox.dxResponsiveBox("repaint");

        assert.equal($responsiveBox.find(".test").get(0), $div.get(0), "item was not rerendered");
    });
});

QUnit.module("templates", () => {
    QUnit.test("custom item templates", (assert) => {
        let $responsiveBox = $("#responsiveBoxWithTemplate").dxResponsiveBox({
            rows: [{}],
            cols: [{}]
        });
        assert.equal($.trim($responsiveBox.text()), "test", "item template rendered");
    });

    QUnit.test("custom item renderer", (assert) => {
        let templateContext,
            $responsiveBox = $("#responsiveBox").dxResponsiveBox({
                rows: [{}],
                cols: [{}],
                itemTemplate: function() {
                    templateContext = this.NAME;
                    return $("<div>test</div>");
                },
                items: [{ location: { row: 0, col: 0 } }]
            });

        assert.equal(templateContext, "dxResponsiveBox", "Correct context");
        assert.equal($.trim($responsiveBox.text()), "test", "item rendered");
    });
});

QUnit.module("collision", () => {
    QUnit.test("item located at the same cell of another item", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
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

    QUnit.test("item located at spanning cell", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}],
            cols: [{}, {}],
            items: [
                { location: { row: 0, col: 0, colspan: 2 }, text: "0" },
                { location: { row: 0, col: 1 }, text: "1" }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), "0", "the former item rendered");
    });

    QUnit.test("item spanning located at spanning of another item", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}, {}],
            items: [
                { location: { row: 0, col: 1, rowspan: 2 }, text: "0" },
                { location: { row: 1, col: 0, colspan: 2 }, text: "1" }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), "0", "the former item rendered");
    });

    QUnit.test("item spanning out of bounds", (assert) => {
        let $responsiveBox = $("#responsiveBox").dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}],
            items: [
                { location: { row: 0, col: 0, colspan: 2 }, text: "0" },
                { location: { row: 1, col: 0, rowspan: 2 }, text: "1" }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), "01", "the former item rendered");
    });
});
