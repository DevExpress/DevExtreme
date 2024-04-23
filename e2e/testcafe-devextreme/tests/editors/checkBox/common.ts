/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import Guid from 'devextreme/core/guid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
  setClassAttribute,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import { getDarkThemeName, testScreenshot } from '../../../helpers/themeUtils';

const valueModes = [false, true, undefined];

const CHECKBOX_CLASS = 'dx-checkbox';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DEFAULT_STATE_CLASS = '';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const INVALID_STATE_CLASS = 'dx-invalid';

fixture.disablePageReloads`CheckBox`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((isColumnCountStyle) => {
  test(`Render ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Checkbox states${isColumnCountStyle ? ' with column count style' : ''}.png`, { element: '#container', shouldTestInCompact: true });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), `padding: 5px; width: 300px; height: 200px; ${isColumnCountStyle ? 'column-count: 2' : ''}`);

    await insertStylesheetRulesToPage(`.${CHECKBOX_CLASS} { display: block; }`);

    await appendElementTo('#container', 'div', 'checked');
    await createWidget('dxCheckBox', { value: true, text: 'checked' }, '#checked');

    await appendElementTo('#container', 'div', 'unchecked');
    await createWidget('dxCheckBox', { value: false, text: 'unchecked' }, '#unchecked');

    await appendElementTo('#container', 'div', 'indeterminate');
    await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate' }, '#indeterminate');

    // rtl
    await appendElementTo('#container', 'div', 'checkedRTL');
    await createWidget('dxCheckBox', { value: true, text: 'checked', rtlEnabled: true }, '#checkedRTL');

    await appendElementTo('#container', 'div', 'uncheckedRTL');
    await createWidget('dxCheckBox', { value: false, text: 'unchecked', rtlEnabled: true }, '#uncheckedRTL');

    await appendElementTo('#container', 'div', 'indeterminateRTL');
    await createWidget('dxCheckBox', { value: undefined, text: 'indeterminate', rtlEnabled: true }, '#indeterminateRTL');
  });
});

test('Checkbox appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage('.dx-checkbox.dx-widget { display: inline-flex; vertical-align: middle; margin-inline: 10px; }');

  await testScreenshot(t, takeScreenshot, 'CheckBox appearance.png', { shouldTestInCompact: true });
  await testScreenshot(t, takeScreenshot, 'CheckBox appearance.png', { theme: getDarkThemeName() });

  for (const scale of [1.15, 0.67]) {
    await ClientFunction(() => {
      $('#container').css('transform', `scale(${scale})`);
    }, {
      dependencies: { scale },
    })();

    await testScreenshot(t, takeScreenshot, `CheckBox appearance in scaled container, scale=${scale}.png`, { shouldTestInCompact: true });
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  for (const state of [
    DEFAULT_STATE_CLASS,
    READONLY_STATE_CLASS,
    DISABLED_STATE_CLASS,
    HOVER_STATE_CLASS,
    ACTIVE_STATE_CLASS,
    FOCUSED_STATE_CLASS,
    `${FOCUSED_STATE_CLASS} ${HOVER_STATE_CLASS}`,
    INVALID_STATE_CLASS,
    `${INVALID_STATE_CLASS} ${FOCUSED_STATE_CLASS}`,
  ] as string[]) {
    await ClientFunction(() => {
      $('#container').append($('<div>').text(`State: ${state}`).css('fontSize', 10));
    }, {
      dependencies: {
        state,
      },
    })();

    for (const iconSize of [undefined, 25]) {
      for (const text of [undefined, 'Label text']) {
        for (const rtlEnabled of [false, true]) {
          for (const value of valueModes) {
            const id = `dx${new Guid()}`;
            await appendElementTo('#container', 'div', id, {});

            await createWidget('dxCheckBox', {
              text,
              value,
              rtlEnabled,
              iconSize,
            }, `#${id}`);
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }
      }

      for (const rtlEnabled of [false, true]) {
        const id = `dx${new Guid()}`;
        await appendElementTo('#container', 'div', id, {});

        await createWidget('dxCheckBox', {
          text: 'Label text',
          width: 50,
          rtlEnabled,
        }, `#${id}`);
        await setClassAttribute(Selector(`#${id}`), state);
      }
    }
  }
});
