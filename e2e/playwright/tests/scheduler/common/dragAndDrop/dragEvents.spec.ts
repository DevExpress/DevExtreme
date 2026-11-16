import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import type { WindowCallbackExtended } from '../../../../helpers/callbackTestHelper';
import { CallbackTestHelper } from '../../../../helpers/callbackTestHelper';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const initCallbackTesting = async (page: Page): Promise<void> => {
  await CallbackTestHelper.initClientTesting(page, [
    'onDragStartItemData',
    'onDragMoveItemData',
    'onDragEndItemData',
    'onDragEndToItemData',
  ]);
};

const collectEventsCallbackResults = async (page: Page): Promise<any[][]> => [
  await CallbackTestHelper.getClientResults<any>(page, 'onDragStartItemData'),
  await CallbackTestHelper.getClientResults<any>(page, 'onDragMoveItemData'),
  await CallbackTestHelper.getClientResults<any>(page, 'onDragEndItemData'),
  await CallbackTestHelper.getClientResults<any>(page, 'onDragEndToItemData'),
];

const getLeft = (element: Locator): Promise<number> => element.evaluate(
  (node) => node.getBoundingClientRect().left,
);

const INITIAL_APPOINTMENT = {
  text: 'Test',
  startDate: '2023-01-01T01:00:00',
  endDate: '2023-01-01T02:00:00',
};
const TEST_CASES = [
  {
    view: 'month',
    expectedToItemData: {
      text: 'Test',
      startDate: '2023-01-05T01:00:00',
      endDate: '2023-01-05T02:00:00',
    },
  },
  {
    view: 'week',
    expectedToItemData: {
      text: 'Test',
      startDate: '2023-01-05T00:00:00',
      endDate: '2023-01-05T01:00:00',
      allDay: true,
    },
  },
  {
    view: 'timelineDay',
    expectedToItemData: {
      text: 'Test',
      startDate: '2023-01-01T01:30:00',
      endDate: '2023-01-01T02:30:00',
      allDay: false,
    },
  },
];

test.describe('Scheduler dragging - drag events', () => {
  TEST_CASES.forEach(({ view, expectedToItemData }) => {
    test(`Should fire correct events with correct itemData inside during drag-n-drop in ${view} view.`, async ({ page }) => {
      await initCallbackTesting(page);
      await createWidget(page, 'dxScheduler', (options: Record<string, unknown>) => ({
        ...options,
        appointmentDragging: {
          onDragStart: ({ itemData }) => {
            (window as WindowCallbackExtended)
              .clientTesting!
              .addCallbackResult('onDragStartItemData', { ...itemData });
          },
          onDragMove: ({ itemData }) => {
            (window as WindowCallbackExtended)
              .clientTesting!
              .addCallbackResult('onDragMoveItemData', { ...itemData });
          },
          onDragEnd: ({ itemData, toItemData }) => {
            const clientTesting = (window as WindowCallbackExtended).clientTesting!;
            clientTesting.addCallbackResult('onDragEndItemData', { ...itemData });
            clientTesting.addCallbackResult('onDragEndToItemData', { ...toItemData });
          },
        },
      }), SCHEDULER_SELECTOR, {
        arg: {
          dataSource: [INITIAL_APPOINTMENT],
          currentView: view,
          currentDate: '2023-01-01',
        },
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment('Test');
      const targetCell = scheduler.getDateTableCell(0, 4);

      await dragToElement(page, appointment.element, targetCell);

      const [
        onDragStartItemData,
        onDragMoveItemData,
        onDragEndItemData,
        onDragEndToItemData,
      ] = await collectEventsCallbackResults(page);

      expect(onDragStartItemData.length).toBe(1);
      expect(onDragStartItemData[0]).toEqual(INITIAL_APPOINTMENT);

      for (const itemData of onDragMoveItemData) {
        expect(itemData).toEqual(INITIAL_APPOINTMENT);
      }

      expect(onDragEndItemData.length).toBe(1);
      expect(onDragEndToItemData.length).toBe(1);
      expect(onDragEndItemData[0]).toEqual(INITIAL_APPOINTMENT);
      expect(onDragEndToItemData[0]).toEqual(expectedToItemData);
    });
  });

  test('Should block appointment dragging while onAppointmentUpdating Promise is pending (T1308596)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', (options: Record<string, unknown>) => ({
      ...options,
      onAppointmentUpdating: (e) => {
        e.cancel = new Promise((resolve) => {
          setTimeout(() => {
            resolve(false);
          }, 5000);
        });
      },
    }), SCHEDULER_SELECTOR, {
      arg: {
        dataSource: [{
          text: 'Test Appointment',
          startDate: new Date(2023, 0, 2, 10, 0),
          endDate: new Date(2023, 0, 2, 11, 0),
        }],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2023, 0, 2),
        height: 600,
      },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment('Test Appointment');

    const targetCell1 = scheduler.getDateTableCell(18, 2);
    const targetCell2 = scheduler.getDateTableCell(18, 5);

    const initialLeft = await getLeft(appointment.element);

    await dragToElement(page, appointment.element, targetCell1);
    await dragToElement(page, appointment.element, targetCell2);
    await dragToElement(page, appointment.element, targetCell2);
    await dragToElement(page, appointment.element, targetCell2);

    // The onAppointmentUpdating Promise resolves on a 5s timer that the page does not report.
    await page.waitForTimeout(6000);

    const leftAfterPromiseResolved = await getLeft(appointment.element);
    const cell1Left = await getLeft(targetCell1);

    expect(leftAfterPromiseResolved).not.toBe(initialLeft);
    expect(leftAfterPromiseResolved).toBe(cell1Left);
  });
});
