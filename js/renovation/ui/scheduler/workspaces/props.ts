import {
  ComponentBindings,
  Event,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import type { dxSchedulerScrolling } from '../../../../ui/scheduler';
import dateUtils from '../../../../core/utils/date';
import { GroupOrientation, ViewType } from '../types';
import {
  DataCellTemplateProps,
  DateTimeCellTemplateProps,
  Group,
  ResourceCellTemplateProps,
  ViewMetaData,
} from './types';
import { BaseWidgetProps } from '../../common/base_props';
import { HeaderPanelLayoutProps } from './base/header_panel/layout';
import { DateTableLayoutProps } from './base/date_table/layout';
import { TimePaneLayoutProps } from './base/time_panel/layout';
import { GetDateForHeaderText } from '../view_model/to_test/views/types';

@ComponentBindings()
export class WorkSpaceProps extends BaseWidgetProps {
  // -------------------
  // Public templates
  // -------------------

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  // -----------------
  // Public props
  // -----------------

  @OneWay() intervalCount = 1;

  @OneWay() groups: Group[] = [];

  @OneWay() groupByDate = false;

  @OneWay() groupOrientation: GroupOrientation = 'horizontal';

  @OneWay() crossScrollingEnabled = false;

  @OneWay() startDayHour = 0;

  @OneWay() endDayHour = 24;

  @OneWay() firstDayOfWeek = 0;

  @OneWay() currentDate!: Date;

  @OneWay() startDate?: Date;

  @OneWay() hoursInterval = 0.5;

  @OneWay() showAllDayPanel = false;

  @OneWay() allDayPanelExpanded = false;

  @OneWay() allowMultipleCellSelection = true;

  @OneWay() indicatorTime = new Date();

  @OneWay() indicatorUpdateInterval = 5 * dateUtils.dateToMilliseconds('minute');

  @OneWay() shadeUntilCurrentTime = true;

  @OneWay() selectedCellData = [];

  @OneWay() scrolling: dxSchedulerScrolling = {
    mode: 'standard',
  };

  @OneWay() cellDuration = 30;

  @OneWay() showCurrentTimeIndicator = true;

  @OneWay() schedulerHeight?: number;

  @OneWay() schedulerWidth?: number;

  @OneWay() type: ViewType = 'week';

  @Event() onViewRendered!: (viewMetaData: ViewMetaData) => void;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type CurrentViewConfigType = Pick<
WorkSpaceProps,
'firstDayOfWeek'
| 'startDayHour'
| 'endDayHour'
| 'cellDuration'
| 'groupByDate'
| 'scrolling'
| 'currentDate'
| 'intervalCount'
| 'groupOrientation'
| 'startDate'
| 'showAllDayPanel'
| 'showCurrentTimeIndicator'
| 'indicatorUpdateInterval'
| 'shadeUntilCurrentTime'
| 'crossScrollingEnabled'
| 'schedulerHeight'
| 'schedulerWidth'
| 'tabIndex'
| 'accessKey'
| 'focusStateEnabled'
| 'indicatorTime'
| 'allowMultipleCellSelection'
| 'allDayPanelExpanded'
| 'hoursInterval'
| 'groups'
| 'selectedCellData'
| 'type'
>;

export interface ViewRenderConfig {
  headerPanelTemplate: JSXTemplate<HeaderPanelLayoutProps, 'dateHeaderData'>;
  dateTableTemplate: JSXTemplate<DateTableLayoutProps>;
  timePanelTemplate?: JSXTemplate<TimePaneLayoutProps>;
  className?: string;
  isAllDayPanelSupported: boolean;
  isProvideVirtualCellsWidth: boolean;
  isRenderTimePanel: boolean;
  groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table' | 'dx-scheduler-group-table';
  headerCellTextFormat: string | ((date: Date) => string);
  getDateForHeaderText: GetDateForHeaderText;
  isRenderDateHeader: boolean;
  isGenerateWeekDaysHeaderData: boolean;
}
