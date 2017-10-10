"use strict";

/* global fields */

var $ = require("jquery");

var FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text";

require("ui/filter_builder/filter_builder");

QUnit.module("Events");

QUnit.test("onEditorPreparing", function(assert) {
    //arrange
    var args,
        spy = sinon.spy(),
        container = $("#container"),
        companyNameValueField;

    container.dxFilterBuilder({
        value: [
            ["CompanyName", "=", "DevExpress"]
        ],
        fields: fields,
        onEditorPreparing: spy
    });

    //act
    companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
    companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();

    //assert
    args = spy.args[0][0];
    assert.strictEqual(spy.callCount, 1, "onEditorPreparing is called");
    assert.strictEqual(args.dataField, "CompanyName", "args -> dataField");
    assert.strictEqual(args.value, "DevExpress", "args -> value");
    assert.deepEqual(args.component, container.dxFilterBuilder("instance"), "args -> component");
});

QUnit.test("onEditorPrepared", function(assert) {
    //arrange
    var args,
        spy = sinon.spy(),
        container = $("#container"),
        companyNameValueField;

    container.dxFilterBuilder({
        value: [
            ["CompanyName", "=", "DevExpress"]
        ],
        fields: fields,
        onEditorPrepared: spy
    });

    //act
    companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
    companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();

    //assert
    args = spy.args[0][0];
    assert.strictEqual(spy.callCount, 1, "onEditorPrepared is called");
    assert.strictEqual(args.dataField, "CompanyName", "args -> dataField");
    assert.strictEqual(args.value, "DevExpress", "args -> value");
    assert.deepEqual(args.component, container.dxFilterBuilder("instance"), "args -> component");
});
