import './scheduler/utils';

import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent,
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
  readonly event?: TEvent;
  readonly itemData?: any;
  readonly itemElement?: TElement;
  readonly fromData?: any;
}

interface TargetedAppointmentInfo {
  readonly appointmentData: any;
  readonly targetedAppointmentData?: any;
}

/** @public */
export type AppointmentAddedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  readonly error?: Error;
}

/** @public */
export type AppointmentAddingEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  cancel: boolean | TPromise<boolean>;
}

/** @public */
export type AppointmentClickEvent = Cancelable & NativeEventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: TElement;
}

/** @public */
export type AppointmentContextMenuEvent = NativeEventInfo<dxScheduler> & TargetedAppointmentInfo &{
  readonly appointmentElement: TElement;
}

/** @public */
export type AppointmentDblClickEvent = Cancelable & NativeEventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: TElement;
}

/** @public */
export type AppointmentDeletedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  readonly error?: Error;
}

/** @public */
export type AppointmentDeletingEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: any;
  cancel: boolean | TPromise<boolean>;
}

/** @public */
export type AppointmentFormOpeningEvent = Cancelable & EventInfo<dxScheduler> & {
  readonly appointmentData?: any;
  readonly form: dxForm;
  readonly popup: dxPopup;
}

/** @public */
export type AppointmentRenderedEvent = EventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: TElement;
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
  cancel?: boolean | TPromise<boolean>;
}

/** @public */
export type CellClickEvent = Cancelable & NativeEventInfo<dxScheduler> & {
  readonly cellData: any;
  readonly cellElement: TElement;
}

/** @public */
export type CellContextMenuEvent = NativeEventInfo<dxScheduler> & {
  readonly cellData: any;
  readonly cellElement: TElement;
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

export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @default 'allDay'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allDayExpr?: string;
    /**
     * @docid
     * @default "appointmentCollector"
     * @extends AppointmentCollectorTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentCollectorTemplate?: template | ((data: AppointmentCollectorTemplateData, collectorElement: TElement) => string | TElement);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentDragging?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      autoScroll?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      data?: any,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      group?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 fromData:any
       * @type_function_param1_field8 toData:any
       */
      onAdd?: ((e: AppointmentDraggingAddEvent) => void),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 fromData:any
       * @type_function_param1_field9 toData:any
       */
      onDragEnd?: ((e: AppointmentDraggingEndEvent) => void),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 fromData:any
       * @type_function_param1_field9 toData:any
       */
      onDragMove?: ((e: AppointmentDraggingMoveEvent) => void),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromData:any
       */
      onDragStart?: ((e: AppointmentDraggingStartEvent) => void),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:dxScheduler
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 fromData:any
       */
      onRemove?: ((e: AppointmentDraggingRemoveEvent) => void),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 60
       */
      scrollSensitivity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 60
       */
      scrollSpeed?: number
    };
    /**
     * @docid
     * @extends AppointmentTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: TElement) => string | TElement);
    /**
     * @docid
     * @extends AppointmentTooltipTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentTooltipTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: TElement) => string | TElement);
    /**
     * @docid
     * @extends CellDuration
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellDuration?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    crossScrollingEnabled?: boolean;
    /**
     * @docid
     * @default new Date()
     * @fires dxSchedulerOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentDate?: Date | number | string;
    /**
     * @docid
     * @type Enums.SchedulerViewType
     * @default "day"
     * @fires dxSchedulerOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeDateNavigatorText?: ((info: DateNavigatorTextInfo) => string);
    /**
     * @docid
     * @extends DataCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxSchedulerAppointment> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @extends DateCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @default 'description'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    descriptionExpr?: string;
    /**
     * @docid
     * @default "dropDownAppointment"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @deprecated dxSchedulerOptions.appointmentTooltipTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: TElement) => string | TElement);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: boolean | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowAdding?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowDeleting?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       * @default false [for](Android|iOS)
       */
      allowDragging?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       * @default false [for](Android|iOS)
       */
      allowResizing?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowTimeZoneEditing?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowUpdating?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       * @deprecated dxSchedulerOptions.editing.allowTimeZoneEditing
       */
      allowEditingTimeZones?: boolean
    };
    /**
     * @docid
     * @default 'endDate'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateExpr?: string;
    /**
     * @docid
     * @default 'endDateTimeZone'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateTimeZoneExpr?: string;
    /**
     * @docid
     * @extends EndDayHour
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDayHour?: number;
    /**
     * @docid
     * @type Enums.FirstDayOfWeek
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupByDate?: boolean;
    /**
     * @docid
     * @extends Groups
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groups?: Array<string>;
    /**
     * @docid
     * @default 300000
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorUpdateInterval?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid
     * @type number|Enums.MaxAppointmentsPerCell
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @default "No data to display"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentAdded?: ((e: AppointmentAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:dxElement
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentClick?: ((e: AppointmentClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:dxElement
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:dxElement
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 form:dxForm
     * @type_function_param1_field6 popup:dxPopup
     * @type_function_param1_field7 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object|undefined
     * @type_function_param1_field6 appointmentElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 oldData:Object
     * @type_function_param1_field5 newData:Object
     * @type_function_param1_field6 cancel:Boolean|Promise<Boolean>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellData:object
     * @type_function_param1_field5 cellElement:dxElement
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScheduler
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellData:object
     * @type_function_param1_field5 cellElement:dxElement
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellContextMenu?: ((e: CellContextMenuEvent) => void) | string;
    /**
     * @docid
     * @type Enums.SchedulerRecurrenceEditMode
     * @default "dialog"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
    /**
     * @docid
     * @default 'recurrenceException'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceExceptionExpr?: string;
    /**
     * @docid
     * @default 'recurrenceRule'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceRuleExpr?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    remoteFiltering?: boolean;
    /**
     * @docid
     * @extends ResourceCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resources?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowMultiple?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "color"
       */
      colorExpr?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: string | Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 resource:object
       * @type_function_return string
       * @default 'text'
       */
      displayExpr?: string | ((resource: any) => string),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default ""
       */
      fieldExpr?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default ""
       */
      label?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      useColorAsDefault?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 'id'
       */
      valueExpr?: string | Function
    }>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: dxSchedulerScrolling;
    /**
     * @docid
     * @readonly
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedCellData?: Array<any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadeUntilCurrentTime?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAllDayPanel?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCurrentTimeIndicator?: boolean;
    /**
     * @docid
     * @default 'startDate'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateExpr?: string;
    /**
     * @docid
     * @default 'startDateTimeZone'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateTimeZoneExpr?: string;
    /**
     * @docid
     * @extends StartDayHour
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDayHour?: number;
    /**
     * @docid
     * @default 'text'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    textExpr?: string;
    /**
     * @docid
     * @extends TimeCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    timeZone?: string;
    /**
     * @docid
     * @default false
     * @default true [for](Android|iOS)
     * @default true [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useDropDownViewSwitcher?: boolean;
    /**
     * @docid
     * @type Array<string,object>
     * @default ['day', 'week']
     * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 7
       */
      agendaDuration?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "appointmentCollector"
       * @extends AppointmentCollectorTemplate
       */
      appointmentCollectorTemplate?: template | ((data: AppointmentCollectorTemplateData, collectorElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends AppointmentTemplate
       */
      appointmentTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends AppointmentTooltipTemplate
       */
      appointmentTooltipTemplate?: template | ((model: AppointmentTooltipTemplateData, itemIndex: number, contentElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends CellDuration
       */
      cellDuration?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends DataCellTemplate
       */
      dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends DateCellTemplate
       */
      dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "dropDownAppointment"
       * @type_function_param1 itemData:object
       * @type_function_param2 itemIndex:number
       * @type_function_param3 contentElement:dxElement
       * @type_function_return string|Element|jQuery
       * @deprecated dxSchedulerOptions.views.appointmentTooltipTemplate
       */
      dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends EndDayHour
       */
      endDayHour?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.FirstDayOfWeek
       * @default undefined
       */
      firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      groupByDate?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.Orientation
       */
      groupOrientation?: 'horizontal' | 'vertical',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends Groups
       */
      groups?: Array<string>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 1
       */
      intervalCount?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type number|Enums.MaxAppointmentsPerCell
       * @default "auto"
       */
      maxAppointmentsPerCell?: number | 'auto' | 'unlimited',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      name?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends ResourceCellTemplate
       */
      resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      startDate?: Date | number | string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends StartDayHour
       */
      startDayHour?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @extends TimeCellTemplate
       */
      timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.SchedulerViewType
       * @default undefined
       */
      type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      scrolling?: dxSchedulerScrolling
    }>;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/scheduler
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxScheduler extends Widget {
    constructor(element: TElement, options?: dxSchedulerOptions)
    /**
     * @docid
     * @publicName addAppointment(appointment)
     * @param1 appointment:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addAppointment(appointment: any): void;
    /**
     * @docid
     * @publicName deleteAppointment(appointment)
     * @param1 appointment:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteAppointment(appointment: any): void;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getEndViewDate()
     * @return Date
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getEndViewDate(): Date;
    /**
     * @docid
     * @publicName getStartViewDate()
     * @return Date
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getStartViewDate(): Date;
    /**
     * @docid
     * @publicName hideAppointmentPopup(saveChanges)
     * @param1 saveChanges:Boolean|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideAppointmentPopup(saveChanges?: boolean): void;
    /**
     * @docid
     * @publicName hideAppointmentTooltip()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideAppointmentTooltip(): void;
    /**
     * @docid
     * @publicName scrollTo(date, group, allDay)
     * @param1 date:Date
     * @param2 group:Object|undefined
     * @param3 allDay:Boolean|undefined
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToTime(hours: number, minutes: number, date?: Date): void;
    /**
     * @docid
     * @publicName showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)
     * @param1 appointmentData:Object|undefined
     * @param2 createNewAppointment:Boolean|undefined
     * @param3 currentAppointmentData:Object|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean, currentAppointmentData?: any): void;
    /**
     * @docid
     * @publicName showAppointmentTooltip(appointmentData, target, currentAppointmentData)
     * @param1 appointmentData:Object
     * @param2 target:string|Element|jQuery
     * @param3 currentAppointmentData:Object|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAppointmentTooltip(appointmentData: any, target: string | TElement, currentAppointmentData?: any): void;
    /**
     * @docid
     * @publicName updateAppointment(target, appointment)
     * @param1 target:Object
     * @param2 appointment:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateAppointment(target: any, appointment: any): void;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxSchedulerAppointment extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allDay?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    description?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDate?: Date | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateTimeZone?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    html?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceException?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceRule?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDate?: Date | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateTimeZone?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}

export type Options = dxSchedulerOptions;

/**
 * @docid
 * @public
 */
export interface dxSchedulerScrolling {
  /**
   * @docid
   * @type Enums.SchedulerScrollingMode
   * @default "standard"
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  mode?: 'standard' | 'virtual';
}

/** @deprecated use Options instead */
export type IOptions = dxSchedulerOptions;
