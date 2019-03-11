import $ from "jquery";
import devices from "core/devices";

import "ui/form/ui.form";

import "common.css!";
import "generic_light.css!";

var INVALID_CLASS = "dx-invalid";

QUnit.testStart(function() {
    var markup = '<div id="form"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("Public API: option(items.cssClass)");

QUnit.testInActiveWindow("SimpleItem(undefined -> null)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1"
            },
        ]
    }).dxForm("instance");

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");

    form.option("items[0].cssClass", null);

    assert.strictEqual(form.itemOption("item1").cssClass, null, "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), null, "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
});

QUnit.testInActiveWindow("SimpleItem(undefined -> class1)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1"
            },
        ]
    }).dxForm("instance");

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");

    form.option("items[0].cssClass", "class1");

    assert.strictEqual(form.itemOption("item1").cssClass, "class1", "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), "class1", "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");
});

QUnit.testInActiveWindow("SimpleItem(null -> undefined)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1",
                cssClass: null
            },
        ]
    }).dxForm("instance");

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");

    form.option("items[0].cssClass", undefined);

    assert.strictEqual(form.itemOption("item1").cssClass, undefined, "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), undefined, "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
});

QUnit.testInActiveWindow("SimpleItem(null -> class1)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1",
                cssClass: null
            },
        ]
    }).dxForm("instance");

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");

    form.option("items[0].cssClass", "class1");

    assert.strictEqual(form.itemOption("item1").cssClass, "class1", "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), "class1", "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");
});

QUnit.testInActiveWindow("SimpleItem(class1 -> undefined)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1",
                cssClass: "class1"
            },
        ]
    }).dxForm("instance");

    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");
    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");

    form.option("items[0].cssClass", undefined);

    assert.strictEqual(form.itemOption("item1").cssClass, undefined, "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), undefined, "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
    assert.strictEqual($("#form").find(".class1").length, 0, "$(#form).find(class1).length");
});

QUnit.testInActiveWindow("SimpleItem(class1 -> null)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1",
                cssClass: "class1"
            },
        ]
    }).dxForm("instance");

    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");
    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");

    form.option("items[0].cssClass", null);

    assert.strictEqual(form.itemOption("item1").cssClass, null, "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), null, "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
    assert.strictEqual($("#form").find(".class1").length, 0, "$(#form).find(class1).length");
});

QUnit.testInActiveWindow("SimpleItem(class1 -> class2)", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1",
                cssClass: "class1",
                validationRules: [{
                    type: "custom",
                    validationCallback: function() { return false; }
                }]
            },
        ]
    }).dxForm("instance");

    form.validate();
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, 1, `initial [${INVALID_CLASS}].length`);

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");
    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");

    form.option("items[0].cssClass", "class2");

    assert.strictEqual(form.itemOption("item1").cssClass, "class2", "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), "class2", "form.option(items[0].cssClass)");
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, 1, `final [${INVALID_CLASS}].length`);
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "final focus");
    assert.strictEqual($("#form").find(".class2").length, 1, "$(#form).find(class2).length");
});

QUnit.testInActiveWindow("SimpleItem(class1 -> class2) in form with 2 items", function(assert) {
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "simple",
                editorType: "dxTextBox",
                name: "item1",
                cssClass: "class1"
            },
            {
                itemType: "simple",
                editorType: "dxTextBox",
                validationRules: [{
                    type: "custom",
                    validationCallback: function() { return false; }
                }]
            }
        ]
    }).dxForm("instance");

    form.validate();
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, 1, `initial [${INVALID_CLASS}].length`);

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");
    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");

    form.option("items[0].cssClass", "class2");

    assert.strictEqual(form.itemOption("item1").cssClass, "class2", "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), "class2", "form.option(items[0].cssClass)");
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, 1, `final [${INVALID_CLASS}].length`);
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");
    assert.strictEqual($("#form").find(".class2").length, 1, "$(#form).find(class2).length");
});

QUnit.testInActiveWindow("ButtonItem(class1 -> class2)", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "desktop specific test");
        return;
    }
    var form = $("#form").dxForm({
        items: [{
            itemType: "button",
            name: "item1",
            cssClass: "class1",
            buttonOptions: { icon: "icon1" }
        }]
    }).dxForm("instance");

    $("#form").find(".dx-button").focus();
    assert.ok($("#form").find(".dx-button").is(":focus"), "initial focus");
    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");

    form.option("items[0].cssClass", "class2");

    assert.strictEqual(form.itemOption("item1").cssClass, "class2", "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), "class2", "form.option(items[0].cssClass)");
    assert.ok($("#form").find(".dx-button").is(":focus"), "final focus");
    assert.strictEqual($("#form").find(".class2").length, 1, "$(#form).find(class2).length");
});

QUnit.testInActiveWindow("ButtonItem(class1 -> class2) in form with 2 items", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "desktop specific test");
        return;
    }
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "button",
                name: "item1",
                cssClass: "class1",
                buttonOptions: { icon: "icon1" }
            },
            {
                itemType: "simple",
                editorType: "dxTextBox",
                validationRules: [{
                    type: "custom",
                    validationCallback: function() { return false; }
                }]
            }
        ]
    }).dxForm("instance");

    form.validate();
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, 1, `initial [${INVALID_CLASS}].length`);

    $("#form").find(".dx-texteditor-input").focus();
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");
    assert.strictEqual($("#form").find(".class1").length, 1, "$(#form).find(class1).length");

    form.option("items[0].cssClass", "class2");

    assert.strictEqual(form.itemOption("item1").cssClass, "class2", "form.itemOption(item1).cssClass");
    assert.strictEqual(form.option("items[0].cssClass"), "class2", "form.option(items[0].cssClass)");
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, 1, `final [${INVALID_CLASS}].length`);
    assert.ok($("#form").find(".dx-texteditor-input").is(":focus"), "initial focus");
    assert.strictEqual($("#form").find(".class2").length, 1, "$(#form).find(class2).length");
});
