import { test, expect } from '@playwright/test';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const init = async () => page.evaluate(() => {
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

  test.skip('The `dxhoverstart` event should be triggered after dragging and dropping an HTML draggable element (T1260277)', async ({ page }) => {

    await init();

    const draggable = page.locator('#draggable');
    const target = page.locator('#target');
    const hoverStartTriggerCount = page.locator('#hoverStartTriggerCount');
    const hoverEndTriggerCount = page.locator('#hoverEndTriggerCount');

    await (async () => {
        const box = await draggable.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 400, { steps: 10 });
          await page.mouse.up();
        }
      })();

    // `.drag` does not trigger the `pointercancel` event.
    // A sequence of `.drag` calls behaves like a single drag&drop operation,
    // and each call does not trigger the `pointerup` event.
    // Even if it did, the `pointercancel` event would not be triggered as specified in:
    // https://www.w3.org/TR/pointerevents/#suppressing-a-pointer-event-stream
    // This is a hack to test the event engine's logic.
    await draggable.dispatchEvent('pointercancel');

    await (async () => {
        const box = await target.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 400, { steps: 10 });
          await page.mouse.up();
        }
      })();

    expect(hoverStartTriggerCount.textContent).toBe('1');
    expect(hoverEndTriggerCount.textContent).toBe('1');

    });
});
