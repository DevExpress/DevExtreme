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
  .page(url(__dirname, '../../../container.html'));

test('initial state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));
  // .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));

  // const aiDialog = htmlEditor.getAIDialog();

  // await aiDialog.show();

  await testScreenshot(
    t,
    takeScreenshot,
    'htmleditor-ai-dialog-initial-state.png',
    { element: '#container' },
  );

  // await t.debug();

  // await t
  //   .click(htmlEditor.toolbar.getItemByName('ai'))
  //   .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(5));

  // await testScreenshot(
  //   t, takeScreenshot, 'htmleditor-ai-toolbar-item-expanded.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 500,
    width: 900,
    aiIntegration: {},
    toolbar: {
      items: ['ai'],
    },
  });
});

test('generating state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));
  // .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));

  // const aiDialog = htmlEditor.getAIDialog();

  // await aiDialog.show();

  await testScreenshot(
    t,
    takeScreenshot,
    'htmleditor-ai-dialog-generating-state.png',
    { element: '#container' },
  );

  // await t.debug();

  // await t
  //   .click(htmlEditor.toolbar.getItemByName('ai'))
  //   .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(5));

  // await testScreenshot(
  //   t, takeScreenshot, 'htmleditor-ai-toolbar-item-expanded.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 500,
    width: 900,
    aiIntegration: {
      summarize() {},
    },
    toolbar: {
      items: ['ai'],
    },
  });
});

test('resultReady state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));
  // .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));

  // const aiDialog = htmlEditor.getAIDialog();

  // await aiDialog.show();

  await testScreenshot(
    t,
    takeScreenshot,
    'htmleditor-ai-dialog-result-ready-state.png',
    { element: '#container' },
  );

  // await t.debug();

  // await t
  //   .click(htmlEditor.toolbar.getItemByName('ai'))
  //   .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(5));

  // await testScreenshot(
  //   t, takeScreenshot, 'htmleditor-ai-toolbar-item-expanded.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 500,
    width: 900,
    aiIntegration: {
      summarize({ onComplete }) { onComplete('result'); },
    },
    toolbar: {
      items: ['ai'],
    },
  });
});
