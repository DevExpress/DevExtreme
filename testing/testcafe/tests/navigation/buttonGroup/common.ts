import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { setStyleAttribute, appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/button_group.d';

interface ButtonGroupItem extends Item {
  id: string;
}

fixture`ButtonGroup_Styles`
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
          }, `#buttongroup${stylingMode}${state}`);
    }

    await testScreenshot(t, takeScreenshot, `ButtonGroup render states mode=${stylingMode}.png`, { element: '#container' });

    if (!isMaterial()) {
      await testScreenshot(t, takeScreenshot, `ButtonGroup render states mode=${stylingMode}.png`, { element: '#container', theme: 'generic.dark' });
      await testScreenshot(t, takeScreenshot, `ButtonGroup render states mode=${stylingMode}.png`, { element: '#container', theme: 'generic.contrast' });
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'width: 600px; height: 400px;');
    await setAttribute('#container', 'class', 'dx-theme-generic-typography');
  });
});
