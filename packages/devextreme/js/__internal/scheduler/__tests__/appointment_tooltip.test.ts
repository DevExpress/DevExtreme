import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';

import type Scheduler from '../m_scheduler';
import { createScheduler as baseCreateScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';
import type { SchedulerModel } from './__mock__/model/scheduler';

const getDataSource = (): object[] => [
  {
    text: 'Apt1',
    startDate: new Date(2017, 4, 21, 9, 30),
    endDate: new Date(2017, 4, 21, 10, 30),
  },
  {
    text: 'Inside Collector Apt1',
    startDate: new Date(2017, 4, 21, 9, 30),
    endDate: new Date(2017, 4, 21, 10, 30),
  },
  {
    text: 'Inside Collector Apt2',
    startDate: new Date(2017, 4, 21, 9, 30),
    endDate: new Date(2017, 4, 21, 10, 30),
  },
  {
    text: 'Inside Collector Recurring Apt3',
    startDate: new Date(2017, 4, 21, 9, 30),
    endDate: new Date(2017, 4, 21, 10, 30),
    recurrenceRule: 'FREQ=YEARLY',
  },
  {
    text: 'Inside Collector Apt4',
    startDate: new Date(2017, 4, 21, 9, 30),
    endDate: new Date(2017, 4, 21, 10, 30),
  },
  {
    text: 'Recurring Apt2',
    startDate: new Date(2017, 4, 23, 9, 30),
    endDate: new Date(2017, 4, 23, 10, 30),
    recurrenceRule: 'FREQ=YEARLY',
  },
];

const pressDeleteKeyOnTooltipItem = (POM: SchedulerModel, itemIndex: number): void => {
  const scrollableContent = POM.tooltip.getScrollableContent();

  scrollableContent?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

  for (let i = 0; i < itemIndex; i += 1) {
    scrollableContent?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
  }

  scrollableContent?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
};

describe.each([
  'desktop',
  'mobile',
])('Appointment tooltip %s', (platform) => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({
      classRects: {
        // Note: set sizes, so navigation in tooltip list would work
        'dx-list-item': { width: 100, height: 50 },
      },
    });
  });

  afterEach(() => {
    fx.off = false;
    jest.useRealTimers();
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
  });

  const createScheduler = (config: any): Promise<{
    container: HTMLDivElement;
    scheduler: Scheduler;
    POM: SchedulerModel;
    keydown: (element: Element, key: string) => void;
  }> => baseCreateScheduler({
    adaptivityEnabled: platform === 'mobile',
    views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
    currentView: 'month',
    currentDate: new Date(2017, 4, 1),
    editing: true,
    height: 600,
    width: 1000,
    ...config,
  });

  describe('Delete button', () => {
    it('delete button in tooltip should not be focusable using tab', async () => {
      const { POM } = await createScheduler({
        dataSource: [
          {
            text: 'Apt1',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 10, 30),
          },
          {
            text: 'Apt2',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 10, 30),
          },
        ],
      });

      POM.getCollectorButton().click();

      expect(POM.tooltip.getDeleteButton().getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Deleting appointments', () => {
    describe.each([
      'delete key',
      'click',
    ])('Try delete by %s', (method) => {
      it('should delete appointment', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        jest.useFakeTimers();
        POM.getAppointments()[0].element.click();
        jest.runAllTimers();

        if (method === 'delete key') {
          pressDeleteKeyOnTooltipItem(POM, 0);
        } else {
          POM.tooltip.getDeleteButton().click();
        }

        expect(POM.tooltip.isVisible()).toBe(false);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(1);
        expect(onAppointmentDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Apt1' }) }),
        );
      });

      it('should not delete appointment by Delete key when editing.allowDeleting=false', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          editing: { allowDeleting: false },
          onAppointmentDeleted,
        });

        jest.useFakeTimers();
        POM.getAppointments()[0].element.click();
        jest.runAllTimers();

        if (method === 'delete key') {
          pressDeleteKeyOnTooltipItem(POM, 0);
        } else {
          expect(POM.tooltip.getDeleteButtons().length).toBe(0);
        }

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(onAppointmentDeleted).not.toHaveBeenCalled();
      });

      it('should not delete disabled appointment', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: [{
            text: 'Apt1',
            startDate: new Date(2017, 4, 21, 9, 30),
            endDate: new Date(2017, 4, 21, 10, 30),
          }, {
            text: 'Apt2',
            startDate: new Date(2017, 4, 21, 9, 30),
            endDate: new Date(2017, 4, 21, 10, 30),
          }, {
            text: 'Apt3',
            startDate: new Date(2017, 4, 21, 9, 30),
            endDate: new Date(2017, 4, 21, 10, 30),
            disabled: true,
          }],
          onAppointmentDeleted,
        });

        POM.getCollectorButton().click();

        if (method === 'delete key') {
          pressDeleteKeyOnTooltipItem(POM, 1);
        } else {
          expect(POM.tooltip.getAppointmentItems().length).toBe(2);
          expect(POM.tooltip.getDeleteButtons().length).toBe(1);
        }

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(onAppointmentDeleted).not.toHaveBeenCalled();
      });
    });

    describe('Single appointment deleting', () => {
      it('should delete single occurrence on clicking \'Delete appointment\'', async () => {
        const onAppointmentDeleted = jest.fn();
        const onAppointmentUpdated = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
          onAppointmentUpdated,
        });

        jest.useFakeTimers();
        POM.getAppointment('Recurring Apt2').element?.click();
        jest.runAllTimers();

        POM.tooltip.getDeleteButton().click();
        POM.popup.deleteAppointmentButton.click();

        expect(POM.tooltip.isVisible()).toBe(false);
        expect(onAppointmentDeleted).not.toHaveBeenCalled();
        expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
        expect(onAppointmentUpdated).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Recurring Apt2' }) }),
        );
      });

      it('should delete all occurrences on clicking \'Delete series\'', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        jest.useFakeTimers();
        POM.getAppointment('Recurring Apt2').element?.click();
        jest.runAllTimers();

        POM.tooltip.getDeleteButton().click();
        POM.popup.deleteSeriesButton.click();

        expect(POM.tooltip.isVisible()).toBe(false);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(1);
        expect(onAppointmentDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Recurring Apt2' }) }),
        );
      });

      it('should delete appointment on delete button click', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        jest.useFakeTimers();
        POM.getAppointments()[0].element.click();
        jest.runAllTimers();

        POM.tooltip.getDeleteButton().click();

        expect(POM.tooltip.isVisible()).toBe(false);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(1);
        expect(onAppointmentDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Apt1' }) }),
        );
      });
    });

    describe('Deleting from collector tooltip', () => {
      it('should delete focused appointment by Delete key', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        POM.getCollectorButton().click();
        pressDeleteKeyOnTooltipItem(POM, 1);

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(1);
        expect(onAppointmentDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Apt2' }) }),
        );
      });

      it('should delete specific appointment by delete key', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        POM.getCollectorButton().click();
        pressDeleteKeyOnTooltipItem(POM, 1);

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(1);
        expect(onAppointmentDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Apt2' }) }),
        );
      });

      it('should delete single occurrence on clicking \'Delete appointment\'', async () => {
        const onAppointmentUpdated = jest.fn();
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
          onAppointmentUpdated,
        });

        POM.getCollectorButton().click();
        POM.tooltip.getDeleteButton(2).click();
        POM.popup.deleteAppointmentButton.click();

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(onAppointmentDeleted).not.toHaveBeenCalled();
        expect(onAppointmentUpdated).toHaveBeenCalledTimes(1);
        expect(onAppointmentUpdated).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Recurring Apt3' }) }),
        );
      });

      it('should not close tooltip if there are still appointments after deleting one of them', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        POM.getCollectorButton().click();
        POM.tooltip.getDeleteButton(0).click();

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(1);
        expect(onAppointmentDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Apt1' }) }),
        );
      });

      it('should close tooltip after deleting all appointments in the tooltip', async () => {
        const onAppointmentDeleted = jest.fn();

        const { POM } = await createScheduler({
          dataSource: getDataSource(),
          onAppointmentDeleted,
        });

        POM.getCollectorButton().click();
        POM.tooltip.getDeleteButton(3).click();
        POM.tooltip.getDeleteButton(2).click();
        POM.popup.deleteSeriesButton.click();
        POM.tooltip.getDeleteButton(1).click();
        POM.tooltip.getDeleteButton(0).click();

        expect(POM.tooltip.isVisible()).toBe(false);
        expect(onAppointmentDeleted).toHaveBeenCalledTimes(4);
        expect(onAppointmentDeleted).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Apt4' }) }),
        );
        expect(onAppointmentDeleted).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Recurring Apt3' }) }),
        );
        expect(onAppointmentDeleted).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Apt2' }) }),
        );
        expect(onAppointmentDeleted).toHaveBeenNthCalledWith(
          4,
          expect.objectContaining({ appointmentData: expect.objectContaining({ text: 'Inside Collector Apt1' }) }),
        );
      });

      it('should not close tooltip when there are several collectors', async () => {
        const { POM } = await createScheduler({
          dataSource: [{
            id: 1,
            text: 'A',
            startDate: new Date(2025, 0, 8),
            endDate: new Date(2025, 0, 11),
          }, {
            id: 2,
            text: 'B',
            startDate: new Date(2025, 0, 8),
            endDate: new Date(2025, 0, 11),
          }, {
            id: 3,
            text: 'C',
            startDate: new Date(2025, 0, 8),
            endDate: new Date(2025, 0, 10),
          }, {
            id: 4,
            text: 'D',
            startDate: new Date(2025, 0, 8),
            endDate: new Date(2025, 0, 9),
          }],
          views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
          currentView: 'month',
          currentDate: new Date(2025, 0, 8),
        });

        POM.getCollectorButton(0).click();

        pressDeleteKeyOnTooltipItem(POM, 0);

        expect(POM.tooltip.isVisible()).toBe(true);
      });
    });
  });

  describe('State', () => {
    if (platform === 'desktop') {
      it('should have correct target after appointment was added before the current target', async () => {
        const { scheduler, POM } = await createScheduler({
          dataSource: getDataSource(),
        });

        POM.getCollectorButton().click();

        const initialTarget = POM.tooltip.target;

        scheduler.addAppointment({
          text: 'New Apt',
          startDate: new Date(2017, 4, 20, 9, 30),
          endDate: new Date(2017, 4, 20, 10, 30),
        });

        await new Promise(process.nextTick);

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(POM.tooltip.target).toBe(initialTarget);
      });

      it('should have correct target after appointment was deleted from tooltip', async () => {
        const { POM } = await createScheduler({
          dataSource: getDataSource(),
        });

        POM.getCollectorButton().click();
        pressDeleteKeyOnTooltipItem(POM, 0);

        expect(POM.tooltip.isVisible()).toBe(true);
        expect(POM.tooltip.target).toBe(POM.getCollectorButton());
      });
    }

    it('should rerender tooltip appointments when deleting appointment from tooltip', async () => {
      const { POM } = await createScheduler({
        dataSource: getDataSource(),
      });

      POM.getCollectorButton().click();

      const item1 = POM.tooltip.getAppointmentItem(1);
      const item2 = POM.tooltip.getAppointmentItem(2);
      const item3 = POM.tooltip.getAppointmentItem(3);

      pressDeleteKeyOnTooltipItem(POM, 0);

      expect(POM.tooltip.isVisible()).toBe(true);
      expect(POM.tooltip.getAppointmentItem(0)).not.toBe(item1);
      expect(POM.tooltip.getAppointmentItem(1)).not.toBe(item2);
      expect(POM.tooltip.getAppointmentItem(2)).not.toBe(item3);
    });
  });
});
