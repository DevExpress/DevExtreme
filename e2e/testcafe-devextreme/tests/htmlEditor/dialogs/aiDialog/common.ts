import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import { Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
// import { appendElementTo, setStyleAttribute } from '../../../../helpers/domUtils';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';

fixture.disablePageReloads`HtmlEditor: AIDialog`
  .page(url(__dirname, '../container.html'));

test.skip('AI toolbar item', async (t) => {
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
