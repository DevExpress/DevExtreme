import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

const CLASSES = {
  scheduler: 'dx-scheduler',
};

describe('Header', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector(`.${CLASSES.scheduler}`));
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
  });

  it('should not have tabIndex', async () => {
    const { POM } = await createScheduler({
      dataSource: [],
      currentView: 'day',
      currentDate: new Date(2021, 4, 24),
    });

    expect(POM.getHeader().hasAttribute('tabindex')).toBeFalsy();
  });

  it('should not have tabIndex after option change', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [],
      currentView: 'day',
      currentDate: new Date(2021, 4, 24),
    });

    scheduler.option('tabIndex', 0);

    expect(POM.getHeader().hasAttribute('tabindex')).toBeFalsy();
  });

  describe('Toolbar', () => {
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
});
