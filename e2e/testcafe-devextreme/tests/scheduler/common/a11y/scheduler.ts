import Scheduler from 'devextreme-testcafe-models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { checkOptions } from './axe_options';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../container.html'));

test('Scheduler should have right aria attributes', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(
    scheduler.element.getAttribute('aria-label'),
  ).eql('Scheduler. Month view');

  await t.expect(
    scheduler.element.getAttribute('role'),
  ).eql('group');

  await scheduler.option('currentView', 'week');

  await t.expect(
    scheduler.element.getAttribute('aria-label'),
  ).eql('Scheduler. Week view');

  await a11yCheck(t, checkOptions, '#container');
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

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });
});

[
  'generic.light', 'material.blue.light', 'fluent.blue.light',
].forEach((theme) => {
  [
    'agenda', 'day', 'month', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek', 'week', 'workWeek',
  ].forEach((currentView) => {
    test(`Scheduler has no axe errors on view ${currentView} in ${theme}`, async (t) => {
      await a11yCheck(t, checkOptions, '#container');
    }).before(async () => {
      await changeTheme(theme);
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
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});
