import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Splitter from '../../../models/splitter';

test.describe('Splitter_integration', () => {
  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    test('non resizable pane should not change its size during resize', async ({ page }) => {
      await createWidget(page, 'dxSplitter', {
        width: '100%',
        height: 300,
        dataSource: [{
          text: 'Pane_1',
        }, {
          text: 'Pane_1',
        }, {
          text: 'Pane_3',
          size: '300px',
          resizable: false,
        }],
      });

      const splitter = new Splitter(page, '#container');

      await expect.poll(() => splitter.getItem(2).evaluate((item) => item.clientWidth)).toBe(300);

      await page.setViewportSize({ width: 400, height: 400 });

      await expect.poll(() => splitter.getItem(2).evaluate((item) => item.clientWidth)).toBe(145);
    });
  });
});
