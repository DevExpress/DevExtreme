import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Appointment tooltip behavior', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    fx.off = false;
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('Deleting appointments', () => {
    it('should delete appointment by Delete key when focused in tooltip from collector', async () => {
      const data = [
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
      ];

      const { scheduler, POM } = await createScheduler({
        dataSource: [...data],
        views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
        height: 600,
      });

      POM.getCollectorButton().click();

      const tooltipScrollableContent = POM.tooltip.getScrollableContent();
      tooltipScrollableContent?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      tooltipScrollableContent?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

      expect(POM.tooltip.isVisible()).toBe(false);
      expect((scheduler as any).getDataSource().items()).toEqual([data[0]]);
    });

    it('should delete appointment on delete button click in tooltip', async () => {
      const data = [
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
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: data,
        views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
        height: 600,
      });

      POM.getCollectorButton().click();
      POM.tooltip.getDeleteButton().click();

      expect(POM.tooltip.isVisible()).toBe(false);
      expect((scheduler as any).getDataSource().items()).toEqual([data[0]]);
    });

    it('should not delete appointment by Delete key when editing.allowDeleting=false', async () => {
      const data = [
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
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: [...data],
        views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
        height: 600,
        editing: {
          allowDeleting: false,
        },
      });

      POM.getCollectorButton().click();

      const tooltipScrollableContent = POM.tooltip.getScrollableContent();
      tooltipScrollableContent?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      tooltipScrollableContent?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

      expect((scheduler as any).getDataSource().items()).toEqual([...data]);
    });

    it('should not delete disabled appointment by Delete key when focused in tooltip from collector', async () => {
      const data = [
        {
          text: 'Apt1',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
        },
        {
          text: 'Apt2',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
          disabled: true,
        },
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: [...data],
        views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
        height: 600,
      });

      POM.getCollectorButton().click();

      const tooltipScrollableContent = POM.tooltip.getScrollableContent();
      tooltipScrollableContent?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      tooltipScrollableContent?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

      expect((scheduler as any).getDataSource().items()).toEqual([...data]);
    });

    it('should delete single occurrence on delete button click and clicking \'Delete appointment\'', async () => {
      const data = [
        {
          text: 'Apt1',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
        },
        {
          text: 'Apt2',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
          recurrenceRule: 'FREQ=DAILY',
        },
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: [{ ...data[0] }, { ...data[1] }],
        views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
        editing: true,
        height: 600,
      });

      POM.getCollectorButton().click();
      POM.tooltip.getDeleteButton(0).click();
      POM.popup.deleteAppointmentButton.click();

      expect((scheduler as any).getDataSource().items()).toEqual([
        data[0],
        {
          ...data[1],
          recurrenceException: '20170522T013000Z',
        },
      ]);
    });

    it('should delete all occurrences on delete and clicking \'Delete series\'', async () => {
      const data = [
        {
          text: 'Apt1',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
        },
        {
          text: 'Apt2',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
          recurrenceRule: 'FREQ=DAILY',
        },
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: [{ ...data[0] }, { ...data[1] }],
        views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
        editing: true,
        height: 600,
      });

      POM.getCollectorButton().click();
      POM.tooltip.getDeleteButton(0).click();
      POM.popup.deleteSeriesButton.click();

      expect((scheduler as any).getDataSource().items()).toEqual([data[0]]);
    });
  });
});
