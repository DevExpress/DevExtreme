var $ = require("jquery"),
    Editor = require("ui/editor/editor"),
    Class = require("core/class"),
    ValidationEngine = require("ui/validation_engine"),
    hoverEvents = require("events/hover");

require("common.css!");

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
        ValidationEngine.initGroups();
    }
});


(function() {
    QUnit.module("Editor", {
        beforeEach: function() {
            this.fixture = new Fixture();
        },
        afterEach: function() {
            this.fixture.teardown();
        }
    });

    QUnit.test("Editor can be instantiated", function(assert) {
        var editor = this.fixture.createEditor();
        assert.ok(editor instanceof Editor);
    });

    QUnit.test("rendering", function(assert) {
        var editor = this.fixture.createEditor();
        assert.ok(editor);
    });

    QUnit.test("'readOnly' option has 'false' value by default", function(assert) {
        var editor = this.fixture.createEditor();

        assert.strictEqual(editor.option("readOnly"), false);
    });

    QUnit.test("Changing the 'value' option invokes the onValueChanged and passes the old and new values as arguments", function(assert) {
        var oldValue = "old",
            newValue = "new",
            onValueChanged = function(options) {
                assert.strictEqual(options.previousValue, oldValue, "old value is ok");
                assert.strictEqual(options.value, newValue, "new value is ok");
            };
        var editor = this.fixture.createEditor();

        editor.option("value", oldValue);
        editor.option("onValueChanged", onValueChanged);
        editor.option("value", newValue);
    });

    QUnit.test("Changing the 'value' option invokes the onValueChanged and passes the old and new values as arguments, 'readOnly' editor", function(assert) {
        var oldValue = "old",
            newValue = "new",
            onValueChanged = function(options) {
                assert.strictEqual(options.previousValue, oldValue, "old value is ok");
                assert.strictEqual(options.value, newValue, "new value is ok");
            };
        var editor = this.fixture.createEditor({ readOnly: true });

        editor.option("value", oldValue);
        editor.option("onValueChanged", onValueChanged);
        editor.option("value", newValue);
    });

    QUnit.test("Changing the 'value' option invokes the onValueChanged and passes the old and new values as arguments, 'disabled' editor", function(assert) {
        var oldValue = "old",
            newValue = "new",
            onValueChanged = function(options) {
                assert.strictEqual(options.previousValue, oldValue, "old value is ok");
                assert.strictEqual(options.value, newValue, "new value is ok");
            };
        var editor = this.fixture.createEditor({ disabled: true });

        editor.option("value", oldValue);
        editor.option("onValueChanged", onValueChanged);
        editor.option("value", newValue);
    });

    QUnit.test("keyboardProcessor is not defined for readOnly editor", function(assert) {
        var editor = this.fixture.createEditor({ focusStateEnabled: true, readOnly: true });

        assert.strictEqual(editor._keyboardProcessor, undefined, "keyboardProcessor is not defined after init");

        editor.option("readOnly", false);

        assert.ok(editor._keyboardProcessor, "keyboardProcessor is defined");
    });

    QUnit.test("If _valueChangeEventInstance is present, the onValueChanged must receive it as a Event argument; and then _valueChangeEventInstance must be reset", function(assert) {
        var newValue = "new",
            _valueChangeEventInstance = "something",
            onValueChanged = function(options) {
                assert.strictEqual(options.event, _valueChangeEventInstance, "Event is ok");
            };

        var editor = this.fixture.createEditor();
        editor.option("onValueChanged", onValueChanged);
        editor._valueChangeEventInstance = _valueChangeEventInstance;
        editor.option("value", newValue);
        assert.strictEqual(editor._valueChangeEventInstance, undefined, "_valueChangeEventInstance is reset");
    });

    QUnit.test("_suppressValueChangeAction should suppress invoking _suppressValueChangeAction", function(assert) {
        assert.expect(0);

        var editor = this.fixture.createEditor();
        editor._suppressValueChangeAction();
        editor.option("onValueChanged", function() {
            throw Error("failed");
        });
        editor.option("value", true);
    });

    QUnit.test("_resumeValueChangeAction should resume invoking _suppressValueChangeAction", function(assert) {
        var value = "value",
            onValueChanged = function(options) {
                assert.strictEqual(options.value, value);
            };
        assert.expect(1);

        var editor = this.fixture.createEditor();
        editor._suppressValueChangeAction();
        editor._resumeValueChangeAction();
        editor.option("onValueChanged", onValueChanged);
        editor.option("value", value);
    });

    QUnit.test("onValueChanged should work correctly when it passed on onInitialized (T314007)", function(assert) {
        var valueChangeCounter = 0;
        var editor = this.fixture.createEditor({
            onInitialized: function(e) {
                e.component.option("onValueChanged", function() {
                    valueChangeCounter++;
                });
            }
        });

        editor.option("value", "new value");

        assert.equal(valueChangeCounter, 1, "onValueChanged was fired");
    });

    QUnit.test("Editor can be reset()", function(assert) {
        var editor = this.fixture.createEditor({ value: "123" });

        editor.reset();

        assert.strictEqual(editor.option("value"), null);
    });

    QUnit.test("T359215 - the hover class should be added on hover event if widget has read only state", function(assert) {
        var editor = this.fixture.createEditor({
                hoverStateEnabled: true,
                readOnly: true
            }),
            $editor = editor.$element();

        $($editor).trigger(hoverEvents.start);
        assert.ok($editor.hasClass("dx-state-hover"), "there is hover class");
    });
})("Editor");

(function() {
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
})("the 'name' option");

(function() {
    QUnit.module("Validation - UI", {
        beforeEach: function() {
            this.fixture = new Fixture();
        },
        afterEach: function() {
            this.fixture.teardown();
        }
    });

    var INVALID_VALIDATION_CLASS = "dx-invalid";

    QUnit.test("Widget can be created as invalid", function(assert) {
        // assign
        var message = "That is very bad editor";

        // act
        var editor = this.fixture.createEditor({
            value: "",
            isValid: false,
            validationError: {
                message: message
            }
        });

        // assert
        assert.ok(editor, "Editor should be created");
        assert.ok(editor.$element().hasClass(INVALID_VALIDATION_CLASS), "Editor main element should be marked as invalid");
    });


    QUnit.test("Widget can be set in invalid state through options", function(assert) {
        // assign
        var message = "That is very bad editor",
            editor = this.fixture.createEditor({
                value: ""
            });

        // act
        editor.option({
            isValid: false,
            validationError: {
                message: message
            }
        });

        // assert
        assert.ok(editor.$element().hasClass(INVALID_VALIDATION_CLASS), "Editor main element should be marked as invalid");
    });


    QUnit.test("Widget message should be created", function(assert) {
        var message = "That is very bad editor",
            editor = this.fixture.createEditor({});

        editor.option({
            isValid: false,
            validationError: {
                message: message
            }
        });

        assert.ok(editor._$validationMessage, "Tooltip should be created");
        assert.ok(editor._$validationMessage.hasClass("dx-invalid-message"), "Tooltip should be marked with auto");
        assert.ok(editor._$validationMessage.hasClass("dx-invalid-message-auto"), "Tooltip should be marked with auto");
        assert.ok(!editor._$validationMessage.hasClass("dx-invalid-message-always"), "Tooltip should not be marked with always");
        assert.equal(editor._$validationMessage.dxOverlay("instance").$content().text(), message, "Correct message should be set");
    });

    QUnit.test("Widget message (tooltip) should be created and always shown", function(assert) {
        // assign
        var message = "That is very bad editor",
            editor = this.fixture.createEditor({
                validationMessageMode: "always"
            });

        // act
        editor.option({
            isValid: false,
            validationError: {
                message: message
            }
        });

        // assert
        assert.ok(editor._$validationMessage, "Tooltip should be created");
        assert.ok(editor._$validationMessage.hasClass("dx-invalid-message"), "Tooltip should be marked with auto");
        assert.ok(editor._$validationMessage.hasClass("dx-invalid-message-always"), "Tooltip should be marked with always");
        assert.ok(!editor._$validationMessage.hasClass("dx-invalid-message-auto"), "Tooltip should not be marked with auto");
    });

    QUnit.test("Widget message (tooltip) should be created but never shown", function(assert) {
        // assign
        var message = "That is very bad editor",
            editor = this.fixture.createEditor({
                validationMessageMode: "none"
            });

        // act
        editor.option({
            isValid: false,
            validationError: {
                message: message
            }
        });

        // assert
        assert.ok(editor._$validationMessage, "Tooltip should be created");
        assert.ok(editor._$validationMessage.hasClass("dx-invalid-message"), "Tooltip should be marked with auto");
        assert.ok(!editor._$validationMessage.hasClass("dx-invalid-message-auto"), "Tooltip should not be marked as auto");
        assert.ok(!editor._$validationMessage.hasClass("dx-invalid-message-always"), "Tooltip should not be marked as always");
    });

    QUnit.test("Widget message (tooltip) should be destroyed after editor become valid", function(assert) {
        // assign
        var message = "That is very bad editor",
            editor = this.fixture.createEditor({
                validationMessageMode: "always"
            });

        editor.option({
            isValid: false,
            validationError: {
                message: message
            }
        });

        // act
        editor.option({ isValid: true });

        // assert
        assert.ok(!editor._$validationMessage, "Tooltip should be destroyed; reference should be removed");
    });

    QUnit.test("Validation message should flip if it is out of boundary validationBoundary", function(assert) {
        var $parent = this.fixture.createOnlyElement().css({
            paddingTop: "100px"
        });
        var $element = $("<div>").appendTo($parent);

        var editor = new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: "Flip"
            },
            validationBoundary: $parent
        });

        // act
        editor.option({ isValid: false });
        var $validationMessage = $element.find(".dx-overlay-content");

        // assert
        assert.ok($validationMessage.offset().top < $element.offset().top, "validation message was flipped");
    });

    QUnit.test("Validation message should have the same with editor width", function(assert) {
        var width = 100,
            $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: width,
            validationMessageMode: "always",
            validationError: {
                message: "Flip"
            },
            isValid: false
        });

        var $validationMessage = $element.find(".dx-invalid-message");
        assert.equal($validationMessage.outerWidth(), width, "validation message width is correct");
    });

    QUnit.test("Validation message should have the same with editor width after option change", function(assert) {
        var width = 200,
            $element = this.fixture.createOnlyElement(),
            editor = new Editor($element, {
                width: 100,
                validationMessageMode: "always",
                validationError: {
                    message: "Flip"
                },
                isValid: false
            });

        editor.option("width", width);
        var $validationMessage = $element.find(".dx-invalid-message");
        assert.equal($validationMessage.outerWidth(), width, "validation message width is correct");
    });

    QUnit.test("Overlay content width should be less or equal message width", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: 100,
            validationMessageMode: "always",
            validationError: {
                message: "Very very very very very very very very very very very very very very very very very long validation message"
            },
            isValid: false
        });

        var $validationMessage = $element.find(".dx-invalid-message"),
            $content = $validationMessage.find(".dx-overlay-content");

        assert.ok($content.outerWidth() <= $validationMessage.outerWidth(), "validation message width is correct");
    });

    QUnit.test("Validation message text should not be wrapped", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: "Error message"
            },
            isValid: false
        });

        var $content = $element.find(".dx-invalid-message .dx-overlay-content");
        assert.equal($content.css("whiteSpace"), "normal", "text is not wrapped");
    });

    QUnit.test("Validation message should have correct width for small content", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: 500,
            validationMessageMode: "always",
            validationError: {
                message: "Err"
            },
            isValid: false
        });

        var $content = $element.find(".dx-invalid-message .dx-overlay-content"),
            contentWidth = $content.outerWidth();

        assert.equal($content.css("width", "auto").outerWidth(), contentWidth, "validation message width is correct");
    });

    QUnit.test("T376114 - Validation message should have the 100px max height if the editor has smaller size", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: 20,
            validationMessageMode: "always",
            validationError: {
                message: "ErrorErrorErrorErrorErrorErrorError"
            },
            isValid: false
        });

        var $content = $element.find(".dx-invalid-message .dx-overlay-content");

        assert.equal($content.outerWidth(), 100, "the validation message width is correct");
    });

    QUnit.test("Validation overlay should have the 'propagateOutsideClick' with true ", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: "Error"
            },
            isValid: false
        });

        assert.equal($element.find(".dx-invalid-message.dx-widget").dxOverlay("option", "propagateOutsideClick"), true, "'propagateOutsideClick' option has correct value");
    });

    QUnit.test("Validation overlay should not inherit templates from the editor", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: "Error"
            },
            integrationOptions: {
                templates: {
                    content: {
                        render: function() {
                            $("div").attr("id", "editorContentTemplate");
                        }
                    }
                }
            },
            isValid: false
        });

        assert.equal($element.find(".dx-invalid-message.dx-widget #editorContentTemplate").length, 0, "overlay does not inherit templates from the editor");
    });

    QUnit.test("Validation overlay should be render correctly in hidden area", function(assert) {
        var $element = this.fixture.createOnlyElement();
        var $hiddenDiv = $("<div>").css("display", "none");

        $element.appendTo($hiddenDiv);

        var validationMessage = "text is required";
        var editor = new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: validationMessage
            },
            isValid: false
        });

        assert.equal(editor._$validationMessage.text(), validationMessage, "validation overlay text was render correctly");
    });

    QUnit.test("Validation overlay width after render in hidden area should be equal width in visible area", function(assert) {
        var $element = this.fixture.createOnlyElement();
        var $hiddenDiv = $("<div>").css("display", "none");

        $element.appendTo($hiddenDiv);
        $hiddenDiv.appendTo("#qunit-fixture");

        var validationMessage = "text";
        var editor = new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: validationMessage
            },
            isValid: false,
            width: 305
        });

        $hiddenDiv.css("display", "block");

        assert.equal(editor._$validationMessage.outerWidth(), 305, "overlay width was set correctly");
    });
})("Validation - UI");

(function() {
    QUnit.module("Validation overlay options", {
        beforeEach: function() {
            this.fixture = new Fixture();
        },
        afterEach: function() {
            this.fixture.teardown();
        }
    });

    QUnit.test("it should be possible to redefine validation overlay options", function(assert) {
        var $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: "always",
            validationError: {
                message: "Error message"
            },
            validationTooltipOptions: {
                width: 200,
                customOption: "Test"
            },
            isValid: false
        });

        var overlay = $element.find(".dx-invalid-message.dx-widget").dxOverlay("instance");

        assert.equal(overlay.option("customOption"), "Test", "a custom option has been created");
        assert.equal(overlay.option("width"), 200, "a default option has been redefined");
    });

    QUnit.test("editor's overlay options should be changed when validation overlay's options changed", function(assert) {
        var $element = this.fixture.createOnlyElement(),
            instance = new Editor($element, {
                validationMessageMode: "always",
                validationError: {
                    message: "Error message"
                },
                isValid: false
            });

        assert.equal(instance.option("validationTooltipOptions.width"), "auto", "options are readable on init");

        var overlay = instance._validationMessage;

        overlay.option("width", 150);
        assert.equal(instance.option("validationTooltipOptions.width"), 150, "option has ben changed");
    });

    QUnit.test("it should be possible to set validationTooltipOptions dynamically", function(assert) {
        var $element = this.fixture.createOnlyElement(),
            instance = new Editor($element, {
                validationMessageMode: "always",
                validationError: {
                    message: "Error message"
                },
                isValid: false
            }),
            overlay = instance._validationMessage;

        instance.option("validationTooltipOptions.width", 130);
        assert.equal(overlay.option("width"), 130, "option has ben changed");

        instance.option("validationTooltipOptions", { height: 50 });
        assert.equal(overlay.option("height"), 50, "option has ben changed");
        assert.equal(instance.option("validationTooltipOptions.width"), 130, "redefined object's fields was not changed");
        assert.equal(instance.option("validationTooltipOptions.shading"), false, "default object's fields was not changed");
    });
})("Validation Events");


(function() {
    QUnit.module("Validation Events", {
        beforeEach: function() {
            this.fixture = new Fixture();
        },
        afterEach: function() {
            this.fixture.teardown();
        }
    });

    QUnit.test("validationRequest event should fire on value change", function(assert) {
        var value = "test123",
            handler = sinon.stub();

        var editor = this.fixture.createEditor({
            value: "xxx"
        });

        editor.validationRequest.add(handler);

        // act
        editor.option("value", value);
        // assert
        var params = handler.getCall(0).args[0];
        assert.ok(handler.calledOnce, "Validating handler should be called");
        assert.equal(params.value, value, "Correct value was passed");
        assert.equal(params.editor, editor, "Editor was passed");
    });

    QUnit.test("T220137: validationRequest event should NOT fire on value change", function(assert) {
        var nullValue = null,
            handler = sinon.stub();


        var editor = this.fixture.createEditor({
            value: undefined
        });

        editor.validationRequest.add(handler);

        // act
        editor.option("value", nullValue);
        // assert
        assert.ok(!handler.called, "Validating handler should not be called");
    });
})("Validation Events");

QUnit.module("aria accessibility", {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
});

QUnit.test("readonly state", function(assert) {
    var editor = this.fixture.createEditor({ readOnly: true });

    assert.equal(editor.$element().attr("aria-readonly"), "true", "aria-readonly is correct");

    editor.option("readOnly", false);
    assert.equal(editor.$element().attr("aria-readonly"), undefined, "aria-readonly does not exist in not readonly state");
});

QUnit.test("invalid state", function(assert) {
    var editor = this.fixture.createEditor({ isValid: false });

    assert.equal(editor.$element().attr("aria-invalid"), "true", "aria-invalid is correct");

    editor.option("isValid", true);
    assert.equal(editor.$element().attr("aria-invalid"), undefined, "aria-invalid does not exist in valid state");
});
