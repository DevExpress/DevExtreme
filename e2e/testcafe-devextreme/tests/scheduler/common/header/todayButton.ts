import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler header today button`
  .page(url(__dirname, '../../../container.html'));

test('Scheduler today button should works', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.click(scheduler.toolbar.todayButton);

  const currentDate = await scheduler.option('currentDate') as Date;
  const today = new Date();

  currentDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  await t.expect(currentDate).eql(today);
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 3, 27),
  toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
}));

const indicatorTime = new Date(2023, 3, 27);

test('Scheduler today button should use indicatorTime', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.toolbar.todayButton)
    .expect(scheduler.option('currentDate'))
    .eql(indicatorTime);
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 3, 27),
  indicatorTime,
  toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
}));
