import $ from "jquery";
import keyboardMock from "./keyboardMock.js";

const SUPPORTED_KEYS = ["backspace", "tab", "enter", "escape", "pageUp", "pageDown", "end", "home", "leftArrow", "upArrow", "rightArrow", "downArrow", "del", "space", "F", "A", "asterisk", "minus"];

const registerKeyHandlerTestHelper = {
    runTests: function(QUnit, WidgetName) {

        QUnit.module("RegisterKeyHandler", {
            beforeEach: () => {
                this.handler = {
                    callCount: 0
                };

                this.createWidget = (options = {}) => {
                    this.$widget = $("<div>")[WidgetName]($.extend({
                        focusStateEnabled: true,
                        items: [{ text: "text" }]
                    }, options)).appendTo("#qunit-fixture");

                    this.widget = this.$widget[WidgetName]("instance");
                };

                this.checkKeyHandlerCall = (assert, key) => {
                    assert.strictEqual(this.handler.callCount, 1, `key press ${key} button was handled`);
                    assert.ok(this.$widget.is(this.handler.event.target), "event.target");
                };
            },
            afterEach: () => {
                this.$widget.remove();
            }
        }, () => {
            SUPPORTED_KEYS.forEach((key) => {
                QUnit.test(`RegisterKeyHandler -> onInitialize - "${key}"`, (assert) => {
                    this.createWidget({ onInitialized: e => { e.component.registerKeyHandler(key, (e) => { this.handler.event = e; this.handler.callCount++; }); } });

                    keyboardMock(this.$widget).press(key);
                    this.checkKeyHandlerCall(assert, key);
                });

                QUnit.test(`RegisterKeyHandler -> "${key}"`, (assert) => {
                    this.createWidget();

                    this.widget.registerKeyHandler(key, (e) => { this.handler.event = e; this.handler.callCount++; });

                    keyboardMock(this.$widget).press(key);
                    this.checkKeyHandlerCall(assert, key);
                });
            });
        });
    }
};

export default registerKeyHandlerTestHelper;
