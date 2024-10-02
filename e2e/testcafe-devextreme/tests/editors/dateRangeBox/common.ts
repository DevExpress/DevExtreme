/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Guid from 'devextreme/core/guid';
import DateRangeBox from 'devextreme-testcafe-models/dateRangeBox';
import {
  insertStylesheetRulesToPage,
  appendElementTo,
  setAttribute,
  setClassAttribute,
  removeClassAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const HOVER_STATE_CLASS = 'dx-state-hover';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden', 'outside'];

fixture.disablePageReloads`DateRangeBox render`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  [true, false].forEach((isValid) => {
    safeSizeTest(`DateRangeBox styles, stylingMode=${stylingMode}, isValid=${isValid}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `DateRangeBox stylingMode=${stylingMode} isValid=${isValid}.png`, { shouldTestInCompact: true });

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

        await testScreenshot(t, takeScreenshot, `DateRangeBox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')} stylingMode=${stylingMode} isValid=${isValid}.png`, { shouldTestInCompact: true });

        for (const id of t.ctx.ids) {
          await removeClassAttribute(Selector(`#${id}`), state);
          await removeClassAttribute(Selector(`#${id} .dx-start-datebox`), state);
        }
      }

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1200, 800]).before(async (t) => {
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
              isValid,
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

  ['static', 'floating', 'outside'].forEach((labelMode) => {
    test(`DateRangeBox with buttons container, stylingMode=${stylingMode}, labelMode=${labelMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await insertStylesheetRulesToPage('#container { display: flex; flex-wrap: wrap; gap: 4px; }');

      await testScreenshot(t, takeScreenshot, `DRB with buttons container,stMode=${stylingMode},lMode=${labelMode}.png`, { shouldTestInCompact: true });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      for (const buttons of [
        ['clear'],
        ['clear', 'dropDown'],
        [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'dropDown'],
        ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'dropDown'],
        ['clear', 'dropDown', { name: 'custom', location: 'after', options: { icon: 'home' } }],
        [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'dropDown'],
        ['clear', { name: 'custom', location: 'before', options: { icon: 'home' } }, 'dropDown'],
        ['clear', 'dropDown', { name: 'custom', location: 'before', options: { icon: 'home' } }],
      ]) {
        for (const rtlEnabled of [false, true]) {
          const id = `${`dx${new Guid()}`}`;

          await appendElementTo('#container', 'div', id, { });

          await createWidget('dxDateRangeBox', {
            width: 500,
            value: [new Date(2021, 9, 17, 16, 34), new Date(2021, 9, 18, 16, 34)],
            labelMode,
            stylingMode,
            rtlEnabled,
            buttons,
            showClearButton: true,
          }, `#${id}`);
        }
      }
    });
  });
});

labelModes.forEach((labelMode) => {
  test(`Custom placeholders and labels appearance (labelMode=${labelMode})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateRangeBox = new DateRangeBox('#dateRangeBox');

    await testScreenshot(t, takeScreenshot, `Placeholder and label by default labelMode=${labelMode}.png`, { element: '#container' });

    await t
      .click(dateRangeBox.getStartDateBox().input);

    await testScreenshot(t, takeScreenshot, `Placeholder and label on start date input focus labelMode=${labelMode}.png`, { element: '#container' });

    await t
      .click(dateRangeBox.getEndDateBox().input);

    await testScreenshot(t, takeScreenshot, `Placeholder and label on end date input focus labelMode=${labelMode}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'dateRangeBox');
    await setAttribute('#container', 'style', 'width: 800px; height: 300px; padding-top: 10px;');

    return createWidget('dxDateRangeBox', {
      labelMode,
      width: 600,
      openOnFieldClick: false,
      startDateLabel: 'first date',
      endDateLabel: 'second date',
      startDatePlaceholder: 'enter start date',
      endDatePlaceholder: 'enter end date',
    }, '#dateRangeBox');
  });
});
