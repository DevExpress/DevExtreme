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

test('TextArea should have correct height when height is 7em & maxHeight is 5em', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea appearance, height=7em & maxHeight=5em.png', { element: '#container' });

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

test('TextArea should have correct height when height is 5em & maxHeight is 7em', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea appearance, height=5em & maxHeight=7em.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px;');

  const config = {
    maxHeight: '7em',
    height: '5em',
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

test('TextArea should have correct height when maxHeight is 5em', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea appearance, maxHeight=5em.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px;');

  const config = {
    maxHeight: '5em',
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

test('TextArea with font-size style has correct height when maxHeight option is 5em', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea appearance, maxHeight=5em, font-size=12px.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px; font-size: 12px;');

  const config = {
    maxHeight: '5em',
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

test('TextArea has correct height when maxHeight is not defined', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea appearance, maxHeight is not defined.png', { element: '#container' });

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

test('Height of TextArea input should have the correct height when the maxHeight option is set to 80px (T1221869)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea appearance, maxHeight=80px.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px;');

  const config = {
    value: text,
    width: '100%',
    maxHeight: 80,
    autoResizeEnabled: true,
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
