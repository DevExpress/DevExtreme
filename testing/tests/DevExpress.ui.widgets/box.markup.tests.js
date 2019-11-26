import $ from "jquery";
import Box from "ui/box";
import registerComponent from "core/component_registrator";

import "common.css!";
import "ui/scroll_view/ui.scrollable";

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

const BOX_CLASS = "dx-box",
    BOX_ITEM_CLASS = "dx-box-item";

QUnit.module("render", () => {
    QUnit.test("render", function(assert) {
        const $box = $("#box").dxBox({
            items: [1, 2]
        });

        assert.ok($box.hasClass(BOX_CLASS), "necessary class attached");

        const $items = $box.find("." + BOX_ITEM_CLASS);
        assert.equal($items.length, 2, "items rendered");

        assert.equal($items.eq(0).text(), "1", "first item rendered");
        assert.equal($items.eq(1).text(), "2", "second item rendered");
    });

    QUnit.test("render the box item content with flexBasis equal zero pixel", function(assert) {
        const $box = $("#box").dxBox({
            items: [1],
            _layoutStrategy: "flex"
        });

        assert.equal($box.find("." + BOX_ITEM_CLASS + "-content").css("flexBasis"), "0px");
    });

    QUnit.test("strategy class", function(assert) {
        const $box = $("#box").dxBox({
            _layoutStrategy: "test"
        });

        assert.ok($box.hasClass("dx-box-test"), "class attached");
    });
});

QUnit.module("layouting", () => {
    QUnit.test("render box in dxBox", function(assert) {
        const $box = $("#box").dxBox({
            items: [{ box: { direction: "row" } }]
        });

        const $innerBox = $box.find("." + BOX_CLASS);
        assert.equal($innerBox.length, 1, "box was rendered");
        const innerBox = $innerBox.dxBox("instance");
        assert.ok(innerBox instanceof Box, "box was created inside box");
    });

    QUnit.test("box pass _layoutStrategy to children box", function(assert) {
        const $box = $("#box").dxBox({
            _layoutStrategy: 'test',
            items: [{ box: {} }]
        });

        const innerBox = $box.find(".dx-box").dxBox("instance");

        assert.equal(innerBox.option("_layoutStrategy"), "test", "_layoutStrategy was passed to children box");
    });

    QUnit.test("box must have a correct flex direction on items rendering (T604581)", function(assert) {
        const boxInstance = new Box($("#box"), {
            direction: "col",
            items: [{ baseSize: 100 }],
        }).instance();

        assert.equal($(boxInstance._$element)[0].style.flexDirection, "column");
    });
});

QUnit.module("template rendering", () => {
    QUnit.test("innerBox with template", function(assert) {
        const $box = $("#boxWithInnerBox").dxBox({
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
        const $box = $("#box").dxBox({
            items: [
                {
                    box: {
                        items: [{ test: () => "1" }, { test: () => "2" }]
                    }
                }
            ],
            itemTemplate: (item) => "test" + item.test()
        });

        assert.equal($.trim($box.text()), "test1test2", "inner box rendered");
    });

    QUnit.test("innerBox with nested box item", function(assert) {
        const $box = $("#nestedBox").dxBox({});

        assert.equal($.trim($box.text()), "Box1", "inner box rendered");
    });
});

QUnit.module("rendering box item", () => {
    QUnit.test("callstack should not grow when nesting is growing", function(assert) {
        const originalBox = Box;
        let deep = 0;

        class TestBox extends Box {
            _render() {
                deep++;
                super._render.apply(this, arguments);
            }

            _renderItem() {
                const currentDeep = deep;
                super._renderItem.apply(this, arguments);
                assert.equal(deep, currentDeep, "deep is normal");
            }
        }

        registerComponent("dxBox", TestBox);
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
        const items = [{ text: "Item 1" }],
            itemStateChangedHandler = sinon.spy(),
            $box = $("#box").dxBox({ items: items, onItemStateChanged: itemStateChangedHandler }),
            box = $box.dxBox("instance");

        box.option("items[0].visible", false);

        const callArguments = itemStateChangedHandler.getCall(0).args[0];

        assert.equal(itemStateChangedHandler.callCount, 1, "itemStateChanged handler was called");
        assert.equal(callArguments.name, "visible", "name argument is correct");
        assert.equal(callArguments.state, false, "state argument is correct");
        assert.equal(callArguments.oldState, true, "oldState argument is correct");
    });
});
