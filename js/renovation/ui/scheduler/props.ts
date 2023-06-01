/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable max-classes-per-file */
import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
  Nested,
  Template,
  JSXTemplate,
} from '@devextreme-generator/declarations';

import { SchedulerToolbarItem } from './header/props';
import type { template } from '../../../core/templates/template';
import DataSource from '../../../data/data_source';
import type { DataSourceOptions } from '../../../data/data_source';

import type {
  AppointmentDraggingAddEvent,
  AppointmentDraggingEndEvent,
  AppointmentDraggingMoveEvent,
  AppointmentDraggingStartEvent,
  AppointmentDraggingRemoveEvent,
  DateNavigatorTextInfo,
  Appointment,
  AppointmentAddingEvent,
  AppointmentClickEvent,
  AppointmentContextMenuEvent,
  AppointmentDblClickEvent,
  AppointmentDeletedEvent,
  AppointmentDeletingEvent,
  AppointmentFormOpeningEvent,
  AppointmentRenderedEvent,
  AppointmentUpdatedEvent,
  AppointmentUpdatingEvent,
  CellContextMenuEvent,
  AppointmentTooltipTemplateData,
  CellClickEvent,
} from '../../../ui/scheduler';

import type { UserDefinedElement, DxElement } from '../../../core/element'; // eslint-disable-line import/named
import messageLocalization from '../../../localization/message';
import { ViewType } from './types';
import { BaseWidgetProps } from '../common/base_props';
import { DataCellTemplateProps, DateTimeCellTemplateProps, ResourceCellTemplateProps } from './workspaces/types';
import { AppointmentTemplateProps, OverflowIndicatorTemplateProps } from './appointment/types';
import { AllDayPanelModeType } from './appointment/utils/getAppointmentTakesAllDay';

@ComponentBindings()
export class ScrollingProps {
  @OneWay()
  mode?: 'standard' | 'virtual';
}

@ComponentBindings()
export class ResourceProps {
  @OneWay()
  allowMultiple?: boolean;

  @OneWay()
  dataSource?: string | unknown[] | DataSource | DataSourceOptions;

  @OneWay()
  label?: string;

  @OneWay()
  useColorAsDefault?: boolean;

  /* Field expressions */

  @OneWay()
  valueExpr?: string | ((data: unknown) => string);

  @OneWay()
  colorExpr?: string;

  @OneWay()
  displayExpr?: string | ((resource: unknown) => string);

  @OneWay()
  fieldExpr?: string;
}

@ComponentBindings()
export class ViewProps {
  @OneWay()
  endDayHour?: number;

  @OneWay()
  startDayHour?: number;

  @OneWay()
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  @OneWay()
  cellDuration?: number;

  @OneWay()
  groups?: string[];

  @OneWay()
  maxAppointmentsPerCell?: number | 'auto' | 'unlimited';

  @OneWay()
  agendaDuration?: number;

  @OneWay()
  groupByDate?: boolean;

  @OneWay()
  groupOrientation?: 'horizontal' | 'vertical';

  @OneWay()
  intervalCount?: number;

  @OneWay()
  name?: string;

  @OneWay()
  startDate?: Date | number | string;

  @OneWay()
  type?: ViewType;

  @OneWay()
  allDayPanelMode?: AllDayPanelModeType;

  @Nested()
  scrolling?: ScrollingProps;

  /* Templates */

  @Template()
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @Template()
  dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template()
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template()
  resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @Template()
  appointmentCollectorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;

  @Template()
  appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Template()
  appointmentTooltipTemplate?: JSXTemplate<AppointmentTemplateProps>;
}

@ComponentBindings()
export class AppointmentEditingProps {
  @OneWay()
  allowAdding?: boolean;

  @OneWay()
  allowDeleting?: boolean;

  @OneWay()
  allowDragging?: boolean;

  @OneWay()
  allowResizing?: boolean;

  @OneWay()
  allowTimeZoneEditing?: boolean;

  @OneWay()
  allowUpdating?: boolean;
}

@ComponentBindings()
export class AppointmentDraggingProps {
  @OneWay()
  autoScroll?: boolean;

  @OneWay()
  data?: unknown;

  @OneWay()
  group?: string;

  @OneWay()
  scrollSensitivity?: number;

  @OneWay()
  scrollSpeed?: number;

  @Event()
  onAdd?: ((e: AppointmentDraggingAddEvent) => void);

  @Event()
  onDragEnd?: ((e: AppointmentDraggingEndEvent) => void);

  @Event()
  onDragMove?: ((e: AppointmentDraggingMoveEvent) => void);

  @Event()
  onDragStart?: ((e: AppointmentDraggingStartEvent) => void);

  @Event()
  onRemove?: ((e: AppointmentDraggingRemoveEvent) => void);
}

@ComponentBindings()
export class SchedulerProps extends BaseWidgetProps {
  @OneWay()
  adaptivityEnabled = false;

  @Nested()
  appointmentDragging?: AppointmentDraggingProps;

  @OneWay()
  crossScrollingEnabled = false;

  @TwoWay()
  currentDate: Date | number | string = new Date();

  @TwoWay()
  currentView: string | 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek' = 'day';

  @OneWay()
  dataSource?: string | Appointment[] | DataSource | DataSourceOptions;

  @OneWay()
  dateSerializationFormat?: string;

  @OneWay()
  descriptionExpr = 'description';

  @Nested()
  editing: AppointmentEditingProps = {
    allowAdding: true,
    allowDeleting: true,
    allowDragging: true,
    allowResizing: true,
    allowUpdating: true,
    allowTimeZoneEditing: false,
  };

  @OneWay()
  focusStateEnabled = true;

  @OneWay()
  groupByDate = false;

  @OneWay()
  indicatorUpdateInterval = 300000;

  @OneWay()
  max?: Date | number | string;

  @OneWay()
  min?: Date | number | string;

  @OneWay()
  noDataText = messageLocalization.format('dxCollectionWidget-noDataText');

  @OneWay()
  recurrenceEditMode: 'dialog' | 'occurrence' | 'series' = 'dialog';

  @OneWay()
  remoteFiltering = false;

  @Nested()
  resources: ResourceProps[] = [];

  @Nested()
  scrolling: ScrollingProps = { mode: 'standard' };

  // TODO Is @TwoWay()?
  @OneWay()
  selectedCellData: unknown[] = [];

  @OneWay()
  shadeUntilCurrentTime = false;

  @OneWay()
  showAllDayPanel = true;

  @OneWay()
  showCurrentTimeIndicator = true;

  @OneWay()
  timeZone = '';

  @OneWay()
  useDropDownViewSwitcher = false;

  @Nested()
  views: (
    'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | ViewProps
  )[] = ['day', 'week'];

  @OneWay()
  endDayHour = 24;

  @OneWay()
  startDayHour = 0;

  @OneWay()
  firstDayOfWeek = 0;

  @OneWay()
  cellDuration = 30;

  @OneWay()
  groups: string[] = [];

  @OneWay()
  maxAppointmentsPerCell: number | 'auto' | 'unlimited' = 'auto';

  /* Events */

  @OneWay()
  customizeDateNavigatorText?: ((info: DateNavigatorTextInfo) => string);

  @Event()
  onAppointmentAdded?: ((e: AppointmentDraggingAddEvent) => void);

  @Event()
  onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);

  @Event()
  onAppointmentClick?: ((e: AppointmentClickEvent) => void) | string;

  @Event()
  onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void) | string;

  @Event()
  onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void) | string;

  @Event()
  onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);

  @Event()
  onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);

  @Event()
  onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);

  @Event()
  onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);

  @Event()
  onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);

  @Event()
  onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);

  @Event()
  onCellClick?: ((e: CellClickEvent) => void) | string;

  @Event()
  onCellContextMenu?: ((e: CellContextMenuEvent) => void) | string;

  /* Field expressions */

  @OneWay()
  recurrenceExceptionExpr = 'recurrenceException';

  @OneWay()
  recurrenceRuleExpr = 'recurrenceRule';

  @OneWay()
  startDateExpr = 'startDate';

  @OneWay()
  startDateTimeZoneExpr = 'startDateTimeZone';

  @OneWay()
  endDateExpr = 'endDate';

  @OneWay()
  endDateTimeZoneExpr = 'endDateTimeZone';

  @OneWay()
  allDayExpr = 'allDay';

  @OneWay()
  textExpr = 'text';

  @OneWay()
  allDayPanelMode: AllDayPanelModeType = 'all';

  // TODO: https://github.com/DevExpress/devextreme-renovation/issues/751
  /* Templates */

  @Template()
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @Template()
  dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template()
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template()
  resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @Template()
  appointmentCollectorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;

  @Template()
  appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Template()
  appointmentTooltipTemplate?:
  // eslint-disable-next-line max-len
  template | ((model: AppointmentTooltipTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  @OneWay()
  toolbar: SchedulerToolbarItem[] = [
    {
      defaultElement: 'dateNavigator',
      location: 'before',
    },
    {
      defaultElement: 'viewSwitcher',
      location: 'after',
    },
  ];
}

export type DataAccessorsProps = Pick<
SchedulerProps,
'startDateExpr'
| 'endDateExpr'
| 'startDateTimeZoneExpr'
| 'endDateTimeZoneExpr'
| 'allDayExpr'
| 'textExpr'
| 'descriptionExpr'
| 'recurrenceRuleExpr'
| 'recurrenceExceptionExpr'
| 'resources'
| 'dateSerializationFormat'
>;

export type CurrentViewConfigProps = Pick<
SchedulerProps,
'firstDayOfWeek'
| 'startDayHour'
| 'endDayHour'
| 'cellDuration'
| 'groupByDate'
| 'scrolling'
| 'dataCellTemplate'
| 'timeCellTemplate'
| 'resourceCellTemplate'
| 'dateCellTemplate'
| 'appointmentTemplate'
| 'appointmentCollectorTemplate'
| 'appointmentTooltipTemplate'
| 'maxAppointmentsPerCell'
| 'showAllDayPanel'
| 'showCurrentTimeIndicator'
| 'indicatorUpdateInterval'
| 'shadeUntilCurrentTime'
| 'crossScrollingEnabled'
| 'height'
| 'width'
| 'allDayPanelMode'
>;

// TODO: https://github.com/DevExpress/devextreme-renovation/issues/751
// export type SchedulerPropsType = SchedulerProps & Pick<
// ViewProps,
// 'dataCellTemplate'
// | 'dateCellTemplate'
// | 'timeCellTemplate'
// | 'resourceCellTemplate'
// | 'appointmentTooltipTemplate'
// | 'appointmentCollectorTemplate'
// | 'appointmentTemplate'
// >;
