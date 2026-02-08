import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

testInFramework('inputs-list-in-form scenarios', 'inputs-list-in-form', [
    'Phone inputs should adding and deleting correctly',
    async (t) => {
        const addButton = Selector('.dx-button-text').withText('Add phone');
        const deleteButton = Selector('.dx-icon-trash').parent('.dx-button');

    const phoneGroup = Selector('[aria-labelledby$="_phones-container"]');

    const phoneInputs = phoneGroup.find('.dx-texteditor-container');

    await t.expect(phoneInputs.count).eql(0, 'Phone inputs should not exist initially');

    await t.click(addButton);
    await t.expect(phoneInputs.count).eql(1, 'There should be exactly one phone input after adding');

    await t.click(deleteButton);
        await t.expect(phoneInputs.count).eql(0, 'Phone inputs should be removed after deletion');
    }
]);
