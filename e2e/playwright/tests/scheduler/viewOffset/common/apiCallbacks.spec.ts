import type { Page } from '@playwright/test';
import type {
  AppointmentAddedEvent,
  AppointmentAddingEvent,
  AppointmentClickEvent,
  AppointmentContextMenuEvent,
  AppointmentDblClickEvent,
  AppointmentDeletedEvent,
  AppointmentDeletingEvent,
  AppointmentFormOpeningEvent,
  AppointmentRenderedEvent,
  AppointmentTooltipShowingEvent,
  AppointmentUpdatedEvent,
  AppointmentUpdatingEvent,
} from 'devextreme/ui/scheduler';
import { expect, test } from '../../../../fixtures';
import type { WindowCallbackExtended } from '../../../../helpers/callbackTestHelper';
import { CallbackTestHelper } from '../../../../helpers/callbackTestHelper';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

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

interface WidgetArg {
  offset: number;
  title: string;
}

const getFirstClientResult = async <T>(page: Page, key: string): Promise<T> => {
  await expect
    .poll(async () => (await CallbackTestHelper.getClientResults(page, key)).length)
    .toBeGreaterThan(0);

  const [result] = await CallbackTestHelper.getClientResults<T>(page, key);

  return result;
};

test.describe('Offset: Api callbacks', () => {
  [
    0,
    -700,
    700,
  ].forEach((offset) => {
    const arg: WidgetArg = { offset, title: APPOINTMENT_TITLE };

    test(`onAppointmentRendered (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentRendered,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentRendered: ({
          appointmentData, targetedAppointmentData,
        }: AppointmentRenderedEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentRendered', { appointmentData, targetedAppointmentData });
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      await expect(scheduler.getAppointment(APPOINTMENT_TITLE).element).toBeAttached();

      const { appointmentData, targetedAppointmentData } = await getFirstClientResult<any>(
        page,
        API_CALLBACKS.appointmentRendered,
      );

      expect(appointmentData).toEqual(EXPECTED.appointmentData);
      expect(targetedAppointmentData).toEqual(EXPECTED.targetedAppointmentData);
    });

    test(`onAppointmentAdding and onAppointmentAdded (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentAdding,
        API_CALLBACKS.appointmentAdded,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentAdding: ({ appointmentData }: AppointmentAddingEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentAdding', appointmentData);
        },
        onAppointmentAdded: ({ appointmentData }: AppointmentAddedEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentAdded', appointmentData);
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const cell = scheduler.getDateTableCell(1, 2);

      const expectedAppointmentData = {
        allDay: false,
        startDate: getCellDateWithOffset('2023-09-05T01:00:00Z', offset),
        endDate: getCellDateWithOffset('2023-09-05T02:00:00Z', offset),
        text: '',
        recurrenceRule: '',
      };

      await cell.dblclick();
      await scheduler.appointmentPopup.saveButton.element.click();

      const appointmentAddingData = await getFirstClientResult(
        page,
        API_CALLBACKS.appointmentAdding,
      );
      const appointmentAddedData = await getFirstClientResult(
        page,
        API_CALLBACKS.appointmentAdded,
      );

      expect(appointmentAddingData).toEqual(expectedAppointmentData);
      expect(appointmentAddedData).toEqual(expectedAppointmentData);
    });

    test(`onAppointmentClick and onAppointmentDbClick (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentClick,
        API_CALLBACKS.appointmentDblClick,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentClick: ({
          appointmentData, targetedAppointmentData,
        }: AppointmentClickEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentClick', { appointmentData, targetedAppointmentData });
        },
        onAppointmentDblClick: ({
          appointmentData, targetedAppointmentData,
        }: AppointmentDblClickEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentDblClick', { appointmentData, targetedAppointmentData });
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

      await appointment.element.click();
      await appointment.element.dblclick();

      const {
        appointmentData: appointmentClickData,
        targetedAppointmentData: targetedAppointmentClickData,
      } = await getFirstClientResult<any>(page, API_CALLBACKS.appointmentClick);
      const {
        appointmentData: appointmentDbClickData,
        targetedAppointmentData: targetedAppointmentDbClickData,
      } = await getFirstClientResult<any>(page, API_CALLBACKS.appointmentDblClick);

      expect(appointmentClickData).toEqual(EXPECTED.appointmentData);
      expect(targetedAppointmentClickData).toEqual(EXPECTED.targetedAppointmentData);
      expect(appointmentDbClickData).toEqual(EXPECTED.appointmentData);
      expect(targetedAppointmentDbClickData).toEqual(EXPECTED.targetedAppointmentData);
    });

    test(`onAppointmentTooltipShowing and onAppointmentFormOpening (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentTooltipShowing,
        API_CALLBACKS.appointmentFormOpening,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentTooltipShowing: ({ appointments }: AppointmentTooltipShowingEvent) => {
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
        onAppointmentFormOpening: ({ appointmentData }: AppointmentFormOpeningEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentFormOpening', appointmentData);
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

      await appointment.element.click();
      // NOTE: Tooltip has a delay, so we should wait until it appears here :)
      await expect(scheduler.appointmentTooltip.wrapper).toBeAttached();
      await appointment.element.dblclick();

      const [{
        appointmentData: appointmentTooltipData,
        currentAppointmentData: currentAppointmentTooltipData,
      }] = await getFirstClientResult<any[]>(page, API_CALLBACKS.appointmentTooltipShowing);
      const appointmentFormData = await getFirstClientResult(
        page,
        API_CALLBACKS.appointmentFormOpening,
      );

      expect(appointmentTooltipData).toEqual(EXPECTED.appointmentData);
      expect(currentAppointmentTooltipData).toEqual(EXPECTED.targetedAppointmentData);
      expect(appointmentFormData).toEqual(EXPECTED.appointmentData);
    });

    // NOTE: onAppointmentDeleting event has a targetedAppointmentData field.
    // We don't have this event field in docs, so this test case doesn't check it.
    // Link to the docs: https://js.devexpress.com/jQuery/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting
    test(`onAppointmentDeleting and onAppointmentDeleted (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentDeleting,
        API_CALLBACKS.appointmentDeleted,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentDeleting: ({ appointmentData }: AppointmentDeletingEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentDeleting', appointmentData);
        },
        onAppointmentDeleted: ({ appointmentData }: AppointmentDeletedEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentDeleted', appointmentData);
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

      await appointment.element.click();
      // NOTE: Tooltip has a delay, so we should wait until it appears here :)
      await expect(scheduler.appointmentTooltip.wrapper).toBeAttached();
      await scheduler.appointmentTooltip.deleteButton.click();

      const appointmentDeletingData = await getFirstClientResult(
        page,
        API_CALLBACKS.appointmentDeleting,
      );
      const appointmentDeletedData = await getFirstClientResult(
        page,
        API_CALLBACKS.appointmentDeleted,
      );

      expect(appointmentDeletingData).toEqual(EXPECTED.appointmentData);
      expect(appointmentDeletedData).toEqual(EXPECTED.appointmentData);
    });

    test(`onAppointmentUpdating and onAppointmentUpdated (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentUpdating,
        API_CALLBACKS.appointmentUpdated,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentUpdating: ({ newData, oldData }: AppointmentUpdatingEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentUpdating', { newData, oldData });
        },
        onAppointmentUpdated: ({ appointmentData }: AppointmentUpdatedEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentUpdated', appointmentData);
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

      const expectedOldData = {
        startDate: '2023-09-06T12:30:00',
        endDate: '2023-09-06T13:00:00',
        text: APPOINTMENT_TITLE,
      };
      const expectedNewData = getAppointmentAfterUpdate(offset);

      await dragToOffset(page, appointment.element, -100, 0);

      const { newData, oldData } = await getFirstClientResult<any>(
        page,
        API_CALLBACKS.appointmentUpdating,
      );
      const appointmentData = await getFirstClientResult(
        page,
        API_CALLBACKS.appointmentUpdated,
      );

      expect(newData).toEqual(expectedNewData);
      expect(oldData).toEqual(expectedOldData);
      expect(appointmentData).toEqual(expectedNewData);
    });

    test(`onAppointmentContextMenu (offset: ${offset})`, async ({ page }) => {
      await CallbackTestHelper.initClientTesting(page, [
        API_CALLBACKS.appointmentContextMenu,
      ]);
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', ({ offset: widgetOffset, title }: WidgetArg) => ({
        currentDate: '2023-09-05',
        height: 800,
        dataSource: [
          {
            startDate: '2023-09-06T12:30:00',
            endDate: '2023-09-06T13:00:00',
            text: title,
          },
        ],
        currentView: 'week',
        cellDuration: 60,
        offset: widgetOffset,
        onAppointmentContextMenu: ({
          appointmentData, targetedAppointmentData,
        }: AppointmentContextMenuEvent) => {
          (window as WindowCallbackExtended)
            .clientTesting!
            .addCallbackResult('onAppointmentContextMenu', { appointmentData, targetedAppointmentData });
        },
      }), SCHEDULER_SELECTOR, { arg });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

      await appointment.element.click({ button: 'right' });

      const { appointmentData, targetedAppointmentData } = await getFirstClientResult<any>(
        page,
        API_CALLBACKS.appointmentContextMenu,
      );

      expect(appointmentData).toEqual(EXPECTED.appointmentData);
      expect(targetedAppointmentData).toEqual(EXPECTED.targetedAppointmentData);
    });
  });
});
