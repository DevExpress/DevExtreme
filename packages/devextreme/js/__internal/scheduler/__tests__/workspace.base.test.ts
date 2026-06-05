import {
  beforeAll, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { logger } from '@ts/core/utils/m_console';

import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import type SchedulerWorkSpace from '../workspaces/m_work_space';
import SchedulerTimelineDay from '../workspaces/timeline_day';
import SchedulerTimelineMonth from '../workspaces/timeline_month';
import SchedulerTimelineWeek from '../workspaces/timeline_week';
import SchedulerWorkSpaceDay from '../workspaces/work_space_day';
import SchedulerWorkSpaceMonth from '../workspaces/work_space_month';
import SchedulerWorkSpaceWeek from '../workspaces/work_space_week';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

jest.mock('@ts/core/m_devices', () => {
  const originalModule: any = jest.requireActual('@ts/core/m_devices');
  const real = jest.fn().mockReturnValue({
    platform: 'mac',
    mac: true,
    deviceType: 'desktop',
  });
  const current = jest.fn().mockReturnValue({
    platform: 'mac',
    mac: true,
    deviceType: 'desktop',
  });

  return {
    __esModule: true,
    default: {
      ...originalModule.default,
      isSimulator: originalModule.default.isSimulator,
      real,
      current,
    },
  };
});

type WorkspaceConstructor<T> = new (container: Element, options?: any) => T;

const createWorkspace = <T extends SchedulerWorkSpace>(
  WorkSpace: WorkspaceConstructor<T>,
  currentView: string,
  options?: any,
): { workspace: T; container: Element } => {
  const container = document.createElement('div');
  const workspace = new WorkSpace(container, {
    views: [currentView],
    currentView,
    currentDate: new Date(2017, 4, 25),
    firstDayOfWeek: 0,
    getResourceManager: () => getResourceManagerMock([]),
    ...options,
  });
  (workspace as any)._isVisible = () => true;
  expect(container.classList).toContain('dx-scheduler-work-space');

  return { workspace, container };
};

const workSpaces: {
  currentView: string;
  WorkSpace: WorkspaceConstructor<SchedulerWorkSpace>;
}[] = [
  { currentView: 'day', WorkSpace: SchedulerWorkSpaceDay },
  { currentView: 'week', WorkSpace: SchedulerWorkSpaceWeek },
  { currentView: 'workWeek', WorkSpace: SchedulerWorkSpaceWeek },
  { currentView: 'month', WorkSpace: SchedulerWorkSpaceMonth },
  { currentView: 'timelineDay', WorkSpace: SchedulerTimelineDay },
  { currentView: 'timelineWeek', WorkSpace: SchedulerTimelineWeek },
  { currentView: 'timelineWorkWeek', WorkSpace: SchedulerTimelineWeek },
  { currentView: 'timelineMonth', WorkSpace: SchedulerTimelineMonth },
];

beforeAll(() => {
  setupSchedulerTestEnvironment();
});

describe('scheduler workspace', () => {
  workSpaces.forEach(({ currentView, WorkSpace }) => {
    it(`should clear cache on dimension change, view: ${currentView}`, () => {
      const { workspace } = createWorkspace(WorkSpace, currentView);
      jest.spyOn(workspace.cache, 'clear');

      workspace.cache.memo('test', () => 'value');
      workspace._dimensionChanged();

      expect(workspace.cache.clear).toHaveBeenCalledTimes(1);
    });

    it(`should clear cache on cleanView call, view: ${currentView}`, () => {
      const { workspace } = createWorkspace(WorkSpace, currentView);
      jest.spyOn(workspace.cache, 'clear');

      workspace.cache.memo('test', () => 'value');
      (workspace as any).cleanView();

      expect(workspace.cache.clear).toHaveBeenCalledTimes(1);
      expect(workspace.cache.size).toBe(0);
    });
  });
});

describe('scheduler workspace scrollTo', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  it('should change scroll position with center alignment', () => {
    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2017, 4, 25, 22, 0));

    expect(scrollableContainer.scrollLeft).toBeCloseTo(11125);
  });

  it('should not change scroll position when date is outside view range', () => {
    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2030, 0, 1));

    expect(scrollableContainer.scrollLeft).toBeCloseTo(0);
    expect(scrollableContainer.scrollTop).toBeCloseTo(0);
  });

  it('should scroll with start alignment', () => {
    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2017, 4, 25, 22, 0), undefined, false, true, 'start');

    expect(scrollableContainer.scrollLeft).toBeCloseTo(11000);
    expect(scrollableContainer.scrollTop).toBeCloseTo(0);
  });

  it('should scroll with center alignment', () => {
    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2017, 4, 25, 22, 0), undefined, false, true, 'center');

    expect(scrollableContainer.scrollLeft).toBeCloseTo(11125);
  });

  it('should scroll to all day panel when allDay is true', () => {
    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2017, 4, 25, 22, 0), undefined, true);

    expect(scrollableContainer.scrollLeft).toBeCloseTo(11125);
  });

  it('should handle throwWarning parameter correctly', () => {
    const loggerWarnSpy = jest.spyOn(logger, 'warn');
    loggerWarnSpy.mockReset();

    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2030, 0, 1), undefined, false, true);

    expect(scrollableContainer.scrollLeft).toBe(0);
    expect(scrollableContainer.scrollTop).toBe(0);
    expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
    expect(loggerWarnSpy).toHaveBeenCalledWith(expect.stringContaining('W1008'));
  });

  it('should apply RTL offset when rtlEnabled is true', () => {
    const { workspace, container } = createWorkspace(SchedulerTimelineDay, 'timelineDay');
    workspace.option('rtlEnabled', true);

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    workspace.scrollTo(new Date(2017, 4, 25, 22, 0));

    expect(scrollableContainer.scrollLeft).toBeCloseTo(-11125);
  });
});

describe('scheduler workspace skipped days support', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  it('should count configured skipped days in week workspace interval math', () => {
    const { workspace } = createWorkspace(SchedulerWorkSpaceWeek, 'week', {
      skippedDays: [1, 3],
    });

    expect((workspace as any).getSkippedDaysCount(new Date(2026, 3, 5), 7)).toBe(2);
  });

  it('should use full week layout for work week when skippedDays override is empty', () => {
    const { workspace } = createWorkspace(SchedulerWorkSpaceWeek, 'workWeek', {
      currentDate: new Date(2026, 3, 1), // Wednesday
      firstDayOfWeek: 0, // Sunday
      skippedDays: [],
    });

    expect(workspace.getStartViewDate()).toEqual(new Date(2026, 2, 29));
    expect((workspace as any).getCellCount()).toBe(7);
  });

  it('should use custom skippedDays in work week runtime layout', () => {
    const { workspace } = createWorkspace(SchedulerWorkSpaceWeek, 'workWeek', {
      currentDate: new Date(2026, 3, 1), // Wednesday
      firstDayOfWeek: 0, // Sunday
      skippedDays: [3], // Wednesday
    });

    expect(workspace.getStartViewDate()).toEqual(new Date(2026, 2, 29));
    expect((workspace as any).getCellCount()).toBe(6);
  });

  it('should skip configured hidden days when incrementing timeline header dates', () => {
    const { workspace } = createWorkspace(SchedulerTimelineWeek, 'timelineWeek', {
      skippedDays: [3],
    });
    const date = new Date(2026, 3, 7); // Tuesday

    (workspace as any).incrementDate(date);

    expect(date).toEqual(new Date(2026, 3, 9)); // Thursday
  });

  it('should skip hidden days when incrementing timeline day dates', () => {
    const { workspace } = createWorkspace(SchedulerTimelineDay, 'timelineDay', {
      skippedDays: [0, 6],
    });
    const date = new Date(2026, 3, 10); // Friday

    (workspace as any).incrementDate(date);

    expect(date).toEqual(new Date(2026, 3, 13)); // Monday
  });
});
