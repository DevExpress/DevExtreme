import Scheduler from 'devextreme-testcafe-models/scheduler';
import { CallbackTestHelper, WindowCallbackExtended } from '../../../../helpers/callbackTestHelper';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Scheduler dragging - drag events`
  .page(url(__dirname, '../../../container.html'));

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
  test(`Should fire correct events with correct itemData inside during drag-n-drop in ${view} view.`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment('Test');
    const targetCell = scheduler.getDateTableCell(0, 4);

    await t
      .dragToElement(appointment.element, targetCell, { speed: 0.5 });

    const [
      onDragStartItemData,
      onDragMoveItemData,
      onDragEndItemData,
      onDragEndToItemData,
    ] = await collectEventsCallbackResults();

    await t
      .expect(onDragStartItemData.length).eql(1)
      .expect(onDragStartItemData[0]).eql(INITIAL_APPOINTMENT);

    // eslint-disable-next-line no-restricted-syntax
    for (const itemData of onDragMoveItemData) {
      await t.expect(itemData).eql(INITIAL_APPOINTMENT);
    }

    await t
      .expect(onDragEndItemData.length).eql(1)
      .expect(onDragEndToItemData.length).eql(1)
      .expect(onDragEndItemData[0])
      .eql(INITIAL_APPOINTMENT)
      .expect(onDragEndToItemData[0])
      .eql(expectedToItemData);
  }).before(async () => {
    await initCallbackTesting();
    await createWidget('dxScheduler', {
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

test('Should not throw error when trying to drag appointment that is being updated with Promise delay (T1308596)', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment('Test Appointment');

  await t.drag(appointment.element, 300, 0, { speed: 0.8 });

  await t.wait(200);

  await t.drag(appointment.element, 600, 0, { speed: 0.8 });

  await t.wait(2000);

  const consoleMessages = await t.getBrowserConsoleMessages();
  const hasErrors = consoleMessages?.error && consoleMessages.error.length > 0;

  await t.expect(hasErrors).notOk();
}).before(async () => {
  await createWidget('dxScheduler', {
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
