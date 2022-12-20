import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { setStyleAttribute } from '../../../helpers/domUtils';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../helpers/domUtils';
import { Item } from '../../../../../js/ui/button_group.d';

interface ButtonGroupItem extends Item {
  id: string;
}

fixture.disablePageReloads`ButtonGroup_Styles`
  .page(url(__dirname, '../../container.html'));

['text', 'outlined', 'contained'].forEach((stylingMode) => {
  test(`ButtonGroup-styling,stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await appendElementTo('#container', 'div', `mode${stylingMode}`, {});
    await ClientFunction(() => {
      $(`#mode${stylingMode}`).text(stylingMode);
    }, { dependencies: { stylingMode } })();

    // eslint-disable-next-line no-restricted-syntax
    for (const state of [
      'dx-state-default',
      'dx-state-focused',
      'dx-state-hover',
      'dx-state-active',
      'dx-state-selected',
      'dx-item-selected',
    ]) {
      await appendElementTo('#container', 'div', `mode${stylingMode}${state}`, {});
      await ClientFunction(() => {
        $(`#mode${stylingMode}${state}`).text(state);
      }, { dependencies: { stylingMode, state } })();

      await appendElementTo('#container', 'div', `buttongroup${stylingMode}${state}`, {});

          type ButtonType = 'back' | 'danger' | 'default' | 'normal' | 'success';

          const items: ButtonGroupItem[] = ['back', 'danger', 'default', 'normal', 'success'].map((type) => ({
            id: type,
            type: type as ButtonType,
            text: type,
          }));

          items.push({
            id: 'find',
            icon: 'find',
            text: 'find',
          });

          items.push({
            id: 'findIconOnly',
            icon: 'find',
          });

          items.map((item) => {
            item.elementAttr = { class: state };
            return item;
          });

          await createWidget('dxButtonGroup', {
            items,
            stylingMode,
            keyExpr: 'id',
            selectionMode: 'none',
          }, false, `#buttongroup${stylingMode}${state}`);
    }

    await takeScreenshotInTheme(t, takeScreenshot, `ButtonGroup render states mode=${stylingMode}.png`, '#container');

    if (!isMaterial()) {
      await takeScreenshotInTheme(t, takeScreenshot, `ButtonGroup render states mode=${stylingMode}.png`, '#container', false, undefined, 'generic.dark');
      await takeScreenshotInTheme(t, takeScreenshot, `ButtonGroup render states mode=${stylingMode}.png`, '#container', false, undefined, 'generic.contrast');
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'width: 600px; height: 400px;');
    await setAttribute('#container', 'class', 'dx-theme-generic-typography');
  });
});
