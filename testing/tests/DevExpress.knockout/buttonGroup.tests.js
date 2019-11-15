import $ from "jquery";
import ko from "knockout";

import "ui/button_group";
import "integration/knockout";

QUnit.module("Render", () => {
    // T831205
    QUnit.test("Widget rendering when buttonTemplate is used", function(assert) {
        var items = [
            { text: "Item_1" },
            { text: "Item_2" }
        ];

        var markup =
        '<div id="buttongroup-with-template" data-bind="dxButtonGroup: { items: items, buttonTemplate: \'testTemplate\' }">\
            <div data-options="dxTemplate: { name: \'testTemplate\' }">\
                <div data-bind="text: text"></div>\
            </div>\
        </div>';

        $(markup).appendTo($("#qunit-fixture"));

        var $element = $("#buttongroup-with-template");

        ko.applyBindings({ items: items }, $element[0]);

        var itemElements = $element.find(".dx-item");

        assert.equal(itemElements.length, 2);
        assert.equal(itemElements.eq(0).text().trim(), "Item_1", "item[0].text");
        assert.equal(itemElements.eq(1).text().trim(), "Item_2", "item[1].text");

        $element.find(".dx-template-wrapper").each((index, templateWrapper) => {
            assert.equal($(templateWrapper).parent().is(itemElements.eq(index)), true, "container for template is button");
        });
    });
});
