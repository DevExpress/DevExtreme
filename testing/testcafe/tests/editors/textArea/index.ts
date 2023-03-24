import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TextArea from '../../../model/textArea';
import { getPropertyValue, insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { isMaterial } from '../../../helpers/themeUtils';

const testFixture = () => {
  if (isMaterial()) {
    return fixture.disablePageReloads.skip;
  }
  return fixture.disablePageReloads;
};

testFixture()`TextArea_Height`
  .page(url(__dirname, '../../container.html'));

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
    value: text,
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
