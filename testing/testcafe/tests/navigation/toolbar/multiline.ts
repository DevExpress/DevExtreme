/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';

fixture.disablePageReloads`Toolbar_multiline`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];

[true, false].forEach((rtlEnabled) => {
  test(`Default nested widgets render, rtlEnabled: ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar buttons render.png', '#container', true);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(400, 400);

    const toolbarItems = [] as any[];
    (supportedWidgets as any[]).forEach((widgetName) => {
      toolbarItems.push({
        location: 'before',
        widget: widgetName,
        options: {
          value: new Date(2021, 9, 17),
          stylingMode: 'contained',
          text: 1,
          items: [{ text: 1 }, { text: 2 }],
          showClearButton: true,
        },
      });
    });

    toolbarItems.push({
      location: 'after',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    });

    return createWidget('dxToolbar', {
      multiline: true,
      items: toolbarItems,
      rtlEnabled,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});

test('Buttons render in toolbar', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar buttons render.png', '#container', true);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const items = [] as any;

  for (const stylingMode of stylingModes) {
    for (const type of types) {
      for (const text of ['Button Text', '']) {
        for (const icon of ['home', undefined]) {
          for (const rtlEnabled of [true, false]) {
            items.push({
              widget: 'dxButton',
              options: {
                stylingMode,
                text,
                type,
                hint: `stylingMode=${stylingMode}, text=${text}, icon=${icon}, type=${type}, rtlEnabled=${rtlEnabled}`,
                rtlEnabled,
                icon,
              },
            });
          }
        }
      }
    }
  }

  await createWidget('dxToolbar', {
    multiline: true,
    items,
  });
});
