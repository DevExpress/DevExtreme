"use strict";

var $ = require("jquery"),
    DropDownEditor = require("ui/drop_down_editor/ui.drop_down_editor");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownEditorLazy"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DROP_DOWN_EDITOR_CLASS = "dx-dropdowneditor";

var beforeEach = function() {
    this.rootElement = $("<div id='dropDownEditor'></div>");
    this.rootElement.appendTo($("#qunit-fixture"));
    this.$dropDownEditor = $("#dropDownEditor").dxDropDownEditor();
    this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor("instance");
};

var afterEach = function() {
    this.rootElement.remove();
    this.dropDownEditor = null;
};

var reinitFixture = function() {
    // TODO: get rid of  beforeEach and afterEach usage
    afterEach.apply(this, arguments);
    beforeEach.apply(this, arguments);
};

var testEnvironment = {
    beforeEach: beforeEach,
    reinitFixture: reinitFixture,
    afterEach: afterEach
};

QUnit.module("dxDropDownEditor", testEnvironment);

QUnit.test("dxDropDownEditor is defined", function(assert) {
    assert.ok(this.dropDownEditor);
});

QUnit.test("dxDropDownEditor can be instantiated", function(assert) {
    assert.ok(this.dropDownEditor instanceof DropDownEditor);
});

QUnit.test("root element must be decorated with DROP_DOWN_EDITOR_CLASS", function(assert) {
    assert.ok(this.rootElement.hasClass(DROP_DOWN_EDITOR_CLASS));
});

QUnit.test("dxDropDownEditor must have a button", function(assert) {
    assert.ok(this.dropDownEditor._$dropDownButton);
});
