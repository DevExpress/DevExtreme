import { Selector, ClientFunction } from 'testcafe';
import * as path from 'path';

fixture('SelectBox DevExtreme React Playground')
    .page(path.resolve(__dirname, '../public/index.html'));

const selectorFocusedItem = '.dx-item.dx-list-item.dx-state-focused .custom-item .product-name';
const selectorSelectedValue = '#customSelectBox .value';
const slectboxContainer = Selector('#customSelectBox .dx-show-invalid-badge.dx-selectbox.dx-textbox.dx-texteditor');

const dropDownContainer = Selector('.dx-selectbox-popup-wrapper');

const getSelectedValue = ClientFunction(
    (selector: string) => document.querySelector?.(selector)?.innerHTML?.trim(),
);

const check = async (t: TestController) => {
    const valueAfterDown = await getSelectedValue(selectorSelectedValue);
    const focusedValueAfterDown = await getSelectedValue(selectorFocusedItem);

    await t.expect(valueAfterDown).eql(focusedValueAfterDown);
};

test('SelectBox keyboard navigation test', async (t) => {
    await t.click(slectboxContainer);
    await t.expect(dropDownContainer.exists).ok();
    const duration = 500;

    await t.pressKey('down').wait(duration);
    await check(t);

    await t.pressKey('up').wait(duration);
    await check(t);
});
