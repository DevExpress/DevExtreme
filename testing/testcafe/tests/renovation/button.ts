import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import cloneTest from '../../helpers/check-all-platforms';

const multiPlatformTest = cloneTest('button', ['react']);

fixture('Button');

multiPlatformTest('Check default render', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(Selector('.dx-button-text').textContent).eql('Click Me!')
    .expect(await compareScreenshot(t, 'button.png', null, screenshotComparerOptions)).eql(true);
});
