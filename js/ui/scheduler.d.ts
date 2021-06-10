import './scheduler/utils';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    DxEvent,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    Cancelable
} from '../events/index';

import {
    CollectionWidgetItem
} from './collection/ui.collection_widget.base';

import dxDraggable from './draggable';

import dxForm from './form';
import dxPopup from './popup';

import dxSortable from './sortable';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

interface AppointmentDraggingEvent {
  readonly component: dxScheduler;
  readonly event?: DxEvent;
  readonly itemData?: any;
  readonly itemElement?: DxElement;
  readonly fromData?: any;
}

interface TargetedAppointmentInfo {
  readonly appointmentData: dxSchedulerAppointment;
  readonly targetedAppointmentData?: dxSchedulerAppointment;
}

/** @public */
export type AppointmentAddedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  readonly error?: Error;
}

/** @public */
export type AppointmentAddingEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  cancel: boolean | PromiseLike<boolean>;
}

/** @public */
export type AppointmentClickEvent = Cancelable & NativeEventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
}

/** @public */
export type AppointmentContextMenuEvent = NativeEventInfo<dxScheduler> & TargetedAppointmentInfo &{
  readonly appointmentElement: DxElement;
}

/** @public */
export type AppointmentDblClickEvent = Cancelable & NativeEventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
}

/** @public */
export type AppointmentDeletedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  readonly error?: Error;
}

/** @public */
export type AppointmentDeletingEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  cancel: boolean | PromiseLike<boolean>;
}

/** @public */
export type AppointmentFormOpeningEvent = Cancelable & EventInfo<dxScheduler> & {
  readonly appointmentData?: any;
  readonly form: dxForm;
  readonly popup: dxPopup;
}

/** @public */
export type AppointmentRenderedEvent = EventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
}

/** @public */
export type AppointmentUpdatedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  readonly error?: Error;
}

/** @public */
export type AppointmentUpdatingEvent = EventInfo<dxScheduler> & {
  readonly oldData: any;
  readonly newData: any;
  cancel?: boolean | PromiseLike<boolean>;
}

/** @public */
export type CellClickEvent = Cancelable & NativeEventInfo<dxScheduler> & {
  readonly cellData: any;
  readonly cellElement: DxElement;
}

/** @public */
export type CellContextMenuEvent = NativeEventInfo<dxScheduler> & {
  readonly cellData: any;
  readonly cellElement: DxElement;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxScheduler>;

/** @public */
export type DisposingEvent = EventInfo<dxScheduler>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxScheduler>;

/** @public */
export type OptionChangedEvent = EventInfo<dxScheduler> & ChangedOptionInfo;

/** @public */
export type AppointmentDraggingAddEvent = AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
  readonly toData?: any;
}

/** @public */
export type AppointmentDraggingEndEvent = Cancelable & AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
  readonly toData?: any;
}

/** @public */
export type AppointmentDraggingMoveEvent = Cancelable & AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
  readonly toData?: any;
}

/** @public */
export type AppointmentDraggingStartEvent = Cancelable & AppointmentDraggingEvent;

/** @public */
export type AppointmentDraggingRemoveEvent = AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
}

/** @public */
export type AppointmentTemplateData = TargetedAppointmentInfo;

/** @public */
export type AppointmentTooltipTemplateData = TargetedAppointmentInfo;

/** @public */
export type AppointmentCollectorTemplateData = {
  readonly appointmentCount: number;
  readonly isCompact: boolean;
}

/** @public */
export type DateNavigatorTextInfo = {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly text: string;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
    /**
     * @docid
     * @default false
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @default 'allDay'
     * @public
     */
    allDayExpr?: string;
    /**
     * @docid
     * @default "appointmentCollector"
     * @extends AppointmentCollectorTemplate
     * @public
     */
    appointmentCollectorTemplate?: template | ((data: AppointmentCollectorTemplateData, collectorElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    appointmentDragging?: {
      /**
       * @docid
       * @default true
       */
      autoScroll?: boolean,
      /**
       * @docid
       * @default undefined
       */
      data?: any,
      /**
       * @docid
       * @default undefined
       */
      group?: string,
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:DxElement
       * @type_function_param1_field5 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 fromData:any
       * @type_function_param1_field8 toData:any
       */
      onAdd?: ((e: AppointmentDraggingAddEvent) => void),
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:DxElement
       * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 fromData:any
       * @type_function_param1_field9 toData:any
       */
      onDragEnd?: ((e: AppointmentDraggingEndEvent) => void),
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:DxElement
       * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 fromData:any
       * @type_function_param1_field9 toData:any
       */
      onDragMove?: ((e: AppointmentDraggingMoveEvent) => void),
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:DxElement
       * @type_function_param1_field6 fromData:any
       */
      onDragStart?: ((e: AppointmentDraggingStartEvent) => void),
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:DxElement
       * @type_function_param1_field5 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 fromData:any
       */
      onRemove?: ((e: AppointmentDraggingRemoveEvent) => void),
      /**
       * @docid
       * @default 60
       */
      scrollSensitivity?: number,
      /**
       * @docid
       * @default 60
       */
      scrollSpeed?: number
    };
    /**
     * @docid
     * @extends AppointmentTemplate
     * @public
     */
    appointmentTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @extends AppointmentTooltipTemplate
     * @public
     */
    appointmentTooltipTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @extends CellDuration
     * @public
     */
    cellDuration?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    crossScrollingEnabled?: boolean;
    /**
     * @docid
     * @default new Date()
     * @fires dxSchedulerOptions.onOptionChanged
     * @public
     */
    currentDate?: Date | number | string;
    /**
     * @docid
     * @type Enums.SchedulerViewType
     * @default "day"
     * @fires dxSchedulerOptions.onOptionChanged
     * @public
     */
    currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
    /**
     * @docid
     * @type_function_param1 info:object
     * @type_function_param1_field1 startDate:date
     * @type_function_param1_field2 endDate:date
     * @type_function_param1_field3 text:string
     * @type_function_return string
     * @default undefined
     * @public
     */
    customizeDateNavigatorText?: ((info: DateNavigatorTextInfo) => string);
    /**
     * @docid
     * @extends DataCellTemplate
     * @public
     */
    dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<dxSchedulerAppointment> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @extends DateCellTemplate
     * @public
     */
    dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default undefined
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @default 'description'
     * @public
     */
    descriptionExpr?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    editing?: boolean | {
      /**
       * @docid
       * @default true
       */
      allowAdding?: boolean,
      /**
       * @docid
       * @default true
       */
      allowDeleting?: boolean,
      /**
       * @docid
       * @default true
       * @default false [for](Android|iOS)
       */
      allowDragging?: boolean,
      /**
       * @docid
       * @default true
       * @default false [for](Android|iOS)
       */
      allowResizing?: boolean,
      /**
       * @docid
       * @default false
       */
      allowTimeZoneEditing?: boolean,
      /**
       * @docid
       * @default true
       */
      allowUpdating?: boolean,
    };
    /**
     * @docid
     * @default 'endDate'
     * @public
     */
    endDateExpr?: string;
    /**
     * @docid
     * @default 'endDateTimeZone'
     * @public
     */
    endDateTimeZoneExpr?: string;
    /**
     * @docid
     * @extends EndDayHour
     * @public
     */
    endDayHour?: number;
    /**
     * @docid
     * @type Enums.FirstDayOfWeek
     * @default undefined
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    groupByDate?: boolean;
    /**
     * @docid
     * @extends Groups
     * @public
     */
    groups?: Array<string>;
    /**
     * @docid
     * @default 300000
     * @public
     */
    indicatorUpdateInterval?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid
     * @type number|Enums.MaxAppointmentsPerCell
     * @default "auto"
     * @public
     */
    maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
    /**
     * @docid
     * @default undefined
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @default "No data to display"
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @public
     */
    onAppointmentAdded?: ((e: AppointmentAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
     * @action
     * @public
     */
    onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:DxElement
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 cancel:Boolean
     * @action
     * @public
     */
    onAppointmentClick?: ((e: AppointmentClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:DxElement
     * @type_function_param1_field7 event:event
     * @action
     * @public
     */
    onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:DxElement
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 cancel:Boolean
     * @action
     * @public
     */
    onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @public
     */
    onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
     * @action
     * @public
     */
    onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 form:dxForm
     * @type_function_param1_field6 popup:dxPopup
     * @type_function_param1_field7 cancel:Boolean
     * @action
     * @public
     */
    onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object|undefined
     * @type_function_param1_field6 appointmentElement:DxElement
     * @action
     * @public
     */
    onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @public
     */
    onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 oldData:Object
     * @type_function_param1_field5 newData:Object
     * @type_function_param1_field6 cancel:Boolean|Promise<Boolean>
     * @action
     * @public
     */
    onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellData:object
     * @type_function_param1_field5 cellElement:DxElement
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 cancel:Boolean
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellData:object
     * @type_function_param1_field5 cellElement:DxElement
     * @type_function_param1_field6 event:event
     * @action
     * @public
     */
    onCellContextMenu?: ((e: CellContextMenuEvent) => void) | string;
    /**
     * @docid
     * @type Enums.SchedulerRecurrenceEditMode
     * @default "dialog"
     * @public
     */
    recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
    /**
     * @docid
     * @default 'recurrenceException'
     * @public
     */
    recurrenceExceptionExpr?: string;
    /**
     * @docid
     * @default 'recurrenceRule'
     * @public
     */
    recurrenceRuleExpr?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    remoteFiltering?: boolean;
    /**
     * @docid
     * @extends ResourceCellTemplate
     * @public
     */
    resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default []
     * @public
     */
    resources?: Array<{
      /**
       * @docid
       * @default false
       */
      allowMultiple?: boolean,
      /**
       * @docid
       * @default "color"
       */
      colorExpr?: string,
      /**
       * @docid
       * @default null
       */
      dataSource?: string | Array<any> | Store | DataSource | DataSourceOptions,
      /**
       * @docid
       * @type_function_param1 resource:object
       * @type_function_return string
       * @default 'text'
       */
      displayExpr?: string | ((resource: any) => string),
      /**
       * @docid
       * @default ""
       */
      fieldExpr?: string,
      /**
       * @docid
       * @default ""
       */
      label?: string,
      /**
       * @docid
       * @default false
       */
      useColorAsDefault?: boolean,
      /**
       * @docid
       * @default 'id'
       */
      valueExpr?: string | Function
    }>;
    /**
     * @docid
     * @public
     */
    scrolling?: dxSchedulerScrolling;
    /**
     * @docid
     * @readonly
     * @default []
     * @public
     */
    selectedCellData?: Array<any>;
    /**
     * @docid
     * @default false
     * @public
     */
    shadeUntilCurrentTime?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showAllDayPanel?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showCurrentTimeIndicator?: boolean;
    /**
     * @docid
     * @default 'startDate'
     * @public
     */
    startDateExpr?: string;
    /**
     * @docid
     * @default 'startDateTimeZone'
     * @public
     */
    startDateTimeZoneExpr?: string;
    /**
     * @docid
     * @extends StartDayHour
     * @public
     */
    startDayHour?: number;
    /**
     * @docid
     * @default 'text'
     * @public
     */
    textExpr?: string;
    /**
     * @docid
     * @extends TimeCellTemplate
     * @public
     */
    timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default ""
     * @public
     */
    timeZone?: string;
    /**
     * @docid
     * @default false
     * @default true [for](Android|iOS)
     * @default true [for](Material)
     * @public
     */
    useDropDownViewSwitcher?: boolean;
    /**
     * @docid
     * @type Array<string,object>
     * @default ['day', 'week']
     * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
     * @public
     */
    views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | {
      /**
       * @docid
       * @default 7
       */
      agendaDuration?: number,
      /**
       * @docid
       * @default "appointmentCollector"
       * @extends AppointmentCollectorTemplate
       */
      appointmentCollectorTemplate?: template | ((data: AppointmentCollectorTemplateData, collectorElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @extends AppointmentTemplate
       */
      appointmentTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @extends AppointmentTooltipTemplate
       */
      appointmentTooltipTemplate?: template | ((model: AppointmentTooltipTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @extends CellDuration
       */
      cellDuration?: number,
      /**
       * @docid
       * @extends DataCellTemplate
       */
      dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @extends DateCellTemplate
       */
      dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @extends EndDayHour
       */
      endDayHour?: number,
      /**
       * @docid
       * @type Enums.FirstDayOfWeek
       * @default undefined
       */
      firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
      /**
       * @docid
       * @default false
       */
      groupByDate?: boolean,
      /**
       * @docid
       * @type Enums.Orientation
       */
      groupOrientation?: 'horizontal' | 'vertical',
      /**
       * @docid
       * @extends Groups
       */
      groups?: Array<string>,
      /**
       * @docid
       * @default 1
       */
      intervalCount?: number,
      /**
       * @docid
       * @type number|Enums.MaxAppointmentsPerCell
       * @default "auto"
       */
      maxAppointmentsPerCell?: number | 'auto' | 'unlimited',
      /**
       * @docid
       * @default undefined
       */
      name?: string,
      /**
       * @docid
       * @extends ResourceCellTemplate
       */
      resourceCellTemplate?: template | ((itemData: dxSchedulerAppointment, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @default undefined
       */
      startDate?: Date | number | string,
      /**
       * @docid
       * @extends StartDayHour
       */
      startDayHour?: number,
      /**
       * @docid
       * @extends TimeCellTemplate
       */
      timeCellTemplate?: template | ((itemData: dxSchedulerAppointment, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement),
      /**
       * @docid
       * @type Enums.SchedulerViewType
       * @default undefined
       */
      type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek',
      /**
       * @docid
       */
      scrolling?: dxSchedulerScrolling
    }>;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/scheduler
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxScheduler extends Widget<dxSchedulerOptions> {
    /**
     * @docid
     * @publicName addAppointment(appointment)
     * @param1 appointment:Object
     * @public
     */
    addAppointment(appointment: dxSchedulerAppointment): void;
    /**
     * @docid
     * @publicName deleteAppointment(appointment)
     * @param1 appointment:Object
     * @public
     */
    deleteAppointment(appointment: dxSchedulerAppointment): void;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getEndViewDate()
     * @return Date
     * @public
     */
    getEndViewDate(): Date;
    /**
     * @docid
     * @publicName getStartViewDate()
     * @return Date
     * @public
     */
    getStartViewDate(): Date;
    /**
     * @docid
     * @publicName hideAppointmentPopup(saveChanges)
     * @param1 saveChanges:Boolean|undefined
     * @public
     */
    hideAppointmentPopup(saveChanges?: boolean): void;
    /**
     * @docid
     * @publicName hideAppointmentTooltip()
     * @public
     */
    hideAppointmentTooltip(): void;
    /**
     * @docid
     * @publicName scrollTo(date, group, allDay)
     * @param1 date:Date
     * @param2 group:Object|undefined
     * @param3 allDay:Boolean|undefined
     * @public
     */
    scrollTo(date: Date, group?: object, allDay?: boolean): void;
    /**
     * @docid
     * @publicName scrollToTime(hours, minutes, date)
     * @param1 hours:Number
     * @param2 minutes:Number
     * @param3 date:Date|undefined
     * @deprecated
     * @public
     */
    scrollToTime(hours: number, minutes: number, date?: Date): void;
    /**
     * @docid
     * @publicName showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)
     * @param1 appointmentData:Object|undefined
     * @param2 createNewAppointment:Boolean|undefined
     * @param3 currentAppointmentData:Object|undefined
     * @public
     */
    showAppointmentPopup(appointmentData?: dxSchedulerAppointment, createNewAppointment?: boolean, currentAppointmentData?: dxSchedulerAppointment): void;
    /**
     * @docid
     * @publicName showAppointmentTooltip(appointmentData, target, currentAppointmentData)
     * @param1 appointmentData:Object
     * @param2 target:string|Element|jQuery
     * @param3 currentAppointmentData:Object|undefined
     * @public
     */
    showAppointmentTooltip(appointmentData: dxSchedulerAppointment, target: string | UserDefinedElement, currentAppointmentData?: dxSchedulerAppointment): void;
    /**
     * @docid
     * @publicName updateAppointment(target, appointment)
     * @param1 target:Object
     * @param2 appointment:Object
     * @public
     */
    updateAppointment(target: any, appointment: any): void;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxSchedulerAppointment extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    allDay?: boolean;
    /**
     * @docid
     * @public
     */
    description?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @public
     */
    endDate?: Date | string;
    /**
     * @docid
     * @public
     */
    endDateTimeZone?: string;
    /**
     * @docid
     * @public
     */
    html?: string;
    /**
     * @docid
     * @public
     */
    recurrenceException?: string;
    /**
     * @docid
     * @public
     */
    recurrenceRule?: string;
    /**
     * @docid
     * @public
     */
    startDate?: Date | string;
    /**
     * @docid
     * @public
     */
    startDateTimeZone?: string;
    /**
     * @docid
     * @public
     */
    template?: template;
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
}

/** @public */
export type Properties = dxSchedulerOptions;

/** @deprecated use Properties instead */
export type Options = dxSchedulerOptions;

/**
 * @docid
 * @public
 * @namespace DevExpress.ui
 */
export interface dxSchedulerScrolling {
  /**
   * @docid
   * @type Enums.SchedulerScrollingMode
   * @default "standard"
   * @public
   */
  mode?: 'standard' | 'virtual';
}

/** @deprecated use Properties instead */
export type IOptions = dxSchedulerOptions;
