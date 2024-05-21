import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`ResourceCellTemplate`
  .page(url(__dirname, '../../container.html'));

test('resourceCellTemplate layout should be rendered right in the agenda view', async (t) => {
  const scheduler = new Scheduler('#container');
  const groupHeader = scheduler.getGroupCell();

  await t.expect(groupHeader.textContent).eql('Custom resource text');
}).before(async () => {
  const currentDate = new Date(2017, 4, 25);
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'appointment',
      startDate: currentDate,
      endDate: currentDate,
      resource: 1,
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate,
    resourceCellTemplate() {
      return 'Custom resource text';
    },
    groups: ['resource'],
    resources: [{
      fieldExpr: 'resource',
      dataSource: [{
        text: 'Resource text',
        id: 1,
      }],
      label: 'Resource',
    }],
    height: 600,
  });
});
