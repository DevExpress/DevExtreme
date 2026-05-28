import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/scheduler';
import eventsEngine from '@ts/events/core/m_events_engine';

import { createScheduler as baseCreateScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';
import type { SchedulerModel } from './__mock__/model/scheduler';

const createScheduler = (config: Properties) => baseCreateScheduler({
  ...config,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _newAppointments: true,
});

const getDraggableRoot = (POM: SchedulerModel, target: Element): Element => {
  const isInWorkspace = target.classList.contains('dx-scheduler-appointment');

  return isInWorkspace
    ? POM.getWorkspace()
    : POM.tooltip.getList();
};

const dragStart = (POM: SchedulerModel, target: Element): void => {
  eventsEngine.trigger(
    getDraggableRoot(POM, target),
    { type: 'dxdragstart', target },
  );
};

const dragMove = (POM: SchedulerModel, target: Element, toElement?: Element): void => {
  document.elementsFromPoint = jest.fn((): Element[] => (
    toElement ? [toElement] : [document.body]
  ));
  eventsEngine.trigger(
    getDraggableRoot(POM, target),
    { type: 'dxdrag', offset: { x: 0, y: 0 } },
  );
};

const dragEnd = (POM: SchedulerModel, target: Element): void => {
  eventsEngine.trigger(
    getDraggableRoot(POM, target),
    { type: 'dxdragend' },
  );
};

describe('Appointments Dragging', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();

    // Note: used by dragController
    document.elementsFromPoint = jest.fn(() => []);
    fx.off = true;
  });

  afterEach(() => {
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    jest.useRealTimers();
    fx.off = false;
  });

  describe('Drag clone', () => {
    it('should clone appointment on drag start', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0].element;
      dragStart(POM, appointment);

      const dragClone = POM.getDraggedAppointment();
      expect(dragClone).not.toBeNull();
      expect(dragClone?.getText()).toBe('Appointment 1');
      expect(dragClone?.isDragSource()).toBe(false);
    });

    it('should create appointment drag clone on tooltip item drag', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Apt1', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt2', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt3', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
        ],
        views: [{ type: 'day', maxAppointmentsPerCell: 1 }],
        currentView: 'day',
        currentDate: new Date(2017, 4, 22),
        editing: true,
      });

      POM.getCollectorButton().click();

      const tooltipItem = POM.tooltip.getAppointmentItem(0);
      dragStart(POM, tooltipItem);

      const dragClone = POM.getDraggedAppointment();

      expect(dragClone).not.toBeNull();
      expect(dragClone?.getText()).toBe('Apt2');
    });
  });

  describe('Cell highlighting', () => {
    it('should highlight cell on drag move', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);
      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);

      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(true);
    });

    it('should remove highlight on drag move if there is no cell', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);

      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(true);

      dragMove(POM, appointment);
      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(false);
    });

    it('should remove highlight on drag end', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);

      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(true);

      dragEnd(POM, appointment);
      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(false);
    });

    it('should highlight only one cell at a time', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0].element;
      const firstCell = POM.getDateTableCell(4, 0);
      const secondCell = POM.getDateTableCell(6, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, firstCell);

      expect(firstCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(true);

      dragMove(POM, appointment, secondCell);

      expect(firstCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(false);
      expect(secondCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(true);
    });
  });

  describe('Cancellation', () => {
    it('should cancel dragging on esc key press', async () => {
      const { POM, keydown } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);

      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(true);

      keydown(POM.getWorkspace(), 'Escape');

      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(false);
      expect(POM.getDraggedAppointment()).toBeNull();
    });
  });

  describe('Hiding tooltip', () => {
    it('should hide tooltip on drag start', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Apt1', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt2', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt3', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
        ],
        views: [{ type: 'day', maxAppointmentsPerCell: 1 }],
        currentView: 'day',
        currentDate: new Date(2017, 4, 22),
        editing: true,
      });

      POM.getCollectorButton().click();
      expect(POM.tooltip.isVisible()).toBe(true);

      const appointment = POM.getAppointments()[0].element;
      dragStart(POM, appointment);

      expect(POM.tooltip.isVisible()).toBe(false);
    });

    it('should hide tooltip on tooltip item drag start', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Apt1', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt2', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt3', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
        ],
        views: [{ type: 'day', maxAppointmentsPerCell: 1 }],
        currentView: 'day',
        currentDate: new Date(2017, 4, 22),
        editing: true,
      });

      POM.getCollectorButton().click();
      expect(POM.tooltip.isVisible()).toBe(true);

      const tooltipItem = POM.tooltip.getAppointmentItem(0);
      dragStart(POM, tooltipItem);

      expect(POM.tooltip.isVisible()).toBe(false);
    });
  });

  describe('Source appointment classes', () => {
    it('should add class to source appointment', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0];
      dragStart(POM, appointment.element);

      expect(appointment.isDragSource()).toBe(true);
    });

    it('should remove class from source appointment on drag end', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0];

      dragStart(POM, appointment.element);
      expect(appointment.isDragSource()).toBe(true);

      dragEnd(POM, appointment.element);
      expect(appointment.isDragSource()).toBe(false);
    });

    it('should remove class from source appointment on drag cancel', async () => {
      const { POM, keydown } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
      });

      const appointment = POM.getAppointments()[0];

      dragStart(POM, appointment.element);
      expect(appointment.isDragSource()).toBe(true);

      keydown(POM.getWorkspace(), 'Escape');
      expect(appointment.isDragSource()).toBe(false);
    });

    it('should remove drag-source class when async appointment update completed', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating: (e) => {
          e.cancel = new Promise((resolve) => {
            setTimeout(() => resolve(false), 3000);
          });
        },
      });

      jest.useFakeTimers();

      const appointment = POM.getAppointments()[0];
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment.element);
      dragMove(POM, appointment.element, targetCell);
      dragEnd(POM, appointment.element);

      expect(appointment.isDragSource()).toBe(true);

      await jest.advanceTimersByTimeAsync(3000);

      expect(appointment.isDragSource()).toBe(false);
    });

    it('should remove drag-source class when changing recurring appointment was cancelled', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
          recurrenceRule: 'FREQ=DAILY;COUNT=5',
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating: (e) => {
          e.cancel = new Promise((resolve) => {
            setTimeout(() => resolve(false), 3000);
          });
        },
      });

      const appointment = POM.getAppointments()[0];

      dragStart(POM, appointment.element);
      dragMove(POM, appointment.element, POM.getDateTableCell(4, 0));
      dragEnd(POM, appointment.element);

      expect(POM.isPopupVisible()).toBe(true);
      expect(appointment.isDragSource()).toBe(true);

      POM.popup.closeButton.click();
      await new Promise(process.nextTick);

      expect(POM.isPopupVisible()).toBe(false);
      expect(appointment.isDragSource()).toBe(false);
    });
  });

  describe('Allow dragging', () => {
    it.each([
      true,
      { allowUpdating: true, allowDragging: true },
    ])('should drag appointment if editing is %j', async (editing) => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing,
      });

      const appointment = POM.getAppointments()[0].element;
      dragStart(POM, appointment);

      expect(POM.getDraggedAppointment()).not.toBeNull();
    });

    it.each([
      false,
      { allowUpdating: false, allowDragging: true },
      { allowUpdating: true, allowDragging: false },
    ])('should not drag appointment if editing is %j', async (editing) => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing,
      });

      const appointment = POM.getAppointments()[0].element;
      dragStart(POM, appointment);

      expect(POM.getDraggedAppointment()).toBeNull();
    });

    it('should not drag appointment if it is still updating', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating: (e) => {
          e.cancel = new Promise(() => {});
        },
      });

      const appointment = POM.getAppointments()[0];
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment.element);
      dragMove(POM, appointment.element, targetCell);
      dragEnd(POM, appointment.element);

      dragStart(POM, appointment.element);

      expect(POM.getDraggedAppointment()).toBeNull();
      expect(appointment.isDragSource()).toBe(true);
      expect(targetCell.classList.contains('dx-scheduler-date-table-droppable-cell')).toBe(false);
    });

    it('should allow dragging if another appointment is still updating', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
          },
          {
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 9, 10),
            endDate: new Date(2015, 1, 9, 11),
          },
        ],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating: (e) => {
          e.cancel = new Promise(() => {});
        },
      });

      const firstAppointment = POM.getAppointments()[0];
      const secondAppointment = POM.getAppointments()[1];
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, firstAppointment.element);
      dragMove(POM, firstAppointment.element, targetCell);
      dragEnd(POM, firstAppointment.element);

      dragStart(POM, secondAppointment.element);

      expect(POM.getDraggedAppointment()?.getText()).toContain('Appointment 2');
      expect(secondAppointment.isDragSource()).toBe(true);
    });
  });

  describe('Saving appointment on drop', () => {
    it('should update appointment on drop', async () => {
      const onAppointmentUpdating = jest.fn();
      const onAppointmentUpdated = jest.fn();

      const appointmentData = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { POM } = await createScheduler({
        dataSource: [{ ...appointmentData }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating,
        onAppointmentUpdated,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);
      dragEnd(POM, appointment);

      const expectedNewData = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 2),
        endDate: new Date(2015, 1, 9, 3),
      };

      expect(onAppointmentUpdating).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdating).toHaveBeenCalledWith(
        expect.objectContaining({
          oldData: expect.objectContaining(appointmentData),
          newData: expect.objectContaining(expectedNewData),
        }),
      );

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: expect.objectContaining(expectedNewData),
        }),
      );
    });

    it('should not update appointment if it was dropped in the same cell', async () => {
      const onAppointmentUpdating = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating,
      });

      const appointment = POM.getAppointments()[0].element;
      const sameCell = POM.getDateTableCell(16, 0);

      document.elementsFromPoint = jest.fn(() => [sameCell]);
      dragStart(POM, appointment);
      dragMove(POM, appointment, sameCell);
      dragEnd(POM, appointment);

      expect(onAppointmentUpdating).not.toHaveBeenCalled();
    });

    it('should not update if dropped outside the scheduler', async () => {
      const onAppointmentUpdating = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating,
      });

      const appointment = POM.getAppointments()[0];
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment.element);
      dragMove(POM, appointment.element, targetCell);
      dragMove(POM, appointment.element);
      dragEnd(POM, appointment.element);

      expect(onAppointmentUpdating).not.toHaveBeenCalled();
      expect(appointment.isDragSource()).toBe(false);
    });

    it('should update appointment dragged from tooltip', async () => {
      const onAppointmentUpdating = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Apt1', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt2', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
          { text: 'Apt3', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 10, 30) },
        ],
        views: [{ type: 'day', maxAppointmentsPerCell: 1 }],
        currentView: 'day',
        currentDate: new Date(2017, 4, 22),
        editing: true,
        onAppointmentUpdating,
      });

      POM.getCollectorButton().click();

      const tooltipItem = POM.tooltip.getAppointmentItem(0);
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, tooltipItem);
      dragMove(POM, tooltipItem, targetCell);
      dragEnd(POM, tooltipItem);

      expect(onAppointmentUpdating).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdating).toHaveBeenCalledWith(
        expect.objectContaining({
          oldData: expect.objectContaining({ text: 'Apt2' }),
          newData: expect.objectContaining({
            startDate: new Date(2017, 4, 22, 2),
            endDate: new Date(2017, 4, 22, 3),
          }),
        }),
      );
    });

    it('should update appointment dragged from single appointment tooltip', async () => {
      const onAppointmentUpdating = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating,
      });

      jest.useFakeTimers();
      POM.getAppointments()[0].element.click();
      jest.runAllTimers();
      jest.useRealTimers();

      expect(POM.tooltip.isVisible()).toBe(true);

      const tooltipItem = POM.tooltip.getAppointmentItem(0);
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, tooltipItem);
      dragMove(POM, tooltipItem, targetCell);
      dragEnd(POM, tooltipItem);

      expect(onAppointmentUpdating).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdating).toHaveBeenCalledWith(
        expect.objectContaining({
          oldData: expect.objectContaining({ text: 'Appointment 1' }),
          newData: expect.objectContaining({
            startDate: new Date(2015, 1, 9, 2),
            endDate: new Date(2015, 1, 9, 3),
          }),
        }),
      );
    });

    it('should correctly update appointment when dragged to all day panel', async () => {
      const onAppointmentUpdated = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        showAllDayPanel: true,
        allDayPanelMode: 'allDay',
        onAppointmentUpdated,
      });

      const appointment = POM.getAppointments()[0].element;
      const allDayCell = POM.getAllDayTableCell(0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, allDayCell);
      dragEnd(POM, appointment);

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 1',
            allDay: true,
          }),
        }),
      );
    });

    it('should correctly update appointment when dragged from all day panel', async () => {
      const onAppointmentUpdated = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [{
          text: 'All Day Appointment',
          startDate: new Date(2015, 1, 9),
          endDate: new Date(2015, 1, 9),
          allDay: true,
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        showAllDayPanel: true,
        allDayPanelMode: 'allDay',
        onAppointmentUpdated,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);
      dragEnd(POM, appointment);

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'All Day Appointment',
            startDate: new Date(2015, 1, 9, 2),
            endDate: new Date(2015, 1, 9, 2, 30),
            allDay: false,
          }),
        }),
      );
    });

    it('should correctly update appointments if allowUpdating is async', async () => {
      const onAppointmentUpdating = jest.fn((e) => {
        (e as any).cancel = new Promise((resolve) => {
          setTimeout(() => resolve(false), 3000);
        });
      });
      const onAppointmentUpdated = jest.fn();

      const appointmentData1 = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };
      const appointmentData2 = {
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 9, 10),
        endDate: new Date(2015, 1, 9, 11),
      };

      const { POM } = await createScheduler({
        dataSource: [{ ...appointmentData1 }, { ...appointmentData2 }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdating,
        onAppointmentUpdated,
      });

      jest.useFakeTimers();

      const firstAppointment = POM.getAppointments()[0].element;
      const targetCell1 = POM.getDateTableCell(4, 0);

      dragStart(POM, firstAppointment);
      dragMove(POM, firstAppointment, targetCell1);
      dragEnd(POM, firstAppointment);

      await jest.advanceTimersByTimeAsync(1000);

      const secondAppointment = POM.getAppointments()[1].element;
      const targetCell2 = POM.getDateTableCell(6, 0);

      dragStart(POM, secondAppointment);
      dragMove(POM, secondAppointment, targetCell2);
      dragEnd(POM, secondAppointment);

      await jest.runAllTimersAsync();

      expect(onAppointmentUpdating).toHaveBeenCalledTimes(2);
      expect(onAppointmentUpdated).toHaveBeenCalledTimes(2);
      expect(onAppointmentUpdated).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 2),
            endDate: new Date(2015, 1, 9, 3),
          }),
        }),
      );
      expect(onAppointmentUpdated).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 9, 3),
            endDate: new Date(2015, 1, 9, 4),
          }),
        }),
      );
    });

    it('should correctly update recurring appointment when editing a single occurrence', async () => {
      const onAppointmentUpdated = jest.fn();
      const onAppointmentAdded = jest.fn();

      const appointmentData = {
        text: 'Appointment 1',
        startDate: '2015-02-08T18:00:00.000Z',
        endDate: '2015-02-08T19:00:00.000Z',
        recurrenceRule: 'FREQ=DAILY;COUNT=5',
      };

      const { POM } = await createScheduler({
        dataSource: [{ ...appointmentData }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdated,
        onAppointmentAdded,
        timeZone: 'UTC',
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);
      dragEnd(POM, appointment);

      POM.popup.editAppointmentButton.click();
      await new Promise(process.nextTick);

      expect(onAppointmentAdded).toHaveBeenCalledTimes(1);
      const addedAppointmentData = (onAppointmentAdded.mock.calls[0][0] as any).appointmentData;
      expect(addedAppointmentData).toEqual({
        text: 'Appointment 1',
        startDate: '2015-02-09T02:00:00.000Z',
        endDate: '2015-02-09T03:00:00.000Z',
        allDay: false,
      });

      const addedAppointment = (onAppointmentAdded.mock.calls[0][0] as any).appointmentData;
      expect(addedAppointment.recurrenceRule).toBeUndefined();

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 1',
            startDate: '2015-02-08T18:00:00.000Z',
            endDate: '2015-02-08T19:00:00.000Z',
            recurrenceRule: 'FREQ=DAILY;COUNT=5',
            recurrenceException: '20150209T180000Z',
          }),
        }),
      );
    });

    it('should correctly update recurring appointment when editing the series', async () => {
      const onAppointmentUpdated = jest.fn();

      const appointmentData = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
        recurrenceRule: 'FREQ=DAILY;COUNT=5',
      };

      const { POM } = await createScheduler({
        dataSource: [{ ...appointmentData }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        editing: true,
        onAppointmentUpdated,
      });

      const appointment = POM.getAppointments()[0].element;
      const targetCell = POM.getDateTableCell(4, 0);

      dragStart(POM, appointment);
      dragMove(POM, appointment, targetCell);
      dragEnd(POM, appointment);

      POM.popup.editSeriesButton.click();
      await new Promise(process.nextTick);

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect(onAppointmentUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentData: expect.objectContaining({
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 2),
            endDate: new Date(2015, 1, 9, 3),
            recurrenceRule: 'FREQ=DAILY;COUNT=5',
          }),
        }),
      );
    });
  });
});
