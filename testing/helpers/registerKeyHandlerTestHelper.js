import $ from "jquery";
import keyboardMock from "./keyboardMock.js";

const SUPPORTED_KEYS = ["backspace", "tab", "enter", "escape", "pageUp", "pageDown", "end", "home", "leftArrow", "upArrow", "rightArrow", "downArrow", "del", "space", "F", "A", "asterisk", "minus"];

const registerKeyHandlerTestHelper = {
    runTests: function(QUnit, WidgetName, options = {}) {

        QUnit.module("RegisterKeyHandler", {
            beforeEach: () => {
                $("#qunit-fixture").append("<div id='dxWidget'>");
            },
            afterEach: () => {
                $("#dxWidget").remove();
            }
        }, () => {
            SUPPORTED_KEYS.forEach((key) => {
                QUnit.test(`RegisterKeyHandler -> onInitialize - "${key}"`, (assert) => {
                    const handler = sinon.spy();

                    const instance = $("#dxWidget")[WidgetName]({
                        focusStateEnabled: true,
                        items: [{ text: "text" }],
                        onInitialized: e => {
                            e.component.registerKeyHandler(key, handler);
                        }
                    })[WidgetName]("instance");

                    const triggerEvent = keyboardMock(instance.element()).press(key);

                    assert.strictEqual(handler.callCount, 1, `key press ${key} button was handled`);
                    assert.deepEqual(triggerEvent.event.target, instance.element(), "event.target");
                });

                QUnit.test(`RegisterKeyHandler -> "${key}"`, (assert) => {
                    const handler = sinon.spy();

                    const instance = $("#dxWidget")[WidgetName]({
                        focusStateEnabled: true,
                        items: [{ text: "text" }]
                    })[WidgetName]("instance");

                    instance.registerKeyHandler(key, handler);

                    const triggerEvent = keyboardMock(instance.element()).press(key);

                    assert.strictEqual(handler.callCount, 1, `key press ${key} button was handled`);
                    assert.deepEqual(triggerEvent.event.target, instance.element(), "event.target");
                });
            });
        });
    }
};

export default registerKeyHandlerTestHelper;
