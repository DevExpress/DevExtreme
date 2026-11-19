import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { isMaterial } from '../../../helpers/themeUtils';
import TagBox from '../../../models/tagBox';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden', 'outside'];

test.describe('TagBox_Label', () => {
  stylingModes.forEach((stylingMode) => {
    test.describe(() => {
      test.use({ browserSize: [300, 800] });

      test(`Label for dxTagBox stylingMode=${stylingMode}`, async ({ page, theme }) => {
        const componentOptions = {
          label: 'label text',
          items: [...Array(10)].map((_, i) => `item${i}`),
          value: [...Array(5)].map((_, i) => `item${i}`),
          stylingMode,
        };

        if (isMaterial(theme)) {
          await insertStylesheetRulesToPage(page, '#container .dx-widget { font-family: sans-serif }');
        }

        await appendElementTo(page, '#container', 'div', 'tagBox1');
        await appendElementTo(page, '#container', 'div', 'tagBox2');

        await createWidget(page, 'dxTagBox', {
          ...componentOptions,
          multiline: false,
        }, '#tagBox1');

        await createWidget(page, 'dxTagBox', {
          ...componentOptions,
          multiline: true,
        }, '#tagBox2');

        await page.locator('#tagBox2').click();

        await testScreenshot(page, `TagBox label with stylingMode=${stylingMode}.png`);
      });
    });

    labelModes.forEach((labelMode) => {
      test.describe(() => {
        test.use({ browserSize: [300, 400] });

        test(`Label shouldn't be cutted for dxTagBox in stylingMode=${stylingMode}, labelMode=${labelMode} (T1104913)`, async ({ page }) => {
          await setStyleAttribute(page, '#container', 'top: 250px;');

          // The factory runs in the page, so the loop values come in as its argument.
          await createWidget(page, 'dxTagBox', (modes) => ({
            width: 200,
            label: 'Label text',
            ...modes,
            dataSource: {
              load() {
                return new Promise((resolve) => {
                  resolve([
                    { text: 'item_1' },
                    { text: 'item_2' },
                    { text: 'item_3' },
                    { text: 'item_4' },
                  ]);
                });
              },
              paginate: true,
              pageSize: 20,
            },
          }), '#container', { arg: { labelMode, stylingMode } });

          const tagBox = new TagBox(page, '#container');

          await tagBox.element.click();

          const screenshotName = `TagBox label with stylingMode=${stylingMode},labelMode=${labelMode}.png`;

          await tagBox.element.click();
          await tagBox.element.click();

          await testScreenshot(page, screenshotName);
        });
      });
    });
  });
});
