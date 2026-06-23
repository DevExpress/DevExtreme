import type {
  AppointmentClickEvent,
  AppointmentContextMenuEvent,
  AppointmentDblClickEvent,
  AppointmentRenderedEvent,
} from '@js/ui/scheduler';

import type NotifyScheduler from '../base/widget_notify_scheduler';
import type { TimeZoneCalculator } from '../r1/timezone_calculator/index';
import type { DesktopTooltipStrategy } from '../tooltip_strategies/desktop_tooltip_strategy';
import type { MobileTooltipStrategy } from '../tooltip_strategies/mobile_tooltip_strategy';
import type { DOMMetaData, ScrollToGroupValuesOrOptions } from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { AppointmentDataSource } from '../view_model/m_appointment_data_source';
import type { SortedEntity } from '../view_model/types';
import type ViewDataProvider from '../workspaces/view_model/view_data_provider';

export interface AppointmentCollectionOptions {
  getResourceManager: () => ResourceManager;
  getAppointmentDataSource: () => AppointmentDataSource;
  getSortedAppointments: () => SortedEntity[];
  scrollTo: (
    date: Date,
    groupValuesOrOptions?: ScrollToGroupValuesOrOptions,
    allDay?: boolean,
  ) => void;
  appointmentTooltip: MobileTooltipStrategy | DesktopTooltipStrategy;
  dataAccessors: AppointmentDataAccessor;
  notifyScheduler: NotifyScheduler;
  onItemRendered: (args: AppointmentRenderedEvent) => void;
  onItemClick: (args: AppointmentClickEvent) => void;
  onItemContextMenu: (args: AppointmentContextMenuEvent) => void;
  onAppointmentDblClick: (args: AppointmentDblClickEvent) => void;
  tabIndex: number;
  focusStateEnabled: boolean;
  allowDrag: boolean;
  allowDelete: boolean;
  allowResize: boolean;
  allowAllDayResize: boolean;
  rtlEnabled: boolean;
  groups: string[];
  groupByDate: boolean;
  timeZoneCalculator: TimeZoneCalculator;
  getResizableStep: () => number;
  getDOMElementsMetaData: () => DOMMetaData | undefined;
  getViewDataProvider: () => ViewDataProvider | undefined;
  isVerticalGroupedWorkSpace: () => boolean;
  isDateAndTimeView: () => boolean;
  onContentReady: () => void;
}
