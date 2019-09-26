import $ from "jquery";
import "ui/form/ui.form";
import "ui/form/ui.form.layout_manager";

import "common.css!";
import "generic_light.css!";

const FORM_LAYOUT_MANAGER_CLASS = "dx-layout-manager";
const { testStart, module, test } = QUnit;

class FormTestWrapper {
    constructor(options, assert) {
        this._form = $("#form").dxForm(options).dxForm("instance");
        this._formContentReadyStub = sinon.stub();
        this._form.on("contentReady", this._formContentReadyStub);
        this._contentReadyStubs = this._createLayoutManagerStubs(this._form.$element());
        this._assert = assert;
    }

    _createLayoutManagerStubs($form) {
        const layoutManagers = $form.find(`.${FORM_LAYOUT_MANAGER_CLASS}`).toArray().map(item => $(item).dxLayoutManager("instance"));
        return layoutManagers.map(layoutManager => {
            const stub = sinon.stub();
            layoutManager.on("contentReady", stub);
            return stub;
        });
    }

    setOption(id, optionName, value) {
        this._form.option(`${id}.${optionName}`, value);
    }

    setItemOption(id, optionName, value) {
        this._form.itemOption.apply(this._form, arguments);
    }

    beginUpdate() {
        this._form.beginUpdate();
    }

    endUpdate() {
        this._form.endUpdate();
    }

    checkFormsReRender(message = "") {
        this._assert.equal(this._formContentReadyStub.callCount, 0, `${message}, form is not re-render`);
        this._formContentReadyStub.reset();
    }

    checkLayoutManagerRendering(expectedRenderingArray, message = "") {
        this._contentReadyStubs.forEach((stub, index) => {
            const expected = expectedRenderingArray[index];
            if(stub.callCount > 2) {
                this._assert.equal(stub.callCount, 2, "the content ready event is many times thrown");
            }
            this._assert.equal(stub.callCount > 0 && stub.callCount <= 2, expected, `${message}, ${index} layoutManager is ${expected ? "" : "not"} re-render`);
        });
        this._contentReadyStubs.forEach(stub => stub.reset());
    }

    checkSimpleItem(id, expectedValue, expectedLabel) {
        const editor = this._form.getEditor(id);
        const attrID = editor.option("inputAttr.id");
        const labelText = $(`[for='${attrID}'] .dx-field-item-label-text`).text();
        this._assert.equal(editor.option("value"), expectedValue, `editor value of ${id}`);
        this._assert.strictEqual(labelText, `${expectedLabel}:`, `label of ${id}`);
    }

    checkLabelText(itemSelector, expectedText) {
        const labelText = $(itemSelector).find(".dx-field-item-label-text").text();
        this._assert.strictEqual(labelText, `${expectedText}:`, "text of label");
    }

    checkHelpText(itemSelector, expectedText) {
        const helpText = $(itemSelector).find(".dx-field-item-help-text").text();
        this._assert.strictEqual(helpText, `${expectedText}`, "text of helpText");
    }

    checkItemElement(selector, expected, message) {
        this._assert.equal(this._form.$element().find(selector).length > 0, expected, message || "item element");
    }

    checkGroupCaption(groupSelector, expectedCaption) {
        this._assert.strictEqual(this._form.$element().find(`${groupSelector} .dx-form-group-caption`).text(), expectedCaption, "caption of group");
    }

    checkTabTitle(tabSelector, expectedTitle) {
        this._assert.strictEqual(this._form.$element().find(`${tabSelector} .dx-tab-text`).text(), expectedTitle, "caption of tab");
    }
}

testStart(function() {
    const markup = `<div id="form"></div>`;
    $("#qunit-fixture").html(markup);
});

module("Group item. Use the option method", () => {
    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        cssClass: "test-item",
                        dataField: "dataField2"
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].items[0]", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setOption("items[1].items[0]", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change editorOptions of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField2"
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].items[0]", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setOption("items[1].items[0]", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change items of group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: ["dataField2"]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1]", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setOption("items[1]", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change visible of first group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        cssClass: "test-group",
                        caption: "Test Caption",
                        items: [{
                            dataField: "dataField2",
                            cssClass: "test-item"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].items[0]", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-group", false, "group item element");
        testWrapper.checkItemElement(".test-item", false, "simple item element");

        testWrapper.setOption("items[1].items[0]", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-group", true, "group item element");
        testWrapper.checkGroupCaption(".test-group", "Test Caption");
        testWrapper.checkItemElement(".test-item", true, "simple item element");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change items of first group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        items: ["dataField2"]
                    }]
                }
            ]
        }, assert);

        const items = ["dataField11", "dataField12"].map((dataField, index) => ({
            itemType: "group",
            cssClass: `group${index}`,
            items: [{
                dataField,
                editorType: "dxTextBox"
            }]
        }));
        testWrapper.setOption("items[1]", "items", items);
        const message = `items: [{itemType: "group", items: ["dataField11"]}, {itemType: "group", items: ["dataField12"]}]`;
        testWrapper.checkLayoutManagerRendering([false, true, false], message);
        testWrapper.checkFormsReRender(message);
        testWrapper.checkItemElement(".group0", true, "first group item element");
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkItemElement(".group1", true, "second group item element");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setOption("items[1]", "items", [{
            itemType: "group",
            cssClass: "group3",
            items: [{
                dataField: "dataField3",
                editorType: "dxTextBox"
            }]
        }]);
        testWrapper.checkLayoutManagerRendering([false, true, false], `items: [{itemType: "group", items:["dataField3"]}]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkItemElement(".group3", true, "third group item element");
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        items: [{
                            dataField: "dataField2",
                            cssClass: "test-item"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].items[0].items[0]", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setOption("items[1].items[0].items[0]", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change editorOptions of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        items: [{
                            dataField: "dataField2"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].items[0].items[0]", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setOption("items[1].items[0].items[0]", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change items of last group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        items: ["dataField2"]
                    }]
                }
            ]
        }, assert);

        const items = ["dataField11", "dataField12"].map(dataField => ({
            dataField,
            editorType: "dxTextBox"
        }));
        testWrapper.setOption("items[1].items[0]", "items", items);
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setOption("items[1].items[0]", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}, {itemType: 'group', items:['dataField3']}] }, change visible of dataField2 and dataField3)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2",
                dataField3: "DataField3"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField2",
                        cssClass: "test-item2"
                    }]
                },
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField3",
                        cssClass: "test-item3"
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].items[0]", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: false in the first group");
        testWrapper.checkFormsReRender("visible: false in the first group");
        testWrapper.checkItemElement(".test-item2", false);

        testWrapper.setOption("items[2].items[0]", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false in the second group");
        testWrapper.checkFormsReRender("visible: false in the second group");
        testWrapper.checkItemElement(".test-item3", false);

        testWrapper.setOption("items[1].items[0]", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: true in the first group");
        testWrapper.checkFormsReRender("visible: true in the first group");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item2", true);

        testWrapper.setOption("items[2].items[0]", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: true in the second group");
        testWrapper.checkFormsReRender("visible: true in the second group");
        testWrapper.checkSimpleItem("dataField3", "DataField3", "Data Field 3");
        testWrapper.checkItemElement(".test-item3", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}, {itemType: 'group', items:['dataField3']}] }, change items in the both groups)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2",
                dataField3: "DataField3"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: ["dataField2"]
                },
                {
                    itemType: "group",
                    items: ["dataField3"]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1]", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true, false], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setOption("items[2]", "items",
            ["dataField21", "dataField22"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField21", "dataField22"]`);
        testWrapper.checkFormsReRender(`items: ["dataField21", "dataField22"]`);
        testWrapper.checkSimpleItem("dataField21", "", "Data Field 21");
        testWrapper.checkSimpleItem("dataField22", "", "Data Field 22");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}, {itemType: 'group', items:['dataField3']}] }, change options of dataField2 and dataField3)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2",
                dataField3: "DataField3"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField2",
                        cssClass: "test-item2"
                    }]
                },
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField3",
                        cssClass: "test-item3"
                    }]
                }
            ]
        }, assert);

        testWrapper.beginUpdate();

        testWrapper.setOption("items[1].items[0]", "label", { text: "Test Label 2" });
        testWrapper.setOption("items[1].items[0]", "name", "Test Name 2");
        testWrapper.setOption("items[1].items[0]", "helpText", "Test help text 2");

        testWrapper.setOption("items[2].items[0]", "label", { text: "Test Label 3" });
        testWrapper.setOption("items[2].items[0]", "name", "Test Name 3");
        testWrapper.setOption("items[2].items[0]", "helpText", "Test help text 3");

        testWrapper.endUpdate();

        testWrapper.checkFormsReRender();
        testWrapper.checkLayoutManagerRendering([false, true, true]);
        testWrapper.checkLabelText(".test-item2", "Test Label 2");
        testWrapper.checkHelpText(".test-item2", "Test help text 2");
        testWrapper.checkLabelText(".test-item3", "Test Label 3");
        testWrapper.checkHelpText(".test-item3", "Test help text 3");
    });
});

module("Tabbed item. Use the option method", () => {
    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: 'dataField2'}]}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        items: [{
                            cssClass: "test-item",
                            dataField: "dataField2"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].tabs[0].items[0]", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setOption("items[1].tabs[0].items[0]", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: 'dataField2'}]}] }, change items of tab)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        items: ["dataField2"]
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].tabs[0]", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setOption("items[1].tabs[0]", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: 'dataField2'}]}] }, change editorOptions of dataField2")`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        items: [{
                            dataField: "dataField2"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setOption("items[1].tabs[0].items[0]", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setOption("items[1].tabs[0].items[0]", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: [{itemType: 'group', items:['dataField2']}]}]}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        items: [{
                            itemType: "group",
                            items: [{
                                cssClass: "test-item",
                                dataField: "dataField2"
                            }]
                        }]
                    }]
                }
            ]
        }, assert);

        const id = "items[1].tabs[0].items[0].items[0]";
        testWrapper.setOption(id, "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setOption(id, "visible", true);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: [{itemType: 'group', items:['dataField2']}]}]}] }, change items of group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        items: [{
                            itemType: "group",
                            items: ["dataField2"]
                        }]
                    }]
                }
            ]
        }, assert);

        const id = "items[1].tabs[0].items[0]";
        testWrapper.setOption(id, "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setOption(id, "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: [{itemType: 'group', items:['dataField2']}]}]}] }, change editorOptions of dataField2")`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        items: [{
                            itemType: "group",
                            items: [{
                                dataField: "dataField2"
                            }]
                        }]
                    }]
                }
            ]
        }, assert);

        const id = "items[1].tabs[0].items[0].items[0]";
        testWrapper.setOption(id, "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setOption(id, "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items: [{itemType: 'tabbed', tabs:[{items: ['dataField2']}]}] }, change visible of tabbed item)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "tabbed",
                        cssClass: "test-tab",
                        tabs: [{
                            title: "Test Title",
                            items: ["dataField2"]
                        }]
                    }]
                }
            ]
        }, assert);

        const id = "items[1].items[0]";
        testWrapper.setOption(id, "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-tab", false, "tabbed item element");

        testWrapper.setOption(id, "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-tab", true, "tabbed item element");
        testWrapper.checkTabTitle(".test-tab", "Test Title");
    });
});

module("Group item. Use the itemOption method", () => {
    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        cssClass: "test-item",
                        dataField: "dataField2"
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setItemOption("dataField2", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change options of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        cssClass: "test-item",
                        dataField: "dataField2"
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", {
            label: { text: "Test Label" },
            name: "Test Name",
            helpText: "Test help text"
        });
        testWrapper.checkFormsReRender("change options");
        testWrapper.checkLayoutManagerRendering([false, true], "change options");
        testWrapper.checkLabelText(".test-item", "Test Label");
        testWrapper.checkHelpText(".test-item", "Test help text");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change editorOptions of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField2"
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setItemOption("dataField2", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change items of group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    name: "group1",
                    items: ["dataField2"]
                }
            ]
        }, assert);

        testWrapper.setItemOption("group1", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("group1", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}] }, change items of group, change visible of dataField12)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    name: "group1",
                    items: ["dataField2"]
                }
            ]
        }, assert);

        testWrapper.setItemOption("group1", "items",
            ["dataField11", "dataField12"].map((dataField, index) => ({
                dataField,
                editorType: "dxTextBox",
                cssClass: `.test-item1${index + 1}`
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("group1.dataField12", "visible", false);
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item12", false, "item element of the dataField12");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change visible of first group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        cssClass: "test-group",
                        caption: "Test Caption",
                        items: [{
                            dataField: "dataField2",
                            cssClass: "test-item"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("TestCaption", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-group", false, "group item element");
        testWrapper.checkItemElement(".test-item", false, "simple item element");

        testWrapper.setItemOption("TestCaption", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-group", true, "group item element");
        testWrapper.checkGroupCaption(".test-group", "Test Caption");
        testWrapper.checkItemElement(".test-item", true, "simple item element");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change items of first group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    name: "group1",
                    items: [{
                        itemType: "group",
                        items: ["dataField2"]
                    }]
                }
            ]
        }, assert);

        const items = ["dataField11", "dataField12"].map((dataField, index) => ({
            itemType: "group",
            cssClass: `group${index}`,
            items: [{
                dataField,
                editorType: "dxTextBox"
            }]
        }));
        testWrapper.setItemOption("group1", "items", items);
        const message = `items: [{itemType: "group", items: ["dataField11"]}, {itemType: "group", items: ["dataField12"]}]`;
        testWrapper.checkLayoutManagerRendering([false, true, false], message);
        testWrapper.checkFormsReRender(message);
        testWrapper.checkItemElement(".group0", true, "first group item element");
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkItemElement(".group1", true, "second group item element");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("group1", "items", [{
            itemType: "group",
            cssClass: "group3",
            items: [{
                dataField: "dataField3",
                editorType: "dxTextBox"
            }]
        }]);
        testWrapper.checkLayoutManagerRendering([false, true, false], `items: [{itemType: "group", items:["dataField3"]}]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkItemElement(".group3", true, "third group item element");
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        items: [{
                            dataField: "dataField2",
                            cssClass: "test-item"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setItemOption("dataField2", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change items of second group, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        name: "group2",
                        items: [{
                            dataField: "dataField2",
                            cssClass: "test-item"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("group2", "items",
            ["dataField11", "dataField12"].map((dataField, index) => ({
                dataField,
                editorType: "dxTextBox",
                cssClass: `.test-item1${index + 1}`
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: [dataField11, dataField12]`);

        testWrapper.setItemOption("group2.dataField11", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item11", false, "item element of the dataField11");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change editorOptions of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        items: [{
                            dataField: "dataField2"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setItemOption("dataField2", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:[{itemType: 'group', items: ['dataField2']}]}] }, change items of last group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        itemType: "group",
                        name: "group2",
                        items: ["dataField2"]
                    }]
                }
            ]
        }, assert);

        const items = ["dataField11", "dataField12"].map(dataField => ({
            dataField,
            editorType: "dxTextBox"
        }));
        testWrapper.setItemOption("group2", "items", items);
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("group2", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}, {itemType: 'group', items:['dataField3']}] }, change visible of dataField2 and dataField3)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2",
                dataField3: "DataField3"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField2",
                        cssClass: "test-item2"
                    }]
                },
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField3",
                        cssClass: "test-item3"
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: false in the first group");
        testWrapper.checkFormsReRender("visible: false in the first group");
        testWrapper.checkItemElement(".test-item2", false);

        testWrapper.setItemOption("dataField3", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false in the second group");
        testWrapper.checkFormsReRender("visible: false in the second group");
        testWrapper.checkItemElement(".test-item3", false);

        testWrapper.setItemOption("dataField2", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: true in the first group");
        testWrapper.checkFormsReRender("visible: true in the first group");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item2", true);

        testWrapper.setItemOption("dataField3", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: true in the second group");
        testWrapper.checkFormsReRender("visible: true in the second group");
        testWrapper.checkSimpleItem("dataField3", "DataField3", "Data Field 3");
        testWrapper.checkItemElement(".test-item3", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}, {itemType: 'group', items:['dataField3']}] }, change items in the both groups)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2",
                dataField3: "DataField3"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    name: "group1",
                    items: ["dataField2"]
                },
                {
                    itemType: "group",
                    name: "group2",
                    items: ["dataField3"]
                }
            ]
        }, assert);

        testWrapper.setItemOption("group1", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true, false], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("group2", "items",
            ["dataField21", "dataField22"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField21", "dataField22"]`);
        testWrapper.checkFormsReRender(`items: ["dataField21", "dataField22"]`);
        testWrapper.checkSimpleItem("dataField21", "", "Data Field 21");
        testWrapper.checkSimpleItem("dataField22", "", "Data Field 22");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items:['dataField2']}, {itemType: 'group', items:['dataField3']}] }, change options of dataField2 and dataField3)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2",
                dataField3: "DataField3"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField2",
                        cssClass: "test-item2"
                    }]
                },
                {
                    itemType: "group",
                    items: [{
                        dataField: "dataField3",
                        cssClass: "test-item3"
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("dataField2", {
            label: { text: "Test Label 2" },
            name: "Test Name 2",
            helpText: "Test help text 2"
        });
        testWrapper.checkFormsReRender("change options of dataField2");
        testWrapper.checkLayoutManagerRendering([false, true, false], "change options of dataField2");
        testWrapper.checkLabelText(".test-item2", "Test Label 2");
        testWrapper.checkHelpText(".test-item2", "Test help text 2");

        testWrapper.setItemOption("dataField3", {
            label: { text: "Test Label 3" },
            name: "Test Name 3",
            helpText: "Test help text 3"
        });
        testWrapper.checkFormsReRender("change options of dataField3");
        testWrapper.checkLayoutManagerRendering([false, false, true], "change options of dataField3");
        testWrapper.checkLabelText(".test-item3", "Test Label 3");
        testWrapper.checkHelpText(".test-item3", "Test help text 3");
    });
});

module("Tabbed item. Use the itemOption method", () => {
    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: 'dataField2'}]}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "tab1",
                        items: [{
                            cssClass: "test-item",
                            dataField: "dataField2"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("tab1.dataField2", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setItemOption("tab1.dataField2", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {temType: 'tabbed', tabs:[{items: 'dataField2'}]}] }, change items of tab)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "tab1",
                        items: ["dataField2"]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("tab1", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("tab1", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: 'dataField2'}]}] }, change editorOptions of dataField2")`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "tab1",
                        items: [{
                            dataField: "dataField2"
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("tab1.dataField2", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setItemOption("tab1.dataField2", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: [{itemType: 'group', items:['dataField2']}]}]}] }, change visible of dataField2)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "tab1",
                        items: [{
                            itemType: "group",
                            name: "group1",
                            items: [{
                                cssClass: "test-item",
                                dataField: "dataField2"
                            }]
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("tab1.group1.dataField2", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-item", false);

        testWrapper.setItemOption("tab1.group1.dataField2", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, false, true], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-item", true);
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: [{itemType: 'group', items:['dataField2']}]}]}] }, change items of group)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "tab1",
                        items: [{
                            itemType: "group",
                            name: "group1",
                            items: ["dataField2"]
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("tab1.group1", "items",
            ["dataField11", "dataField12"].map(dataField => ({
                dataField,
                editorType: "dxTextBox"
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField11", "dataField12"]`);
        testWrapper.checkFormsReRender(`items: ["dataField11", "dataField12"]`);
        testWrapper.checkSimpleItem("dataField11", "", "Data Field 11");
        testWrapper.checkSimpleItem("dataField12", "", "Data Field 12");

        testWrapper.setItemOption("tab1.group1", "items", [{
            dataField: "dataField3",
            editorType: "dxTextBox"
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], `items: ["dataField3"]`);
        testWrapper.checkFormsReRender(`items: ["dataField3"]`);
        testWrapper.checkSimpleItem("dataField3", "", "Data Field 3");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'tabbed', tabs:[{items: [{itemType: 'group', items:['dataField2']}]}]}] }, change editorOptions of dataField2")`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "tab1",
                        items: [{
                            itemType: "group",
                            name: "group1",
                            items: [{
                                dataField: "dataField2"
                            }]
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("tab1.group1.dataField2", "editorOptions", { value: "test value" });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { value: 'test value' }");
        testWrapper.checkFormsReRender("editorOptions: { value: 'test value' }");

        testWrapper.setItemOption("tab1.group1.dataField2", "editorOptions", { });
        testWrapper.checkLayoutManagerRendering([false, false, false], "editorOptions: { }");
        testWrapper.checkFormsReRender("editorOptions: { }");
    });

    test(`Set { formData: {"DataField1", "DataField2"}, items: ['dataField1', {itemType: 'group', items: [{itemType: 'tabbed', tabs:[{items: ['dataField2']}]}] }, change visible of tabbed item)`, assert => {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: "DataField1",
                dataField2: "DataField2"
            },
            items: ["dataField1",
                {
                    itemType: "group",
                    name: "group1",
                    items: [{
                        itemType: "tabbed",
                        cssClass: "test-tab",
                        name: "tabbedItem",
                        tabs: [{
                            title: "Test Title",
                            items: ["dataField2"]
                        }]
                    }]
                }
            ]
        }, assert);

        testWrapper.setItemOption("group1.tabbedItem", "visible", false);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: false");
        testWrapper.checkFormsReRender("visible: false");
        testWrapper.checkItemElement(".test-tab", false, "tabbed item element");

        testWrapper.setItemOption("group1.tabbedItem", "visible", true);
        testWrapper.checkLayoutManagerRendering([false, true, false], "visible: true");
        testWrapper.checkFormsReRender("visible: true");
        testWrapper.checkSimpleItem("dataField2", "DataField2", "Data Field 2");
        testWrapper.checkItemElement(".test-tab", true, "tabbed item element");
        testWrapper.checkTabTitle(".test-tab", "Test Title");
    });
});
