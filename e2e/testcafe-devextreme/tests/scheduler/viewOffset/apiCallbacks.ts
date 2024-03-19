import { CallbackTestHelper, WindowCallbackExtended } from '../../../helpers/callbackTestHelper';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

// NOTE: Disable page reloads will break the tests!
fixture`Offset: Api callbacks`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const MINUTE_MS = 60000;
const APPOINTMENT_TITLE = 'Test';
const API_CALLBACKS = {
  appointmentAdding: 'onAppointmentAdding',
  appointmentAdded: 'onAppointmentAdded',
  appointmentClick: 'onAppointmentClick',
  appointmentDblClick: 'onAppointmentDblClick',
  appointmentTooltipShowing: 'onAppointmentTooltipShowing',
  appointmentFormOpening: 'onAppointmentFormOpening',
  appointmentDeleting: 'onAppointmentDeleting',
  appointmentDeleted: 'onAppointmentDeleted',
  appointmentUpdating: 'onAppointmentUpdating',
  appointmentUpdated: 'onAppointmentUpdated',
  appointmentContextMenu: 'onAppointmentContextMenu',
  appointmentRendered: 'onAppointmentRendered',
};

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

[
  0,
  -700,
  700,
].forEach((offset) => {
  test(`onAppointmentRendered (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t.expect(scheduler.getAppointment(APPOINTMENT_TITLE).element.exists).ok();

    const [{ appointmentData, targetedAppointmentData }] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentRendered);

    await t.expect(appointmentData).eql(EXPECTED.appointmentData);
    await t.expect(targetedAppointmentData).eql(EXPECTED.targetedAppointmentData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentRendered,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentRendered: ({ appointmentData, targetedAppointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentRendered', { appointmentData, targetedAppointmentData });
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentRendered,
    ]);
    await removeStylesheetRulesFromPage();
  });

  test(`onAppointmentAdding and onAppointmentAdded (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const cell = scheduler.getDateTableCell(1, 2);
    const popupDoneButton = scheduler.appointmentPopup.doneButton;

    const expectedAppointmentData = {
      allDay: false,
      startDate: getCellDateWithOffset('2023-09-05T01:00:00Z', offset),
      endDate: getCellDateWithOffset('2023-09-05T02:00:00Z', offset),
      text: '',
    };

    await t.doubleClick(cell);
    await t.click(popupDoneButton);

    const [appointmentAddingData] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentAdding);
    const [appointmentAddedData] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentAdded);

    await t.expect(appointmentAddingData).eql(expectedAppointmentData);
    await t.expect(appointmentAddedData).eql(expectedAppointmentData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentAdding,
      API_CALLBACKS.appointmentAdded,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentAdding: ({ appointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentAdding', appointmentData);
      },
      onAppointmentAdded: ({ appointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentAdded', appointmentData);
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentAdding,
      API_CALLBACKS.appointmentAdded,
    ]);
    await removeStylesheetRulesFromPage();
  });

  test(`onAppointmentClick and onAppointmentDbClick (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

    await t.click(appointment.element);
    await t.doubleClick(appointment.element);

    const [{
      appointmentData: appointmentClickData,
      targetedAppointmentData: targetedAppointmentClickData,
    }] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentClick);
    const [{
      appointmentData: appointmentDbClickData,
      targetedAppointmentData: targetedAppointmentDbClickData,
    }] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentDblClick);

    await t.expect(appointmentClickData).eql(EXPECTED.appointmentData);
    await t.expect(targetedAppointmentClickData).eql(EXPECTED.targetedAppointmentData);
    await t.expect(appointmentDbClickData).eql(EXPECTED.appointmentData);
    await t.expect(targetedAppointmentDbClickData).eql(EXPECTED.targetedAppointmentData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentClick,
      API_CALLBACKS.appointmentDblClick,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentClick: ({ appointmentData, targetedAppointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentClick', { appointmentData, targetedAppointmentData });
      },
      onAppointmentDblClick: ({ appointmentData, targetedAppointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentDblClick', { appointmentData, targetedAppointmentData });
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentClick,
      API_CALLBACKS.appointmentDblClick,
    ]);
    await removeStylesheetRulesFromPage();
  });

  test(`onAppointmentTooltipShowing and onAppointmentFormOpening (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

    await t.click(appointment.element);
    // NOTE: Tooltip has a delay, so we should wait until it appears here :)
    await t.expect(scheduler.appointmentTooltip.exists).ok();
    await t.doubleClick(appointment.element);

    const [[{
      appointmentData: appointmentTooltipData,
      currentAppointmentData: currentAppointmentTooltipData,
    }]] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentTooltipShowing);
    const [appointmentFormData] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentFormOpening);

    await t.expect(appointmentTooltipData).eql(EXPECTED.appointmentData);
    await t.expect(currentAppointmentTooltipData).eql(EXPECTED.targetedAppointmentData);
    await t.expect(appointmentFormData).eql(EXPECTED.appointmentData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentTooltipShowing,
      API_CALLBACKS.appointmentFormOpening,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentTooltipShowing: ({ appointments }) => {
        const tooltipAppointmentData = appointments?.map((
          { appointmentData, currentAppointmentData },
        ) => ({
          appointmentData,
          currentAppointmentData,
        }));
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentTooltipShowing', tooltipAppointmentData);
      },
      onAppointmentFormOpening: ({ appointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentFormOpening', appointmentData);
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentTooltipShowing,
      API_CALLBACKS.appointmentFormOpening,
    ]);
    await removeStylesheetRulesFromPage();
  });

  // NOTE: onAppointmentDeleting event has a targetedAppointmentData field.
  // We don't have this event field in docs, so this test case doesn't check it.
  // Link to the docs: https://js.devexpress.com/jQuery/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting
  test(`onAppointmentDeleting and onAppointmentDeleted (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

    await t.click(appointment.element);
    // NOTE: Tooltip has a delay, so we should wait until it appears here :)
    await t.expect(scheduler.appointmentTooltip.exists).ok();
    await t.click(scheduler.appointmentTooltip.deleteButton);

    const [appointmentDeletingData] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentDeleting);
    const [appointmentDeletedData] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentDeleted);

    await t.expect(appointmentDeletingData).eql(EXPECTED.appointmentData);
    await t.expect(appointmentDeletedData).eql(EXPECTED.appointmentData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentDeleting,
      API_CALLBACKS.appointmentDeleted,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentDeleting: ({ appointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentDeleting', appointmentData);
      },
      onAppointmentDeleted: ({ appointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentDeleted', appointmentData);
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentDeleting,
      API_CALLBACKS.appointmentDeleted,
    ]);
    await removeStylesheetRulesFromPage();
  });

  test(`onAppointmentUpdating and onAppointmentUpdated (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

    const expectedOldData = {
      startDate: '2023-09-06T12:30:00',
      endDate: '2023-09-06T13:00:00',
      text: APPOINTMENT_TITLE,
    };
    const expectedNewData = getAppointmentAfterUpdate(offset);

    await t.drag(appointment.element, -100, 0);

    const [{ newData, oldData }] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentUpdating);
    const [appointmentData] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentUpdated);

    await t.expect(newData).eql(expectedNewData);
    await t.expect(oldData).eql(expectedOldData);
    await t.expect(appointmentData).eql(expectedNewData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentUpdating,
      API_CALLBACKS.appointmentUpdated,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentUpdating: ({ newData, oldData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentUpdating', { newData, oldData });
      },
      onAppointmentUpdated: ({ appointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentUpdated', appointmentData);
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentUpdating,
      API_CALLBACKS.appointmentUpdated,
    ]);
    await removeStylesheetRulesFromPage();
  });

  test(`onAppointmentContextMenu (offset: ${offset})`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

    await t.rightClick(appointment.element);

    const [{ appointmentData, targetedAppointmentData }] = await CallbackTestHelper
      .getClientResults(API_CALLBACKS.appointmentContextMenu);

    await t.expect(appointmentData).eql(EXPECTED.appointmentData);
    await t.expect(targetedAppointmentData).eql(EXPECTED.targetedAppointmentData);
  }).before(async () => {
    await CallbackTestHelper.initClientTesting([
      API_CALLBACKS.appointmentContextMenu,
    ]);
    await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
    await createWidget('dxScheduler', {
      currentDate: '2023-09-05',
      height: 800,
      dataSource: [
        {
          startDate: '2023-09-06T12:30:00',
          endDate: '2023-09-06T13:00:00',
          text: APPOINTMENT_TITLE,
        },
      ],
      currentView: 'week',
      cellDuration: 60,
      offset,
      onAppointmentContextMenu: ({ appointmentData, targetedAppointmentData }) => {
        (window as WindowCallbackExtended)
          .clientTesting!
          .addCallbackResult('onAppointmentContextMenu', { appointmentData, targetedAppointmentData });
      },
    });
  }).after(async () => {
    await CallbackTestHelper.clearClientData([
      API_CALLBACKS.appointmentContextMenu,
    ]);
    await removeStylesheetRulesFromPage();
  });
});
