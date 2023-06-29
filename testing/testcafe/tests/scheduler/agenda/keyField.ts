import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Agenda:KeyField`
  .page(url(__dirname, '../../container.html'));

['week', 'agenda'].forEach((currentView) => {
  test(`Waring should be throw in console in case currentView='${currentView}'`, async (t) => {
    const consoleMessages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!consoleMessages.warn.find((message) => message.startsWith('W1023'));
    await t.expect(isWarningExist).ok();
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      views: ['week', 'agenda'],
      currentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    });
  });
});
