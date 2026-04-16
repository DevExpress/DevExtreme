import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/scheduler';

import { createScheduler as baseCreateScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';
import type { SchedulerModel } from './__mock__/model/scheduler';

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
  });

  describe('Templates', () => {
    describe.each([
      'appointmentTemplate',
      'appointmentCollectorTemplate',
    ])('%s common', (templateName) => {
      const config = {
        dataSource: [
          { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        ],
        maxAppointmentsPerCell: 2,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      };

      const appointmentCollectorTemplate = (
        data: any,
        container: HTMLElement,
      ): dxElementWrapper => $(container).text('Custom collector');

      const appointmentTemplate = (
        data: any,
        index: number,
        container: HTMLElement,
      ): dxElementWrapper => $(container).text('Custom appointment');

      const templateFunction = templateName === 'appointmentCollectorTemplate'
        ? appointmentCollectorTemplate
        : appointmentTemplate;

      const isTemplateApplied = (POM: SchedulerModel): boolean => {
        if (templateName === 'appointmentCollectorTemplate') {
          return $(POM.getCollectorButton()).text() === 'Custom collector';
        }

        return $(POM.getAppointments()[0].element).text() === 'Custom appointment';
      };

      it('should render default template', async () => {
        const { POM } = await createScheduler(config);

        if (templateName === 'appointmentCollectorTemplate') {
          const collectorButton = POM.getCollectorButton();
          expect(collectorButton.textContent).toBe('1');
        } else {
          const appointment = POM.getAppointments()[0];
          expect(appointment.getText()).toBe('Appointment 1');
        }
      });

      it('should apply custom template', async () => {
        const { POM } = await createScheduler({
          ...config,
          [templateName]: templateFunction,
        });

        expect(isTemplateApplied(POM)).toBe(true);
      });

      it('should apply custom template after .option() change', async () => {
        const { POM, scheduler } = await createScheduler(config);

        scheduler.option(templateName, templateFunction);
        await new Promise(process.nextTick);

        expect(isTemplateApplied(POM)).toBe(true);
      });

      it('should apply default template if current view does not have it', async () => {
        const defaultTemplate = jest.fn();

        const { POM } = await createScheduler({
          ...config,
          views: [{ type: 'day' }],
          [templateName]: defaultTemplate,
        });

        expect(defaultTemplate).toHaveBeenCalled();
        expect(isTemplateApplied(POM)).toBe(false);
      });

      it('should apply default template after .option() change with default value', async () => {
        const defaultValue = templateName === 'appointmentCollectorTemplate'
          ? 'appointmentCollector'
          : 'appointment';

        const { POM, scheduler } = await createScheduler({
          ...config,
          [templateName]: templateFunction,
        });

        scheduler.option(templateName, defaultValue);
        await new Promise(process.nextTick);

        expect(isTemplateApplied(POM)).toBe(false);

        if (templateName === 'appointmentTemplate') {
          const appointment = POM.getAppointments()[0];
          expect(appointment.getText()).toBe('Appointment 1');
        } else {
          const collectorButton = POM.getCollectorButton();
          expect(collectorButton.textContent).toBe('1');
        }
      });

      it('should apply current view\'s template', async () => {
        const defaultTemplate = jest.fn();

        const { POM } = await createScheduler({
          ...config,
          views: [{
            type: 'day',
            [templateName]: templateFunction,
          }],
          [templateName]: defaultTemplate,
        });

        expect(defaultTemplate).not.toHaveBeenCalled();

        expect(isTemplateApplied(POM)).toBe(true);
      });

      it('should apply current view\'s template after .option() change', async () => {
        const { POM, scheduler } = await createScheduler({
          ...config,
          views: [{
            type: 'day',
            [templateName]: templateFunction,
          }],
        });

        const defaultTemplate = jest.fn();

        scheduler.option(templateName, defaultTemplate);
        await new Promise(process.nextTick);

        expect(defaultTemplate).not.toHaveBeenCalled();
        expect(isTemplateApplied(POM)).toBe(true);
      });

      it('should apply current view\'s template after current view was changed', async () => {
        const defaultTemplate = jest.fn();

        const { POM, scheduler } = await createScheduler({
          ...config,
          views: [
            { type: 'workWeek', [templateName]: defaultTemplate },
            { type: 'day', [templateName]: templateFunction },
          ],
          currentView: 'workWeek',
        });

        defaultTemplate.mockClear();

        scheduler.option('currentView', 'day');
        await new Promise(process.nextTick);

        expect(defaultTemplate).not.toHaveBeenCalled();
        expect(isTemplateApplied(POM)).toBe(true);
      });
    });

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
            items: [
              expect.objectContaining({
                text: 'Appointment 3',
              }),
            ],
          }),
          expect.any(HTMLElement),
        ]);

        const container = appointmentCollectorTemplate.mock.calls[0][1] as HTMLElement;
        expect(container.classList.contains('dx-button-content')).toBe(true);
      });
    });
  });

  describe('onAppointmentRendered', () => {
    it('should call onAppointmentRendered callback', async () => {
      const onAppointmentRendered = jest.fn();

      await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentRendered,
      });

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
    });

    it('should call onAppointmentRendered after .option() change', async () => {
      const { scheduler } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      const onAppointmentRendered = jest.fn();
      scheduler.option('onAppointmentRendered', onAppointmentRendered);
      scheduler.repaint();
      await new Promise(process.nextTick);

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
    });
  });
});
