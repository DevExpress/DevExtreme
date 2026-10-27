import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('Header', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector('.dx-scheduler'));
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
  });

  it('should not have tabIndex attr', async () => {
    const { POM } = await createScheduler({
      dataSource: [],
      currentView: 'day',
      currentDate: new Date(2021, 4, 24),
    });

    expect(POM.getHeader().hasAttribute('tabindex')).toBe(false);
  });

  it('should not have tabIndex attr after tabIndex option change', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [],
      currentView: 'day',
      currentDate: new Date(2021, 4, 24),
    });

    scheduler.option('tabIndex', 1);

    expect(POM.getHeader().hasAttribute('tabindex')).toBe(false);
  });

  describe('firstDayOfWeek runtime change', () => {
    const getCaption = (header: HTMLElement): string | null | undefined => header
      .querySelector('.dx-scheduler-navigator-caption')?.textContent;

    it('should fall back to the locale first day when reset to undefined', async () => {
      const { scheduler, POM } = await createScheduler({
        dataSource: [],
        currentView: 'week',
        currentDate: new Date(2021, 4, 24),
        firstDayOfWeek: 1,
      });

      scheduler.option('firstDayOfWeek', undefined);

      expect(getCaption(POM.getHeader())).toBe('23-29 May 2021');
      expect(scheduler.getStartViewDate()).toEqual(new Date(2021, 4, 23));
    });

    it('should keep the view firstDayOfWeek when the root option changes', async () => {
      const { scheduler, POM } = await createScheduler({
        dataSource: [],
        views: [{ type: 'week', firstDayOfWeek: 3 }],
        currentView: 'week',
        currentDate: new Date(2021, 4, 24),
        firstDayOfWeek: 1,
      });

      scheduler.option('firstDayOfWeek', 0);

      expect(getCaption(POM.getHeader())).toBe('19-25 May 2021');
      expect(scheduler.getStartViewDate()).toEqual(new Date(2021, 4, 19));
    });

    it('should apply the root option when the view has no firstDayOfWeek', async () => {
      const { scheduler, POM } = await createScheduler({
        dataSource: [],
        currentView: 'week',
        currentDate: new Date(2021, 4, 24),
        firstDayOfWeek: 1,
      });

      scheduler.option('firstDayOfWeek', 3);

      expect(getCaption(POM.getHeader())).toBe('19-25 May 2021');
      expect(scheduler.getStartViewDate()).toEqual(new Date(2021, 4, 19));
    });
  });

  describe('Toolbar', () => {
    it('should have viewSwitcher with locateInMenu: "auto" by default', async () => {
      const { scheduler } = await createScheduler({
        dataSource: [],
        currentView: 'day',
        currentDate: new Date(2021, 4, 24),
      });

      const toolbarItems = scheduler.option('toolbar.items') as any[];
      const viewSwitcherItem = toolbarItems.find((item: any) => item.name === 'viewSwitcher');

      expect(viewSwitcherItem).toBeDefined();
      expect(viewSwitcherItem.location).toBe('after');
      expect(viewSwitcherItem.locateInMenu).toBe('auto');
    });
  });
});
