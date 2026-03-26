// @ts-nocheck
import { test, expect } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const MINUTE_MS = 60000;
const APPOINTMENT_TITLE = 'Test';

const getCellDateWithOffset = (initialDateString: string, offset: number): string => {
  const initialDate = new Date(initialDateString);
  const cellDate = new Date(initialDate.getTime() + (offset * MINUTE_MS));
  const [result] = cellDate.toISOString().split('.');
  return result;
};

const getAppointmentAfterUpdate = (offset: number) => {
  switch (offset) {
    case 700:
      return {
        startDate: '2023-09-05T12:40:00',
        endDate: '2023-09-05T13:10:00',
        text: APPOINTMENT_TITLE,
        allDay: false,
      };
    case -700:
      return {
        startDate: '2023-09-05T12:20:00',
        endDate: '2023-09-05T12:50:00',
        text: APPOINTMENT_TITLE,
        allDay: false,
      };
    default:
      return {
        startDate: '2023-09-05T12:00:00',
        endDate: '2023-09-05T12:30:00',
        text: APPOINTMENT_TITLE,
        allDay: false,
      };
  }
};

const EXPECTED = {
  appointmentData: {
    startDate: '2023-09-06T12:30:00',
    endDate: '2023-09-06T13:00:00',
    text: APPOINTMENT_TITLE,
  },
  targetedAppointmentData: {
    startDate: '2023-09-06T12:30:00',
    endDate: '2023-09-06T13:00:00',
    displayStartDate: new Date('2023-09-06T12:30:00'),
    displayEndDate: new Date('2023-09-06T13:00:00'),
    text: APPOINTMENT_TITLE,
  },
};

const STANDARD_DATA_SOURCE = [
  {
    startDate: '2023-09-06T12:30:00',
    endDate: '2023-09-06T13:00:00',
    text: APPOINTMENT_TITLE,
  },
];

const initClientTesting = async (page, callbacks: string[]) => {
  await page.evaluate((cbs) => {
    (window as any).clientTesting = (window as any).clientTesting || {};
    cbs.forEach((cb) => {
      (window as any).clientTesting[cb] = [];
    });
  }, callbacks);
};

const getClientResults = async (page, callbackName: string) => {
  return page.evaluate((name) => (window as any).clientTesting[name], callbackName);
};

const clearClientData = async (page, callbacks: string[]) => {
  await page.evaluate((cbs) => {
    cbs.forEach((cb) => {
      if ((window as any).clientTesting) {
        (window as any).clientTesting[cb] = [];
      }
    });
  }, callbacks);
};

test.describe('Offset: Api callbacks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [
    0,
    -700,
    700,
  ].forEach((offset) => {
    test(`onAppointmentRendered (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentRendered']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentRendered: ({ appointmentData, targetedAppointmentData }) => {
            win.clientTesting.onAppointmentRendered.push({ appointmentData, targetedAppointmentData });
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
      await expect(appointment).toBeVisible();

      const results = await getClientResults(page, 'onAppointmentRendered');
      expect(results[0].appointmentData).toEqual(EXPECTED.appointmentData);

      await clearClientData(page, ['onAppointmentRendered']);
    });

    test(`onAppointmentAdding and onAppointmentAdded (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentAdding', 'onAppointmentAdded']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentAdding: ({ appointmentData }) => {
            win.clientTesting.onAppointmentAdding.push(appointmentData);
          },
          onAppointmentAdded: ({ appointmentData }) => {
            win.clientTesting.onAppointmentAdded.push(appointmentData);
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const expectedAppointmentData = {
        allDay: false,
        startDate: getCellDateWithOffset('2023-09-05T01:00:00Z', offset),
        endDate: getCellDateWithOffset('2023-09-05T02:00:00Z', offset),
        text: '',
        recurrenceRule: '',
      };

      const cell = page.locator('.dx-scheduler-date-table-row').nth(1)
        .locator('.dx-scheduler-date-table-cell').nth(2);
      await cell.dblclick();

      const saveButton = page.locator('.dx-scheduler-appointment-popup .dx-popup-done');
      await saveButton.click();

      const addingResults = await getClientResults(page, 'onAppointmentAdding');
      const addedResults = await getClientResults(page, 'onAppointmentAdded');

      expect(addingResults[0]).toEqual(expectedAppointmentData);
      expect(addedResults[0]).toEqual(expectedAppointmentData);

      await clearClientData(page, ['onAppointmentAdding', 'onAppointmentAdded']);
    });

    test(`onAppointmentClick and onAppointmentDbClick (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentClick', 'onAppointmentDblClick']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentClick: ({ appointmentData, targetedAppointmentData }) => {
            win.clientTesting.onAppointmentClick.push({ appointmentData, targetedAppointmentData });
          },
          onAppointmentDblClick: ({ appointmentData, targetedAppointmentData }) => {
            win.clientTesting.onAppointmentDblClick.push({ appointmentData, targetedAppointmentData });
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
      await appointment.click();
      await appointment.dblclick();

      const clickResults = await getClientResults(page, 'onAppointmentClick');
      const dblClickResults = await getClientResults(page, 'onAppointmentDblClick');

      expect(clickResults[0].appointmentData).toEqual(EXPECTED.appointmentData);
      expect(dblClickResults[0].appointmentData).toEqual(EXPECTED.appointmentData);

      await clearClientData(page, ['onAppointmentClick', 'onAppointmentDblClick']);
    });

    test(`onAppointmentTooltipShowing and onAppointmentFormOpening (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentTooltipShowing', 'onAppointmentFormOpening']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentTooltipShowing: ({ appointments }) => {
            const tooltipAppointmentData = appointments?.map(({ appointmentData, currentAppointmentData }) => ({
              appointmentData,
              currentAppointmentData,
            }));
            win.clientTesting.onAppointmentTooltipShowing.push(tooltipAppointmentData);
          },
          onAppointmentFormOpening: ({ appointmentData }) => {
            win.clientTesting.onAppointmentFormOpening.push(appointmentData);
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
      await appointment.click();

      const tooltip = page.locator('.dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper');
      await expect(tooltip).toBeVisible();

      await appointment.dblclick();

      const tooltipResults = await getClientResults(page, 'onAppointmentTooltipShowing');
      const formResults = await getClientResults(page, 'onAppointmentFormOpening');

      expect(tooltipResults[0][0].appointmentData).toEqual(EXPECTED.appointmentData);
      expect(formResults[0]).toEqual(EXPECTED.appointmentData);

      await clearClientData(page, ['onAppointmentTooltipShowing', 'onAppointmentFormOpening']);
    });

    test(`onAppointmentDeleting and onAppointmentDeleted (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentDeleting', 'onAppointmentDeleted']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentDeleting: ({ appointmentData }) => {
            win.clientTesting.onAppointmentDeleting.push(appointmentData);
          },
          onAppointmentDeleted: ({ appointmentData }) => {
            win.clientTesting.onAppointmentDeleted.push(appointmentData);
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
      await appointment.click();

      const tooltip = page.locator('.dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper');
      await expect(tooltip).toBeVisible();

      const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button');
      await deleteButton.click();

      const deletingResults = await getClientResults(page, 'onAppointmentDeleting');
      const deletedResults = await getClientResults(page, 'onAppointmentDeleted');

      expect(deletingResults[0]).toEqual(EXPECTED.appointmentData);
      expect(deletedResults[0]).toEqual(EXPECTED.appointmentData);

      await clearClientData(page, ['onAppointmentDeleting', 'onAppointmentDeleted']);
    });

    test(`onAppointmentUpdating and onAppointmentUpdated (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentUpdating', 'onAppointmentUpdated']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentUpdating: ({ newData, oldData }) => {
            win.clientTesting.onAppointmentUpdating.push({ newData, oldData });
          },
          onAppointmentUpdated: ({ appointmentData }) => {
            win.clientTesting.onAppointmentUpdated.push(appointmentData);
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const expectedOldData = {
        startDate: '2023-09-06T12:30:00',
        endDate: '2023-09-06T13:00:00',
        text: APPOINTMENT_TITLE,
      };
      const expectedNewData = getAppointmentAfterUpdate(offset);

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
      // TODO: t.drag(element, -100, 0) - drag by pixel offset
      const box = await appointment.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, { steps: 5 });
        await page.mouse.up();
      }

      const updatingResults = await getClientResults(page, 'onAppointmentUpdating');
      const updatedResults = await getClientResults(page, 'onAppointmentUpdated');

      expect(updatingResults[0].newData).toEqual(expectedNewData);
      expect(updatingResults[0].oldData).toEqual(expectedOldData);
      expect(updatedResults[0]).toEqual(expectedNewData);

      await clearClientData(page, ['onAppointmentUpdating', 'onAppointmentUpdated']);
    });

    test(`onAppointmentContextMenu (offset: ${offset})`, async ({ page }) => {
      await initClientTesting(page, ['onAppointmentContextMenu']);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await page.evaluate(({ ds, off }) => {
        const win = window as any;
        win.DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          currentDate: '2023-09-05',
          height: 800,
          dataSource: ds,
          currentView: 'week',
          cellDuration: 60,
          offset: off,
          onAppointmentContextMenu: ({ appointmentData, targetedAppointmentData }) => {
            win.clientTesting.onAppointmentContextMenu.push({ appointmentData, targetedAppointmentData });
          },
        });
      }, { ds: STANDARD_DATA_SOURCE, off: offset });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
      await appointment.click({ button: 'right' });

      const contextMenuResults = await getClientResults(page, 'onAppointmentContextMenu');

      expect(contextMenuResults[0].appointmentData).toEqual(EXPECTED.appointmentData);

      await clearClientData(page, ['onAppointmentContextMenu']);
    });
  });
});
