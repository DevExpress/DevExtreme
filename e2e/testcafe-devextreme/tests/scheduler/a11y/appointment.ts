import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../container.html'));

['month', 'week', 'day'].forEach((view) => {
  test('appointment should have correct aria-label without grouping', async (t) => {
    const scheduler = new Scheduler('#container');

    await t
      .expect(
        scheduler.getAppointment('App 1').element.attributes['aria-label'],
      )
      .eql(undefined);
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
      }],
      currentView: view,
      currentDate: new Date(2021, 1, 1),
    });
  });

  test('appointment should have correct aria-label with one group', async (t) => {
    const scheduler = new Scheduler('#container');

    const attrs = await scheduler.getAppointment('App 1').element.attributes;

    await t
      .expect(attrs['aria-label'])
      .eql('Group: resource1' as any);
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        groupId: 1,
      }],
      currentView: view,
      currentDate: new Date(2021, 1, 1),
      groups: ['groupId'],
      resources: [
        {
          fieldExpr: 'groupId',
          dataSource: [{
            text: 'resource1',
            id: 1,
          }],
        },
      ],
    });
  });

  test('appointment should have correct aria-label with multiple group', async (t) => {
    const scheduler = new Scheduler('#container');

    const attrs = await scheduler.getAppointment('App 1').element.attributes;

    await t
      .expect(attrs['aria-label'])
      .eql('Group: resource11, resource21');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        groupId1: 1,
        groupId2: 1,
      }],
      currentView: view,
      currentDate: new Date(2021, 1, 1),
      groups: ['groupId1', 'groupId2'],
      resources: [
        {
          fieldExpr: 'groupId1',
          dataSource: [{
            text: 'resource11',
            id: 1,
          }],
        },
        {
          fieldExpr: 'groupId2',
          dataSource: [{
            text: 'resource21',
            id: 1,
          }],
        },
      ],
    });
  });
});
