import {
  describe, expect, it, jest,
} from '@jest/globals';

import { getResourceManagerMock } from '../__mock__/resource_manager.mock';
import SchedulerTimelineDay from '../workspaces/m_timeline_day';
import SchedulerTimelineMonth from '../workspaces/m_timeline_month';
import SchedulerTimelineWeek from '../workspaces/m_timeline_week';
import SchedulerTimelineWorkWeek from '../workspaces/m_timeline_work_week';
import type SchedulerWorkSpace from '../workspaces/m_work_space';
import SchedulerWorkSpaceDay from '../workspaces/m_work_space_day';
import SchedulerWorkSpaceMonth from '../workspaces/m_work_space_month';
import SchedulerWorkSpaceWeek from '../workspaces/m_work_space_week';
import SchedulerWorkSpaceWorkWeek from '../workspaces/m_work_space_work_week';

type WorkspaceConstructor<T> = new (container: Element, options?: any) => T;

const createWorkspace = <T extends SchedulerWorkSpace>(
  WorkSpace: WorkspaceConstructor<T>,
  currentView: string,
): T => {
  const container = document.createElement('div');
  const workspace = new WorkSpace(container, {
    views: [currentView],
    currentView,
    currentDate: new Date(2017, 4, 25),
    firstDayOfWeek: 0,
    getResourceManager: () => getResourceManagerMock([]),
  });
  (workspace as any)._isVisible = () => true;
  expect(container.classList).toContain('dx-scheduler-work-space');

  return workspace;
};
const workSpaces: {
  currentView: string;
  WorkSpace: WorkspaceConstructor<SchedulerWorkSpace>;
}[] = [
  { currentView: 'day', WorkSpace: SchedulerWorkSpaceDay },
  { currentView: 'week', WorkSpace: SchedulerWorkSpaceWeek },
  { currentView: 'workWeek', WorkSpace: SchedulerWorkSpaceWorkWeek },
  { currentView: 'month', WorkSpace: SchedulerWorkSpaceMonth },
  { currentView: 'timelineDay', WorkSpace: SchedulerTimelineDay },
  { currentView: 'timelineWeek', WorkSpace: SchedulerTimelineWeek },
  { currentView: 'timelineWorkWeek', WorkSpace: SchedulerTimelineWorkWeek },
  { currentView: 'timelineMonth', WorkSpace: SchedulerTimelineMonth },
];

describe('scheduler workspace', () => {
  workSpaces.forEach(({ currentView, WorkSpace }) => {
    it(`should clear cache on dimension change, view: ${currentView}`, () => {
      const workspace = createWorkspace(WorkSpace, currentView);
      jest.spyOn(workspace.cache, 'clear');

      workspace.cache.memo('test', () => 'value');
      workspace._dimensionChanged();

      expect(workspace.cache.clear).toHaveBeenCalledTimes(1);
    });

    it(`should clear cache on cleanView call, view: ${currentView}`, () => {
      const workspace = createWorkspace(WorkSpace, currentView);
      jest.spyOn(workspace.cache, 'clear');

      workspace.cache.memo('test', () => 'value');
      (workspace as any).cleanView();

      expect(workspace.cache.clear).toHaveBeenCalledTimes(1);
      expect(workspace.cache.size).toBe(0);
    });
  });
});
