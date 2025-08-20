import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

testInFramework('SelectBox nested validator scenarios', 'select-box-nested-validator', [
    'SelectBox with nested Validator component should not render double errors',
    async (t) => {
        const validateButton = Selector('.dx-button-text').withText('Validate');
        const validationSummary = Selector('.dx-validationsummary');
        
        await t
            .expect(validateButton.exists).ok('Validate button should exist')
            .expect(validationSummary.exists).ok('Validation summary should exist');

        await t.click(validateButton);
        
        const updatedValidationSummaryItems = validationSummary.find('.dx-validationsummary-item');
        await t.expect(updatedValidationSummaryItems.count).eql(1, 'Should have exactly one validation error in summary');
        const errorMessage = await updatedValidationSummaryItems.nth(0).innerText;
        await t.expect(errorMessage).eql('Type is required', 'Error message should be "Type is required"');
    },

    'SelectBox validation should pass when value is selected',
    async (t) => {
        const validateButton = Selector('.dx-button-text').withText('Validate');
        const validationSummary = Selector('.dx-validationsummary');
        const selectBox = Selector('.dx-selectbox');
        const selectBoxArrow = selectBox.find('.dx-dropdowneditor-button');

        await t.click(selectBoxArrow);
        const firstItem = Selector('.dx-item').withText('One');

        await t
            .expect(firstItem.exists).ok('First item should exist in dropdown')
            .click(firstItem);

        await t.click(validateButton);

        const updatedValidationSummaryItems = validationSummary.find('.dx-validationsummary-item');
        await t.expect(updatedValidationSummaryItems.count).eql(0, 'Should have no validation errors when value is selected');
    }
]);
