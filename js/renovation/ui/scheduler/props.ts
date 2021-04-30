/* eslint-disable max-classes-per-file */
import {
  ComponentBindings,
  // OneWay,
  // Event,
  // TwoWay,
  // Nested,
  // Template,
} from '@devextreme-generator/declarations';

import type { template } from '../../../core/templates/template';
import DataSource from '../../../data/data_source';
import type { DataSourceOptions } from '../../../data/data_source';

import type {
  AppointmentCollectorTemplateData,
  AppointmentDraggingAddEvent,
  AppointmentDraggingEndEvent,
  AppointmentDraggingMoveEvent,
  AppointmentDraggingStartEvent,
  AppointmentDraggingRemoveEvent,
  DateNavigatorTextInfo,
  AppointmentTemplateData,
  dxSchedulerAppointment,
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
  dxSchedulerScrolling,
  AppointmentTooltipTemplateData,
  CellClickEvent,
} from '../../../ui/scheduler';

import type { UserDefinedElement, DxElement } from '../../../core/element'; // eslint-disable-line import/named

@ComponentBindings()
export class SchedulerProps {
  adaptivityEnabled?: boolean;

  allDayExpr?: string;

  appointmentCollectorTemplate?:
  // eslint-disable-next-line max-len
  template|((data: AppointmentCollectorTemplateData, collectorElement: DxElement) => string | UserDefinedElement);

  appointmentDragging?: AppointmentDragging;

  appointmentTemplate?:
  // eslint-disable-next-line max-len
  template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  appointmentTooltipTemplate?:
  // eslint-disable-next-line max-len
  template| ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  cellDuration?: number;

  crossScrollingEnabled?: boolean;

  currentDate?: Date | number | string;

  currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

  customizeDateNavigatorText?: ((info: DateNavigatorTextInfo) => string);

  dataCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  dataSource?: string | dxSchedulerAppointment[] | DataSource | DataSourceOptions;

  dateCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  dateSerializationFormat?: string;

  descriptionExpr?: string;

  dropDownAppointmentTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  editing?: AppointmentEditing;

  endDateExpr?: string;

  endDateTimeZoneExpr?: string;

  endDayHour?: number;

  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  focusStateEnabled?: boolean;

  groupByDate?: boolean;

  groups?: string[];

  indicatorUpdateInterval?: number;

  max?: Date | number | string;

  maxAppointmentsPerCell?: number | 'auto' | 'unlimited';

  min?: Date | number | string;

  noDataText?: string;

  onAppointmentAdded?: ((e: AppointmentDraggingAddEvent) => void);

  onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);

  onAppointmentClick?: ((e: AppointmentClickEvent) => void) | string;

  onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void) | string;

  onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void) | string;

  onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);

  onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);

  onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);

  onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);

  onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);

  onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);

  onCellClick?: ((e: CellClickEvent) => void) | string;

  onCellContextMenu?: ((e: CellContextMenuEvent) => void) | string;

  recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';

  recurrenceExceptionExpr?: string;

  recurrenceRuleExpr?: string;

  remoteFiltering?: boolean;

  resourceCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  resources?: Resource[];

  scrolling?: dxSchedulerScrolling;

  selectedCellData?: unknown[];

  shadeUntilCurrentTime?: boolean;

  showAllDayPanel?: boolean;

  showCurrentTimeIndicator?: boolean;

  startDateExpr?: string;

  startDateTimeZoneExpr?: string;

  startDayHour?: number;

  textExpr?: string;

  timeCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  timeZone?: string;

  useDropDownViewSwitcher?: boolean;

  views?: ('day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | View)[];
}

@ComponentBindings()
export class Resource {
  allowMultiple?: boolean;

  colorExpr?: string;

  dataSource?: string | unknown[] | DataSource | DataSourceOptions;

  displayExpr?: string | ((resource: unknown) => string);

  fieldExpr?: string;

  label?: string;

  useColorAsDefault?: boolean;

  valueExpr?: string | ((data: unknown) => string);
}

@ComponentBindings()
export class View {
  agendaDuration?: number;

  appointmentCollectorTemplate?:
  // eslint-disable-next-line max-len
  template | ((data: AppointmentCollectorTemplateData, collectorElement: DxElement) => string | UserDefinedElement);

  appointmentTemplate?:
  // eslint-disable-next-line max-len
  template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  appointmentTooltipTemplate?:
  // eslint-disable-next-line max-len
  template | ((model: AppointmentTooltipTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  cellDuration?: number;

  dataCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  dateCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  dropDownAppointmentTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);

  endDayHour?: number;

  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  groupByDate?: boolean;

  groupOrientation?: 'horizontal' | 'vertical';

  groups?: string[];

  intervalCount?: number;

  maxAppointmentsPerCell?: number | 'auto' | 'unlimited';

  name?: string;

  resourceCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  startDate?: Date | number | string;

  startDayHour?: number;

  timeCellTemplate?:
  // eslint-disable-next-line max-len
  template | ((itemData: unknown, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

  type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

  scrolling?: dxSchedulerScrolling;
}

@ComponentBindings()
export class AppointmentEditing {
  allowAdding?: boolean;

  allowDeleting?: boolean;

  allowDragging?: boolean;

  allowResizing?: boolean;

  allowTimeZoneEditing?: boolean;

  allowUpdating?: boolean;

  allowEditingTimeZones?: boolean;
}

@ComponentBindings()
export class AppointmentDragging {
  appointmentDragging?: {

    autoScroll?: boolean;

    data?: unknown;

    group?: string;

    onAdd?: ((e: AppointmentDraggingAddEvent) => void);

    onDragEnd?: ((e: AppointmentDraggingEndEvent) => void);

    onDragMove?: ((e: AppointmentDraggingMoveEvent) => void);

    onDragStart?: ((e: AppointmentDraggingStartEvent) => void);

    onRemove?: ((e: AppointmentDraggingRemoveEvent) => void);

    scrollSensitivity?: number;

    scrollSpeed?: number;
  };
}
