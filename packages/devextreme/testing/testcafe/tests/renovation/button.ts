import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { multiPlatformTest } from '../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'button' /* , platforms: ['jquery', 'react', 'angular'] */ });

fixture('Button');

test('Check default render', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(Selector('.dx-button-text').textContent).eql('Click Me!')
    .expect(await compareScreenshot(t, 'button.png', null, screenshotComparerOptions)).eql(true);
});
