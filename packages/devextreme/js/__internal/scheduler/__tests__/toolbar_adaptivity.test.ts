import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('Toolbar Adaptivity', () => {
  it('should have viewSwitcher with locateInMenu: "auto" by default', async () => {
    setupSchedulerTestEnvironment();
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
