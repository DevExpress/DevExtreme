/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
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

[false, true].forEach((rtlEnabled) => {
  [20, 30].forEach((iconSize) => {
    [false, true].forEach((limitedWidth) => {
      test(`Checkbox styles, rtlEnabled=${rtlEnabled} iconSize=${iconSize} limitedWidth=${limitedWidth}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await testScreenshot(t, takeScreenshot, `CheckBox states rtlEnabled=${rtlEnabled} iconSize=${iconSize} limitedWidth=${limitedWidth}.png`, { element: '#container', shouldTestInCompact: true });

        await testScreenshot(t, takeScreenshot, `CheckBox states rtlEnabled=${rtlEnabled} iconSize=${iconSize} limitedWidth=${limitedWidth}.png`, { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (t) => {
        t.ctx.ids = [];

        const croppedWidth = iconSize === 20 ? 400 : 450;
        const fullWidth = iconSize === 20 ? 450 : 500;

        await setStyleAttribute(Selector('#container'), `padding: 5px; width: ${limitedWidth ? croppedWidth : fullWidth}px; height: 200px; column-count: 6;`);

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

            t.ctx.ids.push(id);
            await appendElementTo('#container', 'div', id, { });

            const options: any = {
              text: 'Label',
              value: valueMode,
              iconSize,
              rtlEnabled,
            };

            await createWidget('dxCheckBox', options, `#${id}`);
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }
      });
    });
  });
});
