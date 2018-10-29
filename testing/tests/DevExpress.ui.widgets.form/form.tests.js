var $ = require("jquery"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    responsiveBoxScreenMock = require("../../helpers/responsiveBoxScreenMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    typeUtils = require("core/utils/type"),
    browser = require("core/utils/browser"),
    domUtils = require("core/utils/dom"),
    internals = require("ui/form/ui.form").__internals,
    themes = require("ui/themes");

require("ui/text_area");

require("common.css!");
require("generic_light.css!");

var INVALID_CLASS = "dx-invalid",
    VALIDATION_SUMMARY_ITEM_CLASS = "dx-validationsummary-item";

QUnit.testStart(function() {
    var markup =
        '<div id="form"></div>\
        <div id="form2"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Form");
QUnit.test("Check that registerKeyHandler proxy works well", function(assert) {
    // arrange, act
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

    // assert
    assert.equal(counter, 1, "Custom key handler for the first editor");

    keyboardMock($inputs.eq(1)).keyDown("tab");

    // assert
    assert.equal(counter, 2, "Custom key handler for the second editor");
});

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
    assert.deepEqual(values[3], { dataField: "room", value: null }, "value of room dataField");
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

    form.validate();
    form.getEditor("lastName").focus();

    assert.ok(form.getEditor("lastName").$element().parents(".dx-field-item-content-wrapper").hasClass(INVALID_CLASS), "invalid css class");

    form.getEditor("name").focus();
    assert.ok(!form.getEditor("lastName").$element().parents(".dx-field-item-content-wrapper").hasClass(INVALID_CLASS), "not invalid css class");
    assert.ok(!form.getEditor("name").$element().parents(".dx-field-item-content-wrapper").hasClass(INVALID_CLASS), "not invalid css class");

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

function triggerKeyUp($element, keyCode) {
    var e = $.Event("keyup");
    e.which = keyCode;
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
    triggerKeyUp(editor.$element(), 13);

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

    // act
    form.itemOption("FirstName", {
        visible: true,
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

function getID(form, dataField) {
    return "dx_" + form.option("formID") + "_" + dataField;
}

QUnit.test("Validate via validation rules", function(assert) {
    // arrange
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

    // act
    form.validate();

    // assert
    var invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
});

QUnit.test("Validate with a custom validation group", function(assert) {
    // arrange
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

    // act
    form.validate();

    // assert
    var invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
});

QUnit.test("Reset validation summary items when using a custom validation group", function(assert) {
    // arrange
    var form = $("#form").dxForm({
        validationGroup: "Custom validation group",
        showValidationSummary: true,
        formData: {
            name: "",
            lastName: "John",
            firstName: ""
        },
        customizeItem: function(item) {
            if(item.dataField !== "lastName") {
                item.validationRules = [{ type: "required" }];
            }
        }
    }).dxForm("instance");

    // act
    form.validate();
    form.resetValues();

    // assert
    var $invalidElements = form.$element().find("." + INVALID_CLASS),
        $validationSummaryItems = form.$element().find("." + VALIDATION_SUMMARY_ITEM_CLASS);

    assert.equal($invalidElements.length, 0, "There is no invalid elements");
    assert.equal($validationSummaryItems.length, 0, "There is no validation summary items");
});

QUnit.test("Validate form when several forms are rendered", function(assert) {
    // arrange
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

    // act
    form1.validate();

    // assert
    var invalidSelector = "." + INVALID_CLASS;
    assert.equal(form1.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form1.$element().find(invalidSelector + " [id=" + getID(form1, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form1.$element().find(invalidSelector + " [id=" + getID(form1, "firstName") + "]").length, 1, "invalid firstName editor");

    assert.equal(form2.$element().find(invalidSelector).length, 0, "invalid editors count");
    assert.equal(form2.$element().find(invalidSelector + " [id=" + getID(form2, "name2") + "]").length, 0, "invalid name editor");
    assert.equal(form2.$element().find(invalidSelector + " [id=" + getID(form2, "firstName2") + "]").length, 0, "invalid firstName editor");
});

QUnit.test("Validate via 'isRequired' item option", function(assert) {
    // arrange
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

    // act
    form.validate();

    // assert
    var invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 2, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "name") + "]").length, 1, "invalid name editor");
    assert.equal(form.$element().find(invalidSelector + "-message").first().text(), "Middle name is required", "Message contains the custom label name of validated field by default");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "firstName") + "]").length, 1, "invalid firstName editor");
    assert.equal(form.$element().find(".dx-invalid-message").last().text(), "First Name is required", "Message contains the name of validated field by default if label isn't defined");
});

QUnit.test("Validate via validationRules when rules and 'isRequired' item option are both defined", function(assert) {
    // arrange
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

    // act
    form.validate();

    // assert
    var invalidSelector = "." + INVALID_CLASS;
    assert.equal(form.$element().find(invalidSelector).length, 1, "invalid editors count");
    assert.equal(form.$element().find(invalidSelector + " [id=" + getID(form, "lastName") + "]").length, 1, "invalid lastName editor");
});

QUnit.test("Reset validation summary when values are reset in form", function(assert) {
    // arrange
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

    // act
    form.validate();
    form.resetValues();

    // assert
    assert.equal($("." + VALIDATION_SUMMARY_ITEM_CLASS).length, 0, "validation summary items");
});

QUnit.test("Changing an validationRules options of an any item does not invalidate whole form (T673188)", function(assert) {
    // arrange
    var form = $("#form").dxForm({
            formData: {
                lastName: "Kyle",
                count: 1
            },
            items: [
                { dataField: "firstName", editorType: "dxTextBox" },
                { dataField: "count", editorType: "dxTextBox", validationRules: [{ type: "range", max: 10 }] }
            ]
        }).dxForm("instance"),
        formInvalidateSpy = sinon.spy(form, "_invalidate");

    form.option("items[1].validationRules[0].max", 11);
    assert.strictEqual(form.option("items[1].validationRules[0].max"), 11, "correct validationRule option");
    assert.strictEqual(formInvalidateSpy.callCount, 0, "Invalidate does not called");
});

QUnit.test("Changing an editor/button options of an any item does not invalidate whole form (T311892, T681241)", function(assert) {
    // arrange
    var form = $("#form").dxForm({
            formData: {
                lastName: "Kyle",
                firstName: "John"
            },
            items: [
                { dataField: "firstName", editorType: "dxTextBox", editorOption: { width: 100, height: 20 } },
                { dataField: "lastName", editorType: "dxTextBox", editorOption: { width: 100, height: 20 } },
                { itemType: "button", buttonOptions: { width: 100, height: 20 } }
            ]
        }).dxForm("instance"),
        formInvalidateSpy = sinon.spy(form, "_invalidate");

    // act
    form.option("items[1].editorOptions", { width: 80, height: 40 });
    form.option("items[2].buttonOptions", { width: 10, height: 20 });

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

QUnit.test("Changing editorOptions of subitem change editor options (T316522)", function(assert) {
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
                                { dataField: "firstName", editorType: "dxTextBox", editorOptions: { width: 100, height: 20 } },
                                { dataField: "lastName", editorType: "dxTextBox", editorOptions: { width: 100, height: 20 } }
                        ]
                    }
                ]
            }
        ]
    }).dxForm("instance");

    // act
    form.option("items[0].items[0].items[1].editorOptions", { width: 80, height: 40 });

    // assert
    var secondEditor = $("#form .dx-textbox").last().dxTextBox("instance");

    assert.equal(secondEditor.option("width"), 80, "Correct width");
    assert.equal(secondEditor.option("height"), 40, "Correct height");
});

QUnit.test("editorOptions correctly updates in case when only item name is defined", function(assert) {
    // arrange
    var form = $("#form").dxForm({
        items: [
            {
                itemType: "group", items: [
                    {
                        itemType: "group", items: [
                                { name: "firstName", editorType: "dxTextBox", editorOptions: { width: 100, height: 20 } },
                                { name: "lastName", editorType: "dxTextBox", editorOptions: { width: 100, height: 20 } }
                        ]
                    }
                ]
            }
        ]
    }).dxForm("instance");

    var invalidateSpy = sinon.spy(form, "_invalidate");

    // act
    form.option("items[0].items[0].items[1].editorOptions", { width: 80, height: 40 });

    // assert
    var secondEditor = $("#form .dx-textbox").last().dxTextBox("instance");

    assert.equal(invalidateSpy.callCount, 0, "dxForm wasn't invalidated");
    assert.equal(secondEditor.option("width"), 80, "Correct width");
    assert.equal(secondEditor.option("height"), 40, "Correct height");
});

QUnit.test("Reset editor's value", function(assert) {
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
