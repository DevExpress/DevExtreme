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
  test(`Checkbox styles, ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `CheckBox states${isColumnCountStyle ? ' with column count style' : ''}.png`, { element: '#container', shouldTestInCompact: true });

    await testScreenshot(t, takeScreenshot, `CheckBox states${isColumnCountStyle ? ' with column count style' : ''}.png`, { element: '#container', theme: getFullThemeName().replace('light', 'dark') });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), `padding: 5px; width: 1800px; height: 200px; ${isColumnCountStyle ? 'column-count: 24' : ''};`);
    await setStyleAttribute(Selector('#otherContainer'), `padding: 5px; width: 1800px; height: 200px; ${isColumnCountStyle ? 'column-count: 24' : ''};`);

    await insertStylesheetRulesToPage(`.${CHECKBOX_CLASS} { display: block; }`);

    async function createCheckBoxes(containerSelector, modes, rtlEnabled) {
      const stateClasses = [
        READONLY_STATE_CLASS,
        DEFAULT_STATE_CLASS,
        ACTIVE_STATE_CLASS,
        HOVER_STATE_CLASS,
        FOCUSED_STATE_CLASS,
        DISABLED_STATE_CLASS,
      ];

      for (const iconScaled of [false, true]) {
        for (const limitedWidth of [false, true]) {
          for (const state of stateClasses) {
            for (const mode of modes) {
              const id = `dx${new Guid()}`;
              await appendElementTo(containerSelector, 'div', id, {});

              const width = iconScaled ? 80 : 40;

              await createWidget('dxCheckBox', {
                text: 'Label',
                value: mode,
                rtlEnabled,
                width: limitedWidth ? width : undefined,
                iconSize: iconScaled ? 30 : undefined,
              }, `#${id}`);
              await setClassAttribute(Selector(`#${id}`), state);
            }
          }
        }
      }
    }

    await createCheckBoxes('#container', valueModes, false);
    await createCheckBoxes('#otherContainer', valueModes, true);
  });
});
