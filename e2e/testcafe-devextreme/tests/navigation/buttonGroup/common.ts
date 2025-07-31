import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item, ButtonType } from 'devextreme/ui/button_group.d';
import { setStyleAttribute, appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot, isMaterialBased } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

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

      const items: ButtonGroupItem[] = ['danger', 'default', 'normal', 'success'].map((type) => ({
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

      items.push({
        id: 'svgIcon',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z"/>
              </svg>`,
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

    if (!isMaterialBased()) {
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
