import $ from 'jquery';

import 'common.css!';
import 'generic_light.css!';
import 'ui/text_box';
import 'ui/select_box';
import 'ui/number_box';
import browser from 'core/utils/browser';
import errors from 'ui/widget/ui.errors';

const { module, test } = QUnit;
const CUSTOM_BUTTON_HOVERED_CLASS = 'dx-custom-button-hovered';

function getTextEditorButtons($editor) {
    return {
        $before: $editor.find(' > div > .dx-texteditor-buttons-container:first-child, > .dx-dropdowneditor-input-wrapper > div > .dx-texteditor-buttons-container:first-child').children(),
        $after: $editor.find('.dx-texteditor-buttons-container:last-child').children()
    };
}

function isClearButton($element) {
    return $element.hasClass('dx-clear-button-area');
}

function isSpinButton($element) {
    return $element.hasClass('dx-numberbox-spin-container');
}

function isDropDownButton($element) {
    return $element.hasClass('dx-dropdowneditor-button');
}

module('button collection', () => {
    test('should render default buttons if the \'buttons\' option is not defined', function(assert) {
        const $textBox = $('<div>').dxTextBox({ showClearButton: true });
        const { $before, $after } = getTextEditorButtons($textBox);

        assert.notOk($before.length);
        assert.strictEqual($after.length, 1);
    });

    test('should not render default buttons if the collection is defined', function(assert) {
        const $textBox = $('<div>').dxTextBox({ buttons: [], showClearButton: true });
        const { $before, $after } = getTextEditorButtons($textBox);

        assert.notOk($before.length);
        assert.notOk($after.length);
    });

    test('should be an array', function(assert) {
        const checkException = (value) => {
            const textBox = $('<div>').dxTextBox({}).dxTextBox('instance');

            assert.throws(() => $('<div>').dxTextBox({ buttons: value }), errors.Error('E1053'));
            assert.throws(() => textBox.option('buttons', value), errors.Error('E1053'));
        };

        ['string', {}, 2, true].forEach(checkException);
    });

    module('button', () => {
        test('should be a string or an object only', function(assert) {
            const checkException = (value) => {
                const textBox = $('<div>').dxTextBox({}).dxTextBox('instance');

                assert.throws(() => $('<div>').dxTextBox({ buttons: [value] }), errors.Error('E1053'));
                assert.throws(() => textBox.option('buttons', [value]), errors.Error('E1053'));
            };

            [0, [], true, null, void 0].forEach(checkException);
        });

        test('should not have buttons with same names', function(assert) {
            assert.throws(() => $('<div>').dxTextBox({ buttons: ['clear', 'clear'] }), errors.Error('E1055', 'clear'));
            assert.throws(() => $('<div>').dxTextBox({ buttons: [{ name: 'name' }, { name: 'name' }] }), errors.Error('E1055', 'name'));
        });

        module('fields', () => {
            test('\'name\' filed should be defined for custom buttons', function(assert) {
                assert.throws(() => $('<div>').dxTextBox({ buttons: [{}] }), errors.Error('E1054'));
            });

            test('\'name\' filed should be a string', function(assert) {
                const checkException = (value) => {
                    const textBox = $('<div>').dxTextBox({}).dxTextBox('instance');

                    assert.throws(() => $('<div>').dxTextBox({ buttons: [{ name: value }] }), errors.Error('E1055'));
                    assert.throws(() => textBox.option('buttons', [{ name: value }]), errors.Error('E1055'));
                };

                [1, [], {}, false, null, void 0].forEach(checkException);
            });

            test('\'location\' field should be \'after\' or \'before\' string only', function(assert) {
                const $textBox = $('<div>').dxTextBox({ buttons: [{ name: 'name', location: 'incorrect' }] });
                const { $before, $after } = getTextEditorButtons($textBox);

                assert.strictEqual($before.length, 0);
                assert.strictEqual($after.length, 1);
            });

            test('\'options\' and \'location\' fields should not be required', function(assert) {
                const $textBox = $('<div>').dxTextBox({ buttons: [{ name: 'name1' }, { name: 'name2' }] });
                const { $before, $after } = getTextEditorButtons($textBox);

                assert.notOk($before.length);
                assert.strictEqual($after.length, 2);
            });

            test('custom button should skip content template from the integrationOptions', function(assert) {
                const $textBox = $('<div>').dxTextBox({ buttons: [{ name: 'name1' }] });
                const buttons = getTextEditorButtons($textBox);
                const button = buttons.$after.eq(0).dxButton('instance');

                assert.deepEqual(button.option('integrationOptions.skipTemplates'), ['content'], 'content is skipped');
            });

            test('custom button should have ignoreParentReadOnly option as true', function(assert) {
                const $textBox = $('<div>').dxTextBox({ buttons: [{ name: 'name1' }] });
                const buttons = getTextEditorButtons($textBox);
                const button = buttons.$after.eq(0).dxButton('instance');

                assert.strictEqual(button.option('ignoreParentReadOnly'), true, 'button has ignoreParentReadOnly option');
            });
        });
    });
});

module('API', () => {
    test('\'getButton\' method should returns action button instance', function(assert) {
        const selectBox = $('<div>')
            .dxSelectBox({
                showClearButton: true,
                text: 'someText',
                buttons: ['clear', { name: 'custom', options: { text: 'customButtonText' } }, 'dropDown']
            })
            .dxSelectBox('instance');

        const clearButton = selectBox.getButton('clear');
        const fakeButton = selectBox.getButton('fake');
        const dropDownButton = selectBox.getButton('dropDown');
        const customButton = selectBox.getButton('custom');

        assert.ok(clearButton.hasClass('dx-clear-button-area'));
        assert.strictEqual(fakeButton, undefined);
        assert.ok(dropDownButton.$element().hasClass('dx-dropdowneditor-button'));
        assert.strictEqual(customButton.option('text'), 'customButtonText');
    });
});

module('rendering', () => {
    function getButtonPlaceHolders($container) {
        return $container.filter(':empty');
    }

    module('textBox', () => {
        test('custom button options should be applied', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: false,
                buttons: [{
                    name: 'custom',
                    location: 'after',
                    options: {
                        text: 'custom'
                    }
                }]
            });
            const $after = getTextEditorButtons($textBox).$after;

            assert.strictEqual($after.length, 1);
            assert.strictEqual($after.text(), 'custom');
        });

        test('editor with button should have smaller placeholder than the editor without buttons', function(assert) {
            const $textBox = $('<div>').appendTo('body').dxTextBox({
                width: 150,
                placeholder: 'Test long text example',
                buttons: [{
                    name: 'custom',
                    location: 'after',
                    options: {
                        text: 'B'
                    }
                }]
            });
            const beforeStyle = getComputedStyle($textBox.find('.dx-placeholder').get(0), ':before');

            if(browser.msie) {
                assert.strictEqual(beforeStyle.maxWidth, '100%', 'maxWidth of the before element is correct');
            } else {
                assert.ok(parseInt(beforeStyle.width) < $textBox.outerWidth(), 'placeholder is smaller than the editor');
            }

            $textBox.remove();
        });


        test('should not render \'clear\' button if showClearButton is false', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: false,
                buttons: ['clear'],
                value: 'text'
            });

            const $after = getTextEditorButtons($textBox).$after;
            assert.strictEqual($after.length, 1);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);
        });

        test('should render \'clear\' button only after it becomes visible', function(assert) {
            const $textBox = $('<div>').dxTextBox({});
            const textBox = $textBox.dxTextBox('instance');
            let { $before, $after } = getTextEditorButtons($textBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 1);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);

            textBox.option({ showClearButton: true });

            const textEditorButtons = getTextEditorButtons($textBox);

            $before = textEditorButtons.$before;
            $after = textEditorButtons.$after;

            assert.notOk($before.length);
            assert.strictEqual($after.length, 1);
            assert.notOk(getButtonPlaceHolders($after).length);
            assert.ok(isClearButton($after.eq(0)));
        });

        test('should render predefined button (\'clear\')', function(assert) {
            const $textBox = $('<div>').dxTextBox({ showClearButton: true, buttons: ['clear'] });
            const { $before, $after } = getTextEditorButtons($textBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 1);
            assert.notOk(getButtonPlaceHolders($after).length);
        });

        test('should render predefined button (\'clear\') configurated as object', function(assert) {
            const $textBox = $('<div>').dxTextBox({ showClearButton: true, buttons: [{ name: 'clear' }] });
            const $after = getTextEditorButtons($textBox).$after;
            assert.ok(isClearButton($after.eq(0)));
        });

        test('should have only \'clear\' predefined button', function(assert) {
            assert.throws(() => $('<div>').dxTextBox({ buttons: ['fakeButtonName'] }), errors.Error('E1056', 'dxTextBox', 'fakeButtonName'));
        });

        test('predefined button should ignore \'location\' or \'options\' fields in predefined button configuration', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                value: 'text',
                showClearButton: true,
                buttons: [{ name: 'clear', location: 'before' }]
            });

            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($before.length, 0);
            assert.strictEqual($after.length, 1);
            assert.ok(isClearButton($after.eq(0)));
            assert.strictEqual($after.eq(0).text(), '');
        });

        test('custom button with location \'before\' should be rendered', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: false,
                value: 'text',
                buttons: [{
                    name: 'custom',
                    location: 'before',
                    options: {
                        text: 'custom'
                    }
                }]
            });
            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($after.length, 0);
        });

        test('custom button with location \'after\' should be rendered', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: false,
                value: 'text',
                buttons: [{
                    name: 'custom',
                    location: 'after',
                    options: {
                        text: 'custom'
                    }
                }]
            });
            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($after.length, 1);
            assert.strictEqual($before.length, 0);
        });

        test('custom button should not change the widget height', function(assert) {
            const $textBox = $('<div>').appendTo('#qunit-fixture').dxTextBox({
                value: 'text',
                stylingMode: 'underlined'
            });
            const startHeight = $textBox.height();
            const textBox = $textBox.dxTextBox('instance');

            textBox.option('buttons', [{
                name: 'custom',
                location: 'after',
                options: {
                    text: 'custom'
                }
            }]);

            assert.strictEqual($textBox.height(), startHeight);
        });

        test('custom button should be disabled in readOnly state by default', function(assert) {
            const textBox = $('<div>').appendTo('#qunit-fixture').dxTextBox({
                value: 'text',
                buttons: [
                    {
                        name: 'custom',
                        location: 'after',
                        options: {
                            text: 'custom'
                        }
                    }
                ],
                readOnly: true
            }).dxTextBox('instance');
            const button = textBox.getButton('custom');

            assert.ok(button.option('disabled'), 'button is disabled');

            textBox.option('readOnly', false);
            assert.notOk(button.option('disabled'), 'button is enabled');
        });

        test('custom button should not be disabled in readOnly state if it was specified by a user', function(assert) {
            const textBox = $('<div>').appendTo('#qunit-fixture').dxTextBox({
                value: 'text',
                buttons: [
                    {
                        name: 'custom',
                        location: 'after',
                        options: {
                            disabled: false,
                            text: 'custom'
                        }
                    }
                ],
                readOnly: true
            }).dxTextBox('instance');
            const button = textBox.getButton('custom');

            assert.notOk(button.option('disabled'), 'button is enabled');

            button.option('disabled', true);
            textBox.option('readOnly', false);
            assert.ok(button.option('disabled'), 'button is disabled');
        });
    });

    module('numberBox', () => {
        test('widget should not render a clear button if \'buttons\' option have no string for it', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: ['spins'],
                value: 1
            });
            const $after = getTextEditorButtons($numberBox).$after;

            assert.ok($after.length, 1);
            assert.ok(isSpinButton($after.eq(0)));
        });

        test('should render \'spins\' buttons only after they become visible', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({ showClearButton: true });
            const numberBox = $numberBox.dxNumberBox('instance');
            let { $before, $after } = getTextEditorButtons($numberBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            // TODO: Stage3: assert.strictEqual(getButtonPlaceHolders($after).length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);

            numberBox.option({ text: 'Some text', showSpinButtons: true });

            const textEditorButtons = getTextEditorButtons($numberBox);

            $before = textEditorButtons.$before;
            $after = textEditorButtons.$after;

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.notOk(getButtonPlaceHolders($after).length);
        });

        test('should render predefined buttons (\'clear\', \'spins\')', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: ['clear', 'spins']
            });
            const { $before, $after } = getTextEditorButtons($numberBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 0);
        });

        test('should render predefined buttons (\'clear\', \'spins\') configurated as object', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: [{ name: 'clear' }, { name: 'spins' }]
            });

            const { $before, $after } = getTextEditorButtons($numberBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 0);
        });

        test('should have only \'clear\', \'spins\' predefined buttons', function(assert) {
            assert.throws(() => $('<div>').dxNumberBox({ buttons: ['fakeButtonName'] }), errors.Error('E1056', 'dxNumberBox', 'fakeButtonName'));
        });

        test('predefined buttons should ignore \'location\' or \'options\' fields in predefined button configuration', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                value: 1,
                showClearButton: true,
                showSpinButtons: true,
                buttons: [{ name: 'clear', location: 'before' }, { name: 'spins', location: 'before', options: { text: 'spins' } }]
            });

            const { $before, $after } = getTextEditorButtons($numberBox);

            assert.strictEqual($before.length, 0);
            assert.strictEqual($after.length, 2);
            assert.ok(isClearButton($after.eq(0)));
            assert.ok(isSpinButton($after.eq(1)));
            assert.strictEqual($after.eq(1).text(), '');
        });
    });

    module('dropDownEditors', () => {
        test('should render drop down button', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({ buttons: ['dropDown'], items: ['1', '2'], value: '1' });
            const $after = getTextEditorButtons($selectBox).$after;

            assert.strictEqual($after.length, 1);
            assert.ok(isDropDownButton($after.eq(0)));
        });

        test('should render \'dropDown\' button only after it becomes visible', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({ showClearButton: true, showDropDownButton: false });
            const selectBox = $selectBox.dxSelectBox('instance');
            let { $before, $after } = getTextEditorButtons($selectBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            // TODO: Stage3: assert.strictEqual(getButtonPlaceHolders($after).length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);

            selectBox.option({ text: 'Some text', showDropDownButton: true });

            const textEditorButtons = getTextEditorButtons($selectBox);

            $before = textEditorButtons.$before;
            $after = textEditorButtons.$after;

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.notOk(getButtonPlaceHolders($after).length);
        });

        test('should render predefined buttons (\'clear\', \'dropDown\')', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({ showClearButton: true, buttons: ['clear', 'dropDown'] });
            const { $before, $after } = getTextEditorButtons($selectBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 0);
        });

        test('should render predefined buttons (\'clear\', \'dropDown\') configurated as object', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({
                showClearButton: true,
                buttons: [{ name: 'clear' }, { name: 'dropDown' }]
            });
            const { $before, $after } = getTextEditorButtons($selectBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 0);
        });

        test('should have only \'clear\', \'dropDown\' predefined button', function(assert) {
            assert.throws(() => $('<div>').dxSelectBox({ buttons: ['fakeButtonName'] }), errors.Error('E1056', 'dxSelectBox', 'fakeButtonName'));
        });

        test('predefined buttons should ignore \'location\' or \'options\' fields in predefined button configuration', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({
                items: ['1', '2'],
                value: '1',
                showClearButton: true,
                buttons: [{ name: 'clear', location: 'before' }, { name: 'dropDown', location: 'before', options: { text: 'dropDown' } }]
            });

            const { $before, $after } = getTextEditorButtons($selectBox);

            assert.strictEqual($before.length, 0);
            assert.strictEqual($after.length, 2);
            assert.ok(isClearButton($after.eq(0)));
            assert.ok(isDropDownButton($after.eq(1)));
            assert.strictEqual($after.eq(1).text(), '');
        });

        test('buttons is rendered with fieldTemplate', function(assert) {
            const $selectBox = $('<div>').appendTo('#qunit-fixture').dxSelectBox({
                showClearButton: true,
                items: ['1', '2'],
                value: '1',
                buttons: [{
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }, 'clear', 'dropDown'],
                fieldTemplate: (value) => {
                    const $textBox = $('<div>').dxTextBox();
                    return $('<div>').addClass('custom-template').text(value).append($textBox);
                }
            });
            const { $before, $after } = getTextEditorButtons($selectBox);
            assert.strictEqual($before.eq(0).text(), 'before1');
            assert.strictEqual($selectBox.find('.custom-template').text(), '1');
            assert.ok(isClearButton($after.eq(1)));
            assert.ok(isDropDownButton($after.eq(2)));
        });

        test('buttons should not be rendered for the textBox in the dropDownBox fieldTemplate by default', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({
                showClearButton: true,
                buttons: [{
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }, 'clear', 'dropDown'],
                fieldTemplate: (value) => {
                    const $textBox = $('<div>').attr('id', 'internal-textbox').dxTextBox({
                        value: 'test'
                    });
                    return $('<div>').text(value).append($textBox);
                },
                value: 'test'
            });
            const $textBox = $selectBox.find('#internal-textbox');

            const $textBoxAfter = getTextEditorButtons($textBox).$after;
            assert.strictEqual($textBoxAfter.length, 1);
            assert.strictEqual(getButtonPlaceHolders($textBoxAfter).length, 1);
        });

        test('buttons can be rendered for the textBox in the dropDownBox fieldTemplate', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({
                showClearButton: true,
                buttons: [{
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }, 'clear', 'dropDown'],
                fieldTemplate: (value) => {
                    const $textBox = $('<div>').attr('id', 'internal-textbox').dxTextBox({
                        value: 'test',
                        showClearButton: true,
                        buttons: ['clear']
                    });
                    return $('<div>').text(value).append($textBox);
                },
                value: 'test'
            });
            const $textBox = $selectBox.find('#internal-textbox');
            const $textBoxAfter = getTextEditorButtons($textBox).$after;

            assert.strictEqual($textBoxAfter.length, 1);
            assert.ok(isClearButton($textBoxAfter.eq(0)));
        });
    });
});


module('reordering', () => {

    module('textBox', () => {
        test('custom button with location \'after\' should be rendered after the clear button', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: [
                    'clear', {
                        name: 'custom',
                        location: 'after',
                        options: {
                            text: 'custom'
                        }
                    }],
                value: 'text'
            });

            const $after = getTextEditorButtons($textBox).$after;

            assert.strictEqual($after.length, 2);
            assert.ok(isClearButton($after.eq(0)));
            assert.strictEqual($after.eq(1).text(), 'custom');
        });

        test('the group of predefined and custom buttons should have correct order', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: [{
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }, {
                    name: 'after1',
                    location: 'after',
                    options: {
                        text: 'after1'
                    }
                },
                'clear', {
                    name: 'after2',
                    location: 'after',
                    options: {
                        text: 'after2'
                    }
                }],
                value: 'text'
            });

            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($before.text(), 'before1');

            assert.strictEqual($after.length, 3);
            assert.strictEqual($after.eq(0).text(), 'after1');
            assert.ok(isClearButton($after.eq(1)));
            assert.strictEqual($after.eq(2).text(), 'after2');
        });

        test('buttons should have correct order if \'before\' custom button is after \'after\' buttons in the \'buttons\' array', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: ['clear', {
                    name: 'after1',
                    location: 'after',
                    options: {
                        text: 'after1'
                    }
                }, {
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }],
                value: 'text'
            });
            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($before.text(), 'before1');

            assert.strictEqual($after.length, 2);
            assert.ok(isClearButton($after.eq(0)));
            assert.strictEqual($after.eq(1).text(), 'after1');
        });

    });

    module('numberBox', () => {

        test('buttons option can reorder predefined buttons', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: ['spins', 'clear'],
                value: 1
            });
            const $after = getTextEditorButtons($numberBox).$after;
            assert.ok(isSpinButton($after.eq(0)));
            assert.ok(isClearButton($after.eq(1)));
        });

        test('widget should render custom and predefined buttons in the right order', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: [{
                    name: 'after1',
                    location: 'after',
                    options: {
                        text: 'after1'
                    }
                }, 'clear', {
                    name: 'after2',
                    location: 'after',
                    options: {
                        text: 'after2'
                    }
                }, 'spins', {
                    name: 'after3',
                    location: 'after',
                    options: {
                        text: 'after3'
                    }
                }, {
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }],
                value: 1
            });
            const { $before, $after } = getTextEditorButtons($numberBox);

            assert.strictEqual($after.eq(0).text(), 'after1');
            assert.ok(isClearButton($after.eq(1)));
            assert.strictEqual($after.eq(2).text(), 'after2');
            assert.ok(isSpinButton($after.eq(3)));
            assert.strictEqual($after.eq(4).text(), 'after3');
            assert.strictEqual($before.length, 1);
        });

    });

    module('dropDownEditors', () => {
        test('buttons option can reorder predefined buttons', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({
                showClearButton: true,
                buttons: ['dropDown', 'clear'],
                value: 1
            });
            const $after = getTextEditorButtons($selectBox).$after;

            assert.ok(isDropDownButton($after.eq(0)));
            assert.ok(isClearButton($after.eq(1)));
        });

        test('widget should render custom and predefined buttons in the right order', function(assert) {
            const $selectBox = $('<div>').dxSelectBox({
                showClearButton: true,
                buttons: [{
                    name: 'after1',
                    location: 'after',
                    options: {
                        text: 'after1'
                    }
                }, 'clear', {
                    name: 'after2',
                    location: 'after',
                    options: {
                        text: 'after2'
                    }
                }, 'dropDown', {
                    name: 'after3',
                    location: 'after',
                    options: {
                        text: 'after3'
                    }
                }, {
                    name: 'before1',
                    location: 'before',
                    options: {
                        text: 'before1'
                    }
                }],
                value: 1
            });
            const { $before, $after } = getTextEditorButtons($selectBox);

            assert.strictEqual($after.eq(0).text(), 'after1');
            assert.ok(isClearButton($after.eq(1)));
            assert.strictEqual($after.eq(2).text(), 'after2');
            assert.ok(isDropDownButton($after.eq(3)));
            assert.strictEqual($after.eq(4).text(), 'after3');
            assert.strictEqual($before.length, 1);
        });
    });
});


module('collection updating', () => {

    module('textBox', () => {
        test('it is able to change internal custom button option', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: ['clear', {
                    name: 'custom',
                    location: 'after',
                    options: {
                        text: 'custom'
                    }
                }],
                value: 'text'
            });
            const textBox = $textBox.dxTextBox('instance');

            textBox.option('buttons[1].options.text', 'custom2');
            textBox.option('buttons[1].location', 'before');

            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($before.eq(0).text(), 'custom2');
            assert.strictEqual($after.length, 1);
            assert.ok(isClearButton($after.eq(0)));
        });

        test('it is able to reorder buttons', function(assert) {
            const customButtonConfig = {
                name: 'custom',
                location: 'after',
                options: {
                    text: 'custom'
                }
            };
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: ['clear', customButtonConfig],
                value: 'text'
            });
            const textBox = $textBox.dxTextBox('instance');

            textBox.option('buttons', [customButtonConfig, 'clear']);

            const $after = getTextEditorButtons($textBox).$after;

            assert.strictEqual($after.eq(0).text(), 'custom');
            assert.ok(isClearButton($after.eq(1)));
        });

        test('it is able to change buttons', function(assert) {
            const customButtonConfig = {
                name: 'custom',
                location: 'after',
                options: {
                    text: 'custom'
                }
            };
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: ['clear', customButtonConfig],
                value: 'text'
            });
            const textBox = $textBox.dxTextBox('instance');

            textBox.option('buttons', [
                {
                    name: 'custom2',
                    location: 'before',
                    options: {
                        text: 'custom2'
                    }
                },
                'clear',
                customButtonConfig
            ]);

            const { $before, $after } = getTextEditorButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($after.length, 2);
            assert.strictEqual($before.eq(0).text(), 'custom2');
            assert.ok(isClearButton($after.eq(0)));
        });

        test('buttons and showClearButton options should control clear button visibility', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: true,
                buttons: ['clear'],
                value: 'text'
            });
            const textBox = $textBox.dxTextBox('instance');

            let $after = getTextEditorButtons($textBox).$after;
            assert.strictEqual($after.length, 1);

            textBox.option('buttons', []);
            $after = getTextEditorButtons($textBox).$after;
            assert.strictEqual($after.length, 0);

            textBox.option('buttons', ['clear']);
            $after = getTextEditorButtons($textBox).$after;
            assert.strictEqual($after.length, 1);

            textBox.option('showClearButton', false);
            $after = getTextEditorButtons($textBox).$after;
            assert.strictEqual($after.length, 1);
            assert.ok($after.eq(0).is(':hidden'));
        });

        test('custom button should have \'text\' styling mode by default if editor has stylingMode = \'underlined\'', function(assert) {
            const $textBox = $('<div>').dxTextBox({
                showClearButton: false,
                stylingMode: 'underlined',
                value: 'text',
                buttons: ['clear', {
                    name: 'custom',
                    location: 'after',
                    options: {
                        text: 'custom'
                    }
                }]
            });
            const textBox = $textBox.dxTextBox('instance');
            let customButton = textBox.getButton('custom');

            assert.strictEqual(customButton.option('stylingMode'), 'text');

            textBox.option('stylingMode', 'filled');
            customButton = textBox.getButton('custom');
            assert.notStrictEqual(customButton.option('stylingMode'), 'text');
        });

        test('custom button should have \'text\' styling mode if editor has stylingMode = \'underlined\' and buttons config was changed (T992034)', function(assert) {
            const buttonConfig = {
                name: 'custom',
                location: 'after',
                options: {
                    text: 'custom'
                }
            };
            const $textBox = $('<div>').dxTextBox({
                showClearButton: false,
                stylingMode: 'underlined',
                value: 'text',
                buttons: [buttonConfig]
            });
            const textBox = $textBox.dxTextBox('instance');

            textBox.option('buttons', [buttonConfig]);

            const customButton = textBox.getButton('custom');
            assert.strictEqual(customButton.option('stylingMode'), 'text');
        });
    });

    module('numberBox', () => {
        test('number box should work with \'buttons\' option', function(assert) {
            const $numberBox = $('<div>').dxNumberBox({
                showSpinButtons: true,
                buttons: ['spins'],
                value: 1
            });
            const numberBox = $numberBox.dxNumberBox('instance');

            let $after = getTextEditorButtons($numberBox).$after;
            assert.strictEqual($after.length, 1);

            numberBox.option('buttons', []);
            $after = getTextEditorButtons($numberBox).$after;
            assert.strictEqual($after.length, 0);

            numberBox.option('buttons', ['spins']);
            $after = getTextEditorButtons($numberBox).$after;
            assert.strictEqual($after.length, 1);

            numberBox.option('showSpinButtons', false);
            $after = getTextEditorButtons($numberBox).$after;
            assert.strictEqual($after.length, 1);
            assert.ok($after.eq(0).children().eq(0).is(':hidden'));
            assert.ok($after.eq(0).children().eq(1).is(':hidden'));
        });
    });

    module('dropDownEditors', () => {
        test('Drop button template should work with \'buttons\' option', function(assert) {
            const buttonTemplate = () => '<div>Template</div>';
            const $selectBox = $('<div>').dxSelectBox({
                items: ['1', '2']
            });
            const selectBox = $selectBox.dxSelectBox('instance');

            selectBox.option('buttons', ['dropDown']);
            selectBox.option('dropDownButtonTemplate', buttonTemplate);

            let $after = getTextEditorButtons($selectBox).$after;
            assert.strictEqual($after.length, 1);
            assert.strictEqual($after.eq(0).text(), 'Template');

            selectBox.option('buttons', []);
            $after = getTextEditorButtons($selectBox).$after;
            assert.strictEqual($after.length, 0, 'Button was not rendered');

            selectBox.option('buttons', ['dropDown']);
            $after = getTextEditorButtons($selectBox).$after;
            assert.strictEqual($after.eq(0).text(), 'Template');

            selectBox.option('dropDownButtonTemplate', null);
            $after = getTextEditorButtons($selectBox).$after;
            assert.ok(isDropDownButton($after.eq(0)));
        });
    });
});


module('events', () => {
    test('should use CUSTOM_BUTTON_HOVERED_CLASS to prevent predefined button hover styling while custom button is hovered', function(assert) {
        const $textBox = $('<div>').dxTextBox({
            value: 'text',
            buttons: [{
                name: 'custom',
                location: 'after',
                options: {
                    text: 'custom'
                }
            }]
        });
        const textBox = $textBox.dxTextBox('instance');
        const $customButton = $(textBox.getButton('custom').$element());

        $textBox.trigger('dxhoverstart');
        assert.notOk($textBox.hasClass(CUSTOM_BUTTON_HOVERED_CLASS));

        $customButton.trigger('dxhoverstart');
        assert.ok($textBox.hasClass(CUSTOM_BUTTON_HOVERED_CLASS));

        $customButton.trigger('dxhoverend');
        assert.notOk($textBox.hasClass(CUSTOM_BUTTON_HOVERED_CLASS));
    });

    test('should not open dropDown editor after custom button click', function(assert) {
        const spy = sinon.spy();
        const selectBox = $('<div>').dxSelectBox({
            items: ['1', '2'],
            buttons: [{
                name: 'custom',
                location: 'after',
                options: {
                    text: 'custom',
                    onClick: spy
                }
            }, 'dropDown'],
            opened: false
        }).dxSelectBox('instance');

        const $customButton = $(selectBox.getButton('custom').$element());
        $customButton.trigger('dxclick');

        assert.notOk(selectBox.option('opened'));
        assert.strictEqual(spy.callCount, 1);
    });
});
