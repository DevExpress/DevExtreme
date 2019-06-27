import $ from "jquery";
import keyboardMock from "./keyboardMock.js";

const SUPPORTED_KEYS = ["backspace", "tab", "enter", "escape", "pageUp", "pageDown", "end", "home", "leftArrow", "upArrow", "rightArrow", "downArrow", "del", "space", "F", "A", "asterisk", "minus"];
const TABPANEL = "dxTabPanel";

const registerKeyHandlerTestHelper = {
    runTests: function(QUnit, WidgetName) {

        QUnit.module("RegisterKeyHandler", {
            beforeEach: () => {
                this.handler = sinon.spy(() => "checkHandler");

                this.createWidget = (options = {}) => {
                    this.$widget = $("<div>")[WidgetName]($.extend({
                        focusStateEnabled: true,
                        items: [{ text: "text" }]
                    }, options)).appendTo("#qunit-fixture");

                    this.widget = this.$widget[WidgetName]("instance");
                };

                this.checkKeyHandlerCall = (assert, key, widget) => {
                    let args = this.handler.firstCall.args[0];

                    assert.strictEqual(this.handler.callCount, 1, `key press ${key} button was handled`);
                    assert.deepEqual(widget._supportedKeys()[key], this.handler, "handled true event");
                    assert.ok(widget.$element().is(args.target), "event.target");
                };
            },
            afterEach: () => {
                this.$widget.remove();
            }
        }, () => {
            SUPPORTED_KEYS.forEach((key) => {
                QUnit.test(`RegisterKeyHandler -> onInitialize - "${key}"`, (assert) => {
                    this.createWidget({ onInitialized: e => { e.component.registerKeyHandler(key, this.handler); } });

                    if(WidgetName === TABPANEL) { this.$widget.attr("tabIndex", 1); }

                    keyboardMock(this.$widget).press(key);
                    this.checkKeyHandlerCall(assert, key, this.widget);
                });

                QUnit.test(`RegisterKeyHandler -> "${key}"`, (assert) => {
                    this.createWidget();

                    this.widget.registerKeyHandler(key, this.handler);

                    if(WidgetName === TABPANEL) {
                        keyboardMock(this.widget._tabs.$element()).press(key);
                        this.checkKeyHandlerCall(assert, key, this.widget._tabs);
                        this.handler.reset();

                        this.$widget.attr("tabIndex", 1);
                    }

                    keyboardMock(this.$widget).press(key);
                    this.checkKeyHandlerCall(assert, key, this.widget);
                });
            });
        });
    }
};

export default registerKeyHandlerTestHelper;
