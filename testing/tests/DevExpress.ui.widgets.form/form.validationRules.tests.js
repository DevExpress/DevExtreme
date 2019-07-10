import $ from "jquery";
import { extend } from "core/utils/extend";

import "ui/form/ui.form";

const INVALID_CLASS = "dx-invalid";
const VALIDATION_SUMMARY_ITEM_CLASS = "dx-validationsummary-item";
const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";

function toString(val) {
    switch(val) {
        case undefined:
            return "undefined";
        case null:
            return "null";
        default:
            if(Array.isArray(val)) {
                return `[${val.length} items]`;
            }
            return val;
    }
}

function runChangeValidationRuleTest({ assert, fieldValue, validationRules, newValidationRules, useItemOption, changeRulesFunc = null, checkOptionsFunc = null, validationResult, isKeepFocusSupported = true }) {
    const context = `context: useItemOption = ${toString(useItemOption)}; ` +
        `validationRules = ${toString(validationRules)}; ` +
        `newValidationRules = ${toString(newValidationRules)}`;

    const form = $("#form").dxForm({
        formData: { f1: fieldValue },
        items: [{
            dataField: "f1",
            validationRules
        }]
    }).dxForm("instance");

    $("#form").find("." + TEXTEDITOR_INPUT_CLASS).focus();
    assert.ok($("#form").find("." + TEXTEDITOR_INPUT_CLASS).is(":focus"), `initial focus, ${context}`);
    assert.strictEqual($("#form").find("." + INVALID_CLASS).length, 0, `initial [${INVALID_CLASS}].length, ${context}`);

    if(changeRulesFunc === null) {
        if(useItemOption) {
            form.itemOption("f1", "validationRules", newValidationRules);
        } else {
            form.option("items[0].validationRules", newValidationRules);
        }
    } else {
        changeRulesFunc(form);
    }

    if(checkOptionsFunc === null) {
        assert.strictEqual(form.option("items[0].validationRules"), newValidationRules, context);
        assert.strictEqual(form.itemOption("f1").validationRules, newValidationRules, context);
    } else {
        checkOptionsFunc(assert, form);
    }

    const isInputFocused = $("#form").find(`.${TEXTEDITOR_INPUT_CLASS}`).is(":focus");
    assert.ok(isKeepFocusSupported ? isInputFocused : !isInputFocused, `final focus, ${context}`);

    const validate_result = form.validate();
    assert.strictEqual((validate_result === undefined) || validate_result.isValid, validationResult, `validate_Result, ${context}`);
    assert.strictEqual($("#form").find(`.${INVALID_CLASS}`).length, validationResult ? 0 : 1, `final [${INVALID_CLASS}].length, ${context}`);
}

QUnit.testStart(() => {
    const markup =
        `<div id="form"></div><div id="form2"></div>`;

    $("#qunit-fixture").html(markup);
});

QUnit.module("Form validation rules");

function getID(form, dataField) {
    return "dx_" + form.option("formID") + "_" + dataField;
}

QUnit.test("Validate via validation rules", assert => {
    // arrange
    const form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    // act
    form.validate();

    // assert
    const invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
});

QUnit.test("Validate with template wrapper", assert => {
    // arrange
    const validationSpy = sinon.spy();
    const form = $("#form").dxForm({
        formData: {
            name: ""
        },
        items: [{
            dataField: 'name',
            template(data, itemTemplate) {
                const templateWrapper = $("<div>").addClass("dx-template-wrapper");
                $("<div>").dxTextBox({}).appendTo(templateWrapper);
                templateWrapper.appendTo(itemTemplate);
            },
            validationRules: [{
                type: "custom",
                message: "Name is required",
                validationCallback: validationSpy
            }]
        }]
    }).dxForm("instance");

    // act
    form.validate();

    // assert
    assert.equal(validationSpy.callCount, 1, "invalid editors count");
});

QUnit.test("Validate with a custom validation group", assert => {
    // arrange
    const form = $("#form").dxForm({
        validationGroup: "Custom validation group",
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    // act
    form.validate();

    // assert
    const invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
});

QUnit.test("Reset validation summary items when using a custom validation group", assert => {
    // arrange
    const form = $("#form").dxForm({
        validationGroup: "Custom validation group",
        showValidationSummary: true,
        formData: {
            name: "",
            lastName: "John",
            firstName: ""
        },
        customizeItem(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    // act
    form.validate();
    form.resetValues();

    // assert
    const $invalidElements = form.$element().find("." + INVALID_CLASS);

    const $validationSummaryItems = form.$element().find("." + VALIDATION_SUMMARY_ITEM_CLASS);

    assert.equal($invalidElements.length, 0, "There is no invalid elements");
    assert.equal($validationSummaryItems.length, 0, "There is no validation summary items");
});

QUnit.test("Validate form when several forms are rendered", assert => {
    // arrange
    const form1 = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    const form2 = $("#form2").dxForm({
        formData: {
            name2: "",
            lastName2: "Man",
            firstName2: ""
        },
        customizeItem(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    // act
    form1.validate();

    // assert
    const invalidSelector = "." + INVALID_CLASS;
    assert.equal(form1.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form1.$element().find(invalidSelector + " [id=" + getID(form1, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form1.$element().find(invalidSelector + " [id=" + getID(form1, "firstName") + "]").length, 1, "invalid firstName editor");

    assert.equal(form2.$element().find(invalidSelector).length, 0, "invalid editors count");
    assert.equal(form2.$element().find(invalidSelector + " [id=" + getID(form2, "name2") + "]").length, 0, "invalid name editor");
    assert.equal(form2.$element().find(invalidSelector + " [id=" + getID(form2, "firstName2") + "]").length, 0, "invalid firstName editor");
});

QUnit.test("Validate via 'isRequired' item option", assert => {
    // arrange
    const form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem(item) {
            if(item.dataField !== "lastName") {
                item.isRequired = true;
            }
            if(item.dataField === "name") {
                item.label = { text: "Middle name" };
            }
        }
    }).dxForm("instance");

    // act
    form.validate();

    // assert
    const invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(invalidSelector + "-message").first().text(), "Middle name is required", "Message contains the custom label name of validated field by default");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
    assert.equal(form.$element().find(".dx-invalid-message").last().text(), "First Name is required", "Message contains the name of validated field by default if label isn't defined");
});

QUnit.test("Validate via validationRules when rules and 'isRequired' item option are both defined", assert => {
    // arrange
    const form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem(item) {
            item.isRequired = true;
            item.validationRules = [{ type: "stringLength", max: 3 }];
        }
    }).dxForm("instance");

    // act
    form.validate();

    // assert
    const invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 1, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "lastName") + "]").length, 1, "invalid lastName editor");
});

QUnit.test("Reset validation summary when values are reset in form", assert => {
    // arrange
    const form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "",
            firstName: ""
        },
        showValidationSummary: true,
        customizeItem(item) {
            item.isRequired = true;
        }
    }).dxForm("instance");

    // act
    form.validate();
    form.resetValues();

    // assert
    assert.equal($("." + VALIDATION_SUMMARY_ITEM_CLASS).length, 0, "validation summary items");
});

QUnit.test("Changing an validationRules options of an any item does not invalidate whole form (T673188)", assert => {
    // arrange
    const form = $("#form").dxForm({
        formData: {
            lastName: "Kyle",
            count: 1
        },
        items: [
            { dataField: "firstName", editorType: "dxTextBox" },
            { dataField: "count", editorType: "dxTextBox", validationRules: [{ type: "range", max: 10 }] }
        ]
    }).dxForm("instance");

    const formInvalidateSpy = sinon.spy(form, "_invalidate");
    const renderComponentSpy = sinon.spy(form, "_renderComponent");

    form.option("items[1].validationRules[0].max", 11);
    assert.strictEqual(form.option("items[1].validationRules[0].max"), 11, "correct validationRule option");
    assert.strictEqual(formInvalidateSpy.callCount, 0, "Invalidate does not called");
    assert.strictEqual(renderComponentSpy.callCount, 0, "renderComponentSpy.callCount");
});

QUnit.testInActiveWindow("Change RangeRule.max", assert => {
    const runChangeRuleRageMaxTest = (options) => {
        [true, false].forEach(useItemOption => {
            runChangeValidationRuleTest({
                assert,
                fieldValue: options.fieldValue,
                validationRules: [{ type: "range", max: options.initialMax }],
                changeRulesFunc: form => {
                    if(useItemOption) {
                        form.itemOption("f1").validationRules[0].max = options.targetMax;
                    } else {
                        form.option("items[0].validationRules[0].max", options.targetMax);
                    }
                },
                checkOptionsFunc: (assert, form) => {
                    assert.strictEqual(form.itemOption("f1").validationRules[0].max, options.targetMax);
                    assert.strictEqual(form.option("items[0].validationRules[0].max"), options.targetMax);
                },
                validationResult: options.validationResult
            });
        });
    };

    runChangeRuleRageMaxTest({ fieldValue: 10, initialMax: 11, targetMax: 1, validationResult: false });
    runChangeRuleRageMaxTest({ fieldValue: 10, initialMax: 1, targetMax: 11, validationResult: true });
});

QUnit.testInActiveWindow("Add RangeRule to item.validationRules", assert => {
    const runSetRangeRuleTest = (options) => {
        runChangeValidationRuleTest(extend(
            {
                assert,
                fieldValue: 10,
                newValidationRules: [{ type: "range", max: 1 }],
                validationResult: false,
            },
            options
        ));
    };

    [undefined, null, []].forEach(validationRules => {
        [true, false].forEach(useItemOption => {
            runSetRangeRuleTest({ validationRules, useItemOption, isKeepFocusSupported: false });
        });
    });
});

QUnit.testInActiveWindow("Remove RangeRule from item.validationRules", assert => {
    const runRemoveRangedRuleTest = (options) => {
        runChangeValidationRuleTest(extend(
            {
                assert,
                fieldValue: 10,
                validationRules: [{ type: "range", max: 1 }],
                validationResult: true,
            },
            options
        ));
    };

    [undefined, null, []].forEach(newValidationRules => {
        runRemoveRangedRuleTest({ newValidationRules, useItemOption: false, isKeepFocusSupported: true });
    });
    [undefined, null, []].forEach(newValidationRules => {
        runRemoveRangedRuleTest({ newValidationRules, useItemOption: true, isKeepFocusSupported: false });
    });
});

QUnit.testInActiveWindow("Add RequiredRule to item.validationRules", assert => {
    [undefined, null, []].forEach(validationRules => {
        [true, false].forEach(useItemOption => {
            runChangeValidationRuleTest({
                assert,
                fieldValue: null,
                validationRules,
                newValidationRules: [{ type: "required" }],
                validationResult: false,
                isKeepFocusSupported: false,
                useItemOption
            });
        });
    });
});

QUnit.testInActiveWindow("Remove RequiredRule from item.validationRules", assert => {
    [undefined, null, []].forEach(newValidationRules => {
        [true, false].forEach(useItemOption => {
            runChangeValidationRuleTest({
                assert,
                fieldValue: null,
                validationRules: [{ type: "required" }],
                newValidationRules,
                validationResult: true,
                isKeepFocusSupported: false,
                useItemOption
            });
        });
    });
});

QUnit.testInActiveWindow("Change item.isRequired", assert => {
    [true, false].forEach(isRequired => {
        [true, false].forEach(useItemOption => {
            runChangeValidationRuleTest({
                assert,
                fieldValue: null,
                changeRulesFunc: form => {
                    if(useItemOption) {
                        form.itemOption("f1", "isRequired", isRequired);
                    } else {
                        form.option("items[0].isRequired", isRequired);
                    }
                },
                checkOptionsFunc: (assert, form) => {
                    assert.strictEqual(form.itemOption("f1").isRequired, isRequired);
                    assert.strictEqual(form.option("items[0].isRequired"), isRequired);
                },
                validationResult: !isRequired,
                isKeepFocusSupported: false,
            });
        });
    });
});
