import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import { Selector } from 'testcafe';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { getLongText } from '../../../chat/data';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

const longResult = getLongText(false, 10);

fixture`HtmlEditor: AIDialog`
  .page(url(__dirname, '../../../../container-extended.html'));

export async function openAIDialog(
  t: TestController,
  command: number,
  option?: number,
): Promise<HtmlEditor> {
  const htmlEditor = new HtmlEditor('#container');
  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(command));

  if (option !== undefined) {
    await t
      .click(Selector(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(command)
        .find(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(0));
  }

  return htmlEditor;
}

[
  { name: 'with-no-options', command: 0, option: undefined },
  { name: 'with-options', command: 4, option: 0 },
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
      height: 600,
      width: 900,
      aiIntegration: {},
      toolbar: {
        items: ['ai'],
      },
    });
  });
});

test('resize window when initial state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = await openAIDialog(t, 0);

  await t.resizeWindow(400, 600);

  const aiDialog = htmlEditor.getAIDialog();
  const menuButton = aiDialog.getMenuButton();

  await t.click(menuButton.element);
  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-initial-state-resize-window.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    aiIntegration: {},
    toolbar: {
      items: ['ai'],
    },
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

    .${LOADINDICATOR_SEGMENT_CLASS} {
      transform: scale(1) !important;
    }
  `);

  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 900,
    aiIntegration: {
      changeStyle() {},
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
    result: longResult,
  },
].forEach(({ name, result }) => {
  test(`resultReady state with ${name}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const htmlEditor = await openAIDialog(t, 4, 0);
    const aiDialog = htmlEditor.getAIDialog();
    const splitButton = aiDialog.getSplitButton();

    await t.click(splitButton.element);

    await testScreenshot(t, takeScreenshot, `htmleditor-ai-dialog-result-ready-state-with-${name}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxHtmlEditor', {
      height: 600,
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

test('asking state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await openAIDialog(t, 7);
  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-asking-state.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 900,
    aiIntegration: {},
    toolbar: {
      items: ['ai'],
    },
  });
});

test('askAI result ready state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const htmlEditor = await openAIDialog(t, 7);
  const aiDialog = htmlEditor.getAIDialog();
  const promptTextArea = aiDialog.getPromptTextArea();
  const generateButton = aiDialog.getGenerateButton();

  await t.typeText(promptTextArea.getInput(), 'request');
  await t.click(generateButton.element);

  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-ask-ai-result-ready-state.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 900,
    aiIntegration: {
      result: longResult,
      execute(_, { onComplete }) { onComplete(this.result); },
    },
    toolbar: {
      items: ['ai'],
    },
  });
});

test('result ready after canceletion', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const htmlEditor = await openAIDialog(t, 0);
  const aiDialog = htmlEditor.getAIDialog();
  const cancelButton = aiDialog.getCancelButton();

  await t.click(cancelButton.element);

  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-result-ready-after-canceletion.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 900,
    aiIntegration: {
      summarize() { return () => {}; },
    },
    toolbar: {
      items: ['ai'],
    },
  });
});

test('error state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await openAIDialog(t, 0);
  await testScreenshot(t, takeScreenshot, 'htmleditor-ai-dialog-error-state.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 900,
    aiIntegration: {
      summarize(_, { onError }) { onError(); },
    },
    toolbar: {
      items: ['ai'],
    },
  });
});

[
  { state: 'initial', configuration: {} },
  {
    state: 'generating',
    configuration: {
      summarize() {},
    },
  },
  {
    state: 'result-ready',
    configuration: {
      result: longResult,
      summarize(_, { onComplete }) { onComplete(this.result); },
    },
  },
  {
    state: 'error',
    configuration: {
      summarize(_, { onError }) { onError(); },
    },
  },
].forEach(({ state, configuration }) => {
  test.meta({ browserSize: [400, 700] })(`${state} state on small screen`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await openAIDialog(t, 0);
    await testScreenshot(t, takeScreenshot, `htmleditor-ai-dialog-${state}-state-on-small-screen.png`, { element: '#container' });

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
      height: 700,
      aiIntegration: { ...configuration },
      toolbar: {
        items: ['ai'],
      },
    });
  });
});
