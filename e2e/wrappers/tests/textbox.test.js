import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

testInFramework('TextBox Dynamic Styles scenarios', 'text-box-dynamic-styles', [
    'TextBox should update inline styles',
    async (t) => {
        const textboxWrapper = Selector('.dx-textbox');
        const textboxInput = Selector('.dx-texteditor-input');
        await t.expect(textboxWrapper.exists).ok('TextBox Wrapper should exist');
        await t.expect(textboxInput.exists).ok('TextBox Input should exist');
        await t
        .typeText(textboxInput, 'trigger')
        .pressKey('enter')
        .expect(textboxInput.value)
        .eql('trigger')
        .expect(textboxWrapper.getStyleProperty('background-color'))
        .eql('rgb(255, 99, 132)')
        .typeText(textboxInput, ' again')
        .pressKey('enter')
        .expect(textboxInput.value)
        .eql('trigger again')
        .expect(textboxWrapper.getStyleProperty('background-color'))
        .eql('rgb(54, 162, 235)');
    },
]);