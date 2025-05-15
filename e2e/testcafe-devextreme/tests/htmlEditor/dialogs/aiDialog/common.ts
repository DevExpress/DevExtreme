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

async function openAIDialog(t: TestController, command: number, option?: number): Promise<void> {
  const htmlEditor = new HtmlEditor('#container');
  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(command));

  if (option !== undefined) {
    await t
      .click(Selector(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(command)
        .find(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(0));
  }
}

[
  { name: 'with no options', command: 0, option: undefined },
  { name: 'with options', command: 4, option: 0 },
].forEach(({ name, command, option }) => {
  test(`initial state ${name}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await openAIDialog(t, command, option);
    await testScreenshot(t, takeScreenshot, `htmleditor-ai-dialog-initial-state-${name}.png`, { element: '#container' });

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
});

test('generating state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await openAIDialog(t, 4, 0);
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

[
  {
    name: 'short-result',
    result: 'result',
  },
  {
    name: 'long-result',
    result: 'Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team. Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team. Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team.',
  },
].forEach(({ name, result }) => {
  test(`resultReady state with ${name}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await openAIDialog(t, 4, 0);
    await testScreenshot(t, takeScreenshot, `htmleditor-ai-dialog-result-ready-state-with-${name}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxHtmlEditor', {
      height: 500,
      width: 900,
      aiIntegration: {
        result,
        changeStyle(_, { onComplete }) { onComplete(this.result); },
      },
      toolbar: {
        items: ['ai'],
      },
    });
  });
});
