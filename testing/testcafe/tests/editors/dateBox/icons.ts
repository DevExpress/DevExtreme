/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { compareScreenshot } from 'devextreme-screenshot-comparer';
// import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import {
  appendElementTo, setClassAttribute, insertStylesheetRule, deleteStylesheetRule,
} from '../../navigation/helpers/domUtils';
import { getThemePostfix } from '../../../helpers/getPostfix';

const stylingModes = ['outlined', 'underlined', 'filled'];
// const themes = ['generic.light', 'generic.light.compact',
// 'material.blue.light', 'material.blue.light.compact'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const labelModes = ['static', 'floating', 'hidden'];
const types = ['date', 'datetime', 'time'];

fixture`DateBox_Icon`
  .page(url(__dirname, '../../container.html'));

(['dx-dropdowneditor-active', 'dx-state-focused', false] as string[]).forEach((state) => {
  [true, false].forEach((rtlEnabled) => {
    test(`DateBox styles, state=${state ? 'active' : ''}`, async (t) => {
      await t.expect(
        await compareScreenshot(t, `db-styling,${state ? `${state.replace('dx-', '')}` : ''},rtl=${rtlEnabled}${getThemePostfix()}.png`, '#container'),
      )
        .ok();
    }).before(async () => {
      for (const stylingMode of stylingModes) {
        for (const type of types) {
          for (const pickerType of pickerTypes) {
            for (const labelMode of labelModes) {
              const id = `${`dx${new Guid()}`}`;

              await appendElementTo('#container', 'div', id, { });

              const options: any = {
                width: 160,
                label: 'label text',
                labelMode,
                stylingMode,
                showClearButton: true,
                pickerType,
                type,
                rtlEnabled,
                value: new Date(2021, 9, 17, 16, 34),
              };

              await createWidget('dxDateBox', options, false, `#${id}`);

              if (state) {
                await setClassAttribute(Selector(`#${id}`), state);
              }

              await insertStylesheetRule('.dx-datebox { display: inline-block }', 0);
            }
          }
        }
      }
    }).after(async () => {
      await deleteStylesheetRule(0);
    });
  });
});

// themes.forEach((theme) => {
//   (['dx-dropdowneditor-active', 'dx-state-focused', false] as string[]).forEach((state) => {
//     [true, false].forEach((rtlEnabled) => {
//       test(`DateBox styles, state=${state ? 'active' : ''} ${theme}`, async (t) => {
//         await t.expect(
// eslint-disable-next-line max-len
//           await compareScreenshot(t, `db-styling,${state ? `${state.replace('dx-', '')}` : ''},rtl=${rtlEnabled},theme=${theme.replace(/\./g, '-')}.png`, '#container'),
//         )
//           .ok();
//       }).before(async () => {
//         await changeTheme(theme);

//         for (const stylingMode of stylingModes) {
//           for (const type of types) {
//             for (const pickerType of pickerTypes) {
//               for (const labelMode of labelModes) {
//                 const id = `${`dx${new Guid()}`}`;

//                 await appendElementTo('#container', 'div', id, { });

//                 const options: any = {
//                   width: 160,
//                   label: 'label text',
//                   labelMode,
//                   stylingMode,
//                   showClearButton: true,
//                   pickerType,
//                   type,
//                   rtlEnabled,
//                   value: new Date(2021, 9, 17, 16, 34),
//                 };

//                 await createWidget('dxDateBox', options, false, `#${id}`);

//                 if (state) {
//                   await setClassAttribute(Selector(`#${id}`), state);
//                 }

//                 await insertStylesheetRule('.dx-datebox { display: inline-block }', 0);
//               }
//             }
//           }
//         }
//       }).after(async () => {
//         await deleteStylesheetRule(0);
//       });
//     });
//   });
// });
