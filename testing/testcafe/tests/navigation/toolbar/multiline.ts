/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Toolbar_multiline`
  .page(url(__dirname, '../../container.html'));

const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];
// eslint-disable-next-line max-len
// const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];

[true, false].forEach((rtlEnabled) => {
  test(`Default nested widgets render, rtlEnabled: ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');

    await t
      .expect(await takeScreenshot(`Default-nested-widgets-render-in-multiline,rtlEnabled=${rtlEnabled}.png`, toolbar.element))
      .ok()
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

  await t
    .expect(await takeScreenshot(`buttons-render-in-toolbar${getThemePostfix()}.png`, '#container'))
    .ok()
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
