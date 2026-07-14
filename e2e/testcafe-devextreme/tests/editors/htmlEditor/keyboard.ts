import { Selector } from 'testcafe';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { addFocusableElementBefore, addFocusableElementAfter } from '../../../helpers/domUtils';

fixture`HtmlEditor - focus escape`
  .page(url(__dirname, '../../container-extended.html'));

test('Ctrl+Shift+Down should move focus to the next focusable element outside the editor', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.content)
    .pressKey('ctrl+shift+down')
    .expect(Selector('#focusable-end').focused)
    .ok();
}).before(async () => {
  await createWidget('dxHtmlEditor', { value: '<p>test</p>' });
  await addFocusableElementBefore('#container');
  await addFocusableElementAfter('#container');
});

test('Ctrl+Shift+Up should move focus to the previous focusable element when there is no toolbar', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.content)
    .pressKey('ctrl+shift+up')
    .expect(Selector('#focusable-start').focused)
    .ok();
}).before(async () => {
  await createWidget('dxHtmlEditor', { value: '<p>test</p>' });
  await addFocusableElementBefore('#container');
  await addFocusableElementAfter('#container');
});

test('Ctrl+Shift+Up should move focus into the toolbar when it is present', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.content)
    .pressKey('ctrl+shift+up')
    .expect(htmlEditor.toolbar.getItemByName('bold').isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    value: '<p>test</p>',
    toolbar: { items: ['bold', 'italic'] },
  });
  await addFocusableElementBefore('#container');
  await addFocusableElementAfter('#container');
});
