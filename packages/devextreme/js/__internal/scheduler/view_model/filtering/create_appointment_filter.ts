import type Scheduler from '../../m_scheduler';
import type { AllDayPanelModeType, ViewType } from '../../types';
import type { ResourceManager } from '../../utils/resource_manager/resource_manager';
import type ViewDataProvider from '../../workspaces/view_model/m_view_data_provider';
import { AppointmentFilterBaseStrategy } from './m_appointment_filter';
import { AppointmentFilterVirtualStrategy } from './m_appointment_filter_virtual';

type FilterStrategy = (AppointmentFilterBaseStrategy | AppointmentFilterVirtualStrategy) & {
  constructor: Function & {
    strategyName: string;
  };
};

const FilterStrategyMap = {
  [AppointmentFilterVirtualStrategy.strategyName]: AppointmentFilterVirtualStrategy,
  [AppointmentFilterBaseStrategy.strategyName]: AppointmentFilterBaseStrategy,
};

export const createAppointmentFilter = (scheduler: Scheduler): FilterStrategy => {
  const filterOptions = {
    resources: scheduler.option('resources'),
    getResourceManager: (): ResourceManager => scheduler.resourceManager,
    dataAccessors: scheduler._dataAccessors,
    startDayHour: (): number => scheduler.getViewOption('startDayHour'),
    endDayHour: (): number => scheduler.getViewOption('endDayHour'),
    viewOffset: (): number => scheduler.getViewOffsetMs(),
    showAllDayPanel: (): boolean => scheduler.option('showAllDayPanel'),
    timeZoneCalculator: scheduler.timeZoneCalculator,
    //
    supportAllDayRow: scheduler._workSpace.supportAllDayRow(),
    viewType: (): ViewType => scheduler._workSpace.type as ViewType,
    viewDirection: (): 'vertical' | 'horizontal' => scheduler._workSpace.viewDirection as 'vertical' | 'horizontal',
    dateRange: (): Date[] => scheduler._workSpace.getDateRange() as Date[],
    groupCount: (): number => scheduler._workSpace._getGroupCount() as number,
    viewDataProvider: (): ViewDataProvider => scheduler
      ._workSpace.viewDataProvider as ViewDataProvider,
    allDayPanelMode: (): AllDayPanelModeType => scheduler.getViewOption('allDayPanelMode'),
  };
  const filterStrategyName = scheduler.isVirtualScrolling()
    ? AppointmentFilterVirtualStrategy.strategyName
    : AppointmentFilterBaseStrategy.strategyName;
  const strategy = new FilterStrategyMap[filterStrategyName](filterOptions);

  return strategy as FilterStrategy;
};
