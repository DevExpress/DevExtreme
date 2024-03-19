import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getFullThemeName, testScreenshot } from '../../../helpers/themeUtils';
import {
  appendElementTo, setAttribute,
} from '../../../helpers/domUtils';

fixture.disablePageReloads`Splitter_Icon_Results`
  .page(url(__dirname, '../../container.html'));

test('Splitter appearance on different appearance and themes', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'splitter-appearance state=normal.png', { element: '#container' });
  await testScreenshot(t, takeScreenshot, 'splitter-appearance state=normal.png', { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

  t.hover('.dx-resize-handle');
  await testScreenshot(t, takeScreenshot, 'splitter-appearance state=hover.png', { element: '#container' });
  await testScreenshot(t, takeScreenshot, 'splitter-appearance state=hover.png', { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

  t.click('.dx-resize-handle');
  await testScreenshot(t, takeScreenshot, 'splitter-appearance state=focus.png', { element: '#container' });
  await testScreenshot(t, takeScreenshot, 'splitter-appearance state=focus.png', { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxSplitter', {
    orientation: 'horizontal',
    width: 600,
    height: 300,
    dataSource: [{
      text: 'pane_1',
    }, {
      text: 'pane_2',
    },
    ],
  });
});

['horizontal', 'vertical'].forEach((orientation) => {
  test(`Splitter appearance, orientation='${orientation}'`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Splitter appearance, orientation='${orientation}'.png`, { element: '#container', shouldTestInCompact: true });

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

    await testScreenshot(t, takeScreenshot, `Nested Splitter appearance, orientation='${orientation}'.png`, { element: '#container', shouldTestInCompact: true });

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
