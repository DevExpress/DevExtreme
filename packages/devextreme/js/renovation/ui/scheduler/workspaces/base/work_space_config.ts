import { formatWeekday, formatWeekdayAndDay } from '../../view_model/to_test/views/utils/base';
import {
  getDateForHeaderText as timelineGetDateForHeaderText,
} from '../../view_model/to_test/views/utils/timeline_week';
import { GroupOrientation, ViewType } from '../../types';
import { MonthDateTableLayout } from '../month/date_table/layout';
import { ViewRenderConfig } from '../props';
import { TimelineHeaderPanelLayout } from '../timeline/header_panel/layout';
import { DateTableLayoutBase } from './date_table/layout';
import { HeaderPanelLayout } from './header_panel/layout';
import { getDateForHeaderText } from './utils';
import { Group } from '../types';
import { isVerticalGroupingApplied } from '../utils';

const TIMELINE_CLASS = 'dx-scheduler-timeline';

type GetRenderConfig = (
  crossScrollingEnabled: boolean,
  intervalCount: number,
  groups: Group[],
  groupOrientation?: GroupOrientation,
) => ViewRenderConfig;

const verticalViewConfig: ViewRenderConfig = {
  headerPanelTemplate: HeaderPanelLayout,
  dateTableTemplate: DateTableLayoutBase,
  isAllDayPanelSupported: true,
  isProvideVirtualCellsWidth: false,
  isRenderTimePanel: true,
  groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
  headerCellTextFormat: formatWeekdayAndDay,
  getDateForHeaderText,
  isRenderDateHeader: true,
  isGenerateWeekDaysHeaderData: false,
  isMonthDateHeader: false,
  scrollingDirection: 'vertical',
  className: 'dx-scheduler-work-space-day',
  isCreateCrossScrolling: false,
  defaultGroupOrientation: 'horizontal',
  isUseMonthDateTable: false,
  isUseTimelineHeader: false,
};
const timelineViewConfig: ViewRenderConfig = {
  headerPanelTemplate: TimelineHeaderPanelLayout,
  dateTableTemplate: DateTableLayoutBase,
  isAllDayPanelSupported: false,
  isProvideVirtualCellsWidth: true,
  isRenderTimePanel: false,
  groupPanelClassName: 'dx-scheduler-group-table',
  headerCellTextFormat: 'shorttime',
  getDateForHeaderText: timelineGetDateForHeaderText,
  isRenderDateHeader: true,
  isGenerateWeekDaysHeaderData: true,
  scrollingDirection: 'horizontal',
  className: `dx-scheduler-timeline-day ${TIMELINE_CLASS}`,
  isCreateCrossScrolling: true,
  defaultGroupOrientation: 'vertical',
  isMonthDateHeader: false,
  isUseMonthDateTable: false,
  isUseTimelineHeader: true,
};

const getVerticalViewConfig = (crossScrollingEnabled: boolean): ViewRenderConfig => ({
  ...verticalViewConfig,
  isCreateCrossScrolling: crossScrollingEnabled,
});

const getDayViewConfig: GetRenderConfig = (
  crossScrollingEnabled,
  intervalCount,
) => ({
  ...getVerticalViewConfig(
    crossScrollingEnabled,
  ),
  isRenderDateHeader: intervalCount > 1,
});
const getWeekViewConfig: GetRenderConfig = (
  crossScrollingEnabled,
) => ({
  ...getVerticalViewConfig(
    crossScrollingEnabled,
  ),
  className: 'dx-scheduler-work-space-week',
});
const getWorkWeekViewConfig: GetRenderConfig = (
  crossScrollingEnabled,
) => ({
  ...getVerticalViewConfig(
    crossScrollingEnabled,
  ),
  className: 'dx-scheduler-work-space-work-week',
});

const getMonthViewConfig: GetRenderConfig = (
  crossScrollingEnabled,
  _,
  groups,
  groupOrientation,
) => ({
  headerPanelTemplate: HeaderPanelLayout,
  dateTableTemplate: MonthDateTableLayout,
  isAllDayPanelSupported: false,
  isProvideVirtualCellsWidth: false,
  isRenderTimePanel: false,
  groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
  headerCellTextFormat: formatWeekday,
  getDateForHeaderText,
  isRenderDateHeader: true,
  isGenerateWeekDaysHeaderData: false,
  className: 'dx-scheduler-work-space-month',
  scrollingDirection: 'vertical',
  isCreateCrossScrolling: crossScrollingEnabled
    || isVerticalGroupingApplied(groups, groupOrientation),
  defaultGroupOrientation: 'horizontal',
  isMonthDateHeader: true,
  isUseMonthDateTable: true,
  isUseTimelineHeader: false,
});

const getTimelineDayViewConfig: GetRenderConfig = (_, intervalCount) => ({
  ...timelineViewConfig,
  isGenerateWeekDaysHeaderData: intervalCount > 1,
});
const getTimelineWeekViewConfig: GetRenderConfig = () => ({
  ...timelineViewConfig,
  className: `dx-scheduler-timeline-week ${TIMELINE_CLASS}`,
});
const getTimelineWorkWeekViewConfig: GetRenderConfig = () => ({
  ...timelineViewConfig,
  className: `dx-scheduler-timeline-work-week ${TIMELINE_CLASS}`,
});
const getTimelineMonthViewConfig: GetRenderConfig = () => ({
  ...timelineViewConfig,
  className: `dx-scheduler-timeline-month ${TIMELINE_CLASS}`,
  headerCellTextFormat: formatWeekdayAndDay,
  isGenerateWeekDaysHeaderData: false,
  isMonthDateHeader: true,
  getDateForHeaderText,
});

const VIEW_CONFIG_GETTERS: Record<ViewType, GetRenderConfig> = {
  day: getDayViewConfig,
  week: getWeekViewConfig,
  workWeek: getWorkWeekViewConfig,
  month: getMonthViewConfig,
  timelineDay: getTimelineDayViewConfig,
  timelineWeek: getTimelineWeekViewConfig,
  timelineWorkWeek: getTimelineWorkWeekViewConfig,
  timelineMonth: getTimelineMonthViewConfig,
  agenda: getWeekViewConfig, // TODO
};

export const getViewRenderConfigByType = (
  viewType: ViewType,
  crossScrollingEnabled: boolean,
  intervalCount: number,
  groups: Group[],
  groupOrientation?: GroupOrientation,
): ViewRenderConfig => VIEW_CONFIG_GETTERS[viewType](
  crossScrollingEnabled, intervalCount, groups, groupOrientation,
);
