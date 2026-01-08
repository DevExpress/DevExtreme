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
      it('should normalize hours to visible range without viewOffset', async () => {
        const { scheduler } = await createScheduler({
          views: ['timelineDay'],
          currentView: 'timelineDay',
          currentDate: new Date(2021, 1, 2),
          startDayHour: 6,
          endDayHour: 18,
          offset: 0,
        });

        const workspace = scheduler.getWorkSpace();
        const scrollable = workspace.getScrollable();
        const scrollBySpy = jest.spyOn(scrollable, 'scrollBy');

        // Below startDayHour (6), should normalize to 6
        const dateBelowRange = new Date(2021, 1, 2, 4, 0);
        scheduler.scrollTo(dateBelowRange, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockClear();
        // Above endDayHour (18), should normalize to 17
        const dateAboveRange = new Date(2021, 1, 2, 20, 0);
        scheduler.scrollTo(dateAboveRange, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockClear();
        // Within range [6, 18), should scroll normally
        const dateInRange = new Date(2021, 1, 2, 12, 0);
        scheduler.scrollTo(dateInRange, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockRestore();
      });

      it('should normalize hours to visible range with viewOffset (no midnight crossing)', async () => {
        const { scheduler } = await createScheduler({
          views: ['timelineDay'],
          currentView: 'timelineDay',
          currentDate: new Date(2021, 1, 2),
          startDayHour: 6,
          endDayHour: 18,
          offset: 360,
        });

        const workspace = scheduler.getWorkSpace();
        const scrollable = workspace.getScrollable();
        const scrollBySpy = jest.spyOn(scrollable, 'scrollBy');

        // Below adjustedStartDayHour (12), should normalize to 12
        const dateBelowAdjustedRange = new Date(2021, 1, 2, 10, 0);
        scheduler.scrollTo(dateBelowAdjustedRange, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockClear();
        // Within adjusted range [12, 24), should scroll normally
        const dateInAdjustedRange = new Date(2021, 1, 2, 15, 0);
        scheduler.scrollTo(dateInAdjustedRange, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockRestore();
      });

      it('should normalize hours to visible range with viewOffset (midnight crossing)', async () => {
        const { scheduler } = await createScheduler({
          views: ['timelineDay'],
          currentView: 'timelineDay',
          currentDate: new Date(2021, 1, 2),
          startDayHour: 6,
          endDayHour: 18,
          offset: 720,
        });

        const workspace = scheduler.getWorkSpace();
        const scrollable = workspace.getScrollable();
        const scrollBySpy = jest.spyOn(scrollable, 'scrollBy');

        // In gap [6, 18), should normalize to 18:00 Feb 2
        const dateInGap = new Date(2021, 1, 2, 10, 0);
        scheduler.scrollTo(dateInGap, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockClear();
        // In range [18, 24) on Feb 2, should scroll normally
        const dateInFirstRange = new Date(2021, 1, 2, 22, 0);
        scheduler.scrollTo(dateInFirstRange, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockClear();
        // In range [0, 6) but on wrong day (Feb 2), should normalize to 18:00 Feb 2
        const dateInSecondRangeWrongDay = new Date(2021, 1, 2, 3, 0);
        scheduler.scrollTo(dateInSecondRangeWrongDay, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockClear();
        // In range [0, 6) on correct day (Feb 3), should scroll normally
        const dateInSecondRangeCorrectDay = new Date(2021, 1, 3, 3, 0);
        scheduler.scrollTo(dateInSecondRangeCorrectDay, undefined, false);
        expect(scrollBySpy).toHaveBeenCalled();

        scrollBySpy.mockRestore();
      });
    });
  });
});
