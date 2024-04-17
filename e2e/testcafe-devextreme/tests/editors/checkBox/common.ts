import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import Guid from 'devextreme/core/guid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
  setClassAttribute,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import { getFullThemeName, testScreenshot } from '../../../helpers/themeUtils';

const valueModes = [false, true, undefined];

const CHECKBOX_CLASS = 'dx-checkbox';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DEFAULT_STATE_CLASS = '';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

fixture.disablePageReloads`CheckBox render`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((isColumnCountStyle) => {
  [false, true].forEach((limitedWidth) => {
    test.only(`Checkbox styles, ${!isColumnCountStyle ? 'default' : 'with column-count style on container'} limitedWidth=${limitedWidth}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `CheckBox states${isColumnCountStyle ? ' with column count style' : ''} limitedWidth=${limitedWidth}.png`, { element: '#container', shouldTestInCompact: true });

      await testScreenshot(t, takeScreenshot, `CheckBox states${isColumnCountStyle ? ' with column count style' : ''} limitedWidth=${limitedWidth}.png`, { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      // const croppedWidth = iconSize === 20 ? 400 : 450;
      // const fullWidth = iconSize === 20 ? 450 : 500;

      await setStyleAttribute(Selector('#container'), `padding: 5px; width: ${limitedWidth ? 350 : 400}px; height: 200px; ${isColumnCountStyle ? 'column-count: 6' : ''};`);
      await setStyleAttribute(Selector('#otherContainer'), `padding: 5px; width: ${limitedWidth ? 350 : 400}px; height: 200px; ${isColumnCountStyle ? 'column-count: 6' : ''};`);

      await insertStylesheetRulesToPage(`.${CHECKBOX_CLASS} { display: block; }`);

      for (const state of [
        READONLY_STATE_CLASS,
        DEFAULT_STATE_CLASS,
        ACTIVE_STATE_CLASS,
        HOVER_STATE_CLASS,
        FOCUSED_STATE_CLASS,
        DISABLED_STATE_CLASS,
      ] as any[]
      ) {
        for (const valueMode of valueModes) {
          const id = `${`dx${new Guid()}`}`;

          await appendElementTo('#container', 'div', id, { });

          const options: any = {
            text: 'Label',
            value: valueMode,
            rtlEnabled: false,
          };

          await createWidget('dxCheckBox', options, `#${id}`);
          await setClassAttribute(Selector(`#${id}`), state);
        }
      }

      for (const state of [
        READONLY_STATE_CLASS,
        DEFAULT_STATE_CLASS,
        ACTIVE_STATE_CLASS,
        HOVER_STATE_CLASS,
        FOCUSED_STATE_CLASS,
        DISABLED_STATE_CLASS,
      ] as any[]
      ) {
        for (const valueMode of valueModes) {
          const id = `${`dx${new Guid()}`}`;

          await appendElementTo('#otherContainer', 'div', id, { });

          const options: any = {
            text: 'Label',
            value: valueMode,
            rtlEnabled: true,
          };

          await createWidget('dxCheckBox', options, `#${id}`);
          await setClassAttribute(Selector(`#${id}`), state);
        }
      }
    });
  });
});
