"use strict";

/* global fields */

var $ = require("jquery"),
    fx = require("animation/fx");

require("ui/filter_builder/filter_builder");

var FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_ITEM_FIELD_CLASS = "dx-filterbuilder-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = "dx-filterbuilder-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = "dx-filterbuilder-group-content",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = "dx-filterbuilder-group-operation",
    ACTIVE_CLASS = "dx-state-active";

QUnit.module("Rendering");

QUnit.test("markup init", function(assert) {
    var etalon =
    '<div id="container" class="dx-filterbuilder dx-widget">'
        + '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item">'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">And</div>'
                + '<div class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
            + '</div>'
            + '<div class="dx-filterbuilder-group-content"></div>'
        + '</div>'
    + '</div>';

    var element = $("#container").dxFilterBuilder();
    assert.equal(element.parent().html(), etalon);
});

QUnit.test("create filterbuilder by different filter values", function(assert) {
    var element = $("#container").dxFilterBuilder({ fields: fields });
    var instance = element.dxFilterBuilder("instance");
    instance.option("filter", []);
    assert.ok(instance);
    instance.option("filter", ["Or"]);
    assert.ok(instance);
    instance.option("filter", [["CompanyName", "=", "K&S Music"], ["CompanyName", "=", "K&S Music"]]);
    assert.ok(instance);
    instance.option("filter", [[["CompanyName", "=", "K&S Music"], "Or"], "And"]);
    assert.ok(instance);
});

QUnit.test("filter Content init", function(assert) {
    var etalon =
    '<div class=\"dx-filterbuilder-group\">'
        + '<div class=\"dx-filterbuilder-group-item\">'
            + '<div class=\"dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action\" tabindex=\"0\"></div>'
            + '<div class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">Or</div>'
            + '<div class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
        + '</div>'
        + '<div class="dx-filterbuilder-group-content">'
            + '<div class="dx-filterbuilder-group">'
                + '<div class=\"dx-filterbuilder-group-item\">'
                    + '<div class=\"dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action\" tabindex=\"0\"></div>'
                    + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-field\" tabindex=\"0\">Company Name</div>'
                    + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-operation\" tabindex=\"0\">Equals</div>'
                    + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-value\">'
                        + '<div class=\"dx-filterbuilder-item-value-text\" tabindex=\"0\">K&amp;S Music</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'
    + '</div>';

    var element = $("#container").dxFilterBuilder({
        fields: fields
    });
    var instance = element.dxFilterBuilder("instance");
    instance.option("filter", [[["CompanyName", "=", "K&S Music"], "Or"], "And"]);
    assert.equal(element.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), etalon);
});

QUnit.test("markup is initialized by filter value", function(assert) {
    var container = $("#container");
    container.dxFilterBuilder({
        filter: [
            ["CompanyName", "=", "K&S Music"],
            "Or",
            ["Zipcode", "=", "98027"],
            "Or",
            ["CompanyName", "=", "Screen Shop"]
        ],
        fields: fields
    });

    assert.ok(container.hasClass(FILTER_BUILDER_CLASS));
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).html(), "Company Name");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).html(), "Equals");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(0).text(), "K&S Music");

    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).eq(1).html(), "Zipcode");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).eq(1).html(), "Equals");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(1).html(), "98027");

    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).eq(2).html(), "Company Name");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).eq(2).html(), "Equals");
    var rowValue = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(2);
    assert.equal(rowValue.text(), "Screen Shop");
    rowValue.click();
    assert.ok($("." + FILTER_BUILDER_ITEM_VALUE_CLASS + " .dx-selectbox").dxSelectBox("instance"));
});

QUnit.test("value and operations depend on selected field", function(assert) {
    try {
        fx.off = true;

        var container = $("#container");
        container.dxFilterBuilder({
            filter: [
                ["CompanyName", "=", "K&S Music"]
            ],
            fields: fields
        });
        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
        assert.ok(!$fieldButton.hasClass(ACTIVE_CLASS));
        assert.equal($fieldButton.html(), "Company Name");

        var $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        assert.equal($operationButton.text(), "Equals");

        var $valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS);
        assert.equal($valueButton.text(), "K&S Music");

        var $menu = container.children(".dx-has-context-menu");
        assert.ok($menu.length === 0);

        $fieldButton.click();
        assert.ok($fieldButton.hasClass(ACTIVE_CLASS));

        $menu = container.find(".dx-overlay");
        assert.ok($menu.length === 1);

        var $menuItem = $(".dx-treeview-item").eq(2);
        assert.equal($menuItem.text(), "State");

        $menuItem.trigger("dxclick");
        assert.equal($fieldButton.html(), "State");

        $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        assert.equal($operationButton.text(), "Contains");

        $valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS);
        assert.equal($valueButton.text(), "<enter a value>");

        assert.ok(!$fieldButton.hasClass(ACTIVE_CLASS));
        $menu = container.children(".dx-overlay");
        assert.ok($menu.length === 0);
    } finally {
        fx.off = false;
    }
});

QUnit.test("operations were changed after field change", function(assert) {
    try {
        fx.off = true;

        var container = $("#container");
        container.dxFilterBuilder({
            filter: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });
        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);

        var $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        assert.equal($operationButton.text(), "Does not equal");

        $fieldButton.click();

        var $menuItem = $(".dx-treeview-item").eq(5);
        $menuItem.trigger("dxclick");

        assert.equal($fieldButton.html(), "City");
        $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        assert.equal($operationButton.text(), "Equals");
    } finally {
        fx.off = false;
    }
});

QUnit.test("selected element was changed in menu after click", function(assert) {
    try {
        fx.off = true;

        var container = $("#container");
        container.dxFilterBuilder({
            filter: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.click();
        assert.equal($(".dx-state-selected").text(), "State");

        var $menuItem = $(".dx-treeview-item").eq(1);
        $menuItem.trigger("dxclick");
        $fieldButton.click();
        assert.equal($(".dx-state-selected").text(), "Date");

        var $groupButton = container.find("." + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        $groupButton.click();
        assert.equal($(".dx-state-selected").text(), "And");

        $menuItem = $(".dx-treeview-item").eq(3);
        $menuItem.trigger("dxclick");
        $groupButton.click();
        assert.equal($(".dx-state-selected").text(), "Not Or");

    } finally {
        fx.off = false;
    }
});

QUnit.test("editor field depends on field type", function(assert) {
    var container = $("#container");
    container.dxFilterBuilder({
        filter: [
            ["CompanyName", "=", "K&S Music"],
            "Or",
            ["Zipcode", "=", "98027"],
            "Or",
            ["Date", "=", ""],
            "Or",
            ["Contributor", "=", ""]
        ],
        fields: fields
    });
    var companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
    companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(companyNameValueField.find(".dx-selectbox").dxSelectBox("instance"));

    var zipCodeValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(1);
    zipCodeValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(zipCodeValueField.find(".dx-numberbox").dxNumberBox("instance"));

    var dateValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(2);
    dateValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(dateValueField.find(".dx-datebox").dxDateBox("instance"));

    var contributorValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(3);
    contributorValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(contributorValueField.find(".dx-selectbox").dxSelectBox("instance"));
});
