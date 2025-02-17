import { ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('Charts.Export')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'ExportCustomMarkup', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Export', async (t) => {
    let isFileCreateForDownload = false;

    const checkFn = ClientFunction(() => {
      window.originalCreateObjectURL = URL.createObjectURL;
      window.testedValue = '';

      URL.createObjectURL = (blob) => {
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
