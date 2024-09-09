import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo } from '../../helpers/domUtils';

fixture.disablePageReloads`Chat`
  .page(url(__dirname, '../container.html'));

test('Chat: line breaks', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'Chat message bubble line breaks.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    height: 500,
    width: 300,
    items: [
      {
        text: 'line\nbreak',
      },
    ],
  }, '#chat');
});
