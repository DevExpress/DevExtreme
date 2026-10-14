import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getThemeName, testScreenshot } from '../../../helpers/themeUtils';

const CHAT_SUGGESTIONS_CLASS = 'dx-chat-suggestions';

const render = ClientFunction((markup: string) => {
  const container = document.querySelector('#container');

  if (container) container.innerHTML = markup;
});

const createSuggestions = (selector: string) => createWidget('dxButtonGroup', {
  items: [
    { text: 'Summary' },
    { text: 'Ideal Buyer' },
    { text: 'Competitors' },
  ],
  stylingMode: 'outlined',
  selectionMode: 'none',
  elementAttr: { class: CHAT_SUGGESTIONS_CLASS },
  width: 400,
}, selector);

if (getThemeName() === 'fluent-next') {
  fixture.disablePageReloads`ChatSuggestions`.page(
    url(__dirname, '../../container.html'),
  );

  test('Chat suggestions outside of a chat in light and dark modes', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, 'Chat suggestions outside of a chat.png', {
      element: '#container',
    });

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  }).before(async () => {
    await render(`
      <div class="dx-theme-mode-light" style="background-color: var(--dxds-color-bg-canvas);"><div id="light"></div></div>
      <div class="dx-theme-mode-dark" style="background-color: var(--dxds-color-bg-canvas);"><div id="dark"></div></div>
    `);
    await createSuggestions('#light');
    await createSuggestions('#dark');
  });
}
