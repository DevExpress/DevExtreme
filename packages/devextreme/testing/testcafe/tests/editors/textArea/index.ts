import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, setAttribute,
} from '../../../helpers/domUtils';
import { clearTestPage } from '../../../helpers/clearPage';

fixture.disablePageReloads`TextArea_Height`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

const text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';
const longText = 'Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team.';

test('TextArea has correct height with autoResizeEnabled and height is 7em & maxHeight is 5em', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea has correct height with autoResizeEnabled and height is 7em & maxHeight is 5em.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px;');

  const config = {
    maxHeight: '5em',
    height: '7em',
    width: '100%',
    value: text,
  };

  await appendElementTo('#container', 'div', 'textArea1');
  await appendElementTo('#container', 'div', 'textArea2');

  await createWidget('dxTextArea', {
    ...config,
    autoResizeEnabled: true,
  }, '#textArea1');

  await createWidget('dxTextArea', {
    ...config,
    autoResizeEnabled: false,
  }, '#textArea2');
});

test('TextArea has correct height with autoResizeEnabled and have different data string length inside', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea with autoResizeEnabled and have different data string length inside.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px;');

  const config = {
    width: '100%',
    value: text,
    autoResizeEnabled: true,
  };

  await appendElementTo('#container', 'div', 'textArea1');
  await appendElementTo('#container', 'div', 'textArea2');

  await createWidget('dxTextArea', {
    ...config,
  }, '#textArea1');

  await createWidget('dxTextArea', {
    ...config,
    value: text + text,
  }, '#textArea2');
});

test('Check for error in bug (T1221869) where when there is vale in maxHeight and autResizeEnabled is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Check for error in bug (T1221869) where when there is vale in maxHeight and autResizeEnabled is enabled.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px;');
  const config = {
    value: longText,
    width: 1000,
    maxHeight: 80,
    inputAttr: { 'aria-label': 'Notes' },
    autoResizeEnabled: true,
  };

  await appendElementTo('#container', 'div', 'textArea1');
  await createWidget('dxTextArea', {
    ...config,
  }, '#textArea1');
});
