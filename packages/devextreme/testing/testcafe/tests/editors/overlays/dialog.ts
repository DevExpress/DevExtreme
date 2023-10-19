import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Dialog`
  .page(url(__dirname, '../../container.html'));

[
  'alert',
  'confirm',
  'custom',
].forEach((dialogType) => {
  safeSizeTest(`Dialog appearance (${dialogType})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Dialog appearance (${dialogType}).png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    const dialogArgs = dialogType === 'custom'
      ? { title: 'custom', messageHtml: 'message', buttons: [{ text: 'Custom button' }] }
      : dialogType;

    await t.resizeWindow(400, 400);

    await ClientFunction(() => {
      const dialogFunction = (window as any).DevExpress.ui.dialog[dialogType];

      if (dialogType === 'custom') {
        dialogFunction(dialogArgs).show();
      } else {
        dialogFunction(dialogArgs);
      }
    }, {
      dependencies: {
        dialogType,
        dialogArgs,
      },
    })();
  });
});
