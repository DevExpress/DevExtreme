/* eslint-disable no-restricted-syntax */
import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import { appendElementTo } from '../../navigation/helpers/domUtils';

const stylingModes = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const labelModes = ['static', 'floating', 'hidden'];
const types = ['date', 'datetime', 'time'];

fixture`DateBox_Icon`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  ['dx-dropdowneditor-active', false].forEach((state) => {
    test(`DateBox styles, state=${state ? 'active' : ''} ${theme}`, async (t) => {
      await t.expect(await compareScreenshot(t, `datebox-styling,${state ? 'state=active' : ''}theme=${theme.replace(/\./g, '-')}.png`, '#container')).ok();
    }).before(async () => {
      await changeTheme(theme);

      for (const stylingMode of stylingModes) {
        for (const type of types) {
          for (const pickerType of pickerTypes) {
            for (const rtlEnabled of [true, false]) {
              for (const labelMode of labelModes) {
                const id = `${new Guid()}`;

                await appendElementTo('#container', 'div', id, { });

                const options: any = {
                  label: 'label text',
                  labelMode,
                  stylingMode,
                  showClearButton: true,
                  pickerType,
                  type,
                  rtlEnabled,
                  value: new Date(2021, 9, 17, 16, 34),
                };

                if (state) {
                  options.elementAttr = {
                    class: 'dx-dropdowneditor-active',
                  };
                }

                await createWidget('dxDateBox', options, false, `#${id}`);
              }
            }
          }
        }
      }
    });
  });
});
