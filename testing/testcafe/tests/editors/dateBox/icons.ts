/* eslint-disable no-restricted-syntax */
import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateBox from '../../../model/dateBox';
import Guid from '../../../../../js/core/guid';
import { appendElementTo } from '../../navigation/helpers/domUtils';

const TIME_TO_WAIT = 500;

const stylingModes = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const labelModes = ['static', 'floating', 'hidden'];
const types = ['date', 'datetime', 'time'];

fixture`DateBox_Icon`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  test(`DateBox styles ${theme}`, async (t) => {
    await t.expect(await compareScreenshot(t, `datebox-styling,theme=${theme.replace(/\./g, '-')}.png`, '#container')).ok();
  }).before(async () => {
    await changeTheme(theme);

    for (const stylingMode of stylingModes) {
      for (const type of types) {
        for (const pickerType of pickerTypes) {
          for (const rtlEnabled of [true, false]) {
            for (const labelMode of labelModes) {
              const id = `${new Guid()}`;

              await appendElementTo('#container', 'div', id, { });
              await createWidget('dxDateBox', {
                label: 'label text',
                labelMode,
                stylingMode,
                showClearButton: true,
                pickerType,
                type,
                rtlEnabled,
                value: new Date(2021, 9, 17, 16, 34),
              }, false, `#${id}`);
            }
          }
        }
      }
    }
  });

  stylingModes.forEach((stylingMode) => {
    pickerTypes.forEach((pickerType) => {
      types.forEach((type) => {
        [true, false].forEach((rtlEnabled) => {
          test(`Icon for dxDateBox ${theme} stylingMode=${stylingMode} pickerType=${pickerType} type=${type} rtlEnabled=${rtlEnabled}`, async (t) => {
            const dateBox = new DateBox('#container');
            const { dropDownEditorButton } = dateBox;

            if (pickerType !== 'native') {
              await t
                .click(dropDownEditorButton)
                .wait(TIME_TO_WAIT);

              await t.expect(await compareScreenshot(t, `db-opened-icon-stMode=${stylingMode},pType=${pickerType},type=${type},rtl=${rtlEnabled},theme=${theme.replace(/\./g, '-')}.png`)).ok();
            }
          }).before(async (t) => {
            await t.resizeWindow(300, 400);
            await changeTheme(theme);

            return createWidget('dxDateBox', {
              label: 'label text',
              stylingMode,
              showClearButton: true,
              pickerType,
              type,
              rtlEnabled,
              value: new Date(1900, 0, 1),
            });
          });
        });
      });
    });
  });
});
