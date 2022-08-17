import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture`Agenda:Editing`
  .page(url(__dirname, '../../container.html'));

test('It should be possible to delete an appointment', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.getAppointment('App 1').element, { speed: 0.1 })
    .click(scheduler.appointmentTooltip.deleteButton, { speed: 0.1 })
    .expect(scheduler.getAppointmentCount())
    .eql(3);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'App 1',
      startDate: new Date(2021, 1, 1, 12),
      endDate: new Date(2021, 1, 1, 13),
    }, {
      text: 'App 2',
      startDate: new Date(2021, 1, 2, 12),
      endDate: new Date(2021, 1, 2, 13),
    }, {
      text: 'App 3',
      startDate: new Date(2021, 1, 3, 12),
      endDate: new Date(2021, 1, 3, 13),
    }, {
      text: 'App 4',
      startDate: new Date(2021, 1, 4, 12),
      endDate: new Date(2021, 1, 4, 13),
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 1, 1),
    height: 600,
  }, true);
});

test('It should be possible to change the data source of agenda resources', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentByIndex(0).resourceValue)
    .eql('Samantha Bright')
    .expect(scheduler.getAppointmentByIndex(1).resourceValue)
    .eql('Todd Hoffman');

  await scheduler.option('resources[0].dataSource', [{
    text: 'Todd Hoffman',
    id: 2,
  },
  ]);

  await t
    .expect(scheduler.getAppointmentByIndex(0).resourceValue)
    .notOk()
    .expect(scheduler.getAppointmentByIndex(1).resourceValue)
    .eql('Todd Hoffman');
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [
      {
        text: 'New Brochures',
        ownerId: [1],
        startDate: new Date('2021-02-01T18:30:00.000Z'),
        endDate: new Date('2021-02-01T21:15:00.000Z'),
      }, {
        text: 'Website Re-Design Plan',
        ownerId: [2],
        startDate: new Date('2021-02-01T23:45:00.000Z'),
        endDate: new Date('2021-02-02T18:15:00.000Z'),
      },
    ],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 1, 2),
    resources: [{
      fieldExpr: 'ownerId',
      dataSource: [{
        text: 'Samantha Bright',
        id: 1,
      }, {
        text: 'Todd Hoffman',
        id: 2,
      },
      ],
      label: 'Owner',
    }],
  });
});
