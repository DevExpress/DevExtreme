import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../container.html'));

['month', 'week', 'day'].forEach((currentView) => {
  test(`appointment should have correct aria-label without grouping (${currentView})`, async (t) => {
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
      currentView,
      currentDate: new Date(2021, 1, 1),
    });
  });

  test(`appointment should have correct aria-label with one group (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    const attrs = await scheduler.getAppointment('App 1').element.attributes;

    await t
      .expect(attrs['aria-label'])
      .eql('February 1, 2021, Group: resource1, ');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        groupId: 1,
      }],
      currentView,
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

  test(`appointment should have correct aria-label with multiple group (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    const attrs = await scheduler.getAppointment('App 1').element.attributes;

    await t
      .expect(attrs['aria-label'])
      .eql('February 1, 2021, Group: resource11, resource21, ');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        groupId1: 1,
        groupId2: 1,
      }],
      currentView,
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

[
  {
    currentView: 'week',
    startDate: new Date(2021, 1, 1, 12),
    endDate: new Date(2021, 1, 3, 13),
    labels: [
      'February 1, 2021 - February 3, 2021 (1/3), ',
      'February 1, 2021 - February 3, 2021 (2/3), ',
      'February 1, 2021 - February 3, 2021 (3/3), ',
    ],
  },
  {
    currentView: 'month',
    startDate: new Date(2021, 1, 1, 12),
    endDate: new Date(2021, 1, 17, 13),
    labels: [
      'February 1, 2021 - February 17, 2021 (1/3), ',
      'February 1, 2021 - February 17, 2021 (2/3), ',
      'February 1, 2021 - February 17, 2021 (3/3), ',
    ],
  },
].forEach(({
  currentView, startDate, endDate, labels,
}) => {
  test(`appointment should have correct aria-label if it is multipart (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    const apptLabels = await Promise.all([0, 1, 2].map(
      async (i) => {
        const appt = scheduler.getAppointment('App 1', i);
        const attrs = await appt.element.attributes;
        return attrs['aria-label'];
      },
    ));

    await t.expect(apptLabels[0]).eql(labels[0]);
    await t.expect(apptLabels[1]).eql(labels[1]);
    await t.expect(apptLabels[2]).eql(labels[2]);
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate,
        endDate,
      }],
      allDayPanelMode: 'hidden',
      currentView,
      currentDate: new Date(2021, 1, 1),
    });
  });
});
