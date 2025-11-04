import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import { Selector } from 'testcafe';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';

fixture.disablePageReloads`HtmlEditor`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((toolbar) => {
  const selector = toolbar ? '#otherContainer' : '#container';
  const clickTarget = toolbar ? '#otherContainer .dx-bold-format' : '#container';
  const baseScreenName = toolbar ? 'htmleditor-with-toolbar' : 'htmleditor-without-toolbar';

  test.meta({ loadQuill: true })(`T1025549 - ${baseScreenName}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${baseScreenName}.png`, { element: selector });

    await t
      .click(Selector(clickTarget));

    await testScreenshot(t, takeScreenshot, `${baseScreenName}-focused.png`, { element: selector });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; height: 200px; width: 200px');
    await setStyleAttribute(Selector('#otherContainer'), 'box-sizing: border-box; height: 200px; width: 200px');
    await appendElementTo('#container', 'div', 'editor');
    await appendElementTo('#otherContainer', 'div', 'editorWithToolbar');

    await createWidget('dxHtmlEditor', {
      height: 200,
      width: '100%',
      value: Array(100).fill('string').join('\n'),
    }, '#editor');

    await createWidget('dxHtmlEditor', {
      height: 200,
      width: '100%',
      value: Array(100).fill('string').join('\n'),
      toolbar: {
        items: ['bold', 'color'],
      },
    }, '#editorWithToolbar');
  });
});

test.meta({ loadQuill: true })('AI toolbar item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-toolbar-item.png', { element: '#container' });

  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(5));

  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-toolbar-item-expanded.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 500,
    width: 350,
    aiIntegration: {},
    toolbar: {
      items: ['ai'],
    },
  });
});
