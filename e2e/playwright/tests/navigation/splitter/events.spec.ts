import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { dragToOffset } from '../../../helpers/dragUtils';
import Splitter from '../../../models/splitter';

test.describe('Splitter_events', () => {
  test('Panes should not be able to resize when onResizeStart event canceled', async ({ page }) => {
    await createWidget(page, 'dxSplitter', () => ({
      width: 408,
      height: 408,
      onResizeStart(e) {
        const { event } = e;
        event!.cancel = true;
      },
      dataSource: [{ size: '200px' }, { size: '200px' }],
    }));

    const splitter = new Splitter(page, '#container');

    await dragToOffset(page, splitter.getResizeHandles().nth(0), 100, 0);

    await expect.poll(() => splitter.option('items[0].size')).toBe(200);
    await expect.poll(() => splitter.option('items[1].size')).toBe(200);
  });
});
