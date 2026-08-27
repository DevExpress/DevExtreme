import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import CheckBox from '../../../models/checkBox';

test('CheckBox switches its state on click', async ({ page }) => {
  await createWidget(page, 'dxCheckBox', { value: false });

  const checkBox = new CheckBox(page, '#container');

  expect(await checkBox.isChecked()).toBe(false);

  await checkBox.element.click();

  expect(await checkBox.isChecked()).toBe(true);
  expect(await checkBox.option('value')).toBe(true);
});

test('CheckBox renders the indeterminate state', async ({ page }) => {
  await createWidget(page, 'dxCheckBox', { value: null });

  const checkBox = new CheckBox(page, '#container');

  expect(await checkBox.isIndeterminate()).toBe(true);
});
