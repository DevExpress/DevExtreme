"use strict";

var $ = require("jquery"),
    consoleUtils = require("core/utils/console"),
    responsiveBoxScreenMock = require("../../helpers/responsiveBoxScreenMock.js"),
    internals = require("ui/form/ui.form.layout_manager").__internals,
    utils = require("core/utils/common"),
    createTestObject = function() {
        return {
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
    };

require("ui/switch");
require("ui/select_box");
require("ui/tag_box");
require("ui/lookup");
require("ui/text_area");
require("ui/radio_group");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="container"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Layout manager");

QUnit.test("Default render", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //assert
    assert.ok($testContainer.hasClass(internals.FORM_LAYOUT_MANAGER_CLASS), "layout manager is rendered");
    assert.equal($testContainer.find(".dx-responsivebox").length, 1, "responsive box is rendered");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS).length, 1, "field items is rendered");
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS).hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "field item has default label-align class");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).length, 1, "label is rendered");
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "left"), "label's location is left by default");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").length, 1, "editor is rendered");
    assert.ok(!$testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is not read only");
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + "> ." + internals.FIELD_ITEM_CONTENT_CLASS).hasClass(internals.FIELD_ITEM_CONTENT_LOCATION_CLASS + "right"), 1, "Field item content has a right css class");
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + "> ." + internals.FIELD_ITEM_CONTENT_CLASS + "> .dx-texteditor").length, 1, "editor has field-item-content class");
});

QUnit.test("Default render with editorOptions.inputAttr", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        layoutData: { name: "John" },
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox",
                editorOptions: { inputAttr: { alt: "test" } }
            }
        ]
    });

    //assert
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor-input").attr("alt"), "test", "attr merge successfully");
});

QUnit.test("Default render with template", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            layoutData: { firstName: "Alex", address: "Winnipeg" },
            items: [
                {
                    dataField: "FirstName",
                    itemType: 'simple',
                    isRequired: true,
                    template: function(data, element) {

                        $('<div>')
                            .appendTo(element)
                            .dxButton({ icon: 'find' });

                        $('<div>')
                            .appendTo(element)
                            .dxTextBox(data.editorOptions)
                            .dxValidator({
                                validationGroup: data.component,
                                validationRules: [{
                                    type: "required",
                                    message: "Hire date is required"
                                }]
                            });
                    }
                },
                {
                    dataField: "address",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($items.length, 2, "field items is rendered");
});

QUnit.test("Default render with marks", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                },
                {
                    dataField: "address",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($items.length, 2, "field items is rendered");

    var $requiredItem = $items.eq(0),
        $optionalItem = $items.eq(1);

    assert.ok($requiredItem.hasClass(internals.FIELD_ITEM_REQUIRED_CLASS), "field item has required class");
    assert.ok(!$requiredItem.hasClass(internals.FIELD_ITEM_OPTIONAL_CLASS), "field item hasn't optional class");
    assert.ok($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, "field item has required mark");
    assert.ok(!$requiredItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).length, "field item hasn't optional mark");


    assert.ok(!$optionalItem.hasClass(internals.FIELD_ITEM_REQUIRED_CLASS), "field item hasn't required class");
    assert.ok($optionalItem.hasClass(internals.FIELD_ITEM_OPTIONAL_CLASS), "field item has optional class");
    assert.ok(!$optionalItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, "field item hasn't required mark");
    assert.ok(!$optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).length, "field item hasn't optional mark");
});

QUnit.test("Show optional marks", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    dataField: "address",
                    editorType: "dxTextBox"
                }
            ],
            showOptionalMark: true
        }),
        $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($items.length, 1, "field items is rendered");

    var $optionalItem = $items.eq(0);
    assert.ok(!$optionalItem.hasClass(internals.FIELD_ITEM_REQUIRED_CLASS), "field item hasn't required class");
    assert.ok($optionalItem.hasClass(internals.FIELD_ITEM_OPTIONAL_CLASS), "field item has optional class");
    assert.ok(!$optionalItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, "field item hasn't required mark");
    assert.ok($optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).length, "field item hasn optional mark");
});

QUnit.test("Render custom marks", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            showOptionalMark: true,
            optionalMark: "-",
            requiredMark: "+",
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                },
                {
                    dataField: "address",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    var $requiredItem = $items.eq(0),
        $optionalItem = $items.eq(1);

    assert.equal($.trim($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).text()), "+", "custom required mark");
    assert.equal($.trim($optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).text()), "-", "custom optional mark");
});

QUnit.test("Change marks", function(assert) {
    //arrange
    var $testContainer = $("#container").dxLayoutManager({
            showOptionalMark: true,
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                },
                {
                    dataField: "address",
                    editorType: "dxTextBox"
                }
            ]
        }),
        instance = $testContainer.dxLayoutManager("instance");

    //act
    instance.option("optionalMark", "-");
    instance.option("requiredMark", "+");

    //assert
    var $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS),
        $requiredItem = $items.eq(0),
        $optionalItem = $items.eq(1);

    assert.equal($.trim($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).text()), "+", "custom required mark");
    assert.equal($.trim($optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).text()), "-", "custom optional mark");
});

QUnit.test("Change marks visibility", function(assert) {
    //arrange
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                },
                {
                    dataField: "address",
                    editorType: "dxTextBox"
                }
            ]
        }),
        instance = $testContainer.dxLayoutManager("instance"),
        $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //act
    instance.option("showOptionalMark", true);
    instance.option("showRequiredMark", false);

    //assert
    var $requiredItem = $items.eq(0),
        $optionalItem = $items.eq(1);

    assert.ok($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, "Item has no required mark");
    assert.ok(!$optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).length, "Item has optional mark");
});

QUnit.test("Render read only layoutManager", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        readOnly: true,
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //assert
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
});

QUnit.test("Check that inner widgets change readOnly option at layoutManager optionChange", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    assert.ok(!$testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is not read only");

    $testContainer.dxLayoutManager("instance").option("readOnly", true);

    //assert
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
});

QUnit.test("Check readOnly state for editor when readOnly is enabled in the editorOptions", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox",
                editorOptions: {
                    readOnly: true
                }
            }
        ]
    });

    //assert
    assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
});

QUnit.test("Layout strategy when flex is not supported", function(assert) {
    //arrange, act
    var items = [
        {
            dataField: "test1",
            editorType: "dxTextBox"
        },
        {
            dataField: "test2",
            editorType: "dxTextBox",
            helpText: "help"
        },
        {
            dataField: "test3",
            editorType: "dxRadioGroup"
        },
        {
            dataField: "test4",
            editorType: "dxCalendar"
        },
        {
            dataField: "test5",
            editorType: "dxTextArea"
        }
        ],
        $testContainer = $("#container").dxLayoutManager(),
        layoutManager = $testContainer.data("dxLayoutManager");

    //act
    layoutManager._hasBrowserFlex = function() {
        return false;
    };
    layoutManager.option("items", items);

    //assert
    assert.equal(layoutManager._responsiveBox.option("_layoutStrategy"), "fallback");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + "." + internals.FLEX_LAYOUT_CLASS).length, 0, "flex layout class");
});

QUnit.test("Layout strategy when flex is supported", function(assert) {
    //arrange, act
    var items = [
        {
            dataField: "test1",
            editorType: "dxTextBox"
        },
        {
            dataField: "test2",
            editorType: "dxTextBox",
            helpText: "help"
        },
        {
            dataField: "test3",
            editorType: "dxRadioGroup"
        },
        {
            dataField: "test4",
            editorType: "dxCalendar"
        },
        {
            dataField: "test5",
            editorType: "dxTextArea"
        }
        ],
        $testContainer = $("#container").dxLayoutManager(),
        layoutManager = $testContainer.data("dxLayoutManager");

    //act
    layoutManager._hasBrowserFlex = function() {
        return true;
    };
    layoutManager.option("items", items);

    //assert
    assert.equal(layoutManager._responsiveBox.option("_layoutStrategy"), "flex");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + "." + internals.FLEX_LAYOUT_CLASS).length, 5, "flex layout class");
});

QUnit.test("Render label by default", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            form: {
                option: function() {},
                getItemID: function() {
                    return "dx_FormID_name";
                }
            },
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).first();

    //assert
    assert.equal($label.length, 1, "label is rendered");
    assert.ok($label.hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "left"), "label's location is left by default");
    assert.equal($label.text(), "Name", "text of label");
    assert.equal($label.attr("for"), "dx_FormID_name", "text of label");
    assert.ok($label.parent().hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "field item contains label has horizontal align class");
});

QUnit.test("Check label alignment classes when browser is not supported flex", function(assert) {
    //arrange, act
    var items = [
        {
            dataField: "test1",
            editorType: "dxTextBox"
        },
        {
            dataField: "test2",
            editorType: "dxTextBox",
            helpText: "help"
        },
        {
            dataField: "test3",
            editorType: "dxRadioGroup"
        },
        {
            dataField: "test4",
            editorType: "dxCalendar"
        },
        {
            dataField: "test5",
            editorType: "dxTextArea"
        }
        ],
        $testContainer = $("#container").dxLayoutManager(),
        layoutManager = $testContainer.data("dxLayoutManager"),
        $items;

    //act
    layoutManager._hasBrowserFlex = function() {
        return false;
    };
    layoutManager.option("items", items);
    $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.ok(!$items.eq(0).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item doesn't have baseline alignment class");
    assert.ok($items.eq(1).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    assert.ok($items.eq(2).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    assert.ok($items.eq(3).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    assert.ok($items.eq(4).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
});

QUnit.test("Check label alignment classes when browser is supported flex", function(assert) {
    //arrange, act
    var items = [
        {
            dataField: "test1",
            editorType: "dxTextBox"
        },
        {
            dataField: "test2",
            editorType: "dxTextBox",
            helpText: "help"
        },
        {
            dataField: "test3",
            editorType: "dxRadioGroup"
        },
        {
            dataField: "test4",
            editorType: "dxCalendar"
        },
        {
            dataField: "test5",
            editorType: "dxTextArea"
        }
        ],
        $testContainer = $("#container").dxLayoutManager(),
        layoutManager = $testContainer.data("dxLayoutManager"),
        $items;

    //act
    layoutManager._hasBrowserFlex = function() {
        return true;
    };
    layoutManager.option("items", items);
    $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.ok(!$items.eq(0).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item doesn't have baseline alignment class");
    assert.ok(!$items.eq(1).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    assert.ok($items.eq(2).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    assert.ok($items.eq(3).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    assert.ok($items.eq(4).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
});

QUnit.test("Check label alignment classes when label location is 'top'", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            labelLocation: "top",
            items: [
                {
                    dataField: "test1",
                    editorType: "dxTextBox"
                },
                {
                    dataField: "test2",
                    editorType: "dxTextBox",
                    helpText: "help"
                },
                {
                    dataField: "test3",
                    editorType: "dxRadioGroup"
                },
                {
                    dataField: "test4",
                    editorType: "dxCalendar"
                },
                {
                    dataField: "test5",
                    editorType: "dxTextArea"
                }
            ]
        }),
        $labels = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS);

    //assert
    assert.ok(!$labels.eq(0).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
    assert.ok(!$labels.eq(1).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
    assert.ok(!$labels.eq(2).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
    assert.ok(!$labels.eq(3).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
    assert.ok(!$labels.eq(4).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
});

QUnit.test("Render label for item without name or dateField", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            form: {
                option: function() {},
                getItemID: function() {
                    return "dx_FormID_name";
                }
            },
            items: [
                {
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first(),
        $input = $testContainer.find("input");

    //assert
    assert.ok($input.attr("id"), "input has ID");
    assert.equal($label.attr("for"), $input.attr("input"), "input ID equal to label's 'for' attribute");
});

QUnit.test("Render label with position top render before widget", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "top" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $fieldItemChildren = $testContainer.find("." + internals.FIELD_ITEM_CLASS).children();

    //assert
    assert.ok($fieldItemChildren.first().hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "top"), "check location class");
    assert.ok($fieldItemChildren.first().is("label"), "Label is the first child");
});

QUnit.test("Render label with position bottom render after widget", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "bottom" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $fieldItemChildren = $testContainer.find("." + internals.FIELD_ITEM_CLASS).children();

    //assert
    assert.ok($fieldItemChildren.last().hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "bottom"), "check location class");
    assert.ok($fieldItemChildren.last().is("label"), "Label is the last child");
});

QUnit.test("Render label with position top and alignment left", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "top", alignment: "left" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.ok($label.parent().hasClass(internals.LABEL_VERTICAL_ALIGNMENT_CLASS), "Field item contains label that has vertical align");
    assert.equal($label.css("text-align"), "left", "Label has text-align left");
});

QUnit.test("Render label with position top and alignment center", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "top", alignment: "center" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.ok($label.parent().hasClass(internals.LABEL_VERTICAL_ALIGNMENT_CLASS), "Field item contains label that has vertical align");
    assert.equal($label.css("text-align"), "center", "Label has text-align center");
});

QUnit.test("Render label with position top and alignment right", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "top", alignment: "right" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.ok($label.parent().hasClass(internals.LABEL_VERTICAL_ALIGNMENT_CLASS), "Field item contains label that has vertical align");
    assert.equal($label.css("text-align"), "right", "Label has text-align right");
});

QUnit.test("Render label with horizontal alignment (left) ", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "left" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $fieldItem = $testContainer.find("." + internals.FIELD_ITEM_CLASS).first();

    //assert
    assert.ok($fieldItem.hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "Field item contains label that has horizontal align");
});

QUnit.test("Render label with default position and alignment left", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { alignment: "left" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.equal($label.css("text-align"), "left", "Label has text-align left");
});

QUnit.test("Render label with default position and alignment center", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { alignment: "center" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.equal($label.css("text-align"), "center", "Label has text-align center");
});

QUnit.test("Render label with showColonAfterLabel", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            showColonAfterLabel: true,
            items: [
                {
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).first();

    //assert
    assert.equal($label.text(), "Name:", "text of label");
});

QUnit.test("Label is not rendered when name is defined", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        items: [
            {
                name: "name",
                editorType: "dxTextBox"
            }
        ]
    });

    //assert
    assert.ok(!$testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).length);
});

QUnit.test("If item is not visible we will not render them", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [{
                dataField: "firstName"
            }, {
                dataField: "LastName",
                visible: false
            }, {
                dataField: "Phone"
            }]
        }),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.length, 2, "We have only two visible items");
    assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
    assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Phone", "Correct second item rendered");
});

QUnit.test("Item should be removed from DOM if it's visibility changed", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [{
                dataField: "firstName"
            }, {
                dataField: "LastName"
            }, {
                dataField: "Phone"
            }]
        }),
        instance = $testContainer.dxLayoutManager("instance"),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.length, 3, "We have 3 visible items");

    instance.option("items[1].visible", false);
    $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    assert.equal($fieldItems.length, 2, "We have 2 visible items");
    assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
    assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Phone", "Correct second item rendered");
});

QUnit.test("Check clickable fielditem", function(assert) {
    //arrange
    var clock = sinon.useFakeTimers(),
        $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    dataField: "isRich",
                    editorType: "dxSwitch",
                    editorOptions: { value: false }
                },
                {
                    dataField: "hasMansion",
                    editorType: "dxCheckBox",
                    editorOptions: { value: false }
                }
            ]
        }),
        $fieldItemLabels = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS),
        instance = $testContainer.dxLayoutManager("instance");

    //act
    assert.deepEqual(instance.option("layoutData"), { isRich: false, hasMansion: false }, "Correct initial data");

    $fieldItemLabels.eq(0).trigger("dxclick");
    clock.tick();

    $fieldItemLabels.eq(1).trigger("dxclick");
    clock.tick(200);

    //assert
    assert.deepEqual(instance.option("layoutData"), { isRich: true, hasMansion: true }, "Correct data");
    clock.restore();
});

QUnit.test("Render items as array of strings", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: ["FirstName", "LastName"]
        }),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.length, 2, "We have two items");
    assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
    assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Last Name", "Correct second item rendered");
});

QUnit.test("Render mixed set of items(2 as strings, 1 as object)", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: ["FirstName", { dataField: "Nickname" }, "LastName"]
        }),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.length, 3, "We have three items");
    assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
    assert.equal($fieldItems.eq(1).find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Nickname", "Correct second item rendered");
    assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Last Name", "Correct third item rendered");
});

QUnit.test("If label is not visible we will not render them", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    dataField: "firstName",
                    label: { visible: false }
                }
            ]
        }),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.length, 1, "We have only one item");
    assert.equal($fieldItems.find("." + internals.FIELD_ITEM_LABEL_CLASS).length, 0, "We have't labels");
    assert.equal($fieldItems.find("." + internals.FIELD_ITEM_CONTENT_CLASS).length, 1, "We have widget in field");
});

QUnit.test("Render label with horizontal alignment (right) ", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { location: "right" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $fieldItem = $testContainer.find("." + internals.FIELD_ITEM_CLASS).first();

    //assert
    assert.ok($fieldItem.find("." + internals.FIELD_ITEM_LABEL_CLASS).hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "right"), "check location class");
    assert.ok($fieldItem.hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "Field item contains label that has horizontal align");
});

QUnit.test("Default render with label", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            showColonAfterLabel: true,
            items: [
                {
                    label: { text: "New label" },
                    dataField: "name",
                    editorType: "dxTextBox"

                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.equal($label.text(), "New label:", "text of label");
});

QUnit.test("Colon symbol is not added to label when showColon is disabled for label", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            showColonAfterLabel: true,
            items: [
                {
                    label: { text: "New label", showColon: false },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

    //assert
    assert.equal($label.text(), "New label", "text of label");
});

QUnit.test("Render editor with id attribute", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            form: {
                option: function() {},
                getItemID: function() {
                    return "dx_FormID_name";
                }
            },
            items: [
                {
                    label: { text: "New label" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $input = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor input").first();

    //assert
    assert.equal($input.attr("id"), "dx_FormID_name", "id attr of input");
});

QUnit.test("Render editor by default is data is unknown", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        layoutData: { Name: null }
    });

    //assert
    var $editor = $testContainer.find(".dx-texteditor");
    assert.equal($editor.length, 1, "render 1 editor");
    assert.ok($editor.hasClass("dx-textbox"), "It is dxTextBox by default");
});

QUnit.test("Generate several items in layout", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { text: "label1" },
                    dataField: "name",
                    editorType: "dxTextBox"
                },
                {
                    label: { text: "label2" },
                    dataField: "name",
                    editorType: "dxTextBox"
                },
                {
                    label: { text: "label3" },
                    dataField: "name",
                    editorType: "dxTextBox"
                }
            ]
        }),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);


    //assert
    assert.equal($fieldItems.length, 3, "Render 3 items");
    for(var i = 0; i < 3; i++) {
        var labelCount = i + 1;

        assert.equal($fieldItems.eq(i).find("label").text(), "label" + labelCount, "Label" + labelCount);
    }
});

QUnit.test("Generate several various widgets in layout", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { text: "label1" },
                    dataField: "name",
                    editorType: "dxTextBox"
                },
                {
                    label: { text: "label2" },
                    dataField: "name",
                    editorType: "dxNumberBox"
                },
                {
                    label: { text: "label3" },
                    dataField: "name",
                    editorType: "dxDateBox"
                }
            ]
        }),
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS),
        $dateBox = $fieldItems.eq(2).find(".dx-datebox");


    //assert
    assert.ok($fieldItems.eq(0).find(".dx-textbox").length, "First item is dxTextBox");
    assert.ok($fieldItems.eq(1).find(".dx-numberbox").length, "Second item is dxNumberBox");
    assert.ok($dateBox.length, "Third item is dxDateBox");
    assert.ok($dateBox.width() < $fieldItems.eq(2).width(), "dxDateBox width");
});

QUnit.test("Generate items from layoutData", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date()
        }
    }).data("dxLayoutManager");

    //assert
    assert.deepEqual(layoutManager._items, [
        {
            dataField: "name",
            editorType: "dxTextBox",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        },
        {
            dataField: "active",
            editorType: "dxCheckBox",
            itemType: "simple",
            visibleIndex: 1,
            col: 0
        },
        {
            dataField: "price",
            editorType: "dxNumberBox",
            itemType: "simple",
            visibleIndex: 2,
            col: 0
        },
        {
            dataField: "birthDate",
            editorType: "dxDateBox",
            itemType: "simple",
            visibleIndex: 3,
            col: 0
        }
    ]);
});

QUnit.test("Generate items from layoutData with unacceptable data", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
        layoutData: {
            name: "John",
            wrongField: function() {}
        }
    }).data("dxLayoutManager");

    //assert
    assert.deepEqual(layoutManager._items, [
        {
            dataField: "name",
            editorType: "dxTextBox",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        }
    ]);
});

QUnit.test("Generate items from layoutData and items", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("01/01/2000")
        },
        items: [
            {
                dataField: "active",
                editorType: "dxSwitch"
            },
            {
                dataField: "secondName",
                editorType: "dxTextArea"
            }
        ]
    }).data("dxLayoutManager");

    //assert
    assert.deepEqual(layoutManager._items, [
        {
            dataField: "active",
            editorType: "dxSwitch",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        },
        {
            dataField: "secondName",
            editorType: "dxTextArea",
            itemType: "simple",
            visibleIndex: 1,
            col: 0
        }
    ]);

    assert.deepEqual(
        layoutManager.option("layoutData"),
        {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("01/01/2000")
        },
        "Correct Data"
    );
});

QUnit.test("Check data when generate items from layoutData and items with initial value", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("01/01/2000")
        },
        items: [
            {
                dataField: "active",
                editorType: "dxSwitch"
            },
            {
                dataField: "secondName",
                editorType: "dxTextArea",
                editorOptions: { value: "Test" }
            }
        ]
    }).data("dxLayoutManager");

    //assert
    assert.deepEqual(
        layoutManager.option("layoutData"),
        {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("01/01/2000"),
            secondName: "Test"
        },
        "Correct Data"
    );
});

QUnit.test("Rerender items after change 'items' option", function(assert) {
    //arrange
    var $testContainer = $("#container").dxLayoutManager({
            items: [
                {
                    label: { text: "label1" },
                    dataField: "field1",
                    editorType: "dxTextBox"
                }
            ]
        }),
        layoutManager = $testContainer.dxLayoutManager("instance"),
        $fieldItems;

    //act
    layoutManager.option("items", [
        {
            label: { text: "label1" },
            dataField: "field2",
            editorType: "dxNumberBox"
        },
        {
            label: { text: "label2" },
            dataField: "field3",
            editorType: "dxDateBox"
        }
    ]);

    $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.ok($fieldItems.eq(0).find(".dx-numberbox").length, "First item is dxNumberBox");
    assert.ok($fieldItems.eq(1).find(".dx-datebox").length, "Second item is dxDateBox");
});

QUnit.test("Generate items after change 'layoutData' option", function(assert) {
    //arrange
    var layoutManager = $("#container").dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date()
        }
    }).data("dxLayoutManager");

    //act
    layoutManager.option("layoutData", {
        title: "Test",
        room: 1001,
        startDate: new Date()
    });

    //assert
    assert.deepEqual(layoutManager._items, [
        {
            dataField: "title",
            editorType: "dxTextBox",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        },
        {
            dataField: "room",
            editorType: "dxNumberBox",
            itemType: "simple",
            visibleIndex: 1,
            col: 0
        },
        {
            dataField: "startDate",
            editorType: "dxDateBox",
            itemType: "simple",
            visibleIndex: 2,
            col: 0
        }
    ]);
});

QUnit.test("Set values from layoutData", function(assert) {
    //arrange, act
    var $editors,
        $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("10/10/2010")
        }
    });

    $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

    //assert
    assert.equal($editors.eq(0).data("dxTextBox").option("value"), "Patti", "1 editor");
    assert.equal($editors.eq(1).data("dxCheckBox").option("value"), true, "2 editor");
    assert.equal($editors.eq(2).data("dxNumberBox").option("value"), 1200, "3 editor");
    assert.deepEqual($editors.eq(3).data("dxDateBox").option("value"), new Date("10/10/2010"), "4 editor");
});

QUnit.test("Set value via editor options", function(assert) {
    //arrange, act
    var $editors,
        $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("10/10/2010")
        },
        customizeItem: function(item) {
            if(item.dataField === "price") {
                item.editorOptions = {
                    value: 34
                };
            }
        }
    });

    $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

    //assert
    assert.equal($editors.eq(2).data("dxNumberBox").option("value"), 34);
});

QUnit.test("Change item.visible on customizeItem works correct", function(assert) {
    //arrange, act
    var $editors,
        $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: {
            name: "Michael",
            age: 20
        },
        customizeItem: function(item) {
            if(item.dataField === "name") {
                item.visible = false;
            }
        }
    });

    $editors = $testContainer.find(".dx-texteditor");

    //assert
    assert.equal($editors.length, 1, "There is only one editor");
    assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Age", "Correct field rendered");
});


QUnit.test("CustomizeItem work well after option change", function(assert) {
    //arrange, act
    var $editors,
        $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: {
            name: "Patti",
            gender: true,
            price: 1200,
            birthDate: new Date("10/10/2010")
        }
    });

    $testContainer.dxLayoutManager("instance").option("customizeItem",
        function(item) {
            if(item.dataField === "price") {
                item.editorOptions = {
                    value: 34
                };
            }
        }
    );

    $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

    //assert
    assert.equal($editors.eq(2).data("dxNumberBox").option("value"), 34);
});

QUnit.test("Get value from editor", function(assert) {
    //arrange
    var $editors,
        layoutManager,
        $testContainer = $("#container");

    layoutManager = $testContainer.dxLayoutManager({
        items: [
            {
                dataField: "name",
                editorType: "dxTextBox"
            },
            {
                dataField: "active",
                editorType: "dxCheckBox"
            },
            {
                dataField: "price",
                editorType: "dxNumberBox"
            },
            {
                dataField: "birthDate",
                editorType: "dxDateBox"
            }
        ]
    }).data("dxLayoutManager");

    //act
    $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");
    $editors.eq(0).dxTextBox("instance").option("value", "Fillip");
    $editors.eq(1).data("dxCheckBox").option("value", true);
    $editors.eq(2).data("dxNumberBox").option("value", 7);
    $editors.eq(3).data("dxDateBox").option("value", "10/10/2001");

    //assert
    assert.deepEqual(layoutManager.option("layoutData"), {
        name: "Fillip",
        active: true,
        price: 7,
        birthDate: "10/10/2001"
    });
});

QUnit.test("Editors with object value correctly work with values from data", function(assert) {
    //arrange, act
    var layoutManager,
        $testContainer = $("#container"),
        items = [
            { myText: "test1", number: 1 },
            { myText: "test2", number: 2 },
            { myText: "test3", number: 3 }
        ];

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { testItem: items[1] },
        items: [
            {
                dataField: "testItem",
                editorType: "dxLookup",
                editorOptions: {
                    items: items,
                    displayExpr: "myText"
                }
            }
        ]
    }).data("dxLayoutManager");

    var lookupCurrentItemText = layoutManager.element().find(".dx-lookup-field").text();

    //assert
    assert.equal(lookupCurrentItemText, "test2", "lookup has correct current item");
});

QUnit.test("Change a layoutData object", function(assert) {
    //arrange
    var $editors,
        layoutManager,
        $testContainer = $("#container");

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("10/10/2010")
        },
        customizeItem: function(item) {
            if(item.dataField === "active") {
                item.editorType = "dxSwitch";
            }
        }
    }).data("dxLayoutManager");

    //act
    layoutManager.option("layoutData", {
        name: "Vadim",
        active: null,
        price: 450,
        birthDate: new Date("1/1/2001")
    });

    $editors = $testContainer.find(".dx-texteditor, .dx-switch");

    //assert
    assert.equal($editors.eq(0).data("dxTextBox").option("value"), "Vadim");
    assert.equal($editors.eq(1).data("dxSwitch").option("value"), false);
    assert.equal($editors.eq(2).data("dxNumberBox").option("value"), 450);
    assert.deepEqual($editors.eq(3).data("dxDateBox").option("value"), new Date("1/1/2001"));
});

QUnit.test("A layoutData object change at changing widget from items option", function(assert) {
    //arrange
    var layoutManager,
        $testContainer = $("#container");

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("10/10/2010")
        },
        items: [{ dataField: "subscribe", editorType: "dxCheckBox" }]
    }).data("dxLayoutManager");

    //act
    $testContainer.find(".dx-checkbox").dxCheckBox("instance").option("value", true);

    //assert
    assert.deepEqual(layoutManager.option("layoutData"), {
        name: "Patti",
        active: true,
        price: 1200,
        birthDate: new Date("10/10/2010"),
        subscribe: true
    }, "Custom field data updated");
});

QUnit.test("A layoutData is not changed when dataField is undefined_T310737", function(assert) {
    //arrange
    var layoutManager,
        $testContainer = $("#container");

    layoutManager = $testContainer.dxLayoutManager({
        items: [
            {
                editorType: "dxTextBox"
            },
            {
                editorType: "dxTextBox"
            },
            {
                editorType: "dxTextBox"
            }]
    }).data("dxLayoutManager");

    var $textBoxes = $testContainer.find(".dx-textbox"),
        textBoxes = [];

    //act
    textBoxes[0] = $textBoxes.eq(0).dxTextBox("instance");
    textBoxes[1] = $textBoxes.eq(1).dxTextBox("instance");
    textBoxes[2] = $textBoxes.eq(2).dxTextBox("instance");

    textBoxes[0].option("value", "test1");
    textBoxes[1].option("value", "test2");
    textBoxes[2].option("value", "test3");

    //assert
    assert.deepEqual(layoutManager.option("layoutData"), {}, "layout data");
    assert.equal(textBoxes[0].option("value"), "test1", "editor 1");
    assert.equal(textBoxes[1].option("value"), "test2", "editor 2");
    assert.equal(textBoxes[2].option("value"), "test3", "editor 3");
});

QUnit.test("Set 'disabled' option to layoutManager and check internal element state", function(assert) {
    //arrange
    var $editors,
        $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("10/10/2010")
        }
    });

    //act
    $testContainer.dxLayoutManager("instance").option("disabled", true);
    $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

    //assert
    assert.equal($editors.eq(0).data("dxTextBox").option("disabled"), true);
    assert.equal($editors.eq(1).data("dxCheckBox").option("disabled"), true);
    assert.equal($editors.eq(2).data("dxNumberBox").option("disabled"), true);
    assert.equal($editors.eq(3).data("dxDateBox").option("disabled"), true);
});

QUnit.test("Label creates when item has no name but has 'label.text' option", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        $label;

    $testContainer.dxLayoutManager({
        items: [{ editorType: "dxTextBox", label: { text: "NewLabel" } }]
    });

    $label = $testContainer.find("label");

    //assert
    assert.ok($label.length, "Editor has label");
    assert.equal($label.text(), "NewLabel", "Correct label's text");
});

QUnit.test("Render field items from fieldData and items", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { name: "Patti" },
        items: [{ editorType: "dxButton" }]
    }).dxLayoutManager("instance");

    //assert
    assert.equal(layoutManager._items.length, 1, "LayoutManager has 2 fields");
    assert.ok($testContainer.find(".dx-button").length, "Form has button");
});

QUnit.test("Render field items from fieldData and items when fieldData is a complex object", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        complexObject = {
            CTO: { name: "Alex", age: 40 },
            CEO: { name: "George", age: 34 }
        },
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: complexObject,
        items: [{ dataField: "CTO.name", editorType: "dxTextBox" }, { dataField: "CEO.name", editorType: "dxTextBox" }]
    }).dxLayoutManager("instance");

    var $labels = $testContainer.find("label"),
        $inputs = $testContainer.find("input");

    //assert
    assert.equal(layoutManager._items.length, 2, "LayoutManager has 2 fields");

    assert.equal($labels.length, 2, "Form has 2 labels");
    assert.equal($labels.eq(0).text(), "CTO name", "First label text");
    assert.equal($labels.eq(1).text(), "CEO name", "Second label text");


    assert.equal($inputs.length, 2, "Form has 2 inputs");
    assert.equal($inputs.eq(0).val(), "Alex", "First input value");
    assert.equal($inputs.eq(1).val(), "George", "Second input value");
});

QUnit.test("Render field items from fieldData and items when fieldData is a complex object and custom label text", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        complexObject = {
            CTO: { name: "Alex", age: 40 },
            CEO: { name: "George", age: 34 }
        },
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: complexObject,
        items: [{ dataField: "CTO.name", label: { text: "The smartest CTO" } }, { dataField: "CEO.name", label: { text: "The best CEO" }, editorType: "dxTextBox" }]
    }).dxLayoutManager("instance");

    var $labels = $testContainer.find("label"),
        $inputs = $testContainer.find("input");

    //assert
    assert.equal(layoutManager._items.length, 2, "LayoutManager has 2 fields");

    assert.equal($labels.length, 2, "Form has 2 labels");
    assert.equal($labels.eq(0).text(), "The smartest CTO", "First label text");
    assert.equal($labels.eq(1).text(), "The best CEO", "Second label text");


    assert.equal($inputs.length, 2, "Form has 2 inputs");
    assert.equal($inputs.eq(0).val(), "Alex", "First input value");
    assert.equal($inputs.eq(1).val(), "George", "Second input value");
});

QUnit.test("Render help text", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { name: "Alex", lastName: "Johnson", state: "CA" },
        items: [
            { dataField: "name", helpText: "Type a name" },
            { dataField: "lastName" }
        ]
    }).dxLayoutManager("instance");

    var $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.eq(0).find("." + internals.FIELD_ITEM_CONTENT_WRAPPER_CLASS).length, 1, "First field item has widget wrapper");
    assert.equal($fieldItems.eq(0).find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).length, 1, "First field item has help text element");
    assert.equal($fieldItems.eq(0).find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).text(), "Type a name", "Correct help text");

    assert.equal($fieldItems.eq(1).find("." + internals.FIELD_ITEM_CONTENT_WRAPPER_CLASS).length, 0, "Second field item has't widget wrapper");
    assert.equal($fieldItems.eq(1).find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).length, 0, "Second field item has't help text element");
});

QUnit.test("Change the order of items", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        data = {
            name: "Alex",
            age: 40,
            gender: "male"
        },
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: data,
        items: [
            { visibleIndex: 1, dataField: "name", editorType: "dxTextBox" },
            { visibleIndex: 2, dataField: "age", editorType: "dxTextBox" },
            { visibleIndex: 0, dataField: "gender", editorType: "dxTextBox" }
        ]
    }).dxLayoutManager("instance");

    var $labels = $testContainer.find("label"),
        $inputs = $testContainer.find("input");

    //assert
    assert.equal($labels.length, 3, "Form has 3 labels");
    assert.equal($labels.eq(0).text(), "Gender", "First label text");
    assert.equal($labels.eq(1).text(), "Name", "Second label text");
    assert.equal($labels.eq(2).text(), "Age", "Second label text");

    assert.equal($inputs.length, 3, "Form has 3 inputs");
    assert.equal($inputs.eq(0).val(), "male", "First input value");
    assert.equal($inputs.eq(1).val(), "Alex", "Second input value");
    assert.equal($inputs.eq(2).val(), "40", "First input value");
});

QUnit.test("Change the order of items with items without visibleIndex", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        data = {
            name: "Alex",
            age: 40,
            gender: "male",
            hasAuto: "Yes"
        },
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: data,
        items: [
            { dataField: "name", editorType: "dxTextBox" },
            { visibleIndex: 1, dataField: "age", editorType: "dxTextBox" },
            { dataField: "gender", editorType: "dxTextBox" },
            { visibleIndex: 2, dataField: "hasAuto", editorType: "dxTextBox" }
        ]
    }).dxLayoutManager("instance");

    var $labels = $testContainer.find("label"),
        $inputs = $testContainer.find("input");

    //assert
    assert.equal($labels.length, 4, "Form has 4 labels");
    assert.equal($labels.eq(0).text(), "Age", "First label text");
    assert.equal($labels.eq(1).text(), "Has Auto", "Second label text");
    assert.equal($labels.eq(2).text(), "Name", "Third label text");
    assert.equal($labels.eq(3).text(), "Gender", "Fourth label text");

    assert.equal($inputs.eq(0).val(), "40", "First input value");
    assert.equal($inputs.eq(1).val(), "Yes", "Second input value");
    assert.equal($inputs.eq(2).val(), "Alex", "Second input value");
    assert.equal($inputs.eq(3).val(), "male", "Second input value");
});

QUnit.test("Editor type for items where this option is not defined", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        layoutManager,
        consoleErrorStub = sinon.stub(consoleUtils.logger, "error");

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { name: "Patti" },
        items: [{ dataField: "name" }, { name: "Test Name" }]
    }).dxLayoutManager("instance");

    //assert
    assert.equal(layoutManager._items.length, 2, "items count");
    assert.equal(layoutManager._items[0].editorType, "dxTextBox", "1 item");
    assert.equal(layoutManager._items[1].editorType, undefined, "2 item has no dataField");
    assert.equal(consoleErrorStub.callCount, 1, "error was raised for item without dataField and editorType");
    consoleErrorStub.restore();
});

QUnit.test("Error is displayed in console when editorType is unsupported", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        errorMessage,
        _error = consoleUtils.logger.log;

    consoleUtils.logger.error = function(message) {
        errorMessage = message;
    };

    $testContainer.dxLayoutManager({
        layoutData: createTestObject(),
        items: [{ dataField: "Position" }, { name: "test" }]
    }).dxLayoutManager("instance");

    //assert
    assert.equal(errorMessage.indexOf("E1035 - The editor cannot be created because of an internal error"), 0);
    assert.ok(errorMessage.indexOf("See:\nhttp://js.devexpress.com/error/") > 0);

    consoleUtils.logger.error = _error;
});

QUnit.test("Form with dxRadioGroup that items are defined via 'dataSource' option renders without error", function(assert) {
    //arrange
    var $testContainer = $("#container"),
        errorMessage,
        _error = consoleUtils.logger.log;

    //act
    try {
        consoleUtils.logger.error = function(message) {
            errorMessage = message;
        };

        $testContainer.dxLayoutManager({
            items: [{
                dataField: "test1",
                editorType: "dxRadioGroup",
                editorOptions: {
                    dataSource: [1, 2, 3]
                }
            }]
        });

        //assert
        assert.ok(!errorMessage, "There is no error");
    } finally {
        consoleUtils.logger.error = _error;
    }
});

QUnit.test("Set value to the dxSelectBox editor from data option", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        selectBox,
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { simpleProducts: "SuperLCD 70" },
        customizeItem: function(item) {
            item.editorType = "dxSelectBox";
            item.editorOptions = {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            };
        }
    }).dxLayoutManager("instance");

    selectBox = $testContainer.find(".dx-selectbox").first().dxSelectBox("instance");

    //assert
    assert.deepEqual(selectBox.option("value"), "SuperLCD 70");
});

QUnit.test("Set default value to the dxSelectBox editor when dataField is not contained in a formData", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        selectBox;

    $testContainer.dxLayoutManager({
        layoutData: { name: "Test" },
        items: ["Test", {
            dataField: "simpleProducts",
            editorType: "dxSelectBox",
            editorOptions: {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            }
        }]
    });

    selectBox = $testContainer.find(".dx-selectbox").first().dxSelectBox("instance");

    //assert
    assert.deepEqual(selectBox.option("value"), undefined);
});

QUnit.test("Update value in dxSelectBox editor when data option is changed", function(assert) {
    //arrange
    var $testContainer = $("#container"),
        selectBox,
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { simpleProducts: "SuperLCD 70" },
        customizeItem: function(item) {
            item.editorType = "dxSelectBox";
            item.editorOptions = {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            };
        }
    }).dxLayoutManager("instance");

    //act
    layoutManager.updateData("simpleProducts", "SuperLED 50");

    selectBox = $testContainer.find(".dx-selectbox").first().dxSelectBox("instance");

    //assert
    assert.deepEqual(selectBox.option("value"), "SuperLED 50");
    assert.ok(!layoutManager._isFieldValueChanged);
});

QUnit.test("Update data option of layout manager when value is changed in the dxSelectBox editor", function(assert) {
    //arrange
    var $testContainer = $("#container"),
        selectBox,
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { simpleProducts: "SuperLCD 70" },
        customizeItem: function(item) {
            item.editorType = "dxSelectBox";
            item.editorOptions = {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            };
        }
    }).dxLayoutManager("instance");

    //act
    selectBox = $testContainer.find(".dx-selectbox").first().dxSelectBox("instance");
    selectBox.option("value", "SuperPlasma 50");

    //assert
    assert.deepEqual(layoutManager.option("layoutData.simpleProducts"), "SuperPlasma 50");
    assert.ok(!layoutManager._isValueChangedCalled);
});

QUnit.test("Set value to the dxTagBox editor from data option", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        tagBox,
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { simpleProducts: ["HD Video Player", "SuperLCD 70"] },
        customizeItem: function(item) {
            item.editorType = "dxTagBox";
            item.editorOptions = {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            };
        }
    }).dxLayoutManager("instance");

    tagBox = $testContainer.find(".dx-tagbox").first().data("dxTagBox");

    //assert
    assert.deepEqual(tagBox.option("value"), ["HD Video Player", "SuperLCD 70"]);
});

QUnit.test("Set default value to the dxTagBox editor when dataField is not contained in a formData", function(assert) {
    //arrange, act
    var $testContainer = $("#container"),
        tagBox;

    $testContainer.dxLayoutManager({
        layoutData: { name: "Test" },
        items: ["Test", {
            dataField: "simpleProducts",
            editorType: "dxTagBox",
            editorOptions: {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            }
        }]
    });

    tagBox = $testContainer.find(".dx-tagbox").first().data("dxTagBox");

    //assert
    assert.deepEqual(tagBox.option("value"), []);
});

QUnit.test("Update value in dxTagBox editor when data option is changed", function(assert) {
    //arrange
    var $testContainer = $("#container"),
        tagBox,
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { simpleProducts: ["HD Video Player", "SuperLCD 70"] },
        customizeItem: function(item) {
            item.editorType = "dxTagBox";
            item.editorOptions = {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            };
        }
    }).dxLayoutManager("instance");

    //act
    layoutManager.updateData("simpleProducts", ["SuperLED 50", "SuperLCD 70", "SuperLCD 55"]);

    tagBox = $testContainer.find(".dx-tagbox").first().data("dxTagBox");

    //assert
    assert.deepEqual(tagBox.option("value"), ["SuperLED 50", "SuperLCD 70", "SuperLCD 55"]);
    assert.ok(!layoutManager._isFieldValueChanged);
});

QUnit.test("Update data option of layout manager when value is changed in the dxTagBox editor", function(assert) {
    //arrange
    var $testContainer = $("#container"),
        tagBox,
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { simpleProducts: ["HD Video Player", "SuperLCD 70"] },
        customizeItem: function(item) {
            item.editorType = "dxTagBox";
            item.editorOptions = {
                dataSource: [
                    "HD Video Player",
                    "SuperHD Video Player",
                    "SuperPlasma 50",
                    "SuperLED 50",
                    "SuperLED 42",
                    "SuperLCD 55",
                    "SuperLCD 42",
                    "SuperPlasma 65",
                    "SuperLCD 70"
                ]
            };
        }
    }).dxLayoutManager("instance");

    //act
    tagBox = $testContainer.find(".dx-tagbox").first().data("dxTagBox");
    tagBox.option("value", ["SuperLCD 42", "SuperPlasma 50"]);

    //assert
    assert.deepEqual(layoutManager.option("layoutData.simpleProducts"), ["SuperLCD 42", "SuperPlasma 50"]);
    assert.ok(!layoutManager._isValueChangedCalled);
});

QUnit.test("Update editor with nested dataField when layoutData changed", function(assert) {
    //arrange
    var $testContainer = $("#container"),
        layoutManager;

    layoutManager = $testContainer.dxLayoutManager({
        layoutData: { personalInfo: { firstName: "John" } },
        items: ["personalInfo.firstName"]
    }).dxLayoutManager("instance");

    //act
    layoutManager.option("layoutData", { personalInfo: { firstName: "Jane" } });

    //assert
    assert.equal(layoutManager.getEditor("personalInfo.firstName").option("value"), "Jane", "Editor is up to date");
});

QUnit.test("Render empty item", function(assert) {
    //arrange, act
    var $testContainer = $("#container").dxLayoutManager({
        formData: {
            name: "Test Name",
            profession: "Test profession"
        },
        items: ["name", {
            itemType: "empty"
        }, "profession"]
    });

    //assert
    assert.equal($testContainer.find("." + internals.FIELD_EMPTY_ITEM_CLASS).length, 1);
});

function triggerKeyUp($element, keyCode) {
    var e = $.Event("keyup");
    e.which = keyCode;
    $element.find("input").first().trigger(e);
}

QUnit.test("onEditorEnterKey", function(assert) {
    //arrange
    var testArgs,
        editor,
        layoutManager;

    layoutManager = $("#container").dxLayoutManager({
        layoutData: {
            name: "Test Name",
            profession: "Test profession"
        },
        onEditorEnterKey: function(args) {
            testArgs = args;
        }
    }).data("dxLayoutManager");

    //act
    editor = layoutManager.getEditor("profession");
    triggerKeyUp(editor.element(), 13);

    //assert
    assert.notEqual(testArgs.component, undefined, "component");
    assert.notEqual(testArgs.element, undefined, "element");
    assert.notEqual(testArgs.jQueryEvent, undefined, "jQueryEvent");
    assert.equal(testArgs.dataField, "profession", "dataField");
    assert.equal(testArgs.component.NAME, "dxLayoutManager", "correct component");

    //act
    editor = layoutManager.getEditor("name");
    triggerKeyUp(editor.element(), 13);

    //assert
    assert.notEqual(testArgs.component, undefined, "component");
    assert.notEqual(testArgs.element, undefined, "element");
    assert.notEqual(testArgs.jQueryEvent, undefined, "jQueryEvent");
    assert.equal(testArgs.dataField, "name", "dataField");
});



QUnit.module("Render multiple columns");

QUnit.test("Render layoutManager with 2 columns", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 2,
            height: 800
        }).data("dxLayoutManager"),
        responsiveBox = $("#container").find(".dx-responsivebox").dxResponsiveBox("instance"),
        boxItems = responsiveBox.option("items");

    //assert
    assert.equal(layoutManager._items.length, $("#container .dx-texteditor").length, "generated items");
    assert.deepEqual(boxItems[0].location, { col: 0, row: 0 }, "col 0 row 0");
    assert.deepEqual(boxItems[1].location, { col: 1, row: 0 }, "col 1 row 0");
    assert.deepEqual(boxItems[2].location, { col: 0, row: 1 }, "col 0 row 1");
    assert.deepEqual(boxItems[3].location, { col: 1, row: 1 }, "col 1 row 1");
    assert.deepEqual(boxItems[4].location, { col: 0, row: 2 }, "col 0 row 2");
    assert.deepEqual(boxItems[5].location, { col: 1, row: 2 }, "col 1 row 2");
    assert.deepEqual(boxItems[6].location, { col: 0, row: 3 }, "col 0 row 3");
    assert.deepEqual(boxItems[7].location, { col: 1, row: 3 }, "col 1 row 3");
    assert.deepEqual(boxItems[8].location, { col: 0, row: 4 }, "col 0 row 4");
    assert.deepEqual(boxItems[9].location, { col: 1, row: 4 }, "col 1 row 4");
    assert.deepEqual(boxItems[10].location, { col: 0, row: 5 }, "col 0 row 5");
});

QUnit.test("Render layout items in order", function(assert) {
    //arrange, act
    $("#container").dxLayoutManager({
        layoutData: {
            name: "Patti",
            address: "Test town",
            room: 101,
            gender: "male",
            id: "test id"
        },
        colCount: 2,
        height: 800
    });
    var $labels = $("#container .dx-responsivebox label"),
        $editors = $("#container .dx-responsivebox .dx-texteditor-input");


    //assert
    assert.equal($labels.eq(0).text(), "Name", "0 label");
    assert.equal($labels.eq(1).text(), "Address", "1 label");
    assert.equal($labels.eq(2).text(), "Room", "2 label");
    assert.equal($labels.eq(3).text(), "Gender", "3 label");
    assert.equal($labels.eq(4).text(), "Id", "4 label");

    assert.equal($editors.eq(0).val(), "Patti", "0 input");
    assert.equal($editors.eq(1).val(), "Test town", "1 input");
    assert.equal($editors.eq(2).val(), "101", "2 input");
    assert.equal($editors.eq(3).val(), "male", "3 input");
    assert.equal($editors.eq(4).val(), "test id", "4 input");
});

QUnit.test("Check that layoutManager create correct rows count", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
        layoutData: createTestObject(),
        colCount: 2,
        height: 800
    }).data("dxLayoutManager");

    //assert
    assert.equal(layoutManager._getRowsCount(), 6, "11 items / 2 columns = 6 rows");
});

QUnit.test("Check rows and cols in responsiveBox", function(assert) {
    //arrange, act
    $("#container").dxLayoutManager({
        layoutData: createTestObject(),
        colCount: 2,
        height: 800
    });

    var responsiveBox = $("#container").find(".dx-responsivebox").dxResponsiveBox("instance");

    //assert
    assert.equal(responsiveBox.option("cols").length, 2, "cols count");
    assert.equal(responsiveBox.option("rows").length, 6, "rows count");
});

QUnit.test("Prepare items for col span", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 4,
            height: 800,
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
        }).data("dxLayoutManager"),
        items = layoutManager._items;


    //assert
    assert.equal(items.length, 15, "items count");
    assert.deepEqual(items[0], { dataField: "ID", editorType: "dxNumberBox", visibleIndex: 0, col: 0, itemType: "simple" }, "0 item");
    assert.deepEqual(items[1], { dataField: "FirstName", colSpan: 2, editorType: "dxTextBox", visibleIndex: 1, col: 1, itemType: "simple" }, "1 item");
    assert.deepEqual(items[2], { merged: true }, "2 item, merged");
    assert.deepEqual(items[3], { dataField: "LastName", editorType: "dxTextBox", visibleIndex: 2, col: 3, itemType: "simple" }, "3 item");
    assert.deepEqual(items[4], { dataField: "Prefix", colSpan: 4, editorType: "dxTextBox", visibleIndex: 3, col: 0, itemType: "simple" }, "5 item");
    assert.deepEqual(items[5], { merged: true }, "6 item, merged");
    assert.deepEqual(items[6], { merged: true }, "7 item, merged");
    assert.deepEqual(items[7], { merged: true }, "8 item, merged");
    assert.deepEqual(items[8], { dataField: "Position", editorType: "dxTextBox", visibleIndex: 4, col: 0, itemType: "simple" }, "9 item");
    assert.deepEqual(items[9], { dataField: "Picture", editorType: "dxTextBox", visibleIndex: 5, col: 1, itemType: "simple" }, "10 item");
    assert.deepEqual(items[10], { dataField: "BirthDate", editorType: "dxTextBox", visibleIndex: 6, col: 2, itemType: "simple" }, "11 item");
    assert.deepEqual(items[11], { dataField: "HireDate", editorType: "dxTextBox", visibleIndex: 7, col: 3, itemType: "simple" }, "12 item");
    assert.deepEqual(items[12], { dataField: "Notes", editorType: "dxTextBox", visibleIndex: 8, col: 0, itemType: "simple" }, "13 item");
    assert.deepEqual(items[13], { dataField: "Address", editorType: "dxTextBox", visibleIndex: 9, col: 1, itemType: "simple" }, "14 item");
    assert.deepEqual(items[14], { dataField: "StateID", editorType: "dxNumberBox", visibleIndex: 10, col: 2, itemType: "simple" }, "15 item");
});

QUnit.test("Generate layout items for col span", function(assert) {
    //arrange, act
    $("#container").dxLayoutManager({
        layoutData: createTestObject(),
        colCount: 4,
        height: 800,
        customizeItem: function(item) {
            switch(item.dataField) {
                case "LastName":
                case "FirstName":
                    item.colSpan = 2;
                    break;
                case "Prefix":
                    item.colSpan = 4;
                    break;
                case "StateID":
                    item.colSpan = 3;
                    break;
            }
        }
    }).data("dxLayoutManager");

    var responsiveBox = $(".dx-responsivebox").data("dxResponsiveBox"),
        items = responsiveBox.option("items");


    //assert
    assert.equal(items.length, 11, "responsiveBox items count");
    assert.equal(items[0].location.colspan, undefined, "ID has no colSpan");
    assert.equal(items[1].location.colspan, 2, "FirstName has colSpan");
    assert.equal(items[2].location.colspan, undefined, "LastName has no colSpan");
    assert.equal(items[3].location.colspan, 4, "Prefix has colSpan");
    assert.equal(items[4].location.colspan, undefined, "Position has no colSpan");
    assert.equal(items[5].location.colspan, undefined, "Picture has no colSpan");
    assert.equal(items[6].location.colspan, undefined, "BirthDate has no colSpan");
    assert.equal(items[7].location.colspan, undefined, "HireDate has no colSpan");
    assert.equal(items[8].location.colspan, undefined, "Notes has no colSpan");
    assert.equal(items[9].location.colspan, undefined, "Address has no colSpan");
    assert.equal(items[10].location.colspan, undefined, "StateID has no colSpan");
});

QUnit.test("Prepare items for col span when labelLocation is 'top' (T307223)", function(assert) {
    //arrange, act
    var layoutManager = $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 4,
            labelLocation: "top",
            height: 800,
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
        }).data("dxLayoutManager"),
        items = layoutManager._items;


    //assert
    assert.equal(items.length, 15, "items count");
    assert.deepEqual(items[0], { dataField: "ID", editorType: "dxNumberBox", visibleIndex: 0, col: 0, itemType: "simple" }, "0 item");
    assert.deepEqual(items[1], { dataField: "FirstName", colSpan: 2, editorType: "dxTextBox", visibleIndex: 1, col: 1, itemType: "simple" }, "1 item");
    assert.deepEqual(items[2], { merged: true }, "2 item, merged");
    assert.deepEqual(items[3], { dataField: "LastName", editorType: "dxTextBox", visibleIndex: 2, col: 3, itemType: "simple" }, "3 item");
    assert.deepEqual(items[4], { dataField: "Prefix", colSpan: 4, editorType: "dxTextBox", visibleIndex: 3, col: 0, itemType: "simple" }, "5 item");
    assert.deepEqual(items[5], { merged: true }, "6 item, merged");
    assert.deepEqual(items[6], { merged: true }, "7 item, merged");
    assert.deepEqual(items[7], { merged: true }, "8 item, merged");
    assert.deepEqual(items[8], { dataField: "Position", editorType: "dxTextBox", visibleIndex: 4, col: 0, itemType: "simple" }, "9 item");
    assert.deepEqual(items[9], { dataField: "Picture", editorType: "dxTextBox", visibleIndex: 5, col: 1, itemType: "simple" }, "10 item");
    assert.deepEqual(items[10], { dataField: "BirthDate", editorType: "dxTextBox", visibleIndex: 6, col: 2, itemType: "simple" }, "11 item");
    assert.deepEqual(items[11], { dataField: "HireDate", editorType: "dxTextBox", visibleIndex: 7, col: 3, itemType: "simple" }, "12 item");
    assert.deepEqual(items[12], { dataField: "Notes", editorType: "dxTextBox", visibleIndex: 8, col: 0, itemType: "simple" }, "13 item");
    assert.deepEqual(items[13], { dataField: "Address", editorType: "dxTextBox", visibleIndex: 9, col: 1, itemType: "simple" }, "14 item");
    assert.deepEqual(items[14], { dataField: "StateID", editorType: "dxNumberBox", visibleIndex: 10, col: 2, itemType: "simple" }, "15 item");
});

QUnit.test("Generate rows ratio for col span", function(assert) {
    //arrange, act
    $("#container").dxLayoutManager({
        layoutData: createTestObject(),
        colCount: 4,
        height: 800,
        customizeItem: function(item) {
            switch(item.dataField) {
                case "LastName":
                case "FirstName":
                    item.colSpan = 2;
                    break;
                case "Prefix":
                    item.colSpan = 4;
                    break;
                case "StateID":
                    item.colSpan = 3;
                    break;
            }
        }
    }).data("dxLayoutManager");

    var responsiveBox = $(".dx-responsivebox").data("dxResponsiveBox"),
        rows = responsiveBox.option("rows");


    //assert
    assert.equal(rows.length, 4);
});

QUnit.test("Change of editor's value changing 'layoutData' option", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: { FamousPirate: "John Morgan" }
    });

    //act
    $testContainer.find(".dx-textbox").dxTextBox("instance").option("value", "Cpt. Jack Sparrow");

    //assert
    assert.deepEqual($testContainer.dxLayoutManager("instance").option("layoutData"), { FamousPirate: "Cpt. Jack Sparrow" }, "Correct layoutData");
});

QUnit.test("Change of editor's value changing 'items.editorOptions.value' option", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        items: [{ dataField: "FamousPirate", editorType: "dxTextBox", editorOptions: { value: "John Morgan" } }]
    });

    //act
    $testContainer.find(".dx-textbox").dxTextBox("instance").option("value", "Cpt. Jack Sparrow");

    //assert
    assert.deepEqual($testContainer.dxLayoutManager("instance").option("layoutData"), { "FamousPirate": "Cpt. Jack Sparrow" }, "Correct layoutData");
});

QUnit.test("Render when 'colCount' is 'auto' and have 1 item", function(assert) {
    //arrange
    var $testContainer = $("#container").width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test: "abc" },
        colCount: "auto",
        minColWidth: 200
    });

    //act
    var instance = $testContainer.dxLayoutManager("instance"),
        colCount = instance._getColCount();

    //assert
    assert.equal(colCount, 1, "We have only 1 column, because have only one item");
});

QUnit.test("Correct colCount when width is less that minColWidth and colCount is auto", function(assert) {
    //arrange
    var $testContainer = $("#container").width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test: "abc" },
        colCount: "auto",
        minColWidth: 200,
        width: 100
    });

    //act
    var instance = $testContainer.dxLayoutManager("instance"),
        colCount = instance._getColCount();

    //assert
    assert.equal(colCount, 1, "Correct colCount");
});

QUnit.test("Render when 'colCount' is 'auto' and have 3 items", function(assert) {
    //arrange
    var $testContainer = $("#container").width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "qwe", test3: "xyz" },
        colCount: "auto",
        minColWidth: 200
    });

    //act
    var instance = $testContainer.dxLayoutManager("instance"),
        colCount = instance._getColCount();

    //assert
    assert.equal(colCount, 2, "We have only 2 columns");
});

QUnit.test("Change from fixed colCount to auto and vice versa", function(assert) {
    //arrange
    var $testContainer = $("#container").width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "qwe", test3: "xyz" },
        colCount: 1,
        minColWidth: 200
    });

    //act
    var instance = $testContainer.dxLayoutManager("instance");

    //assert
    assert.equal(instance._getColCount(), 1, "We have only 1 column");

    instance.option("colCount", "auto");
    assert.equal(instance._getColCount(), 2, "We have only 2 columns");

    instance.option("colCount", 3);
    assert.equal(instance._getColCount(), 3, "We have only 3 columns");
});

QUnit.test("Change minColWidth when colCount is auto", function(assert) {
    //arrange
    var $testContainer = $("#container").width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "qwe", test3: "xyz" },
        colCount: 1,
        minColWidth: 200
    });

    //act
    var instance = $testContainer.dxLayoutManager("instance"),
        invalidateStub = sinon.stub(instance, "_invalidate");

    instance.option("minColWidth", 100);
    assert.equal(invalidateStub.callCount, 0, "Invalidate is not fired, because colCount is not auto");


    instance.option("colCount", "auto");
    instance.option("minColWidth", 300);

    assert.equal(instance._getColCount(), 1, "We have only 1 column");
    assert.equal(invalidateStub.callCount, 2, "Invalidate fire 2 times, change colCount and change minColWidth");
    invalidateStub.restore();
});

QUnit.test("Clear item watchers after repaint", function(assert) {
    //arrange
    var $testContainer = $("#container").width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "qwe", test3: "xyz" },
        colCount: 1,
        minColWidth: 200
    });

    //act
    var instance = $testContainer.dxLayoutManager("instance"),
        cleanWatcherStub = sinon.stub(instance, "_cleanItemWatchers");

    instance.repaint();
    assert.equal(cleanWatcherStub.callCount, 1, "_cleanItemWatchers is fired");

    cleanWatcherStub.restore();
});

QUnit.test("Render validate", function(assert) {
    //arrange, act
    var $container = $("#container");

    $container.dxLayoutManager({
        layoutData: createTestObject(),
        colCount: 4,
        height: 800,
        form: {
            option: function() {},
            getItemID: function(name) {
                return "dx_FormID_" + name;
            }
        },
        customizeItem: function(item) {
            switch(item.dataField) {
                case "LastName":
                case "FirstName":
                    item.editorOptions = {
                        value: ""
                    };
                    item.validationRules = [
                        {
                            type: "required"
                        }
                    ];
                    break;
            }
        }
    });

    //assert
    assert.equal($container.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, 2, "2 validation marks rendered");

    assert.equal($container.find(".dx-validator [id='dx_FormID_LastName']").length, 1, "validator for lastName");
    assert.equal($container.find(".dx-validator [id='dx_FormID_FirstName']").length, 1, "validator for lastName");
});

QUnit.test("Validation rules and required marks render", function(assert) {
    //arrange, act
    var $container = $("#container");

    $container.dxLayoutManager({
        layoutData: { field1: 3, field2: 4, field3: 6, field4: 6 },
        colCount: 4,
        height: 800,
        items: [
            { dataField: "field1", validationRules: [{ type: "numeric" }] },
            { dataField: "field2", validationRules: [{ type: "numeric" }, { type: "required" }] },
            { dataField: "field3", validationRules: [{ type: "required" }, { type: "numeric" }] },
            { dataField: "field4", validationRules: [{ type: "required" }] }
        ]
    });

    //assert
    assert.equal($container.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, 3, "3 required marks rendered");
    assert.equal($container.find("." + internals.FIELD_ITEM_CLASS).first().find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, 0, "First item does not have required mark");
});

QUnit.module("Templates");

QUnit.test("Render template", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: { test: "abc" },
        items: [{
            dataField: "test",
            template: function(data, $container) {
                $container.append($("<span>").text("Template"));

                data.editorOptions.onValueChanged = function(args) {
                    data.component.option("layoutData." + data.dataField, args.value);
                };

                $("<div>")
                    .dxTextArea(data.editorOptions)
                    .appendTo($container);
            }
        }]
    });

    //act
    var $fieldItemWidget = $testContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS),
        spanText = $fieldItemWidget.find("span").text(),
        textArea = $fieldItemWidget.find(".dx-textarea").dxTextArea("instance"),
        layoutManager = $testContainer.dxLayoutManager("instance");

    //assert
    assert.equal(spanText, "Template");
    assert.equal(textArea.option("value"), layoutManager.option("layoutData.test"), "Widget's value equal to bound datafield");
});

QUnit.test("Check template bound to data", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: { test: "abc" },
        items: [{
            dataField: "test",
            template: function(data, $container) {
                $container.append($("<span>").text("Template"));

                data.editorOptions.onValueChanged = function(args) {
                    data.component.option("layoutData." + data.dataField, args.value);
                };

                $("<div>")
                    .dxTextArea(data.editorOptions)
                    .appendTo($container);
            }
        }]
    });

    //act
    var $fieldItemWidget = $testContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS),
        textArea = $fieldItemWidget.find(".dx-textarea").dxTextArea("instance"),
        layoutManager = $testContainer.dxLayoutManager("instance");

    textArea.option("value", "qwerty");

    //assert
    assert.equal(layoutManager.option("layoutData.test"), "qwerty", "Correct data");
});

QUnit.module("Public methods");

QUnit.test("UpdateData, simple case", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "xyz" }
    });

    //act
    var layoutManager = $testContainer.dxLayoutManager("instance");

    layoutManager.updateData("test2", "qwerty");

    //assert
    assert.equal(layoutManager.option("layoutData.test2"), "qwerty", "Correct data");
});

QUnit.test("UpdateData, update with object", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "xyz" }
    });

    //act
    var layoutManager = $testContainer.dxLayoutManager("instance");

    layoutManager.updateData({ test1: "xyz", test2: "qwerty" });

    //assert
    assert.deepEqual(layoutManager.option("layoutData"), { test1: "xyz", test2: "qwerty" }, "Correct data");
});

QUnit.test("Get editor instance", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        layoutData: { test1: "abc", test2: "xyz" },
        items: ["test1", { name: "test3", editorType: "dxNumberBox" }]
    });

    //act
    var layoutManager = $testContainer.dxLayoutManager("instance");

    //assert
    assert.ok(!utils.isDefined(layoutManager.getEditor("test2")), "We has't instance for 'test2' field");
    assert.ok(utils.isDefined(layoutManager.getEditor("test1")), "We have instance for 'test1' field");
    assert.ok(utils.isDefined(layoutManager.getEditor("test3")), "We have instance for 'test3' field");

    assert.equal(layoutManager.getEditor("test1").NAME, "dxTextBox", "It's textbox");
    assert.equal(layoutManager.getEditor("test3").NAME, "dxNumberBox", "It's numberBox");
});

QUnit.module("Accessibility");

QUnit.test("Check required state", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        items: ["test1", { dataField: "test2", isRequired: true }]
    });

    //act
    var $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

    //assert
    assert.equal($fieldItems.first().find("input").attr("aria-required"), "false", "First item isn't required");
    assert.equal($fieldItems.last().find("input").attr("aria-required"), "true", "Second item is required");
});

QUnit.test("Check help text", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        items: [{ dataField: "test1", helpText: "help text" }]
    });

    //act
    var $fieldItem = $testContainer.find("." + internals.FIELD_ITEM_CLASS),
        itemDescribedBy = $fieldItem.find("input").attr("aria-describedby"),
        helpTextID = $fieldItem.find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).attr("id");

    //assert
    assert.equal(itemDescribedBy, helpTextID, "Help text id and input's describedby attributes are equal");
});

QUnit.module("Layout manager responsibility", {
    beforeEach: function() {
        responsiveBoxScreenMock.setup.call(this);
    },
    afterEach: function() {
        responsiveBoxScreenMock.teardown.call(this);
    }
});

QUnit.test("Middle screen size", function(assert) {
    //arrange, act
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        items: [{ dataField: "test1" }, { dataField: "test2" }],
        colCount: 2,
        onLayoutChanged: function() { }
    });

    //assert
    assert.ok(!$testContainer.hasClass(internals.LAYOUT_MANAGER_ONE_COLUMN), "Layout manager hasn't one column mode");
});

QUnit.test("Small screen size", function(assert) {
    //arrange
    var $testContainer = $("#container");

    $testContainer.dxLayoutManager({
        items: [{ dataField: "test1" }, { dataField: "test2" }],
        colCount: 2,
        onLayoutChanged: function() { }
    });

    //act
    this.updateScreenSize(600);

    //assert
    assert.ok($testContainer.hasClass(internals.LAYOUT_MANAGER_ONE_COLUMN), "Layout manager has one column mode");
});
