import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, { DataSourceLike } from '../data/data_source';

import {
    DxEvent,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    Cancelable,
} from '../events/index';

import {
    CollectionWidgetItem,
} from './collection/ui.collection_widget.base';

import dxDraggable from './draggable';

import dxForm from './form';
import dxPopup from './popup';

import dxSortable from './sortable';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    FirstDayOfWeek,
    Orientation,
    ScrollMode,
} from '../common';

interface AppointmentDraggingEvent {
  readonly component: dxScheduler;
  readonly event?: DxEvent<MouseEvent | TouchEvent>;
  readonly itemData?: any;
  readonly itemElement?: DxElement;
  readonly fromData?: any;
}

interface TargetedAppointmentInfo {
  readonly appointmentData: Appointment;
  readonly targetedAppointmentData?: Appointment;
}

export {
    FirstDayOfWeek,
    Orientation,
    ScrollMode,
};

/** @public */
export type AllDayPanelMode = 'all' | 'allDay' | 'hidden';
/** @public */
export type CellAppointmentsLimit = 'auto' | 'unlimited';
/** @public */
export type RecurrenceEditMode = 'dialog' | 'occurrence' | 'series';
/** @public */
export type ViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

/** @public */
export type AppointmentAddedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: Appointment;
  readonly error?: Error;
};

/** @public */
export type AppointmentAddingEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: Appointment;
  cancel: boolean | PromiseLike<boolean>;
};

/** @public */
export type AppointmentClickEvent = Cancelable & NativeEventInfo<dxScheduler, KeyboardEvent | MouseEvent | PointerEvent> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
};

/** @public */
export type AppointmentContextMenuEvent = NativeEventInfo<dxScheduler, MouseEvent | PointerEvent | TouchEvent> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
};

/** @public */
export type AppointmentDblClickEvent = Cancelable & NativeEventInfo<dxScheduler, MouseEvent | PointerEvent> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
};

/** @public */
export type AppointmentDeletedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: Appointment;
  readonly error?: Error;
};

/** @public */
export type AppointmentDeletingEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: Appointment;
  cancel: boolean | PromiseLike<boolean>;
};

/** @public */
export type AppointmentFormOpeningEvent = Cancelable & EventInfo<dxScheduler> & {
  readonly appointmentData?: Appointment;
  readonly form: dxForm;
  readonly popup: dxPopup;
};

/**
 * @docid
 * @public
 */
export type AppointmentTooltipShowingAppointmentInfo = {
  readonly appointmentData: Appointment;
  readonly currentAppointmentData: Appointment;
  readonly color: PromiseLike<string>;
};

/** @public */
export type AppointmentTooltipShowingEvent = Cancelable & EventInfo<dxScheduler> & {
  readonly targetElement: DxElement;
  readonly appointments: AppointmentTooltipShowingAppointmentInfo[];
};

/** @public */
export type AppointmentRenderedEvent = EventInfo<dxScheduler> & TargetedAppointmentInfo & {
  readonly appointmentElement: DxElement;
};

/** @public */
export type AppointmentUpdatedEvent = EventInfo<dxScheduler> & {
  readonly appointmentData: Appointment;
  readonly error?: Error;
};

/** @public */
export type AppointmentUpdatingEvent = EventInfo<dxScheduler> & {
  readonly oldData: any;
  readonly newData: any;
  cancel?: boolean | PromiseLike<boolean>;
};

/** @public */
export type CellClickEvent = Cancelable & NativeEventInfo<dxScheduler, KeyboardEvent | MouseEvent | PointerEvent> & {
  readonly cellData: any;
  readonly cellElement: DxElement;
};

/** @public */
export type CellContextMenuEvent = NativeEventInfo<dxScheduler, MouseEvent | PointerEvent | TouchEvent> & {
  readonly cellData: any;
  readonly cellElement: DxElement;
};

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
};

/** @public */
export type AppointmentDraggingEndEvent = Cancelable & AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
  readonly toData?: any;
};

/** @public */
export type AppointmentDraggingMoveEvent = Cancelable & AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
  readonly toData?: any;
};

/** @public */
export type AppointmentDraggingStartEvent = Cancelable & AppointmentDraggingEvent;

/** @public */
export type AppointmentDraggingRemoveEvent = AppointmentDraggingEvent & {
  readonly fromComponent?: dxSortable | dxDraggable;
  readonly toComponent?: dxSortable | dxDraggable;
};

/** @public */
export type AppointmentTemplateData = TargetedAppointmentInfo;

/** @public */
export type AppointmentTooltipTemplateData = TargetedAppointmentInfo & {
  readonly isButtonClicked: boolean;
};

/** @public */
export type AppointmentCollectorTemplateData = {
  readonly appointmentCount: number;
  readonly isCompact: boolean;
};

/** @public */
export type DateNavigatorTextInfo = {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly text: string;
};

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
      autoScroll?: boolean;
      /**
       * @docid
       * @default undefined
       */
      data?: any;
      /**
       * @docid
       * @default undefined
       */
      group?: string;
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field event:event
       */
      onAdd?: ((e: AppointmentDraggingAddEvent) => void);
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field event:event
       */
      onDragEnd?: ((e: AppointmentDraggingEndEvent) => void);
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field event:event
       */
      onDragMove?: ((e: AppointmentDraggingMoveEvent) => void);
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field event:event
       */
      onDragStart?: ((e: AppointmentDraggingStartEvent) => void);
      /**
       * @docid
       * @type_function_param1 e:object
       * @type_function_param1_field event:event
       */
      onRemove?: ((e: AppointmentDraggingRemoveEvent) => void);
      /**
       * @docid
       * @default 60
       */
      scrollSensitivity?: number;
      /**
       * @docid
       * @default 60
       */
      scrollSpeed?: number;
    };
    /**
     * @docid
     * @default "item"
     * @type_function_param1_field appointmentData:object
     * @type_function_param1_field targetedAppointmentData:object
     * @public
     */
    appointmentTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default "appointmentTooltip"
     * @type_function_param1_field appointmentData:object
     * @type_function_param1_field targetedAppointmentData:object
     * @public
     */
    appointmentTooltipTemplate?: template | ((model: AppointmentTooltipTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default 30
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
     * @default "day"
     * @fires dxSchedulerOptions.onOptionChanged
     * @public
     */
    currentView?: ViewType;
    /**
     * @docid
     * @type_function_param1 info:object
     * @default undefined
     * @public
     */
    customizeDateNavigatorText?: ((info: DateNavigatorTextInfo) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 itemData:object
     * @public
     */
    dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     * @type string|Array<dxSchedulerAppointment>|Store|DataSource|DataSourceOptions|null
     */
    dataSource?: DataSourceLike<Appointment> | null;
    /**
     * @docid
     * @default null
     * @type_function_param1 itemData:object
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
      * @default "dropDownAppointment"
      * @type_function_param1 itemData:object
      * @type_function_return string|Element|jQuery
      * @deprecated dxSchedulerOptions.appointmentTooltipTemplate
      * @public
      */
    dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
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
      allowAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowDeleting?: boolean;
      /**
       * @docid
       * @default true
       * @default false &for(Android|iOS)
       */
      allowDragging?: boolean;
      /**
       * @docid
       * @default true
       * @default false &for(Android|iOS)
       */
      allowResizing?: boolean;
      /**
       * @docid
       * @default false
       */
      allowTimeZoneEditing?: boolean;
      /**
       * @docid
       * @default true
       */
      allowUpdating?: boolean;
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
     * @default 24
     * @public
     */
    endDayHour?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    firstDayOfWeek?: FirstDayOfWeek;
    /**
     * @docid
     * @default true &for(desktop)
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
     * @default []
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
     * @default "auto"
     * @public
     */
    maxAppointmentsPerCell?: number | CellAppointmentsLimit;
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
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @action
     * @public
     */
    onAppointmentAdded?: ((e: AppointmentAddedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field cancel:Boolean|Promise<Boolean>
     * @action
     * @public
     */
    onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field targetedAppointmentData:dxSchedulerAppointment
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onAppointmentClick?: ((e: AppointmentClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field targetedAppointmentData:dxSchedulerAppointment
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field targetedAppointmentData:dxSchedulerAppointment
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field component:dxScheduler
     * @action
     * @public
     */
    onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);

    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field cancel:Boolean|Promise<Boolean>
     * @action
     * @public
     */
    onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointments:Array<object>
     * @action
     * @public
     */
    onAppointmentTooltipShowing?: ((e: AppointmentTooltipShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @action
     * @public
     */
    onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field targetedAppointmentData:dxSchedulerAppointment|undefined
     * @action
     * @public
     */
    onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field appointmentData:dxSchedulerAppointment
     * @type_function_param1_field component:dxScheduler
     * @action
     * @public
     */
    onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field oldData:Object
     * @type_function_param1_field newData:Object
     * @type_function_param1_field cancel:Boolean|Promise<Boolean>
     * @action
     * @public
     */
    onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field event:event
     * @type_function_param1_field cellData:object
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScheduler
     * @type_function_param1_field event:event
     * @type_function_param1_field cellData:object
     * @action
     * @public
     */
    onCellContextMenu?: ((e: CellContextMenuEvent) => void) | string;
    /**
     * @docid
     * @default "dialog"
     * @public
     */
    recurrenceEditMode?: RecurrenceEditMode;
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
     * @default null
     * @type_function_param1 itemData:object
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
      allowMultiple?: boolean;
      /**
       * @docid
       * @default "color"
       */
      colorExpr?: string;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @type_function_param1 resource:object
       * @default 'text'
       */
      displayExpr?: string | ((resource: any) => string);
      /**
       * @docid
       * @default ""
       */
      fieldExpr?: string;
      /**
       * @docid
       * @default ""
       */
      label?: string;
      /**
       * @docid
       * @default false
       */
      useColorAsDefault?: boolean;
      /**
       * @docid
       * @default 'id'
       */
      valueExpr?: string | Function;
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
     * @default 0
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
     * @default null
     * @type_function_param1 itemData:object
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
     * @default true &for(Android|iOS)
     * @default true &for(Material)
     * @public
     */
    useDropDownViewSwitcher?: boolean;
    /**
     * @docid
     * @default "all"
     */
    allDayPanelMode?: AllDayPanelMode;
    /**
     * @docid
     * @default ['day', 'week']
     * @public
     */
    views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | {
      /**
       * @docid
       * @default 7
       */
      agendaDuration?: number;
      /**
       * @docid
       * @default "appointmentCollector"
       */
      appointmentCollectorTemplate?: template | ((data: AppointmentCollectorTemplateData, collectorElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default "item"
       * @type_function_param1_field appointmentData:object
       * @type_function_param1_field targetedAppointmentData:object
       */
      appointmentTemplate?: template | ((model: AppointmentTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default "appointmentTooltip"
       * @type_function_param1_field appointmentData:object
       * @type_function_param1_field targetedAppointmentData:object
       */
      appointmentTooltipTemplate?: template | ((model: AppointmentTooltipTemplateData, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
      /**
      * @docid
      * @default "dropDownAppointment"
      * @type_function_param1 itemData:object
      * @type_function_return string|Element|jQuery
      * @deprecated dxSchedulerOptions.views.appointmentTooltipTemplate
      */
      dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default 30
       */
      cellDuration?: number;
      /**
       * @docid
       * @default null
       * @type_function_param1 itemData:object
       */
      dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default null
       * @type_function_param1 itemData:object
       */
      dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default 24
       */
      endDayHour?: number;
      /**
       * @docid
       * @default undefined
       */
      firstDayOfWeek?: FirstDayOfWeek;
      /**
       * @docid
       * @default false
       */
      groupByDate?: boolean;
      /**
       * @docid
       */
      groupOrientation?: Orientation;
      /**
       * @docid
       * @default []
       */
      groups?: Array<string>;
      /**
       * @docid
       * @default 1
       */
      intervalCount?: number;
      /**
       * @docid
       * @default "auto"
       */
      maxAppointmentsPerCell?: number | CellAppointmentsLimit;
      /**
       * @docid
       * @default undefined
       */
      name?: string;
      /**
       * @docid
       * @default null
       * @type_function_param1 itemData:object
       */
      resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default undefined
       */
      startDate?: Date | number | string;
      /**
       * @docid
       * @default 0
       */
      startDayHour?: number;
      /**
       * @docid
       * @default null
       * @type_function_param1 itemData:object
       */
      timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default undefined
       */
      type?: ViewType;
      /**
       * @docid
       */
      scrolling?: dxSchedulerScrolling;
      /**
       * @docid
       * @default "all"
       */
       allDayPanelMode?: AllDayPanelMode;
    }>;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @namespace DevExpress.ui
 * @public
 */
export default class dxScheduler extends Widget<dxSchedulerOptions> {
    /**
     * @docid
     * @publicName addAppointment(appointment)
     * @param1 appointment:dxSchedulerAppointment
     * @public
     */
    addAppointment(appointment: Appointment): void;
    /**
     * @docid
     * @publicName deleteAppointment(appointment)
     * @param1 appointment:dxSchedulerAppointment
     * @public
     */
    deleteAppointment(appointment: Appointment): void;
    /**
     * @docid
     * @publicName deleteRecurrence(appointment, date, recurrenceEditMode)
     * @param1 appointmentData:dxSchedulerAppointment
     * @public
     */
    deleteRecurrence(
      appointmentData: Appointment,
      date: Date | string,
      recurrenceEditMode: RecurrenceEditMode,
    ): void;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getEndViewDate()
     * @public
     */
    getEndViewDate(): Date;
    /**
     * @docid
     * @publicName getStartViewDate()
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
     * @param2 group:Object|undefined
     * @param3 allDay:Boolean|undefined
     * @public
     */
    scrollTo(date: Date, group?: object, allDay?: boolean): void;
    /**
     * @docid
     * @publicName scrollToTime(hours, minutes, date)
     * @param3 date:Date|undefined
     * @deprecated dxScheduler.scrollTo
     * @public
     */
    scrollToTime(hours: number, minutes: number, date?: Date): void;
    /**
     * @docid
     * @publicName showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)
     * @param1 appointmentData:dxSchedulerAppointment|undefined
     * @param2 createNewAppointment:Boolean|undefined
     * @param3 currentAppointmentData:dxSchedulerAppointment|undefined
     * @public
     */
    showAppointmentPopup(appointmentData?: Appointment, createNewAppointment?: boolean, currentAppointmentData?: Appointment): void;
    /**
     * @docid
     * @publicName showAppointmentTooltip(appointmentData, target, currentAppointmentData)
     * @param1 appointmentData:dxSchedulerAppointment
     * @param2 target:string|Element|jQuery
     * @param3 currentAppointmentData:dxSchedulerAppointment|undefined
     * @public
     */
    showAppointmentTooltip(appointmentData: Appointment, target: string | UserDefinedElement, currentAppointmentData?: Appointment): void;
    /**
     * @docid
     * @publicName updateAppointment(target, appointment)
     * @param1 target:dxSchedulerAppointment
     * @param2 appointment:dxSchedulerAppointment
     * @public
     */
    updateAppointment(target: Appointment, appointment: Appointment): void;
}

/**
 * @public
 * @docid dxSchedulerAppointment
 * @namespace DevExpress.ui
 * @inherits CollectionWidgetItem
 * @type object
 */
export type Appointment = dxSchedulerAppointment;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the Scheduler's Appointment type instead
 */
export type dxSchedulerAppointment = CollectionWidgetItem & {
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
} & Record<string, any>;

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
   * @default "standard"
   * @public
   */
  mode?: ScrollMode;
}

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentAdded
 * @type_function_param1 e:{ui/scheduler:AppointmentAddedEvent}
 */
onAppointmentAdded?: ((e: AppointmentAddedEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentAdding
 * @type_function_param1 e:{ui/scheduler:AppointmentAddingEvent}
 */
onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentClick
 * @type_function_param1 e:{ui/scheduler:AppointmentClickEvent}
 */
onAppointmentClick?: ((e: AppointmentClickEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentContextMenu
 * @type_function_param1 e:{ui/scheduler:AppointmentContextMenuEvent}
 */
onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentDblClick
 * @type_function_param1 e:{ui/scheduler:AppointmentDblClickEvent}
 */
onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentDeleted
 * @type_function_param1 e:{ui/scheduler:AppointmentDeletedEvent}
 */
onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentDeleting
 * @type_function_param1 e:{ui/scheduler:AppointmentDeletingEvent}
 */
onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentFormOpening
 * @type_function_param1 e:{ui/scheduler:AppointmentFormOpeningEvent}
 */
onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentRendered
 * @type_function_param1 e:{ui/scheduler:AppointmentRenderedEvent}
 */
onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentTooltipShowing
 * @type_function_param1 e:{ui/scheduler:AppointmentTooltipShowingEvent}
 */
onAppointmentTooltipShowing?: ((e: AppointmentTooltipShowingEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentUpdated
 * @type_function_param1 e:{ui/scheduler:AppointmentUpdatedEvent}
 */
onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onAppointmentUpdating
 * @type_function_param1 e:{ui/scheduler:AppointmentUpdatingEvent}
 */
onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onCellClick
 * @type_function_param1 e:{ui/scheduler:CellClickEvent}
 */
onCellClick?: ((e: CellClickEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onCellContextMenu
 * @type_function_param1 e:{ui/scheduler:CellContextMenuEvent}
 */
onCellContextMenu?: ((e: CellContextMenuEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onContentReady
 * @type_function_param1 e:{ui/scheduler:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onDisposing
 * @type_function_param1 e:{ui/scheduler:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onInitialized
 * @type_function_param1 e:{ui/scheduler:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxSchedulerOptions.onOptionChanged
 * @type_function_param1 e:{ui/scheduler:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
