import { CallbackTestHelper, WindowCallbackExtended } from '../../../helpers/callbackTestHelper';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Scheduler dragging - drag events`
  .page(url(__dirname, '../../container.html'));

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
