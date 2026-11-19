import { expect, test } from '../../fixtures';
import { dragToOffset } from '../../helpers/dragUtils';

test.describe('Events', () => {
  test('The `dxhoverstart` event should be triggered after dragging and dropping an HTML draggable element (T1260277)', async ({ page }) => {
    await page.evaluate(() => {
      const markup = `<div class="dx-viewport demo-container">
          <div id="draggable" draggable="true" style="width: 200px; height: 200px; background-color: red;"></div>
          <div id="target" style="width: 200px; height: 200px; background-color: black;"></div>
          <div>hoverStartTriggerCount</div>
          <div id="hoverStartTriggerCount">0</div>
          <div>hoverEndTriggerCount</div>
          <div id="hoverEndTriggerCount">0</div>
      </div>`;

      $('#container').html(markup);

      const { DevExpress } = (window as any);

      let hoverStartTriggerCount = 0;
      let hoverEndTriggerCount = 0;

      DevExpress.events.on($('#target'), 'dxhoverstart', () => {
        hoverStartTriggerCount += 1;

        $('#hoverStartTriggerCount').text(hoverStartTriggerCount);
      });

      DevExpress.events.on($('#target'), 'dxhoverend', () => {
        hoverEndTriggerCount += 1;

        $('#hoverEndTriggerCount').text(hoverEndTriggerCount);
      });
    });

    const draggable = page.locator('#draggable');
    const target = page.locator('#target');

    await dragToOffset(page, draggable, 0, 400);

    // A native drag of an HTML draggable element ends the pointer stream with `pointercancel`
    // instead of `pointerup`; the event is sent explicitly so the test does not depend on
    // whether the browser input delivers it.
    await draggable.dispatchEvent('pointercancel');

    await dragToOffset(page, target, 0, 400);

    await expect(page.locator('#hoverStartTriggerCount')).toHaveText('1');
    await expect(page.locator('#hoverEndTriggerCount')).toHaveText('1');
  });
});
