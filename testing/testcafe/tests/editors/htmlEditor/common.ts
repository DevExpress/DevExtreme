import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`HtmlEditor`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((toolbar) => {
  const selector = toolbar ? '#otherContainer' : '#container';
  const clickTarget = toolbar ? '#otherContainer .dx-bold-format' : '#container';
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
  }).before(async () => {
    await createWidget('dxHtmlEditor', {
      height: 200,
      width: 200,
      value: Array(100).fill('string').join('\n'),
    });

    return createWidget('dxHtmlEditor', {
      height: 200,
      width: 200,
      value: Array(100).fill('string').join('\n'),
      toolbar: {
        items: ['bold', 'color'],
      },
    }, false, '#otherContainer');
  });
});
