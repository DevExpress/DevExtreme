import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { testScreenshot } from '../../helpers/themeUtils';
import {appendElementTo, setStyleAttribute} from "../../helpers/domUtils";

fixture.disablePageReloads`HtmlEditor`
  .page(url(__dirname, '../container.html'));

[false, true].forEach((toolbar) => {
  const selector = toolbar ? '#otherContainer' : '#container';
  const clickTarget = toolbar ? '#otherContainer .dx-bold-format' : '#container';
  const baseScreenName = toolbar ? 'htmleditor-with-toolbar' : 'htmleditor-without-toolbar';

  test(`T1025549 - ${baseScreenName}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${baseScreenName}.png`, { element: selector });

    await t
      .click(Selector(clickTarget));

    await testScreenshot(t, takeScreenshot, `${baseScreenName}-focused.png`, { element: selector });
    // await t.debug();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; height: 200px; width: 200px');
    await setStyleAttribute(Selector('#otherContainer'), 'box-sizing: border-box; height: 200px; width: 200px');
    await appendElementTo('#container', 'div', 'editor');
    await appendElementTo('#otherContainer', 'div', 'editorWithToolbar');

    await createWidget('dxHtmlEditor', {
      height: '100%',
      width: '100%',
      value: Array(100).fill('string').join('\n'),
    }, '#editor');

    await createWidget('dxHtmlEditor', {
      height: '100%',
      width: '100%',
      value: Array(100).fill('string').join('\n'),
      toolbar: {
        items: ['bold', 'color'],
      },
    }, '#editorWithToolbar');
  });
});
