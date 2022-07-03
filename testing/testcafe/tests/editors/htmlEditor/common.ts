import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';

fixture`HtmlEditor`
  .page(url(__dirname, '../pages/t1025549.html'));

[false, true].forEach((toolbar) => {
  const selector = toolbar ? '#htmleditor-toolbar' : '#htmleditor-simple';
  const clickTarget = toolbar ? '#htmleditor-toolbar .dx-bold-format' : '#htmleditor-simple';
  const baseScreenName = toolbar ? 'htmleditor-with-toolbar' : 'htmleditor-without-toolbar';

  test(`T1025549 - ${baseScreenName}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`${baseScreenName}.png`, selector))
      .ok()
      .click(Selector(clickTarget))
      .expect(await takeScreenshot(`${baseScreenName}-focused.png`, selector))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
