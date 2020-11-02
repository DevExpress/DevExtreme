import '../jquery_augmentation';
import './scheduler/utils';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
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

export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @type string
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
    appointmentCollectorTemplate?: template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
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
       * @type function(e)
       * @type_function_param1 e:object
       * @type_function_param1_field1 event:event
       * @type_function_param1_field2 itemData:any
       * @type_function_param1_field3 itemElement:dxElement
       * @type_function_param1_field4 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field5 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 fromData:any
       * @type_function_param1_field7 toData:any
       */
      onAdd?: ((e: { event?: event, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any),
      /**
       * @docid
       * @type function(e)
       * @type_function_param1 e:object
       * @type_function_param1_field1 event:event
       * @type_function_param1_field2 cancel:boolean
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 fromData:any
       * @type_function_param1_field8 toData:any
       */
      onDragEnd?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any),
      /**
       * @docid
       * @type function(e)
       * @type_function_param1 e:object
       * @type_function_param1_field1 event:event
       * @type_function_param1_field2 cancel:boolean
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field7 fromData:any
       * @type_function_param1_field8 toData:any
       */
      onDragMove?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any),
      /**
       * @docid
       * @type function(e)
       * @type_function_param1 e:object
       * @type_function_param1_field1 event:event
       * @type_function_param1_field2 cancel:boolean
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromData:any
       */
      onDragStart?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromData?: any }) => any),
      /**
       * @docid
       * @type function(e)
       * @type_function_param1 e:object
       * @type_function_param1_field1 event:event
       * @type_function_param1_field2 itemData:any
       * @type_function_param1_field3 itemElement:dxElement
       * @type_function_param1_field4 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field5 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field6 fromData:any
       */
      onRemove?: ((e: { event?: event, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any }) => any),
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @extends AppointmentTooltipTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentTooltipTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @extends CellDuration
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellDuration?: number;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    crossScrollingEnabled?: boolean;
    /**
     * @docid
     * @type Date|number|string
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
     * @type function(info)
     * @type_function_param1 info:object
     * @type_function_param1_field1 startDate:date
     * @type_function_param1_field2 endDate:date
     * @type_function_param1_field3 text:string
     * @type_function_return string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeDateNavigatorText?: ((info: { startDate?: Date, endDate?: Date, text?: string }) => string);
    /**
     * @docid
     * @extends DataCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type string|Array<dxSchedulerAppointment>|DataSource|DataSourceOptions
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
    dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @type string
     * @default 'description'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    descriptionExpr?: string;
    /**
     * @docid
     * @type template|function
     * @default "dropDownAppointment"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @deprecated dxSchedulerOptions.appointmentTooltipTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type boolean|object
     * @default true
     * @prevFileNamespace DevExpress.ui
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
      /**
       * @docid
       * @default false
       * @deprecated dxSchedulerOptions.editing.allowTimeZoneEditing
       */
      allowEditingTimeZones?: boolean
    };
    /**
     * @docid
     * @type string
     * @default 'endDate'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateExpr?: string;
    /**
     * @docid
     * @type string
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
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type boolean
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
     * @type number
     * @default 300000
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorUpdateInterval?: number;
    /**
     * @docid
     * @type Date|number|string
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
     * @type Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @type string
     * @default "No data to display"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentAdded?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, error?: Error }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentAdding?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, cancel: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
    /**
     * @docid
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:dxElement
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentClick?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, targetedAppointmentData?: any, appointmentElement: dxElement, event?: event, cancel: boolean }) => any) | string;
    /**
     * @docid
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:dxElement
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentContextMenu?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, targetedAppointmentData?: any, appointmentElement: dxElement, event?: event }) => any) | string;
    /**
     * @docid
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object
     * @type_function_param1_field6 appointmentElement:dxElement
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentDblClick?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, targetedAppointmentData?: any, appointmentElement: dxElement, event?: event, cancel: boolean }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentDeleted?: ((e: { component: dxScheduler, element: dxElement, model: any, appointmentData: any, error?: Error }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentDeleting?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, cancel: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 form:dxForm
     * @type_function_param1_field6 popup:dxPopup
     * @type_function_param1_field7 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentFormOpening?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData?: any, form: dxForm, popup: dxPopup, cancel: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:object
     * @type_function_param1_field5 targetedAppointmentData:object|undefined
     * @type_function_param1_field6 appointmentElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentRendered?: ((e: { component: dxScheduler, element: dxElement, model: any, appointmentData: any, targetedAppointmentData?: any, appointmentElement?: dxElement }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 appointmentData:Object
     * @type_function_param1_field5 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentUpdated?: ((e: { component: dxScheduler, element: dxElement, model?: any, appointmentData: any, error?: Error }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 oldData:Object
     * @type_function_param1_field5 newData:Object
     * @type_function_param1_field6 cancel:Boolean|Promise<Boolean>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAppointmentUpdating?: ((e: { component: dxScheduler, element: dxElement, model?: any, oldData?: any, newData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
    /**
     * @docid
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cellData:object
     * @type_function_param1_field5 cellElement:dxElement
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 cancel:Boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: { component: dxScheduler, element: dxElement, model?: any, cellData: any, cellElement: dxElement, event?: event, cancel: boolean }) => any) | string;
    /**
     * @docid
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cellData:object
     * @type_function_param1_field5 cellElement:dxElement
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellContextMenu?: ((e: { component: dxScheduler, element: dxElement, model?: any, cellData: any, cellElement: dxElement, event?: event }) => any) | string;
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
     * @type string
     * @default 'recurrenceException'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceExceptionExpr?: string;
    /**
     * @docid
     * @type string
     * @default 'recurrenceRule'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceRuleExpr?: string;
    /**
     * @docid
     * @type boolean
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
    resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type Array<Object>
     * @default []
     * @prevFileNamespace DevExpress.ui
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
       * @type string|Array<Object>|DataSource|DataSourceOptions
       * @default null
       */
      dataSource?: string | Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @type string|function(resource)
       * @type_function_param1 resource:object
       * @default 'text'
       * @type_function_return string
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
       * @type string|function
       * @default 'id'
       */
      valueExpr?: string | Function
    }>;
    /**
     * @docid
     * @type dxSchedulerScrolling
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: dxSchedulerScrolling;
    /**
     * @docid
     * @readonly
     * @type Array<any>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedCellData?: Array<any>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadeUntilCurrentTime?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAllDayPanel?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCurrentTimeIndicator?: boolean;
    /**
     * @docid
     * @type string
     * @default 'startDate'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateExpr?: string;
    /**
     * @docid
     * @type string
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
     * @type string
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
    timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    timeZone?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @default true [for](Android|iOS)
     * @default true [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useDropDownViewSwitcher?: boolean;
    /**
     * @docid
     * @type Array<string, object>
     * @default ['day', 'week']
     * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
     * @prevFileNamespace DevExpress.ui
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
      appointmentCollectorTemplate?: template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: dxElement) => string | Element | JQuery),
      /**
       * @docid
       * @extends AppointmentTemplate
       */
      appointmentTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery),
      /**
       * @docid
       * @extends AppointmentTooltipTemplate
       */
      appointmentTooltipTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery),
      /**
       * @docid
       * @extends CellDuration
       */
      cellDuration?: number,
      /**
       * @docid
       * @extends DataCellTemplate
       */
      dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery),
      /**
       * @docid
       * @extends DateCellTemplate
       */
      dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery),
      /**
       * @docid
       * @type template|function
       * @default "dropDownAppointment"
       * @type_function_param1 itemData:object
       * @type_function_param2 itemIndex:number
       * @type_function_param3 contentElement:dxElement
       * @type_function_return string|Element|jQuery
       * @deprecated dxSchedulerOptions.views.appointmentTooltipTemplate
       */
      dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: dxElement) => string | Element | JQuery),
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
      resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery),
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
      timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery),
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
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxScheduler extends Widget {
    constructor(element: Element, options?: dxSchedulerOptions)
    constructor(element: JQuery, options?: dxSchedulerOptions)
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
     * @publicName scrollToTime(hours, minutes, date)
     * @param1 hours:Number
     * @param2 minutes:Number
     * @param3 date:Date|undefined
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
    showAppointmentTooltip(appointmentData: any, target: string | Element | JQuery, currentAppointmentData?: any): void;
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
     * @type Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allDay?: boolean;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    description?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @type Date
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDate?: Date;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateTimeZone?: string;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    html?: string;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceException?: string;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceRule?: string;
    /**
     * @docid
     * @type Date
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDate?: Date;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateTimeZone?: string;
    /**
     * @docid
     * @type template
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template;
    /**
     * @docid
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}

declare global {
interface JQuery {
    dxScheduler(): JQuery;
    dxScheduler(options: "instance"): dxScheduler;
    dxScheduler(options: string): any;
    dxScheduler(options: string, ...params: any[]): any;
    dxScheduler(options: dxSchedulerOptions): JQuery;
}
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
