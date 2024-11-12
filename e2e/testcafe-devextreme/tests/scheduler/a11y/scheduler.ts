import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

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
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });
});
