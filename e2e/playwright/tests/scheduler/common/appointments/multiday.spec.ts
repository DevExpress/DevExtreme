import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const expectClientSizeWithin = async (
  element: Locator,
  property: 'clientWidth' | 'clientHeight',
  min: number,
  max: number,
): Promise<void> => {
  const getSize = () => element.evaluate((node, name) => node[name], property);

  await expect.poll(getSize).toBeGreaterThanOrEqual(min);
  await expect.poll(getSize).toBeLessThanOrEqual(max);
};

const checkAllDayAppointment = async (
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: 'head' | 'body' | 'tail' | undefined,
  width: number,
): Promise<void> => {
  const appointment = scheduler.getAppointment(title, index);
  const isReduced = reduceType !== undefined;

  await expect(appointment.reducedIcon).toBeAttached({ attached: isReduced });
  await appointment.expectState('reducedHead', reduceType === 'head');
  await appointment.expectState('reducedBody', reduceType === 'body');
  await appointment.expectState('reducedTail', reduceType === 'tail');
  await appointment.expectState('allDay');
  await expectClientSizeWithin(appointment.element, 'clientWidth', width - 1, width + 1);
};

const checkRegularAppointment = async (
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: 'head' | 'body' | 'tail' | undefined,
  height: number,
): Promise<void> => {
  const appointment = scheduler.getAppointment(title, index);
  const isReduced = reduceType !== undefined;

  await expect(appointment.reducedIcon).toBeAttached({ attached: isReduced });
  await appointment.expectState('reducedHead', reduceType === 'head');
  await appointment.expectState('reducedBody', reduceType === 'body');
  await appointment.expectState('reducedTail', reduceType === 'tail');
  await expectClientSizeWithin(appointment.element, 'clientHeight', height - 1, height + 1);
};

test.describe('Scheduler - Multiday appointments', () => {
  test.describe(() => {
    test.use({ theme: 'generic.light' });

    test('it should render multi-day and multi-view appointments correctly if allDayPanelMode is "hidden"', async ({ page }) => {
      await createWidget(
        page,
        'dxScheduler',
        {
          width: 900,
          height: 400,
          dataSource: [{
            text: 'appt-00',
            startDate: new Date(2021, 2, 22, 8),
            endDate: new Date(2021, 2, 22, 10, 30),
          }, {
            text: 'appt-01',
            startDate: new Date(2021, 2, 25, 9),
            endDate: new Date(2021, 3, 6, 8, 30),
          }],
          views: ['week', 'month', 'timelineMonth'],
          currentView: 'week',
          currentDate: new Date(2021, 2, 21),
          startDayHour: 8,
          endDayHour: 10,
          allDayPanelMode: 'hidden',
        },
      );

      const scheduler = new Scheduler(page, '#container');

      await expect(scheduler.appointments).toHaveCount(4);
      let appointmentCount = await scheduler.appointments.count();

      await checkRegularAppointment(scheduler, 'appt-00', 0, undefined, 200);

      await checkRegularAppointment(scheduler, 'appt-01', 0, 'head', 100);
      for (let i = 1; i < appointmentCount - 2; i += 1) {
        await checkRegularAppointment(scheduler, 'appt-01', i, 'body', 200);
      }

      await scheduler.toolbar.navigator.nextButton.click();

      await expect(scheduler.appointments).toHaveCount(7);
      appointmentCount = await scheduler.appointments.count();

      for (let i = 0; i < appointmentCount; i += 1) {
        await checkRegularAppointment(scheduler, 'appt-01', i, 'body', 200);
      }

      await scheduler.toolbar.navigator.nextButton.click();

      await expect(scheduler.appointments).toHaveCount(3);
      await checkRegularAppointment(scheduler, 'appt-01', 0, 'body', 200);
      await checkRegularAppointment(scheduler, 'appt-01', 1, 'body', 200);
      await checkRegularAppointment(scheduler, 'appt-01', 2, 'tail', 50);
    });

    test('it should render all-day appointments if allDayPanelMode is "all"', async ({ page }) => {
      await createWidget(
        page,
        'dxScheduler',
        {
          width: 900,
          height: 400,
          dataSource: [{
            text: 'appt-00',
            startDate: new Date(2021, 2, 22, 8),
            endDate: new Date(2021, 2, 22, 10, 30),
            allDay: true,
          }, {
            text: 'appt-01',
            startDate: new Date(2021, 2, 25, 9),
            endDate: new Date(2021, 3, 6, 8, 30),
          }],
          views: ['week', 'month', 'timelineMonth'],
          currentView: 'week',
          currentDate: new Date(2021, 2, 21),
          startDayHour: 8,
          endDayHour: 10,
          allDayPanelMode: 'all',
        },
      );

      const scheduler = new Scheduler(page, '#container');

      await expect(scheduler.appointments).toHaveCount(2);
      await checkAllDayAppointment(scheduler, 'appt-00', 0, undefined, 109);
      await checkAllDayAppointment(scheduler, 'appt-01', 0, 'head', 337);

      await scheduler.toolbar.navigator.nextButton.click();

      await expect(scheduler.appointments).toHaveCount(1);
      await checkAllDayAppointment(scheduler, 'appt-01', 0, 'body', 793);

      await scheduler.toolbar.navigator.nextButton.click();

      await expect(scheduler.appointments).toHaveCount(1);
      await checkAllDayAppointment(scheduler, 'appt-01', 0, 'tail', 337);
    });
  });

  test('it should render all-day and multi-day appointments if allDayPanelMode is "allDay"', async ({ page }) => {
    await createWidget(
      page,
      'dxScheduler',
      {
        width: 900,
        height: 400,
        dataSource: [{
          text: 'allDay',
          startDate: new Date(2021, 2, 22),
          allDay: true,
        }, {
          text: 'multiDay',
          startDate: new Date(2021, 2, 22, 8),
          endDate: new Date(2021, 2, 25, 9, 30),
        }],
        views: ['week', 'month', 'timelineMonth'],
        currentView: 'week',
        currentDate: new Date(2021, 2, 21),
        startDayHour: 8,
        endDayHour: 10,
        allDayPanelMode: 'allDay',
      },
    );

    const scheduler = new Scheduler(page, '#container');

    await expect(scheduler.appointments).toHaveCount(5);

    await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 117);
    await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 151);
    await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 151);
    await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 151);
    await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);
  });

  test('it should correctly change allDayPanelOption at runtime', async ({ page }) => {
    await createWidget(
      page,
      'dxScheduler',
      {
        width: 800,
        height: 600,
        dataSource: [
          {
            text: 'allDay',
            startDate: new Date(2021, 2, 22),
            allDay: true,
          },
          {
            text: 'multiDay',
            startDate: new Date(2021, 2, 22, 8),
            endDate: new Date(2021, 2, 25, 9, 30),
          }],
        views: ['week', 'workWeek'],
        currentView: 'week',
        currentDate: new Date(2021, 2, 22),
        maxAppointmentsPerCell: 2,
        startDayHour: 8,
        endDayHour: 12,
      },
    );

    const scheduler = new Scheduler(page, '#container');

    await expect(scheduler.appointments).toHaveCount(2);
    await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
    await checkAllDayAppointment(scheduler, 'multiDay', 0, undefined, 417);

    await scheduler.option('allDayPanelMode', 'allDay');
    await expect(scheduler.appointments).toHaveCount(5);
    await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
    await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);

    await scheduler.option('allDayPanelMode', 'hidden');
    await expect(scheduler.appointments).toHaveCount(5);
    await expect(scheduler.allDayTableCells).toHaveCount(0);
    await checkRegularAppointment(scheduler, 'allDay', 0, undefined, 303);
    await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);

    await scheduler.option('allDayPanelMode', 'allDay');
    await expect(scheduler.appointments).toHaveCount(5);
    await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
    await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 303);
    await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);
    await scheduler.option('allDayPanelMode', 'all');
    await expect(scheduler.appointments).toHaveCount(2);
    await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
    await checkAllDayAppointment(scheduler, 'multiDay', 0, undefined, 417);
  });

  test.describe(() => {
    test.use({ theme: 'generic.light' });

    test('it should correctly handle allDayPanelMode for the workspace', async ({ page }) => {
      await createWidget(
        page,
        'dxScheduler',
        {
          width: 900,
          height: 400,
          dataSource: [{
            text: 'allDay',
            startDate: new Date(2021, 2, 22),
            allDay: true,
          }, {
            text: 'multiDay',
            startDate: new Date(2021, 2, 22, 8),
            endDate: new Date(2021, 2, 25, 9, 30),
          }],
          views: [
            'week',
            {
              type: 'week',
              name: 'weekAllDay',
              allDayPanelMode: 'allDay',
            },
          ],
          currentView: 'week',
          currentDate: new Date(2021, 2, 21),
          startDayHour: 8,
          endDayHour: 10,
        },
      );

      const scheduler = new Scheduler(page, '#container');

      await expect(scheduler.appointments).toHaveCount(2);

      await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 109);
      await checkAllDayAppointment(scheduler, 'multiDay', 0, undefined, 451);

      await scheduler.toolbar.viewSwitcher.getButton('weekAllDay').element.click();
      await expect(scheduler.appointments).toHaveCount(5);

      await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 109);
      await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 200);
      await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 200);
      await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 200);
      await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 150);
    });
  });
});
