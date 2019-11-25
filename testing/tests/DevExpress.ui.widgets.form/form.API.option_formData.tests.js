import $ from "jquery";

import "ui/form/ui.form";
import "ui/text_area";
import "ui/tag_box";
import "ui/slider";

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
    var formData = {};
    form.option("formData", null);
    assert.propEqual(form.option("formData"), formData);
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

QUnit.test("Set { formData: {dataField1: a, dataField2: b}, items: [dataField1, dataField2], call option(formData, {dataField3: c}", assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $("#form").dxForm({
        formData: {
            dataField1: "a",
            dataField2: "b",
        },
        items: ["dataField1", "dataField2"],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm("instance");

    form.option("formData", { dataField3: "c" });

    const calls = onFieldDataChangedStub.getCalls();
    assert.propEqual(form.option("formData"), { dataField3: "c" }, "formData");
    assert.equal(form.getEditor("dataField1").option("value"), "", "editor's value of the dataField1");
    assert.equal(form.getEditor("dataField2").option("value"), "", "editor's value of the dataField2");

    assert.equal(onFieldDataChangedStub.callCount, 1, "onFieldDataChanged event's calls count");
    assert.equal(calls[0].args[0].dataField, "dataField3", "dataField argument of the onFieldDataChanged event");
    assert.equal(calls[0].args[0].value, "c", "value argument of the onFieldDataChanged event");
});

QUnit.test("Set { formData: {dataField1: a, dataField2: b}, items: [dataField1, dataField2], call option(formData, {dataField3: c}, change editor value", assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $("#form").dxForm({
        formData: {
            dataField1: "a",
            dataField2: "b",
        },
        items: ["dataField1", "dataField2"],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm("instance");

    form.option("formData", { dataField3: "c" });
    form.getEditor("dataField2").option("value", "d");

    assert.propEqual(form.option("formData"), { dataField2: "d", dataField3: "c" }, "formData");
    assert.equal(form.getEditor("dataField1").option("value"), "", "editor's value of the dataField1");
    assert.equal(form.getEditor("dataField2").option("value"), "d", "editor's value of the dataField2");

    const calls = onFieldDataChangedStub.getCalls();
    assert.equal(onFieldDataChangedStub.callCount, 2, "onFieldDataChanged event's calls count");
    assert.equal(calls[0].args[0].dataField, "dataField3", "first call - dataField argument of the onFieldDataChanged event");
    assert.equal(calls[0].args[0].value, "c", "first call - value argument of the onFieldDataChanged event");
    assert.equal(calls[1].args[0].dataField, "dataField2", "second call - dataField argument of the onFieldDataChanged event");
    assert.equal(calls[1].args[0].value, "d", "second call - value argument of the onFieldDataChanged event");
});

QUnit.test("Set { formData: {dataField3: c}, items: [dataField1, dataField2], call option(formData, {dataField1: a, dataField2: b})", assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $("#form").dxForm({
        formData: {
            dataField3: "c"
        },
        items: ["dataField1", "dataField2"],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm("instance");

    assert.propEqual(form.option("formData"), { dataField3: "c" }, "formData before changing via API");

    form.option("formData", {
        dataField1: "a",
        dataField2: "b"
    });
    assert.propEqual(form.option("formData"), { dataField1: "a", dataField2: "b" }, "formData after changing via API");
    assert.equal(form.getEditor("dataField1").option("value"), "a", "editor's value of the dataField1");
    assert.equal(form.getEditor("dataField2").option("value"), "b", "editor's value of the dataField2");

    const calls = onFieldDataChangedStub.getCalls();
    assert.equal(onFieldDataChangedStub.callCount, 2, "onFieldDataChanged event's calls count");
    assert.equal(calls[0].args[0].dataField, "dataField1", "first call - dataField argument of the onFieldDataChanged event");
    assert.equal(calls[0].args[0].value, "a", "first call - value argument of the onFieldDataChanged event");
    assert.equal(calls[1].args[0].dataField, "dataField2", "second call - dataField argument of the onFieldDataChanged event");
    assert.equal(calls[1].args[0].value, "b", "second call - value argument of the onFieldDataChanged event");
});

QUnit.test("Reset editor's value when set formData: {dataField1: a}", assert => {
    const formData = {
        dxTextBox: "a",
        dxDateBox: new Date(),
        dxSelectBox: "item2",
        dxTagBox: ["item2"],
        dxSlider: 35
    };
    const dataSource = ["item1", "item2", "item3"];
    const form = $("#form").dxForm({
        formData: formData,
        items: ["dxTextBox", "dxDateBox", {
            dataField: "dxSelectBox",
            editorType: "dxSelectBox",
            editorOptions: {
                dataSource: dataSource
            }
        },
        {
            dataField: "dxTagBox",
            editorType: "dxTagBox",
            editorOptions: {
                dataSource: dataSource
            }
        },
        {
            dataField: "dxSlider",
            editorType: "dxSlider"
        }]
    }).dxForm("instance");

    form.option("formData", { dataField1: "a" });

    Object.keys(formData).forEach(dataField => {
        const editor = form.getEditor(dataField);
        assert.deepEqual(editor.option("value"), editor._getDefaultOptions().value, `a default value of the ${dataField} editor`);
    });
});
