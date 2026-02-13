import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import CustomStore from '../../../data/custom_store';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

const CLASSES = {
  scheduler: 'dx-scheduler',
};

describe('Workspace', () => {
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

  it('should not duplicate workspace elements when resources are loaded asynchronously (T661335)', async () => {
    const { scheduler, container, POM } = await createScheduler({
      templatesRenderAsynchronously: true,
      currentView: 'day',
      views: ['day'],
      groups: ['owner'],
      resources: [
        {
          fieldExpr: 'owner',
          dataSource: [{ id: 1, text: 'Owner 1' }],
        },
        {
          fieldExpr: 'room',
          dataSource: new CustomStore({
            load(): Promise<unknown> {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve([{ id: 1, text: 'Room 1', color: '#ff0000' }]);
                });
              });
            },
          }),
        },
      ],
      dataSource: [
        {
          text: 'Meeting in Room 1',
          startDate: new Date(2017, 4, 25, 9, 0),
          endDate: new Date(2017, 4, 25, 10, 0),
          roomId: 1,
        },
      ],
      startDayHour: 9,
      currentDate: new Date(2017, 4, 25),
      height: 600,
    });

    scheduler.option('groups', ['room']);

    await new Promise((r) => { setTimeout(r); });

    const $workSpaces = $(POM.getWorkSpace());
    const $groupHeader = $(container).find('.dx-scheduler-group-header');

    expect($workSpaces.length).toBe(1);

    expect($groupHeader.length).toBeGreaterThan(0);
    expect($groupHeader.text()).toContain('Room 1');
  });

  it('should not have tabIndex attr', async () => {
    const { POM } = await createScheduler({
      currentView: 'day',
      views: ['day'],
      currentDate: new Date(2017, 4, 25),
    });

    expect(POM.getWorkSpace().hasAttribute('tabindex')).toBeFalsy();
  });

  it('should not have tabIndex attr after option change', async () => {
    const { scheduler, POM } = await createScheduler({
      currentView: 'day',
      views: ['day'],
      currentDate: new Date(2017, 4, 25),
    });

    scheduler.option('tabIndex', 1);

    expect(POM.getWorkSpace().hasAttribute('tabindex')).toBeFalsy();
  });
});
