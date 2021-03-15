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
     * @docid dxSchedulerOptions.adaptivityEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid dxSchedulerOptions.allDayExpr
     * @type string
     * @default 'allDay'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allDayExpr?: string;
    /**
     * @docid dxSchedulerOptions.appointmentCollectorTemplate
     * @default "appointmentCollector"
     * @extends AppointmentCollectorTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentCollectorTemplate?: template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.appointmentDragging
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentDragging?: { autoScroll?: boolean, data?: any, group?: string, onAdd?: ((e: { component: dxScheduler, event?: event, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragEnd?: ((e: { component: dxScheduler, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragMove?: ((e: { component: dxScheduler, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragStart?: ((e: { component: dxScheduler, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromData?: any }) => any), onRemove?: ((e: { component: dxScheduler, event?: event, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any }) => any), scrollSensitivity?: number, scrollSpeed?: number };
    /**
     * @docid dxSchedulerOptions.appointmentTemplate
     * @extends AppointmentTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.appointmentTooltipTemplate
     * @extends AppointmentTooltipTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    appointmentTooltipTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.cellDuration
     * @extends CellDuration
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellDuration?: number;
    /**
     * @docid dxSchedulerOptions.crossScrollingEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    crossScrollingEnabled?: boolean;
    /**
     * @docid dxSchedulerOptions.currentDate
     * @type Date|number|string
     * @default new Date()
     * @fires dxSchedulerOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentDate?: Date | number | string;
    /**
     * @docid dxSchedulerOptions.currentView
     * @type Enums.SchedulerViewType
     * @default "day"
     * @fires dxSchedulerOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
    /**
     * @docid dxSchedulerOptions.customizeDateNavigatorText
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
     * @docid dxSchedulerOptions.dataCellTemplate
     * @extends DataCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.dataSource
     * @type string|Array<dxSchedulerAppointment>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxSchedulerAppointment> | DataSource | DataSourceOptions;
    /**
     * @docid dxSchedulerOptions.dateCellTemplate
     * @extends DateCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.dateSerializationFormat
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid dxSchedulerOptions.descriptionExpr
     * @type string
     * @default 'description'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    descriptionExpr?: string;
    /**
     * @docid dxSchedulerOptions.dropDownAppointmentTemplate
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
     * @docid dxSchedulerOptions.editing
     * @type boolean|object
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowResizing?: boolean, allowUpdating?: boolean, allowEditingTimeZones?: boolean };
    /**
     * @docid dxSchedulerOptions.endDateExpr
     * @type string
     * @default 'endDate'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateExpr?: string;
    /**
     * @docid dxSchedulerOptions.endDateTimeZoneExpr
     * @type string
     * @default 'endDateTimeZone'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateTimeZoneExpr?: string;
    /**
     * @docid dxSchedulerOptions.endDayHour
     * @extends EndDayHour
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDayHour?: number;
    /**
     * @docid dxSchedulerOptions.firstDayOfWeek
     * @extends FirstDayOfWeek
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid dxSchedulerOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxSchedulerOptions.groupByDate
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupByDate?: boolean;
    /**
     * @docid dxSchedulerOptions.groups
     * @extends Groups
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groups?: Array<string>;
    /**
     * @docid dxSchedulerOptions.indicatorUpdateInterval
     * @type number
     * @default 300000
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorUpdateInterval?: number;
    /**
     * @docid dxSchedulerOptions.max
     * @type Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid dxSchedulerOptions.maxAppointmentsPerCell
     * @type number|Enums.MaxAppointmentsPerCell
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
    /**
     * @docid dxSchedulerOptions.min
     * @type Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid dxSchedulerOptions.noDataText
     * @type string
     * @default "No data to display"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid dxSchedulerOptions.onAppointmentAdded
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
     * @docid dxSchedulerOptions.onAppointmentAdding
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
     * @docid dxSchedulerOptions.onAppointmentClick
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
     * @docid dxSchedulerOptions.onAppointmentContextMenu
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
     * @docid dxSchedulerOptions.onAppointmentDblClick
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
     * @docid dxSchedulerOptions.onAppointmentDeleted
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
     * @docid dxSchedulerOptions.onAppointmentDeleting
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
     * @docid dxSchedulerOptions.onAppointmentFormOpening
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
     * @docid dxSchedulerOptions.onAppointmentRendered
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
     * @docid dxSchedulerOptions.onAppointmentUpdated
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
     * @docid dxSchedulerOptions.onAppointmentUpdating
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
     * @docid dxSchedulerOptions.onCellClick
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
     * @docid dxSchedulerOptions.onCellContextMenu
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
     * @docid dxSchedulerOptions.recurrenceEditMode
     * @type Enums.SchedulerRecurrenceEditMode
     * @default "dialog"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
    /**
     * @docid dxSchedulerOptions.recurrenceExceptionExpr
     * @type string
     * @default 'recurrenceException'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceExceptionExpr?: string;
    /**
     * @docid dxSchedulerOptions.recurrenceRuleExpr
     * @type string
     * @default 'recurrenceRule'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceRuleExpr?: string;
    /**
     * @docid dxSchedulerOptions.remoteFiltering
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    remoteFiltering?: boolean;
    /**
     * @docid dxSchedulerOptions.resourceCellTemplate
     * @extends ResourceCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.resources
     * @type Array<Object>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resources?: Array<{ allowMultiple?: boolean, colorExpr?: string, dataSource?: string | Array<any> | DataSource | DataSourceOptions, displayExpr?: string | ((resource: any) => string), fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: string | Function }>;
    /**
     * @docid dxSchedulerOptions.scrolling
     * @type dxSchedulerScrolling
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: dxSchedulerScrolling;
    /**
     * @docid dxSchedulerOptions.selectedCellData
     * @readonly
     * @type Array<any>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedCellData?: Array<any>;
    /**
     * @docid dxSchedulerOptions.shadeUntilCurrentTime
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadeUntilCurrentTime?: boolean;
    /**
     * @docid dxSchedulerOptions.showAllDayPanel
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAllDayPanel?: boolean;
    /**
     * @docid dxSchedulerOptions.showCurrentTimeIndicator
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCurrentTimeIndicator?: boolean;
    /**
     * @docid dxSchedulerOptions.startDateExpr
     * @type string
     * @default 'startDate'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateExpr?: string;
    /**
     * @docid dxSchedulerOptions.startDateTimeZoneExpr
     * @type string
     * @default 'startDateTimeZone'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateTimeZoneExpr?: string;
    /**
     * @docid dxSchedulerOptions.startDayHour
     * @extends StartDayHour
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDayHour?: number;
    /**
     * @docid dxSchedulerOptions.textExpr
     * @type string
     * @default 'text'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    textExpr?: string;
    /**
     * @docid dxSchedulerOptions.timeCellTemplate
     * @extends TimeCellTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSchedulerOptions.timeZone
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    timeZone?: string;
    /**
     * @docid dxSchedulerOptions.useDropDownViewSwitcher
     * @type boolean
     * @default false
     * @default true [for](Android|iOS)
     * @default true [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useDropDownViewSwitcher?: boolean;
    /**
     * @docid dxSchedulerOptions.views
     * @type Array<string, object>
     * @default ['day', 'week']
     * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | { agendaDuration?: number, appointmentCollectorTemplate?: template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: dxElement) => string | Element | JQuery), appointmentTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery), appointmentTooltipTemplate?: template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: dxElement) => string | Element | JQuery), cellDuration?: number, dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery), dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery), dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, contentElement: dxElement) => string | Element | JQuery), endDayHour?: number, firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6, groupByDate?: boolean, groupOrientation?: 'horizontal' | 'vertical', groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: number | 'auto' | 'unlimited', name?: string, resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery), startDate?: Date | number | string, startDayHour?: number, timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery), type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek', scrolling?: dxSchedulerScrolling }>;
}
/**
 * @docid dxScheduler
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
     * @docid dxSchedulerMethods.addAppointment
     * @publicName addAppointment(appointment)
     * @param1 appointment:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addAppointment(appointment: any): void;
    /**
     * @docid dxSchedulerMethods.deleteAppointment
     * @publicName deleteAppointment(appointment)
     * @param1 appointment:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteAppointment(appointment: any): void;
    getDataSource(): DataSource;
    /**
     * @docid dxSchedulerMethods.getEndViewDate
     * @publicName getEndViewDate()
     * @return Date
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getEndViewDate(): Date;
    /**
     * @docid dxSchedulerMethods.getStartViewDate
     * @publicName getStartViewDate()
     * @return Date
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getStartViewDate(): Date;
    /**
     * @docid dxSchedulerMethods.hideAppointmentPopup
     * @publicName hideAppointmentPopup(saveChanges)
     * @param1 saveChanges:Boolean|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideAppointmentPopup(saveChanges?: boolean): void;
    /**
     * @docid dxSchedulerMethods.hideAppointmentTooltip
     * @publicName hideAppointmentTooltip()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideAppointmentTooltip(): void;
    /**
     * @docid dxSchedulerMethods.scrollTo
     * @publicName scrollTo(date, group, allDay)
     * @param1 date:Date
     * @param2 group:Object|undefined
     * @param3 allDay:Boolean|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTo(date: Date, group?: object, allDay?: boolean): void;
    /**
     * @docid dxSchedulerMethods.scrollToTime
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
     * @docid dxSchedulerMethods.showAppointmentPopup
     * @publicName showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)
     * @param1 appointmentData:Object|undefined
     * @param2 createNewAppointment:Boolean|undefined
     * @param3 currentAppointmentData:Object|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean, currentAppointmentData?: any): void;
    /**
     * @docid dxSchedulerMethods.showAppointmentTooltip
     * @publicName showAppointmentTooltip(appointmentData, target, currentAppointmentData)
     * @param1 appointmentData:Object
     * @param2 target:string|Element|jQuery
     * @param3 currentAppointmentData:Object|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAppointmentTooltip(appointmentData: any, target: string | Element | JQuery, currentAppointmentData?: any): void;
    /**
     * @docid dxSchedulerMethods.updateAppointment
     * @publicName updateAppointment(target, appointment)
     * @param1 target:Object
     * @param2 appointment:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateAppointment(target: any, appointment: any): void;
}

export interface dxSchedulerAppointment extends CollectionWidgetItem {
    /**
     * @docid dxSchedulerAppointment.allDay
     * @type Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allDay?: boolean;
    /**
     * @docid dxSchedulerAppointment.description
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    description?: string;
    /**
     * @docid dxSchedulerAppointment.disabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxSchedulerAppointment.endDate
     * @type Date|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDate?: Date | string;
    /**
     * @docid dxSchedulerAppointment.endDateTimeZone
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endDateTimeZone?: string;
    /**
     * @docid dxSchedulerAppointment.html
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    html?: string;
    /**
     * @docid dxSchedulerAppointment.recurrenceException
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceException?: string;
    /**
     * @docid dxSchedulerAppointment.recurrenceRule
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recurrenceRule?: string;
    /**
     * @docid dxSchedulerAppointment.startDate
     * @type Date|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDate?: Date | string;
    /**
     * @docid dxSchedulerAppointment.startDateTimeZone
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startDateTimeZone?: string;
    /**
     * @docid dxSchedulerAppointment.template
     * @type template
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template;
    /**
     * @docid dxSchedulerAppointment.text
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxSchedulerAppointment.visible
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
 * @docid dxSchedulerScrolling
 * @public
 */
export interface dxSchedulerScrolling {
  /**
   * @docid dxSchedulerScrolling.mode
   * @type Enums.SchedulerScrollingMode
   * @default "standard"
   * @prevFileNamespace DevExpress.ui
   * @public
   */
  mode?: 'standard' | 'virtual';
}

/** @deprecated use Options instead */
export type IOptions = dxSchedulerOptions;
