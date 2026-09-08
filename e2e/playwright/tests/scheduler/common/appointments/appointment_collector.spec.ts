import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';

const dataSource = [{
  text: 'appointment1',
  startDate: new Date('2021-04-02T07:30:00.000Z'),
  endDate: new Date('2021-04-02T09:00:00.000Z'),
}, {
  text: 'appointment2',
  startDate: new Date('2021-04-02T07:35:00.000Z'),
  endDate: new Date('2021-04-02T09:05:00.000Z'),
}];

const config = {
  dataSource,
  timeZone: 'America/Los_Angeles',
  currentDate: new Date(2021, 3, 2),
  maxAppointmentsPerCell: 1,
};

const expectedArgs = (view: string): Record<string, unknown> => ({
  appointmentCount: 1,
  isCompact: ['day', 'week'].includes(view),
  items: [dataSource[1]],
});

const readCollectorArgs = async (page: Page): Promise<unknown> => page.evaluate(
  () => (window as any).appointmentCollectorArgsData,
);

['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
  test(`appointmentCollectorTemplate should render with appointments data on ${view} view`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...config,
      dataSource,
      views: [view],
      currentView: view,
      appointmentCollectorTemplate(data: any) {
        (window as any).appointmentCollectorArgsData = data;
        return document.createElement('div');
      },
    });

    await expect.poll(async () => readCollectorArgs(page)).toEqual(expectedArgs(view));
  });

  test(`appointmentCollectorTemplate in view config should render with appointments data on ${view} view`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...config,
      dataSource,
      views: [{
        type: view,
        appointmentCollectorTemplate(data: any) {
          (window as any).appointmentCollectorArgsData = data;
          return document.createElement('div');
        },
      }],
      currentView: view,
    });

    await expect.poll(async () => readCollectorArgs(page)).toEqual(expectedArgs(view));
  });
});
