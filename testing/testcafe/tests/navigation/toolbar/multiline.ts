/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { screenshotTestFn } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toolbar_multiline`
  .page(url(__dirname, '../../container.html'));

const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];

[true, false].forEach((rtlEnabled) => {
  test(`Default nested widgets render, rtlEnabled: ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await screenshotTestFn(t, takeScreenshot, `Toolbar nested widgets render in multiline rtl=${rtlEnabled}.png`, '#toolbar', true);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
    await appendElementTo('#container', 'div', 'toolbar');

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
    }, false, '#toolbar');
  });
});

test('Buttons render in toolbar', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await screenshotTestFn(t, takeScreenshot, 'Toolbar buttons render.png', '#toolbar', true);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'box-sizing: border-box; width: 1200px; height: 800px; padding: 8px;');
  await appendElementTo('#container', 'div', 'toolbar');

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
  }, false, '#toolbar');
});
