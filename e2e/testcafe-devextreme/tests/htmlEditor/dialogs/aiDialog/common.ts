import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import { Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

fixture.disablePageReloads`HtmlEditor: AIDialog`
  .page(url(__dirname, '../../../container.html'));

async function openAIDialog(t: TestController): Promise<void> {
  const htmlEditor = new HtmlEditor('#container');
  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(0));
}

test('initial state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await openAIDialog(t);
  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-initial-state.png', { element: '#container' });

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

  await openAIDialog(t);
  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-generating-state.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(`
    .${LOADINDICATOR_SEGMENT_CLASS},
    .${LOADINDICATOR_CONTENT_CLASS},
    .${LOADINDICATOR_ICON_CLASS},
    .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
      animation: none !important;
      opacity: 1 !important;
    }
  `);

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

  await openAIDialog(t);
  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-result-ready-state.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 500,
    width: 900,
    aiIntegration: {
      summarize(_, { onComplete }) { onComplete('result'); },
    },
    toolbar: {
      items: ['ai'],
    },
  });
});
