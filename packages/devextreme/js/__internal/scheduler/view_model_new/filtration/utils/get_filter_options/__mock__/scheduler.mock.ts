import type Scheduler from '../../../../../m_scheduler';
import { createTimeZoneCalculator } from '../../../../../r1/timezone_calculator';
import { ResourceManager } from '../../../../../utils/resource_manager/resource_manager';

export const getSchedulerMock = ({
  type,
  startDayHour,
  endDayHour,
  offsetMinutes,
  resourceManager,
  dateRange,
}: {
  type: string;
  startDayHour: number;
  endDayHour: number;
  offsetMinutes: number;
  resourceManager?: ResourceManager;
  dateRange?: Date[];
}): Scheduler => ({
  currentView: { type },
  getWorkSpace: () => ({
    getDateRange: () => dateRange ?? [
      new Date(2000, 0, 10, startDayHour),
      new Date(2000, 0, 11, endDayHour),
    ],
  }),
  getViewOption: (name: string) => ({ startDayHour, endDayHour, allDayPanelMode: 'allDay' }[name]),
  option: (name: string) => ({ firstDayOfWeek: 0, showAllDayPanel: true }[name]),
  getViewOffsetMs: () => offsetMinutes * 60_000,
  resourceManager: resourceManager ?? new ResourceManager([]),
  timeZoneCalculator: createTimeZoneCalculator(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ),
}) as unknown as Scheduler;
