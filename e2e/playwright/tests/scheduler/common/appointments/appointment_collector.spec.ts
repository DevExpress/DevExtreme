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

interface WidgetArg {
  config: typeof config;
  view: string;
}

const getRenderedData = (page: Page): Promise<unknown> => page.evaluate(
  () => (window as any).appointmentCollectorArgsData,
);

test.describe('Appointment Editing', () => {
  ['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
    const arg: WidgetArg = { config, view };

    test(`appointmentCollectorTemplate should render with appointments data on ${view} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', ({ config: widgetConfig, view: widgetView }: WidgetArg) => ({
        ...widgetConfig,
        views: [widgetView],
        currentView: widgetView,
        appointmentCollectorTemplate(data: any) {
          (window as any).appointmentCollectorArgsData = data;
          return document.createElement('div');
        },
      }), '#container', { arg });

      await expect.poll(() => getRenderedData(page)).toEqual({
        appointmentCount: 1,
        isCompact: ['day', 'week'].includes(view),
        items: [dataSource[1]],
      });
    });

    test(`appointmentCollectorTemplate in view config should render with appointments data on ${view} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', ({ config: widgetConfig, view: widgetView }: WidgetArg) => ({
        ...widgetConfig,
        views: [{
          type: widgetView,
          appointmentCollectorTemplate(data: any) {
            (window as any).appointmentCollectorArgsData = data;
            return document.createElement('div');
          },
        }],
        currentView: widgetView,
      }), '#container', { arg });

      await expect.poll(() => getRenderedData(page)).toEqual({
        appointmentCount: 1,
        isCompact: ['day', 'week'].includes(view),
        items: [dataSource[1]],
      });
    });
  });
});
