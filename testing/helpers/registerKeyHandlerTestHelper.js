import $ from "jquery";
import keyboardMock from "./keyboardMock.js";

const SUPPORTED_KEYS = ["backspace", "tab", "enter", "escape", "pageUp", "pageDown", "end", "home", "leftArrow", "upArrow", "rightArrow", "downArrow", "del", "space", "F", "A", "asterisk", "minus"];

const { module, test, assert } = QUnit;

const registerKeyHandlerTestHelper = {
    runTests: function(config) {

        const { widgetCallBack, checkedWidgetCallBack, checkInitialize, testNamePrefix } = config;

        module("RegisterKeyHandler", {
            beforeEach: () => {
                this.handler = sinon.spy();

                this.createWidget = (options = {}) => {
                    this.$widget = $("<div>").appendTo("#qunit-fixture");

                    this.widget = widgetCallBack(this.$widget, options);

                    let checkedCallBackResult = checkedWidgetCallBack ? checkedWidgetCallBack(this.widget) : this.widget;
                    this.checkedElement = checkedCallBackResult.checkedElement || checkedCallBackResult.$element();
                    this.checkedWidget = checkedCallBackResult.checkedWidget || checkedCallBackResult;
                };

                this.checkKeyHandlerCall = (key) => {
                    let args = this.handler.firstCall.args[0];

                    assert.strictEqual(this.handler.callCount, 1, `key press ${key} button was handled`);
                    assert.deepEqual(this.checkedWidget._supportedKeys()[key], this.handler, "handled true event");
                    assert.ok(this.checkedElement.is(args.target), "event.target");
                };
            },
            afterEach: () => {
                this.$widget.remove();
            }
        }, () => {
            const getNamePrefix = () => testNamePrefix ? testNamePrefix : '';

            SUPPORTED_KEYS.forEach((key) => {
                checkInitialize && test(`${getNamePrefix()} RegisterKeyHandler -> onInitialize - "${key}"`, () => {
                    this.createWidget({ onInitialized: e => { e.component.registerKeyHandler(key, this.handler); } });

                    keyboardMock(this.checkedElement).press(key);
                    this.checkKeyHandlerCall(key);
                });

                test(`${getNamePrefix()} RegisterKeyHandler -> "${key}"`, () => {
                    this.createWidget();

                    this.widget.registerKeyHandler(key, this.handler);

                    keyboardMock(this.checkedElement).press(key);
                    this.checkKeyHandlerCall(key);
                });
            });
        });
    }
};

export default registerKeyHandlerTestHelper;
