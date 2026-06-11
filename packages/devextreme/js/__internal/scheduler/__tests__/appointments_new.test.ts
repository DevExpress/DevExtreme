import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/scheduler';
import { fireEvent } from '@testing-library/dom';

import { createScheduler as baseCreateScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';
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
    jest.useRealTimers();
  });

  describe('Options', () => {
    describe('tabIndex', () => {
      it('should have correct tabIndex on init', async () => {
        const { POM } = await createScheduler({
          dataSource: [
            { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
            { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          ],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          tabIndex: 2,
        });

        const firstAppointment = POM.getAppointments()[0];

        expect(firstAppointment.element.getAttribute('tabindex')).toBe('2');
      });

      it('should have correct tabIndex on option change', async () => {
        const { POM, scheduler } = await createScheduler({
          dataSource: [
            { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
            { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          ],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9, 8),
          tabIndex: 1,
        });

        scheduler.option('tabIndex', 2);

        const firstAppointment = POM.getAppointments()[0];

        expect(firstAppointment.element.getAttribute('tabindex')).toBe('2');
      });
    });
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
      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { POM, scheduler } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentRendered,
      });

      expect(onAppointmentRendered).toHaveBeenCalledTimes(1);
      const callArg = onAppointmentRendered.mock.calls[0][0] as any;
      expect(Object.keys(callArg).sort()).toEqual([
        'appointmentData', 'appointmentElement', 'component', 'element', 'targetedAppointmentData',
      ]);
      expect(callArg.component).toBe(scheduler);
      expect(callArg.element).toBe(scheduler.$element().get(0));
      expect(callArg.appointmentElement).toBe(POM.getAppointments()[0].element);
      expect(callArg.appointmentData).toEqual(appointment);
      expect(callArg.targetedAppointmentData).toEqual({
        ...appointment,
        displayStartDate: new Date(2015, 1, 9, 8),
        displayEndDate: new Date(2015, 1, 9, 9),
      });
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

  describe('onAppointmentClick', () => {
    it('should call onAppointmentClick callback', async () => {
      const onAppointmentClick = jest.fn();

      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { POM, scheduler } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentClick,
      });

      POM.getAppointments()[0].element.click();

      expect(onAppointmentClick).toHaveBeenCalledTimes(1);
      const callArg = onAppointmentClick.mock.calls[0][0] as any;
      expect(Object.keys(callArg).sort()).toEqual([
        'appointmentData', 'appointmentElement', 'component', 'element', 'event', 'targetedAppointmentData',
      ]);
      expect(callArg.component).toBe(scheduler);
      expect(callArg.element).toBe(scheduler.$element().get(0));
      expect(callArg.event.type).toBe('dxclick');
      expect(callArg.appointmentElement).toBe(POM.getAppointments()[0].element);
      expect(callArg.appointmentData).toEqual(appointment);
      expect(callArg.targetedAppointmentData).toEqual({
        ...appointment,
        displayStartDate: new Date(2015, 1, 9, 8),
        displayEndDate: new Date(2015, 1, 9, 9),
      });
    });

    it('should call onAppointmentClick after .option() change', async () => {
      const { POM, scheduler } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      const onAppointmentClick = jest.fn();
      scheduler.option('onAppointmentClick', onAppointmentClick);

      POM.getAppointments()[0].element.click();

      expect(onAppointmentClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onAppointmentClick on tooltip item inside single appointment', async () => {
      const onAppointmentClick = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentClick,
      });

      jest.useFakeTimers();
      POM.getAppointments()[0].element.click();
      jest.runAllTimers();

      onAppointmentClick.mockClear();
      POM.tooltip.getAppointmentItem(0).click();
      expect(onAppointmentClick).toHaveBeenCalledTimes(0);
    });

    it('should call onAppointmentClick on tooltip item click', async () => {
      const onAppointmentClick = jest.fn();

      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        ],
        maxAppointmentsPerCell: 1,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentClick,
      });

      POM.getCollectorButton().click();

      POM.tooltip.getAppointmentItem(0).click();

      expect(onAppointmentClick).toHaveBeenCalledTimes(1);
    });

    it('should call onAppointmentClick on tooltip item inside collector click after .option() change', async () => {
      const { POM, scheduler } = await createScheduler({
        dataSource: [
          { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        ],
        maxAppointmentsPerCell: 1,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      const onAppointmentClick = jest.fn();
      scheduler.option('onAppointmentClick', onAppointmentClick);

      jest.useFakeTimers();
      POM.getCollectorButton().click();
      jest.runAllTimers();

      POM.tooltip.getAppointmentItem(0).click();

      expect(onAppointmentClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAppointmentDblClick', () => {
    it('should call onAppointmentDblClick callback', async () => {
      const onAppointmentDblClick = jest.fn();

      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { scheduler, POM } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentDblClick,
      });

      POM.openPopupByDblClick('Appointment 1');

      expect(onAppointmentDblClick).toHaveBeenCalledTimes(1);
      const callArg = onAppointmentDblClick.mock.calls[0][0] as any;
      expect(Object.keys(callArg).sort()).toEqual([
        'appointmentData', 'appointmentElement', 'component', 'element', 'event', 'targetedAppointmentData',
      ]);
      expect(callArg.component).toBe(scheduler);
      expect(callArg.element).toBe(scheduler.$element().get(0));
      expect(callArg.event.type).toBe('dxdblclick');
      expect(callArg.appointmentElement).toBe(POM.getAppointments()[0].element);
      expect(callArg.appointmentData).toEqual(appointment);
      expect(callArg.targetedAppointmentData).toEqual({
        ...appointment,
        displayStartDate: new Date(2015, 1, 9, 8),
        displayEndDate: new Date(2015, 1, 9, 9),
      });
    });

    it('should call onAppointmentDblClick after .option() change', async () => {
      const { POM, scheduler } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      const onAppointmentDblClick = jest.fn();
      scheduler.option('onAppointmentDblClick', onAppointmentDblClick);

      POM.openPopupByDblClick('Appointment 1');

      expect(onAppointmentDblClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAppointmentContextMenu', () => {
    it('should call onAppointmentContextMenu callback', async () => {
      const onAppointmentContextMenu = jest.fn();

      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { scheduler, POM } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentContextMenu,
      });

      const appointmentElement = POM.getAppointments()[0].element;
      fireEvent(appointmentElement, new Event('dxcontextmenu', { bubbles: true }));

      expect(onAppointmentContextMenu).toHaveBeenCalledTimes(1);
      expect(onAppointmentContextMenu).toHaveBeenCalledWith({
        appointmentData: appointment,
        targetedAppointmentData: {
          ...appointment,
          displayStartDate: new Date(2015, 1, 9, 8),
          displayEndDate: new Date(2015, 1, 9, 9),
        },
        appointmentElement,
        component: scheduler,
        element: scheduler.$element().get(0),
        event: expect.objectContaining({ type: 'dxcontextmenu' }),
      });
    });

    it('should call onAppointmentContextMenu after .option() change', async () => {
      const { POM, scheduler } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      const onAppointmentContextMenu = jest.fn();
      scheduler.option('onAppointmentContextMenu', onAppointmentContextMenu);

      fireEvent(
        POM.getAppointments()[0].element,
        new Event('dxcontextmenu', { bubbles: true }),
      );

      expect(onAppointmentContextMenu).toHaveBeenCalledTimes(1);
    });

    it('should call onAppointmentContextMenu with correct targetedAppointmentData', async () => {
      const onAppointmentContextMenu = jest.fn();

      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
        recurrenceRule: 'FREQ=DAILY',
      };

      const { POM } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentContextMenu,
      });

      fireEvent(
        POM.getAppointments()[0].element,
        new Event('dxcontextmenu', { bubbles: true }),
      );

      expect(onAppointmentContextMenu).toHaveBeenCalledTimes(1);
      expect(onAppointmentContextMenu).toHaveBeenCalledWith(expect.objectContaining({
        targetedAppointmentData: {
          ...appointment,
          displayStartDate: new Date(2015, 1, 9, 8),
          displayEndDate: new Date(2015, 1, 9, 9),
        },
      }));
    });
  });

  describe('Tooltip', () => {
    it('should show tooltip on appointment click', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      jest.useFakeTimers();
      POM.getAppointments()[0].element.click();
      jest.runAllTimers();

      expect(POM.tooltip.isVisible()).toBe(true);
      expect(POM.tooltip.getAppointmentItems().length).toBe(1);
      expect(POM.tooltip.getAppointmentItem(0).textContent).toContain('Appointment 1');
    });

    it('should show tooltip on collector click', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        ],
        maxAppointmentsPerCell: 1,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      jest.useFakeTimers();
      POM.getCollectorButton().click();
      jest.runAllTimers();

      expect(POM.tooltip.isVisible()).toBe(true);
      expect(POM.tooltip.getAppointmentItems().length).toBe(2);
      expect(POM.tooltip.getAppointmentItem(0).textContent).toContain('Appointment 2');
      expect(POM.tooltip.getAppointmentItem(1).textContent).toContain('Appointment 3');
    });
  });

  describe('Appointment Popup', () => {
    it('should show appointment popup on appointment double click', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      POM.openPopupByDblClick('Appointment 1');

      expect(POM.tooltip.isVisible()).toBe(false);
      expect(POM.isPopupVisible()).toBe(true);
    });

    it('should show appointment popup on tooltip item click', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        ],
        maxAppointmentsPerCell: 2,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      jest.useFakeTimers();
      POM.getCollectorButton().click();
      jest.runAllTimers();

      POM.tooltip.getAppointmentItem(0).click();

      expect(POM.isPopupVisible()).toBe(true);
    });

    it('should show recurrence dialog on recurrence appointment double click', async () => {
      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
        recurrenceRule: 'FREQ=DAILY',
      };

      const { POM } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      POM.openPopupByDblClick('Appointment 1');

      expect(POM.isRecurrenceDialogVisible()).toBe(true);
    });

    it('should have correct data in appointment popup', async () => {
      const appointmentData = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { POM } = await createScheduler({
        dataSource: [appointmentData],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
      });

      POM.openPopupByDblClick('Appointment 1');

      expect(POM.isPopupVisible()).toBe(true);
      expect(POM.popup.getInputValue('subjectEditor')).toBe('Appointment 1');
    });

    it('should save new appointment data after saving changes', async () => {
      const onAppointmentUpdated = jest.fn();

      const appointment = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { POM } = await createScheduler({
        dataSource: [appointment],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentUpdated,
      });

      POM.openPopupByDblClick('Appointment 1');

      POM.popup.setInputValue('subjectEditor', 'Updated Appointment');
      POM.popup.saveButton.click();
      await new Promise(process.nextTick);

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect((onAppointmentUpdated.mock.calls[0][0] as any).appointmentData).toBe(appointment);
      expect(appointment.text).toBe('Updated Appointment');
    });

    it('should save appointment data after saving changes from tooltip', async () => {
      const onAppointmentUpdated = jest.fn();

      const appointment = {
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      };

      const { POM } = await createScheduler({
        dataSource: [
          { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
          appointment,
          { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        ],
        maxAppointmentsPerCell: 1,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        onAppointmentUpdated,
      });

      jest.useFakeTimers();
      POM.getCollectorButton().click();
      jest.runAllTimers();
      jest.useRealTimers();

      POM.tooltip.getAppointmentItem(0).click();
      POM.popup.setInputValue('subjectEditor', 'Updated Appointment');
      POM.popup.saveButton.click();
      await new Promise(process.nextTick);

      expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
      expect((onAppointmentUpdated.mock.calls[0][0] as any).appointmentData).toBe(appointment);
      expect(appointment.text).toBe('Updated Appointment');
    });
  });

  describe('Keyboard navigation', () => {
    it('should delete appointment by delete key', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentDate: new Date(2015, 1, 9, 8),
      });

      const appointment = POM.getAppointments()[0];
      appointment.element.focus();
      fireEvent.keyDown(appointment.element, { key: 'Delete' });
      await new Promise(process.nextTick);

      expect(POM.getAppointments().length).toBe(0);
    });

    it('should delete recurring appointment occurrence by delete key', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
          recurrenceRule: 'FREQ=DAILY;COUNT=3',
        }],
        currentDate: new Date(2015, 1, 9),
        currentView: 'week',
        recurrenceEditMode: 'occurrence',
      });

      expect(POM.getAppointments().length).toBe(3);

      const appointment = POM.getAppointments()[0];
      appointment.element.focus();
      fireEvent.keyDown(appointment.element, { key: 'Delete' });
      await new Promise(process.nextTick);

      expect(POM.getAppointments().length).toBe(2);
    });

    it.each([
      { editing: true },
      { editing: { allowDeleting: true } },
      { editing: { allowDeleting: true, allowUpdating: false } },
    ])('should delete appointment when editing=$editing', async ({ editing }) => {
      const { POM } = await createScheduler({
        dataSource: [{
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentDate: new Date(2015, 1, 9, 8),
        editing,
      });

      const appointment = POM.getAppointments()[0];
      appointment.element.focus();
      fireEvent.keyDown(appointment.element, { key: 'Delete' });
      await new Promise(process.nextTick);

      expect(POM.getAppointments().length).toBe(0);
    });

    it.each([
      { editing: { allowDeleting: false } },
      { editing: false },
    ])('should NOT delete appointment when editing=$editing', async ({ editing }) => {
      const { POM } = await createScheduler({
        dataSource: [{
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentDate: new Date(2015, 1, 9, 8),
        editing,
      });

      const appointment = POM.getAppointments()[0];
      appointment.element.focus();
      fireEvent.keyDown(appointment.element, { key: 'Delete' });
      await new Promise(process.nextTick);

      expect(POM.getAppointments().length).toBe(1);
    });
  });
});
