import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler dragging - drag events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const SCHEDULER_SELECTOR = '#container';

const initCallbackTesting = async () => {
  await CallbackTestHelper.initClientTesting([
    'onDragStartItemData',
    'onDragMoveItemData',
    'onDragEndItemData',
    'onDragEndToItemData',
  ]);
};

const clearCallbackTesting = async () => {
  await CallbackTestHelper.clearClientData([
    'onDragStartItemData',
    'onDragMoveItemData',
    'onDragEndItemData',
    'onDragEndToItemData',
  ]);
};

const collectEventsCallbackResults = async () => [
  await CallbackTestHelper.getClientResults<any>('onDragStartItemData'),
  await CallbackTestHelper.getClientResults<any>('onDragMoveItemData'),
  await CallbackTestHelper.getClientResults<any>('onDragEndItemData'),
  await CallbackTestHelper.getClientResults<any>('onDragEndToItemData'),
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
  // --- setup ---
await initCallbackTesting();
    await createWidget(page, 'dxScheduler', {
      dataSource: [INITIAL_APPOINTMENT],
      currentView: view,
      currentDate: '2023-01-01',
      appointmentDragging: {
        onDragStart: ({ itemData }) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onDragStartItemData', { ...itemData
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4);

    await t
      .dragToElement(appointment.element, targetCell, { speed: 0.5 });

    const [
      onDragStartItemData,
      onDragMoveItemData,
      onDragEndItemData,
      onDragEndToItemData,
    ] = await collectEventsCallbackResults();

    expect(onDragStartItemData.length).toBe(1)
      .expect(onDragStartItemData[0]).toBe(INITIAL_APPOINTMENT);

    // eslint-disable-next-line no-restricted-syntax
    for (const itemData of onDragMoveItemData) {
      expect(itemData).toBe(INITIAL_APPOINTMENT);
    }

    expect(onDragEndItemData.length).toBe(1)
      .expect(onDragEndToItemData.length).toBe(1)
      .expect(onDragEndItemData[0])
      .eql(INITIAL_APPOINTMENT)
      .expect(onDragEndToItemData[0])
      .eql(expectedToItemData);
});
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
    });
  }).after(async () => {
    await clearCallbackTesting();
  });
});

test('Should block appointment dragging while onAppointmentUpdating Promise is pending (T1308596)', async ({ page }) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test Appointment' });

  const targetCell1 = page.locator('.dx-scheduler-date-table-row').nth(18).locator('.dx-scheduler-date-table-cell').nth(2);
  const targetCell2 = page.locator('.dx-scheduler-date-table-row').nth(18).locator('.dx-scheduler-date-table-cell').nth(5);

  const initialPosition = await appointment.element.boundingClientRect;

  await /* TODO: dragToElement(appointment.element, targetCell1, { speed: 1 }) */;
  await /* TODO: dragToElement(appointment.element, targetCell2, { speed: 1 }) */;
  await /* TODO: dragToElement(appointment.element, targetCell2, { speed: 1 }) */;
  await /* TODO: dragToElement(appointment.element, targetCell2, { speed: 1 }) */;

  await await page.waitForTimeout(6000);

  const positionAfterPromiseResolved = await appointment.element.boundingClientRect;
  const cell1Position = await targetCell1.boundingClientRect;

  expect(positionAfterPromiseResolved.left)
    .notEql(initialPosition.left)
    .expect(positionAfterPromiseResolved.left)
    .eql(cell1Position.left);
});

// TODO: .before() block not converted - move to test setup
// {
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
});
});
