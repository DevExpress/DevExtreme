import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/scheduler';

import { createScheduler as baseCreateScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

const createScheduler = (config: Properties) => baseCreateScheduler({
  ...config,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _newAppointments: true,
});

describe('New Appointments', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  describe('Templates', () => {
    describe('AppointmentTemplate', () => {
      it('should call template function with correct parameters', async () => {
        const appointmentTemplate = jest.fn();

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

        await createScheduler({
          dataSource: [appointmentData1, appointmentData2],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          appointmentTemplate,
        });

        expect(appointmentTemplate).toHaveBeenCalledTimes(2);
        expect(appointmentTemplate.mock.calls[0]).toHaveLength(3);
        expect(appointmentTemplate.mock.calls[0]).toEqual([
          expect.objectContaining({
            appointmentData: appointmentData1,
            targetedAppointmentData: expect.objectContaining({
              ...appointmentData1,
              displayStartDate: appointmentData1.startDate,
              displayEndDate: appointmentData1.endDate,
            }),
          }),
          0,
          expect.any(HTMLElement),
        ]);

        const container1 = appointmentTemplate.mock.calls[0][2] as HTMLElement;
        expect(container1.classList.contains('dx-scheduler-appointment-content')).toBe(true);
        expect(container1.innerHTML).toBe('');

        expect(appointmentTemplate.mock.calls[1]).toHaveLength(3);
        expect(appointmentTemplate.mock.calls[1]).toEqual([
          expect.objectContaining({
            appointmentData: appointmentData2,
            targetedAppointmentData: expect.objectContaining({
              ...appointmentData2,
              displayStartDate: appointmentData2.startDate,
              displayEndDate: appointmentData2.endDate,
            }),
          }),
          1,
          expect.any(HTMLElement),
        ]);

        const container2 = appointmentTemplate.mock.calls[1][2] as HTMLElement;
        expect(container2.classList.contains('dx-scheduler-appointment-content')).toBe(true);
        expect(container2.innerHTML).toBe('');
      });

      it('should render appointment with custom template', async () => {
        const { POM } = await createScheduler({
          dataSource: [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            allDay: true,
          }],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          appointmentTemplate: (data, index, container) => {
            $(container).text(`${data.appointmentData.text} Template`);
          },
        });

        const $appointment = $(POM.getAppointments()[0].element);

        expect($appointment.text()).toBe('Appointment 1 Template');
      });

      it('should apply current view\'s appointmentTemplate', async () => {
        const defaultTemplate = jest.fn();
        const viewTemplate = jest.fn(
          (data: any, index: number, container: HTMLElement) => {
            $(container).text(`${data.appointmentData.text} ViewTemplate`);
          },
        );

        const appointmentData = {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        };

        const { POM } = await createScheduler({
          dataSource: [appointmentData],
          views: [{
            type: 'day',
            appointmentTemplate: viewTemplate,
          }],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          appointmentTemplate: defaultTemplate,
        });

        expect(viewTemplate).toHaveBeenCalledTimes(1);
        expect(defaultTemplate).not.toHaveBeenCalled();
        expect(viewTemplate.mock.calls[0]).toEqual([
          expect.objectContaining({
            appointmentData,
            targetedAppointmentData: expect.objectContaining({
              ...appointmentData,
              displayStartDate: appointmentData.startDate,
              displayEndDate: appointmentData.endDate,
            }),
          }),
          0,
          expect.any(HTMLElement),
        ]);

        const $appointment = $(POM.getAppointments()[0].element);
        expect($appointment.text()).toBe('Appointment 1 ViewTemplate');
      });

      it('should render async template', async () => {
        const appointmentTemplate = jest.fn(
          (data: any, index: number, container: HTMLElement) => new Promise((resolve) => {
            $(container).text(`${data.appointmentData.text} Async`);
            resolve(container);
          }),
        );

        const { POM } = await createScheduler({
          dataSource: [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
          }],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          appointmentTemplate,
        });

        await new Promise(process.nextTick);

        expect(appointmentTemplate).toHaveBeenCalledTimes(1);

        const $appointment = $(POM.getAppointments()[0].element);
        expect($appointment.text()).toBe('Appointment 1 Async');
      });
    });

    describe('AppointmentCollectorTemplate', () => {
      it('should call template function with correct parameters', async () => {
        const appointmentCollectorTemplate = jest.fn();

        await createScheduler({
          dataSource: [
            {
              text: 'Appointment 1',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 2',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 3',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
          ],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          maxAppointmentsPerCell: 2,
          appointmentCollectorTemplate,
        });

        expect(appointmentCollectorTemplate).toHaveBeenCalledTimes(1);
        expect(appointmentCollectorTemplate.mock.calls[0]).toHaveLength(2);
        expect(appointmentCollectorTemplate.mock.calls[0]).toEqual([
          expect.objectContaining({
            appointmentCount: 1,
            isCompact: true,
            items: expect.arrayContaining([
              expect.objectContaining({
                text: 'Appointment 3',
              }),
            ]),
          }),
          expect.any(HTMLElement),
        ]);

        const container = appointmentCollectorTemplate.mock.calls[0][1] as HTMLElement;
        expect(container.classList.contains('dx-button-content')).toBe(true);
      });

      it('should render appointment collector with custom template', async () => {
        const { POM } = await createScheduler({
          dataSource: [
            {
              text: 'Appointment 1',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 2',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 3',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
          ],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          maxAppointmentsPerCell: 2,
          appointmentCollectorTemplate: (data, container) => {
            $(container).text(`Custom +${data.appointmentCount} more`);
          },
        });

        const $collector = $(POM.getCollectorButton());

        expect($collector.text()).toBe('Custom +1 more');
      });

      it('should apply current view\'s appointmentCollectorTemplate', async () => {
        const defaultTemplate = jest.fn();
        const viewTemplate = jest.fn((data: any, container: HTMLElement) => {
          $(container).text(`View +${data.appointmentCount} more`);
        });

        const { POM } = await createScheduler({
          dataSource: [
            {
              text: 'Appointment 1',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 2',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 3',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
          ],
          views: [{
            type: 'day',
            appointmentCollectorTemplate: viewTemplate,
          }],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          maxAppointmentsPerCell: 2,
          appointmentCollectorTemplate: defaultTemplate,
        });

        expect(defaultTemplate).not.toHaveBeenCalled();
        expect(viewTemplate).toHaveBeenCalledTimes(1);
        expect(viewTemplate.mock.calls[0]).toEqual([
          expect.objectContaining({
            appointmentCount: 1,
            isCompact: true,
            items: expect.arrayContaining([
              expect.objectContaining({
                text: 'Appointment 3',
              }),
            ]),
          }),
          expect.any(HTMLElement),
        ]);

        const $collector = $(POM.getCollectorButton());
        expect($collector.text()).toBe('View +1 more');
      });

      it('should render async template', async () => {
        const appointmentCollectorTemplate = jest.fn(
          (data: any, container: HTMLElement) => new Promise((resolve) => {
            $(container).text(`Async +${data.appointmentCount} more`);
            resolve(container);
          }),
        );

        const { POM } = await createScheduler({
          dataSource: [
            {
              text: 'Appointment 1',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 2',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
            {
              text: 'Appointment 3',
              startDate: new Date(2015, 1, 9, 8),
              endDate: new Date(2015, 1, 9, 9),
            },
          ],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          maxAppointmentsPerCell: 2,
          appointmentCollectorTemplate,
        });

        await new Promise(process.nextTick);

        expect(appointmentCollectorTemplate).toHaveBeenCalledTimes(1);

        const $collector = $(POM.getCollectorButton());
        expect($collector.text()).toBe('Async +1 more');
      });
    });
  });
});
