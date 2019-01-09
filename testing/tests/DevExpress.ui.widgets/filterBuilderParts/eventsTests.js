import $ from "jquery";
import fields from "../../../helpers/filterBuilderTestData.js";

import {
    FILTER_BUILDER_ITEM_VALUE_CLASS,
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS
} from "./constants.js";

import {
    clickByValue
} from "./helpers.js";

import "ui/filter_builder/filter_builder";

QUnit.module("Events", function() {
    QUnit.test("onEditorPreparing", function(assert) {
        // arrange
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

        // act
        companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        // assert
        args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, "onEditorPreparing is called");
        assert.strictEqual(args.dataField, "CompanyName", "args -> dataField");
        assert.strictEqual(args.value, "DevExpress", "args -> value");
        assert.strictEqual(args.filterOperation, "=", "args -> filterOperation");
        assert.deepEqual(args.component, container.dxFilterBuilder("instance"), "args -> component");
    });

    QUnit.test("onEditorPreparing for between", function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $("#container"),
            companyNameValueField;

        container.dxFilterBuilder({
            value: [
                ["Field", "between", [1, 2]]
            ],
            fields: [{
                dataField: "Field",
                dataType: "number"
            }],
            onEditorPreparing: spy
        });

        // act
        companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        // assert
        assert.strictEqual(spy.callCount, 2, "onEditorPreparing is called");

        var startArgs = spy.args[0][0];
        assert.strictEqual(startArgs.value, 1, "args -> value");
        assert.strictEqual(startArgs.filterOperation, "between", "args -> filterOperation");

        var endArgs = spy.args[1][0];
        assert.strictEqual(endArgs.value, 2, "args -> value");
        assert.strictEqual(endArgs.filterOperation, "between", "args -> filterOperation");
    });

    QUnit.test("onEditorPrepared", function(assert) {
        // arrange
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

        // act
        companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        // assert
        args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, "onEditorPrepared is called");
        assert.strictEqual(args.dataField, "CompanyName", "args -> dataField");
        assert.strictEqual(args.value, "DevExpress", "args -> value");
        assert.strictEqual(args.filterOperation, "=", "args -> filterOperation");
        assert.deepEqual(args.component, container.dxFilterBuilder("instance"), "args -> component");
    });

    QUnit.test("onEditorPrepared for between", function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $("#container"),
            companyNameValueField;

        container.dxFilterBuilder({
            value: [
                ["Field", "between", [1, 2]]
            ],
            fields: [{
                dataField: "Field",
                dataType: "number"
            }],
            onEditorPrepared: spy
        });

        // act
        companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        // assert
        assert.strictEqual(spy.callCount, 2, "onEditorPrepared is called");

        var startArgs = spy.args[0][0];
        assert.strictEqual(startArgs.value, 1, "args -> value");
        assert.strictEqual(startArgs.filterOperation, "between", "args -> filterOperation");

        var endArgs = spy.args[1][0];
        assert.strictEqual(endArgs.value, 2, "args -> value");
        assert.strictEqual(endArgs.filterOperation, "between", "args -> filterOperation");
    });

    QUnit.test("Clear keyup & dxpointerdown events after dispose", function(assert) {
        // arrange
        let dxPointerDownSpy = sinon.spy(),
            keyUpSpy = sinon.spy(),
            container = $("#container");

        const filterBuilder = container.dxFilterBuilder({
            value: ["NumberField", "=", ""],
            fields: fields
        }).dxFilterBuilder("instance");

        filterBuilder._addDocumentClick = function() {
            $(document).on("dxpointerdown", dxPointerDownSpy);
            this._documentClickHandler = dxPointerDownSpy;
        };
        filterBuilder._addDocumentKeyUp = function() {
            $(document).on("keyup", keyUpSpy);
            this._documentKeyUpHandler = keyUpSpy;
        };

        // act
        clickByValue();
        // assert
        assert.strictEqual(dxPointerDownSpy.callCount, 0);
        assert.strictEqual(keyUpSpy.callCount, 0);

        // act
        $(document).trigger("dxpointerdown");
        $(document).trigger("keyup");
        // assert
        assert.strictEqual(dxPointerDownSpy.callCount, 1);
        assert.strictEqual(keyUpSpy.callCount, 1);

        // act
        container.remove();
        $(document).trigger("dxpointerdown");
        $(document).trigger("keyup");
        // assert
        assert.strictEqual(dxPointerDownSpy.callCount, 1);
        assert.strictEqual(keyUpSpy.callCount, 1);
    });

    QUnit.test("onValueChanged", function(assert) {
        // arrange
        var args,
            spy = sinon.spy(),
            container = $("#container");

        container.dxFilterBuilder({
            value: ["Zipcode", "=", "666"],
            fields: fields,
            onValueChanged: spy
        });

        // act
        container.dxFilterBuilder("instance").option("value", ["CompanyName", "=", "DevExpress"]);

        // assert
        args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, "onValueChanged is called");
        assert.deepEqual(args.previousValue, ["Zipcode", "=", "666"], "previous value");
        assert.deepEqual(args.value, ["CompanyName", "=", "DevExpress"], "current value");
    });

    QUnit.test("onInitialized", function(assert) {
        assert.expect(1);
        $("#container").dxFilterBuilder({
            value: ["Field", "between", [666, 777]],
            fields: [{
                dataField: "Field",
                dataType: "number"
            }],
            onInitialized: function(e) {
                assert.deepEqual(e.component.getFilterExpression(), [["Field", ">=", 666], "and", ["Field", "<=", 777]]);
            }
        });
    });
});
