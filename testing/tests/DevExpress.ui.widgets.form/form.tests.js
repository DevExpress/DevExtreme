"use strict";

var $ = require("jquery"),
    resizeCallbacks = require("core/utils/window").resizeCallbacks,
    consoleUtils = require("core/utils/console"),
    responsiveBoxScreenMock = require("../../helpers/responsiveBoxScreenMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    typeUtils = require("core/utils/type"),
    browser = require("core/utils/browser"),
    domUtils = require("core/utils/dom"),
    config = require("core/config"),
    internals = require("ui/form/ui.form").__internals;

require("ui/text_area");

require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="form"></div>\
        <div id="form2"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Form");

QUnit.test("Invalidate after option changed", function(assert) {
    //arrange
    var testingOptions = ["formData", "items", "colCount", "onFieldDataChanged", "labelLocation",
            "alignItemLabels", "showColonAfterLabel", "customizeItem", "minColWidth", "alignItemLabelsInAllGroups", "onEditorEnterKey", "scrollingEnabled", "formID"],
        form = $("#form").dxForm().dxForm("instance"),
        i,
        invalidateStub = sinon.stub(form, "_invalidate");

    //act
    for(i = 0; i < testingOptions.length; i++) {
        var testingOption = testingOptions[i],
            value;

        switch(testingOption) {
            case "formData":
                value = { name: "auto" };
                break;
            case "items":
                value = ["auto"];
                break;
            default:
                value = "auto";
        }

        form.option(testingOption, value);
    }

    //assert
    assert.equal(invalidateStub.callCount, testingOptions.length);
});

QUnit.test("Invalidate is not called when formData is changed and items option is defined", function(assert) {
    //arrange
    var form = $("#form").dxForm({
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }).dxForm("instance"), invalidateStub = sinon.stub(form, "_invalidate");

    //act
    form.option("formData", {
        name: "test"
    });

    //assert
    assert.equal(invalidateStub.callCount, 0);
});

QUnit.test("Default render", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //assert
    assert.ok($formContainer.hasClass(internals.FORM_CLASS), "Form is rendered");
    assert.equal($formContainer.attr("role"), "form", "Form has correct attribute");
    assert.equal($formContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS).length, 1, "Layout manager is rendered");
});

QUnit.test("Check the default focus target", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //assert
    var $input = $formContainer.find("input");

    assert.equal($formContainer.dxForm("instance")._focusTarget().closest(".dx-widget").html(), $input.closest(".dx-widget").html(), "Correct focus target");
});

QUnit.test("Check that registerKeyHandler proxy works well", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            items:
            [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                },
                {
                    dataField: "age",
                    editorType: "dxNumberBox"
                }
            ]
        }),
        $inputs = $formContainer.find(".dx-texteditor-input"),
        counter = 0,
        handler = function() { counter++; };

    $formContainer.dxForm("instance").registerKeyHandler("tab", handler);

    keyboardMock($inputs.eq(0)).keyDown("tab");

    //assert
    assert.equal(counter, 1, "Custom key handler for the first editor");

    keyboardMock($inputs.eq(1)).keyDown("tab");

    //assert
    assert.equal(counter, 2, "Custom key handler for the second editor");
});

QUnit.test("Check root layout width on init", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            width: 100,
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        instance = $formContainer.dxForm("instance"),
        rootLayoutManager = instance._rootLayoutManager;

    //assert
    assert.equal(rootLayoutManager.$element().width(), 100, "Correct width");
});

QUnit.test("Check root layout width on option change", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        instance = $formContainer.dxForm("instance"),
        rootLayoutManager = instance._rootLayoutManager;

    instance.option("width", 100);

    //assert
    assert.equal(rootLayoutManager.option("width"), 100, "Correct width");
});

QUnit.test("Form isn't refresh on dimension changed if colCount is auto", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            colCount: "auto",
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        instance = $formContainer.dxForm("instance"),
        refreshStub = sinon.stub(instance, "_refresh");

    resizeCallbacks.fire();

    //assert
    assert.equal(refreshStub.callCount, 0, "don't refresh on resize if colCount is auto");
});

QUnit.test("Form doesn't refresh on dimension changed if colCount is not auto", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        instance = $formContainer.dxForm("instance"),
        refreshStub = sinon.stub(instance, "_refresh");


    resizeCallbacks.fire();

    //assert
    assert.equal(refreshStub.callCount, 0, "do not refresh on resize if colCount isn't auto");
});

QUnit.testInActiveWindow("Form's inputs saves value on refresh", function(assert) {
    //arrange, act
    var screen = "md",
        $formContainer = $("#form").dxForm({
            screenByWidth: function() {
                return screen;
            },
            colCountByScreen: {
                sm: 1,
                md: 2
            },
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        });

    $("#form input")
        .first()
        .focus()
        .val("test");

    screen = "sm";
    resizeCallbacks.fire();

    //assert
    var formData = $formContainer.dxForm("instance").option("formData");

    assert.deepEqual(formData, { name: "test" }, "value updates");
});

QUnit.test("Render read only form", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        readOnly: true,
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //assert
    assert.ok($formContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
});

QUnit.test("Render form with colspan", function(assert) {
    //arrange, act
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { ID: 0, FirstName: "John", LastName: "Dow", HireDate: "01/01/1970" },
        colCount: 2,
        colCountByScreen: { xs: 2 },
        items: [{
            itemType: "group",
            caption: "Employee",
            colCount: 2,
            items: [
                { dataField: "ID", colSpan: 2 },
                { dataField: "FirstName", visible: true },
                { dataField: "LastName", visible: true },
                { dataField: "HireDate", colSpan: 2, visible: true }
            ]
        }]
    });

    var $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS),
        fieldWidths = {
            ID: $fieldItems.eq(1).width(),
            FirstName: $fieldItems.eq(2).width(),
            LastName: $fieldItems.eq(3).width(),
            HireDate: $fieldItems.eq(4).width()
        };

    //assert
    assert.equal($fieldItems.length, 5, "4 simple items + 1 group item");
    assert.equal(fieldWidths.ID, fieldWidths.HireDate, "fields with colspan 2 have the same width");
    assert.equal(fieldWidths.FirstName, fieldWidths.LastName, "fields without colspan have the same width");
    assert.ok(fieldWidths.ID > fieldWidths.FirstName, "field with colspan 2 is wider than field without colspan");
});

QUnit.test("'readOnly' is changed in inner components on optionChanged", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    assert.notOk($formContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor isn't read only");

    $formContainer.dxForm("instance").option("readOnly", true);

    //assert
    assert.ok($formContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
});

QUnit.test("'disable' is changed in inner components on optionChanged", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ],
        disabled: true
    });

    assert.ok($formContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-disabled"), "editor is disabled");

    $formContainer.dxForm("instance").option("disabled", false);

    //assert
    assert.notOk($formContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-disabled"), "editor isn't disabled");
});

QUnit.test("Customize item event", function(assert) {
    //arrange, act
    var testObject = {
            ID: 1,
            FirstName: "John",
            LastName: "Heart",
            BirthDate: "1964/03/16",
            Sex: true
        },
        $formContainer = $("#form").dxForm({
            formData: testObject,
            customizeItem: function(item) {
                switch(item.dataField) {
                    case "Sex":
                    case "ID":
                        item.visible = false;
                        break;
                    case "FirstName":
                        item.editorOptions = {
                            readOnly: true
                        };
                        break;
                    case "LastName":
                        item.editorType = "dxTextArea";
                        break;
                    case "BirthDate":
                        item.editorType = "dxDateBox";
                        break;
                }
            }
        });

    var items = $formContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS).first().dxLayoutManager("instance")._items,
        visibleItems = $formContainer.find("." + internals.FIELD_ITEM_CLASS + ":visible");

    //assert
    assert.equal(items.length, 3, "items count");
    assert.equal(visibleItems.length, 3, "Visible items count");
    assert.equal(items[0].editorOptions.readOnly, true);
    assert.equal(items[1].editorType, "dxTextArea");
    assert.equal(items[2].editorType, "dxDateBox");

});

QUnit.test("Check that data fully changes after object replace", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" }
    });

    //act
    $testContainer.dxForm("instance").option("formData", { FamousDetective: "Sherlock Holmes" });

    //assert
    assert.deepEqual($testContainer.dxForm("instance").option("formData"), { FamousDetective: "Sherlock Holmes" }, "Correct formData");

});

QUnit.test("Check data at render with items", function(assert) {
    //arrange, act
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" },
        items: [{ dataField: "FamousDetective", editorType: "dxTextBox" }, { dataField: "FamousPirate", editorType: "dxTextBox" }]
    });

    //assert
    assert.deepEqual($testContainer.dxForm("instance").option("formData"), { FamousPirate: "John Morgan" }, "Correct formData");
    assert.deepEqual($testContainer.find(".dx-layout-manager").dxLayoutManager("instance").option("layoutData"), { FamousPirate: "John Morgan" }, "Correct formData");
});

QUnit.test("Check data at render with items and change widget's value", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" },
        items: [{ dataField: "FamousDetective", editorType: "dxTextBox" }, { dataField: "FamousPirate" }]
    });

    //act
    $testContainer.find(".dx-textbox").first().dxTextBox("instance").option("value", "Sherlock Holmes");

    //assert
    assert.deepEqual($testContainer.dxForm("instance").option("formData"), { FamousPirate: "John Morgan", FamousDetective: "Sherlock Holmes" }, "Correct formData");
});

QUnit.test("Change of editor's value changing 'formData' option", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" }
    });

    //act
    $testContainer.find(".dx-textbox").dxTextBox("instance").option("value", "Cpt. Jack Sparrow");

    //assert
    assert.deepEqual($testContainer.dxForm("instance").option("formData"), { FamousPirate: "Cpt. Jack Sparrow" }, "Correct formData");
});

QUnit.test("Change of the formData field change value of the editor", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" }
    });

    var formInstance = $testContainer.dxForm("instance");

    //act
    formInstance.option("formData.FamousPirate", "Cpt. Jack Sparrow");

    //assert
    assert.equal(formInstance.getEditor("FamousPirate").option("value"), "Cpt. Jack Sparrow", "Correct value");
});

QUnit.test("Update of editor's value when formOption is changed and items is defined", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        form,
        $textBoxes,
        textBoxes = [];

    form = $testContainer.dxForm({
        items: ["name", "lastName"]
    }).dxForm("instance");

    sinon.spy(form._rootLayoutManager, "_invalidate");

    $textBoxes = $testContainer.find(".dx-textbox");
    $.each($textBoxes, function(_, element) {
        textBoxes.push($(element).dxTextBox("instance"));
    });

    //act
    form.option("formData", {
        name: "Test Name",
        lastName: "Test Last Name"
    });

    //assert
    assert.equal(textBoxes[0].option("value"), "Test Name", "first editor");
    assert.equal(textBoxes[1].option("value"), "Test Last Name", "second editor");
    assert.ok(!form._rootLayoutManager._invalidate.called, "_invalidate of layout manger is not called");
});

QUnit.test("Change editor value after formOption is changed and items is defined", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        form;

    form = $testContainer.dxForm({
        formData: { pirateName: "Blackbeard", type: "captain", isSought: true },
        items: ["pirateName", "type", "isSought"]
    }).dxForm("instance");

    //act
    form.option("formData", {
        pirateName: "John Morgan",
        type: "captain",
        isSought: true
    });

    form.getEditor("isSought").option("value", false);
    //assert
    assert.deepEqual(form.option("formData"), {
        pirateName: "John Morgan",
        type: "captain",
        isSought: false
    }, "FormData is up to date");
});

QUnit.test("Check the work of onFieldDataChanged", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        testObject,
        callCount = 0;

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" },
        onFieldDataChanged: function(args) {
            testObject = { dataField: args.dataField, value: args.value };
            callCount++;
        }
    });

    var form = $testContainer.dxForm("instance");

    //act, assert
    $testContainer.find(".dx-textbox").dxTextBox("instance").option("value", "Cpt. Jack Sparrow");

    assert.deepEqual(testObject, { dataField: "FamousPirate", value: "Cpt. Jack Sparrow" }, "Correct data");
    assert.equal(callCount, 1, "onFieldDataChanged called 1 time");

    form.option("formData.FamousPirate", "Blackbeard");

    assert.deepEqual(testObject, { dataField: "FamousPirate", value: "Blackbeard" }, "Correct data");
    assert.equal(callCount, 2, "onFieldDataChanged called 2 times");

    form.option("formData", { FamousDetective: "Sherlock Holmes" });
    assert.equal(callCount, 3, "onFieldDataChanged called 3 times");
});

QUnit.test("Check the work of onFieldDataChanged with complex dataField", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        testObject,
        callCount = 0;

    $testContainer.dxForm({
        formData: { FamousPirate: { firstName: "John", lastName: "Morgan" } },
        items: [
            {
                itemType: "group",
                caption: "Famous Pirate",
                items: [
                    { dataField: "FamousPirate.firstName" },
                    { dataField: "FamousPirate.lastName" }
                ]
            }
        ],
        onFieldDataChanged: function(args) {
            testObject = { dataField: args.dataField, value: args.value };
            callCount++;
        }
    });

    var form = $testContainer.dxForm("instance");

    //act, assert
    $testContainer.find(".dx-textbox").first().dxTextBox("instance").option("value", "Cpt. Jack");

    assert.deepEqual(testObject, { dataField: "FamousPirate.firstName", value: "Cpt. Jack" }, "Correct data");
    assert.equal(callCount, 1, "onFieldDataChanged called 1 time");

    form.option("formData.FamousPirate.lastName", "Sparrow");

    assert.deepEqual(testObject, { dataField: "FamousPirate.lastName", value: "Sparrow" }, "Correct data");
    assert.equal(callCount, 2, "onFieldDataChanged called 2 times");
});

QUnit.test("Check the work of onFieldDataChanged when whole object is changed", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        testObjects = [];

    $testContainer.dxForm({
        formData: { famousPirate: "John Morgan" },
        onFieldDataChanged: function(args) {
            testObjects.push({ dataField: args.dataField, value: args.value });
        }
    });

    var form = $testContainer.dxForm("instance");

    //act, assert

    form.option("formData", { famousPirate: "Blackbeard", famousDetective: "Sherlock Holmes" });

    assert.equal(testObjects.length, 2, "onFieldDataChanged fire by 2 fields");

    assert.deepEqual(testObjects[0], { dataField: "famousPirate", value: "Blackbeard" }, "Correct data");
    assert.deepEqual(testObjects[1], { dataField: "famousDetective", value: "Sherlock Holmes" }, "Correct data");
});

QUnit.test("Check the work of onFieldDataChanged when whole object is changed and items are defined", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        testObjects = [];

    $testContainer.dxForm({
        formData: { famousPirate: "Blackbeard", famousDetective: "Sherlock Holmes" },
        items: ["famousPirate"],
        onFieldDataChanged: function(args) {
            testObjects.push({ dataField: args.dataField, value: args.value });
        }
    });

    var form = $testContainer.dxForm("instance");
    //act
    form.option("formData", { famousPirate: "Calico Jack", famousDetective: "Hercule Poirot" });

    //assert
    assert.equal(testObjects.length, 2, "onFieldDataChanged fired 2 times");
});

QUnit.test("Check the onFieldDataChanged resets old subscriptions", function(assert) {
    //arrange
    var $testContainer = $("#form"),
        testObjects = [];

    $testContainer.dxForm({
        formData: { famousPirate: "Blackbeard", famousDetective: "Sherlock Holmes" },
        items: ["famousPirate"],
        onFieldDataChanged: function(args) {
            testObjects.push({ dataField: args.dataField, value: args.value });
        }
    });

    var form = $testContainer.dxForm("instance");

    //act
    form.option({
        formData: { famousPirate: "Blackbeard", famousDetective: "Sherlock Holmes" },
        onFieldDataChanged: function(args) {
            testObjects.push({ dataField: args.dataField, value: args.value });
        }
    });
    form.option({
        formData: { famousPirate: "Blackbeard", famousDetective: "Sherlock Holmes" },
        onFieldDataChanged: function(args) {
            testObjects.push({ dataField: args.dataField, value: args.value });
        }
    });

    //assert
    assert.equal(testObjects.length, 4, "onFieldDataChanged fired 4 times");
});

QUnit.test("alignItemLabels option for not grouping", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            formData: { name: "Test", lastName: "surname" }
        }),
        $layoutManager = $formContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS).first().dxLayoutManager("instance");

    //assert
    assert.equal($layoutManager.option("alignItemLabels"), true);
});

QUnit.test("Render scrollable", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        height: 200,
        scrollingEnabled: true,
        formData: {
            "ID": 1,
            "FirstName": "John",
            "LastName": "Heart",
            "Prefix": "Mr.",
            "Position": "CEO",
            "Picture": "images/employees/01.png",
            "BirthDate": "1964/03/16",
            "HireDate": "1995/01/15",
            "Notes": "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.",
            "Address": "351 S Hill St.",
            "StateID": 5
        }
    });

    //assert
    assert.ok($formContainer.hasClass("dx-scrollable"), "has scrollable");
    assert.equal($formContainer.find(".dx-scrollable-content > ." + internals.FORM_LAYOUT_MANAGER_CLASS).length, 1, "scrollable content");
});

QUnit.test("Check validation error when validationRules are not defined for any item", function(assert) {
    //arrange, act
    var $testContainer = $("#form"),
        errorMessage,
        _error = consoleUtils.logger.log,
        instance;

    consoleUtils.logger.error = function(message) {
        errorMessage = message;
    };

    instance = $testContainer
        .dxForm({
            layoutData: {
                lastName: "Kyle",
                firstName: "Logan"
            },
            items: [
                { dataField: "lastName" },
                { dataField: "firstName" }
            ]
        })
        .dxForm("instance");

    instance.validate();

    //assert
    assert.equal(errorMessage.indexOf("E1036 - Validation rules are not defined for any form item"), 0);
    assert.ok(errorMessage.indexOf("See:\nhttp://js.devexpress.com/error/") > 0);

    consoleUtils.logger.error = _error;
});

QUnit.test("Default validation group", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        items: [
            {
                dataField: "name",
                isRequired: true
            }
        ]
    });

    //assert
    var validator = $formContainer.find(".dx-validator").dxValidator("instance");
    assert.equal(validator.option("validationGroup"), $formContainer.dxForm("instance"));
});

QUnit.test("Set external validation group name", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
        validationGroup: "Test Validation Group",
        items: [
            {
                dataField: "name",
                isRequired: true
            }
        ]
    });

    //assert
    var validator = $formContainer.find(".dx-validator").dxValidator("instance");
    assert.equal(validator.option("validationGroup"), "Test Validation Group");
});

QUnit.test("Show validation summary", function(assert) {
    //arrange
    var $formContainer = $("#form").dxForm({
            showValidationSummary: true,
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox",
                    validationRules: [{
                        type: "required"
                    }]
                }
            ]
        }),
        $summaryContents;

    //act
    $formContainer.dxForm("instance").validate();
    $summaryContents = $formContainer.find(".dx-validationsummary-item-content");

    //assert
    assert.equal($formContainer.find(".dx-validationsummary").length, 1);
    assert.equal($summaryContents.eq(0).text(), "Required", "summary item");
});

QUnit.test("Show validation summary with a custom validation group", function(assert) {
    //arrange
    var $formContainer = $("#form").dxForm({
        validationGroup: "Custom validation group",
        showValidationSummary: true,
        items: [
            {
                dataField: "name",
                isRequired: true
            }
        ]
    });

    //act
    $formContainer.dxForm("instance").validate();

    //assert
    var $validationSummary = $formContainer.find(".dx-validationsummary");
    assert.equal($validationSummary.length, 1);
    assert.equal($validationSummary.dxValidationSummary("instance").option("validationGroup"), "Custom validation group", "validation group");
});

QUnit.test("Show validation summary via option method", function(assert) {
    //arrange
    var $formContainer = $("#form").dxForm({
        showValidationSummary: false,
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //act
    $formContainer.dxForm("instance").option("showValidationSummary", true);

    //assert
    assert.equal($formContainer.find(".dx-validationsummary").length, 1);
});

QUnit.test("Hide validation summary via option method", function(assert) {
    //arrange
    var $formContainer = $("#form").dxForm({
        showValidationSummary: true,
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //act
    $formContainer.dxForm("instance").option("showValidationSummary", false);

    //assert
    assert.equal($formContainer.find("form .dx-validationsummary").length, 0);
});

QUnit.test("The dxForm is not rendered correctly when colCount is zero", function(assert) {
    //arrange, act
    var form = $("#form").dxForm({
        formData: { name: "Batman" },
        colCount: 0
    }).dxForm("instance");

    //assert
    assert.equal(form.getEditor("name").option("value"), "Batman");
    assert.equal(form.$element().find("." + internals.FORM_FIELD_ITEM_COL_CLASS + "0").length, 1);

    //act
    form.option("colCount", 1);
    form.option("colCount", 0);

    //assert
    assert.equal(form.getEditor("name").option("value"), "Batman");
    assert.equal(form.$element().find("." + internals.FORM_FIELD_ITEM_COL_CLASS + "0").length, 1);
});

QUnit.test("Invalid field name when item is defined not as string and not as object", function(assert) {
    //arrange, act
    var form = $("#form").dxForm({
        formData: { name: "Batman", lastName: "Klark" },
        items: [1, "lastName"]
    }).dxForm("instance");

    //assert
    assert.equal(form.$element().find("." + internals.FIELD_ITEM_CLASS).length, 1, "items count");
    assert.equal(form.getEditor("name"), undefined, "editor by name field");
    assert.equal(form.getEditor("lastName").option("value"), "Klark", "editor by lastName field");
});

QUnit.test("Render form item with specific class", function(assert) {
    //arrange, act
    var $testContainer = $("#form").dxForm({
        items: [
            {
                itemType: "group",
                cssClass: "custom-group-class",
                items: [
                    {
                        label: { text: "New label" },
                        dataField: "name",
                        editorType: "dxTextBox",
                        cssClass: "myFavoriteItem"
                    },
                    {
                        itemType: "empty",
                        cssClass: "custom-empty-class"
                    },
                    {
                        itemType: "tabbed",
                        cssClass: "custom-tabbed-class",
                        tabs: [{
                            title: "test",
                            items: [
                                {
                                    label: { text: "Newest label" },
                                    dataField: "name",
                                    editorType: "dxTextBox",
                                    cssClass: "newItem"
                                }
                            ]
                        }]
                    }
                ]
            }
        ]
    });

    //assert
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + ".custom-group-class").length, 1, "custom class for group");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + ".myFavoriteItem").length, 1, "custom class for item in group");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + ".custom-tabbed-class").length, 1, "custom class for tabbed");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .custom-empty-class").length, 1, "custom class for empty");
});

QUnit.test("Validation boundary for editors when scrolling is enabled_T306331", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        scrollingEnabled: true,
        formData: { id: 1, name: "" },
        items: [
            "id",
            {
                dataField: "name",
                editorType: "dxTextBox",
                validationRules: [{
                    type: "required"
                }]
            }
        ]
    }).dxForm("instance");

    //act
    form.validate();

    //assert
    assert.equal(form.getEditor("id").option("validationBoundary"), form.$element());
    assert.equal(form.getEditor("name").option("validationBoundary"), form.$element());
});

QUnit.test("Validation boundary for editors when scrolling is disabled_T306331", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        scrollingEnabled: false,
        formData: { id: 1, name: "" },
        items: [
            "id",
            {
                dataField: "name",
                editorType: "dxTextBox",
                validationRules: [{
                    type: "required"
                }]
            }
        ]
    }).dxForm("instance");

    //act
    form.validate();

    //assert
    assert.equal(form.getEditor("id").option("validationBoundary"), undefined);
    assert.equal(form.getEditor("name").option("validationBoundary"), undefined);
});

QUnit.test("dxshown event fire when visible option changed to true", function(assert) {
    //arrange
    var form = $("#form").dxForm({
            formData: { id: 1 }
        }).dxForm("instance"),
        dxShownEventCounter = 0;

    $(form.$element())
        .find(".dx-visibility-change-handler")
        .first()
        .on("dxshown", function() {
            dxShownEventCounter++;
        });

    //act, assert
    form.option("visible", false);
    assert.equal(dxShownEventCounter, 0, "dxshown event does not fire");

    form.option("visible", true);
    assert.equal(dxShownEventCounter, 1, "dxshown event fired");
});

QUnit.test("Reset editor's value when the formData option is empty object", function(assert) {
        //arrange
    var values = [],
        form = $("#form").dxForm({
            formData: {
                name: "User",
                room: 1
            },
            items: ["name", "lastName", "sex", "room", "isDeveloper"],
            onFieldDataChanged: function(e) {
                values.push({
                    dataField: e.dataField,
                    value: e.value
                });
            }
        }).dxForm("instance");

        //act
    form.option("formData", {});

        //assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), "", "editor for the room dataField");

    assert.deepEqual(values[0], { dataField: "name", value: "" }, "value of name dataField");
    assert.deepEqual(values[3], { dataField: "room", value: "" }, "value of room dataField");
});

QUnit.test("Reset editor's value when the formData option is null", function(assert) {
        //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            room: 1
        },
        items: ["name", "room"]
    }).dxForm("instance");

        //act
    form.option("formData", null);

        //assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), "", "editor for the room dataField");
});

QUnit.test("Reset editor's value when the formData option is undefined", function(assert) {
        //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            room: 1
        },
        items: ["name", "room"]
    }).dxForm("instance");

        //act
    form.option("formData", undefined);

        //assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), "", "editor for the room dataField");
});

QUnit.test("Reset editor's value with validation", function(assert) {
        //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            lastName: "John"
        },
        items: ["name", { dataField: "lastName", isRequired: true }]
    }).dxForm("instance");

        //act
    form.option("formData", undefined);

        //assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("lastName").option("value"), "", "editor for the lastName dataField");

    assert.ok(!form.getEditor("lastName").$element().hasClass("dx-invalid"), "not invalid css class");
    assert.ok(form.getEditor("lastName").option("isValid"), "isValid");
});

QUnit.test("The 'dataField' option of a simple item should affect the editorOptions.name option", function(assert) {
    var form = $("#form").dxForm({
        formData: {
            firstName: "Mike"
        },
        items: [{ dataField: "firstName" }]
    }).dxForm("instance");

    assert.equal(form.getEditor("firstName").option("name"), "firstName", "Editor name is OK");
});

QUnit.test("The 'dataField' option of a simple item should not affect existing editorOptions.name option", function(assert) {
    var form = $("#form").dxForm({
        formData: {
            firstName: "Mike"
        },
        items: [{ dataField: "firstName", editorOptions: { name: "UserName" } }]
    }).dxForm("instance");

    assert.equal(form.getEditor("firstName").option("name"), "UserName", "Editor name is OK");
});

QUnit.test("Refresh form when visibility changed to 'true' in msie browser", function(assert) {
    //arrange, act
    var $testContainer = $("#form"),
        expectedRefreshCount = browser.msie ? 1 : 0,
        form;

    form = $testContainer.dxForm({
        formData: { name: "TestName" },
        items: [{ dataField: "name" }]
    }).dxForm("instance");

    var refreshStub = sinon.stub(form, "_refresh");
    domUtils.triggerHidingEvent($testContainer);
    domUtils.triggerShownEvent($testContainer);

    //assert
    assert.equal(refreshStub.callCount, expectedRefreshCount, "Refresh on visibility changed to 'true' if browser is IE or Edge");
    refreshStub.restore();
});

QUnit.module("Grouping");

QUnit.test("Render groups", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith",
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                {
                    itemType: "group",
                    items: [
                        {
                            dataField: "firstName"
                        },
                        {
                            dataField: "lastName"
                        }
                    ]
                },
                {
                    itemType: "group",
                    items: [
                        {
                            dataField: "photo"
                        }
                    ]
                },
                {
                    itemType: "group",
                    items: [
                        {
                            dataField: "address.city"
                        },
                        {
                            dataField: "address.street"
                        }
                    ]
                }]
        }),
        $captions = $formContainer.find("." + internals.FORM_GROUP_CLASS + " ." + internals.FORM_GROUP_CAPTION_CLASS),
        $groups = $formContainer.find("." + internals.FORM_GROUP_CLASS),
        $labelTexts;

    //assert
    assert.equal($formContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS).eq(0).children().length, 1, "item content has only element with group");

    assert.equal($captions.length, 0, "captions count");
    assert.equal($groups.length, 3, "group elements count");
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group1 field items count");

    $labelTexts = $groups.eq(0).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    assert.equal($labelTexts.eq(0).text(), "First Name:", "group1 label text 1");
    assert.equal($labelTexts.eq(1).text(), "Last Name:", "group1 label text 2");

    assert.equal($groups.eq(1).find("." + internals.FIELD_ITEM_CLASS).length, 1, "group2 field items count");
    $labelTexts = $groups.eq(1).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    assert.equal($labelTexts.eq(0).text(), "Photo:", "group2 label text 1");

    assert.equal($groups.eq(2).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group3 field items count");
    $labelTexts = $groups.eq(2).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    assert.equal($labelTexts.eq(0).text(), "Address city:", "group3 label text 1");
    assert.equal($labelTexts.eq(1).text(), "Address street:", "group3 label text 2");
});

QUnit.test("ColCount for groups", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith",
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                {
                    itemType: "group",
                    colCount: 3,
                    items: [
                        {
                            dataField: "firstName"
                        },
                        {
                            dataField: "lastName"
                        }
                    ]
                },
                {
                    itemType: "group",
                    items: [
                        {
                            dataField: "photo"
                        }
                    ]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: [
                        {
                            dataField: "address.city"
                        },
                        {
                            dataField: "address.street"
                        }
                    ]
                }]
        }),
        $layoutManagers = $formContainer.find("." + internals.FORM_GROUP_CLASS + " ." + internals.FORM_LAYOUT_MANAGER_CLASS);

    //assert
    assert.equal($layoutManagers.length, 3);
    assert.equal($layoutManagers.eq(0).dxLayoutManager("instance").option("colCount"), 3, "colCount from 1 layout manager");
    assert.equal($layoutManagers.eq(1).dxLayoutManager("instance").option("colCount"), 1, "colCount from 2 layout manager");
    assert.equal($layoutManagers.eq(2).dxLayoutManager("instance").option("colCount"), 2, "colCount from 3 layout manager");
});

QUnit.test("Caption of group", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith"
            },
            items: [
                {
                    itemType: "group",
                    caption: "Personal",
                    items: [
                        {
                            dataField: "firstName"
                        },
                        {
                            dataField: "lastName"
                        }
                    ]
                }]
        }),
        $captions = $formContainer.find("." + internals.FORM_GROUP_CLASS + " ." + internals.FORM_GROUP_CAPTION_CLASS);

    //assert
    assert.equal($captions.length, 1);
    assert.equal($captions.eq(0).text(), "Personal");
});

QUnit.test("helpText element didn't render for group item", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            formData: {
                firstName: "John"
            },
            items: [
                {
                    itemType: "group",
                    caption: "Personal",
                    helpText: "Help Text",
                    items: [
                        {
                            dataField: "firstName"
                        }
                    ]
                }]
        }),
        $helpTextElement = $formContainer.find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS);

    //assert
    assert.equal($helpTextElement.length, 0, "There is no helpText element");
});

QUnit.test("Group template", function(assert) {
    //arrange, act
    var $formContainer = $("#form").dxForm({
            formData: {
                firstName: "John",
                lastName: "Dow",
                biography: "bla-bla-bla"
            },
            items: [
                {
                    itemType: "group",
                    caption: "Personal info",
                    items: [
                        {
                            dataField: "firstName"
                        },
                        {
                            dataField: "lastName"
                        }
                    ]
                },
                {
                    itemType: "group",
                    caption: "Bio",
                    template: function(data, container) {
                        assert.deepEqual(typeUtils.isRenderer(container), config().useJQuery, "container is correct");
                        $("<div>")
                            .text(data.formData.biography)
                            .addClass("template-biography")
                            .appendTo(container);
                    }
                }]
        }),
        $groups = $formContainer.find("." + internals.FORM_GROUP_CLASS);

    //assert
    assert.equal($groups.length, 2, "2 groups rendered");
    assert.equal($groups.eq(1).find(".template-biography").length, 1, "We have template content");
    assert.equal($groups.eq(1).find(".template-biography").text(), "bla-bla-bla", "Template's content has correct data");
});

QUnit.test("Template has correct component instance", function(assert) {
    //arrange, act
    var templateOwnerComponent;

    $("#form").dxForm({
        items: [
            {
                name: "test",
                template: function(data, $container) {
                    templateOwnerComponent = data.component.NAME;
                }
            }
        ]
    });

    //assert
    assert.equal(templateOwnerComponent, "dxForm", "Template's data.component is 'dxForm'");
});

QUnit.test("Recursive grouping", function(assert) {
    //arrange, act
    var form = $("#form").dxForm({
            formData: {
                firstName: "John",
                lastName: "Dow",
                biography: "bla-bla-bla",
                photo: "test photo",
                sex: true,
                room: 1001,
                city: "Tallinn"
            },
            items: [
                {
                    itemType: "group",
                    items: [
                        {
                            itemType: "group",
                            caption: "Personal info",
                            items: ["firstName", "lastName"]
                        },
                        {
                            itemType: "group",
                            caption: "Description",
                            items: ["biography", "photo"]
                        }]
                },
                {
                    itemType: "group",
                    items: [
                        {
                            itemType: "group",
                            caption: "Sex",
                            items: ["sex"]
                        },
                        {
                            itemType: "group",
                            caption: "Address",
                            items: ["room", "city"]
                        }]
                }
            ]
        }).dxForm("instance"),
        template = $("<div/>"),
        items = form._testResultItems;

    //assert
    items[0].template.render({
        model: {},
        container: template
    });
    assert.equal(template.find("> ." + internals.FORM_GROUP_CLASS).length, 1, "external group 1");
    template.empty();

    items[0].items[0].template.render({
        model: {},
        container: template
    });
    assert.equal(template.find("> ." + internals.FORM_GROUP_CLASS).length, 1, "external group 1 internal group 1");
    template.empty();

    items[0].items[1].template.render({
        model: {},
        container: template
    });
    assert.equal(template.find("> ." + internals.FORM_GROUP_CLASS).length, 1, "external group 1 internal group 2");
    template.empty();

    items[1].template.render({
        model: {},
        container: template
    });
    assert.equal(template.find("> ." + internals.FORM_GROUP_CLASS).length, 1, "external group 1");
    template.empty();

    items[1].items[0].template.render({
        model: {},
        container: template
    });
    assert.equal(template.find("> ." + internals.FORM_GROUP_CLASS).length, 1, "external group 2 internal group 1");
    template.empty();

    items[1].items[1].template.render({
        model: {},
        container: template
    });
    assert.equal(template.find("> ." + internals.FORM_GROUP_CLASS).length, 1, "external group 2 internal group 2");
    template.empty();

    template.remove();
});

QUnit.test("Hide nested group item", function(assert) {
        //arrange
    var $formContainer = $("#form").dxForm({
            formData: {
                photo: "image.png",
                address: {
                    city: "Test City",
                    street: "Test street"
                }
            },
            items: [
                {
                    itemType: "group",
                    items: [
                        {
                            itemType: "group",
                            items: ["photo"]
                        },
                        {
                            itemType: "group",
                            items: ["address.city", "address.street"]
                        }
                    ]
                }
            ]
        }),
        form = $formContainer.dxForm("instance");

        //act
    var $formGroups = $formContainer.find("." + internals.FORM_GROUP_CLASS);

        //assert
    assert.equal($formGroups.length, 3, "3 groups were rendered");

        //act
    var changeItemOptionSpy = sinon.spy(form, "_changeItemOption");
    form.option("items[0].items[1].visible", false);
    $formGroups = $formContainer.find("." + internals.FORM_GROUP_CLASS);

        //assert
    assert.equal($formGroups.length, 2, "Two groups were rendered");
    assert.equal(changeItemOptionSpy.args[0][1], "visible", "option's name is correct");
    assert.equal(changeItemOptionSpy.args[0][2], false, "option's value is correct");
});

QUnit.module("Align labels", {
    beforeEach: function() {
        var that = this;

        that.testObject = {
            "ID": 1,
            "FirstName": "John",
            "LastName": "Heart",
            "Prefix": "Mr.",
            "Position": "CEO",
            "Picture": "images/employees/01.png",
            "BirthDate": "1964/03/16",
            "HireDate": "1995/01/15",
            "Notes": "John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.",
            "Address": "351 S Hill St.",
            "StateID": 5
        };

        responsiveBoxScreenMock.setup.call(this, 1200);
    },
    afterEach: function() {
        responsiveBoxScreenMock.teardown.call(this);
    }
});

function getLabelWidth(container, form, text) {
    var $label = form._rootLayoutManager._renderLabel({ text: text, location: "left" }).appendTo(container),
        width = $label.children().first().width();

    $label.remove();
    return width;
}

function findLabelTextsInColumn($container, columnIndex) {
    return $container.find("." + internals.FORM_FIELD_ITEM_COL_CLASS + columnIndex + " ." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
}

QUnit.test("Align labels in column", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: this.testObject,
            colCount: 4,
            customizeItem: function(item) {
                switch(item.dataField) {
                    case "FirstName":
                    case "LastName":
                        item.colSpan = 2;
                        break;
                    case "Prefix":
                        item.colSpan = 4;
                        break;
                    case "Notes":
                        item.colSpan = 5;
                        break;
                    case "StateID":
                        item.colSpan = 3;
                        break;
                    default:
                }
            }
        }).dxForm("instance");

    var $col1 = $(".dx-col-0"),
        $col2 = $(".dx-col-1"),
        $col3 = $(".dx-col-2"),
        $col4 = $(".dx-col-3"),
        $maxLabelWidth = getLabelWidth(testContainer, form, "Position:"),
        i,
        labelWidth;

    //assert
    for(i = 0; i < 4; i++) {
        labelWidth = $col1.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col0 item " + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, "First Name:");
    for(i = 0; i < 3; i++) {
        labelWidth = $col2.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col1 item " + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, "Birth Date:");
    for(i = 0; i < 2; i++) {
        labelWidth = $col3.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col2 item " + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, "Last Name:");
    for(i = 0; i < 2; i++) {
        labelWidth = $col4.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col3 item " + i);
    }

    assert.equal($("." + internals.HIDDEN_LABEL_CLASS).length, 0, "hidden labels count");
});

QUnit.test("Align labels in column when labels text is identical", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: { TestBool: true, ShipName: "Test" }
        }).dxForm("instance");

    var $col1 = $(".dx-col-0"),
        $maxLabelWidth = getLabelWidth(testContainer, form, "Ship Name:"),
        i;

    //assert
    for(i = 0; i < 2; i++) {
        var labelWidth = $col1.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col0 item " + i);
    }
});

QUnit.test("Disable alignItemLabels", function(assert) {
    //arrange, act
    var testContainer = $("#form");

    testContainer.dxForm({
        formData: { TestBool: true, ShipName: "Test" },
        alignItemLabels: false
    }).dxForm("instance");

    var $labelTexts = $("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);

    //assert
    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width());
});

QUnit.test("Disable alignItemLabels in group", function(assert) {
    //arrange, act
    var testContainer = $("#form");

    testContainer.dxForm({
        formData: { TestBool: true, ShipName: "Test", Name: "John", LastName: "Smith" },
        items: [
            {
                itemType: "group",
                alignItemLabels: false,
                items: ["TestBool", "ShipName"]
            },
            {
                itemType: "group",
                items: ["Name", "LastName"]
            }
        ]
    }).dxForm("instance");

    var $groups = $("." + internals.FORM_GROUP_CLASS),
        $labelTexts = $groups.eq(0).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);

    //assert
    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), "group 1");

    $labelTexts = $groups.eq(1).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    assert.equal($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), "group 2");
});

QUnit.test("Align labels in column when alignItemLabelsInAllGroups is enabled", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            colCount: 2,
            formData: {
                firstName: "John",
                lastName: "Smith",
                middleName: "Test Middle Name",
                order: 101,
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                {
                    itemType: "group",
                    colCount: 3,
                    items: ["firstName", "lastName", "middleName"]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["photo", "order"]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["address.city", "address.street"]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["address.room", "address.house"]
                }]
        }).dxForm("instance"),
        labelWidth,
        textWidth,
        $groups,
        $texts,
        i;

    //assert
    $groups = form._getGroupElementsInColumn(testContainer, 0);
    $texts = findLabelTextsInColumn($groups, 0);
    labelWidth = getLabelWidth(testContainer, form, "Address city:");
    for(i = 0; i < 2; i++) {
        textWidth = $texts.eq(i).width();

        assert.roughEqual(textWidth, labelWidth, 1, "group col 1, col1 item " + i);
    }

    $texts = findLabelTextsInColumn($groups, 1);
    assert.roughEqual($texts.eq(0).width(), getLabelWidth(testContainer, form, "Last Name:"), 1, "group col 1, col2 item 1");
    assert.roughEqual($texts.eq(1).width(), getLabelWidth(testContainer, form, "Address street:"), 1, "group col 1, col2 item 2");

    $texts = findLabelTextsInColumn($groups, 2);
    labelWidth = getLabelWidth(testContainer, form, "Middle Name:");
    assert.roughEqual($texts.eq(0).width(), labelWidth, 1, "group col 1, col3 item 1");

    $groups = form._getGroupElementsInColumn(testContainer, 1);
    $texts = findLabelTextsInColumn($groups, 0);
    labelWidth = getLabelWidth(testContainer, form, "Address room:");
    for(i = 0; i < 2; i++) {
        textWidth = $texts.eq(i).width();

        assert.roughEqual(textWidth, labelWidth, 1, "group col 2, col1 item " + i);
    }

    $texts = findLabelTextsInColumn($groups, 1);
    labelWidth = getLabelWidth(testContainer, form, "Address house:");
    for(i = 0; i < 2; i++) {
        textWidth = $texts.eq(i).width();

        assert.roughEqual(textWidth, labelWidth, 1, "group col , col2 item " + i);
    }
});

QUnit.test("Align labels in column when alignItemLabelsInAllGroups is disabled", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            colCount: 2,
            alignItemLabelsInAllGroups: false,
            formData: {
                firstName: "John",
                lastName: "Smith",
                order: 101,
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["firstName", "lastName"]
                },
                {
                    itemType: "group",
                    colCount: 1,
                    items: ["photo", "order"]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["address.city", "address.street"]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["address.room", "address.house"]
                }]
        }).dxForm("instance"),
        $groups;

    //assert
    $groups = form._getGroupElementsInColumn(testContainer, 0);
    assert.notEqual(findLabelTextsInColumn($groups.eq(0), 0).eq(0).width(), findLabelTextsInColumn($groups.eq(1), 0).eq(0).width(), "compare group1 with group2");

    $groups = form._getGroupElementsInColumn(testContainer, 1);
    assert.notEqual(findLabelTextsInColumn($groups.eq(0), 0).eq(0).width(), findLabelTextsInColumn($groups.eq(1), 0).eq(0).width(), "compare group1 with group2");
});

QUnit.test("Align labels in columns when there are rows", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: this.testObject,
            colCount: 4,
            items: [{
                name: "fieldFirstValue",
                colSpan: 2,
                editorType: "dxTextBox",
                label: {
                    text: "Field 1"
                }
            },
            {
                name: "fieldSecondValue",
                colSpan: 2,
                editorType: "dxTextBox",
                label: {
                    text: "Field 2"
                }
            },
            {
                name: "fieldThirdValue",
                colSpan: 2,
                editorType: "dxTextBox",
                label: {
                    text: "Field three"
                }
            },
            {
                name: "fieldFourthValue",
                colSpan: 2,
                editorType: "dxTextBox",
                label: {
                    text: "Field four"
                }
            }
            ]
        }).dxForm("instance");

    var $col1 = $(".dx-col-0"),
        $col2 = $(".dx-col-2"),
        $maxLabelWidth = getLabelWidth(testContainer, form, "Field three: "),
        i,
        labelWidth;

    //assert
    for(i = 0; i < 2; i++) {
        labelWidth = $col1.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col0 item " + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, "Field four: ");
    for(i = 0; i < 2; i++) {
        labelWidth = $col2.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col2 item " + i);
    }
});

QUnit.test("Change option after group rendered (check for cycling template render)", function(assert) {
    //arrange
    var $formContainer = $("#form").dxForm({
            formData: {
                firstName: "John",
                lastName: "Rightman"
            },
            items: [
                {
                    itemType: "group",
                    caption: "Personal",
                    items: [
                        {
                            dataField: "firstName"
                        },
                        {
                            dataField: "lastName"
                        }
                    ]
                }]
        }),
        $fieldItemWidgets;

    //act
    $formContainer.dxForm("instance").option("colCount", 4);

    $fieldItemWidgets = $formContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS);

    //assert
    assert.equal($fieldItemWidgets.length, 3, "Correct number of a widgets");
});

QUnit.test("Align labels when layout is changed in responsive box_T306106", function(assert) {
    //arrange
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: this.testObject,
            colCount: 4,
            customizeItem: function(item) {
                switch(item.dataField) {
                    case "FirstName":
                    case "LastName":
                        item.colSpan = 2;
                        break;
                    case "Prefix":
                        item.colSpan = 4;
                        break;
                    case "Notes":
                        item.colSpan = 5;
                        break;
                    case "StateID":
                        item.colSpan = 3;
                        break;
                    default:
                }
            }
        }).dxForm("instance");

    var $labelsContent = testContainer.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS),
        $maxLabelWidth = getLabelWidth(testContainer, form, "First Name:"),
        i;

    //act
    this.updateScreenSize(500);

    //assert
    for(i = 0; i < 11; i++) {
        var labelWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "item " + i);
    }

    assert.equal($("." + internals.HIDDEN_LABEL_CLASS).length, 0, "hidden labels count");
});

QUnit.test("Align labels when layout is changed when small window size by default_T306106", function(assert) {
    //arrange
    this.updateScreenSize(500);

    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: this.testObject,
            colCount: 4,
            customizeItem: function(item) {
                switch(item.dataField) {
                    case "FirstName":
                    case "LastName":
                        item.colSpan = 2;
                        break;
                    case "Prefix":
                        item.colSpan = 4;
                        break;
                    case "Notes":
                        item.colSpan = 5;
                        break;
                    case "StateID":
                        item.colSpan = 3;
                        break;
                    default:
                }
            }
        }).dxForm("instance");

    var $labelsContent = testContainer.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS),
        $maxLabelWidth = getLabelWidth(testContainer, form, "First Name:"),
        i;

    //assert
    for(i = 0; i < 11; i++) {
        var labelWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "item " + i);
    }

    assert.equal($("." + internals.HIDDEN_LABEL_CLASS).length, 0, "hidden labels count");
});

QUnit.module("Tabs", {
    beforeEach: function() {
        var that = this;
        that.clock = sinon.useFakeTimers();

        responsiveBoxScreenMock.setup.call(this, 1200);
    },

    afterEach: function() {
        this.clock.restore();
        responsiveBoxScreenMock.teardown.call(this);
    }
});

QUnit.test("Render tabs", function(assert) {
    //arrange, act
    var testContainer = $("#form");

    testContainer.dxForm({
        formData: {
            firstName: "John",
            lastName: "Smith",
            sex: true,
            order: 101,
            photo: "image.png",
            address: {
                city: "Test City",
                room: 11,
                house: 7,
                street: "Test street"
            }
        },
        items: [
            {
                itemType: "group",
                colCount: 2,
                items: ["firstName", "lastName"]
            },
            {
                itemType: "tabbed",
                tabPanelOptions: { animationEnabled: true },
                tabs: [
                    {
                        title: "Address1",
                        items: ["address.city", "address.street"]
                    },
                    {
                        title: "Address2",
                        items: ["address.room", "address.house"]
                    }]
            }]
    });

    var tabPanelItems,
        tabPanel = $(".dx-tabpanel").dxTabPanel("instance");

    //assert
    tabPanelItems = tabPanel.option("items");
    assert.equal(tabPanel.option("animationEnabled"), true, "tab panel option");
    assert.equal(tabPanelItems.length, 2, "items count in tab panel");
    assert.equal(tabPanelItems[0].title, "Address1", "title of tab 1");
    assert.equal(tabPanelItems[1].title, "Address2", "title of tab 2");
    assert.equal(testContainer.find(".dx-multiview-item ." + internals.FORM_LAYOUT_MANAGER_CLASS).length, 1, "layout manager inside multiview item");
    assert.ok(testContainer.find(".dx-multiview-item .dx-textbox").first().width() / testContainer.width() > 0.5, "Editors are not tiny");
});

QUnit.test("Render tabs with groups", function(assert) {
    //arrange, act
    var clock = sinon.useFakeTimers();
    var testContainer = $("#form");

    testContainer.dxForm({
        formData: {
            firstName: "John",
            lastName: "Smith",
            order: 101,
            photo: "image.png",
            address: {
                city: "Test City",
                room: 11,
                house: 7,
                street: "Test street"
            }
        },
        items: [
            {
                itemType: "tabbed",
                tabs: [
                    {
                        title: "Other1",
                        items: [{
                            itemType: "group",
                            colCount: 2,
                            items: ["firstName", "lastName"]
                        }, {
                            itemType: "group",
                            items: ["address.city", "address.street"]
                        }]
                    },
                    {
                        title: "Other2",
                        items: [{
                            itemType: "group",
                            colCount: 2,
                            items: ["address.room", "address.house"]
                        }]
                    }]
            }],
    });

    clock.tick();
    var $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);

    //assert
    assert.equal($groups.length, 2);
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 1");
    assert.equal($groups.eq(1).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 2");

    //act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 1");

    //assert
    assert.equal($groups.length, 1);
    clock.restore();
});

QUnit.test("Render tabs when formData is changed", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith",
                order: 101,
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                {
                    itemType: "tabbed",
                    tabs: [
                        {
                            title: "Other1",
                            items: [{
                                itemType: "group",
                                colCount: 2,
                                items: ["firstName", "lastName"]
                            }, {
                                itemType: "group",
                                items: ["address.city", "address.street"]
                            }]
                        },
                        {
                            title: "Other2",
                            items: [{
                                itemType: "group",
                                colCount: 2,
                                items: ["address.room", "address.house"]
                            }]
                        }]
                }]
        }).dxForm("instance"),
        $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);

    //act
    form.option("formData", {
        firstName: "Test Name",
        lastName: "Test Last Name",
        order: 102,
        photo: "image3.png",
        address: {
            city: "New City",
            room: 1,
            house: 3,
            street: "New street"
        } });

    this.clock.tick();

    //assert
    $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);
    assert.equal($groups.length, 2);
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 1");
    assert.equal($groups.eq(1).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 2");

    //act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();
    $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);

    //assert
    assert.equal($groups.length, 1);
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 1");
});

QUnit.test("Check align labels", function(assert) {
    //arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith",
                order: 101,
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                "test order", "photo personal",
                {
                    itemType: "tabbed",
                    tabs: [
                        {
                            title: "Address1",
                            items: [{
                                itemType: "group",
                                colCount: 2,
                                items: ["address.city", "address.street", "address.room", "address.house"]
                            }]
                        },
                        {
                            title: "Address2",
                            colCount: 2,
                            items: ["firstName", "lastName"]
                        }]
                }]
        }).dxForm("instance"),
        $labelTexts,
        labelWidth,
        $layoutManager,
        $layoutManagers = testContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS);

    //assert
    $layoutManager = $layoutManagers.eq(0);
    $labelTexts = findLabelTextsInColumn($layoutManager, 0);
    assert.roughEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), 1, "col 1");

    $layoutManager = $layoutManagers.eq(1);
    $labelTexts = findLabelTextsInColumn($layoutManager, 0);
    labelWidth = getLabelWidth($layoutManager, form, "Address room:");
    assert.roughEqual($labelTexts.eq(0).width(), labelWidth, 1, "tab 1 col 1");

    $labelTexts = findLabelTextsInColumn($layoutManager, 1);
    labelWidth = getLabelWidth($layoutManager, form, "Address house:");
    assert.roughEqual($labelTexts.eq(1).width(), labelWidth, 1, "tab 1 col 2");

    //act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();

    //assert
    $layoutManagers = testContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS);
    $layoutManager = $layoutManagers.eq(3);
    $labelTexts = findLabelTextsInColumn($layoutManager, 0);
    labelWidth = getLabelWidth($layoutManager, form, "First Name:");
    assert.roughEqual($labelTexts.eq(0).width(), labelWidth, 1, "tab 2 col 1");

    $labelTexts = findLabelTextsInColumn($layoutManager, 1);
    labelWidth = getLabelWidth($layoutManager, form, "Last Name:");
    assert.roughEqual($labelTexts.eq(0).width(), labelWidth, 1, "tab 2 col 2");
});

QUnit.test("Check align labels when layout is changed by default_T306106", function(assert) {
    //arrange, act
    this.updateScreenSize(500);

    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith",
                order: 101,
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                "test order", "photo personal",
                {
                    itemType: "tabbed",
                    tabs: [
                        {
                            title: "Address1",
                            items: [{
                                itemType: "group",
                                colCount: 2,
                                items: ["address.city", "address.street", "address.room", "address.house"]
                            }]
                        },
                        {
                            title: "Address2",
                            colCount: 2,
                            items: ["firstName", "lastName"]
                        }]
                }]
        }).dxForm("instance"),
        labelWidth,
        labelContentWidth,
        $labelsContent,
        $layoutManager,
        $layoutManagers = testContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS),
        i;

    //assert
    $layoutManager = $layoutManagers.eq(1);
    $labelsContent = $layoutManager.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, "Address house:");
    for(i = 0; i < 4; i++) {
        labelContentWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelContentWidth, labelWidth, 1, "tab 1, item " + i);
    }

    //act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();

    //assert
    $layoutManagers = testContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS);
    $layoutManager = $layoutManagers.eq(3);
    $labelsContent = $layoutManager.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, "First Name:");
    for(i = 0; i < 2; i++) {
        labelContentWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelContentWidth, labelWidth, 1, "tab 2, item " + i);
    }
});

QUnit.test("Check align labels when layout is changed_T306106", function(assert) {
    //arrange
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: {
                firstName: "John",
                lastName: "Smith",
                order: 101,
                photo: "image.png",
                address: {
                    city: "Test City",
                    room: 11,
                    house: 7,
                    street: "Test street"
                }
            },
            items: [
                "test order", "photo personal",
                {
                    itemType: "tabbed",
                    tabs: [
                        {
                            title: "Address1",
                            items: [{
                                itemType: "group",
                                colCount: 2,
                                items: ["address.city", "address.street", "address.room", "address.house"]
                            }]
                        },
                        {
                            title: "Address2",
                            colCount: 2,
                            items: ["firstName", "lastName"]
                        }]
                }]
        }).dxForm("instance"),
        labelWidth,
        labelContentWidth,
        $labelsContent,
        $layoutManager,
        $layoutManagers = testContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS),
        i;

    //act
    this.updateScreenSize(500);

    //assert
    $layoutManager = $layoutManagers.eq(1);
    $labelsContent = $layoutManager.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, "Address house:");
    for(i = 0; i < 4; i++) {
        labelContentWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelContentWidth, labelWidth, 1, "tab 1, item " + i);
    }

    //act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();

    //assert
    $layoutManagers = testContainer.find("." + internals.FORM_LAYOUT_MANAGER_CLASS);
    $layoutManager = $layoutManagers.eq(3);
    $labelsContent = $layoutManager.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, "First Name:");
    for(i = 0; i < 2; i++) {
        labelContentWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelContentWidth, labelWidth, 1, "tab 2, item " + i);
    }
});

QUnit.test("Data is updated correctly_T353275", function(assert) {
    //arrange
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: {
                firstName: ""
            },
            items: [
                {
                    itemType: "tabbed",
                    tabs: [
                        {
                            items: ["firstName"]
                        }]
                }]
        }).dxForm("instance");

    //act
    form.updateData("firstName", "Test First Name");

    //assert
    assert.equal(form.getEditor("firstName").option("value"), "Test First Name", "value of editor by 'firstName' field");
});

QUnit.test("tabElement argument of tabTemplate option is correct", function(assert) {
    var testContainer = $("#form");
    testContainer.dxForm({
        formData: {
            firstName: ""
        },
        items: [
            {
                itemType: "tabbed",
                tabs: [
                    {
                        items: ["firstName"],
                        tabTemplate: function(tabData, tabIndex, tabElement) {
                            assert.equal(typeUtils.isRenderer(tabElement), config().useJQuery, "tabElement is correct");
                        }
                    }]
            }]
    });
});

QUnit.test("tabElement argument of tabs.template option is correct", function(assert) {
    var testContainer = $("#form");
    testContainer.dxForm({
        formData: {
            firstName: ""
        },
        items: [
            {
                itemType: "tabbed",
                tabs: [
                    {
                        items: ["firstName"],
                        template: function(tabData, tabIndex, tabElement) {
                            assert.equal(typeUtils.isRenderer(tabElement), config().useJQuery, "tabElement is correct");
                        }
                    }]
            }]
    });
});


QUnit.test("Update editorOptions of an editor inside the tab", function(assert) {
    //arrange
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: {
                firstName: "Test name"
            },
            items: [{
                itemType: "tabbed",
                tabs: [{
                    items: [{
                        dataField: "firstName",
                        editorOptions: {
                            disabled: true
                        }
                    }]
                }]
            }]
        }).dxForm("instance");

    assert.equal(form.getEditor("firstName").option("disabled"), true, "initial state: editor is disabled");

    //act
    form.option("items[0].tabs[0].items[0].editorOptions.disabled", false);

    //assert
    assert.equal(form.getEditor("firstName").option("disabled"), false, "'disabled' option was successfully changed");
});

QUnit.module("Public API", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("UpdateData, simple case", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { test1: "abc", test2: "xyz" }
    });

    //act
    var form = $testContainer.dxForm("instance");

    form.updateData("test2", "qwerty");

    //assert
    assert.equal(form.option("formData.test2"), "qwerty", "Correct data");
});

QUnit.test("UpdateData, update with object", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        items: ["test1", "test2", { dataField: "test3.SuperMan" }, { dataField: "test3.Specialization.good" }],
        formData: {
            test1: "abc", test2: "xyz", test3: {
                SuperMan: "Kent",
                Specialization: {
                    good: true
                }
            }
        }
    });

    //act
    var form = $testContainer.dxForm("instance");

    form.updateData({
        test1: "xyz", test2: "qwerty", test3: {
            SuperMan: "KAndrew",
            Specialization: {
                good: false
            }
        }
    });

    //assert
    assert.deepEqual(form.option("formData"), {
        test1: "xyz", test2: "qwerty", test3: {
            SuperMan: "KAndrew",
            Specialization: {
                good: false
            }
        }
    }, "updated data");
    assert.equal(form.getEditor("test1").option("value"), "xyz", "editor's value of 'test1' data field");
    assert.equal(form.getEditor("test2").option("value"), "qwerty", "editor's value of 'test2' data field");
    assert.equal(form.getEditor("test3.SuperMan").option("value"), "KAndrew", "editor's value of 'test3.SuperMan' data field");
    assert.ok(!form.getEditor("test3.Specialization.good").option("value"), "editor's value of 'test3.Specialization.good' data field");
});

QUnit.test("Get editor instance", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { test1: "abc", test2: "xyz" },
        items: ["test1", { name: "test3", editorType: "dxNumberBox" }]
    });

    //act
    var form = $testContainer.dxForm("instance");

    //assert
    assert.ok(!typeUtils.isDefined(form.getEditor("test2")), "We hasn't instance for 'test2' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test1")), "We have instance for 'test1' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test3")), "We have instance for 'test3' field");

    assert.equal(form.getEditor("test1").NAME, "dxTextBox", "It's textbox");
    assert.equal(form.getEditor("test3").NAME, "dxNumberBox", "It's numberBox");
});

QUnit.test("Get editor instance with group config", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { test1: "abc", test2: "xyz" },
        items: [
            "test1",
            {
                itemType: "group",
                items: [{ dataField: "test2", editorType: "dxTextArea" }, { name: "test3", editorType: "dxTextBox" }]
            }
        ]
    });

    //act
    var form = $testContainer.dxForm("instance");

    //assert
    assert.ok(typeUtils.isDefined(form.getEditor("test1")), "We have instance for 'test1' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test2")), "We have instance for 'test2' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test3")), "We have instance for 'test3' field");

    assert.equal(form.getEditor("test2").NAME, "dxTextArea", "It's textArea");
    assert.equal(form.getEditor("test3").NAME, "dxTextBox", "It's textBox");
});

QUnit.test("UpdateDimensions", function(assert) {
    //arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        height: 200,
        formData: { test1: "abc", test2: "xyz", test3: "123" },
        items: ["test1", "test2", "test3", {
            template: function() {
                return $("<div/>")
                    .attr("id", "testBlock")
                    .css({ height: 300, "background-color": "red" });
            }
        }]
    });

    //act
    var form = $testContainer.dxForm("instance"),
        isSizeUpdated;

    $("#testBlock").hide();
    form.updateDimensions().done(function() {
        isSizeUpdated = true;
    });
    this.clock.tick();

    //assert
    assert.ok(isSizeUpdated);
});

function triggerKeyUp($element, keyCode) {
    var e = $.Event("keyup");
    e.which = keyCode;
    $($element.find("input").first()).trigger(e);
}

QUnit.test("Check component instance onEditorEnterKey", function(assert) {
    //arrange
    var testArgs,
        editor,
        form;

    form = $("#form").dxForm({
        formData: {
            name: "Kyle",
            work: "MexCo"
        },
        onEditorEnterKey: function(args) {
            testArgs = args;
        }
    }).dxForm("instance");

    //act
    editor = form.getEditor("work");
    triggerKeyUp(editor.$element(), 13);

    //assert
    assert.notEqual(testArgs.component, undefined, "component");
    assert.notEqual(testArgs.element, undefined, "element");
    assert.notEqual(testArgs.event, undefined, "Event");
    assert.equal(testArgs.dataField, "work", "dataField");
    assert.equal(testArgs.component.NAME, "dxForm", "correct component");
});

QUnit.test("Use 'itemOption' with no items", function(assert) {
    //arrange
    var $testContainer = $("#form").dxForm({
            height: 200,
            formData: { test1: "abc", test2: "xyz", test3: "123" }
        }),
        form = $testContainer.dxForm("instance");

    //act
    var testItem = form.itemOption("test2");

    form.itemOption("test3", "label", { text: "NEWLABEL" });

    //assert
    assert.deepEqual(testItem, { dataField: "test2" }, "corrected item received");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).last().text(), "NEWLABEL:", "new label rendered");
});

QUnit.test("Use 'itemOption' do not change the order of an items", function(assert) {
    //arrange
    var $testContainer = $("#form").dxForm({
            height: 200,
            formData: { ID: 1, FistName: "Alex", LastName: "Johnson", Address: "Alabama" },
            items: [
                "ID",
            { dataField: "FirstName" },
            { dataField: "LastName" },
                "Address"
            ]
        }),
        form = $testContainer.dxForm("instance");

    //act
    form.itemOption("FirstName", {
        visible: true,
        editorOptions: {
            value: "",
            useMaskedValue: true,
            placeholder: "CNPJ",
            mask: "000.000.000-00"
        }
    });

    //assert
    assert.deepEqual(
        form.option("items"),
        [
            { dataField: "ID" },
            {
                dataField: "FirstName",
                visible: true,
                editorOptions: {
                    value: "",
                    useMaskedValue: true,
                    placeholder: "CNPJ",
                    mask: "000.000.000-00"
                }
            },
            { dataField: "LastName" },
            { dataField: "Address" }
        ],
        "correct items order");
});

QUnit.test("Use 'itemOption' with groups", function(assert) {
    //arrange
    var $testContainer = $("#form").dxForm({
            height: 200,
            formData: { EmployeeID: 1, LastName: "John", FirstName: "Dow", BirthData: "01/01/1970", HireDate: "12/11/1995" },
            items: [
                {
                    itemType: "group",
                    items: [
                        {
                            itemType: "group",
                            caption: "Personal",
                            items: [{
                                itemType: "group",
                                caption: "Full Name",
                                colCount: 3,
                                items: ["EmployeeID", "LastName", "FirstName"]
                            }, {
                                itemType: "group",
                                caption: "Dates",
                                items: ["BirthDate", "HireDate"]
                            }]
                        }
                    ]
                }
            ]
        }
        ),
        form = $testContainer.dxForm("instance");

    //act
    var unknownField = form.itemOption("FirstName"),
        firstGroup = form.itemOption("Personal"),
        secondGroup = form.itemOption("Personal.FullName"),
        innerOption = form.itemOption("Personal.FullName.FirstName");

    form.itemOption("Personal.Dates.HireDate", "label", { text: "NEWLABEL" });

    //assert
    assert.equal(unknownField, undefined, "corrected item received");
    assert.deepEqual({ itemType: firstGroup.itemType, caption: firstGroup.caption }, { itemType: "group", caption: "Personal" }, "corrected item received");
    assert.deepEqual({ itemType: secondGroup.itemType, caption: secondGroup.caption }, { itemType: "group", caption: "Full Name" }, "corrected item received");
    assert.equal(innerOption.dataField, "FirstName", "corrected item received");

    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).last().text(), "NEWLABEL:", "new label rendered");
});

QUnit.test("Use 'itemOption' with groups and one group has empty caption (T359214)", function(assert) {
    //arrange
    var $testContainer = $("#form").dxForm({
            height: 200,
            items: [
                {
                    itemType: 'group',
                    caption: '',
                    items: [
                        {
                            itemType: 'simple',
                            dataField: 'Sequence',
                            editType: 'dxTextBox'
                        },
                        {
                            itemType: 'simple',
                            dataField: 'AgentID',
                            editorType: 'dxTextBox'
                        }
                    ]
                },
                {
                    itemType: 'group',
                    caption: 'TestGroup1',
                    items: [
                        {
                            itemType: 'group',
                            caption: 'Tax',
                            items: [
                                {
                                    itemType: 'simple',
                                    dataField: 'IsResident',
                                    editorType: 'dxTextBox'
                                },
                                {
                                    itemType: 'simple',
                                    dataField: 'Minor',
                                    editorType: 'dxTextBox'
                                }
                            ]
                        },
                        {
                            itemType: 'group',
                            caption: 'TestGroup2',
                            items: [
                                {
                                    itemType: 'simple',
                                    dataField: 'DIN',
                                    editorType: 'dxTextBox'
                                }
                            ],
                        }
                    ]
                }
            ]
        }
        ),
        form = $testContainer.dxForm("instance");

    //act
    form.itemOption("TestGroup1.TestGroup2", "caption", "custom");

    //assert
    assert.equal($testContainer.find("." + internals.FORM_GROUP_CAPTION_CLASS).last().text(), "custom", "new caption rendered");
});

QUnit.test("Use 'itemOption' with tabs", function(assert) {
    //arrange
    var $testContainer = $("#form").dxForm({
            formData: { EmployeeID: 1, LastName: "John", FirstName: "Dow", BirthData: "01/01/1970", HireDate: "12/11/1995", Country: "USA", City: "Phoenix", Region: "Arizona", Title: "Ms" },
            items: [
                "EmployeeID", "FirstName", "LastName",
                {
                    itemType: "tabbed",
                    tabs: [
                        {
                            title: "Dates",
                            items: ["BirthDate", "HireDate"]
                        },
                        {
                            title: "Address",
                            colCount: 2,
                            items: ["Country", "City", "Region"]
                        },
                        {
                            title: "Title",
                            items: ["Title"]
                        }
                    ]
                }
            ] }
        ),
        form = $testContainer.dxForm("instance");

    //act
    var tabItem = form.itemOption("Address"),
        innerTabItem = form.itemOption("Address.Country");

    form.itemOption("Dates.HireDate", "label", { text: "NEWLABEL" });

    //assert
    assert.deepEqual(tabItem, {
        title: "Address",
        colCount: 2,
        items: [{ dataField: "Country" }, { dataField: "City" }, { dataField: "Region" }]
    }, "Correct tab's item");

    assert.equal(innerTabItem.dataField, "Country", "corrected item received");

    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).eq(4).text(), "NEWLABEL:", "new label rendered");
});

function getID(form, dataField) {
    return "dx_" + form.option("formID") + "_" + dataField;
}

QUnit.test("Validate via validation rules", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem: function(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    //act
    form.validate();

    //assert
    assert.equal(form.$element().find(".dx-invalid").length, 2, "invalid editors count");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
});

QUnit.test("Validate with a custom validation group", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        validationGroup: "Custom validation group",
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem: function(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    //act
    form.validate();

    //assert
    assert.equal(form.$element().find(".dx-invalid").length, 2, "invalid editors count");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
});

QUnit.test("Validate form when several forms are rendered", function(assert) {
    //arrange
    var form1 = $("#form").dxForm({
            formData: {
                name: "",
                lastName: "Kyle",
                firstName: ""
            },
            customizeItem: function(item) {
                if(item.dataField !== "lastName") {
                    item.validationRules = [{ type: "required" }];
                }
            }
        }).dxForm("instance"),
        form2 = $("#form2").dxForm({
            formData: {
                name2: "",
                lastName2: "Man",
                firstName2: ""
            },
            customizeItem: function(item) {
                if(item.dataField !== "lastName") {
                    item.validationRules = [{ type: "required" }];
                }
            }
        }).dxForm("instance");

    //act
    form1.validate();

    //assert
    assert.equal(form1.$element().find(".dx-invalid").length, 2, "invalid editors count");
    assert.equal(form1.$element().find(".dx-invalid [id=" + getID(form1, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form1.$element().find(".dx-invalid [id=" + getID(form1, "firstName") + "]").length, 1, "invalid firstName editor");

    assert.equal(form2.$element().find(".dx-invalid").length, 0, "invalid editors count");
    assert.equal(form2.$element().find(".dx-invalid [id=" + getID(form2, "name2") + "]").length, 0, "invalid name editor");
    assert.equal(form2.$element().find(".dx-invalid [id=" + getID(form2, "firstName2") + "]").length, 0, "invalid firstName editor");
});

QUnit.test("Validate via 'isRequired' item option", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem: function(item) {
            if(item.dataField !== "lastName") {
                item.isRequired = true;
            }
            if(item.dataField === "name") {
                item.label = { text: "Middle name" };
            }
        }
    }).dxForm("instance");

    //act
    form.validate();

    //assert
    assert.equal(form.$element().find(".dx-invalid").length, 2, "invalid editors count");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(".dx-invalid-message").first().text(), "Middle name is required", "Message contains the custom label name of validated field by default");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
    assert.equal(form.$element().find(".dx-invalid-message").last().text(), "First Name is required", "Message contains the name of validated field by default if label isn't defined");
});

QUnit.test("Validate via validationRules when rules and 'isRequired' item option are both defined", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "Kyle",
            firstName: ""
        },
        customizeItem: function(item) {
            item.isRequired = true;
            item.validationRules = [{ type: 'stringLength', max: 3 }];
        }
    }).dxForm("instance");

    //act
    form.validate();

    //assert
    assert.equal(form.$element().find(".dx-invalid").length, 1, "invalid editors count");
    assert.equal(form.$element().find(".dx-invalid [id=" + getID(form, "lastName") + "]").length, 1, "invalid lastName editor");
});

QUnit.test("Reset validation summary when values are reset in form", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "",
            lastName: "",
            firstName: ""
        },
        showValidationSummary: true,
        customizeItem: function(item) {
            item.isRequired = true;
        }
    }).dxForm("instance");

    //act
    form.validate();
    form.resetValues();

    //assert
    assert.equal($(".dx-validationsummary-item").length, 0, "validation summary items");
});

QUnit.test("Changing an editor options of an any item does not invalidate whole form (T311892)", function(assert) {
    //arrange
    var form = $("#form").dxForm({
            formData: {
                lastName: "Kyle",
                firstName: "John"
            },
            items: [
                { dataField: "firstName", editorType: "dxTextBox", editorOption: { width: 100, height: 20 } },
                { dataField: "lastName", editorType: "dxTextBox", editorOption: { width: 100, height: 20 } }
            ]
        }).dxForm("instance"),
        formInvalidateSpy = sinon.spy(form, "_invalidate");

    //act
    form.option("items[1].editorOptions", { width: 80, height: 40 });

    //assert
    var secondEditor = $("#form .dx-textbox").last().dxTextBox("instance");

    assert.deepEqual(form.option("items[1].editorOptions"), { width: 80, height: 40 }, "correct editor options");
    assert.equal(formInvalidateSpy.callCount, 0, "Invalidate does not called");

    assert.equal(secondEditor.option("width"), 80, "Correct width");
    assert.equal(secondEditor.option("height"), 40, "Correct height");
});

QUnit.test("Changing editorOptions of subitem change editor options (T316522)", function(assert) {
    //arrange
    var form = $("#form").dxForm({
        formData: {
            lastName: "Kyle",
            firstName: "John"
        },
        items: [
            {
                itemType: "group", items: [
                    {
                        itemType: "group", items: [
                                { dataField: "firstName", editorType: "dxTextBox", editorOptions: { width: 100, height: 20 } },
                                { dataField: "lastName", editorType: "dxTextBox", editorOptions: { width: 100, height: 20 } }
                        ]
                    }
                ]
            }
        ]
    }).dxForm("instance");

    //act
    form.option("items[0].items[0].items[1].editorOptions", { width: 80, height: 40 });

    //assert
    var secondEditor = $("#form .dx-textbox").last().dxTextBox("instance");

    assert.equal(secondEditor.option("width"), 80, "Correct width");
    assert.equal(secondEditor.option("height"), 40, "Correct height");
});

QUnit.test("Reset editor's value", function(assert) {
        //arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            lastName: "Test Last Name",
            room: 1,
            isDeveloper: true
        },
        items: ["name", "lastName", "room", "isDeveloper"]
    }).dxForm("instance");

        //act
    form.resetValues();

        //assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("lastName").option("value"), "", "editor for the lastName dataField");
    assert.equal(form.getEditor("room").option("value"), "", "editor for the room dataField");
    assert.equal(form.getEditor("isDeveloper").option("value"), undefined, "editor for the isDeveloper dataField");
});

QUnit.module("Adaptivity");

QUnit.test("One column screen should be customizable with screenByWidth option on init", function(assert) {
        //arrange
    var $form = $("#form");

    $form.dxForm({
        formData: {
            name: "User",
            lastName: "Test Last Name",
            room: 1,
            isDeveloper: true
        },
        colCount: 2,
        screenByWidth: function() { return "xs"; },
        items: ["name", "lastName", "room", "isDeveloper"]
    });

        //assert
    assert.equal($form.find(".dx-layout-manager-one-col").length, 1, "single column screen was changed");
    assert.equal($form.find(".dx-single-column-item-content").length, 4, "There are 4 items in the column");
});

QUnit.test("One column screen should be customizable with screenByWidth option on option change", function(assert) {
        //arrange
    var $form = $("#form"),
        form = $form.dxForm({
            formData: {
                name: "User",
                lastName: "Test Last Name",
                room: 1,
                isDeveloper: true
            },
            colCount: 2,
            screenByWidth: function() { return "md"; },
            items: ["name", "lastName", "room", "isDeveloper"]
        }).dxForm("instance");


    assert.equal($form.find(".dx-single-column-item-content").length, 0, "There are no single column items");

    //act
    form.option("screenByWidth", function() { return "xs"; });

    //assert
    assert.equal($form.find(".dx-single-column-item-content").length, 4, "There are 4 items in the column");
    assert.equal($form.find(".dx-layout-manager-one-col").length, 1, "single column screen was changed");
});

QUnit.test("Column count may depend on screen factor", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md";

    $form.dxForm({
        formData: {
            name: "User",
            lastName: "Test Last Name",
            room: 1,
            isDeveloper: true
        },
        colCountByScreen: {
            sm: 1,
            md: 2
        },
        screenByWidth: function() { return screen; },
        items: ["name", "lastName", "room", "isDeveloper"]
    });

    assert.equal($form.find(".dx-first-col.dx-last-col").length, 0, "more than one column exists");

    //act
    screen = "sm";
    resizeCallbacks.fire();

    //assert
    assert.equal($form.find(".dx-first-col.dx-last-col").length, 4, "only one column exists");
});

QUnit.test("Form should repaint once when screen factor changed", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md",
        form = $form.dxForm({
            formData: {
                name: "User",
                lastName: "Test Last Name",
                room: 1,
                isDeveloper: true
            },
            colCountByScreen: {
                sm: 1,
                md: 2
            },
            screenByWidth: function() { return screen; },
            items: ["name", "lastName", "sex", "room", "isDeveloper"]
        }).dxForm("instance"),
        refreshStub = sinon.stub(form, "_refresh");

    //act
    screen = "sm";
    resizeCallbacks.fire();
    resizeCallbacks.fire();

    //assert
    assert.equal(refreshStub.callCount, 1, "refresh called once");
});

QUnit.test("Form doesn't redraw layout when colCount doesn't changed", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md",
        form = $form.dxForm({
            screenByWidth: function() {
                return screen;
            },
            items: [{
                name: "test",
                editorType: "dxTextBox",
                editorOptions: {
                    value: "Test"
                }
            }]
        }).dxForm("instance");

    //act
    form.getEditor("test").option("value", "Changed");
    screen = "sm";
    resizeCallbacks.fire();

    //assert
    assert.equal(form.getEditor("test").option("value"), "Changed", "Editor keeps old value");
});

QUnit.test("Form doesn't redraw layout when colCount doesn't changed and colCountByScreen option defined", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md",
        form = $form.dxForm({
            screenByWidth: function() {
                return screen;
            },
            colCountByScreen: {
                sm: 2,
                md: 2
            },
            items: [{
                name: "test",
                editorType: "dxTextBox",
                editorOptions: {
                    value: "Test"
                }
            }]
        }).dxForm("instance");

    //act
    form.getEditor("test").option("value", "Changed");
    screen = "sm";
    resizeCallbacks.fire();

    //assert
    assert.equal(form.getEditor("test").option("value"), "Changed", "Editor keeps old value");
});

QUnit.test("Form is not redrawn when colCount doesn't change ('colCount' and 'colCountByScreen' options are defined)", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md",
        initCount = 0;

    $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCount: 1, //xs and lg screens have an equal colCount
        colCountByScreen: {
            sm: 2,
            md: 2
        },
        items: [{
            name: "test",
            editorType: "dxTextBox",
            editorOptions: {
                onInitialized: function() {
                    initCount++;
                }
            }
        }]
    });

    //act, assert
    assert.equal(initCount, 1, "Editor is initialized");

    screen = "sm";
    resizeCallbacks.fire();

    assert.equal(initCount, 1, "colCount doesn't changed, editor doesn't rerender");

    screen = "lg";
    resizeCallbacks.fire();
    assert.equal(initCount, 2, "colCount is changed, editor is rerender");

    screen = "xs";
    resizeCallbacks.fire();
    assert.equal(initCount, 2, "colCount doesn't changed, editor doesn't rerender");
});

QUnit.test("Column count for group may depend on screen factor", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md";

    $form.dxForm({
        formData: {
            name: "User",
            lastName: "Test Last Name",
            gender: "Male",
            room: 1,
            isDeveloper: true
        },
        screenByWidth: function() { return screen; },
        items: [{
            itemType: "group",
            caption: "Group 1",
            colCount: 1,
            colCountByScreen: {
                sm: 2,
                md: 3
            },
            items: ["name", "lastName"]
        },
        {
            itemType: "group",
            caption: "Group 2",
            colCount: 2,
            colCountByScreen: {
                sm: 4,
                md: 1
            },
            items: ["sex", "room", "isDeveloper"]
        }]
    });


    assert.equal($form.find(".dx-group-colcount-3").length, 1, "first group should have 3 columns");
    assert.equal($form.find(".dx-group-colcount-1").length, 1, "second group should have 1 column");

    //act
    screen = "sm";
    resizeCallbacks.fire();

    //assert
    assert.equal($form.find(".dx-group-colcount-2").length, 1, "first group should have 2 columns");
    assert.equal($form.find(".dx-group-colcount-4").length, 1, "second group should have 4 columns");
});

QUnit.test("Column count for tabs may depend on screen factor", function(assert) {
    //arrange
    var $form = $("#form"),
        screen = "md";

    $form.dxForm({
        formData: {
            name: "User",
            lastName: "Test",
            gender: "Male",
            room: 1,
            isDeveloper: true
        },
        screenByWidth: function() { return screen; },
        items: [{
            itemType: "tabbed",
            caption: "Group 1",
            colCount: 1,
            tabs: [{
                colCountByScreen: { sm: 2, md: 3 },
                items: ["name", "lastName", "gender", "room", "isDeveloper"]
            }]
        }]
    });


    assert.equal($form.find(".dx-field-item-tab.dx-col-2").length, 1, "tab has 3 groups on md screen");

    //act
    screen = "sm";
    resizeCallbacks.fire();

    //assert
    assert.notOk($form.find(".dx-field-item-tab.dx-col-2").length, "tab has not 3 groups on sm screen");
    assert.ok($form.find(".dx-field-item-tab.dx-col-1").length, "tab has 2 groups on sm screen");
});

QUnit.test("Cached colCount options doesn't leak", function(assert) {
    //arrange
    var $form = $("#form"),
        instance;

    instance = $form.dxForm({
        formData: {
            name: "User",
            lastName: "Test Last Name"
        },
        colCount: 2,
        items: [{
            itemType: "group",
            caption: "Group 1",
            colCount: 1,
            colCountByScreen: {
                sm: 2,
                md: 3
            },
            items: ["name", "lastName"]
        }]
    }).dxForm("instance");


    assert.equal(instance._cachedColCountOptions.length, 2, "root + group item colCount options cached");

    //act
    instance.option("items", ["name"]);

    //assert
    assert.equal(instance._cachedColCountOptions.length, 1, "only root colCount options cached");
});

QUnit.test("Form refreshes only one time on dimension changed with group layout", function(assert) {
    //arrange
    var $form = $("#form").width(300),
        screen = "md",
        form = $form.dxForm({
            screenByWidth: function() {
                return screen;
            },
            colCount: "auto",
            minColWidth: 100,
            items: [{
                name: "test1",
                editorType: "dxTextBox"
            }, {
                itemType: "group",
                caption: "Test group",
                colCount: "auto",
                minColWidth: 200,
                items: [
                    { name: "test2", editorType: "dxTextBox" },
                    { name: "test3", editorType: "dxTextBox" }
                ]
            }]
        }).dxForm("instance");

    var refreshSpy = sinon.spy(form, "_refresh");

    //act
    $form.width(100);
    resizeCallbacks.fire();
    //assert
    assert.equal(refreshSpy.callCount, 1, "form has been redraw layout one time");
});

QUnit.test("Form redraw layout when colCount is 'auto' and an calculated colCount changed", function(assert) {
    //arrange
    var $form = $("#form").width(300),
        screen = "md",
        form = $form.dxForm({
            screenByWidth: function() {
                return screen;
            },
            colCount: "auto",
            minColWidth: 100,
            items: [{
                name: "test1",
                editorType: "dxTextBox"
            }, {
                name: "test2",
                editorType: "dxTextBox"
            }]
        }).dxForm("instance");

    var refreshSpy = sinon.spy(form, "_refresh");

    //act
    $form.width(100);
    resizeCallbacks.fire();

    //assert
    assert.equal(refreshSpy.callCount, 1, "form has been redraw layout");
});
