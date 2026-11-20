import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import HtmlEditor from '../../../models/htmlEditor';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';

test.describe('HtmlEditor', () => {
  [false, true].forEach((toolbar) => {
    const selector = toolbar ? '#otherContainer' : '#container';
    const clickTarget = toolbar ? '#otherContainer .dx-bold-format' : '#container';
    const baseScreenName = toolbar ? 'htmleditor-with-toolbar' : 'htmleditor-without-toolbar';

    test(`T1025549 - ${baseScreenName}`, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'box-sizing: border-box; height: 200px; width: 200px');
      await setStyleAttribute(page, '#otherContainer', 'box-sizing: border-box; height: 200px; width: 200px');
      await appendElementTo(page, '#container', 'div', 'editor');
      await appendElementTo(page, '#otherContainer', 'div', 'editorWithToolbar');

      await createWidget(page, 'dxHtmlEditor', {
        height: 200,
        width: '100%',
        value: Array(100).fill('string').join('\n'),
      }, '#editor');

      await createWidget(page, 'dxHtmlEditor', {
        height: 200,
        width: '100%',
        value: Array(100).fill('string').join('\n'),
        toolbar: {
          items: ['bold', 'color'],
        },
      }, '#editorWithToolbar');

      await testScreenshot(page, `${baseScreenName}.png`, { element: selector });

      await page.locator(clickTarget).click();

      await testScreenshot(page, `${baseScreenName}-focused.png`, { element: selector });
    });
  });

  test('AI toolbar item', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 500,
      width: 350,
      aiIntegration: {},
      toolbar: {
        items: ['ai'],
      },
    });

    const htmlEditor = new HtmlEditor(page, '#container');

    await testScreenshot(page, 'htmleditor-ai-toolbar-item.png', { element: '#container' });

    await htmlEditor.getToolbarItem('ai').element.click();
    await page.locator(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(5).click();

    await testScreenshot(page, 'htmleditor-ai-toolbar-item-expanded.png', { element: '#container' });
  });
});
