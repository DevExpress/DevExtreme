"use strict";

var $ = require("jquery"),
    domUtils = require("core/utils/dom"),
    support = require("core/utils/support"),
    styleUtils = require("core/utils/style"),
    devices = require("core/devices"),
    initMobileViewport = require("mobile/init_mobile_viewport"),
    keyboardMock = require("../../helpers/keyboardMock.js");

QUnit.module("createMarkup");

QUnit.test("createMarkupFromString", function(assert) {
    var originalWinJS = window.WinJS,
        str = "<div>test</div>",
        $resultElement;

    try {
        window.WinJS = undefined;
        $resultElement = domUtils.createMarkupFromString(str);
        assert.equal($resultElement.length, 1);
        assert.equal($resultElement.text(), "test");

        window.WinJS = {
            Utilities: {
                setInnerHTMLUnsafe: function(tempElement, str) {
                    $(tempElement).append(str);
                }
            }
        };
        $resultElement = domUtils.createMarkupFromString(str);
        assert.equal($resultElement.length, 1);
        assert.equal($resultElement.text(), "test");
    } finally {
        window.WinJS = originalWinJS;
    }
});

QUnit.test("normalizeTemplateElement with script element", function(assert) {
    var domElement = document.createElement('script');

    domElement.innerHTML = "Test";

    var $result = domUtils.normalizeTemplateElement(domElement);

    assert.equal($result.text(), "Test", "template based on script element works fine");
});


QUnit.module("clipboard");

QUnit.test("get text from clipboard", function(assert) {
    var clipboardText = "";

    var $input = $("<input>").appendTo("#qunit-fixture");
    var keyboard = keyboardMock($input);

    $input.on("paste", function(e) {
        clipboardText = domUtils.clipboardText(e);
    });

    keyboard.paste("test");

    assert.equal(clipboardText, "test", "text from clipboard is correct");
});


QUnit.module("selection");

QUnit.test("clearSelection should not run if selectionType is 'Caret'", function(assert) {
    var originalGetSelection = window.getSelection;

    try {
        var cleared = 0,
            selectionMockObject = {
                empty: function() { cleared++; },
                type: "Range"
            };

        window.getSelection = function() { return selectionMockObject; };

        domUtils.clearSelection();
        assert.equal(cleared, 1, "selection should clear if type is Range");

        selectionMockObject.type = "Caret";
        domUtils.clearSelection();

        assert.equal(cleared, 1, "selection should not clear if type is Caret");

    } finally {
        window.getSelection = originalGetSelection;
    }
});


QUnit.module("initMobileViewPort");

QUnit.test("allowSelection should be detected by realDevice", function(assert) {
    if(!support.supportProp("user-select")) {
        assert.expect(0);
        return;
    }

    var $viewPort = $("<div>").addClass("dx-viewport");
    var originalRealDevice = devices.real();
    var originalCurrentDevice = devices.current();

    $viewPort.appendTo("#qunit-fixture");

    try {
        devices.real({ platform: "ios", deviceType: "mobile" });
        devices.current({ platform: "generic", deviceType: "desktop" });

        initMobileViewport();

        assert.equal($viewPort.css(styleUtils.styleProp("user-select")), "none", "allow selection detected by real device");
    } finally {
        devices.real(originalRealDevice);
        devices.current(originalCurrentDevice);
    }
});

QUnit.test("dont prevent touch move on win10 devices", function(assert) {
    if(!support.touch) {
        assert.expect(0);
        return;
    }

    var $viewPort = $("<div>").addClass("dx-viewport");
    var originalRealDevice = devices.real();

    $viewPort.appendTo("#qunit-fixture");

    try {
        var isPointerMoveDefaultPrevented = null;
        $(document).off(".dxInitMobileViewport");

        devices.real({ platform: "win", version: [10], deviceType: "mobile" });

        initMobileViewport();

        $(document).on("dxpointermove", function(e) {
            isPointerMoveDefaultPrevented = e.isDefaultPrevented();
        });
        var pointerEvent = $.Event("dxpointermove", { pointers: [1, 2], pointerType: "touch" });
        $("body").trigger(pointerEvent);
        assert.strictEqual(isPointerMoveDefaultPrevented, false, "default behaviour is not prevented");
    } finally {
        devices.real(originalRealDevice);
    }
});
