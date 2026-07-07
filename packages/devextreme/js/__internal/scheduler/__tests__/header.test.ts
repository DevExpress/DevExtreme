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
