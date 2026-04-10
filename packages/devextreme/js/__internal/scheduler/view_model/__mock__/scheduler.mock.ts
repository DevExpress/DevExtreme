import { mockAppointmentDataAccessor } from '../../__mock__/appointment_data_accessor.mock';
import { mockTimeZoneCalculator } from '../../__mock__/timezone_calculator.mock';
import type Scheduler from '../../m_scheduler';
import { ResourceManager } from '../../utils/resource_manager/resource_manager';

export const getSchedulerMock = ({
  type,
  startDayHour,
  endDayHour,
  offsetMinutes,
  resourceManager,
  dateRange,
  skippedDays,
  isVirtualScrolling = false,
}: {
  type: string;
  startDayHour: number;
  endDayHour: number;
  offsetMinutes: number;
  resourceManager?: ResourceManager;
  skippedDays?: number[];
  dateRange?: Date[];
  isVirtualScrolling?: boolean;
}): Scheduler => ({
  timeZoneCalculator: mockTimeZoneCalculator,
  currentView: { type, skippedDays: skippedDays ?? [] },
  getWorkSpace: () => ({
    getDateRange: () => dateRange ?? [
      new Date(2000, 0, 10, startDayHour),
      new Date(2000, 0, 11, endDayHour),
    ],
  }),
  getTimeZone: () => 'Etc/UTC',
  getViewOption: (name: string) => ({
    startDayHour,
    endDayHour,
    allDayPanelMode: 'allDay',
    cellDuration: 30,
  }[name]),
  option: (name: string) => ({ firstDayOfWeek: 0, showAllDayPanel: true }[name]),
  getViewOffsetMs: () => offsetMinutes * 60_000,
  isVirtualScrolling: () => isVirtualScrolling,
  resourceManager: resourceManager ?? new ResourceManager([]),
  _dataAccessors: mockAppointmentDataAccessor,
}) as unknown as Scheduler;
