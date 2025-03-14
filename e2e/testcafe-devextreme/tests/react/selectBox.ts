import { Selector, ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';

fixture.disablePageReloads`SelectBox Test`
  .page(url(__dirname, '../../../../apps/react/public/index.html'));

const selectorFocusedItem = '.dx-item.dx-list-item.dx-state-focused .custom-item .product-name';
const selectorSelectedValue = '#customSelectBox .value';

const container = Selector('#customSelectBox');
const dropDownContainer = container.find('dx-selectbox-popup-wrapper');

const getSelectedValue = ClientFunction(
  (selector: string) => document.querySelector?.(selector)?.innerHTML?.trim(),
);

const check = async (t: TestController) => {
  const valueAfterDown = await getSelectedValue(selectorSelectedValue);
  const focusedValueAfterDown = await getSelectedValue(selectorFocusedItem);

  await t.expect(valueAfterDown).eql(focusedValueAfterDown);
};

test('SelectBox keyboard navigation test', async (t) => {
  await t.click(Selector(selectorSelectedValue));
  await t.expect(dropDownContainer.exists).ok();

  await t.pressKey('down');
  await check(t);

  await t.pressKey('up');
  await check(t);
});
