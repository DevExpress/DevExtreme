import { ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('Charts.Export')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

declare global {
  interface Window {
    originalCreateObjectURL: (obj: Blob | MediaSource) => string;
    testedValue: string;
  }
}

runManualTest('Charts', 'ExportCustomMarkup', (test) => {
  test('Export', async (t) => {
    let isFileCreateForDownload = false;

    const checkFn = ClientFunction(() => {
      window.originalCreateObjectURL = URL.createObjectURL;
      window.testedValue = '';

      // @ts-expect-error Window.originalCreateObjectURL is not typed
      URL.createObjectURL = (blob) => {
        // @ts-expect-error Blob.type is not typed
        window.testedValue = blob.type;

        return Promise.reject();
      };
    });

    await checkFn();

    await t.click('#export,.dx-button[icon=export]');

    isFileCreateForDownload = await ClientFunction(() => {
      URL.createObjectURL = window.originalCreateObjectURL;
      const result = window.testedValue === 'image/png';
      delete window.testedValue;
      return result;
    })();

    await t.expect(isFileCreateForDownload).ok('File was created for download');
  });
});
