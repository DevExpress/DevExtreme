import {
  ComponentBindings,
  Event,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import type { dxSchedulerScrolling } from '../../../../ui/scheduler';
import dateUtils from '../../../../core/utils/date';
import { GroupOrientation } from '../types';
import {
  DataCellTemplateProps,
  DateTimeCellTemplateProps,
  Group,
  ResourceCellTemplateProps,
  ViewMetaData,
} from './types';
import { BaseWidgetProps } from '../../common/base_props';

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

  @Event() onViewRendered!: (viewMetaData: ViewMetaData) => void;
}
