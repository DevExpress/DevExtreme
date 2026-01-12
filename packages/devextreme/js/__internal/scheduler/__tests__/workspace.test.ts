import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';

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

  describe('scrollTo', () => {
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
      const scrollable = workspace.getScrollable();
      const $scrollable = scrollable.$element();
      const scrollBySpy = jest.spyOn(scrollable, 'scrollBy');

      // With offset: 720 (12 hours), cells start at 18:00 (6:00 + 12h)
      // For date 22:00, this should be cell index 4 (18:00=0, 19:00=1, 20:00=2, 21:00=3, 22:00=4)
      const leftCellCount = 4;
      const cellWidth = workspace.getCellWidth();
      const scrollableWidth = getWidth($scrollable);
      const expectedLeft = leftCellCount * cellWidth - (scrollableWidth - cellWidth) / 2;

      const targetDate = new Date(2021, 1, 2, 22, 0);
      scheduler.scrollTo(targetDate, undefined, false);

      expect(scrollBySpy).toHaveBeenCalledTimes(1);
      const scrollParams = scrollBySpy.mock.calls[0][0] as { left: number; top: number };
      expect(scrollParams.left).toBeCloseTo(expectedLeft, 1);

      scrollBySpy.mockRestore();
    });

    describe('hour normalization', () => {
      [
        // Without offset, normal range
        {
          startDayHour: 6,
          endDayHour: 18,
          offset: 0,
          hours: [4, 12, 20],
        },
        // With positive offset
        {
          startDayHour: 6,
          endDayHour: 18,
          offset: 360,
          hours: [10, 15, 22],
        },
        // With negative offset
        {
          startDayHour: 6,
          endDayHour: 18,
          offset: -120,
          hours: [3, 10, 20],
        },
        // With offset creating midnight crossing
        {
          startDayHour: 6,
          endDayHour: 18,
          offset: 720,
          hours: [10, 22, 3],
        },
        // Edge case: startDayHour = 0
        {
          startDayHour: 0,
          endDayHour: 12,
          offset: 0,
          hours: [0, 6, 13],
        },
        // Edge case: endDayHour = 24
        {
          startDayHour: 12,
          endDayHour: 24,
          offset: 0,
          hours: [11, 18, 23],
        },
      ].forEach(({
        startDayHour,
        endDayHour,
        offset,
        hours,
      }) => {
        hours.forEach((hour) => {
          const testName = `startDayHour: ${startDayHour}, `
            + `endDayHour: ${endDayHour}, offset: ${offset}, `
            + `hour: ${hour}`;

          it(testName, async () => {
            const { scheduler } = await createScheduler({
              views: ['timelineWeek'],
              currentView: 'timelineWeek',
              currentDate: new Date(2021, 1, 2),
              startDayHour,
              endDayHour,
              offset,
            });

            const workspace = scheduler.getWorkSpace();
            const scrollable = workspace.getScrollable();
            const scrollBySpy = jest.spyOn(scrollable, 'scrollBy');
            const targetDate = new Date(2021, 1, 2, hour, 0);

            scheduler.scrollTo(targetDate, undefined, false);
            const cell = workspace.viewDataProvider.findGlobalCellPosition(
              targetDate,
              0,
              false,
              true,
            );
            const cellStartDate = cell.cellData.startDate;
            const cellEndDate = cell.cellData.endDate;

            expect(scrollBySpy).toHaveBeenCalledTimes(1);
            expect(targetDate.getTime()).toBeGreaterThanOrEqual(cellStartDate.getTime());
            expect(targetDate.getTime()).toBeLessThan(cellEndDate.getTime());

            scrollBySpy.mockRestore();
          });
        });
      });
    });
  });
});
