import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Date navigator`
  .page(url(__dirname, '../../container.html'));

[{
  agendaDuration: 20,
  result: '11-30 May 2021',
}, {
  agendaDuration: 40,
  result: '11 May-19 Jun 2021',
}].forEach(({ agendaDuration, result }) => {
  test(`Caption of date navigator should be valid after change view to Agenda with agendaDuration=${agendaDuration}`, async (t) => {
    const { toolbar } = new Scheduler('#container');

    await t
      .click(toolbar.viewSwitcher.getButton('Agenda').element);

    await t
      .expect(toolbar.navigator.caption.innerText)
      .eql(result);
  }).before(async () => createWidget('dxScheduler', {
    dataSource: [],
    views: [{
      type: 'agenda',
      agendaDuration,
    }, 'month'],
    currentView: 'month',
    currentDate: new Date(2021, 4, 11),
    height: 600,
  }));
});

test('Current date in Calendar should be respond on prev and next buttons of navigator', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const { toolbar } = new Scheduler('#container');

  await t
    .click(toolbar.navigator.caption);

  await t
    .expect(await takeScreenshot('initial-calendar-state.png'))
    .ok();

  await t
    .click(toolbar.navigator.nextButton)
    .click(toolbar.navigator.nextButton)
    .click(toolbar.navigator.nextButton);
  await t
    .click(toolbar.navigator.caption);

  await t
    .expect(await takeScreenshot('calendar-state-after-next-button-click.png'))
    .ok();

  await t
    .click(toolbar.navigator.prevButton)
    .click(toolbar.navigator.prevButton);
  await t
    .click(toolbar.navigator.caption);

  await t
    .expect(await takeScreenshot('calendar-state-after-prev-button-click.png'))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week', 'month'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
}));

// await toolbar.calendar.getView();
