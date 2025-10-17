import $ from 'jquery';
import caret from '__internal/ui/text_box/m_utils.caret';
import keyboardMock from '../../helpers/keyboardMock.js';
import domAdapter from '__internal/core/m_dom_adapter';
import devices from '__internal/core/m_devices';

const { module: testModule, test } = QUnit;

testModule('caret', () => {
    test('get caret position', function(assert) {
        const caretPosition = { start: 1, end: 2 };
        const $input = $('<input>').appendTo('#qunit-fixture');

        const keyboard = keyboardMock($input, true);

        keyboard.type('12345').caret({ start: 1, end: 2 });

        assert.deepEqual(caret($input), caretPosition, 'caret position is correct');
    });

    test('set caret position', function(assert) {
        const caretPosition = { start: 1, end: 2 };
        const $input = $('<input>').val('12345').appendTo('#qunit-fixture');

        $input.focus();
        caret($input, caretPosition);

        assert.deepEqual(caret($input), caretPosition, 'caret position set correctly');
    });

    test('setCaret should not be called if input is not in document (T341277)', function(assert) {
        const caretPosition = { start: 1, end: 2 };
        const input = document.createElement('input');
        input.value = '12345';

        // Mock getActiveElement to return null (not the input)
        // This simulates the input not being focused/active
        const getActiveElementStub = sinon.stub(domAdapter, 'getActiveElement').returns(null);

        try {
            const result = caret(input, caretPosition);

            // When input is not active and isFocusingOnCaretChange is true (iOS/Mac),
            // the function should return early (undefined) without setting caret
            assert.strictEqual(result, undefined, 'caret() returned undefined (early exit)');

            // Verify that selectionStart/End were not changed
            // For a detached element without being set, these should be 0
            assert.strictEqual(input.selectionStart, 0, 'selectionStart was not set');
            assert.strictEqual(input.selectionEnd, 0, 'selectionEnd was not set');
        } catch(e) {
            assert.ok(false, `exception is thrown: ${e}`);
        } finally {
            getActiveElementStub.restore();
        }
    });

    test('Exception has not been fired if input.selectionStart and input.selectionEnd fire exeptions (T341277)', function(assert) {
        const caretPosition = { start: 1, end: 2 };
        const input = {
            set selectionStart(_value) {
                throw 'You can not get a selection';
            },
            set selectionEnd(_value) {
                throw 'You can not get a selection';
            }
        };
        const getActiveElementStub = sinon.stub(domAdapter, 'getActiveElement').returns(input);

        try {
            caret(input, caretPosition);
            assert.ok(true, 'exception is not thrown');
        } catch(e) {
            assert.ok(false, 'exception is thrown');
        } finally {
            getActiveElementStub.restore();
        }
    });

    test('\'getCaret\' does not raise an error when it is impossible to get a range', function(assert) {
        const pseudoInput = {
            get selectionStart() {
                throw 'You can not get a selection';
            },

            get selectionEnd() {
                throw 'You can not get a selection';
            }
        };

        try {
            assert.deepEqual(caret(pseudoInput), { start: 0, end: 0 });
            assert.ok(true, 'exception is not thrown');
        } catch(e) {
            assert.ok(false, 'exception is thrown');
        }
    });

    test('\'setCaret\' does not raise an error when it is impossible to set a range', function(assert) {
        const caretPosition = { start: 1, end: 2 };
        const initialDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'selectionStart');
        const getterSetterConfig = {
            get: function() {
                throw 'You can not get a selection';
            },
            set: function(value) {
                throw 'You can not set a selection';
            }
        };

        Object.defineProperty(HTMLInputElement.prototype, 'selectionStart', $.extend({}, initialDescriptor, getterSetterConfig));

        const input = $('<input>').appendTo('#qunit-fixture').get(0);

        try {
            caret(input, caretPosition);
            assert.ok(true, 'exception is not thrown');
        } catch(e) {
            assert.ok(false, 'exception is thrown');
        }

        Object.defineProperty(HTMLInputElement.prototype, 'selectionStart', initialDescriptor);
    });

    [false, true].forEach((forceSetCaret) => {
        const testTitle = `setCaretPosition should ${forceSetCaret ? 'not ' : ''}be prevented for some browsers when they focus input after caret position has changed,` +
            ` 'force' parameter is ${forceSetCaret}`;
        test(testTitle, function(assert) {
            const { ios, mac } = devices.real();
            const itShouldBePrevented = !forceSetCaret && (ios || mac);
            const $input = $('<input>').val('12345').appendTo('#qunit-fixture');
            const otherInput = $('<input>').appendTo('#qunit-fixture').get(0);
            const getActiveElementStub = sinon.stub(domAdapter, 'getActiveElement').callsFake(() => itShouldBePrevented ? otherInput : $input.get(0));

            $input.focus();
            const initialStartPosition = caret($input).start;
            caret($input, { start: 2, end: 2 }, forceSetCaret);
            const isPositionChangePrevented = caret($input).start === initialStartPosition;

            assert.strictEqual(isPositionChangePrevented, itShouldBePrevented, `Caret position change should ${itShouldBePrevented ? '' : 'not'} be prevented`);
            getActiveElementStub.restore();
        });
    });
});
