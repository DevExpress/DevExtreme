import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';

const DX_DIALOG_CLASS = 'dx-dialog';

fixture`Dialog`
  .page(url(__dirname, '../../container.html'));

[
  'alert',
  'confirm',
  'custom',
].forEach((dialogType) => {
  safeSizeTest(`Dialog appearance (${dialogType})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Dialog appearance (${dialogType}).png`);

    await ClientFunction(() => {
      $(`.${DX_DIALOG_CLASS}`).remove();
    }, {
      dependencies: { DX_DIALOG_CLASS },
    })();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [400, 400]).before(async () => {
    const dialogArgs = dialogType === 'custom'
      ? { title: 'custom', messageHtml: 'message', buttons: [{ text: 'Custom button' }] }
      : dialogType;

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
