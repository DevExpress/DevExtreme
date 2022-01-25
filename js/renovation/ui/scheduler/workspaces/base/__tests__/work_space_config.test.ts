import { formatWeekdayAndDay, formatWeekday } from '../../../view_model/to_test/views/utils/base';
import {
  getDateForHeaderText as timelineGetDateFrHeaderText,
} from '../../../view_model/to_test/views/utils/timeline_week';
import { DateTableLayoutBase } from '../date_table/layout';
import { HeaderPanelLayout } from '../header_panel/layout';
import { getViewRenderConfigByType } from '../work_space_config';
import { getDateForHeaderText } from '../utils';
import { MonthDateTableLayout } from '../../month/date_table/layout';
import { TimelineHeaderPanelLayout } from '../../timeline/header_panel/layout';

describe('Workspace config utils', () => {
  describe('getViewRenderConfigByType', () => {
    it('should work correctly when view type is day', () => {
      expect(getViewRenderConfigByType('day', false, 1, []))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-day',
          isRenderDateHeader: false,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: false,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: false,
          isUseTimelineHeader: false,
        });
    });

    it('should work correctly when view type is day and intervalCount is larger than 1', () => {
      expect(getViewRenderConfigByType('day', false, 3, []))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-day',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: false,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: false,
          isUseTimelineHeader: false,
        });
    });

    it('should work correctly when view type is week', () => {
      expect(getViewRenderConfigByType('week', false, 1, []))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-week',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: false,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: false,
          isUseTimelineHeader: false,
        });
    });

    it('should work correctly when view type is workWeek', () => {
      expect(getViewRenderConfigByType('workWeek', false, 1, []))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-work-week',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: false,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: false,
          isUseTimelineHeader: false,
        });
    });

    it('should work correctly when view type is month', () => {
      expect(getViewRenderConfigByType('month', false, 1, []))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: MonthDateTableLayout,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: false,
          isMonthDateHeader: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekday,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-month',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: false,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: true,
          isUseTimelineHeader: false,
        });
    });

    it('should work correctly when view type is month adn grouping is vertical', () => {
      expect(getViewRenderConfigByType(
        'month',
        false,
        1,
        [{
          name: 'priorityId',
          items: [{ id: 0 }],
          data: [{ id: 0 }],
        }],
        'vertical',
      ))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: MonthDateTableLayout,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: false,
          isMonthDateHeader: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekday,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-month',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: true,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: true,
          isUseTimelineHeader: false,
        });
    });

    it('should work correctly when view type is timelineDay', () => {
      expect(getViewRenderConfigByType('timelineDay', false, 1, []))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: 'shorttime',
          getDateForHeaderText: timelineGetDateFrHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-timeline-day dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
          isCreateCrossScrolling: true,
          defaultGroupOrientation: 'vertical',
          isUseMonthDateTable: false,
          isUseTimelineHeader: true,
        });
    });

    it('should work correctly when view type is timelineDay when intervalCount is larget than 1', () => {
      expect(getViewRenderConfigByType('timelineDay', false, 13, []))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: 'shorttime',
          getDateForHeaderText: timelineGetDateFrHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: true,
          className: 'dx-scheduler-timeline-day dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
          isCreateCrossScrolling: true,
          defaultGroupOrientation: 'vertical',
          isUseMonthDateTable: false,
          isUseTimelineHeader: true,
        });
    });

    it('should work correctly when view type is timelineWeek', () => {
      expect(getViewRenderConfigByType('timelineWeek', false, 1, []))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: 'shorttime',
          getDateForHeaderText: timelineGetDateFrHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: true,
          className: 'dx-scheduler-timeline-week dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
          isCreateCrossScrolling: true,
          defaultGroupOrientation: 'vertical',
          isUseMonthDateTable: false,
          isUseTimelineHeader: true,
        });
    });

    it('should work correctly when view type is timelineWorkWeek', () => {
      expect(getViewRenderConfigByType('timelineWorkWeek', false, 1, []))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: 'shorttime',
          getDateForHeaderText: timelineGetDateFrHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: true,
          className: 'dx-scheduler-timeline-work-week dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
          isCreateCrossScrolling: true,
          defaultGroupOrientation: 'vertical',
          isUseMonthDateTable: false,
          isUseTimelineHeader: true,
        });
    });

    it('should work correctly when view type is timelineMonth', () => {
      expect(getViewRenderConfigByType('timelineMonth', false, 1, []))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          isMonthDateHeader: true,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-timeline-month dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
          isCreateCrossScrolling: true,
          defaultGroupOrientation: 'vertical',
          isUseMonthDateTable: false,
          isUseTimelineHeader: true,
        });
    });

    it('should work correctly when view type is agenda', () => {
      expect(getViewRenderConfigByType('week', false, 1, []))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          isMonthDateHeader: false,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-week',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          isCreateCrossScrolling: false,
          defaultGroupOrientation: 'horizontal',
          isUseMonthDateTable: false,
          isUseTimelineHeader: false,
        });
    });
  });
});
