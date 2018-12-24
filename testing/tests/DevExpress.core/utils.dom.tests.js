import $ from "jquery";
import domUtils from "core/utils/dom";
import support from "core/utils/support";
import styleUtils from "core/utils/style";
import devices from "core/devices";
import initMobileViewport from "mobile/init_mobile_viewport";
import keyboardMock from "../../helpers/keyboardMock.js";

const windowHeight = $(window).height();

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
    if(!support.supportProp("userSelect")) {
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

        assert.equal($viewPort.css(styleUtils.styleProp("userSelect")), "none", "allow selection detected by real device");
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


QUnit.module("Contains");

QUnit.test("it correctly detect the html element", function(assert) {
    var html = document.documentElement;

    assert.ok(domUtils.contains(document, html), "Document contains the html element");
});

QUnit.test("it correctly detect the body element", function(assert) {
    var body = document.body;

    assert.ok(domUtils.contains(document, body), "Document contains the body element");
});


QUnit.module("style utils", {
    beforeEach: function() {
        this.$container = $("<div style='width: 100px; height: 100px; padding: 10px; box-sizing: border-box; margin: 5px'></div>").appendTo("#qunit-fixture");
        this.$invisibleElement = $("<div style='width: 50px; height: 50px; display: none; padding: 5px;'></div>");
        this.$container.append(this.$invisibleElement);
    },

    afterEach: function() {
    }
});

QUnit.test("check calculateMaxHeight", function(assert) {
    const checkFunc = ({ value, container, offset }, expected) => {
        assert.strictEqual(domUtils.calculateMaxHeight(value, container, offset), expected);
    };

    checkFunc({ value: 300, container: null, offset: 0 }, 300);
    checkFunc({ value: 300, container: null, offset: -100 }, 200);
    checkFunc({ value: "300", container: null, offset: -100 }, 200);
    checkFunc({ value: "300px", container: null, offset: -100 }, 200);
    checkFunc({ value: "100mm", container: null, offset: -50 }, "calc(100mm - 50px)");
    checkFunc({ value: "100pt", container: null, offset: -50 }, "calc(100pt - 50px)");
    checkFunc({ value: "auto", container: null, offset: -50 }, "none");
    checkFunc({ value: null, container: null, offset: -50 }, "none");

    assert.roughEqual(domUtils.calculateMaxHeight("50%", window, -20), windowHeight / 2 - 20, 1, "string value in percent");
});

QUnit.test("check calculateMinHeight", function(assert) {
    const checkFunc = ({ value, container, offset }, expected) => {
        assert.strictEqual(domUtils.calculateMinHeight(value, container, offset), expected);
    };

    checkFunc({ value: 300, container: null, offset: 0 }, 300);
    checkFunc({ value: 300, container: null, offset: -100 }, 200);
    checkFunc({ value: "300", container: null, offset: -100 }, 200);
    checkFunc({ value: "300px", container: null, offset: -100 }, 200);
    checkFunc({ value: "100mm", container: null, offset: -50 }, "calc(100mm - 50px)");
    checkFunc({ value: "100pt", container: null, offset: -50 }, "calc(100pt - 50px)");
    checkFunc({ value: "auto", container: null, offset: -50 }, 0);
    checkFunc({ value: null, container: null, offset: -50 }, 0);

    assert.roughEqual(domUtils.calculateMinHeight("50%", window, -20), windowHeight / 2 - 20, 1, "string value in percent");
});

QUnit.test("check getPaddingsHeight", function(assert) {
    assert.strictEqual(domUtils.getPaddingsHeight(null), 0, "no element");
    assert.strictEqual(domUtils.getPaddingsHeight(this.$container), 20, "container paddings");
    assert.strictEqual(domUtils.getPaddingsHeight(this.$container, true), 30, "include margins");
    assert.strictEqual(domUtils.getPaddingsHeight(this.$container.get(0)), 20, "dom element in arguments");
    assert.strictEqual(domUtils.getPaddingsHeight(this.$invisibleElement), 10, "element paddings");
});

QUnit.test("check getVisibleHeight", function(assert) {
    assert.strictEqual(domUtils.getPaddingsHeight(null), 0, "no element");
    assert.strictEqual(domUtils.getVisibleHeight(this.$container), 100, "container height");
    assert.strictEqual(domUtils.getVisibleHeight(this.$container.get(0)), 100, "dom element in arguments");
    assert.strictEqual(domUtils.getVisibleHeight(this.$invisibleElement), 0, "invisible element height");
});
