import $ from 'jquery';
import keyboardMock from './keyboardMock.js';

const SUPPORTED_KEYS = ['backspace', 'tab', 'enter', 'escape', 'pageUp', 'pageDown', 'end', 'home', 'leftArrow', 'upArrow', 'rightArrow', 'downArrow', 'del', 'space', 'F', 'A', 'asterisk', 'minus'];

const { module, test, assert } = QUnit;

const registerKeyHandlerTestHelper = {
    runTests: function(config) {

        const { createWidget, keyPressTargetElement, checkInitialize, testNamePrefix } = config;

        module('RegisterKeyHandler', {
            beforeEach: function() {
                this.handler = sinon.spy();

                this.createWidget = (options = {}) => {
                    this.$widget = $('<div>').appendTo('#qunit-fixture');

                    this.widget = createWidget(this.$widget, options);

                    this.keyPressTargetElement = keyPressTargetElement ? keyPressTargetElement(this.widget) : this.widget.$element();
                };

                this.checkKeyHandlerCall = (key) => {
                    const args = this.handler.firstCall.args[0];

                    assert.strictEqual(this.handler.callCount, 1, `key press ${key} button was handled`);
                    assert.ok(this.keyPressTargetElement.is(args.target), 'event.target');
                };
            },
            afterEach: function() {
                this.$widget.remove();
            }
        }, () => {
            SUPPORTED_KEYS.forEach((key) => {
                if(checkInitialize) {
                    test(`${testNamePrefix || ''} RegisterKeyHandler -> onInitialize - "${key}"`, function(assert) {
                        this.createWidget({ onInitialized: e => { e.component.registerKeyHandler(key, this.handler); } });

                        keyboardMock(this.keyPressTargetElement).press(key);
                        this.checkKeyHandlerCall(key);
                    });
                }

                test(`${testNamePrefix || ''} RegisterKeyHandler -> "${key}"`, function() {
                    this.createWidget();

                    this.widget.registerKeyHandler(key, this.handler);

                    keyboardMock(this.keyPressTargetElement).press(key);
                    this.checkKeyHandlerCall(key);
                });
            });
        });
    }
};

export default registerKeyHandlerTestHelper;
