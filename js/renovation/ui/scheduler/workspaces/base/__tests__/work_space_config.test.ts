import { formatWeekdayAndDay, formatWeekday } from '../../../../../../ui/scheduler/workspaces/utils/base';
import {
  getDateForHeaderText as timelineGetDateFrHeaderText,
} from '../../../../../../ui/scheduler/workspaces/utils/timeline_week';
import { DateTableLayoutBase } from '../date_table/layout';
import { HeaderPanelLayout } from '../header_panel/layout';
import { TimePanelTableLayout } from '../time_panel/layout';
import { getViewRenderConfigByType } from '../work_space_config';
import { getDateForHeaderText } from '../utils';
import { MonthDateTableLayout } from '../../month/date_table/layout';
import { TimelineHeaderPanelLayout } from '../../timeline/header_panel/layout';

describe('Workspace config utils', () => {
  describe('getViewRenderConfigByType', () => {
    it('should work correctly when view type is day', () => {
      expect(getViewRenderConfigByType('day', 1))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          timePanelTemplate: TimePanelTableLayout,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-day',
          isRenderDateHeader: false,
          scrollingDirection: 'vertical',
        });
    });

    it('should work correctly when view type is day and intervalCount is larger than 1', () => {
      expect(getViewRenderConfigByType('day', 3))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          timePanelTemplate: TimePanelTableLayout,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-day',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
        });
    });

    it('should work correctly when view type is week', () => {
      expect(getViewRenderConfigByType('week', 1))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          timePanelTemplate: TimePanelTableLayout,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-week',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
        });
    });

    it('should work correctly when view type is workWeek', () => {
      expect(getViewRenderConfigByType('workWeek', 1))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          timePanelTemplate: TimePanelTableLayout,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-work-week',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
        });
    });

    it('should work correctly when view type is month', () => {
      expect(getViewRenderConfigByType('month', 1))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: MonthDateTableLayout,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: false,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekday,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-month',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
        });
    });

    it('should work correctly when view type is timelineDay', () => {
      expect(getViewRenderConfigByType('timelineDay', 1))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: 'shorttime',
          getDateForHeaderText: timelineGetDateFrHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-timeline-day dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
        });
    });

    it('should work correctly when view type is timelineDay when intervalCount is larget than 1', () => {
      expect(getViewRenderConfigByType('timelineDay', 13))
        .toEqual({
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
          className: 'dx-scheduler-timeline-day dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
        });
    });

    it('should work correctly when view type is timelineWeek', () => {
      expect(getViewRenderConfigByType('timelineWeek', 1))
        .toEqual({
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
          className: 'dx-scheduler-timeline-week dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
        });
    });

    it('should work correctly when view type is timelineWorkWeek', () => {
      expect(getViewRenderConfigByType('timelineWorkWeek', 1))
        .toEqual({
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
          className: 'dx-scheduler-timeline-work-week dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
        });
    });

    it('should work correctly when view type is timelineMonth', () => {
      expect(getViewRenderConfigByType('timelineMonth', 1))
        .toEqual({
          headerPanelTemplate: TimelineHeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          isAllDayPanelSupported: false,
          isProvideVirtualCellsWidth: true,
          isRenderTimePanel: false,
          groupPanelClassName: 'dx-scheduler-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isRenderDateHeader: true,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-timeline-month dx-scheduler-timeline',
          scrollingDirection: 'horizontal',
        });
    });

    it('should work correctly when view type is agenda', () => {
      expect(getViewRenderConfigByType('week', 1))
        .toEqual({
          headerPanelTemplate: HeaderPanelLayout,
          dateTableTemplate: DateTableLayoutBase,
          timePanelTemplate: TimePanelTableLayout,
          isAllDayPanelSupported: true,
          isProvideVirtualCellsWidth: false,
          isRenderTimePanel: true,
          groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
          headerCellTextFormat: formatWeekdayAndDay,
          getDateForHeaderText,
          isGenerateWeekDaysHeaderData: false,
          className: 'dx-scheduler-work-space-week',
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
        });
    });
  });
});
