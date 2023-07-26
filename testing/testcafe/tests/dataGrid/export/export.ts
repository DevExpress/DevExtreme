import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture.disablePageReloads`Export`
  .page(url(__dirname, '../../container.html'));

test('Warning should be thrown in console if exporting is enabled, but onExporting is not specified', async (t) => {
  const consoleMessages = await t.getBrowserConsoleMessages();
  const isWarningExist = !!consoleMessages?.warn.find((message) => message.startsWith('W1024'));

  await t.expect(isWarningExist).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [],
    export: {
      enabled: true,
    },
  });
});
