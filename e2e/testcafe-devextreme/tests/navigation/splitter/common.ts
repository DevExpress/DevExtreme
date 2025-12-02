import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Splitter from 'devextreme-testcafe-models/splitter';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Splitter_common`
  .page(url(__dirname, '../../container.html'));

const getScreenshotName = (state: string) => `Splitter apearance - handle in ${state} state.png`;

test('ResizeHandle appearance in inactive state, allowKeyboardNavigation', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, getScreenshotName('inactive'), { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSplitter', {
  width: 600,
  height: 300,
  dataSource: [{
    text: 'pane_1',
  }, {
    text: 'pane_2',
    resizable: false,
  }],
}));

test('ResizeHandle appearance in different states, allowKeyboardNavigation', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const splitter = new Splitter('#container');

  await t.click(Selector('body'), { offsetX: -50 });

  await testScreenshot(t, takeScreenshot, getScreenshotName('normal'), { element: '#container' });

  await t.hover(splitter.resizeHandles.nth(0));

  await testScreenshot(t, takeScreenshot, getScreenshotName('hover'), { element: '#container' });

  await t
    .dispatchEvent(splitter.resizeHandles.nth(0), 'mousedown')
    .wait(500);

  await testScreenshot(t, takeScreenshot, getScreenshotName('active'), { element: '#container' });

  await t.dispatchEvent(splitter.resizeHandles.nth(0), 'mouseup');

  await t.click(splitter.resizeHandles.nth(0));

  await testScreenshot(t, takeScreenshot, getScreenshotName('focused'), { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSplitter', {
  width: 600,
  height: 300,
  dataSource: [{
    text: 'pane_1',
    collapsible: true,
  }, {
    text: 'pane_2',
    collapsible: true,
  }],
}));

['horizontal', 'vertical'].forEach((orientation) => {
  test(`Splitter appearance, orientation='${orientation}'`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Splitter appearance, orientation='${orientation}'.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxSplitter', {
      orientation,
      width: 600,
      height: 300,
      dataSource: [{
        text: 'pane_1', collapsible: true,
      }, {
        text: 'pane_2', collapsible: true,
      },
      ],
    });
  });

  test(`Nested Splitter appearance, orientation='${orientation}'`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Nested Splitter appearance, orientation='${orientation}'.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxSplitter', {
      orientation,
      width: 600,
      height: 300,
      dataSource: [{ text: 'Pane_1', collapsible: true },
        {
          splitter: {
            orientation: orientation === 'horizontal' ? 'vertical' : 'horizontal',
            dataSource: [{
              text: 'Pane_2_1', collapsible: true,
            }, {
              text: 'Pane_2_2', collapsible: true,
            }, {
              text: 'Pane_2_3', collapsible: true,
            }],
          },
          collapsible: true,
        },
        { text: 'Pane_3', collapsible: true },
      ],
    });
  });
});
