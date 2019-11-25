import $ from "jquery";
import { extend } from "core/utils/extend";
import { logger } from "core/utils/console";
import ValidationEngine from "ui/validation_engine";
import { Deferred } from "core/utils/deferred";

import "ui/form/ui.form";
import "ui/text_area";
import "ui/autocomplete";
import "ui/calendar";
import "ui/date_box";
import "ui/drop_down_box";
import "ui/html_editor";
import "ui/lookup";
import "ui/radio_group";
import "ui/tag_box";

const INVALID_CLASS = "dx-invalid";
const VALIDATION_SUMMARY_ITEM_CLASS = "dx-validationsummary-item";
const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
const VALIDATION_SUMMARY_CLASS = "dx-validationsummary";
const VALIDATOR_CLASS = "dx-validator";

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

QUnit.test("The validation result is invalid when item has validation rules", assert => {
    const form = $("#form").dxForm({
        formData: {
            name: ""
        },
        items: [{
            dataField: "name",
            validationRules: [{ type: "required" }]
        }]
    }).dxForm("instance");
    const validationResult = form.validate();
    const invalidSelector = `.${INVALID_CLASS}`;

    assert.equal(validationResult.isValid, false, "isValid of validation result");
    assert.equal(validationResult.brokenRules.length, 1, "brokenRules count of validation result");
    assert.equal(validationResult.validators.length, 1, "validators count of validation result");
    assert.equal(form.$element().find(invalidSelector).length, 1, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
});

QUnit.test("The validation result is valid when item has validation rules", assert => {
    const form = $("#form").dxForm({
        formData: {
            name: "Test"
        },
        items: [{
            dataField: "name",
            validationRules: [{ type: "required" }]
        }]
    }).dxForm("instance");
    const validationResult = form.validate();
    const invalidSelector = `.${INVALID_CLASS}`;

    assert.equal(validationResult.isValid, true, "isValid of validation result");
    assert.equal(validationResult.brokenRules.length, 0, "brokenRules count of validation result");
    assert.equal(validationResult.validators.length, 1, "validators count of validation result");
    assert.equal(form.$element().find(invalidSelector).length, 0, "invalid editors count");
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

QUnit.test("CustomRule.validationCallback accepts formItem", assert => {
    // arrange
    const validationSpy = sinon.spy(),
        form = $("#form").dxForm({
            formData: {
                name: ""
            },
            items: [{
                dataField: "name",
                itemType: "simple",
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
    assert.equal(validationSpy.callCount, 1, "valdiationCallback should be called once");

    const params = validationSpy.getCall(0).args[0];

    assert.ok(params.formItem, "formItem should be passed");
    assert.strictEqual(params.formItem.dataField, "name", "formItem.dataField === 'name'");
    assert.strictEqual(params.formItem.itemType, "simple", "formItem.itemType === 'simple'");
    assert.ok(params.formItem.validationRules, "formItem.validationRule !== null");
});

QUnit.test("AsyncRule.validationCallback accepts formItem", assert => {
    // arrange
    const validationSpy = sinon.spy(function() { return new Deferred().resolve().promise(); }),
        form = $("#form").dxForm({
            formData: {
                name: ""
            },
            items: [{
                dataField: "name",
                itemType: "simple",
                validationRules: [{
                    type: "async",
                    message: "Name is required",
                    validationCallback: validationSpy
                }]
            }]
        }).dxForm("instance");

    // act
    form.validate();

    // assert
    assert.equal(validationSpy.callCount, 1, "valdiationCallback should be called once");

    const params = validationSpy.getCall(0).args[0];

    assert.ok(params.formItem, "formItem should be passed");
    assert.strictEqual(params.formItem.dataField, "name", "formItem.dataField === 'name'");
    assert.strictEqual(params.formItem.itemType, "simple", "formItem.itemType === 'simple'");
    assert.ok(params.formItem.validationRules, "formItem.validationRule !== null");
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
    assert.equal(form.$element().find(invalidSelector + "-message").last().text(), "First Name is required", "Message contains the name of validated field by default if label isn't defined");
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

QUnit.test("validate -> resetValues old test", assert => {
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

QUnit.test("validate -> resetValues when there are invalid validation rules", function(assert) {
    function findInvalidElements$(form) {
        return form.$element().find("." + INVALID_CLASS);
    }
    function findInvalidSummaryElements$(form) {
        return form.$element().find("." + VALIDATION_SUMMARY_ITEM_CLASS);
    }

    const formItems = [
        { dataField: "dxAutocomplete", editorType: "dxAutocomplete" },
        { dataField: "dxCalendar", editorType: "dxCalendar" },
        { dataField: "dxCheckBox", editorType: "dxCheckBox" },
        { dataField: "dxDateBox", editorType: "dxDateBox" },
        { dataField: "dxDropDownBox", editorType: "dxDropDownBox", editorOptions: { dataSource: ["1"] } },
        { dataField: "dxHtmlEditor", editorType: "dxHtmlEditor" },
        { dataField: "dxLookup", editorType: "dxLookup", editorOptions: { dataSource: ["1"] } },
        { dataField: "dxNumberBox", editorType: "dxNumberBox" },
        { dataField: "dxRadioGroup", editorType: "dxRadioGroup", editorOptions: { dataSource: ["1"] } },
        { dataField: "dxSelectBox", editorType: "dxSelectBox", editorOptions: { dataSource: ["1"] } },
        { dataField: "dxTagBox", editorType: "dxTagBox", editorOptions: { dataSource: ["1"] } },
        { dataField: "dxTextArea", editorType: "dxTextArea" },
        { dataField: "dxTextBox", editorType: "dxTextBox" },
    ];

    let validationCallbackLog = [];
    const form = $("#form").dxForm({
        showValidationSummary: true,
        items: formItems,
        customizeItem(item) {
            item.validationRules = [{
                type: "custom",
                message: item.dataField,
                validationCallback: (e) => {
                    validationCallbackLog.push(e.rule.message);
                    return false;
                }
            }];
        }
    }).dxForm("instance");

    form.validate();

    formItems.forEach(item => assert.strictEqual(form.getEditor(item.dataField).option("isValid"), false, "form.getEditor." + item.dataField));
    assert.equal(findInvalidElements$(form).length, formItems.length, "There are all the invalid elements");
    assert.equal(findInvalidSummaryElements$(form).length, formItems.length, "There are all the validation summary items");
    assert.equal(validationCallbackLog.length, formItems.length, "validationCallbackLog on validate");

    validationCallbackLog = [];
    form.resetValues();
    formItems.forEach(item => assert.strictEqual(form.getEditor(item.dataField).option("isValid"), true, "form.getEditor." + item.dataField));
    assert.equal(findInvalidElements$(form).length, 0, "There are no invalid elements");
    assert.equal(findInvalidSummaryElements$(form).length, 0, "There are no validation summary items");
    assert.equal(validationCallbackLog.length, /* TODO: avoid all the calls */ 1, "validationCallbackLog on resetValues: " + JSON.stringify(validationCallbackLog));

    form.dispose();
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

QUnit.test("Validate the form without validation rules for an any simple items", (assert) => {
    const errorStub = sinon.stub();
    logger.error = errorStub;

    const form = $("#form").dxForm({
        items: ["name"]
    }).dxForm("instance");

    assert.propEqual(form.validate(), {
        brokenRules: [],
        complete: null,
        isValid: true,
        status: "valid",
        validators: []
    }, "validation result");
    assert.equal(errorStub.getCalls().length, 0, "errors are not written to the console");
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
        runRemoveRangedRuleTest({ newValidationRules, useItemOption: true, isKeepFocusSupported: true });
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

QUnit.module("validation group", () => {
    QUnit.test("Set { items: [name] }, call option(validationGroup, Test)", function(assert) {
        const form = $("#form").dxForm({
            items: ["name"]
        }).dxForm("instance");

        form.option("validationGroup", "Test");

        assert.notOk(ValidationEngine.getGroupConfig(form), "the old validation group of the Form is not contained in the validation engine");
        assert.ok(ValidationEngine.getGroupConfig("Test"), "the new validation group of the Form is contained in the validation engine");
    });

    QUnit.test("Set { items: [name], showValidationSummary: true }, call option(validationGroup, Test)", (assert) => {
        const $formContainer = $("#form").dxForm({
            showValidationSummary: true,
            items: ["name"]
        });
        const form = $formContainer.dxForm("instance");

        form.option("validationGroup", "Test");

        const $validationSummary = $formContainer.find(`.${VALIDATION_SUMMARY_CLASS}`);
        const validationSummary = $validationSummary.dxValidationSummary("instance");

        assert.equal($validationSummary.length, 1);
        assert.equal(validationSummary.option("validationGroup"), "Test", "validation group of the validation summary");
    });

    QUnit.test("Set { items: [name], validationGroup: Test1 }, call option(validationGroup, Test2)", function(assert) {
        const form = $("#form").dxForm({
            items: ["name"],
            validationGroup: "Test1"
        }).dxForm("instance");

        form.option("validationGroup", "Test2");

        assert.notOk(ValidationEngine.getGroupConfig("Test1"), "the old validation group of the Form is not contained in the validation engine");
        assert.ok(ValidationEngine.getGroupConfig("Test2"), "the new validation group of the Form is contained in the validation engine");
    });

    QUnit.test("Set { items: [name], validationGroup: Test1, showValidationSummary: true }, call option(validationGroup, Test2)", (assert) => {
        const $formContainer = $("#form").dxForm({
            showValidationSummary: true,
            validationGroup: "Test1",
            items: ["name"]
        });
        const form = $formContainer.dxForm("instance");

        form.option("validationGroup", "Test2");

        const $validationSummary = $formContainer.find(`.${VALIDATION_SUMMARY_CLASS}`);
        const validationSummary = $validationSummary.dxValidationSummary("instance");

        assert.equal($validationSummary.length, 1);
        assert.equal(validationSummary.option("validationGroup"), "Test2", "validation group of the validation summary");
    });

    QUnit.test("Set { items: [{dataField: name, isRequired: true}] }, call option(validationGroup, Test)", function(assert) {
        const $formContainer = $("#form").dxForm({
            items: [{
                dataField: "name",
                isRequired: true
            }]
        });
        const form = $formContainer.dxForm("instance");

        form.option("validationGroup", "Test");

        const $validator = $formContainer.find(`.${VALIDATOR_CLASS}`);
        const validator = $validator.dxValidator("instance");

        assert.equal($validator.length, 1, "validators count");
        assert.equal(validator.option("validationGroup"), "Test", "validation group of the validator");
        assert.notOk(ValidationEngine.getGroupConfig(form), "the old validation group of the Form is not contained in the validation engine");
        assert.ok(ValidationEngine.getGroupConfig("Test"), "the new validation group of the Form is contained in the validation engine");
    });

    QUnit.test("Set { items: [{dataField: name, isRequired: true}], showValidationSummary: true }, call option(validationGroup, Test)", (assert) => {
        const $formContainer = $("#form").dxForm({
            showValidationSummary: true,
            items: [{ dataField: "name", isRequired: true }]
        });
        const form = $formContainer.dxForm("instance");

        form.option("validationGroup", "Test");

        const $validationSummary = $formContainer.find(`.${VALIDATION_SUMMARY_CLASS}`);
        const validationSummary = $validationSummary.dxValidationSummary("instance");

        assert.equal($validationSummary.length, 1);
        assert.equal(validationSummary.option("validationGroup"), "Test", "validation group of the validation summary");
    });

    QUnit.test("Set { items: [{dataField: name, isRequired: true}], validationGroup: Test1 }, call option(validationGroup, Test2)", function(assert) {
        const $formContainer = $("#form").dxForm({
            items: [{
                dataField: "name",
                isRequired: true
            }],
            validationGroup: "Test1"
        });
        const form = $formContainer.dxForm("instance");

        form.option("validationGroup", "Test2");

        const $validator = $formContainer.find(`.${VALIDATOR_CLASS}`);
        const validator = $validator.dxValidator("instance");

        assert.equal($validator.length, 1, "validators count");
        assert.equal(validator.option("validationGroup"), "Test2", "validation group of the validator");
        assert.notOk(ValidationEngine.getGroupConfig("Test1"), "the old validation group of the Form is not contained in the validation engine");
        assert.ok(ValidationEngine.getGroupConfig("Test2"), "the new validation group of the Form is contained in the validation engine");
    });

    QUnit.test("Set { items: [{dataField: name, isRequired: true}], validationGroup: Test1, showValidationSummary: true }, call option(validationGroup, Test2)", (assert) => {
        const $formContainer = $("#form").dxForm({
            showValidationSummary: true,
            validationGroup: "Test1",
            items: [{ dataField: "name", isRequired: true }]
        });
        const form = $formContainer.dxForm("instance");

        form.option("validationGroup", "Test2");

        const $validationSummary = $formContainer.find(`.${VALIDATION_SUMMARY_CLASS}`);
        const validationSummary = $validationSummary.dxValidationSummary("instance");

        assert.equal($validationSummary.length, 1);
        assert.equal(validationSummary.option("validationGroup"), "Test2", "validation group of the validation summary");
    });
});
