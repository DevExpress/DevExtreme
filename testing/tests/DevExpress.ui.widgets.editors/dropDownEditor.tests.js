var $ = require("jquery"),
    DropDownEditor = require("ui/drop_down_editor/ui.drop_down_editor"),
    Overlay = require("ui/overlay"),
    devices = require("core/devices"),
    eventsEngine = require("events/core/events_engine"),
    support = require("core/utils/support"),
    fx = require("animation/fx"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownEditorLazy"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DROP_DOWN_EDITOR_BUTTON_ICON = "dx-dropdowneditor-icon",
    DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button",
    DROP_DOWN_EDITOR_OVERLAY = "dx-dropdowneditor-overlay",
    DROP_DOWN_EDITOR_ACTIVE = "dx-dropdowneditor-active";

var TAB_KEY_CODE = "Tab",
    ESC_KEY_CODE = "Escape";

var beforeEach = function() {
    fx.off = true;
    this.rootElement = $("<div id='dropDownEditor'></div>");
    this.rootElement.appendTo($("#qunit-fixture"));
    this.$dropDownEditor = $("#dropDownEditor").dxDropDownEditor();
    this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor("instance");
    this.clock = sinon.useFakeTimers();
    this.originalTouchSupport = support.touch;
};

var afterEach = function() {
    this.rootElement.remove();
    this.dropDownEditor = null;
    this.clock.restore();
    support.touch = this.originalTouchSupport;
    fx.off = false;
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

QUnit.test("the element must be decorated with the DROP_DOWN_EDITOR_ACTIVE class while the drop down is displayed", function(assert) {
    var activeClass = DROP_DOWN_EDITOR_ACTIVE;
    assert.ok(!this.rootElement.hasClass(activeClass));
    this.dropDownEditor.open();
    assert.ok(this.rootElement.hasClass(activeClass));
    this.dropDownEditor.close();
    assert.ok(!this.rootElement.hasClass(activeClass));
});

QUnit.test("content returned by _renderPopupContent must be rendered inside the dropdown", function(assert) {
    var content = $("<div>test</div>");
    var dropDownEditor = this.dropDownEditor;
    dropDownEditor._renderPopupContent = function() {
        return content.appendTo(dropDownEditor._popup.$content());
    };
    dropDownEditor.open();
    assert.strictEqual(dropDownEditor._$popup.dxPopup("$content").find(content)[0], content[0]);
});

QUnit.test("dropdown must close on outside click", function(assert) {
    this.dropDownEditor.open();
    assert.ok(this.dropDownEditor._popup.option("closeOnOutsideClick"));
});

QUnit.test("clicking the input must not close the dropdown", function(assert) {
    this.dropDownEditor.open();
    pointerMock(this.dropDownEditor._input()).click();
    assert.ok(this.dropDownEditor.option("opened"));
});

QUnit.test("clicking the button must correctly close the dropdown", function(assert) {
    this.dropDownEditor.open();
    pointerMock(this.dropDownEditor._$dropDownButton).click();
    assert.ok(!this.dropDownEditor.option("opened"));
});

QUnit.test("clicking the button descendants must also correctly close the dropdown", function(assert) {
    this.dropDownEditor.open();
    pointerMock(this.dropDownEditor._$dropDownButton.find("." + DROP_DOWN_EDITOR_BUTTON_ICON)).click();
    assert.ok(!this.dropDownEditor.option("opened"));
});

QUnit.test("dropdown must be decorated with DROP_DOWN_EDITOR_OVERLAY", function(assert) {
    this.dropDownEditor.open();
    assert.ok(this.dropDownEditor._$popup.hasClass(DROP_DOWN_EDITOR_OVERLAY));
});

QUnit.test("option opened", function(assert) {
    this.dropDownEditor.option("opened", true);

    var $popup = $(".dx-popup");
    var popup = $popup.dxPopup("instance");
    popup.$content().append("test");

    assert.ok(popup.$content().is(":visible"), "popup is visible after opening");

    this.dropDownEditor.option("opened", false);

    assert.ok(popup.$content().is(":hidden"), "popup is hidden after closing");
});

QUnit.test("overlay get correct open and close", function(assert) {
    var opened;
    this.dropDownEditor.option("onOpened", function() { opened = true; });
    this.dropDownEditor.option("onClosed", function() { opened = false; });
    this.dropDownEditor.open();
    assert.strictEqual(opened, true, "open");
    this.dropDownEditor.close();
    assert.strictEqual(opened, false, "close");
});

QUnit.test("when a drop down editor is disabled, it should not be possible to show the drop down by clicking the drop down button", function(assert) {
    this.dropDownEditor.option("disabled", true);
    pointerMock(this.dropDownEditor._$dropDownButton).click();
    assert.ok(!this.dropDownEditor._popup);
});

QUnit.test("when a drop down editor is readonly, it should not be possible to show the drop down by clicking the drop down button", function(assert) {
    this.dropDownEditor.option("readOnly", true);
    pointerMock(this.dropDownEditor._$dropDownButton).click();
    assert.ok(!this.dropDownEditor._popup);
});

QUnit.test("changing the readonly option changing button state", function(assert) {
    var $button = this.$dropDownEditor.find("." + DROP_DOWN_EDITOR_BUTTON_CLASS);
    pointerMock($button).click();
    assert.ok(this.dropDownEditor.option("opened"));
    this.dropDownEditor.close();

    this.dropDownEditor.option("readOnly", true);
    $button = this.$dropDownEditor.find("." + DROP_DOWN_EDITOR_BUTTON_CLASS);
    pointerMock($button).click();
    assert.ok(!this.dropDownEditor.option("opened"));
});

QUnit.test("in design mode, it should not be possible to show the drop down by clicking the drop down button", function(assert) {
    config({ designMode: true });
    try {
        this.reinitFixture();
        pointerMock(this.dropDownEditor._$dropDownButton).click();
        assert.ok(!this.dropDownEditor._popup);
    } finally {
        config({ designMode: false });
    }
});

QUnit.test("correct buttons order after option change", function(assert) {
    this.dropDownEditor.option("showClearButton", true);

    var $buttonsContainer = this.$dropDownEditor.find(".dx-texteditor-buttons-container"),
        $buttons = $buttonsContainer.children();

    assert.equal($buttons.length, 2, "clear button and drop button were rendered");
    assert.ok($buttons.eq(0).hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS), "drop button is the first one");
    assert.ok($buttons.eq(1).hasClass("dx-clear-button-area"), "drop button is the second one");
});

QUnit.test("Validation: onShown validation message handler should change", function(assert) {
    var dropDownEditor = this.dropDownEditor;
    dropDownEditor.option({
        isValid: false,
        validationError: { message: "Something bad happened" }
    });

    dropDownEditor.open();

    assert.ok(dropDownEditor._$validationMessage);
    var pos = dropDownEditor._$validationMessage.dxOverlay("option", "position");
    assert.equal(pos.my, "left bottom", "Message should be above dropdown");
    assert.equal(pos.at, "left top", "Message should be above dropdown");
});

QUnit.test("Validation: onHidden validation message handler should restore tooltip position", function(assert) {
    var dropDownEditor = this.dropDownEditor;
    dropDownEditor.option({
        isValid: false,
        validationError: { message: "Something bad happened" }
    });

    // act
    dropDownEditor.open();
    dropDownEditor.close();
    // assert
    assert.ok(dropDownEditor._$validationMessage);
    var pos = dropDownEditor._$validationMessage.dxOverlay("option", "position");
    assert.equal(pos.my, "left top", "Message should be below dropdown");
    assert.equal(pos.at, "left bottom", "Message should be below dropdown");
});

QUnit.test("'popupPosition' option default value should depend on 'rtlEnabled' option value (T180106)", function(assert) {
    var dropDownEditor = this.dropDownEditor;

    var positionLTR = dropDownEditor.option("popupPosition");

    config({ rtlEnabled: true });

    var dropDownEditorRTL = $('<div id="dropDownEditorRTL">').dxDropDownEditor();

    try {
        var positionRTL = dropDownEditorRTL.dxDropDownEditor("option", "popupPosition");

        var at = positionLTR.at.indexOf("left") > -1 ? "right" : "left",
            my = positionLTR.my.indexOf("left") > -1 ? "right" : "left";

        assert.ok(positionRTL.at.indexOf(at) > -1, "position.at is reversed");
        assert.ok(positionRTL.my.indexOf(my) > -1, "position.my is reversed");
    } finally {
        $("#dropDownEditorRTL").remove();
        config({ rtlEnabled: false });
    }
});

QUnit.test("default value", function(assert) {
    var dropDownEditor = this.dropDownEditor;

    assert.strictEqual(dropDownEditor.option("value"), null, "Default value is null");
});

QUnit.test("reset()", function(assert) {
    var dropDownEditor = this.dropDownEditor;
    dropDownEditor.option("value", "123");
    // act
    dropDownEditor.reset();
    // assert
    assert.strictEqual(dropDownEditor.option("value"), null, "Value should be reset");
});

QUnit.test("reset method should clear the input value", function(assert) {
    var dropDownEditor = this.dropDownEditor,
        $input = dropDownEditor.$element().find("input");

    dropDownEditor.option("value", null);
    $input.val("456");

    // act
    dropDownEditor.reset();

    // assert
    assert.strictEqual(dropDownEditor.option("value"), null, "Value should be null");
    assert.equal($input.val(), "", "Input value is correct");

});

QUnit.test("dx-state-hover class added after hover on element", function(assert) {
    this.dropDownEditor.option({
        value: "123",
        hoverStateEnabled: true
    });

    this.$dropDownEditor.trigger("dxhoverstart");

    assert.ok(this.$dropDownEditor.hasClass("dx-state-hover"), "hover class has been added");
});

QUnit.test("content method returning overlay content", function(assert) {
    var dropDownEditor = this.dropDownEditor;

    dropDownEditor.open();

    var $content = $(dropDownEditor.content());

    assert.ok($content.hasClass("dx-popup-content"), "content has class dx-popup-content");
});

QUnit.test("field method returning overlay content", function(assert) {
    var dropDownEditor = this.dropDownEditor,
        $field = $(dropDownEditor.field());

    assert.equal(isRenderer(dropDownEditor.field()), !!config().useJQuery, "fieldElement is correct");
    assert.ok($field.hasClass("dx-texteditor-input"), "field has class dx-texteditor-input");
    assert.ok($field.hasClass("dx-texteditor-input"), "field has class dx-texteditor-input");
});


QUnit.module("focus policy");

QUnit.testInActiveWindow("editor should save focus on button clicking", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "blur preventing unnecessary on mobile devices");
        return;
    }

    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
            applyValueMode: "useButtons",
            focusStateEnabled: true
        }),
        instance = $dropDownEditor.dxDropDownEditor("instance");

    instance.open();

    var $buttons = instance._popup._wrapper().find(".dx-button");

    $.each($buttons, function(index, button) {
        var $button = $(button),
            buttonInstance = $button.dxButton("instance");
        instance.focus();
        $button.focus();

        var pointer = pointerMock(button);

        assert.ok(!$dropDownEditor.hasClass("dx-state-focused") || !buttonInstance.option("focusStateEnabled"), "dropDownEditor lose focus after click on button, nested into overlay");

        pointer.click();

        if(!instance.option("opened")) {
            assert.ok($dropDownEditor.hasClass("dx-state-focused"), "dropDownEditor obtained focus after popup button click with close action");
        } else {
            instance.option("opened", false);
        }
    });
});

QUnit.testInActiveWindow("editor should save focus on clearbutton clicking, fieldTemplate is used", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "blur preventing unnecessary on mobile devices");
        return;
    }

    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        items: [{ "Name": "one", "ID": 1 }, { "Name": "two", "ID": 2 }, { "Name": "three", "ID": 3 }],
        displayExpr: "Name",
        valueExpr: "ID",
        showClearButton: "true",
        value: 1,
        fieldTemplate: function(value) {
            var $textBox = $("<div>").dxTextBox({
                text: value,
                focusStateEnabled: true
            });
            return $("<div>").text(value + this.option("value")).append($textBox);
        },
    });

    $dropDownEditor.find(".dx-texteditor-input").focus();

    assert.ok($dropDownEditor.find(".dx-texteditor").hasClass("dx-state-focused"), "Widget is focused");

    var $buttonsContainer = $dropDownEditor.find(".dx-texteditor-buttons-container"),
        $buttons = $buttonsContainer.children();

    $buttons.eq(1).trigger("dxclick");

    assert.ok($dropDownEditor.hasClass("dx-state-focused"), "Widget is focused after click on clearButton");
});

QUnit.testInActiveWindow("input is focused by click on dropDownButton", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        focusStateEnabled: true
    });
    var $dropDownButton = $dropDownEditor.find(".dx-dropdowneditor-button");
    $dropDownButton.trigger("dxclick");

    assert.ok($dropDownEditor.find("input").is(":focus"), "input focused");
});

QUnit.test("native focus event should not be triggered if dropdown button clicked on mobile device", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
            focusStateEnabled: false,
            showDropDownButton: true
        }),
        instance = $dropDownEditor.dxDropDownEditor("instance"),
        focusinHandler = sinon.spy(),
        $input = $dropDownEditor.find(".dx-texteditor-input"),
        $dropDownButton = $dropDownEditor.find(".dx-dropdowneditor-button");

    eventsEngine.on($input, "focus focusin", focusinHandler);
    eventsEngine.trigger($dropDownButton, "dxclick");

    assert.ok(instance.option("opened"), "editor was opened");
    assert.equal(focusinHandler.callCount, 0, "native focus should not be triggered");
});

QUnit.test("focusout should not be fired after click on the dropDownButton", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
            focusStateEnabled: true
        }),
        $dropDownButton = $dropDownEditor.find(".dx-dropdowneditor-button");

    var e = $.Event("mousedown");

    $dropDownButton.trigger(e);

    assert.ok(e.isDefaultPrevented(), "focusout was prevented");
});

QUnit.test("focusout should not be fired on valueChanged", function(assert) {
    var onFocusOutStub = sinon.stub();
    var textBoxOnFocusOutStub = sinon.stub();

    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        fieldTemplate: function(value) {
            var $textBox = $("<div>").dxTextBox({
                onFocusOut: textBoxOnFocusOutStub,
            });
            return $("<div>").text(value + this.option("value")).append($textBox);
        },
        items: [0, 1, 2, 3, 4, 5],
        acceptCustomValue: true,
        valueChangeEvent: "change",
        onFocusOut: onFocusOutStub,
        focusStateEnabled: true
    });
    var $input = $dropDownEditor.find("input");
    var keyboard = keyboardMock($input);

    keyboard.type("2");
    keyboard.change();

    assert.equal(onFocusOutStub.callCount, 0, "onFocusOut is fired");
    assert.equal(textBoxOnFocusOutStub.callCount, 0, "onFocusOut textbox is fired");
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        fx.off = true;
        this.$rootElement = $("<div id='dropDownEditor'></div>");
        this.$rootElement.appendTo("body");
        this.dropDownEditor = $("#dropDownEditor").dxDropDownEditor({
            focusStateEnabled: true
        }).dxDropDownEditor("instance");
        this.$input = this.$rootElement.find(".dx-texteditor-input");
        this.$overlay = this.$rootElement.find(".dx-overlay");
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        this.$rootElement.remove();
        this.dropDownEditor = null;
        fx.off = false;
    }
});

QUnit.test("control keys test", function(assert) {
    var altDown = $.Event("keydown", { key: "ArrowDown", altKey: true }),
        altUp = $.Event("keydown", { key: "ArrowUp", altKey: true });

    assert.ok(!this.dropDownEditor.option("opened"), "overlay is hidden on first show");


    this.dropDownEditor.option("opened", true);
    this.keyboard.keyDown("esc");
    assert.ok(!this.dropDownEditor.option("opened"), "overlay is closed on escape press");

    this.$input.trigger(altDown);
    assert.ok(this.dropDownEditor.option("opened"), "overlay is visible on alt+down press");

    this.$input.trigger(altUp);
    assert.ok(!this.dropDownEditor.option("opened"), "overlay is visible on alt+up press");
});

QUnit.test("space/altDown key press on readOnly drop down doesn't toggle popup visibility", function(assert) {
    var altDown = $.Event("keydown", { key: "ArrowDown", altKey: true });

    this.dropDownEditor.option("readOnly", true);

    this.keyboard.keyDown("space");
    assert.ok(!this.dropDownEditor.option("opened"), "overlay is not visible on space press in readonly state");

    this.$input.trigger(altDown);
    assert.ok(!this.dropDownEditor.option("opened"), "overlay is not visible on alt+down press in readonly state");
});

QUnit.test("Enter and escape key press prevent default when popup in opened", function(assert) {
    assert.expect(1);

    var prevented = 0;

    this.dropDownEditor.option("opened", true);

    this.$rootElement.on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    this.keyboard.keyDown("enter");
    this.keyboard.keyDown("esc");

    assert.equal(prevented, 2, "defaults prevented on enter and escape keys");
});

QUnit.test("Enter and escape key press does not prevent default when popup in not opened", function(assert) {
    assert.expect(1);

    var prevented = 0;

    this.dropDownEditor.option("opened", false);

    this.$rootElement.on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    this.keyboard.keyDown("esc");
    this.keyboard.keyDown("enter");

    assert.equal(prevented, 0, "defaults has not prevented on enter and escape keys");
});

QUnit.test("Home and end key press prevent default when popup in opened", function(assert) {
    assert.expect(1);

    var prevented = 0;

    this.dropDownEditor.option("opened", true);

    this.$rootElement.on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    this.keyboard.keyDown("home");
    this.keyboard.keyDown("end");

    assert.equal(prevented, 2, "defaults prevented on home and end keys");
});

QUnit.test("Home and end key press does not prevent default when popup in not opened", function(assert) {
    assert.expect(1);

    var prevented = 0;

    this.dropDownEditor.option("opened", false);

    this.$rootElement.on("keydown", function(e) {
        if(e.isDefaultPrevented()) {
            prevented++;
        }
    });

    this.keyboard.keyDown("home");
    this.keyboard.keyDown("end");

    assert.equal(prevented, 0, "defaults has not prevented on home and end keys");
});

QUnit.test("Keyboard navigation with field template", function(assert) {
    this.dropDownEditor.option("fieldTemplate", function(data, container) {
        $(container).append($("<div>").dxTextBox({ value: data }));
    });

    this.$rootElement.find(".dx-texteditor-input").trigger($.Event("keydown", { key: "ArrowDown", altKey: true }));
    assert.ok(this.dropDownEditor.option("opened"), "overlay is visible on alt+down press");

    this.dropDownEditor.option("value", "123");

    keyboardMock(this.$rootElement.find(".dx-texteditor-input")).keyDown("esc");
    assert.ok(!this.dropDownEditor.option("opened"), "overlay is not visible on esc press after value changed");

    this.$rootElement.find(".dx-texteditor-input").trigger($.Event("keydown", { key: "ArrowDown", altKey: true }));
    assert.ok(this.dropDownEditor.option("opened"), "overlay is visible on esc press after value changed");
});

QUnit.testInActiveWindow("Focus policy with field template", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "blur preventing unnecessary on mobile devices");
        return;
    }

    this.dropDownEditor.option("fieldTemplate", function(data, container) {
        $(container).append($("<div>").dxTextBox({ value: data }));
    });

    this.$rootElement.find(".dx-texteditor-input").focus();
    this.$rootElement.find(".dx-texteditor-input").focusin();

    assert.ok(this.$rootElement.find(".dx-texteditor").hasClass("dx-state-focused"));

    this.dropDownEditor.option("value", "123");

    assert.ok(this.$rootElement.find(".dx-texteditor").hasClass("dx-state-focused"), "Text editor is focused after change value");
});

QUnit.test("Drop button template should be rendered correctly", function(assert) {
    var buttonTemplate = function(buttonData, contentElement) {
        assert.equal(isRenderer(contentElement), !!config().useJQuery, "contentElement is correct");

        return "<div>Template</div>";
    };

    this.dropDownEditor.option("dropDownButtonTemplate", buttonTemplate);

    var $button = this.$rootElement.find(".dx-dropdowneditor-button");

    assert.equal($button.text(), "Template", "Template was rendered");
});

QUnit.module("keyboard navigation inside popup", {
    beforeEach: function() {
        fx.off = true;
        this.$element = $("<div>");
        $("body").append(this.$element);

        this.instance = this.$element.dxDropDownEditor({
            focusStateEnabled: true,
            applyValueMode: "useButtons",
            opened: true
        }).dxDropDownEditor("instance");

        this.$input = this.$element.find(".dx-texteditor-input");

        var $popupWrapper = $(this.instance._popup._wrapper());
        this.$doneButton = $popupWrapper.find(".dx-popup-done.dx-button");
        this.$cancelButton = $popupWrapper.find(".dx-popup-cancel.dx-button");

        this.triggerKeyPress = function($element, keyCode, shiftKey) {
            var eventConfig = { key: keyCode };

            if(shiftKey) {
                eventConfig.shiftKey = shiftKey;
            }

            $($element)
                .focus()
                .trigger($.Event("keydown", eventConfig));
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.instance = null;
        fx.off = false;
    }
});

QUnit.testInActiveWindow("the first popup element should be focused on the 'tab' key press if the input is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    this.triggerKeyPress(this.$input, TAB_KEY_CODE);
    assert.ok(this.$doneButton.hasClass("dx-state-focused"), "the first popup element is focused");
});

QUnit.testInActiveWindow("the input should be focused on the 'tab' key press if the last element is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    this.triggerKeyPress(this.$cancelButton, TAB_KEY_CODE);
    assert.ok(this.$element.hasClass("dx-state-focused"), "the input is focused");
});

QUnit.testInActiveWindow("the input should be focused on the 'tab+shift' key press if the first element is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    this.triggerKeyPress(this.$doneButton, TAB_KEY_CODE, true);
    assert.ok(this.$element.hasClass("dx-state-focused"), "the input is focused");
});

QUnit.testInActiveWindow("the last popup element should be focused on the 'tab+shift' key press if the input is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    this.triggerKeyPress(this.$input, TAB_KEY_CODE, true);
    assert.ok(this.$cancelButton.hasClass("dx-state-focused"), "the last popup element is focused");
});

QUnit.testInActiveWindow("default event should be prevented on the tab key press if the input is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    var spy = sinon.spy();
    this.$cancelButton.on("keydown", spy);
    this.triggerKeyPress(this.$cancelButton, TAB_KEY_CODE);
    assert.ok(spy.args[0][0].isDefaultPrevented(), "default is prevented");
});

QUnit.testInActiveWindow("default event should be prevented on the tab key press if the last element is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    var spy = sinon.spy();
    this.$input.on("keydown", spy);
    this.triggerKeyPress(this.$input, TAB_KEY_CODE);
    assert.ok(spy.args[0][0].isDefaultPrevented(), "default is prevented");
});

QUnit.testInActiveWindow("popup should be closed on the 'esc' key press if the button inside is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.instance.open();
    this.triggerKeyPress(this.$doneButton, ESC_KEY_CODE);
    assert.notOk(this.instance.option("opened"), "popup is closed");
    assert.ok(this.$element.hasClass("dx-state-focused"), "editor is focused");
});


QUnit.module("deferRendering");

QUnit.test("popup is rendered only when open editor when deferRendering is true", function(assert) {
    $("#dropDownEditorLazy").dxDropDownEditor({
        deferRendering: false
    });

    assert.equal($(".dx-dropdowneditor-overlay").length, 1, "content is not rendered");
});


QUnit.module("Templates");

QUnit.test("contentTemplate as render", function(assert) {
    $("#dropDownEditorLazy").dxDropDownEditor({
        contentTemplate: function(data, content) {
            assert.equal(isRenderer(content), !!config().useJQuery, "contentElement is correct");
            $(content).addClass("drop-down-editor-content");
            return $("<div>").text(data.component.option("value"));
        },
        value: "test",
        opened: true
    });

    var $dropDownContent = $(".drop-down-editor-content");

    assert.equal($dropDownContent.length, 1, "There is one dropDownEditor content element with custom class");
    assert.equal($.trim($dropDownContent.text()), "test", "Correct content rendered");
});

QUnit.test("onValueChanged should be fired for each change by keyboard when fieldTemplate is used", function(assert) {
    var valueChangedSpy = sinon.spy();

    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        fieldTemplate: function(value) {
            var $textBox = $("<div>").dxTextBox();
            return $("<div>").text(value + this.option("value")).append($textBox);
        },
        items: [0, 1, 2, 3, 4, 5],
        acceptCustomValue: true,
        valueChangeEvent: "keyup",
        onValueChanged: valueChangedSpy
    });

    keyboardMock($dropDownEditor.find("input")).type("2");
    assert.equal(valueChangedSpy.callCount, 1, "onValueChanged is fired first time");

    keyboardMock($dropDownEditor.find("input")).type("4");
    assert.equal(valueChangedSpy.callCount, 2, "onValueChanged is fired second time");
});

QUnit.test("field template should be correctly removed after it is been applied once", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy"),
        dropDownEditor = $dropDownEditor.dxDropDownEditor({
            items: [1, 2, 3],
            opened: true,
            value: [1],
            searchEnabled: true,
            fieldTemplate: function(itemData, container) {
                var $textBox = $("<div>").dxTextBox(),
                    $field = $('<div>Test<div/>');

                assert.equal(isRenderer(container), !!config().useJQuery, "container is correct");
                $(container).append($field).append($textBox);
            }
        }).dxDropDownEditor("instance");

    dropDownEditor.option("fieldTemplate", null);

    assert.notEqual($dropDownEditor.text(), "Test", "fieldTemplate was correctly cleared");
});

QUnit.test("events should be rendered for input after value is changed when field template is specified (T399896)", function(assert) {
    var events = [
            "KeyDown", "KeyPress", "KeyUp",
            "Change", "Cut", "Copy", "Paste", "Input"
        ],
        spies = {},
        options = {
            value: 1,
            fieldTemplate: function() {
                return $("<div>").dxTextBox();
            }
        };

    $.each(events, function(_, event) {
        var spy = sinon.spy();
        options["on" + event] = spy;
        spies[event] = spy;
    });

    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor(options),
        instance = $dropDownEditor.dxDropDownEditor("instance");

    instance.option("value", 2);

    $.each(events, function(_, eventName) {
        var params = {};

        if(eventName.indexOf("Key") !== -1) {
            params.key = "";
        }

        var event = $.Event(eventName.toLowerCase(), params);
        $dropDownEditor.find("input").trigger(event);
        assert.equal(spies[eventName].callCount, 1, "the '" + eventName + "' event was fired after value change");
    });
});


QUnit.module("options");

QUnit.test("acceptCustomValue", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        acceptCustomValue: false,
        valueChangeEvent: "change keyup"
    });

    var $input = $dropDownEditor.find("input");
    keyboardMock($input).type("test");

    assert.equal($dropDownEditor.dxDropDownEditor("option", "value"), "", "value is not set");
    assert.equal($input.val(), "", "text is not rendered");
});

QUnit.test("openOnFieldClick", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        openOnFieldClick: true
    });

    var dropDownEditor = $dropDownEditor.dxDropDownEditor("instance");
    var $input = $dropDownEditor.find("input");

    assert.ok($dropDownEditor.hasClass("dx-dropdowneditor-field-clickable"), "special css class attached");

    $input.trigger("dxclick");
    assert.equal(dropDownEditor.option("opened"), true, "opened by field click");

    dropDownEditor.option({
        opened: false,
        openOnFieldClick: false
    });

    $input.trigger("dxclick");
    assert.equal(dropDownEditor.option("opened"), false, "not opened by field click");
});

QUnit.testInActiveWindow("focus editor in the case when 'openOnFieldClick' is false", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
            openOnFieldClick: false
        }),
        $input = $dropDownEditor.find(".dx-texteditor-input");

    $input.trigger("dxclick");

    assert.ok($dropDownEditor.hasClass("dx-state-focused"), "editor is focused on click");
});

QUnit.test("DropDownEditor doesn't opened on field click when it located in element with disabled state", function(assert) {
    var dropDownEditor = $("#dropDownEditorLazy")
        .wrap("<div class='dx-state-disabled'>")
        .dxDropDownEditor({ openOnFieldClick: true })
        .dxDropDownEditor("instance");

    $("#dropDownEditorLazy input").trigger("dxclick");

    assert.notOk(dropDownEditor.option("opened"), "DropDownEditor isn't opened");
});

QUnit.test("DropDownButton state after drop readOnly editor's state", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        readOnly: true
    });

    var dropDownEditor = $dropDownEditor.dxDropDownEditor("instance");
    dropDownEditor.option("readOnly", false);

    var dropDownButton = $dropDownEditor.find(".dx-dropdowneditor-button").dxButton("instance");

    assert.equal(dropDownButton.option("disabled"), false, "dropDownButton is not disabled");
});

QUnit.test("input is not editable after changed readOnly state", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        items: ["one", "two", "three"],
        acceptCustomValue: false,
        readOnly: true
    });

    var $input = $dropDownEditor.find("input");
    var instance = $dropDownEditor.dxDropDownEditor("instance");

    instance.option("value", "one");
    instance.option("readOnly", false);

    keyboardMock($input).type("b");

    assert.equal($input.val(), "one", "value is not changed");
});


QUnit.module("popup integration");

QUnit.test("onPopupInitialized", function(assert) {
    assert.expect(1);

    $("#dropDownEditorLazy").dxDropDownEditor({
        onPopupInitialized: function(e) {
            assert.equal(e.popup.NAME, "dxPopup", "initialized event is fired for popup");
        },
        opened: true
    });
});

QUnit.test("showPopupTitle option", function(assert) {
    var dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        showPopupTitle: true, opened: true
    }).dxDropDownEditor("instance");

    assert.equal($(".dx-overlay-content .dx-popup-title").length, 1, "popup title is rendered");

    dropDownEditor.close();
    dropDownEditor.option("showPopupTitle", false);
    dropDownEditor.open();

    assert.equal($(".dx-overlay-content .dx-popup-title").length, 0, "popup title is not rendered");
});

QUnit.test("popup should have correct class if it is flipped", function(assert) {
    var $dropDownEditor = $("<div>").appendTo("body");
    try {
        $dropDownEditor.css({ position: "fixed", bottom: 0 });
        $dropDownEditor.dxDropDownEditor({
            opened: true
        });

        var $popupContent = $(".dx-overlay-content");

        assert.ok($popupContent.hasClass("dx-dropdowneditor-overlay-flipped"), "flipped class was added");
    } finally {
        $dropDownEditor.remove();
    }
});

QUnit.test("the popup 'fullScreen' option should be overridden (T295450)", function(assert) {
    Overlay.defaultOptions({
        options: {
            fullScreen: true
        }
    });

    var $dropDownEditor = $("<div>").dxDropDownEditor({
        opened: true
    }).appendTo("body");

    try {
        var popup = $dropDownEditor.find(".dx-popup").dxPopup("instance");

        assert.equal(popup.option("fullScreen"), false, "the popup 'fullScreen' is still false");
    } finally {
        Overlay.defaultOptions({
            options: {
                fullScreen: false
            }
        });
        $dropDownEditor.remove();
    }
});

QUnit.test("widget should work correctly when popup 'fullScreen' is true", function(assert) {
    var $dropDownEditor = $("<div>").dxDropDownEditor({
        opened: true
    }).appendTo("body");

    var popup = $dropDownEditor.find(".dx-popup").dxPopup("instance");
    popup.option("fullScreen", true);

    assert.ok(true, "Widget works correctly");

    $dropDownEditor.remove();
});

QUnit.module("popup buttons", {
    beforeEach: function() {
        fx.off = true;
        this.$dropDownEditor = $("<div id='dropDownEditor'></div>")
            .appendTo("body");
        this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor({
            applyValueMode: "useButtons",
            showPopupTitle: true
        }).dxDropDownEditor("instance");
    },
    reinitFixture: function(options) {
        this.$dropDownEditor.remove();
        this.dropDownEditor = null;
        this.$dropDownEditor = $("<div id='dropDownEditor'></div>")
            .appendTo("body");
        this.dropDownEditor = this.$dropDownEditor.dxDropDownEditor(options)
            .dxDropDownEditor("instance");
    },
    afterEach: function() {
        this.$dropDownEditor.remove();
        this.dropDownEditor = null;
        fx.off = false;
    }
});

QUnit.test("applyValueMode option should affect on buttons rendering inside popup", function(assert) {
    if(!devices.current().ios) {
        this.reinitFixture({ showPopupTitle: false, applyValueMode: "useButtons" });
    }

    this.dropDownEditor.open();

    assert.ok($(".dx-overlay-content .dx-button").length > 0, "buttons are rendered");

    this.dropDownEditor.option("applyValueMode", "instantly");
    this.dropDownEditor.close();
    this.dropDownEditor.open();

    assert.equal($(".dx-overlay-content .dx-button").length, 0, "no buttons are rendered");
});

QUnit.test("OK/Cancel button should be shown dependent on applyValueMode option (T184179)", function(assert) {
    this.reinitFixture({ applyValueMode: "instantly" });
    this.dropDownEditor.open();

    var $applyButton = $(".dx-popup-done.dx-button"),
        $cancelButton = $(".dx-popup-cancel.dx-button");

    assert.ok(!$applyButton.length);
    assert.ok(!$cancelButton.length);
});

QUnit.test("Render apply button", function(assert) {
    this.dropDownEditor.open();

    var $applyButton = $(".dx-popup-done.dx-button").eq(0);
    assert.equal($applyButton.length, 1);
    assert.equal($applyButton.find(".dx-button-text").text(), "OK");
});

QUnit.test("Render apply button with custom text", function(assert) {
    this.reinitFixture({ applyButtonText: "Apply", applyValueMode: "useButtons", showPopupTitle: true });
    this.dropDownEditor.open();

    var $applyButton = $(".dx-popup-done.dx-button").eq(0);
    assert.equal($applyButton.find(".dx-button-text").text(), "Apply");
});

QUnit.test("Apply button text changing", function(assert) {
    this.dropDownEditor.open();
    this.dropDownEditor.option({ applyButtonText: "Apply", applyValueMode: "useButtons" });

    var $applyButton = $(".dx-popup-done.dx-button").eq(0);
    assert.equal($applyButton.find(".dx-button-text").text(), "Apply");
});

QUnit.test("Render cancel button", function(assert) {
    this.dropDownEditor.open();

    var $cancelButton = $(".dx-popup-cancel.dx-button").eq(0);
    assert.equal($cancelButton.length, 1);
    assert.equal($cancelButton.find(".dx-button-text").text(), "Cancel");
});

QUnit.test("Render cancel button with custom text", function(assert) {
    this.reinitFixture({ cancelButtonText: "Discard", applyValueMode: "useButtons", showPopupTitle: true });
    this.dropDownEditor.open();

    var $cancelButton = $(".dx-popup-cancel.dx-button").eq(0);
    assert.equal($cancelButton.find(".dx-button-text").text(), "Discard");
});

QUnit.test("Cancel button text changing", function(assert) {
    this.dropDownEditor.open();
    this.dropDownEditor.option({ cancelButtonText: "Discard", applyValueMode: "useButtons" });

    var $cancelButton = $(".dx-popup-cancel.dx-button").eq(0);
    assert.equal($cancelButton.find(".dx-button-text").text(), "Discard");
});

QUnit.test("Clicking on buttons should close dropDown popup", function(assert) {
    this.dropDownEditor.open();

    var $applyButton = $(".dx-popup-done.dx-button").eq(0),
        $cancelButton = $(".dx-popup-cancel.dx-button").eq(0);

    $applyButton.trigger("dxclick");
    assert.ok(!this.dropDownEditor.option("opened"), "dropDown is closed after click on apply button");

    $cancelButton.trigger("dxclick");
    assert.ok(!this.dropDownEditor.option("opened"), "dropDown is closed after click on cancel button");
});

QUnit.test("'buttonsLocation' option", function(assert) {
    this.reinitFixture({ applyValueMode: "useButtons", buttonsLocation: "bottom after" });

    this.dropDownEditor.open();
    assert.equal($(".dx-popup-bottom .dx-toolbar-after .dx-button").length, 2, "buttons are rendered in 'toolbar-after'");

    this.dropDownEditor.close();
    this.dropDownEditor.option("buttonsLocation", "bottom before");
    this.dropDownEditor.open();
    assert.equal($(".dx-popup-bottom .dx-toolbar-before .dx-button").length, 2, "buttons are rendered in 'toolbar-before'");
});


QUnit.module("actions", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("onContentReady should fire when widget is readOnly", function(assert) {
    var contentReadyFired = 0;

    $("#dropDownEditorLazy").dxDropDownEditor({
        readOnly: true,
        onContentReady: function() {
            contentReadyFired++;
        },
        deferRendering: false
    });

    assert.equal(contentReadyFired, 1, "content ready fired once");
});

QUnit.test("onOpened should fire when widget is readonly", function(assert) {
    var onOpenedActionStub = sinon.stub(),
        onClosedActionStub = sinon.stub();

    var dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        readOnly: true,
        onOpened: onOpenedActionStub,
        onClosed: onClosedActionStub,
        deferRendering: false
    }).dxDropDownEditor("instance");

    dropDownEditor.open();
    assert.ok(onOpenedActionStub.called, "onOpened action was fired");

    dropDownEditor.close();
    assert.ok(onClosedActionStub.called, "onClosed action was fired");
});

QUnit.test("onOpened should fire when widget is disabled", function(assert) {
    var onOpenedActionStub = sinon.stub(),
        onClosedActionStub = sinon.stub();

    var dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({
        disabled: true,
        onOpened: onOpenedActionStub,
        onClosed: onClosedActionStub
    }).dxDropDownEditor("instance");

    dropDownEditor.open();
    assert.ok(onOpenedActionStub.called, "onOpened action was fired");

    dropDownEditor.close();
    assert.ok(onClosedActionStub.called, "onClosed action was fired");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor(),
        $input = $dropDownEditor.find("input");

    assert.strictEqual($input.attr("role"), "combobox", "aria role on input is correct");
    assert.strictEqual($dropDownEditor.attr("role"), undefined, "aria role on element is not exist");
});

QUnit.test("aria-expanded property on input", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({ opened: true }),
        $input = $dropDownEditor.find("input"),
        instance = $dropDownEditor.dxDropDownEditor("instance");

    assert.equal($input.attr("aria-expanded"), "true", "aria-expanded property on opened");

    instance.option("opened", false);
    assert.equal($input.attr("aria-expanded"), "false", "aria-expanded property on closed");
});

QUnit.test("aria-haspopup property on input", function(assert) {
    var $input = $("#dropDownEditorLazy").dxDropDownEditor().find("input");
    assert.equal($input.attr("aria-haspopup"), "true", "haspopup attribute exists");
});

QUnit.test("aria-autocomplete property on input", function(assert) {
    var $input = $("#dropDownEditorLazy").dxDropDownEditor().find("input");
    assert.equal($input.attr("aria-autocomplete"), "list", "haspopup attribute exists");
});

QUnit.test("aria-owns should be removed when popup is not visible", function(assert) {
    var $dropDownEditor = $("#dropDownEditorLazy").dxDropDownEditor({ opened: true }),
        $input = $dropDownEditor.find("input"),
        instance = $dropDownEditor.dxDropDownEditor("instance");

    assert.notEqual($input.attr("aria-owns"), undefined, "owns exists");
    assert.equal($input.attr("aria-owns"), $(".dx-popup-content").attr("id"), "aria-owns points to popup's content id");

    instance.close();

    assert.strictEqual($input.attr("aria-owns"), undefined, "owns does not exist");
});

