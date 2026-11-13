import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

test.describe('Agenda:Editing', () => {
  test('It should be possible to delete an appointment', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('App 1').element.click();
    await scheduler.appointmentTooltip.deleteButton.click();
    await expect(scheduler.appointments).toHaveCount(3);
  });

  test('It should be possible to change the data source of agenda resources', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          text: 'New Brochures',
          ownerId: [1],
          startDate: new Date(2021, 1, 1, 18, 30),
          endDate: new Date(2021, 1, 1, 21, 15),
        }, {
          text: 'Website Re-Design Plan',
          ownerId: [2],
          startDate: new Date(2021, 1, 1, 23, 45),
          endDate: new Date(2021, 1, 2, 18, 15),
        },
      ],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 1, 1),
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

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await expect(scheduler.getAppointmentByIndex(0).getResource('Owner')).toHaveText('Samantha Bright');
    await expect(scheduler.getAppointmentByIndex(1).getResource('Owner')).toHaveText('Todd Hoffman');

    await scheduler.option('resources[0].dataSource', [{
      text: 'Todd Hoffman',
      id: 2,
    }]);

    await expect(scheduler.getAppointmentByIndex(0).getResource('Owner')).toHaveCount(0);
    await expect(scheduler.getAppointmentByIndex(1).getResource('Owner')).toHaveText('Todd Hoffman');
  });
});
