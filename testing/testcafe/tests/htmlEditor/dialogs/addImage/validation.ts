import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from '../../../../model/htmlEditor';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';

fixture`HtmlEditor - validation`
  .page(url(__dirname, '../../../container.html'));

test('HtmlEdit11', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t.click(htmlEditor.toolbar.item('image'));

  await t
    .setFilesToUpload('.dx-fileuploader-input', [
      './test-image.png',
    ]);

  await t.click(Selector('.dx-popup-bottom .dx-button-mode-contained'));

  await t.expect(
    await takeScreenshot('test-screenshot', Selector('dx-quill-container')),
  ).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    imageUpload: {
      tabs: ['file', 'url'],
    },
    toolbar: { items: ['image'] },
  }, true);
});
