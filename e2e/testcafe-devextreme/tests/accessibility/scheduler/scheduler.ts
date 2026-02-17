import Scheduler from 'devextreme-testcafe-models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { a11yCheckConfig } from './axe_options';

fixture.disablePageReloads`Scheduler - a11y`
  .page(url(__dirname, '../../container.html'));

test('Scheduler should have right aria attributes after view changed', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.getAttribute('aria-label')).contains('Scheduler. Month view');
  await t.expect(scheduler.getGeneralStatusContainer().textContent).contains('Scheduler. Month view');

  await t.expect(scheduler.element.getAttribute('role')).eql('application');

  await scheduler.option('currentView', 'week');

  await t.expect(scheduler.element.getAttribute('aria-label')).contains('Scheduler. Week view');
  await t.expect(scheduler.getGeneralStatusContainer().textContent).contains('Scheduler. Week view');

  await a11yCheck(t, a11yCheckConfig, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });
});

test('Scheduler table elements have right aria attributes', async (t) => {
  const scheduler = new Scheduler('#container');

  const tables = scheduler.element.find('table');
  await t.expect(tables.count).eql(4);

  for (let i = 0; i < await tables.count; i += 1) {
    await t.expect(
      tables.nth(i).getAttribute('aria-hidden'),
    ).eql('true');
  }

  await a11yCheck(t, a11yCheckConfig, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });
});

[
  'agenda', 'day', 'month', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek', 'week', 'workWeek',
].forEach((currentView) => {
  test(`Scheduler has no axe errors on view ${currentView}`, async (t) => {
    await a11yCheck(t, a11yCheckConfig, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        },
      ],
      currentView,
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
    });
  });
});
