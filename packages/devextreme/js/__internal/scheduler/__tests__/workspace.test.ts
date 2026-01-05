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
  workSpace: 'dx-scheduler-work-space',
};

describe('Workspace', () => {
  describe('Recalculation with Async Templates (T661335)', () => {
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
      const { scheduler, container } = await createScheduler({
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

      const $workSpaces = $(container).find(`.${CLASSES.workSpace}`);
      const $groupHeader = $(container).find('.dx-scheduler-group-header');

      expect($workSpaces.length).toBe(1);

      expect($groupHeader.length).toBeGreaterThan(0);
      expect($groupHeader.text()).toContain('Room 1');
    });
  });

  describe('scrollTo (T1310544)', () => {
    beforeEach(() => {
      fx.off = true;
      setupSchedulerTestEnvironment({ height: 600 });
    });

    afterEach(() => {
      document.body.innerHTML = '';
      fx.off = false;
    });

    it('T1310544: should scroll to date with offset: 720 (12 hours)', async () => {
      const { scheduler } = await createScheduler({
        views: ['timelineDay'],
        currentView: 'timelineDay',
        currentDate: new Date(2021, 1, 2),
        firstDayOfWeek: 0,
        startDayHour: 6,
        endDayHour: 18,
        offset: 720,
        cellDuration: 60,
        height: 580,
      });

      const workspace = scheduler.getWorkSpace();

      // With offset: 720 (12 hours), cells start at 18:00 (6:00 + 12h)
      // For date 22:00, this should be cell index 4 (18:00=0, 19:00=1, 20:00=2, 21:00=3, 22:00=4)
      const leftCellCount = 4;
      const cellWidth = workspace.getCellWidth();
      const expectedLeft = leftCellCount * cellWidth;

      const targetDate = new Date(2021, 1, 2, 22, 0);

      const coordinates = workspace._getScrollCoordinates(
        targetDate.getHours(),
        targetDate.getMinutes(),
        targetDate,
        0,
        false,
      );

      expect(coordinates.left).toBe(expectedLeft);
    });
  });
});
