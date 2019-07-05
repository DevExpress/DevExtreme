import $ from "jquery";

import "ui/form/ui.form";
import "ui/text_area";

import "common.css!";
import "generic_light.css!";

QUnit.testStart(function() {
    var markup = '<div id="form"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("Public API: option(formData, new value)");

QUnit.test("Set { formData: null }, call option(formData, null)", function(assert) {
    var form = $("#form").dxForm({ formData: null }).dxForm("instance");
    form.option("formData", null);
    assert.propEqual(form.option("formData"), {});
});

QUnit.test("Set { formData: null }, call option(formData, {})", function(assert) {
    var form = $("#form").dxForm({ formData: null }).dxForm("instance");
    var formData = {};
    form.option("formData", formData);
    assert.equal(form.option("formData"), formData);
});

QUnit.test("Set { formData: null, items: [dataField1] }, call option(formData, {})", function(assert) {
    var form = $("#form").dxForm({ formData: null, items: ["dataField1"] }).dxForm("instance");
    var formData = {};
    form.option("formData", formData);
    assert.equal(form.option("formData"), formData);
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: null, items: [dataField1] }, call option(formData, null)", function(assert) {
    var form = $("#form").dxForm({ formData: null, items: ["dataField1"] }).dxForm("instance");
    form.option("formData", null);
    assert.propEqual(form.option("formData"), {});
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {}, items: [dataField1] }, call option(formData, null)", function(assert) {
    var form = $("#form").dxForm({ formData: {}, items: ["dataField1"] }).dxForm("instance");
    form.option("formData", null);
    assert.propEqual(form.option("formData"), {});
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {}, items: [dataField1] }, call option(formData, {})", function(assert) {
    var form = $("#form").dxForm({ formData: {}, items: ["dataField1"] }).dxForm("instance");
    form.option("formData", {});
    assert.propEqual(form.option("formData"), {});
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, null)", function(assert) {
    var form = $("#form").dxForm({ formData: { dataField1: "a" }, items: ["dataField1"] }).dxForm("instance");
    form.option("formData", null);
    assert.propEqual(form.option("formData"), { dataField1: "" });
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {})", function(assert) {
    var form = $("#form").dxForm({ formData: { dataField1: "a" }, items: ["dataField1"] }).dxForm("instance");
    var formData = {};
    form.option("formData", formData);
    assert.equal(form.option("formData"), formData);
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {dataField1: undefined})", function(assert) {
    var form = $("#form").dxForm({ formData: { dataField1: "a" }, items: ["dataField1"] }).dxForm("instance");
    var formData = { dataField1: undefined };
    form.option("formData", formData);
    assert.equal(form.option("formData"), formData);
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {dataField1: null})", function(assert) {
    var form = $("#form").dxForm({ formData: { dataField1: "a" }, items: ["dataField1"] }).dxForm("instance");
    var formData = { dataField1: null };
    form.option("formData", formData);
    assert.equal(form.option("formData"), formData);
    assert.equal(form.getEditor("dataField1").option("value"), null);
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {dataField1: b})", function(assert) {
    var form = $("#form").dxForm({ formData: { dataField1: "a" }, items: ["dataField1"] }).dxForm("instance");
    var formData = { dataField1: "b" };
    form.option("formData", formData);
    assert.equal(form.option("formData"), formData);
    assert.equal(form.getEditor("dataField1").option("value"), "b");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, null)", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: ["dataField1"]
    }).dxForm("instance");

    form.getEditor("dataField1").option("value", "val1");

    form.option("formData", null);
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {})", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: ["dataField1"]
    }).dxForm("instance");

    form.getEditor("dataField1").option("value", "val1");

    form.option("formData", {});
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField1:undefined})", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: ["dataField1"]
    }).dxForm("instance");

    form.getEditor("dataField1").option("value", "val1");

    form.option("formData", { dataField1: undefined });
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField1:null})", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: ["dataField1"]
    }).dxForm("instance");

    form.getEditor("dataField1").option("value", "val1");

    form.option("formData", { dataField1: null });
    assert.equal(form.getEditor("dataField1").option("value"), null);
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField1: b})", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: ["dataField1"]
    }).dxForm("instance");

    form.getEditor("dataField1").option("value", "val1");

    form.option("formData", { dataField1: "b" });
    assert.equal(form.getEditor("dataField1").option("value"), "b");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField2:a})", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: ["dataField1"]
    }).dxForm("instance");

    form.getEditor("dataField1").option("value", "val1");

    form.option("formData", { dataField2: "a" });
    assert.equal(form.getEditor("dataField1").option("value"), "");
});

QUnit.test("Set { formData: {dataField1: a}, items: [dxTextArea] }, change editor value, call option(formData, {dataField1: b})", function(assert) {
    var form = $("#form").dxForm({
        formData: { dataField1: "a" },
        items: [{ name: "custom1", editorType: "dxTextArea" }]
    }).dxForm("instance");

    form.getEditor("custom1").option("value", "val1");

    form.option("formData", { dataField1: "b" });
    assert.equal(form.getEditor("custom1").option("value"), "val1");
});
