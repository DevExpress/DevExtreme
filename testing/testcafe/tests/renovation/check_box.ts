import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { multiPlatformTest } from '../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'check_box', platforms: ['jquery', 'react', 'angular'] });

fixture('CheckBox');

test('CheckBox value', async (t, { screenshotComparerOptions }) => {
  const checkBox = Selector('.dx-checkbox');

  await t
    .expect(checkBox.hasClass('dx-checkbox-indeterminate')).eql(true)
    .expect(await compareScreenshot(t, 'check_box_indeterminate.png', null, screenshotComparerOptions)).eql(true);

  await t
    .click(checkBox)
    .expect(checkBox.hasClass('dx-checkbox-checked')).eql(true)
    .expect(await compareScreenshot(t, 'check_box_checked.png', null, screenshotComparerOptions))
    .eql(true);

  await t
    .click(checkBox)
    .expect(checkBox.hasClass('dx-checkbox-checked')).eql(false)
    .expect(await compareScreenshot(t, 'check_box_unchecked.png', null, screenshotComparerOptions))
    .eql(true);
});
