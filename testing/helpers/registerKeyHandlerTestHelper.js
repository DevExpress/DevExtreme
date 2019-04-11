import $ from "jquery";
import keyboardMock from "./keyboardMock.js";

const SUPPORTED_KEYS = ["backspace", "tab", "enter", "escape", "pageUp", "pageDown", "end", "home", "leftArrow", "upArrow", "rightArrow", "downArrow", "del", "space", "F", "A", "asterisk", "minus"];

const registerKeyHandlerTestHelper = {
    runTests: function(QUnit, WidgetName) {

        QUnit.module("RegisterKeyHandler", {
            beforeEach: () => {
                this.$element = $(`<div id="${WidgetName}">`);
                $("#qunit-fixture").append(this.$element);

                this.handler = sinon.spy();

                this.initializeWidget = (options) => {
                    this.$element[WidgetName]($.extend({
                        focusStateEnabled: true,
                        items: [{ text: "text" }]
                    }, options));
                };

                this.getInstance = () => { return this.$element[WidgetName]("instance"); };

                this.pressKey = (key) => { this.triggeredEvent = keyboardMock(this.getInstance().element()).press(key); };

                this.checkAsserts = (assert, key) => {
                    assert.strictEqual(this.handler.callCount, 1, `key press ${key} button was handled`);
                    assert.deepEqual(this.triggeredEvent.event.target, this.getInstance().element(), "event.target");
                };
            },
            afterEach: () => {
                this.$element.remove();
            }
        }, () => {
            SUPPORTED_KEYS.forEach((key) => {
                QUnit.test(`RegisterKeyHandler -> onInitialize - "${key}"`, (assert) => {
                    this.initializeWidget({ onInitialized: e => { e.component.registerKeyHandler(key, this.handler); } });

                    this.pressKey(key);

                    this.checkAsserts(assert, key);
                });

                QUnit.test(`RegisterKeyHandler -> "${key}"`, (assert) => {
                    this.initializeWidget({});

                    this.getInstance().registerKeyHandler(key, this.handler);

                    this.pressKey(key);

                    this.checkAsserts(assert, key);
                });
            });
        });
    }
};

export default registerKeyHandlerTestHelper;
