"use strict";

import $ from "jquery";
import consoleUtils from "core/utils/console";
import responsiveBoxScreenMock from "../../helpers/responsiveBoxScreenMock.js";
import { __internals as internals } from "ui/form/ui.form.layout_manager";
import config from "core/config";
import typeUtils from "core/utils/type";
import windowUtils from "core/utils/window";
import errors from "ui/widget/ui.errors";

import "ui/switch";
import "ui/select_box";
import "ui/tag_box";
import "ui/lookup";
import "ui/text_area";
import "ui/radio_group";
import "ui/range_slider";

import "common.css!";

const { test } = QUnit;

QUnit.testStart(() => {
    const markup =
        '<div id="container"></div>';

    $("#qunit-fixture").html(markup);
});

const createTestObject = () => {
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

QUnit.module("Layout manager", () => {
    test("Default render", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            items: [{
                dataField: "name",
                editorType: "dxTextBox"
            }]
        });

        // assert
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

    test("Default render with editorOptions.inputAttr", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            layoutData: {
                name: "John"
            },
            items: [{
                dataField: "name",
                editorType: "dxTextBox",
                editorOptions: {
                    inputAttr: {
                        alt: "test"
                    }
                }
            }]
        });

        // assert
        assert.equal($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor-input").attr("alt"), "test", "attr merge successfully");
    });

    test("Default render with template", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                layoutData: {
                    firstName: "Alex",
                    address: "Winnipeg"
                },
                items: [{
                    dataField: "FirstName",
                    itemType: 'simple',
                    isRequired: true,
                    template: function(data, element) {

                        $('<div>')
                            .appendTo(element)
                            .dxButton({
                                icon: 'find'
                            });

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
                }, {
                    dataField: "address",
                    editorType: "dxTextBox"
                }]
            }),
            $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($items.length, 2, "field items is rendered");
    });

    test("Default render with marks", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                }, {
                    dataField: "address",
                    editorType: "dxTextBox"
                }]
            }),
            $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($items.length, 2, "field items is rendered");

        let $requiredItem = $items.eq(0),
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

    test("Show optional marks", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    dataField: "address",
                    editorType: "dxTextBox"
                }],
                showOptionalMark: true
            }),
            $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($items.length, 1, "field items is rendered");

        let $optionalItem = $items.eq(0);
        assert.ok(!$optionalItem.hasClass(internals.FIELD_ITEM_REQUIRED_CLASS), "field item hasn't required class");
        assert.ok($optionalItem.hasClass(internals.FIELD_ITEM_OPTIONAL_CLASS), "field item has optional class");
        assert.ok(!$optionalItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, "field item hasn't required mark");
        assert.ok($optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).length, "field item hasn optional mark");
    });

    test("Render custom marks", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                showOptionalMark: true,
                optionalMark: "-",
                requiredMark: "+",
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                }, {
                    dataField: "address",
                    editorType: "dxTextBox"
                }]
            }),
            $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        let $requiredItem = $items.eq(0),
            $optionalItem = $items.eq(1);

        assert.equal($.trim($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).text()), "+", "custom required mark");
        assert.equal($.trim($optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).text()), "-", "custom optional mark");
    });

    test("Change marks", (assert) => {
        // arrange
        let $testContainer = $("#container").dxLayoutManager({
                showOptionalMark: true,
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                }, {
                    dataField: "address",
                    editorType: "dxTextBox"
                }]
            }),
            instance = $testContainer.dxLayoutManager("instance");

        // act
        instance.option("optionalMark", "-");
        instance.option("requiredMark", "+");

        // assert
        let $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS),
            $requiredItem = $items.eq(0),
            $optionalItem = $items.eq(1);

        assert.equal($.trim($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).text()), "+", "custom required mark");
        assert.equal($.trim($optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).text()), "-", "custom optional mark");
    });

    test("Change marks visibility", (assert) => {
        // arrange
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox",
                    isRequired: true
                }, {
                    dataField: "address",
                    editorType: "dxTextBox"
                }]
            }),
            instance = $testContainer.dxLayoutManager("instance"),
            $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // act
        instance.option("showOptionalMark", true);
        instance.option("showRequiredMark", false);

        // assert
        let $requiredItem = $items.eq(0),
            $optionalItem = $items.eq(1);

        assert.ok($requiredItem.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, "Item has no required mark");
        assert.ok(!$optionalItem.find("." + internals.FIELD_ITEM_OPTIONAL_MARK_CLASS).length, "Item has optional mark");
    });

    test("Render read only layoutManager", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            readOnly: true,
            items: [{
                dataField: "name",
                editorType: "dxTextBox"
            }]
        });

        // assert
        assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
    });

    test("Check that inner widgets change readOnly option at layoutManager optionChange", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            items: [{
                dataField: "name",
                editorType: "dxTextBox"
            }]
        });

        assert.ok(!$testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is not read only");

        $testContainer.dxLayoutManager("instance").option("readOnly", true);

        // assert
        assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
    });

    test("Check readOnly state for editor when readOnly is enabled in the editorOptions", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            items: [{
                dataField: "name",
                editorType: "dxTextBox",
                editorOptions: {
                    readOnly: true
                }
            }]
        });

        // assert
        assert.ok($testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor").hasClass("dx-state-readonly"), "editor is read only");
    });

    test("Editor's read only state should not be reset on the dxForm 'readOnly' option changing", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox",
                    editorOptions: {
                        readOnly: true
                    }
                }]
            }),
            layoutManager = $testContainer.dxLayoutManager("instance");

        layoutManager.option("readOnly", true);
        layoutManager.option("readOnly", false);

        // assert
        let $textEditor = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor");
        assert.ok($textEditor.hasClass("dx-state-readonly"), "editor is read only");
    });

    test("Render label by default", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                form: {
                    option: () => {},
                    getItemID: () => {
                        return "dx_FormID_name";
                    }
                },
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).first();

        // assert
        assert.equal($label.length, 1, "label is rendered");
        assert.ok($label.hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "left"), "label's location is left by default");
        assert.equal($label.text(), "Name", "text of label");
        assert.equal($label.attr("for"), "dx_FormID_name", "text of label");
        assert.ok($label.parent().hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "field item contains label has horizontal align class");
    });

    test("Check label alignment classes when browser is supported flex", (assert) => {
        // arrange, act
        let items = [{
                dataField: "test1",
                editorType: "dxTextBox"
            }, {
                dataField: "test2",
                editorType: "dxTextBox",
                helpText: "help"
            }, {
                dataField: "test3",
                editorType: "dxRadioGroup"
            }, {
                dataField: "test4",
                editorType: "dxCalendar"
            }, {
                dataField: "test5",
                editorType: "dxTextArea"
            }],
            $testContainer = $("#container").dxLayoutManager(),
            layoutManager = $testContainer.dxLayoutManager("instance"),
            $items;

        // act
        layoutManager._hasBrowserFlex = () => {
            return true;
        };
        layoutManager.option("items", items);
        $items = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.ok(!$items.eq(0).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item doesn't have baseline alignment class");
        assert.ok(!$items.eq(1).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
        assert.ok($items.eq(2).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
        assert.ok($items.eq(3).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
        assert.ok($items.eq(4).hasClass(internals.FIELD_ITEM_LABEL_ALIGN_CLASS), "item have baseline alignment class");
    });

    test("Check label alignment classes when label location is 'top'", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                labelLocation: "top",
                items: [{
                    dataField: "test1",
                    editorType: "dxTextBox"
                }, {
                    dataField: "test2",
                    editorType: "dxTextBox",
                    helpText: "help"
                }, {
                    dataField: "test3",
                    editorType: "dxRadioGroup"
                }, {
                    dataField: "test4",
                    editorType: "dxCalendar"
                }, {
                    dataField: "test5",
                    editorType: "dxTextArea"
                }]
            }),
            $labels = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS);

        // assert
        assert.ok(!$labels.eq(0).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
        assert.ok(!$labels.eq(1).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
        assert.ok(!$labels.eq(2).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
        assert.ok(!$labels.eq(3).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
        assert.ok(!$labels.eq(4).hasClass(internals.FIELD_ITEM_LABEL_BASELINE_CLASS), "label doesn't have baseline alignment class");
    });

    test("Render label for item without name or dateField", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                form: {
                    option: () => {},
                    getItemID: () => {
                        return "dx_FormID_name";
                    }
                },
                items: [{
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first(),
            $input = $testContainer.find("input");

        // assert
        assert.ok($input.attr("id"), "input has ID");
        assert.equal($label.attr("for"), $input.attr("input"), "input ID equal to label's 'for' attribute");
    });

    test("Render label with position top render before widget", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "top"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $fieldItemChildren = $testContainer.find("." + internals.FIELD_ITEM_CLASS).children();

        // assert
        assert.ok($fieldItemChildren.first().hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "top"), "check location class");
        assert.ok($fieldItemChildren.first().is("label"), "Label is the first child");
    });

    test("Render label with position bottom render after widget", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "bottom"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $fieldItemChildren = $testContainer.find("." + internals.FIELD_ITEM_CLASS).children();

        // assert
        assert.ok($fieldItemChildren.last().hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "bottom"), "check location class");
        assert.ok($fieldItemChildren.last().is("label"), "Label is the last child");
    });

    test("Render label with position top and alignment left", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "top",
                        alignment: "left"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.ok($label.parent().hasClass(internals.LABEL_VERTICAL_ALIGNMENT_CLASS), "Field item contains label that has vertical align");
        assert.equal($label.css("textAlign"), "left", "Label has text-align left");
    });

    test("Render label with position top and alignment center", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "top",
                        alignment: "center"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.ok($label.parent().hasClass(internals.LABEL_VERTICAL_ALIGNMENT_CLASS), "Field item contains label that has vertical align");
        assert.equal($label.css("textAlign"), "center", "Label has text-align center");
    });

    test("Render label with position top and alignment right", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "top",
                        alignment: "right"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.ok($label.parent().hasClass(internals.LABEL_VERTICAL_ALIGNMENT_CLASS), "Field item contains label that has vertical align");
        assert.equal($label.css("textAlign"), "right", "Label has text-align right");
    });

    test("Render label with horizontal alignment (left) ", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "left"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $fieldItem = $testContainer.find("." + internals.FIELD_ITEM_CLASS).first();

        // assert
        assert.ok($fieldItem.hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "Field item contains label that has horizontal align");
    });

    test("Render label with default position and alignment left", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        alignment: "left"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.equal($label.css("textAlign"), "left", "Label has text-align left");
    });

    test("Render label with default position and alignment center", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        alignment: "center"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.equal($label.css("textAlign"), "center", "Label has text-align center");
    });

    test("Render label with showColonAfterLabel", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                showColonAfterLabel: true,
                items: [{
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).first();

        // assert
        assert.equal($label.text(), "Name:", "text of label");
    });

    test("Label is not rendered when name is defined", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            items: [{
                name: "name",
                editorType: "dxTextBox"
            }]
        });

        // assert
        assert.ok(!$testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).length);
    });

    test("If item is not visible we will not render them", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
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

        // assert
        assert.equal($fieldItems.length, 2, "We have only two visible items");
        assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
        assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Phone", "Correct second item rendered");
    });

    test("Item should be removed from DOM if it's visibility changed", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
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

        // assert
        assert.equal($fieldItems.length, 3, "We have 3 visible items");

        instance.option("items[1].visible", false);
        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        assert.equal($fieldItems.length, 2, "We have 2 visible items");
        assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
        assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Phone", "Correct second item rendered");
    });

    test("Render items as array of strings", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: ["FirstName", "LastName"]
            }),
            $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($fieldItems.length, 2, "We have two items");
        assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
        assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Last Name", "Correct second item rendered");
    });

    test("Render mixed set of items(2 as strings, 1 as object)", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: ["FirstName", {
                    dataField: "Nickname"
                }, "LastName"]
            }),
            $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($fieldItems.length, 3, "We have three items");
        assert.equal($fieldItems.first().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "First Name", "Correct first item rendered");
        assert.equal($fieldItems.eq(1).find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Nickname", "Correct second item rendered");
        assert.equal($fieldItems.last().find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Last Name", "Correct third item rendered");
    });

    test("If label is not visible we will not render them", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    dataField: "firstName",
                    label: {
                        visible: false
                    }
                }]
            }),
            $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($fieldItems.length, 1, "We have only one item");
        assert.equal($fieldItems.find("." + internals.FIELD_ITEM_LABEL_CLASS).length, 0, "We have't labels");
        assert.equal($fieldItems.find("." + internals.FIELD_ITEM_CONTENT_CLASS).length, 1, "We have widget in field");
    });

    test("Render label with horizontal alignment (right) ", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        location: "right"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $fieldItem = $testContainer.find("." + internals.FIELD_ITEM_CLASS).first();

        // assert
        assert.ok($fieldItem.find("." + internals.FIELD_ITEM_LABEL_CLASS).hasClass(internals.FIELD_ITEM_LABEL_LOCATION_CLASS + "right"), "check location class");
        assert.ok($fieldItem.hasClass(internals.LABEL_HORIZONTAL_ALIGNMENT_CLASS), "Field item contains label that has horizontal align");
    });

    test("Default render with label", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                showColonAfterLabel: true,
                items: [{
                    label: {
                        text: "New label"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"

                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.equal($label.text(), "New label:", "text of label");
    });

    test("Colon symbol is not added to label when showColon is disabled for label", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                showColonAfterLabel: true,
                items: [{
                    label: {
                        text: "New label",
                        showColon: false
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $label = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " label").first();

        // assert
        assert.equal($label.text(), "New label", "text of label");
    });

    test("Render editor with id attribute", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                form: {
                    option: () => {},
                    getItemID: () => {
                        return "dx_FormID_name";
                    }
                },
                items: [{
                    label: {
                        text: "New label"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $input = $testContainer.find("." + internals.FIELD_ITEM_CLASS + " .dx-texteditor input").first();

        // assert
        assert.equal($input.attr("id"), "dx_FormID_name", "id attr of input");
    });

    test("Render editor by default is data is unknown", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            layoutData: {
                Name: null
            }
        });

        // assert
        let $editor = $testContainer.find(".dx-texteditor");
        assert.equal($editor.length, 1, "render 1 editor");
        assert.ok($editor.hasClass("dx-textbox"), "It is dxTextBox by default");
    });

    test("Generate several items in layout", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        text: "label1"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }, {
                    label: {
                        text: "label2"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }, {
                    label: {
                        text: "label3"
                    },
                    dataField: "name",
                    editorType: "dxTextBox"
                }]
            }),
            $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);


        // assert
        assert.equal($fieldItems.length, 3, "Render 3 items");
        for(let i = 0; i < 3; i++) {
            let labelCount = i + 1;

            assert.equal($fieldItems.eq(i).find("label").text(), "label" + labelCount, "Label" + labelCount);
        }
    });

    test("Generate items from layoutData", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date()
            }
        }).dxLayoutManager("instance");

        // assert
        assert.deepEqual(layoutManager._items, [{
            dataField: "name",
            editorType: "dxTextBox",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        }, {
            dataField: "active",
            editorType: "dxCheckBox",
            itemType: "simple",
            visibleIndex: 1,
            col: 0
        }, {
            dataField: "price",
            editorType: "dxNumberBox",
            itemType: "simple",
            visibleIndex: 2,
            col: 0
        }, {
            dataField: "birthDate",
            editorType: "dxDateBox",
            itemType: "simple",
            visibleIndex: 3,
            col: 0
        }]);
    });

    test("Generate items from layoutData with unacceptable data", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: {
                name: "John",
                wrongField: () => {}
            }
        }).dxLayoutManager("instance");

        // assert
        assert.deepEqual(layoutManager._items, [{
            dataField: "name",
            editorType: "dxTextBox",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        }]);
    });

    test("Generate items from layoutData and items", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("01/01/2000")
            },
            items: [{
                dataField: "active",
                editorType: "dxSwitch"
            }, {
                dataField: "secondName",
                editorType: "dxTextArea"
            }]
        }).dxLayoutManager("instance");

        // assert
        assert.deepEqual(layoutManager._items, [{
            dataField: "active",
            editorType: "dxSwitch",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        }, {
            dataField: "secondName",
            editorType: "dxTextArea",
            itemType: "simple",
            visibleIndex: 1,
            col: 0
        }]);

        assert.deepEqual(
            layoutManager.option("layoutData"), {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("01/01/2000")
            },
            "Correct Data"
        );
    });

    test("Render RangeSlider", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: {
                range: [1, 5]
            },
            items: [{
                dataField: "range",
                editorType: "dxRangeSlider"
            }, {
                dataField: "noRange",
                editorType: "dxRangeSlider"
            }]
        }).dxLayoutManager("instance");

        // assert
        assert.deepEqual(layoutManager.getEditor("range").option("value"), [1, 5], "Editor's value correct");

        layoutManager.getEditor("noRange").option("value", [2, 6]);
        assert.deepEqual(layoutManager.option("layoutData.noRange"), [2, 6], "data updated");
    });

    test("Check data when generate items from layoutData and items with initial value", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("01/01/2000")
            },
            items: [{
                dataField: "active",
                editorType: "dxSwitch"
            }, {
                dataField: "secondName",
                editorType: "dxTextArea",
                editorOptions: {
                    value: "Test"
                }
            }]
        }).dxLayoutManager("instance");

        // assert
        assert.deepEqual(
            layoutManager.option("layoutData"), {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("01/01/2000"),
                secondName: "Test"
            },
            "Correct Data"
        );
    });

    test("Rerender items after change 'items' option", (assert) => {
        // arrange
        let $testContainer = $("#container").dxLayoutManager({
                items: [{
                    label: {
                        text: "label1"
                    },
                    dataField: "field1",
                    editorType: "dxTextBox"
                }]
            }),
            layoutManager = $testContainer.dxLayoutManager("instance"),
            $fieldItems;

        // act
        layoutManager.option("items", [{
            label: {
                text: "label1"
            },
            dataField: "field2",
            editorType: "dxNumberBox"
        }, {
            label: {
                text: "label2"
            },
            dataField: "field3",
            editorType: "dxDateBox"
        }]);

        $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.ok($fieldItems.eq(0).find(".dx-numberbox").length, "First item is dxNumberBox");
        assert.ok($fieldItems.eq(1).find(".dx-datebox").length, "Second item is dxDateBox");
    });

    test("Generate items after change 'layoutData' option", (assert) => {
        // arrange
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date()
            }
        }).dxLayoutManager("instance");

        // act
        layoutManager.option("layoutData", {
            title: "Test",
            room: 1001,
            startDate: new Date()
        });

        // assert
        assert.deepEqual(layoutManager._items, [{
            dataField: "title",
            editorType: "dxTextBox",
            itemType: "simple",
            visibleIndex: 0,
            col: 0
        }, {
            dataField: "room",
            editorType: "dxNumberBox",
            itemType: "simple",
            visibleIndex: 1,
            col: 0
        }, {
            dataField: "startDate",
            editorType: "dxDateBox",
            itemType: "simple",
            visibleIndex: 2,
            col: 0
        }]);
    });

    test("Set values from layoutData", (assert) => {
        // arrange, act
        let $editors,
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

        // assert
        assert.equal($editors.eq(0).dxTextBox("instance").option("value"), "Patti", "1 editor");
        assert.equal($editors.eq(1).dxCheckBox("instance").option("value"), true, "2 editor");
        assert.equal($editors.eq(2).dxNumberBox("instance").option("value"), 1200, "3 editor");
        assert.deepEqual($editors.eq(3).dxDateBox("instance").option("value"), new Date("10/10/2010"), "4 editor");
    });

    test("Value from layoutData shouldn't pass to the editor in case when the 'dataField' options isn't specified", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                firstName: "Alex",
            },
            items: [{
                name: "firstName",
                editorType: "dxTextBox"
            }]
        });

        let editor = $testContainer.find(".dx-texteditor").dxTextBox("instance");

        // assert
        assert.equal(editor.option("value"), null, "Editor hasn't a value");
    });

    test("layoutData isn't updating on editor value change if the 'dataField' option isn't specified", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                firstName: "Alex",
            },
            items: [{
                name: "firstName",
                editorType: "dxTextBox"
            }]
        });

        $testContainer.find(".dx-texteditor").dxTextBox("option", "value", "John");

        // assert
        let layoutManager = $testContainer.dxLayoutManager("instance");
        assert.deepEqual(layoutManager.option("layoutData"), {
            firstName: "Alex"
        }, "layoutData keeps the same data");
    });

    test("Set value via editor options", (assert) => {
        // arrange, act
        let $editors,
            $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("10/10/2010")
            },
            customizeItem: (item) => {
                if(item.dataField === "price") {
                    item.editorOptions = {
                        value: 34
                    };
                }
            }
        });

        $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

        // assert
        assert.equal($editors.eq(2).dxNumberBox("instance").option("value"), 34);
    });

    test("Change item.visible on customizeItem works correct", (assert) => {
        // arrange, act
        let $editors,
            $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                name: "Michael",
                age: 20
            },
            customizeItem: (item) => {
                if(item.dataField === "name") {
                    item.visible = false;
                }
            }
        });

        $editors = $testContainer.find(".dx-texteditor");

        // assert
        assert.equal($editors.length, 1, "There is only one editor");
        assert.equal($testContainer.find("." + internals.FIELD_ITEM_LABEL_CLASS).text(), "Age", "Correct field rendered");
    });


    test("CustomizeItem work well after option change", (assert) => {
        // arrange, act
        let $editors,
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
            (item) => {
                if(item.dataField === "price") {
                    item.editorOptions = {
                        value: 34
                    };
                }
            }
        );

        $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

        // assert
        assert.equal($editors.eq(2).dxNumberBox("instance").option("value"), 34);
    });

    test("Get value from editor", (assert) => {
        // arrange
        let $editors,
            layoutManager,
            $testContainer = $("#container");

        layoutManager = $testContainer.dxLayoutManager({
            items: [{
                dataField: "name",
                editorType: "dxTextBox"
            }, {
                dataField: "active",
                editorType: "dxCheckBox"
            }, {
                dataField: "price",
                editorType: "dxNumberBox"
            }, {
                dataField: "birthDate",
                editorType: "dxDateBox"
            }]
        }).dxLayoutManager("instance");

        // act
        $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");
        $editors.eq(0).dxTextBox("instance").option("value", "Fillip");
        $editors.eq(1).dxCheckBox("instance").option("value", true);
        $editors.eq(2).dxNumberBox("instance").option("value", 7);
        $editors.eq(3).dxDateBox("instance").option("value", "10/10/2001");

        // assert
        assert.deepEqual(layoutManager.option("layoutData"), {
            name: "Fillip",
            active: true,
            price: 7,
            birthDate: "10/10/2001"
        });
    });

    test("Editors with object value correctly work with values from data", (assert) => {
        // arrange, act
        let layoutManager,
            $testContainer = $("#container"),
            items = [{
                myText: "test1",
                number: 1
            }, {
                myText: "test2",
                number: 2
            }, {
                myText: "test3",
                number: 3
            }];

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                testItem: items[1]
            },
            items: [{
                dataField: "testItem",
                editorType: "dxLookup",
                editorOptions: {
                    items: items,
                    displayExpr: "myText"
                }
            }]
        }).dxLayoutManager("instance");

        let lookupCurrentItemText = layoutManager.$element().find(".dx-lookup-field").text();

        // assert
        assert.equal(lookupCurrentItemText, "test2", "lookup has correct current item");
    });

    test("A layoutData object change at changing widget from items option", (assert) => {
        // arrange
        let layoutManager,
            $testContainer = $("#container");

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("10/10/2010")
            },
            items: [{
                dataField: "subscribe",
                editorType: "dxCheckBox"
            }]
        }).dxLayoutManager("instance");

        // act
        $testContainer.find(".dx-checkbox").dxCheckBox("instance").option("value", true);

        // assert
        assert.deepEqual(layoutManager.option("layoutData"), {
            name: "Patti",
            active: true,
            price: 1200,
            birthDate: new Date("10/10/2010"),
            subscribe: true
        }, "Custom field data updated");
    });

    test("A layoutData is not changed when dataField is undefined_T310737", (assert) => {
        // arrange
        let layoutManager,
            $testContainer = $("#container");

        layoutManager = $testContainer.dxLayoutManager({
            items: [{
                editorType: "dxTextBox"
            }, {
                editorType: "dxTextBox"
            }, {
                editorType: "dxTextBox"
            }]
        }).dxLayoutManager("instance");

        let $textBoxes = $testContainer.find(".dx-textbox"),
            textBoxes = [];

        // act
        textBoxes[0] = $textBoxes.eq(0).dxTextBox("instance");
        textBoxes[1] = $textBoxes.eq(1).dxTextBox("instance");
        textBoxes[2] = $textBoxes.eq(2).dxTextBox("instance");

        textBoxes[0].option("value", "test1");
        textBoxes[1].option("value", "test2");
        textBoxes[2].option("value", "test3");

        // assert
        assert.deepEqual(layoutManager.option("layoutData"), {}, "layout data");
        assert.equal(textBoxes[0].option("value"), "test1", "editor 1");
        assert.equal(textBoxes[1].option("value"), "test2", "editor 2");
        assert.equal(textBoxes[2].option("value"), "test3", "editor 3");
    });

    test("Set 'disabled' option to layoutManager and check internal element state", (assert) => {
        // arrange
        let $editors,
            $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                name: "Patti",
                active: true,
                price: 1200,
                birthDate: new Date("10/10/2010")
            }
        });

        // act
        $testContainer.dxLayoutManager("instance").option("disabled", true);
        $editors = $testContainer.find(".dx-texteditor, .dx-checkbox");

        // assert
        assert.equal($editors.eq(0).dxTextBox("instance").option("disabled"), true);
        assert.equal($editors.eq(1).dxCheckBox("instance").option("disabled"), true);
        assert.equal($editors.eq(2).dxNumberBox("instance").option("disabled"), true);
        assert.equal($editors.eq(3).dxDateBox("instance").option("disabled"), true);
    });

    test("Label creates when item has no name but has 'label.text' option", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            $label;

        $testContainer.dxLayoutManager({
            items: [{
                editorType: "dxTextBox",
                label: {
                    text: "NewLabel"
                }
            }]
        });

        $label = $testContainer.find("label");

        // assert
        assert.ok($label.length, "Editor has label");
        assert.equal($label.text(), "NewLabel", "Correct label's text");
    });

    test("Render field items from fieldData and items", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                name: "Patti"
            },
            items: [{
                editorType: "dxButton"
            }]
        }).dxLayoutManager("instance");

        // assert
        assert.equal(layoutManager._items.length, 1, "LayoutManager has 2 fields");
        assert.ok($testContainer.find(".dx-button").length, "Form has button");
    });

    test("Render field items from fieldData and items when fieldData is a complex object", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            complexObject = {
                CTO: {
                    name: "Alex",
                    age: 40
                },
                CEO: {
                    name: "George",
                    age: 34
                }
            },
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: complexObject,
            items: [{
                dataField: "CTO.name",
                editorType: "dxTextBox"
            }, {
                dataField: "CEO.name",
                editorType: "dxTextBox"
            }]
        }).dxLayoutManager("instance");

        let $labels = $testContainer.find("label"),
            $inputs = $testContainer.find("input");

        // assert
        assert.equal(layoutManager._items.length, 2, "LayoutManager has 2 fields");

        assert.equal($labels.length, 2, "Form has 2 labels");
        assert.equal($labels.eq(0).text(), "CTO name", "First label text");
        assert.equal($labels.eq(1).text(), "CEO name", "Second label text");


        assert.equal($inputs.length, 2, "Form has 2 inputs");
        assert.equal($inputs.eq(0).val(), "Alex", "First input value");
        assert.equal($inputs.eq(1).val(), "George", "Second input value");
    });

    test("Render field items from fieldData and items when fieldData is a complex object and custom label text", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            complexObject = {
                CTO: {
                    name: "Alex",
                    age: 40
                },
                CEO: {
                    name: "George",
                    age: 34
                }
            },
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: complexObject,
            items: [{
                dataField: "CTO.name",
                label: {
                    text: "The smartest CTO"
                }
            }, {
                dataField: "CEO.name",
                label: {
                    text: "The best CEO"
                },
                editorType: "dxTextBox"
            }]
        }).dxLayoutManager("instance");

        let $labels = $testContainer.find("label"),
            $inputs = $testContainer.find("input");

        // assert
        assert.equal(layoutManager._items.length, 2, "LayoutManager has 2 fields");

        assert.equal($labels.length, 2, "Form has 2 labels");
        assert.equal($labels.eq(0).text(), "The smartest CTO", "First label text");
        assert.equal($labels.eq(1).text(), "The best CEO", "Second label text");


        assert.equal($inputs.length, 2, "Form has 2 inputs");
        assert.equal($inputs.eq(0).val(), "Alex", "First input value");
        assert.equal($inputs.eq(1).val(), "George", "Second input value");
    });

    test("Render help text", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                name: "Alex",
                lastName: "Johnson",
                state: "CA"
            },
            items: [{
                dataField: "name",
                helpText: "Type a name"
            }, {
                dataField: "lastName"
            }]
        }).dxLayoutManager("instance");

        let $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($fieldItems.eq(0).find("." + internals.FIELD_ITEM_CONTENT_WRAPPER_CLASS).length, 1, "First field item has widget wrapper");
        assert.equal($fieldItems.eq(0).find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).length, 1, "First field item has help text element");
        assert.equal($fieldItems.eq(0).find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).text(), "Type a name", "Correct help text");

        assert.equal($fieldItems.eq(1).find("." + internals.FIELD_ITEM_CONTENT_WRAPPER_CLASS).length, 0, "Second field item has't widget wrapper");
        assert.equal($fieldItems.eq(1).find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).length, 0, "Second field item has't help text element");
    });

    test("Change the order of items", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            data = {
                name: "Alex",
                age: 40,
                gender: "male"
            },
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: data,
            items: [{
                visibleIndex: 1,
                dataField: "name",
                editorType: "dxTextBox"
            }, {
                visibleIndex: 2,
                dataField: "age",
                editorType: "dxTextBox"
            }, {
                visibleIndex: 0,
                dataField: "gender",
                editorType: "dxTextBox"
            }]
        }).dxLayoutManager("instance");

        let $labels = $testContainer.find("label"),
            $inputs = $testContainer.find("input");

        // assert
        assert.equal($labels.length, 3, "Form has 3 labels");
        assert.equal($labels.eq(0).text(), "Gender", "First label text");
        assert.equal($labels.eq(1).text(), "Name", "Second label text");
        assert.equal($labels.eq(2).text(), "Age", "Second label text");

        assert.equal($inputs.length, 3, "Form has 3 inputs");
        assert.equal($inputs.eq(0).val(), "male", "First input value");
        assert.equal($inputs.eq(1).val(), "Alex", "Second input value");
        assert.equal($inputs.eq(2).val(), "40", "First input value");
    });

    test("Change the order of items with items without visibleIndex", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            data = {
                name: "Alex",
                age: 40,
                gender: "male",
                hasAuto: "Yes"
            },
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: data,
            items: [{
                dataField: "name",
                editorType: "dxTextBox"
            }, {
                visibleIndex: 0,
                dataField: "age",
                editorType: "dxTextBox"
            }, {
                dataField: "gender",
                editorType: "dxTextBox"
            }, {
                visibleIndex: 1,
                dataField: "hasAuto",
                editorType: "dxTextBox"
            }]
        }).dxLayoutManager("instance");

        let $labels = $testContainer.find("label"),
            $inputs = $testContainer.find("input");

        // assert
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

    test("Editor type for items where this option is not defined", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            layoutManager,
            consoleErrorStub = sinon.stub(consoleUtils.logger, "error");

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                name: "Patti"
            },
            items: [{
                dataField: "name"
            }, {
                name: "Test Name"
            }]
        }).dxLayoutManager("instance");

        // assert
        assert.equal(layoutManager._items.length, 2, "items count");
        assert.equal(layoutManager._items[0].editorType, "dxTextBox", "1 item");
        assert.equal(layoutManager._items[1].editorType, undefined, "2 item has no dataField");
        assert.equal(consoleErrorStub.callCount, 1, "error was raised for item without dataField and editorType");
        consoleErrorStub.restore();
    });

    test("Error is displayed in console when editorType is unsupported", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            errorMessage,
            _error = consoleUtils.logger.log;

        consoleUtils.logger.error = (message) => {
            errorMessage = message;
        };

        $testContainer.dxLayoutManager({
            layoutData: createTestObject(),
            items: [{
                dataField: "Position"
            }, {
                name: "test"
            }]
        }).dxLayoutManager("instance");

        // assert
        assert.equal(errorMessage.indexOf("E1035 - The editor cannot be created because of an internal error"), 0);
        assert.ok(errorMessage.indexOf("See:\nhttp://js.devexpress.com/error/") > 0);

        consoleUtils.logger.error = _error;
    });

    test("Form with dxRadioGroup that items are defined via 'dataSource' option renders without error", (assert) => {
        // arrange
        let $testContainer = $("#container"),
            errorMessage,
            _error = consoleUtils.logger.log;

        // act
        try {
            consoleUtils.logger.error = (message) => {
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

            // assert
            assert.ok(!errorMessage, "There is no error");
        } finally {
            consoleUtils.logger.error = _error;
        }
    });

    test("Set value to the dxSelectBox editor from data option", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            selectBox,
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                simpleProducts: "SuperLCD 70"
            },
            customizeItem: (item) => {
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

        // assert
        assert.deepEqual(selectBox.option("value"), "SuperLCD 70");
    });

    test("Set default value to the dxSelectBox editor when dataField is not contained in a formData", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            selectBox;

        $testContainer.dxLayoutManager({
            layoutData: {
                name: "Test"
            },
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

        // assert
        assert.deepEqual(selectBox.option("value"), undefined);
    });

    test("Update value in dxSelectBox editor when data option is changed", (assert) => {
        // arrange
        let $testContainer = $("#container"),
            selectBox,
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                simpleProducts: "SuperLCD 70"
            },
            customizeItem: (item) => {
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

        // act
        layoutManager.updateData("simpleProducts", "SuperLED 50");

        selectBox = $testContainer.find(".dx-selectbox").first().dxSelectBox("instance");

        // assert
        assert.deepEqual(selectBox.option("value"), "SuperLED 50");
        assert.ok(!layoutManager._isFieldValueChanged);
    });

    test("Update data option of layout manager when value is changed in the dxSelectBox editor", (assert) => {
        // arrange
        let $testContainer = $("#container"),
            selectBox,
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                simpleProducts: "SuperLCD 70"
            },
            customizeItem: (item) => {
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

        // act
        selectBox = $testContainer.find(".dx-selectbox").first().dxSelectBox("instance");
        selectBox.option("value", "SuperPlasma 50");

        // assert
        assert.deepEqual(layoutManager.option("layoutData.simpleProducts"), "SuperPlasma 50");
        assert.ok(!layoutManager._isValueChangedCalled);
    });

    test("Set value to the dxTagBox editor from data option", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            tagBox,
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                simpleProducts: ["HD Video Player", "SuperLCD 70"]
            },
            customizeItem: (item) => {
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

        tagBox = $testContainer.find(".dx-tagbox").first().dxTagBox("instance");

        // assert
        assert.deepEqual(tagBox.option("value"), ["HD Video Player", "SuperLCD 70"]);
    });

    test("Set default value to the dxTagBox editor when dataField is not contained in a formData", (assert) => {
        // arrange, act
        let $testContainer = $("#container"),
            tagBox;

        $testContainer.dxLayoutManager({
            layoutData: {
                name: "Test"
            },
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

        tagBox = $testContainer.find(".dx-tagbox").first().dxTagBox("instance");

        // assert
        assert.deepEqual(tagBox.option("value"), []);
    });

    test("Update value in dxTagBox editor when data option is changed", (assert) => {
        // arrange
        let $testContainer = $("#container"),
            tagBox,
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                simpleProducts: ["HD Video Player", "SuperLCD 70"]
            },
            customizeItem: (item) => {
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

        // act
        layoutManager.updateData("simpleProducts", ["SuperLED 50", "SuperLCD 70", "SuperLCD 55"]);

        tagBox = $testContainer.find(".dx-tagbox").first().dxTagBox("instance");

        // assert
        assert.deepEqual(tagBox.option("value"), ["SuperLED 50", "SuperLCD 70", "SuperLCD 55"]);
        assert.ok(!layoutManager._isFieldValueChanged);
    });

    test("Update data option of layout manager when value is changed in the dxTagBox editor", (assert) => {
        // arrange
        let $testContainer = $("#container"),
            tagBox,
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                simpleProducts: ["HD Video Player", "SuperLCD 70"]
            },
            customizeItem: (item) => {
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

        // act
        tagBox = $testContainer.find(".dx-tagbox").first().dxTagBox("instance");
        tagBox.option("value", ["SuperLCD 42", "SuperPlasma 50"]);

        // assert
        assert.deepEqual(layoutManager.option("layoutData.simpleProducts"), ["SuperLCD 42", "SuperPlasma 50"]);
        assert.ok(!layoutManager._isValueChangedCalled);
    });

    test("Update editor with nested dataField when layoutData changed", (assert) => {
        // arrange
        let $testContainer = $("#container"),
            layoutManager;

        layoutManager = $testContainer.dxLayoutManager({
            layoutData: {
                personalInfo: {
                    firstName: "John"
                }
            },
            items: ["personalInfo.firstName"]
        }).dxLayoutManager("instance");

        // act
        layoutManager.option("layoutData", {
            personalInfo: {
                firstName: "Jane"
            }
        });

        // assert
        assert.equal(layoutManager.getEditor("personalInfo.firstName").option("value"), "Jane", "Editor is up to date");
    });

    test("Render empty item", (assert) => {
        // arrange, act
        let $testContainer = $("#container").dxLayoutManager({
            formData: {
                name: "Test Name",
                profession: "Test profession"
            },
            items: ["name", {
                itemType: "empty"
            }, "profession"]
        });

        // assert
        assert.equal($testContainer.find("." + internals.FIELD_EMPTY_ITEM_CLASS).length, 1);
    });

    QUnit.test("Templates of form's items render with deferring_T638831", function(assert) {
        // arrange, act
        var spy;

        $("#container").dxLayoutManager({
            onInitialized: function(e) {
                spy = sinon.spy(e.component, "_renderTemplates");
            },
            items: [{
                dataField: "StartDate",
                editorType: "dxDateBox"
            }]
        });

        // assert
        var templatesInfo = spy.args[0][0];
        assert.ok(templatesInfo[0].container.hasClass("dx-field-item"), "template container of field item");
        assert.equal(templatesInfo[0].formItem.dataField, "StartDate", "correct a form item for template");
    });
});

QUnit.module("Render multiple columns", () => {
    test("Render layoutManager with 2 columns", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
                layoutData: createTestObject(),
                colCount: 2,
                height: 800
            }).dxLayoutManager("instance"),
            responsiveBox = $("#container").find(".dx-responsivebox").dxResponsiveBox("instance"),
            boxItems = responsiveBox.option("items");

        // assert
        assert.equal(layoutManager._items.length, $("#container .dx-texteditor").length, "generated items");
        assert.deepEqual(boxItems[0].location, {
            col: 0,
            row: 0
        }, "col 0 row 0");
        assert.deepEqual(boxItems[1].location, {
            col: 1,
            row: 0
        }, "col 1 row 0");
        assert.deepEqual(boxItems[2].location, {
            col: 0,
            row: 1
        }, "col 0 row 1");
        assert.deepEqual(boxItems[3].location, {
            col: 1,
            row: 1
        }, "col 1 row 1");
        assert.deepEqual(boxItems[4].location, {
            col: 0,
            row: 2
        }, "col 0 row 2");
        assert.deepEqual(boxItems[5].location, {
            col: 1,
            row: 2
        }, "col 1 row 2");
        assert.deepEqual(boxItems[6].location, {
            col: 0,
            row: 3
        }, "col 0 row 3");
        assert.deepEqual(boxItems[7].location, {
            col: 1,
            row: 3
        }, "col 1 row 3");
        assert.deepEqual(boxItems[8].location, {
            col: 0,
            row: 4
        }, "col 0 row 4");
        assert.deepEqual(boxItems[9].location, {
            col: 1,
            row: 4
        }, "col 1 row 4");
        assert.deepEqual(boxItems[10].location, {
            col: 0,
            row: 5
        }, "col 0 row 5");
    });

    test("Render layout items in order", (assert) => {
        // arrange, act
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
        let $labels = $("#container .dx-responsivebox label"),
            $editors = $("#container .dx-responsivebox .dx-texteditor-input");


        // assert
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

    test("Check that layoutManager create correct rows count", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 2,
            height: 800
        }).dxLayoutManager("instance");

        // assert
        assert.equal(layoutManager._getRowsCount(), 6, "11 items / 2 columns = 6 rows");
    });

    test("Check rows and cols in responsiveBox", (assert) => {
        // arrange, act
        $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 2,
            height: 800
        });

        let responsiveBox = $("#container").find(".dx-responsivebox").dxResponsiveBox("instance");

        // assert
        assert.equal(responsiveBox.option("cols").length, 2, "cols count");
        assert.equal(responsiveBox.option("rows").length, 6, "rows count");
    });

    test("Prepare items for col span", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
                layoutData: createTestObject(),
                colCount: 4,
                height: 800,
                customizeItem: (item) => {
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
            }).dxLayoutManager("instance"),
            items = layoutManager._items;


        // assert
        assert.equal(items.length, 15, "items count");
        assert.deepEqual(items[0], {
            dataField: "ID",
            editorType: "dxNumberBox",
            visibleIndex: 0,
            col: 0,
            itemType: "simple"
        }, "0 item");
        assert.deepEqual(items[1], {
            dataField: "FirstName",
            colSpan: 2,
            editorType: "dxTextBox",
            visibleIndex: 1,
            col: 1,
            itemType: "simple"
        }, "1 item");
        assert.deepEqual(items[2], {
            merged: true
        }, "2 item, merged");
        assert.deepEqual(items[3], {
            dataField: "LastName",
            editorType: "dxTextBox",
            visibleIndex: 2,
            col: 3,
            itemType: "simple"
        }, "3 item");
        assert.deepEqual(items[4], {
            dataField: "Prefix",
            colSpan: 4,
            editorType: "dxTextBox",
            visibleIndex: 3,
            col: 0,
            itemType: "simple"
        }, "5 item");
        assert.deepEqual(items[5], {
            merged: true
        }, "6 item, merged");
        assert.deepEqual(items[6], {
            merged: true
        }, "7 item, merged");
        assert.deepEqual(items[7], {
            merged: true
        }, "8 item, merged");
        assert.deepEqual(items[8], {
            dataField: "Position",
            editorType: "dxTextBox",
            visibleIndex: 4,
            col: 0,
            itemType: "simple"
        }, "9 item");
        assert.deepEqual(items[9], {
            dataField: "Picture",
            editorType: "dxTextBox",
            visibleIndex: 5,
            col: 1,
            itemType: "simple"
        }, "10 item");
        assert.deepEqual(items[10], {
            dataField: "BirthDate",
            editorType: "dxTextBox",
            visibleIndex: 6,
            col: 2,
            itemType: "simple"
        }, "11 item");
        assert.deepEqual(items[11], {
            dataField: "HireDate",
            editorType: "dxTextBox",
            visibleIndex: 7,
            col: 3,
            itemType: "simple"
        }, "12 item");
        assert.deepEqual(items[12], {
            dataField: "Notes",
            editorType: "dxTextBox",
            visibleIndex: 8,
            col: 0,
            itemType: "simple"
        }, "13 item");
        assert.deepEqual(items[13], {
            dataField: "Address",
            editorType: "dxTextBox",
            visibleIndex: 9,
            col: 1,
            itemType: "simple"
        }, "14 item");
        assert.deepEqual(items[14], {
            dataField: "StateID",
            editorType: "dxNumberBox",
            visibleIndex: 10,
            col: 2,
            itemType: "simple"
        }, "15 item");
    });

    test("Generate layout items for col span", (assert) => {
        // arrange, act
        $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 4,
            height: 800,
            customizeItem: (item) => {
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
        }).dxLayoutManager("instance");

        let responsiveBox = $(".dx-responsivebox").dxResponsiveBox("instance"),
            items = responsiveBox.option("items");


        // assert
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

    test("Prepare items for col span when labelLocation is 'top' (T307223)", (assert) => {
        // arrange, act
        let layoutManager = $("#container").dxLayoutManager({
                layoutData: createTestObject(),
                colCount: 4,
                labelLocation: "top",
                height: 800,
                customizeItem: (item) => {
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
            }).dxLayoutManager("instance"),
            items = layoutManager._items;


        // assert
        assert.equal(items.length, 15, "items count");
        assert.deepEqual(items[0], {
            dataField: "ID",
            editorType: "dxNumberBox",
            visibleIndex: 0,
            col: 0,
            itemType: "simple"
        }, "0 item");
        assert.deepEqual(items[1], {
            dataField: "FirstName",
            colSpan: 2,
            editorType: "dxTextBox",
            visibleIndex: 1,
            col: 1,
            itemType: "simple"
        }, "1 item");
        assert.deepEqual(items[2], {
            merged: true
        }, "2 item, merged");
        assert.deepEqual(items[3], {
            dataField: "LastName",
            editorType: "dxTextBox",
            visibleIndex: 2,
            col: 3,
            itemType: "simple"
        }, "3 item");
        assert.deepEqual(items[4], {
            dataField: "Prefix",
            colSpan: 4,
            editorType: "dxTextBox",
            visibleIndex: 3,
            col: 0,
            itemType: "simple"
        }, "5 item");
        assert.deepEqual(items[5], {
            merged: true
        }, "6 item, merged");
        assert.deepEqual(items[6], {
            merged: true
        }, "7 item, merged");
        assert.deepEqual(items[7], {
            merged: true
        }, "8 item, merged");
        assert.deepEqual(items[8], {
            dataField: "Position",
            editorType: "dxTextBox",
            visibleIndex: 4,
            col: 0,
            itemType: "simple"
        }, "9 item");
        assert.deepEqual(items[9], {
            dataField: "Picture",
            editorType: "dxTextBox",
            visibleIndex: 5,
            col: 1,
            itemType: "simple"
        }, "10 item");
        assert.deepEqual(items[10], {
            dataField: "BirthDate",
            editorType: "dxTextBox",
            visibleIndex: 6,
            col: 2,
            itemType: "simple"
        }, "11 item");
        assert.deepEqual(items[11], {
            dataField: "HireDate",
            editorType: "dxTextBox",
            visibleIndex: 7,
            col: 3,
            itemType: "simple"
        }, "12 item");
        assert.deepEqual(items[12], {
            dataField: "Notes",
            editorType: "dxTextBox",
            visibleIndex: 8,
            col: 0,
            itemType: "simple"
        }, "13 item");
        assert.deepEqual(items[13], {
            dataField: "Address",
            editorType: "dxTextBox",
            visibleIndex: 9,
            col: 1,
            itemType: "simple"
        }, "14 item");
        assert.deepEqual(items[14], {
            dataField: "StateID",
            editorType: "dxNumberBox",
            visibleIndex: 10,
            col: 2,
            itemType: "simple"
        }, "15 item");
    });

    test("Generate rows ratio for col span", (assert) => {
        // arrange, act
        $("#container").dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 4,
            height: 800,
            customizeItem: (item) => {
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
        }).dxLayoutManager("instance");

        let responsiveBox = $(".dx-responsivebox").dxResponsiveBox("instance"),
            rows = responsiveBox.option("rows");


        // assert
        assert.equal(rows.length, 4);
    });

    test("Change of editor's value changing 'layoutData' option", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                FamousPirate: "John Morgan"
            }
        });

        // act
        $testContainer.find(".dx-textbox").dxTextBox("instance").option("value", "Cpt. Jack Sparrow");

        // assert
        assert.deepEqual($testContainer.dxLayoutManager("instance").option("layoutData"), {
            FamousPirate: "Cpt. Jack Sparrow"
        }, "Correct layoutData");
    });

    test("Change of editor's value changing 'items.editorOptions.value' option", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                dataField: "FamousPirate",
                editorType: "dxTextBox",
                editorOptions: {
                    value: "John Morgan"
                }
            }]
        });

        // act
        $testContainer.find(".dx-textbox").dxTextBox("instance").option("value", "Cpt. Jack Sparrow");

        // assert
        assert.deepEqual($testContainer.dxLayoutManager("instance").option("layoutData"), {
            "FamousPirate": "Cpt. Jack Sparrow"
        }, "Correct layoutData");
    });

    test("Render when 'colCount' is 'auto' and have 1 item", (assert) => {
        // arrange
        let $testContainer = $("#container").width(450);

        $testContainer.dxLayoutManager({
            layoutData: {
                test: "abc"
            },
            colCount: "auto",
            minColWidth: 200
        });

        // act
        let instance = $testContainer.dxLayoutManager("instance"),
            colCount = instance._getColCount();

        // assert
        assert.equal(colCount, 1, "We have only 1 column, because have only one item");
    });

    test("Correct colCount when width is less that minColWidth and colCount is auto", (assert) => {
        // arrange
        let $testContainer = $("#container").width(450);

        $testContainer.dxLayoutManager({
            layoutData: {
                test: "abc"
            },
            colCount: "auto",
            minColWidth: 200,
            width: 100
        });

        // act
        let instance = $testContainer.dxLayoutManager("instance"),
            colCount = instance._getColCount();

        // assert
        assert.equal(colCount, 1, "Correct colCount");
    });

    test("Render when 'colCount' is 'auto' and have 3 items", (assert) => {
        // arrange
        let $testContainer = $("#container").width(450);

        $testContainer.dxLayoutManager({
            layoutData: {
                test1: "abc",
                test2: "qwe",
                test3: "xyz"
            },
            colCount: "auto",
            minColWidth: 200
        });

        // act
        let instance = $testContainer.dxLayoutManager("instance"),
            colCount = instance._getColCount(),
            expectedColCount = windowUtils.hasWindow() ? 2 : 1;

        // assert
        assert.equal(colCount, expectedColCount, "We have only 2 columns");
    });

    test("Change minColWidth when colCount is auto", (assert) => {
        // arrange
        let $testContainer = $("#container").width(450);

        $testContainer.dxLayoutManager({
            layoutData: {
                test1: "abc",
                test2: "qwe",
                test3: "xyz"
            },
            colCount: 1,
            minColWidth: 200
        });

        // act
        let instance = $testContainer.dxLayoutManager("instance"),
            invalidateStub = sinon.stub(instance, "_invalidate");

        instance.option("minColWidth", 100);
        assert.equal(invalidateStub.callCount, 0, "Invalidate is not fired, because colCount is not auto");


        instance.option("colCount", "auto");
        instance.option("minColWidth", 300);

        assert.equal(instance._getColCount(), 1, "We have only 1 column");
        assert.equal(invalidateStub.callCount, 2, "Invalidate fire 2 times, change colCount and change minColWidth");
        invalidateStub.restore();
    });

    test("Clear item watchers after disposing", (assert) => {
        // arrange
        let $testContainer = $("#container").width(450);

        $testContainer.dxLayoutManager({
            layoutData: {
                test1: "abc",
                test2: "qwe",
                test3: "xyz"
            }
        });

        // act
        let instance = $testContainer.dxLayoutManager("instance"),
            cleanWatcherStub = sinon.stub(instance, "_cleanItemWatchers");

        instance.$element().remove();
        assert.equal(cleanWatcherStub.callCount, 1, "_cleanItemWatchers is fired");

        cleanWatcherStub.restore();
    });

    test("Render validate", (assert) => {
        // arrange, act
        let $container = $("#container");

        $container.dxLayoutManager({
            layoutData: createTestObject(),
            colCount: 4,
            height: 800,
            form: {
                option: () => {},
                getItemID: (name) => {
                    return "dx_FormID_" + name;
                }
            },
            customizeItem: (item) => {
                switch(item.dataField) {
                    case "LastName":
                    case "FirstName":
                        item.editorOptions = {
                            value: ""
                        };
                        item.validationRules = [{
                            type: "required"
                        }];
                        break;
                }
            }
        });

        // assert
        assert.equal($container.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, 2, "2 validation marks rendered");

        assert.equal($container.find(".dx-validator [id='dx_FormID_LastName']").length, 1, "validator for lastName");
        assert.equal($container.find(".dx-validator [id='dx_FormID_FirstName']").length, 1, "validator for lastName");
    });

    test("Validation rules and required marks render", (assert) => {
        // arrange, act
        let $container = $("#container");

        $container.dxLayoutManager({
            layoutData: {
                field1: 3,
                field2: 4,
                field3: 6,
                field4: 6
            },
            colCount: 4,
            height: 800,
            items: [{
                dataField: "field1",
                validationRules: [{
                    type: "numeric"
                }]
            }, {
                dataField: "field2",
                validationRules: [{
                    type: "numeric"
                }, {
                    type: "required"
                }]
            }, {
                dataField: "field3",
                validationRules: [{
                    type: "required"
                }, {
                    type: "numeric"
                }]
            }, {
                dataField: "field4",
                validationRules: [{
                    type: "required"
                }]
            }]
        });

        // assert
        assert.equal($container.find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, 3, "3 required marks rendered");
        assert.equal($container.find("." + internals.FIELD_ITEM_CLASS).first().find("." + internals.FIELD_ITEM_REQUIRED_MARK_CLASS).length, 0, "First item does not have required mark");
    });
});

QUnit.module("Templates", () => {
    test("Render template", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                test: "abc"
            },
            items: [{
                dataField: "test",
                template: function(data, container) {
                    assert.deepEqual(typeUtils.isRenderer(container), !!config().useJQuery, "container is correct");

                    $(container).append($("<span>").text("Template"));

                    data.editorOptions.onValueChanged = function(args) {
                        data.component.option("layoutData." + data.dataField, args.value);
                    };

                    $("<div>")
                        .dxTextArea(data.editorOptions)
                        .appendTo(container);
                }
            }]
        });

        // act
        let $fieldItemWidget = $testContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS),
            spanText = $fieldItemWidget.find("span").text(),
            textArea = $fieldItemWidget.find(".dx-textarea").dxTextArea("instance"),
            layoutManager = $testContainer.dxLayoutManager("instance");

        // assert
        assert.equal(spanText, "Template");
        assert.equal(textArea.option("value"), layoutManager.option("layoutData.test"), "Widget's value equal to bound datafield");
    });

    test("Check template bound to data", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                test: "abc"
            },
            items: [{
                dataField: "test",
                template: function(data, container) {
                    let $container = $(container);
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

        // act
        let $fieldItemWidget = $testContainer.find("." + internals.FIELD_ITEM_CONTENT_CLASS),
            textArea = $fieldItemWidget.find(".dx-textarea").dxTextArea("instance"),
            layoutManager = $testContainer.dxLayoutManager("instance");

        textArea.option("value", "qwerty");

        // assert
        assert.equal(layoutManager.option("layoutData.test"), "qwerty", "Correct data");
    });
});

QUnit.module("Public methods", () => {
    test("UpdateData, simple case", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                test1: "abc",
                test2: "xyz"
            }
        });

        // act
        let layoutManager = $testContainer.dxLayoutManager("instance");

        layoutManager.updateData("test2", "qwerty");

        // assert
        assert.equal(layoutManager.option("layoutData.test2"), "qwerty", "Correct data");
    });

    test("UpdateData, update with object", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                test1: "abc",
                test2: "xyz"
            }
        });

        // act
        let layoutManager = $testContainer.dxLayoutManager("instance");

        layoutManager.updateData({
            test1: "xyz",
            test2: "qwerty"
        });

        // assert
        assert.deepEqual(layoutManager.option("layoutData"), {
            test1: "xyz",
            test2: "qwerty"
        }, "Correct data");
    });

    test("Get editor instance", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            layoutData: {
                test1: "abc",
                test2: "xyz"
            },
            items: ["test1", {
                name: "test3",
                editorType: "dxNumberBox"
            }]
        });

        // act
        let layoutManager = $testContainer.dxLayoutManager("instance");

        // assert
        assert.ok(!typeUtils.isDefined(layoutManager.getEditor("test2")), "We has't instance for 'test2' field");
        assert.ok(typeUtils.isDefined(layoutManager.getEditor("test1")), "We have instance for 'test1' field");
        assert.ok(typeUtils.isDefined(layoutManager.getEditor("test3")), "We have instance for 'test3' field");

        assert.equal(layoutManager.getEditor("test1").NAME, "dxTextBox", "It's textbox");
        assert.equal(layoutManager.getEditor("test3").NAME, "dxNumberBox", "It's numberBox");
    });
});

QUnit.module("Accessibility", () => {
    test("Check required state", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: ["test1", {
                dataField: "test2",
                isRequired: true
            }]
        });

        // act
        let $fieldItems = $testContainer.find("." + internals.FIELD_ITEM_CLASS);

        // assert
        assert.equal($fieldItems.first().find("input").attr("aria-required"), "false", "First item isn't required");
        assert.equal($fieldItems.last().find("input").attr("aria-required"), "true", "Second item is required");
    });

    test("Check help text", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                dataField: "test1",
                helpText: "help text"
            }]
        });

        // act
        let $fieldItem = $testContainer.find("." + internals.FIELD_ITEM_CLASS),
            itemDescribedBy = $fieldItem.find("input").attr("aria-describedby"),
            helpTextID = $fieldItem.find("." + internals.FIELD_ITEM_HELP_TEXT_CLASS).attr("id");

        // assert
        assert.equal(itemDescribedBy, helpTextID, "Help text id and input's describedby attributes are equal");
    });
});

QUnit.module("Layout manager responsibility", {
    beforeEach: () => {
        responsiveBoxScreenMock.setup.call(this);
    },
    afterEach: () => {
        responsiveBoxScreenMock.teardown.call(this);
    }
}, () => {
    test("Middle screen size", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                dataField: "test1"
            }, {
                dataField: "test2"
            }],
            colCount: 2,
            onLayoutChanged: () => {}
        });

        // assert
        assert.ok(!$testContainer.hasClass(internals.LAYOUT_MANAGER_ONE_COLUMN), "Layout manager hasn't one column mode");
    });

    test("Small screen size", (assert) => {
        // arrange
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                dataField: "test1"
            }, {
                dataField: "test2"
            }],
            colCount: 2,
            onLayoutChanged: () => {}
        });

        // act
        this.updateScreenSize(600);

        // assert
        assert.ok($testContainer.hasClass(internals.LAYOUT_MANAGER_ONE_COLUMN), "Layout manager has one column mode");
    });
});

QUnit.module("Button item", () => {
    test("Base rendering", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                itemType: "button"
            }, {
                itemType: "button",
                buttonOptions: { text: "Test" }
            }]
        });

        let $buttonItems = $testContainer.find(".dx-field-button-item"),
            secondButtonText = $buttonItems.last().text();

        // assert
        assert.equal($buttonItems.length, 2, "There are 2 button items");
        assert.ok($buttonItems.first().hasClass("dx-field-item"), "Item has a field-item class");
        assert.ok($buttonItems.first().hasClass("dx-field-button-item"), "Item has a field-button-item class");
        assert.equal(secondButtonText, "Test", "Button gets the correct config");
    });

    test("cssClass", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                itemType: "button",
                cssClass: "privateClass"
            }]
        });

        let $buttonItem = $testContainer.find(".dx-field-button-item");

        // assert
        assert.ok($buttonItem.hasClass("privateClass"), "Item has a custom class");
    });

    test("column class", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            colCount: 2,
            items: [{
                itemType: "button"
            }, {
                itemType: "button"
            }]
        });

        let $buttonItems = $testContainer.find(".dx-field-button-item");

        // assert
        assert.ok($buttonItems.first().hasClass("dx-col-0"), "Correct column index");
        assert.ok($buttonItems.first().hasClass("dx-first-col"), "Correct column index");
        assert.ok($buttonItems.last().hasClass("dx-col-1"), "Correct column index");
        assert.ok($buttonItems.last().hasClass("dx-last-col"), "Correct column index");
    });

    test("Check deprecated alignment option", (assert) => {
        // arrange, act
        let $testContainer = $("#container");
        let logStub = sinon.stub(errors, "log");

        $testContainer.dxLayoutManager({
            items: [{
                itemType: "button"
            }, {
                itemType: "button",
                alignment: "left"
            }, {
                itemType: "button",
                alignment: "center"
            }]
        });

        let $buttonItems = $testContainer.find(".dx-field-button-item");

        // assert
        assert.equal($buttonItems.first().css("textAlign"), "right", "By default buttons align by the right");
        assert.equal($buttonItems.eq(1).css("textAlign"), "left", "Left alignment accepted");
        assert.equal($buttonItems.last().css("textAlign"), "center", "Center alignment accepted");
        assert.deepEqual(logStub.firstCall.args, [
            "W0001",
            "dxForm",
            "alignment",
            "18.1",
            "Use the 'horizontalAlignment' option in button items instead."
        ], "Check warning parameters");
    });

    test("Horizontal alignment", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                itemType: "button"
            }, {
                itemType: "button",
                horizontalAlignment: "left"
            }, {
                itemType: "button",
                horizontalAlignment: "center"
            }]
        });

        let $buttonItems = $testContainer.find(".dx-field-button-item");

        // assert
        assert.equal($buttonItems.first().css("textAlign"), "right", "By default buttons align by the right");
        assert.equal($buttonItems.eq(1).css("textAlign"), "left", "Left alignment accepted");
        assert.equal($buttonItems.last().css("textAlign"), "center", "Center alignment accepted");
    });

    test("Vertical alignment", (assert) => {
        // arrange, act
        let $testContainer = $("#container");

        $testContainer.dxLayoutManager({
            items: [{
                itemType: "button"
            }, {
                itemType: "button",
                verticalAlignment: "center"
            }, {
                itemType: "button",
                verticalAlignment: "bottom"
            }]
        });

        let $buttonItems = $testContainer.find(".dx-field-button-item");

        // assert
        assert.equal($buttonItems.first().parent().css("justifyContent"), "flex-start", "By default buttons align by the center");
        assert.equal($buttonItems.eq(1).parent().css("justifyContent"), "center", "Top alignment accepted");
        assert.equal($buttonItems.last().parent().css("justifyContent"), "flex-end", "Bottom alignment accepted");
    });
});
