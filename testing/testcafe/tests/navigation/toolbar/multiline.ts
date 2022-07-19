import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';

fixture`Toolbar_multiline`
  .page(url(__dirname, '../../container.html'));

const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

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
