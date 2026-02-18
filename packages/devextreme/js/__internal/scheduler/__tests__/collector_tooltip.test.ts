import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Collector tooltip behavior', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    fx.off = false;
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should hide when last item is deleted', async () => {
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
      views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
      height: 600,
    });

    const collector = POM.getCollectorButton();
    collector.click();

    const deleteButton = POM.getTooltipDeleteButton();
    deleteButton.click();

    expect(POM.isTooltipVisible()).toBe(false);
  });

  it('should stay visible when one appointment is deleted and items remain', async () => {
    const { POM } = await createScheduler({
      dataSource: [
        {
          text: 'Text',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
        },
        {
          text: 'Text2',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
        },
        {
          text: 'Text3',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 10, 30),
        },
      ],
      views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
      height: 600,
    });

    const collector = POM.getCollectorButton();
    collector.click();

    const deleteButton = POM.getTooltipDeleteButton();
    deleteButton.click();

    expect(POM.isTooltipVisible()).toBe(true);
  });

  it('should delete appointment by Delete key when focused in tooltip from collector', async () => {
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
      views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
      height: 600,
    });

    POM.getCollectorButton().click();
    POM.pressDeleteOnTooltipItem();

    expect(POM.isTooltipVisible()).toBe(false);
  });

  it('should not delete disabled appointment by Delete key when focused in tooltip from collector', async () => {
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
          disabled: true,
        },
      ],
      views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
      height: 600,
    });

    POM.getCollectorButton().click();
    POM.pressDeleteOnTooltipItem();

    expect(POM.isTooltipVisible()).toBe(true);
  });
});
