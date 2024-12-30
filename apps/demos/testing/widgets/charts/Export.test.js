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

    const checkFn = ClientFunction((checkData) => {
      window.originalCreateObjectURL = URL.createObjectURL;
      window._testedValue = '';

      URL.createObjectURL = (blob) => {
        window._testedValue = blob.type;

        return Promise.reject();
      };
    });

    await checkFn();

    await t.click('#export,.dx-button[icon=export]');

    isFileCreateForDownload = await ClientFunction(() => {
      URL.createObjectURL =  window.originalCreateObjectURL;
      return window._testedValue ===  'image/png';
    })();

    await t.expect(isFileCreateForDownload).ok('File was created for download');
  });
});
