import { test, expect } from '@playwright/test';
import { setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

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

test.describe('Appointment Editing', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
    test(`appointmentCollectorTemplate should render with appointments data on ${view} view`, async ({ page }) => {
      await page.evaluate(({ cfg, ds, viewName }) => {
        const $scheduler = ($('#container') as any);
        const devExpress = (window as any).DevExpress;

        $scheduler.dxScheduler({
          ...cfg,
          dataSource: ds,
          views: [viewName],
          currentView: viewName,
          appointmentCollectorTemplate(data: any) {
            (window as any).appointmentCollectorArgsData = data;
            return document.createElement('div');
          },
        });
        devExpress.fx.off = true;
      }, { cfg: config, ds: dataSource, viewName: view });

      const renderedData = await page.evaluate(() => (window as any).appointmentCollectorArgsData);

      expect(renderedData).toEqual({
        appointmentCount: 1,
        isCompact: ['day', 'week'].includes(view),
        items: [dataSource[1]],
      });
    });

    test(`appointmentCollectorTemplate in view config should render with appointments data on ${view} view`, async ({ page }) => {
      await page.evaluate(({ cfg, ds, viewName }) => {
        const $scheduler = ($('#container') as any);
        const devExpress = (window as any).DevExpress;

        $scheduler.dxScheduler({
          ...cfg,
          dataSource: ds,
          views: [{
            type: viewName,
            appointmentCollectorTemplate(data: any) {
              (window as any).appointmentCollectorArgsData = data;
              return document.createElement('div');
            },
          }],
          currentView: viewName,
        });
        devExpress.fx.off = true;
      }, { cfg: config, ds: dataSource, viewName: view });

      const renderedData = await page.evaluate(() => (window as any).appointmentCollectorArgsData);

      expect(renderedData).toEqual({
        appointmentCount: 1,
        isCompact: ['day', 'week'].includes(view),
        items: [dataSource[1]],
      });
    });
  });
});
