import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { multiPlatformTest, createWidget } from '../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'declaration/check_box', platforms: ['jquery', 'react'] });

const defaultOptions = {
  text: 'checkBox',
  value: null,
};

fixture('CheckBox');

test('CheckBox value', async (t, { screenshotComparerOptions }) => {
  const checkBox = Selector('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(checkBox.hasClass('dx-checkbox-indeterminate')).eql(true)
    .expect(await takeScreenshot('check_box_indeterminate.png', null, screenshotComparerOptions)).ok()

    .click(checkBox)
    .expect(checkBox.hasClass('dx-checkbox-checked'))
    .eql(true)
    .expect(await takeScreenshot('check_box_checked.png', null, screenshotComparerOptions))
    .ok()

    .click(checkBox)
    .expect(checkBox.hasClass('dx-checkbox-checked'))
    .eql(false)
    .expect(await takeScreenshot('check_box_unchecked.png', null, screenshotComparerOptions))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxCheckBox', defaultOptions);
});
