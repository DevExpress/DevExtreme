import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo } from '../helpers/domUtils';
import { Item } from '../../../../../js/ui/button_group.d';

interface ButtonGroupItem extends Item {
  id: string;
}

['Dark', 'Light', 'Contrast'].forEach((theme) => {
  fixture`ButtonGroup_${theme}Styles`
    .page(url(__dirname, `../pages/themes/generic${theme}Theme.html`));

  test('ButtonGroup styling', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const stylingMode of ['text', 'outlined', 'contained']) {
      await appendElementTo('#container', 'div', `mode${stylingMode}`, {});
      await ClientFunction(() => {
        $(`#mode${stylingMode}`).text(stylingMode);
      }, { dependencies: { stylingMode } })();

      // eslint-disable-next-line no-restricted-syntax
      for (const state of ['dx-state-default', 'dx-state-focused', 'dx-state-hover', 'dx-state-active', 'dx-state-selected', 'dx-item-selected']) {
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
    }

    await t
      .expect(await takeScreenshot(`buttonGroupStates-${theme}.png`, Selector('#container')))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await ClientFunction(() => {
      $('#container').css({
        width: '500px',
        border: '1px solid black',
      });
    })();
  });
});
