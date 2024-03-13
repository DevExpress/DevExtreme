import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, getPropertyValue, insertStylesheetRulesToPage, setAttribute,
} from '../../../helpers/domUtils';
import { clearTestPage } from '../../../helpers/clearPage';
import TextArea from '../../../model/textArea';

fixture.disablePageReloads`TextArea_Height`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

const text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

[true, false].forEach((autoResizeEnabled) => {
  test(`TextArea has correct height with "autoResizeEnabled" is ${autoResizeEnabled} and height is 7em & maxHeight is 5em`, async (t) => {
    const textArea = new TextArea('#container');

    await t
      .expect(getPropertyValue(textArea.element, 'maxHeight'))
      .eql('5em')
      .expect(getPropertyValue(textArea.element, 'height'))
      .eql('7em')
      .expect(textArea.element.getStyleProperty('height'))
      .eql('70px')
      .expect(getPropertyValue(textArea.input, 'height'))
      .eql('');
  }).before(async () => createWidget('dxTextArea', {
    maxHeight: '5em',
    height: '7em',
    autoResizeEnabled,
    width: 200,
    value: text,
  }));

  test(`TextArea has correct height with "autoResizeEnabled" is ${autoResizeEnabled} and height is 5em & maxHeight is 7em`, async (t) => {
    const textArea = new TextArea('#container');

    await t
      .expect(getPropertyValue(textArea.element, 'maxHeight'))
      .eql('7em')
      .expect(getPropertyValue(textArea.element, 'height'))
      .eql('5em')
      .expect(textArea.element.getStyleProperty('height'))
      .eql('70px')
      .expect(getPropertyValue(textArea.input, 'height'))
      .eql('');
  }).before(async () => createWidget('dxTextArea', {
    maxHeight: '7em',
    height: '5em',
    autoResizeEnabled,
    width: 200,
    value: text,
  }));

  test(`TextArea has correct height with "autoResizeEnabled" is ${autoResizeEnabled} and maxHeight option is 5em`, async (t) => {
    const textArea = new TextArea('#container');

    await t
      .expect(getPropertyValue(textArea.element, 'maxHeight'))
      .eql('5em')
      .expect(getPropertyValue(textArea.element, 'height'))
      .eql(autoResizeEnabled ? 'auto' : '')
      .expect(textArea.element.getStyleProperty('height'))
      .eql(autoResizeEnabled ? '70px' : '55px')
      .expect(getPropertyValue(textArea.input, 'height'))
      .eql(autoResizeEnabled ? '68px' : '');
  }).before(async () => createWidget('dxTextArea', {
    maxHeight: '5em',
    autoResizeEnabled,
    width: 200,
  }));

  test(`TextArea with font-size style has correct height with "autoResizeEnabled" is ${autoResizeEnabled} and maxHeight option is 5em`, async (t) => {
    const textArea = new TextArea('#container');

    await t
      .expect(getPropertyValue(textArea.element, 'maxHeight'))
      .eql('5em')
      .expect(getPropertyValue(textArea.element, 'height'))
      .eql(autoResizeEnabled ? 'auto' : '')
      .expect(parseInt(await textArea.element.getStyleProperty('height'), 10))
      .eql(autoResizeEnabled ? 60 : 49)
      .expect(getPropertyValue(textArea.input, 'height'))
      .eql(autoResizeEnabled ? '58px' : '');
  }).before(async () => {
    await insertStylesheetRulesToPage('#container { font-size: 12px; }');

    return createWidget('dxTextArea', {
      maxHeight: '5em',
      autoResizeEnabled,
      width: 200,
      value: text,
    });
  });
});

test('TextArea correct height with autoResizeEnabled, height is 7em & maxHeight is 5em', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea correct height with autoResizeEnabled, height is 7em & maxHeight is 5em.png', { element: '#container' });

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

test('TextArea has correct height with different value length', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TextArea has correct height with different value length.png', { element: '#container' });

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

test('Height of TextArea input should have the correct height when the maxHeight option is set to 80px(T1221869)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Height of TextArea input should have the correct height when the maxHeight option is set to 80px(T1221869).png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: 300px; height: 400px;');
  const config = {
    value: text,
    width: 1000,
    maxHeight: 80,
    autoResizeEnabled: true,
  };

  await appendElementTo('#container', 'div', 'textArea1');
  await createWidget('dxTextArea', {
    ...config,
  }, '#textArea1');
});
