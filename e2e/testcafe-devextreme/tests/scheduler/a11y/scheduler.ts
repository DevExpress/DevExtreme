import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../container.html'));

test('Scheduler should have right aria attributes', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(
    scheduler.element.getAttribute('aria-label'),
  ).eql('Scheduler');

  await t.expect(
    scheduler.element.getAttribute('role'),
  ).eql('group');
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
  });
});
