"use strict";

var $ = require("jquery"),
    Editor = require("ui/editor/editor"),
    Class = require("core/class");

require("common.css!");

var READONLY_STATE_CLASS = "dx-state-readonly";

var Fixture = Class.inherit({
    createEditor: function(options) {
        this.$element = $("<div/>").appendTo("body");
        var editor = new Editor(this.$element, options);

        return editor;
    },
    createOnlyElement: function(options) {
        this.$element = $("<div/>").appendTo("body");

        return this.$element;
    },
    teardown: function() {
        this.$element.remove();
    }
});

QUnit.module("Editor markup", {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
});

QUnit.test("rendering", function(assert) {
    var editor = this.fixture.createEditor();
    assert.ok(editor);
});

QUnit.test("'readOnly' option has 'false' value by default", function(assert) {
    var editor = this.fixture.createEditor();

    assert.strictEqual(editor.option("readOnly"), false);
});

QUnit.test("'readOnly' option is set correctly on init", function(assert) {
    var editor = this.fixture.createEditor({
        readOnly: true
    });

    assert.ok(editor._$element.hasClass(READONLY_STATE_CLASS));
});

QUnit.test("'readOnly' option with 'true'/'false' value attaches/detaches 'dx-state-readonly' class", function(assert) {
    var editor = this.fixture.createEditor();

    editor.option("readOnly", true);

    assert.ok(editor._$element.hasClass(READONLY_STATE_CLASS));

    editor.option("readOnly", false);

    assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
});

QUnit.test("'readOnly' option with 0 value should remove readonly class and should not add it", function(assert) {
    var editor = this.fixture.createEditor();

    editor.option("readOnly", 0);
    editor.option("readOnly", 0);

    assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
});

QUnit.test("'readOnly' option with undefined value should remove readonly class and should not add it", function(assert) {
    var editor = this.fixture.createEditor();

    editor.option("readOnly", undefined);
    editor.option("readOnly", undefined);

    assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
});

QUnit.test("'readOnly' option with null value should remove readonly class and should not add it", function(assert) {
    var editor = this.fixture.createEditor();

    editor.option("readOnly", null);
    editor.option("readOnly", null);

    assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
});

QUnit.module("the 'name' option", {
    beforeEach: function() {
        this.$element = $("<div>").appendTo("body");
        this.EditorInheritor = Editor.inherit({
            _initMarkup: function() {
                this._$submitElement = $("<input type='hidden'>").appendTo(this.$element());
                this.callBase();
            },
            _getSubmitElement: function() {
                return this._$submitElement;
            }
        });
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test("editor inheritor input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name";

    new this.EditorInheritor(this.$element, {
        name: expectedName
    });

    var $input = this.$element.find("input[type='hidden']");
    assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
});

QUnit.test("editor inheritor input should get correct 'name' attribute after the 'name' option is changed", function(assert) {
    var expectedName = "new_name",
        instance = new this.EditorInheritor(this.$element, {
            name: "initial_name"
        }),
        $input = this.$element.find("input[type='hidden']");

    instance.option("name", expectedName);
    assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value ");
});

QUnit.test("the 'name' attribute should not be rendered if name is an empty string", function(assert) {
    new this.EditorInheritor(this.$element);

    var input = this.$element.find("input[type='hidden']").get(0);
    assert.notOk(input.hasAttribute("name"), "there should be no 'name' attribute for hidden input");
});

QUnit.test("the 'name' attribute should be removed after name is changed to an empty string", function(assert) {
    var instance = new this.EditorInheritor(this.$element, {
            name: "some_name"
        }),
        input = this.$element.find("input[type='hidden']").get(0);

    instance.option("name", "");
    assert.notOk(input.hasAttribute("name"), "there should be no 'name' attribute for hidden input");
});
