import $ from "jquery";
import resizeCallbacks from "core/utils/resize_callbacks";
import responsiveBoxScreenMock from "../../helpers/responsiveBoxScreenMock.js";
import typeUtils from "core/utils/type";
import browser from "core/utils/browser";
import domUtils from "core/utils/dom";
import { __internals as internals } from "ui/form/ui.form";
import themes from "ui/themes";
import device from "core/devices";
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';
import domAdapter from "core/dom_adapter";

import "ui/text_area";
import "ui/autocomplete";
import "ui/calendar";
import "ui/date_box";
import "ui/drop_down_box";
import "ui/html_editor";
import "ui/lookup";
import "ui/radio_group";
import "ui/tag_box";

import "common.css!";
import "generic_light.css!";

const INVALID_CLASS = "dx-invalid";
const FORM_GROUP_CONTENT_CLASS = "dx-form-group-content";
const MULTIVIEW_ITEM_CONTENT_CLASS = "dx-multiview-item-content";
const FORM_LAYOUT_MANAGER_CLASS = "dx-layout-manager";

QUnit.testStart(function() {
    const markup =
        '<div id="form"></div>\
        <div id="form2"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Form");

if(device.current().deviceType === "desktop") {
    const items = [
        { dataField: "name", editorType: "dxTextBox" },
        { dataField: "age", editorType: "dxNumberBox" }
    ];

    items.forEach((item) => {
        registerKeyHandlerTestHelper.runTests({
            createWidget: ($element) => $element.dxForm({ items: items }).dxForm("instance"),
            keyPressTargetElement: (widget) => widget.getEditor(item.dataField).$element().find(".dx-texteditor-input"),
            checkInitialize: false,
            testNamePrefix: `Form -> ${item.editorType}:`
        });
    });
}

QUnit.testInActiveWindow("Form's inputs saves value on refresh", function(assert) {
    // arrange, act
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

    // assert
    var formData = $formContainer.dxForm("instance").option("formData");

    assert.deepEqual(formData, { name: "test" }, "value updates");
});

QUnit.test("Check field  wodth on render form with colspan", function(assert) {
    // arrange, act
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

    // assert
    assert.equal($fieldItems.length, 5, "4 simple items + 1 group item");
    assert.equal(fieldWidths.ID, fieldWidths.HireDate, "fields with colspan 2 have the same width");
    assert.equal(fieldWidths.FirstName, fieldWidths.LastName, "fields without colspan have the same width");
    assert.ok(fieldWidths.ID > fieldWidths.FirstName, "field with colspan 2 is wider than field without colspan");
});

QUnit.test("Change of the formData field change value of the editor", function(assert) {
    // arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { FamousPirate: "John Morgan" }
    });

    var formInstance = $testContainer.dxForm("instance");

    // act
    formInstance.option("formData.FamousPirate", "Cpt. Jack Sparrow");

    // assert
    assert.equal(formInstance.getEditor("FamousPirate").option("value"), "Cpt. Jack Sparrow", "Correct value");
});

QUnit.test("Change editor value after formOption is changed and items is defined", function(assert) {
    // arrange
    var $testContainer = $("#form"),
        form;

    form = $testContainer.dxForm({
        formData: { pirateName: "Blackbeard", type: "captain", isSought: true },
        items: ["pirateName", "type", "isSought"]
    }).dxForm("instance");

    // act
    form.option("formData", {
        pirateName: "John Morgan",
        type: "captain",
        isSought: true
    });

    form.getEditor("isSought").option("value", false);
    // assert
    assert.deepEqual(form.option("formData"), {
        pirateName: "John Morgan",
        type: "captain",
        isSought: false
    }, "FormData is up to date");
});

QUnit.test("Reset editor value after formData changing only if dataField is defined", function(assert) {
    // arrange
    var $testContainer = $("#form"),
        form;

    form = $testContainer.dxForm({
        formData: { pirateName: "Blackbeard", type: "captain", isSought: "Test", gender: "Male" },
        items: [{ dataField: "gender" }, { dataField: "pirateName" }, { dataField: "type" }, { name: "isSought", editorType: "dxTextBox" }]
    }).dxForm("instance");

    // act
    form.getEditor("isSought").option("value", "Changed");
    form.getEditor("gender").option("value", "Female");

    form.option("formData", {
        pirateName: "John Morgan",
        type: "captain"
    });

    // assert
    assert.equal(form.getEditor("isSought").option("value"), "Changed", "'isSought' editor wasn't reseted");
    assert.equal(form.getEditor("gender").option("value"), "", "'gender' editor was reseted");
});

QUnit.test("Invalid field name when item is defined not as string and not as object", function(assert) {
    // arrange, act
    var form = $("#form").dxForm({
        formData: { name: "Batman", lastName: "Klark" },
        items: [1, "lastName"]
    }).dxForm("instance");

    // assert
    assert.equal(form.$element().find("." + internals.FIELD_ITEM_CLASS).length, 1, "items count");
    assert.equal(form.getEditor("name"), undefined, "editor by name field");
    assert.equal(form.getEditor("lastName").option("value"), "Klark", "editor by lastName field");
});

QUnit.test("dxshown event fire when visible option changed to true", function(assert) {
    // arrange
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

    // act, assert
    form.option("visible", false);
    assert.equal(dxShownEventCounter, 0, "dxshown event does not fire");

    form.option("visible", true);
    assert.equal(dxShownEventCounter, 1, "dxshown event fired");
});

QUnit.test("Reset editor's value when the formData option is empty object", function(assert) {
    // arrange
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

    // act
    form.option("formData", {});

    // assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), null, "editor for the room dataField");

    assert.deepEqual(values[0], { dataField: "name", value: "" }, "value of name dataField");
    assert.deepEqual(values[1], { dataField: "room", value: null }, "value of room dataField");

    values = [];
    form.option("formData", {});

    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), null, "editor for the room dataField");
    assert.equal(values.length, 0, "onFieldDataChanged event is not called if the empty object is set to formData a second time");
});

QUnit.test("Reset editor's value when the formData option is null", function(assert) {
    // arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            room: 1
        },
        items: ["name", "room"]
    }).dxForm("instance");

    // act
    form.option("formData", null);

    // assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), null, "editor for the room dataField");
});

QUnit.test("Reset editor's value when the formData option is undefined", function(assert) {
    // arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            room: 1
        },
        items: ["name", "room"]
    }).dxForm("instance");

    // act
    form.option("formData", undefined);

    // assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("room").option("value"), null, "editor for the room dataField");
});

QUnit.test("Reset editor's value with validation", function(assert) {
    // arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            lastName: "John"
        },
        items: ["name", { dataField: "lastName", isRequired: true }]
    }).dxForm("instance");

    // act
    form.option("formData", undefined);

    // assert
    assert.equal(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.equal(form.getEditor("lastName").option("value"), "", "editor for the lastName dataField");

    assert.ok(!form.getEditor("lastName").$element().hasClass(INVALID_CLASS), "not invalid css class");
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
    // arrange, act
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

    // assert
    assert.equal(refreshStub.callCount, expectedRefreshCount, "Refresh on visibility changed to 'true' if browser is IE or Edge");
    refreshStub.restore();
});

QUnit.test("Hide helper text when validation message shows for material theme", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    var form = $("#form").dxForm({
        formData: {
            name: "User",
            lastName: ""
        },
        items: [
            { dataField: "name", helpText: "First name field" },
            { dataField: "lastName", isRequired: true, helpText: "Last name field" }
        ]
    }).dxForm("instance");

    var lastName = form.getEditor("lastName"),
        firstName = form.getEditor("name");

    var isFieldWrapperInvalid = function(editor) {
        return editor.$element().parents(".dx-field-item-content-wrapper").hasClass(INVALID_CLASS);
    };

    lastName.focus();
    form.validate();

    triggerKeyUp(lastName.$element(), "Enter");
    assert.ok(isFieldWrapperInvalid(lastName), "invalid css class");

    firstName.focus();

    lastName.focus();
    assert.ok(isFieldWrapperInvalid(lastName), "invalid css class");

    firstName.focus();
    assert.ok(!isFieldWrapperInvalid(lastName), "not invalid css class");
    assert.ok(!isFieldWrapperInvalid(firstName), "not invalid css class");

    themes.isMaterial = origIsMaterial;

});

QUnit.test("The formData is updated correctly when formData has 'undefined' value", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            formData: undefined,
            items: [{ dataField: "City" }]
        }),
        form = $testContainer.dxForm("instance");

    // act
    var editor = form.getEditor("City");
    editor.option("value", "New York");

    // assert
    var formData = form.option("formData");
    assert.deepEqual(formData, { City: "New York" }, "updated formData");
    assert.equal($testContainer.find(".dx-field-item").length, 1, "form item is rendered");
});

QUnit.test("The formData with composite object is updated correctly when formData has 'undefined' value", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            formData: undefined,
            items: [{ dataField: "Employee.City" }]
        }),
        form = $testContainer.dxForm("instance");

    // act
    var editor = form.getEditor("Employee.City");
    editor.option("value", "New York");

    // assert
    var formData = form.option("formData");
    assert.deepEqual(formData, { Employee: { City: "New York" } }, "formData is updated");
    assert.equal($testContainer.find(".dx-field-item").length, 1, "form item is rendered");
});

QUnit.test("From renders the right types of editors by default", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
        formData: { id: 1, name: "Name" }
    });

    // assert
    assert.ok($testContainer.find(".dx-field-item .dx-numberbox").hasClass("dx-editor-outlined"), "right class rendered");
    assert.ok($testContainer.find(".dx-field-item .dx-textbox").hasClass("dx-editor-outlined"), "right class rendered");
});

QUnit.test("From renders the right types of editors according to stylingMode option", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
        formData: { id: 1, name: "Name" },
        stylingMode: "underlined"
    });

    // assert
    assert.ok($testContainer.find(".dx-field-item .dx-numberbox").hasClass("dx-editor-underlined"), "right class rendered");
    assert.ok($testContainer.find(".dx-field-item .dx-textbox").hasClass("dx-editor-underlined"), "right class rendered");
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
QUnit.test("items aren't tiny", function(assert) {
    // arrange, act
    let testContainer = $("#form");

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
    // assert
    assert.ok(testContainer.find(".dx-multiview-item .dx-textbox").first().width() / testContainer.width() > 0.5, "Editors are not tiny");
});

QUnit.test("Render tabs when formData is changed", function(assert) {
    // arrange, act
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

    // act
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

    // assert
    $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);
    assert.equal($groups.length, 2);
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 1");
    assert.equal($groups.eq(1).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 2");

    // act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();
    $groups = testContainer.find(".dx-item-selected " + "." + internals.FORM_GROUP_CLASS);

    // assert
    assert.equal($groups.length, 1);
    assert.equal($groups.eq(0).find("." + internals.FIELD_ITEM_CLASS).length, 2, "group 1");
});

QUnit.test("Check align labels", function(assert) {
    // arrange, act
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

    // assert
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

    // act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();

    // assert
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
    // arrange, act
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

    // assert
    $layoutManager = $layoutManagers.eq(1);
    $labelsContent = $layoutManager.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, "Address house:");
    for(i = 0; i < 4; i++) {
        labelContentWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelContentWidth, labelWidth, 1, "tab 1, item " + i);
    }

    // act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();

    // assert
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
    // arrange
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

    // act
    this.updateScreenSize(500);

    // assert
    $layoutManager = $layoutManagers.eq(1);
    $labelsContent = $layoutManager.find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, "Address house:");
    for(i = 0; i < 4; i++) {
        labelContentWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelContentWidth, labelWidth, 1, "tab 1, item " + i);
    }

    // act
    testContainer.find(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", 1);
    this.clock.tick();

    // assert
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
    // arrange
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

    // act
    form.updateData("firstName", "Test First Name");

    // assert
    assert.equal(form.getEditor("firstName").option("value"), "Test First Name", "value of editor by 'firstName' field");
});

QUnit.test("Update editorOptions of an editor inside the tab", function(assert) {
    // arrange
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

    // act
    form.option("items[0].tabs[0].items[0].editorOptions.disabled", false);

    // assert
    assert.equal(form.getEditor("firstName").option("disabled"), false, "'disabled' option was successfully changed");
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
    // arrange, act
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

    // assert
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
    // arrange, act
    var testContainer = $("#form"),
        form = testContainer.dxForm({
            formData: { TestBool: true, ShipName: "Test" }
        }).dxForm("instance");

    var $col1 = $(".dx-col-0"),
        $maxLabelWidth = getLabelWidth(testContainer, form, "Ship Name:"),
        i;

    // assert
    for(i = 0; i < 2; i++) {
        var labelWidth = $col1.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col0 item " + i);
    }
});

QUnit.test("Disable alignItemLabels", function(assert) {
    // arrange, act
    var testContainer = $("#form");

    testContainer.dxForm({
        formData: { TestBool: true, ShipName: "Test" },
        alignItemLabels: false
    }).dxForm("instance");

    var $labelTexts = $("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);

    // assert
    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width());
});

QUnit.test("Disable alignItemLabels in group", function(assert) {
    // arrange, act
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

    // assert
    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), "group 1");

    $labelTexts = $groups.eq(1).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS);
    assert.equal($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), "group 2");
});

QUnit.test("Align labels in column when alignItemLabelsInAllGroups is enabled", function(assert) {
    // arrange, act
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

    // assert
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
    // arrange, act
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

    // assert
    $groups = form._getGroupElementsInColumn(testContainer, 0);
    assert.notEqual(findLabelTextsInColumn($groups.eq(0), 0).eq(0).width(), findLabelTextsInColumn($groups.eq(1), 0).eq(0).width(), "compare group1 with group2");

    $groups = form._getGroupElementsInColumn(testContainer, 1);
    assert.notEqual(findLabelTextsInColumn($groups.eq(0), 0).eq(0).width(), findLabelTextsInColumn($groups.eq(1), 0).eq(0).width(), "compare group1 with group2");
});

QUnit.test("Align labels in columns when there are rows", function(assert) {
    // arrange, act
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
        $maxLabelWidth = getLabelWidth(testContainer, form, "Field three:"),
        i,
        labelWidth;

    // assert
    for(i = 0; i < 2; i++) {
        labelWidth = $col1.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col0 item " + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, "Field four:");
    for(i = 0; i < 2; i++) {
        labelWidth = $col2.eq(i).find("." + internals.FIELD_ITEM_LABEL_CONTENT_CLASS).first().width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "col2 item " + i);
    }
});

QUnit.test("Change option after group rendered (check for cycling template render)", function(assert) {
    // arrange
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

    // act
    $formContainer.dxForm("instance").option("colCount", 4);

    $fieldItemWidgets = $formContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS);

    // assert
    assert.equal($fieldItemWidgets.length, 3, "Correct number of a widgets");
});

QUnit.test("Align labels when layout is changed in responsive box_T306106", function(assert) {
    // arrange
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

    // act
    this.updateScreenSize(500);

    // assert
    for(i = 0; i < 11; i++) {
        var labelWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "item " + i);
    }

    assert.equal($("." + internals.HIDDEN_LABEL_CLASS).length, 0, "hidden labels count");
});

QUnit.test("Align labels when layout is changed when small window size by default_T306106", function(assert) {
    // arrange
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

    // assert
    for(i = 0; i < 11; i++) {
        var labelWidth = $labelsContent.eq(i).width();

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, "item " + i);
    }

    assert.equal($("." + internals.HIDDEN_LABEL_CLASS).length, 0, "hidden labels count");
});

QUnit.test("Labels are not aligned when labelLocation is top", function(assert) {
    $("#form").dxForm({
        labelLocation: "top",
        formData: {
            dataField: "Data field",
            bigDataField: "Big Data field"
        },
    }).dxForm("instance");

    const $labelTexts = $(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width());
});

QUnit.test("Labels are not aligned when labelLocation is top with the groups", function(assert) {
    $("#form").dxForm({
        labelLocation: "top",
        formData: {
            isActive: true,
            ShipName: "Test",
            Name: "John",
            LastName: "Smith"
        },
        items: [
            {
                itemType: "group",
                items: ["isActive", "ShipName"]
            },
            {
                itemType: "group",
                items: ["Name", "LastName"]
            }
        ]
    }).dxForm("instance");

    const $groups = $(`.${internals.FORM_GROUP_CLASS}`);
    let $labelTexts = $groups.eq(0).find(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`);

    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), "group 1");

    $labelTexts = $groups.eq(1).find(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    assert.notEqual($labelTexts.eq(0).width(), $labelTexts.eq(1).width(), "group 2");
});

QUnit.test("required mark aligned", (assert) => {
    let $testContainer = $("#form").dxForm({
        requiredMark: "!",
        items: [{
            dataField: "name",
            isRequired: true
        }]
    });

    let $labelsContent = $testContainer.find(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`),
        $requiredLabel = $labelsContent.find(`.${internals.FIELD_ITEM_LABEL_TEXT_CLASS}`),
        $requiredMark = $labelsContent.find(`.${internals.FIELD_ITEM_REQUIRED_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.roughEqual($labelsContent.offset().left + $requiredLabel.width(), $requiredMark.offset().left, 0.5, "position of requared mark is right");
    assert.ok($requiredLabel.position().left < $requiredMark.position().left, "required mark should be after of the text");
});

QUnit.test("optional mark aligned", (assert) => {
    let $testContainer = $("#form").dxForm({
        optionalMark: "optMark",
        showOptionalMark: true,
        items: ["position"]
    });

    let $labelsContent = $testContainer.find(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`),
        $optionalLabel = $labelsContent.find(`.${internals.FIELD_ITEM_LABEL_TEXT_CLASS}`),
        $optionalMark = $labelsContent.find(`.${internals.FIELD_ITEM_OPTIONAL_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.roughEqual($labelsContent.offset().left + $optionalLabel.width(), $optionalMark.offset().left, 0.5, "position of optional mark is right");
    assert.ok($optionalLabel.position().left < $optionalMark.position().left, "optional mark should be after of the text");
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
    // arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { test1: "abc", test2: "xyz" }
    });

    // act
    var form = $testContainer.dxForm("instance");

    form.updateData("test2", "qwerty");

    // assert
    assert.equal(form.option("formData.test2"), "qwerty", "Correct data");
});

QUnit.test("UpdateData, update with object", function(assert) {
    // arrange
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

    // act
    var form = $testContainer.dxForm("instance");

    form.updateData({
        test1: "xyz", test2: "qwerty", test3: {
            SuperMan: "KAndrew",
            Specialization: {
                good: false
            }
        }
    });

    // assert
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

QUnit.test("Get button instance", function(assert) {
    var form = $("#form").dxForm({
        items: [{
            itemType: "button",
            name: "button1",
            buttonOptions: { text: "button1" }
        }, {
            itemType: "group",
            items: [{
                itemType: "button",
                name: "button2",
                buttonOptions: { text: "button2" }
            }]
        }, {
            itemType: "button",
            buttonOptions: { text: "button3" }
        }]
    }).dxForm("instance");

    var formInvalidateSpy = sinon.spy(form, "_invalidate");

    assert.strictEqual(form.getButton("button1").option("text"), "button1");
    assert.strictEqual(form.getButton("button2").option("text"), "button2");
    assert.strictEqual(form.getButton("button3"), undefined);

    form.option("items[1].items[0].buttonOptions.text", "changed_button_text");

    assert.strictEqual(form.getButton("button2").option("text"), "changed_button_text");
    assert.strictEqual(formInvalidateSpy.callCount, 0, "Invalidate does not called");
});

QUnit.testInActiveWindow("Change 'Button.icon'", function(assert) {
    ["option", "itemOption", "editor.option"].forEach(function(setOptionWay) {
        var form = $("#form").dxForm({
            items: [{
                itemType: "button",
                name: "button1",
                buttonOptions: { icon: "icon1" }
            }]
        }).dxForm("instance");

        if(device.real().deviceType === "desktop") {
            $("#form").find(".dx-button").focus();
            assert.ok($("#form").find(".dx-button").is(":focus"), "initial focus");
        }

        switch(setOptionWay) {
            case "option":
                form.option("items[0].buttonOptions.icon", "icon2");
                break;
            case "itemOption": {
                const buttonOptions = form.itemOption("button1").buttonOptions;
                buttonOptions.icon = "icon2";
                form.itemOption("button1", "buttonOptions", buttonOptions);
                break;
            }
            case "editor.option":
                form.getButton("button1").option("icon", "icon2");
                break;
        }

        assert.strictEqual(form.getButton("button1").option("icon"), "icon2");
        if(device.real().deviceType === "desktop") {
            assert.ok($("#form").find(".dx-button").is(":focus"), "final focus");
        }
    });
});

QUnit.test("Get editor instance", function(assert) {
    // arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        formData: { test1: "abc", test2: "xyz" },
        items: ["test1", { name: "test3", editorType: "dxNumberBox" }]
    });

    // act
    var form = $testContainer.dxForm("instance");

    // assert
    assert.ok(!typeUtils.isDefined(form.getEditor("test2")), "We hasn't instance for 'test2' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test1")), "We have instance for 'test1' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test3")), "We have instance for 'test3' field");

    assert.equal(form.getEditor("test1").NAME, "dxTextBox", "It's textbox");
    assert.equal(form.getEditor("test3").NAME, "dxNumberBox", "It's numberBox");
});

QUnit.test("Get editor instance with group config", function(assert) {
    // arrange
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

    // act
    var form = $testContainer.dxForm("instance");

    // assert
    assert.ok(typeUtils.isDefined(form.getEditor("test1")), "We have instance for 'test1' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test2")), "We have instance for 'test2' field");
    assert.ok(typeUtils.isDefined(form.getEditor("test3")), "We have instance for 'test3' field");

    assert.equal(form.getEditor("test2").NAME, "dxTextArea", "It's textArea");
    assert.equal(form.getEditor("test3").NAME, "dxTextBox", "It's textBox");
});

QUnit.test("UpdateDimensions", function(assert) {
    // arrange
    var $testContainer = $("#form");

    $testContainer.dxForm({
        height: 200,
        formData: { test1: "abc", test2: "xyz", test3: "123" },
        items: ["test1", "test2", "test3", {
            template: function() {
                return $("<div/>")
                    .attr("id", "testBlock")
                    .css({ height: 300, "backgroundColor": "red" });
            }
        }]
    });

    // act
    var form = $testContainer.dxForm("instance"),
        isSizeUpdated;

    $("#testBlock").hide();
    form.updateDimensions().done(function() {
        isSizeUpdated = true;
    });
    this.clock.tick();

    // assert
    assert.ok(isSizeUpdated);
});

function triggerKeyUp($element, key) {
    var e = $.Event("keyup");
    e.key = key;
    $($element.find("input").first()).trigger(e);
}

QUnit.test("Check component instance onEditorEnterKey", function(assert) {
    // arrange
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

    // act
    editor = form.getEditor("work");
    triggerKeyUp(editor.$element(), "Enter");

    // assert
    assert.notEqual(testArgs.component, undefined, "component");
    assert.notEqual(testArgs.element, undefined, "element");
    assert.notEqual(testArgs.event, undefined, "Event");
    assert.equal(testArgs.dataField, "work", "dataField");
    assert.equal(testArgs.component.NAME, "dxForm", "correct component");
});

QUnit.test("Use 'itemOption' with no items", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            height: 200,
            formData: { test1: "abc", test2: "xyz", test3: "123" }
        }),
        form = $testContainer.dxForm("instance");

    // act
    var testItem = form.itemOption("test2");

    form.itemOption("test3", "label", { text: "NEWLABEL" });

    // assert
    assert.deepEqual(testItem, { dataField: "test2" }, "corrected item received");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).last().text(), "NEWLABEL:", "new label rendered");
});

QUnit.test("Use 'itemOption' do not change the order of an items", function(assert) {
    // arrange
    const contentReadyStub = sinon.stub();
    const $testContainer = $("#form").dxForm({
        height: 200,
        formData: { ID: 1, FistName: "Alex", LastName: "Johnson", Address: "Alabama" },
        items: [
            "ID",
            { dataField: "FirstName" },
            { dataField: "LastName" },
            "Address"
        ]
    });
    const form = $testContainer.dxForm("instance");

    form.on("contentReady", contentReadyStub);

    // act
    form.itemOption("FirstName", {
        visible: true,
        label: {
            text: "Test Label"
        },
        editorOptions: {
            value: "",
            useMaskedValue: true,
            placeholder: "CNPJ",
            mask: "000.000.000-00"
        }
    });

    // assert
    assert.deepEqual(
        form.option("items"),
        [
            { dataField: "ID" },
            {
                dataField: "FirstName",
                visible: true,
                label: {
                    text: "Test Label"
                },
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

    assert.equal(contentReadyStub.callCount, 1, "the form renders once");
});

QUnit.test("Use 'itemOption' with groups", function(assert) {
    // arrange
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

    // act
    var unknownField = form.itemOption("FirstName"),
        firstGroup = form.itemOption("Personal"),
        secondGroup = form.itemOption("Personal.FullName"),
        innerOption = form.itemOption("Personal.FullName.FirstName");

    form.itemOption("Personal.Dates.HireDate", "label", { text: "NEWLABEL" });

    // assert
    assert.equal(unknownField, undefined, "corrected item received");
    assert.deepEqual({ itemType: firstGroup.itemType, caption: firstGroup.caption }, { itemType: "group", caption: "Personal" }, "corrected item received");
    assert.deepEqual({ itemType: secondGroup.itemType, caption: secondGroup.caption }, { itemType: "group", caption: "Full Name" }, "corrected item received");
    assert.equal(innerOption.dataField, "FirstName", "corrected item received");

    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).last().text(), "NEWLABEL:", "new label rendered");
});

QUnit.test("Use 'itemOption' with groups and one group has empty caption (T359214)", function(assert) {
    // arrange
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

    // act
    form.itemOption("TestGroup1.TestGroup2", "caption", "custom");

    // assert
    assert.equal($testContainer.find("." + internals.FORM_GROUP_CAPTION_CLASS).last().text(), "custom", "new caption rendered");
});

QUnit.test("Use 'itemOption' with tabs", function(assert) {
    // arrange
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

    // act
    var tabItem = form.itemOption("Address"),
        innerTabItem = form.itemOption("Address.Country");

    form.itemOption("Dates.HireDate", "label", { text: "NEWLABEL" });

    // assert
    assert.deepEqual(tabItem, {
        title: "Address",
        colCount: 2,
        items: [{ dataField: "Country" }, { dataField: "City" }, { dataField: "Region" }]
    }, "Correct tab's item");

    assert.equal(innerTabItem.dataField, "Country", "corrected item received");

    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).eq(4).text(), "NEWLABEL:", "new label rendered");
});

QUnit.test("'itemOption' should get an item with several spaces in the caption", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            formData: { EmployeeID: 1, LastName: "John", FirstName: "Dow" },
            items: [
                "EmployeeID",
                {
                    itemType: "group",
                    caption: "Test group item",
                    items: [
                        "FirstName", "LastName"
                    ]
                }
            ] }
        ),
        form = $testContainer.dxForm("instance");

    // act
    var groupItem = form.itemOption("Testgroupitem"),
        innerGroupItem = form.itemOption("Testgroupitem.FirstName");

    assert.deepEqual(groupItem, {
        itemType: "group",
        caption: "Test group item",
        items: [ { dataField: "FirstName" }, { dataField: "LastName" }]
    }, "Correct group item");

    form.itemOption("Testgroupitem.LastName", "label", { text: "NEWLABEL" });

    // assert
    assert.equal(innerGroupItem.dataField, "FirstName", "corrected item received");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).last().text(), "NEWLABEL:", "new label rendered");
});

QUnit.test("'itemOption' should get an item with several spaces in the caption and long path", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            formData: { EmployeeID: 1, LastName: "John", FirstName: "Dow" },
            items: [
                "EmployeeID",
                {
                    itemType: "group",
                    caption: "Test group 1",
                    items: [{
                        itemType: "group",
                        caption: "Test group 2",
                        items: ["FirstName", "LastName"]
                    }]
                }
            ] }
        ),
        form = $testContainer.dxForm("instance");

    // act
    var innerGroupItem = form.itemOption("Testgroup1.Testgroup2.FirstName");

    // assert
    assert.deepEqual(innerGroupItem, { dataField: "FirstName" }, "corrected item received");
});

QUnit.test("'itemOption' should get an group inner item located into tabbed item", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            formData: { EmployeeID: 1, LastName: "John", FirstName: "Dow" },
            items: [
                {
                    itemType: "tabbed",
                    tabs: [{
                        title: "Test Tab 1",
                        items: ["EmployeeID"]
                    }, {
                        title: "Test Tab 2",
                        items: [{
                            itemType: "group",
                            caption: "Test Group 1",
                            items: ["FirstName", "LastName"]
                        }]
                    }]
                }]
        }),
        form = $testContainer.dxForm("instance");

    // act
    var innerGroupItem = form.itemOption("TestTab2.TestGroup1.FirstName");

    // assert
    assert.deepEqual(innerGroupItem, { dataField: "FirstName" }, "corrected item received");
});

QUnit.test("'itemOption' should get item by composite path use the name option", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
            formData: {
                LastName: "Last Name"
            },
            items: [{
                itemType: "group",
                caption: "My Custom Group",
                name: "testGroup",
                items: [{
                    itemType: "tabbed",
                    tabs: [{
                        title: "My Custom Tab",
                        name: "tab1",
                        items: [{
                            name: "simpleItem",
                            dataField: "LastName"
                        }]
                    }]
                }]
            }]
        }),
        form = $testContainer.dxForm("instance");

    // act
    var item = form.itemOption("testGroup.tab1.simpleItem");

    // assert
    assert.deepEqual(item.dataField, "LastName", "data field of item");
});

QUnit.test("'itemOption' should get a group item by the name option", function(assert) {
    // arrange
    var $testContainer = $("#form").dxForm({
        formData: {
            LastName: "Last Name"
        },
        items: [{
            itemType: "group",
            name: "testGroup",
            items: [{
                name: "simpleItem",
                dataField: "LastName"
            }]
        }]
    });

    // act
    var item = $testContainer.dxForm("instance").itemOption("testGroup");

    // assert
    assert.ok(!!item, "get a group item");
    assert.equal(item.itemType, "group", "It's a group item");
    assert.deepEqual(item.items, [{
        name: "simpleItem",
        dataField: "LastName"
    }], "has correct items");
});

QUnit.test("The exception is not thrown when option of an unknown item is changed", function(assert) {
    const form = $("#form").dxForm({
        formData: {
            name: "Name"
        }
    }).dxForm("instance");

    form.itemOption("lastName", "cssClass", "custom-class");

    assert.equal(form.$element().find(".custom-class").length, 0, "custom css class is not found");
});

[false, true].forEach(useItemOption => {
    const optionWay = useItemOption ? "itemOption" : "option";
    QUnit.test(`Changing an editor/button options without re-render Form when use the ${optionWay} method (T311892, T681241)`, function(assert) {
        // arrange
        const form = $("#form").dxForm({
            formData: {
                lastName: "Kyle",
                firstName: "John"
            },
            items: [
                { dataField: "firstName", editorType: "dxTextBox", editorOption: { width: 100, height: 20 } },
                { dataField: "lastName", editorType: "dxTextBox", editorOption: { width: 100, height: 20 } },
                { name: "button", itemType: "button", buttonOptions: { width: 100, height: 20 } }
            ]
        }).dxForm("instance");

        const formInvalidateSpy = sinon.spy(form, "_invalidate");
        const editorOptions = { width: 80, height: 40 };
        const buttonOptions = { width: 10, height: 20 };

        // act
        if(useItemOption) {
            form.itemOption("lastName", "editorOptions", editorOptions);
            form.itemOption("button", "buttonOptions", buttonOptions);
        } else {
            form.option("items[1].editorOptions", editorOptions);
            form.option("items[2].buttonOptions", buttonOptions);
        }

        // assert
        var editor = $("#form .dx-textbox").last().dxTextBox("instance"),
            button = $("#form .dx-button").last().dxButton("instance");

        assert.deepEqual(form.option("items[1].editorOptions"), { width: 80, height: 40 }, "correct editor options");
        assert.deepEqual(form.option("items[2].buttonOptions"), { width: 10, height: 20 }, "correct button options");

        assert.equal(formInvalidateSpy.callCount, 0, "Invalidate does not called");

        assert.equal(editor.option("width"), 80, "Correct editor width");
        assert.equal(editor.option("height"), 40, "Correct editor height");
        assert.equal(button.option("width"), 10, "Correct button width");
        assert.equal(button.option("height"), 20, "Correct button height");
    });

    QUnit.test(`Changing the editorOptions of a sub item without re-render Form when use the ${optionWay} method (T316522)`, function(assert) {
        // arrange
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
                                {
                                    dataField: "firstName",
                                    editorType: "dxTextBox",
                                    editorOptions: { width: 100, height: 20 }
                                },
                                {
                                    dataField: "lastName",
                                    editorType: "dxTextBox",
                                    editorOptions: { width: 100, height: 20 }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).dxForm("instance");

        // act
        const editorOptions = { width: 80, height: 40 };
        if(useItemOption) {
            form.itemOption("lastName", "editorOptions", editorOptions);
        } else {
            form.option("items[0].items[0].items[1].editorOptions", editorOptions);
        }

        // assert
        var secondEditor = $("#form .dx-textbox").last().dxTextBox("instance");

        assert.equal(secondEditor.option("width"), 80, "Correct width");
        assert.equal(secondEditor.option("height"), 40, "Correct height");
    });

    QUnit.test(`The editorOptions correctly updates in case when only item name is defined and use the ${optionWay} method`, function(assert) {
        // arrange
        var form = $("#form").dxForm({
            items: [
                {
                    itemType: "group", items: [
                        {
                            itemType: "group", items: [
                                {
                                    name: "firstName",
                                    editorType: "dxTextBox",
                                    editorOptions: { width: 100, height: 20 }
                                },
                                {
                                    name: "lastName",
                                    editorType: "dxTextBox",
                                    editorOptions: { width: 100, height: 20 }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).dxForm("instance");

        var invalidateSpy = sinon.spy(form, "_invalidate");

        // act
        const editorOptions = { width: 80, height: 40 };
        if(useItemOption) {
            form.itemOption("lastName", "editorOptions", editorOptions);
        } else {
            form.option("items[0].items[0].items[1].editorOptions", editorOptions);
        }

        // assert
        var secondEditor = $("#form .dx-textbox").last().dxTextBox("instance");

        assert.equal(invalidateSpy.callCount, 0, "dxForm wasn't invalidated");
        assert.equal(secondEditor.option("width"), 80, "Correct width");
        assert.equal(secondEditor.option("height"), 40, "Correct height");
    });
});

QUnit.test("Changing the item's option via the itemOption when these options are set as object without re-render form", function(assert) {
    const form = $("#form").dxForm({
        formData: {
            name: "Test Name"
        },
        items: [
            {
                dataField: "name",
                editorOption: { width: 100 },
                cssClass: "test"
            }
        ]
    }).dxForm("instance");

    const formInvalidateSpy = sinon.spy(form, "_invalidate");

    form.itemOption("name", {
        editorOptions: { height: 120 },
        cssClass: "test-class"
    });

    assert.equal(formInvalidateSpy.callCount, 0, "Invalidate does not called");

    const editor = form.getEditor("name");
    assert.equal(editor.option("height"), 120, "height of editor options");

    const $form = $("#form");
    assert.strictEqual($form.find(".test-class").length, 1, "new cssClass of item");
    assert.strictEqual($form.find(".test").length, 0, "old cssClass of item");
});

QUnit.test("Changing the item's option via the itemOption when these options are set as object with re-render form", function(assert) {
    const form = $("#form").dxForm({
        formData: {
            name: "Test Name"
        },
        items: [{ dataField: "name" }]
    }).dxForm("instance");

    const formInvalidateSpy = sinon.spy(form, "_invalidate");

    form.itemOption("name", {
        colSpan: 2,
        cssClass: "test-class"
    });

    assert.equal(formInvalidateSpy.callCount, 1, "Invalidate does not called");

    assert.equal(form.option("items[0].colSpan"), 2, "colSpan of item");
    assert.strictEqual($("#form").find(".test-class").length, 1, "cssClass of item");
});

QUnit.test("resetValues - old test", function(assert) {
    // arrange
    var form = $("#form").dxForm({
        formData: {
            name: "User",
            lastName: "Test Last Name",
            room: 1,
            isDeveloper: true
        },
        items: ["name", "lastName", "room", "isDeveloper"]
    }).dxForm("instance");

    // act
    form.resetValues();

    // assert
    assert.strictEqual(form.getEditor("name").option("value"), "", "editor for the name dataField");
    assert.strictEqual(form.getEditor("lastName").option("value"), "", "editor for the lastName dataField");
    assert.strictEqual(form.getEditor("room").option("value"), null, "editor for the room dataField");
    assert.strictEqual(form.getEditor("isDeveloper").option("value"), false, "editor for the isDeveloper dataField");
});

QUnit.test("resetValues - clear formData and editors", function(assert) {
    var formData = {
        dxAutocomplete: "a",
        dxCalendar: new Date(2019, 1, 1),
        dxCheckBox: true,
        dxColorBox: "a",
        dxDateBox: new Date(2019, 1, 1),
        dxDropDownBox: "1",
        dxHtmlEditor: "a",
        dxLookup: "1",
        dxNumberBox: 1,
        dxRadioGroup: "1",
        dxSelectBox: "1",
        dxTagBox: ["1"],
        dxTextArea: "a",
        dxTextBox: "a",
    };

    var formItems = [
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

    var form = $("#form").dxForm({
        formData,
        items: formItems
    }).dxForm("instance");

    form.resetValues();

    var defaultResetValue = null;
    var stringEditorResetValue = "";
    var dxCheckBoxResetValue = false;
    var dxTagBoxResetValue = [];

    assert.strictEqual(formData.dxAutocomplete, defaultResetValue, "formData.dxAutocomplete");
    assert.strictEqual(formData.dxCalendar, defaultResetValue, "formData.dxCalendar");
    assert.strictEqual(formData.dxCheckBox, dxCheckBoxResetValue, "formData.dxCheckBox");
    assert.strictEqual(formData.dxDateBox, defaultResetValue, "formData.dxDateBox");
    assert.strictEqual(formData.dxDropDownBox, defaultResetValue, "formData.dxDropDownBox");
    assert.strictEqual(formData.dxHtmlEditor, defaultResetValue, "formData.dxHtmlEditor");
    assert.strictEqual(formData.dxLookup, defaultResetValue, "formData.dxLookup");
    assert.strictEqual(formData.dxNumberBox, defaultResetValue, "formData.dxNumberBox");
    assert.strictEqual(formData.dxRadioGroup, defaultResetValue, "formData.dxRadioGroup");
    assert.strictEqual(formData.dxSelectBox, defaultResetValue, "formData.dxSelectBox");
    assert.strictEqual(formData.dxTagBox.length, dxTagBoxResetValue.length, "formData.dxTagBox.length");
    assert.strictEqual(formData.dxTextArea, stringEditorResetValue, "formData.dxTextArea");
    assert.strictEqual(formData.dxTextBox, stringEditorResetValue, "formData.dxTextBox");

    assert.strictEqual(form.getEditor("dxAutocomplete").option("value"), defaultResetValue, "form.getEditor.dxAutocomplete");
    assert.strictEqual(form.getEditor("dxCalendar").option("value"), defaultResetValue, "form.getEditor.dxCalendar");
    assert.strictEqual(form.getEditor("dxCheckBox").option("value"), dxCheckBoxResetValue, "form.getEditor.dxCheckBox");
    assert.strictEqual(form.getEditor("dxDateBox").option("value"), defaultResetValue, "form.getEditor.dxDateBox");
    assert.strictEqual(form.getEditor("dxDropDownBox").option("value"), defaultResetValue, "form.getEditor.dxDropDownBox");
    assert.strictEqual(form.getEditor("dxHtmlEditor").option("value"), defaultResetValue, "form.getEditor.dxHtmlEditor");
    assert.strictEqual(form.getEditor("dxLookup").option("value"), defaultResetValue, "form.getEditor.dxLookup");
    assert.strictEqual(form.getEditor("dxNumberBox").option("value"), defaultResetValue, "form.getEditor.dxNumberBox");
    assert.strictEqual(form.getEditor("dxRadioGroup").option("value"), defaultResetValue, "form.getEditor.dxRadioGroup");
    assert.strictEqual(form.getEditor("dxSelectBox").option("value"), defaultResetValue, "form.getEditor.dxSelectBox");
    assert.strictEqual(form.getEditor("dxTagBox").option("value").length, dxTagBoxResetValue.length, "form.getEditor.dxTagBox");
    assert.strictEqual(form.getEditor("dxTextArea").option("value"), stringEditorResetValue, "form.getEditor.dxTextArea");
    assert.strictEqual(form.getEditor("dxTextBox").option("value"), stringEditorResetValue, "form.getEditor.dxTextBox");
});

const formatTestValue = value => Array.isArray(value) ? "[]" : value;

[undefined, null, []].forEach(groupItems => {
    QUnit.test(`Change group items from [1] -> ${formatTestValue(groupItems)}`, function(assert) {
        const form = $("#form").dxForm({
            formData: {
                field: "Test"
            },
            items: [{
                itemType: "group",
                name: "TestGroup",
                items: ["field"]
            }]
        }).dxForm("instance");

        form.itemOption("TestGroup", "items", groupItems);

        const $layoutManager = $(`.${FORM_GROUP_CONTENT_CLASS} > .${FORM_LAYOUT_MANAGER_CLASS}`);
        assert.equal($layoutManager.length, 1, "layout manager is rendered");
        assert.notOk($layoutManager.children().length, "layout manager content is empty");
        assert.notOk(form.getEditor("field"), "editor is not created");
    });
});

[undefined, null, []].forEach(tabbedItems => {
    QUnit.test(`Change tabbed items from [1] -> ${formatTestValue(tabbedItems)}`, function(assert) {
        const form = $("#form").dxForm({
            formData: {
                field: "Test"
            },
            items: [{
                itemType: "tabbed",
                tabs: [{
                    name: "TestTabbedItem",
                    items: ["field"]
                }]
            }]
        }).dxForm("instance");

        form.itemOption("TestTabbedItem", "items", tabbedItems);

        const $layoutManager = $(`.${MULTIVIEW_ITEM_CONTENT_CLASS} > .${FORM_LAYOUT_MANAGER_CLASS}`);
        assert.equal($layoutManager.length, 1, "layout manager is rendered");
        assert.notOk($layoutManager.children().length, "layout manager content is empty");
        assert.notOk(form.getEditor("field"), "editor is not created");
    });
});

[false, true].forEach(useItemOption => {
    QUnit.module(`Public API: Tab options are changed via ${useItemOption ? "itemOption" : "option"} method`, () => {
        class FormTestWrapper {
            constructor(useItemOption, onInitializedHandler) {
                this._useItemOption = useItemOption;
                this._form = $("#form").dxForm({
                    onInitialized: onInitializedHandler,
                    items: [{
                        itemType: "tabbed",
                        tabs: [{
                            title: "title0",
                            items: ["name"]
                        }, {
                            title: "title1",
                            items: ["lastName"]
                        }]
                    }]
                }).dxForm("instance");
                this._contentReadyStub = sinon.stub();
                this._form.on("contentReady", this._contentReadyStub);
            }

            setTabOption(tabIndex, optionName, value) {
                if(this._useItemOption) {
                    this._form.itemOption(`title${tabIndex}`, optionName, value);
                } else {
                    this._form.option(`items[0].tabs[${tabIndex}].${optionName}`, value);
                }
            }

            selectTab(tabIndex) {
                $(".dx-tabpanel").dxTabPanel("instance").option("selectedIndex", tabIndex);
            }

            checkFormsReRender() {
                QUnit.assert.equal(this._contentReadyStub.callCount, 0, "form is rendered once");
                this._contentReadyStub.reset();
            }

            checkTabBadge(tabIndex, expectedText) {
                QUnit.assert.equal($(".dx-tabs-item-badge").eq(tabIndex).text(), expectedText, `${tabIndex} tab badge`);
            }

            checkTabDisabled(tabIndex, expectedValue) {
                const $tabItems = $(".dx-tab");
                QUnit.assert.equal($tabItems.eq(tabIndex).hasClass("dx-state-disabled"), expectedValue, `${tabIndex} tab disabled`);
            }

            checkTabIcon(tabIndex, expectedIcon) {
                const $icon = $(".dx-tab .dx-icon").eq(tabIndex);
                QUnit.assert.ok($icon.hasClass(`dx-icon-${expectedIcon}`), `${tabIndex} tab icon`);
            }

            checkTabContentTemplate(tabIndex, $expectedTemplate) {
                const $multiViewItemContent = $(".dx-multiview-item-content").eq(tabIndex);
                QUnit.assert.equal($multiViewItemContent.html(), $("<div>").append($expectedTemplate).html(), `${tabIndex} tab template`);
            }

            checkTabTemplate(tabIndex, $expectedTemplate) {
                const $multiViewItemContent = $(".dx-tab-content").eq(tabIndex);
                QUnit.assert.equal($multiViewItemContent.html(), $("<div>").append($expectedTemplate).html(), `${tabIndex} tab template`);
            }

            checkTabTitle(tabIndex, expectedText) {
                const $title = $(".dx-tab-content .dx-tab-text").eq(tabIndex);
                QUnit.assert.strictEqual($title.text(), expectedText, `${tabIndex} tab title`);
            }
        }

        QUnit.test("Change the badge option", () => {
            const testWrapper = new FormTestWrapper(useItemOption);
            testWrapper.setTabOption(0, "badge", "TestBadge1");
            testWrapper.checkFormsReRender();
            testWrapper.checkTabBadge(0, "TestBadge1");

            testWrapper.setTabOption(1, "badge", "TestBadge2");
            testWrapper.checkFormsReRender();
            testWrapper.checkTabBadge(1, "TestBadge2");
        });

        QUnit.test("Change the disabled option", () => {
            const testWrapper = new FormTestWrapper(useItemOption);
            testWrapper.setTabOption(0, "disabled", true);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabDisabled(0, true);

            testWrapper.setTabOption(1, "disabled", true);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabDisabled(1, true);

            testWrapper.setTabOption(0, "disabled", false);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabDisabled(0, false);

            testWrapper.setTabOption(1, "disabled", false);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabDisabled(1, false);
        });

        QUnit.test("Change the icon option", () => {
            const testWrapper = new FormTestWrapper(useItemOption);

            testWrapper.setTabOption(0, "icon", "plus");
            testWrapper.checkFormsReRender();
            testWrapper.checkTabIcon(0, "plus");

            testWrapper.setTabOption(1, "icon", "trash");
            testWrapper.checkFormsReRender();
            testWrapper.checkTabIcon(1, "trash");
        });

        QUnit.test("Change the template option", () => {
            const testWrapper = new FormTestWrapper(useItemOption);

            const template1 = "<div class='custom-template-1'></div>";
            testWrapper.setTabOption(0, "template", template1);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabContentTemplate(0, $(template1));

            const template2 = "<div class='custom-template-2'></div>";
            testWrapper.setTabOption(1, "template", template2);
            testWrapper.selectTab(1);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabContentTemplate(1, $(template2));
        });

        QUnit.test("Change the tab template option", () => {
            const testWrapper = new FormTestWrapper(useItemOption);

            const template1 = "<div class='custom-tab-template-1'></div>";
            testWrapper.setTabOption(0, "tabTemplate", template1);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabTemplate(0, $(template1));

            const template2 = "<div class='custom-tab-template-2'></div>";
            testWrapper.setTabOption(1, "tabTemplate", template2);
            testWrapper.selectTab(1);
            testWrapper.checkFormsReRender();
            testWrapper.checkTabTemplate(1, $(template2));
        });

        QUnit.test("Change the title option", () => {
            const testWrapper = new FormTestWrapper(useItemOption);
            testWrapper.setTabOption(0, "title", "TestTitle1");
            testWrapper.checkFormsReRender();
            testWrapper.checkTabTitle(0, "TestTitle1");

            testWrapper.setTabOption(1, "title", "TestTitle2");
            testWrapper.checkFormsReRender();
            testWrapper.checkTabTitle(1, "TestTitle2");
        });

        QUnit.test("Title is set correctly when it is changed on the onInitialized event", () => {
            const testWrapper = new FormTestWrapper(useItemOption, ({ component }) => {
                if(useItemOption) {
                    component.itemOption("title0", "title", "New Title");
                } else {
                    component.option("items[0].tabs[0].title", "New Title");
                }
            });

            testWrapper.checkFormsReRender();
            testWrapper.checkTabTitle(0, "New Title");
        });
    });
});

QUnit.module("Adaptivity");

QUnit.test("One column screen should be customizable with screenByWidth option on init", function(assert) {
    // arrange
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

    // assert
    assert.equal($form.find(".dx-layout-manager-one-col").length, 1, "single column screen was changed");
    assert.equal($form.find(".dx-single-column-item-content").length, 4, "There are 4 items in the column");
});

QUnit.test("One column screen should be customizable with screenByWidth option on option change", function(assert) {
    // arrange
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

    // act
    form.option("screenByWidth", function() { return "xs"; });

    // assert
    assert.equal($form.find(".dx-single-column-item-content").length, 4, "There are 4 items in the column");
    assert.equal($form.find(".dx-layout-manager-one-col").length, 1, "single column screen was changed");
});

QUnit.test("Column count may depend on screen factor", function(assert) {
    // arrange
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

    // act
    screen = "sm";
    resizeCallbacks.fire();

    // assert
    assert.equal($form.find(".dx-first-col.dx-last-col").length, 4, "only one column exists");
});

QUnit.test("Column count ignores hide/show scroller when rerendering if screen factor changed", function(assert) {
    var originalGetDocumentElement = domAdapter.getDocumentElement;
    try {
        var largeScreenWidth = 1200,
            mediumScreenWidth = 1199,
            width = largeScreenWidth,
            height = 300,
            scrollerWidth = 17;

        domAdapter.getDocumentElement = function() {
            return {
                clientWidth: width,
                clientHeight: height
            };
        };

        var $form = $("#form");

        $form.dxForm({
            labelLocation: "left",
            colCountByScreen: {
                lg: 2,
                md: 1
            },
            items: [
                {
                    name: "f1", editorType: "dxTextBox",
                    editorOptions: {
                        onDisposing: function() {
                            width = mediumScreenWidth + scrollerWidth;
                        }
                    }
                },
                "f2"
            ]
        });

        assert.equal($form.find(".dx-col-0").length, 1, "(.dx-col-0).length initial");
        assert.equal($form.find(".dx-col-1").length, 1, "(.dx-col-1).length initial");

        width = mediumScreenWidth;
        resizeCallbacks.fire();

        assert.equal($form.find(".dx-col-0").length, 2, "(.dx-col-0).length current");
        assert.equal($form.find(".dx-col-1").length, 0, "(.dx-col-1).length current");
    } finally {
        domAdapter.getDocumentElement = originalGetDocumentElement;
    }
});

QUnit.test("Form should repaint once when screen factor changed", function(assert) {
    // arrange
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

    // act
    screen = "sm";
    resizeCallbacks.fire();
    resizeCallbacks.fire();

    // assert
    assert.equal(refreshStub.callCount, 1, "refresh called once");
});

QUnit.test("Form doesn't redraw layout when colCount doesn't changed", function(assert) {
    // arrange
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

    // act
    form.getEditor("test").option("value", "Changed");
    screen = "sm";
    resizeCallbacks.fire();

    // assert
    assert.equal(form.getEditor("test").option("value"), "Changed", "Editor keeps old value");
});

QUnit.test("Form doesn't redraw layout when colCount doesn't changed and colCountByScreen option defined", function(assert) {
    // arrange
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

    // act
    form.getEditor("test").option("value", "Changed");
    screen = "sm";
    resizeCallbacks.fire();

    // assert
    assert.equal(form.getEditor("test").option("value"), "Changed", "Editor keeps old value");
});

QUnit.test("Form is not redrawn when colCount doesn't change ('colCount' and 'colCountByScreen' options are defined)", function(assert) {
    // arrange
    var $form = $("#form"),
        screen = "md",
        initCount = 0;

    $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCount: 1, // xs and lg screens have an equal colCount
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

    // act, assert
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
    // arrange
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

    // act
    screen = "sm";
    resizeCallbacks.fire();

    // assert
    assert.equal($form.find(".dx-group-colcount-2").length, 1, "first group should have 2 columns");
    assert.equal($form.find(".dx-group-colcount-4").length, 1, "second group should have 4 columns");
});

QUnit.test("Column count for tabs may depend on screen factor", function(assert) {
    // arrange
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

    // act
    screen = "sm";
    resizeCallbacks.fire();

    // assert
    assert.notOk($form.find(".dx-field-item-tab.dx-col-2").length, "tab has not 3 groups on sm screen");
    assert.ok($form.find(".dx-field-item-tab.dx-col-1").length, "tab has 2 groups on sm screen");
});

QUnit.test("Cached colCount options doesn't leak", function(assert) {
    // arrange
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

    // act
    instance.option("items", ["name"]);

    // assert
    assert.equal(instance._cachedColCountOptions.length, 1, "only root colCount options cached");
});

QUnit.test("Form refreshes only one time on dimension changed with group layout", function(assert) {
    // arrange
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

    // act
    $form.width(100);
    resizeCallbacks.fire();
    // assert
    assert.equal(refreshSpy.callCount, 1, "form has been redraw layout one time");
});

QUnit.test("Form redraw layout when colCount is 'auto' and an calculated colCount changed", function(assert) {
    // arrange
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

    // act
    $form.width(100);
    resizeCallbacks.fire();

    // assert
    assert.equal(refreshSpy.callCount, 1, "form has been redraw layout");
});

QUnit.module("Form when rtlEnabled is true");

QUnit.test("required mark aligned when rtlEnabled option is set to true", (assert) => {
    let $testContainer = $("#form").dxForm({
        requiredMark: "!",
        rtlEnabled: true,
        items: [{
            dataField: "name",
            isRequired: true
        }]
    });

    let $labelsContent = $testContainer.find(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`),
        $requiredLabel = $labelsContent.find(`.${internals.FIELD_ITEM_LABEL_TEXT_CLASS}`),
        $requiredMark = $labelsContent.find(`.${internals.FIELD_ITEM_REQUIRED_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.notEqual($labelsContent.offset().left, $requiredMark.offset().left, "position of requared mark is right");
    assert.ok($requiredLabel.position().left > $requiredMark.position().left, "required mark should be before of the text");
});

QUnit.test("optional mark aligned when rtlEnabled option is set to true", (assert) => {
    let $testContainer = $("#form").dxForm({
        optionalMark: "optMark",
        showOptionalMark: true,
        rtlEnabled: true,
        items: ["position"]
    });

    let $labelsContent = $testContainer.find(`.${internals.FIELD_ITEM_LABEL_CONTENT_CLASS}`),
        $optionalLabel = $labelsContent.find(`.${internals.FIELD_ITEM_LABEL_TEXT_CLASS}`),
        $optionalMark = $labelsContent.find(`.${internals.FIELD_ITEM_OPTIONAL_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.notEqual($labelsContent.offset().left, $optionalMark.offset().left, "position of optional mark is right");
    assert.ok($optionalLabel.position().left > $optionalMark.position().left, "optional mark should be before of the text");
});

QUnit.module("Events");

QUnit.test("Should not skip `optionChanged` event handler that has been added on the `onInitialized` event handler", function(assert) {
    var eventCalls = [];

    var form = $("#form").dxForm({
        formData: { firstName: "John" },
        onOptionChanged: function() {
            eventCalls.push("onOptionChanged");
        },
        onContentReady: function(e) {
            e.component.on("optionChanged", function() {
                eventCalls.push("optionChanged from `onContentReady`");
            });
        },
        onInitialized: function(e) {
            e.component.on('optionChanged', function() {
                eventCalls.push("optionChanged from `onInitialized`");
            });
        }
    }).dxForm("instance");

    form.option("formData", { lastName: "John" });

    assert.deepEqual(eventCalls, [
        "optionChanged from `onInitialized`",
        "optionChanged from `onContentReady`",
        "onOptionChanged"
    ]);
});
