import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

const setZoomLevel = (page: Page, zoomLevel: number): Promise<void> => page.evaluate((level) => {
  $('body').css('zoom', `${level}%`);
}, zoomLevel);

test.describe('Resize appointments - Zooming', () => {
  test('Vertical resize with zooming', async ({ page }) => {
    await setZoomLevel(page, 110);
    await insertStylesheetRulesToPage(page, '.dx-scheduler-cell-sizes-vertical { height: 43px;}');

    await createWidget(
      page,
      'dxScheduler',
      {
        dataSource: [{
          text: 'Appt-01',
          startDate: new Date(2021, 2, 28, 0),
          endDate: new Date(2021, 2, 28, 0, 30),
        }],
        views: ['day'],
        currentView: 'day',
        cellDuration: 15,
        currentDate: new Date(2021, 2, 28),
      },
    );

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Appt-01');

    await dragToOffset(page, resizableAppointment.resizableHandle.bottom, 0, 430, { offsetY: 20 });

    await expect.poll(async () => parseInt(
      await resizableAppointment.element.evaluate((element) => getComputedStyle(element).height),
      10,
    )).toBe(94);
  });
});
