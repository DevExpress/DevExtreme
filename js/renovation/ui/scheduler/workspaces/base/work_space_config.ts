import { formatWeekday, formatWeekdayAndDay } from '../../../../../ui/scheduler/workspaces/utils/base';
import {
  getDateForHeaderText as timelineGetDateFrHeaderText,
} from '../../../../../ui/scheduler/workspaces/utils/timeline_week';
import { ViewType } from '../../types';
import { MonthDateTableLayout } from '../month/date_table/layout';
import { ViewRenderConfig } from '../props';
import { TimelineHeaderPanelLayout } from '../timeline/header_panel/layout';
import { DateTableLayoutBase } from './date_table/layout';
import { HeaderPanelLayout } from './header_panel/layout';
import { TimePanelTableLayout } from './time_panel/layout';
import { getDateForHeaderText } from './utils';

type GetRenderConfig = (intervalCount: number) => ViewRenderConfig;

const verticalViewConfig: ViewRenderConfig = {
  headerPanelTemplate: HeaderPanelLayout,
  dateTableTemplate: DateTableLayoutBase,
  timePanelTemplate: TimePanelTableLayout,
  isAllDayPanelSupported: true,
  isProvideVirtualCellsWidth: false,
  isRenderTimePanel: true,
  groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
  headerCellTextFormat: formatWeekdayAndDay,
  getDateForHeaderText,
  isRenderDateHeader: true,
  isGenerateWeekDaysHeaderData: false,
};
const timelineViewConfig: ViewRenderConfig = {
  headerPanelTemplate: TimelineHeaderPanelLayout,
  dateTableTemplate: DateTableLayoutBase,
  isAllDayPanelSupported: false,
  isProvideVirtualCellsWidth: true,
  isRenderTimePanel: false,
  groupPanelClassName: 'dx-scheduler-group-table',
  headerCellTextFormat: 'shorttime',
  getDateForHeaderText: timelineGetDateFrHeaderText,
  isRenderDateHeader: true,
  isGenerateWeekDaysHeaderData: true,
};

const getDayViewConfig: GetRenderConfig = (intervalCount) => ({
  ...verticalViewConfig,
  className: 'dx-scheduler-work-space-day',
  isRenderDateHeader: intervalCount > 1,
});
const getWeekViewConfig: GetRenderConfig = () => ({
  ...verticalViewConfig,
  className: 'dx-scheduler-work-space-week',
});
const getWorkWeekViewConfig: GetRenderConfig = () => ({
  ...verticalViewConfig,
  className: 'dx-scheduler-work-space-work-week',
});

const getMonthViewConfig: GetRenderConfig = () => ({
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
});

const getTimelineDayViewConfig: GetRenderConfig = (intervalCount) => ({
  ...timelineViewConfig,
  className: 'dx-scheduler-timeline-day dx-scheduler-timeline',
  isGenerateWeekDaysHeaderData: intervalCount > 1,
});
const getTimelineWeekViewConfig: GetRenderConfig = () => ({
  ...timelineViewConfig,
  className: 'dx-scheduler-timeline-week dx-scheduler-timeline',
});
const getTimelineWorkWeekViewConfig: GetRenderConfig = () => ({
  ...timelineViewConfig,
  className: 'dx-scheduler-timeline-work-week dx-scheduler-timeline',
});
const getTimelineMonthViewConfig: GetRenderConfig = () => ({
  ...timelineViewConfig,
  className: 'dx-scheduler-timeline-month dx-scheduler-timeline',
  headerCellTextFormat: formatWeekdayAndDay,
  isGenerateWeekDaysHeaderData: false,
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
  intervalCount: number,
): ViewRenderConfig => VIEW_CONFIG_GETTERS[viewType](intervalCount);
