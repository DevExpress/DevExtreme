import type { WindowCallbackExtended } from '../../../../helpers/callbackTestHelper';
import { expect, test } from '../../../../fixtures';
import { CallbackTestHelper } from '../../../../helpers/callbackTestHelper';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const CALLBACKS = [
  'onDragStartItemData',
  'onDragMoveItemData',
  'onDragEndItemData',
  'onDragEndToItemData',
];

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

TEST_CASES.forEach(({ view, expectedToItemData }) => {
  test(`Should fire correct events with correct itemData inside during drag-n-drop in ${view} view.`, async ({ page }) => {
    await CallbackTestHelper.initClientTesting(page, CALLBACKS);
    await createWidget(page, 'dxScheduler', {
      dataSource: [INITIAL_APPOINTMENT],
      currentView: view,
      currentDate: '2023-01-01',
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
          const { clientTesting } = window as WindowCallbackExtended;

          clientTesting!.addCallbackResult('onDragEndItemData', { ...itemData });
          clientTesting!.addCallbackResult('onDragEndToItemData', { ...toItemData });
        },
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
    ] = await Promise.all(
      CALLBACKS.map((name) => CallbackTestHelper.getClientResults<any>(page, name)),
    );

    expect(onDragStartItemData.length).toBe(1);
    expect(onDragStartItemData[0]).toEqual(INITIAL_APPOINTMENT);

    onDragMoveItemData.forEach((itemData) => {
      expect(itemData).toEqual(INITIAL_APPOINTMENT);
    });

    expect(onDragEndItemData.length).toBe(1);
    expect(onDragEndToItemData.length).toBe(1);
    expect(onDragEndItemData[0]).toEqual(INITIAL_APPOINTMENT);
    expect(onDragEndToItemData[0]).toEqual(expectedToItemData);
  });
});

test('Should block appointment dragging while onAppointmentUpdating Promise is pending (T1308596)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Test Appointment',
      startDate: new Date(2023, 0, 2, 10, 0),
      endDate: new Date(2023, 0, 2, 11, 0),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2023, 0, 2),
    height: 600,
    onAppointmentUpdating: (e) => {
      e.cancel = new Promise((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 5000);
      });
    },
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment('Test Appointment');

  const targetCell1 = scheduler.getDateTableCell(18, 2);
  const targetCell2 = scheduler.getDateTableCell(18, 5);

  const initialPosition = await appointment.element.boundingBox();

  await dragToElement(page, appointment.element, targetCell1);
  await dragToElement(page, appointment.element, targetCell2);
  await dragToElement(page, appointment.element, targetCell2);
  await dragToElement(page, appointment.element, targetCell2);

  const cell1Position = await targetCell1.boundingBox();

  // Only the first drag is applied, and only once the pending promise resolves five seconds later.
  await expect
    .poll(
      async () => (await appointment.element.boundingBox())?.x,
      { timeout: 15000 },
    )
    .toBe(cell1Position?.x);

  expect((await appointment.element.boundingBox())?.x).not.toBe(initialPosition?.x);
});
