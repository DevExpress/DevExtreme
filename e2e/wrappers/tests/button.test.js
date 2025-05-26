import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

testInFramework('Button scenarios', 'button', [
    'Button should exist',
    async (t) => {
        const button = Selector('.dx-button-text');
    
        await t.expect(button.exists).ok('Button should exist');
    }
]);