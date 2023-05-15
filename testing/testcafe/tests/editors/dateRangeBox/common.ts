/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  insertStylesheetRulesToPage,
  appendElementTo,
  setClassAttribute,
  removeClassAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import { testScreenshot } from '../../../helpers/themeUtils';
import { clearTestPage } from '../../../helpers/clearPage';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const HOVER_STATE_CLASS = 'dx-state-focused';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden'];

fixture.disablePageReloads`DateRangeBox render`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

stylingModes.forEach((stylingMode) => {
  test(`DateRangeBox styles, stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `DateRangeBox stylingMode=${stylingMode}.png`, { shouldTestInCompact: true });

    for (const state of [
      DROP_DOWN_EDITOR_ACTIVE_CLASS,
      FOCUSED_STATE_CLASS,
      HOVER_STATE_CLASS,
      READONLY_STATE_CLASS,
      DISABLED_STATE_CLASS,
    ] as any[]
    ) {
      for (const id of t.ctx.ids) {
        await setClassAttribute(Selector(`#${id}`), state);
        await setClassAttribute(Selector(`#${id} .dx-start-datebox`), state);
      }

      await testScreenshot(t, takeScreenshot, `DateRangeBox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')} stylingMode=${stylingMode}.png`, { shouldTestInCompact: true });

      for (const id of t.ctx.ids) {
        await removeClassAttribute(Selector(`#${id}`), state);
      }
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    t.ctx.ids = [];

    await insertStylesheetRulesToPage(`.${DATERANGEBOX_CLASS} { display: inline-flex; margin: 5px; }`);

    for (const rtlEnabled of [false, true]) {
      for (const labelMode of labelModes) {
        for (const value of [
          [null, null],
          [new Date(2021, 9, 17, 16, 34), new Date(2021, 9, 18, 16, 34)],
        ]) {
          const id = `${`dx${new Guid()}`}`;

          t.ctx.ids.push(id);
          await appendElementTo('#container', 'div', id, { });

          const options: any = {
            width: 500,
            value,
            labelMode,
            rtlEnabled,
            stylingMode,
            endDateLabel: labelMode,
            startDateLabel: 'qwertyQWERTYg',
            showClearButton: true,
          };

          await createWidget('dxDateRangeBox', options, `#${id}`);
        }
      }
    }
  });
});
