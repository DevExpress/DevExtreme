import $ from "../../core/renderer";
import Callbacks from "../../core/utils/callbacks";
import translator from "../../animation/translator";
import errors from "../widget/ui.errors";
import windowUtils from "../../core/utils/window";
import dialog from "../dialog";
import recurrenceUtils from "./utils.recurrence";
import domUtils from "../../core/utils/dom";
import dateUtils from "../../core/utils/date";
import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import { inArray } from "../../core/utils/array";
import { noop } from "../../core/utils/common";
import typeUtils from "../../core/utils/type";
import devices from "../../core/devices";
import config from "../../core/config";
import dataCoreUtils from "../../core/utils/data";
import registerComponent from "../../core/component_registrator";
import messageLocalization from "../../localization/message";
import dateSerialization from "../../core/utils/date_serialization";
import dateLocalization from "../../localization/date";
import Widget from "../widget/ui.widget";
import subscribes from "./ui.scheduler.subscribes";

import { DesktopTooltipStrategy } from "./tooltip_strategies/desktopTooltipStrategy";
import { MobileTooltipStrategy } from "./tooltip_strategies/mobileTooltipStrategy";
import AppointmentPopup from './appointmentPopup';

import SchedulerHeader from "./ui.scheduler.header";
import SchedulerWorkSpaceDay from "./workspaces/ui.scheduler.work_space_day";
import SchedulerWorkSpaceWeek from "./workspaces/ui.scheduler.work_space_week";
import SchedulerWorkSpaceWorkWeek from "./workspaces/ui.scheduler.work_space_work_week";
import SchedulerWorkSpaceMonth from "./workspaces/ui.scheduler.work_space_month";
import SchedulerTimelineDay from "./workspaces/ui.scheduler.timeline_day";
import SchedulerTimelineWeek from "./workspaces/ui.scheduler.timeline_week";
import SchedulerTimelineWorkWeek from "./workspaces/ui.scheduler.timeline_work_week";
import SchedulerTimelineMonth from "./workspaces/ui.scheduler.timeline_month";
import SchedulerAgenda from "./workspaces/ui.scheduler.agenda";
import SchedulerResourceManager from "./ui.scheduler.resource_manager";
import SchedulerAppointmentModel from "./ui.scheduler.appointment_model";
import SchedulerAppointments from "./ui.scheduler.appointments";
import SchedulerLayoutManager from "./ui.scheduler.appointments.layout_manager";
import { CompactAppointmentsHelper } from "./compactAppointmentsHelper";
import SchedulerTimezones from "./timezones/ui.scheduler.timezones";
import AsyncTemplateMixin from "../shared/async_template_mixin";
import DataHelperMixin from "../../data_helper";
import loading from "./ui.loading";
import deferredUtils from "../../core/utils/deferred";
import { EmptyTemplate } from "../../core/templates/empty_template";
import { BindableTemplate } from "../../core/templates/bindable_template";
import themes from "../themes";
import browser from "../../core/utils/browser";
import { touch } from "../../core/utils/support";

const when = deferredUtils.when;
const Deferred = deferredUtils.Deferred;

const toMs = dateUtils.dateToMilliseconds;

const WIDGET_CLASS = "dx-scheduler";
const WIDGET_SMALL_CLASS = `${WIDGET_CLASS}-small`;
const WIDGET_ADAPTIVE_CLASS = `${WIDGET_CLASS}-adaptive`;
const WIDGET_WIN_NO_TOUCH_CLASS = `${WIDGET_CLASS}-win-no-touch`;
const WIDGET_READONLY_CLASS = `${WIDGET_CLASS}-readonly`;
const RECURRENCE_EDITOR_ITEM_CLASS = `${WIDGET_CLASS}-recurrence-rule-item`;
const RECURRENCE_EDITOR_OPENED_ITEM_CLASS = `${WIDGET_CLASS}-recurrence-rule-item-opened`;
const WIDGET_SMALL_WIDTH = 400;

var FULL_DATE_FORMAT = "yyyyMMddTHHmmss",
    UTC_FULL_DATE_FORMAT = FULL_DATE_FORMAT + "Z";

var VIEWS_CONFIG = {
    day: {
        workSpace: SchedulerWorkSpaceDay,
        renderingStrategy: "vertical"
    },
    week: {
        workSpace: SchedulerWorkSpaceWeek,
        renderingStrategy: "vertical"
    },
    workWeek: {
        workSpace: SchedulerWorkSpaceWorkWeek,
        renderingStrategy: "vertical"
    },
    month: {
        workSpace: SchedulerWorkSpaceMonth,
        renderingStrategy: "horizontalMonth"
    },
    timelineDay: {
        workSpace: SchedulerTimelineDay,
        renderingStrategy: "horizontal"
    },
    timelineWeek: {
        workSpace: SchedulerTimelineWeek,
        renderingStrategy: "horizontal"
    },
    timelineWorkWeek: {
        workSpace: SchedulerTimelineWorkWeek,
        renderingStrategy: "horizontal"
    },
    timelineMonth: {
        workSpace: SchedulerTimelineMonth,
        renderingStrategy: "horizontalMonthLine"
    },
    agenda: {
        workSpace: SchedulerAgenda,
        renderingStrategy: "agenda"
    }
};

const Scheduler = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
                * @pseudo StartDayHour
                * @type number
                * @default 0
                */

            /**
                * @pseudo EndDayHour
                * @type number
                * @default 24
                */

            /**
                * @pseudo Groups
                * @type Array<string>
                * @default []
                */

            /**
                * @pseudo FirstDayOfWeek
                * @type Enums.FirstDayOfWeek
                * @default undefined
                */

            /**
                * @pseudo CellDuration
                * @type number
                * @default 30
                */

            /**
                * @pseudo AppointmentTemplate
                * @type template|function
                * @default "item"
                * @type_function_param1 model:object
                * @type_function_param1_field1 appointmentData:object
                * @type_function_param1_field2 targetedAppointmentData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 contentElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @pseudo AppointmentTooltipTemplate
                * @type template|function
                * @default "appointmentTooltip"
                * @type_function_param1 model:object
                * @type_function_param1_field1 appointmentData:object
                * @type_function_param1_field2 targetedAppointmentData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 contentElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @pseudo DateCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @pseudo DataCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @pseudo TimeCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @pseudo ResourceCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @pseudo AppointmentCollectorTemplate
                * @type template|function
                * @default "appointmentCollector"
                * @type_function_param1 data:object
                * @type_function_param1_field1 appointmentCount:number
                * @type_function_param1_field2 isCompact:boolean
                * @type_function_param2 collectorElement:dxElement
                * @type_function_return string|Node|jQuery
                */

            /**
                * @name dxSchedulerOptions.views
                * @type Array<string, object>
                * @default ['day', 'week']
                * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
                */
            views: ["day", "week"],

            /**
                * @name dxSchedulerOptions.views.type
                * @type Enums.SchedulerViewType
                * @default undefined
                */

            /**
                * @name dxSchedulerOptions.views.name
                * @type string
                * @default undefined
                */

            /**
                * @name dxSchedulerOptions.views.maxAppointmentsPerCell
                * @type number|Enums.MaxAppointmentsPerCell
                * @default "auto"
                */

            /**
                * @name dxSchedulerOptions.views.intervalCount
                * @type number
                * @default 1
                */

            /**
                * @name dxSchedulerOptions.views.groupByDate
                * @type boolean
                * @default false
                */

            /**
                * @name dxSchedulerOptions.views.startDate
                * @type Date|number|string
                * @default undefined
                */

            /**
                * @name dxSchedulerOptions.views.startDayHour
                * @extends StartDayHour
                */

            /**
                * @name dxSchedulerOptions.views.endDayHour
                * @extends EndDayHour
                */

            /**
                * @name dxSchedulerOptions.views.groups
                * @extends Groups
                */

            /**
                * @name dxSchedulerOptions.views.firstDayOfWeek
                * @extends FirstDayOfWeek
                */

            /**
                * @name dxSchedulerOptions.views.cellDuration
                * @extends CellDuration
                */

            /**
                * @name dxSchedulerOptions.views.appointmentTemplate
                * @extends AppointmentTemplate
                */

            /**
                * @name dxSchedulerOptions.views.dropDownAppointmentTemplate
                * @type template|function
                * @default "dropDownAppointment"
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 contentElement:dxElement
                * @type_function_return string|Node|jQuery
                * @deprecated dxSchedulerOptions.views.appointmentTooltipTemplate
                */

            /**
                * @name dxSchedulerOptions.views.appointmentTooltipTemplate
                * @extends AppointmentTooltipTemplate
                */

            /**
                * @name dxSchedulerOptions.views.dateCellTemplate
                * @extends DateCellTemplate
                */

            /**
                * @name dxSchedulerOptions.views.timeCellTemplate
                * @extends TimeCellTemplate
                */

            /**
                * @name dxSchedulerOptions.views.dataCellTemplate
                * @extends DataCellTemplate
                */

            /**
                * @name dxSchedulerOptions.views.resourceCellTemplate
                * @extends ResourceCellTemplate
                */

            /**
                * @name dxSchedulerOptions.views.appointmentCollectorTemplate
                * @default "appointmentCollector"
                * @extends AppointmentCollectorTemplate
                */

            /**
                * @name dxSchedulerOptions.views.agendaDuration
                * @type number
                * @default 7
                */

            /**
                * @name dxSchedulerOptions.views.groupOrientation
                * @type Enums.Orientation
                */

            /**
                * @name dxSchedulerOptions.currentView
                * @type Enums.SchedulerViewType
                * @default "day"
                * @fires dxSchedulerOptions.onOptionChanged
                */
            currentView: "day", // TODO: should we calculate currentView if views array contains only one item, for example 'month'?
            /**
                * @name dxSchedulerOptions.currentDate
                * @type Date|number|string
                * @default new Date()
                * @fires dxSchedulerOptions.onOptionChanged
                */
            currentDate: dateUtils.trimTime(new Date()),
            /**
                * @name dxSchedulerOptions.min
                * @type Date|number|string
                * @default undefined
                */
            min: undefined,
            /**
                * @name dxSchedulerOptions.max
                * @type Date|number|string
                * @default undefined
                */
            max: undefined,
            /**
                * @name dxSchedulerOptions.dateSerializationFormat
                * @type string
                * @default undefined
                */
            dateSerializationFormat: undefined,
            /**
                * @name dxSchedulerOptions.firstDayOfWeek
                * @extends FirstDayOfWeek
                */
            firstDayOfWeek: undefined,

            /**
                * @name dxSchedulerOptions.groups
                * @extends Groups
                */
            groups: [],

            /**
                * @name dxSchedulerOptions.resources
                * @type Array<Object>
                * @default []
                */
            resources: [
                /**
                    * @name dxSchedulerOptions.resources.fieldExpr
                    * @type String
                    * @default ""
                    */

                /**
                    * @name dxSchedulerOptions.resources.colorExpr
                    * @type String
                    * @default "color"
                    */

                /**
                    * @name dxSchedulerOptions.resources.label
                    * @type String
                    * @default ""
                    */

                /**
                    * @name dxSchedulerOptions.resources.allowMultiple
                    * @type Boolean
                    * @default false
                    */

                /**
                    * @name dxSchedulerOptions.resources.useColorAsDefault
                    * @type Boolean
                    * @default false
                    */

                /**
                    * @name dxSchedulerOptions.resources.valueExpr
                    * @type string|function
                    * @default 'id'
                    */

                /**
                    * @name dxSchedulerOptions.resources.displayExpr
                    * @type string|function(resource)
                    * @type_function_param1 resource:object
                    * @default 'text'
                 * @type_function_return string
                    */

                /**
                    * @name dxSchedulerOptions.resources.dataSource
                    * @type string|Array<Object>|DataSource|DataSourceOptions
                    * @default null
                    */
            ],

            /**
                * @name dxSchedulerOptions.dataSource
                * @type string|Array<dxSchedulerAppointment>|DataSource|DataSourceOptions
                * @default null
                */
            dataSource: null,

            /**
                * @name dxSchedulerOptions.customizeDateNavigatorText
                * @type function(info)
                * @type_function_param1 info:object
                * @type_function_param1_field1 startDate:date
                * @type_function_param1_field2 endDate:date
                * @type_function_param1_field3 text:string
                * @type_function_return string
                * @default undefined
                */
            customizeDateNavigatorText: undefined,

            /**
                * @name dxSchedulerOptions.appointmentTemplate
                * @extends AppointmentTemplate
                */
            appointmentTemplate: "item",

            /**
                * @name dxSchedulerOptions.dropDownAppointmentTemplate
                * @type template|function
                * @default "dropDownAppointment"
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 contentElement:dxElement
                * @type_function_return string|Node|jQuery
                * @deprecated dxSchedulerOptions.appointmentTooltipTemplate
                */
            dropDownAppointmentTemplate: "dropDownAppointment",

            /**
                * @name dxSchedulerOptions.appointmentCollectorTemplate
                * @default "appointmentCollector"
                * @extends AppointmentCollectorTemplate
                */
            appointmentCollectorTemplate: "appointmentCollector",

            /**
                * @name dxSchedulerOptions.dataCellTemplate
                * @extends DataCellTemplate
                */
            dataCellTemplate: null,

            /**
                * @name dxSchedulerOptions.timeCellTemplate
                * @extends TimeCellTemplate
                */
            timeCellTemplate: null,

            /**
                * @name dxSchedulerOptions.resourceCellTemplate
                * @extends ResourceCellTemplate
                */
            resourceCellTemplate: null,

            /**
                * @name dxSchedulerOptions.dateCellTemplate
                * @extends DateCellTemplate
                */
            dateCellTemplate: null,

            /**
                * @name dxSchedulerOptions.startDayHour
                * @extends StartDayHour
                */
            startDayHour: 0,

            /**
                * @name dxSchedulerOptions.endDayHour
                * @extends EndDayHour
                */
            endDayHour: 24,

            /**
                * @name dxSchedulerOptions.editing
                * @type boolean|object
                * @default true
                */
            editing: {
                allowAdding: true,
                allowDeleting: true,
                allowDragging: true,
                allowResizing: true,
                allowUpdating: true
            },

            /**
                * @name dxSchedulerOptions.editing.allowAdding
                * @type boolean
                * @default true
                */
            /**
                * @name dxSchedulerOptions.editing.allowUpdating
                * @type boolean
                * @default true
                */
            /**
                * @name dxSchedulerOptions.editing.allowDeleting
                * @type boolean
                * @default true
                */
            /**
                * @name dxSchedulerOptions.editing.allowResizing
                * @type boolean
                * @default true
                */
            /**
                * @name dxSchedulerOptions.editing.allowDragging
                * @type boolean
                * @default true
                */

            /**
                * @name dxSchedulerOptions.showAllDayPanel
                * @type boolean
                * @default true
                */

            /**
                * @name dxSchedulerOptions.appointmentDragging
                * @type object
                */
            /**
               * @name dxSchedulerOptions.appointmentDragging.autoScroll
               * @type boolean
               * @default true
               */
            /**
               * @name dxSchedulerOptions.appointmentDragging.scrollSpeed
               * @type number
               * @default 60
               */
            /**
               * @name dxSchedulerOptions.appointmentDragging.scrollSensitivity
               * @type number
               * @default 60
               */
            /**
               * @name dxSchedulerOptions.appointmentDragging.group
               * @type string
               * @default undefined
               */
            /**
               * @name dxSchedulerOptions.appointmentDragging.data
               * @type any
               * @default undefined
               */
            /**
               * @name dxSchedulerOptions.appointmentDragging.onDragStart
               * @type function(e)
               * @type_function_param1 e:object
               * @type_function_param1_field1 event:event
               * @type_function_param1_field2 cancel:boolean
               * @type_function_param1_field3 itemData:any
               * @type_function_param1_field4 itemElement:dxElement
               * @type_function_param1_field5 fromData:any
               */
            /**
               * @name dxSchedulerOptions.appointmentDragging.onDragMove
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
            /**
               * @name dxSchedulerOptions.appointmentDragging.onDragEnd
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
            /**
               * @name dxSchedulerOptions.appointmentDragging.onAdd
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
            /**
               * @name dxSchedulerOptions.appointmentDragging.onRemove
               * @type function(e)
               * @type_function_param1 e:object
               * @type_function_param1_field1 event:event
               * @type_function_param1_field2 itemData:any
               * @type_function_param1_field3 itemElement:dxElement
               * @type_function_param1_field4 fromComponent:dxSortable|dxDraggable
               * @type_function_param1_field5 toComponent:dxSortable|dxDraggable
               * @type_function_param1_field6 fromData:any
               */
            showAllDayPanel: true,

            /**
                * @name dxSchedulerOptions.showCurrentTimeIndicator
                * @type boolean
                * @default true
                */
            showCurrentTimeIndicator: true,

            /**
                * @name dxSchedulerOptions.shadeUntilCurrentTime
                * @type boolean
                * @default false
                */
            shadeUntilCurrentTime: false,

            /**
                * @name dxSchedulerOptions.indicatorUpdateInterval
                * @type number
                * @default 300000
                */
            indicatorUpdateInterval: 300000,

            /**
                * @hidden
                * @name dxSchedulerOptions.indicatorTime
                * @type Date
                * @default undefined
                */
            indicatorTime: undefined,

            /**
                * @name dxSchedulerOptions.recurrenceEditMode
                * @type Enums.SchedulerRecurrenceEditMode
                * @default "dialog"
                */
            recurrenceEditMode: "dialog",

            /**
                * @name dxSchedulerOptions.cellDuration
                * @extends CellDuration
                */
            cellDuration: 30,

            /**
                * @name dxSchedulerOptions.maxAppointmentsPerCell
                * @type number|Enums.MaxAppointmentsPerCell
                * @default "auto"
                */
            maxAppointmentsPerCell: "auto",

            /**
                * @name dxSchedulerOptions.selectedCellData
                * @readonly
                * @type Array<any>
                * @default []
                */
            selectedCellData: [],

            /**
                * @name dxSchedulerOptions.groupByDate
                * @type boolean
                * @default false
                */
            groupByDate: false,

            /**
                * @name dxSchedulerOptions.onAppointmentRendered
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:dxElement
                * @action
                */
            onAppointmentRendered: null,

            /**
                * @name dxSchedulerOptions.onAppointmentClick
                * @type function(e)|string
                * @extends Action
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:dxElement
                * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
                * @type_function_param1_field8 event:event
                * @type_function_param1_field9 cancel:Boolean
                * @action
                */
            onAppointmentClick: null,

            /**
                * @name dxSchedulerOptions.onAppointmentDblClick
                * @type function(e)|string
                * @extends Action
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:dxElement
                * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
                * @type_function_param1_field8 event:event
                * @type_function_param1_field9 cancel:Boolean
                * @action
                */
            onAppointmentDblClick: null,

            /**
                * @name dxSchedulerOptions.onAppointmentContextMenu
                * @type function(e)|string
                * @extends Action
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:dxElement
                * @type_function_param1_field7 jQueryEvent:jQuery.Event:deprecated(event)
                * @type_function_param1_field8 event:event
                * @action
                */
            onAppointmentContextMenu: null,

            /**
                * @name dxSchedulerOptions.onCellClick
                * @type function(e)|string
                * @extends Action
                * @type_function_param1 e:object
                * @type_function_param1_field4 cellData:object
                * @type_function_param1_field5 cellElement:dxElement
                * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
                * @type_function_param1_field7 event:event
                * @type_function_param1_field8 cancel:Boolean
                * @action
                */
            onCellClick: null,

            /**
                * @name dxSchedulerOptions.onCellContextMenu
                * @type function(e)|string
                * @extends Action
                * @type_function_param1 e:object
                * @type_function_param1_field4 cellData:object
                * @type_function_param1_field5 cellElement:dxElement
                * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
                * @type_function_param1_field7 event:event
                * @action
                */
            onCellContextMenu: null,

            /**
                * @name dxSchedulerOptions.onAppointmentAdding
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
                * @action
                */
            onAppointmentAdding: null,

            /**
                * @name dxSchedulerOptions.onAppointmentAdded
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 error:Error
                * @action
                */
            onAppointmentAdded: null,

            /**
                * @name dxSchedulerOptions.onAppointmentUpdating
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 oldData:Object
                * @type_function_param1_field5 newData:Object
                * @type_function_param1_field6 cancel:Boolean|Promise<Boolean>
                * @action
                */
            onAppointmentUpdating: null,

            /**
                * @name dxSchedulerOptions.onAppointmentUpdated
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 error:Error
                * @action
                */
            onAppointmentUpdated: null,

            /**
                * @name dxSchedulerOptions.onAppointmentDeleting
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 cancel:Boolean|Promise<Boolean>
                * @action
                */
            onAppointmentDeleting: null,

            /**
                * @name dxSchedulerOptions.onAppointmentDeleted
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 error:Error
                * @action
                */
            onAppointmentDeleted: null,

            /**
                * @name dxSchedulerOptions.onAppointmentFormOpening
                * @extends Action
                * @type function(e)
                * @type_function_param1 e:object
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 form:dxForm
                * @type_function_param1_field6 cancel:Boolean
                * @action
               */
            onAppointmentFormOpening: null,

            /**
                * @name dxSchedulerOptions.appointmentTooltipTemplate
                * @extends AppointmentTooltipTemplate
                */
            appointmentTooltipTemplate: "appointmentTooltip",

            /**
                * @hidden
                * @name dxSchedulerOptions.appointmentPopupTemplate
                * @type template|function
                * @default "appointmentPopup"
                * @type_function_param1 appointmentData:object
                * @type_function_param2 contentElement:dxElement
                * @type_function_return string|Node|jQuery
                */
            appointmentPopupTemplate: "appointmentPopup",

            /**
                * @name dxSchedulerOptions.crossScrollingEnabled
                * @type boolean
                * @default false
                */
            crossScrollingEnabled: false,

            /**
                * @name dxSchedulerOptions.useDropDownViewSwitcher
                * @type boolean
                * @default false
                */
            useDropDownViewSwitcher: false,

            /**
                * @name dxSchedulerOptions.startDateExpr
                * @type string
                * @default 'startDate'
                */
            startDateExpr: "startDate",

            /**
                * @name dxSchedulerOptions.endDateExpr
                * @type string
                * @default 'endDate'
                */
            endDateExpr: "endDate",

            /**
                * @name dxSchedulerOptions.textExpr
                * @type string
                * @default 'text'
                */
            textExpr: "text",

            /**
                * @name dxSchedulerOptions.descriptionExpr
                * @type string
                * @default 'description'
                */
            descriptionExpr: "description",

            /**
                * @name dxSchedulerOptions.allDayExpr
                * @type string
                * @default 'allDay'
                */
            allDayExpr: "allDay",

            /**
                * @name dxSchedulerOptions.recurrenceRuleExpr
                * @type string
                * @default 'recurrenceRule'
                */
            recurrenceRuleExpr: "recurrenceRule",

            /**
                * @name dxSchedulerOptions.recurrenceExceptionExpr
                * @type string
                * @default 'recurrenceException'
                */
            recurrenceExceptionExpr: "recurrenceException",

            /**
                * @name dxSchedulerOptions.remoteFiltering
                * @type boolean
                * @default false
                */
            remoteFiltering: false,

            /**
                * @name dxSchedulerOptions.timeZone
                * @type string
                * @default ""
                */
            timeZone: "",

            /**
                * @name dxSchedulerOptions.startDateTimeZoneExpr
                * @type string
                * @default 'startDateTimeZone'
                */
            startDateTimeZoneExpr: "startDateTimeZone",

            /**
                * @name dxSchedulerOptions.endDateTimeZoneExpr
                * @type string
                * @default 'endDateTimeZone'
                */
            endDateTimeZoneExpr: "endDateTimeZone",

            /**
                * @name dxSchedulerOptions.noDataText
                * @type string
                * @default "No data to display"
                */
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),

            /**
            * @name dxSchedulerOptions.adaptivityEnabled
            * @type boolean
            * @default false
            */
            adaptivityEnabled: false,

            allowMultipleCellSelection: true,

            _appointmentTooltipOffset: { x: 0, y: 0 },
            _appointmentTooltipButtonsPosition: "bottom",
            _appointmentTooltipOpenButtonText: messageLocalization.format("dxScheduler-openAppointment"),
            _dropDownButtonIcon: "overflow",
            _appointmentCountPerCell: 2,
            _collectorOffset: 0,
            _appointmentOffset: 26

            /**
                * @name dxSchedulerOptions.activeStateEnabled
                * @hidden
                */

            /**
                * @name dxSchedulerOptions.hoverStateEnabled
                * @hidden
                */
            /**
                * @name dxSchedulerAppointment
                * @inherits CollectionWidgetItem
                * @type object
                */
            /**
                * @name dxSchedulerAppointment.html
                * @type String
                */
            /**
                * @name dxSchedulerAppointment.disabled
                * @type boolean
                * @default false
                */
            /**
                * @name dxSchedulerAppointment.visible
                * @type boolean
                * @default true
                */
            /**
                * @name dxSchedulerAppointment.template
                * @type template
                */
            /**
                * @name dxSchedulerAppointment.text
                * @type String
                */
            /**
                * @name dxSchedulerAppointment.startDate
                * @type Date
                */
            /**
                * @name dxSchedulerAppointment.endDate
                * @type Date
                */
            /**
                * @name dxSchedulerAppointment.description
                * @type String
                */
            /**
                * @name dxSchedulerAppointment.recurrenceRule
                * @type String
                */
            /**
                * @name dxSchedulerAppointment.recurrenceException
                * @type String
                */
            /**
                * @name dxSchedulerAppointment.allDay
                * @type Boolean
                */
            /**
                * @name dxSchedulerAppointment.startDateTimeZone
                * @type String
                */
            /**
                * @name dxSchedulerAppointment.endDateTimeZone
                * @type String
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate
                * @type object
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.text
                * @type String
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.startDate
                * @type Date
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.endDate
                * @type Date
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.description
                * @type String
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.recurrenceRule
                * @type String
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.recurrenceException
                * @type String
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.allDay
                * @type Boolean
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.startDateTimeZone
                * @type String
                */
            /**
                * @name dxSchedulerAppointmentTooltipTemplate.endDateTimeZone
                * @type String
                */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                        * @name dxSchedulerOptions.focusStateEnabled
                        * @type boolean
                        * @default true @for desktop
                        */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return !devices.current().generic;
                },
                options: {
                    /**
                       * @name dxSchedulerOptions.useDropDownViewSwitcher
                       * @default true @for Android|iOS
                       */
                    useDropDownViewSwitcher: true,

                    /**
                       * @name dxSchedulerOptions.editing.allowResizing
                       * @default false @for Android|iOS
                       */

                    /**
                       * @name dxSchedulerOptions.editing.allowDragging
                       * @default false @for Android|iOS
                       */
                    editing: {
                        allowDragging: false,
                        allowResizing: false
                    }
                }
            },
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    /**
                         * @name dxSchedulerOptions.useDropDownViewSwitcher
                         * @default true @for Material
                         */
                    useDropDownViewSwitcher: true,
                    dateCellTemplate: function(data, index, element) {
                        var text = data.text;

                        text.split(" ").forEach(function(text, index) {
                            var span = $("<span>")
                                .text(text)
                                .addClass("dx-scheduler-header-panel-cell-date");

                            $(element).append(span);
                            if(!index) $(element).append(" ");
                        });
                    },

                    _appointmentTooltipOffset: { x: 0, y: 11 },
                    _appointmentTooltipButtonsPosition: "top",
                    _appointmentTooltipOpenButtonText: null,
                    _dropDownButtonIcon: "chevrondown",
                    _appointmentCountPerCell: 1,
                    _collectorOffset: 20,
                    _appointmentOffset: 30
                }
            }
        ]);
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
             * @name dxSchedulerOptions.onAppointmentFormCreated
             * @extends Action
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 appointmentData:object
             * @type_function_param1_field5 form:dxForm
             * @action
             * @deprecated dxSchedulerOptions.onAppointmentFormOpening
             */
            onAppointmentFormCreated: { since: "18.2", alias: "onAppointmentFormOpening" },
            dropDownAppointmentTemplate: { since: "19.2", message: "appointmentTooltipTemplate" }
        });
    },

    _postponeDataSourceLoading: function(promise) {
        this.postponedOperations.add("_reloadDataSource", this._reloadDataSource.bind(this), promise);
    },

    _postponeResourceLoading: function() {
        var whenLoaded = this.postponedOperations.add("_loadResources", () => {
                return this._loadResources();
            }),
            resolveCallbacks = new Deferred();

        whenLoaded.done((resources) => {
            resolveCallbacks.resolve(resources);
        });
        this._postponeDataSourceLoading(whenLoaded);

        return resolveCallbacks.promise();
    },

    _optionChanged: function(args) {
        var value = args.value,
            name = args.name;

        switch(args.name) {
            case "customizeDateNavigatorText":
                this._updateOption("header", name, value);
                break;
            case "firstDayOfWeek":
                this._updateOption("workSpace", name, value);
                this._updateOption("header", name, value);
                break;
            case "currentDate":
                value = this._dateOption(name);
                value = dateUtils.trimTime(new Date(value));
                this.option("selectedCellData", []);
                this._workSpace.option(name, new Date(value));
                this._header.option(name, new Date(value));
                this._header.option("displayedDate", this._workSpace._getViewStartByOptions());
                this._appointments.option("items", []);
                this._filterAppointmentsByDate();

                this._postponeDataSourceLoading();
                break;
            case "dataSource":
                this._initDataSource();
                this._customizeStoreLoadOptions();
                this._appointmentModel.setDataSource(this._dataSource);

                this._postponeResourceLoading().done((resources) => {
                    this._filterAppointmentsByDate();
                    this._updateOption("workSpace", "showAllDayPanel", this.option("showAllDayPanel"));
                });
                break;
            case "min":
            case "max":
                value = this._dateOption(name);
                this._updateOption("header", name, new Date(value));
                this._updateOption("workSpace", name, new Date(value));
                break;
            case "views":
                this._processCurrentView();
                if(this._getCurrentViewOptions()) {
                    this.repaint();
                } else {
                    this._header.option(name, value);
                }
                break;
            case "useDropDownViewSwitcher":
                this._header.option(name, value);
                break;
            case "currentView":
                this._processCurrentView();
                this._appointments.option({
                    items: [],
                    allowDrag: this._allowDragging(),
                    allowResize: this._allowResizing(),
                    itemTemplate: this._getAppointmentTemplate("appointmentTemplate")
                });

                this._postponeResourceLoading().done((resources) => {
                    this.getLayoutManager().initRenderingStrategy(this._getAppointmentsRenderingStrategy());
                    this._refreshWorkSpace(resources);
                    this._updateHeader();
                    this._filterAppointmentsByDate();
                    this._appointments.option("allowAllDayResize", value !== "day");
                });
                break;
            case "appointmentTemplate":
                this._appointments.option("itemTemplate", value);
                break;
            case "dateCellTemplate":
            case "resourceCellTemplate":
            case "dataCellTemplate":
            case "timeCellTemplate":
                this._updateOption("workSpace", name, value);
                this.repaint();
                break;
            case "groups":
                this._postponeResourceLoading().done((resources) => {
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                });
                break;
            case "resources":
                this._resourcesManager.setResources(this.option("resources"));
                this._appointmentModel.setDataAccessors(this._combineDataAccessors());

                this._postponeResourceLoading().done((resources) => {
                    this._appointments.option("items", []);
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                });
                break;
            case "startDayHour":
            case "endDayHour":
                this._appointments.option("items", []);
                this._updateOption("workSpace", name, value);
                this._appointments.repaint();
                this._filterAppointmentsByDate();

                this._postponeDataSourceLoading();
                break;
            case "onAppointmentAdding":
            case "onAppointmentAdded":
            case "onAppointmentUpdating":
            case "onAppointmentUpdated":
            case "onAppointmentDeleting":
            case "onAppointmentDeleted":
            case "onAppointmentFormOpening":
                this._actions[name] = this._createActionByOption(name);
                break;
            case "onAppointmentRendered":
                this._appointments.option("onItemRendered", this._getAppointmentRenderedAction());
                break;
            case "onAppointmentClick":
                this._appointments.option("onItemClick", this._createActionByOption(name));
                break;
            case "onAppointmentDblClick":
                this._appointments.option(name, this._createActionByOption(name));
                break;
            case "onAppointmentContextMenu":
                this._appointments.option("onItemContextMenu", this._createActionByOption(name));
                break;
            case "noDataText":
            case "allowMultipleCellSelection":
            case "selectedCellData":
            case "accessKey":
            case "onCellClick":
                this._workSpace.option(name, value);
                break;
            case "onCellContextMenu":
                this._workSpace.option(name, value);
                break;
            case "crossScrollingEnabled":
                this._postponeResourceLoading().done((resources) => {
                    this._appointments.option("items", []);
                    this._refreshWorkSpace(resources);
                    if(this._readyToRenderAppointments) {
                        this._appointments.option("items", this._getAppointmentsToRepaint());
                    }
                });
                break;
            case "cellDuration":
                this._appointments.option("items", []);
                if(this._readyToRenderAppointments) {
                    this._updateOption("workSpace", "hoursInterval", value / 60);
                    this._appointments.option("items", this._getAppointmentsToRepaint());
                }
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._updateOption("header", name, value);
                this._updateOption("workSpace", name, value);
                this._appointments.option(name, value);
                this.callBase(args);
                break;
            case "width":
                // TODO: replace with css
                this._updateOption("header", name, value);
                if(this.option("crossScrollingEnabled")) {
                    this._updateOption("workSpace", "width", value);
                }
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "height":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "editing":
                this._initEditing();
                var editing = this._editing;

                this._bringEditingModeToAppointments(editing);

                this.hideAppointmentTooltip();
                this._cleanPopup();
                break;
            case "showAllDayPanel":
                this._postponeResourceLoading().done((resources) => {
                    this._filterAppointmentsByDate();
                    this._updateOption("workSpace", "allDayExpanded", value);
                    this._updateOption("workSpace", name, value);
                });
                break;
            case "showCurrentTimeIndicator":
            case "indicatorTime":
            case "indicatorUpdateInterval":
            case "shadeUntilCurrentTime":
            case "groupByDate":
                this._updateOption("workSpace", name, value);
                this.repaint();
                break;
            case "appointmentDragging":
            case "appointmentTooltipTemplate":
            case "appointmentPopupTemplate":
            case "recurrenceEditMode":
            case "remoteFiltering":
            case "timeZone":
            case "dropDownAppointmentTemplate":
            case "appointmentCollectorTemplate":
            case "_appointmentTooltipOffset":
            case "_appointmentTooltipButtonsPosition":
            case "_appointmentTooltipOpenButtonText":
            case "_dropDownButtonIcon":
            case "_appointmentCountPerCell":
            case "_collectorOffset":
            case "_appointmentOffset":
                this.repaint();
                break;
            case "dateSerializationFormat":
                break;
            case "maxAppointmentsPerCell":
                break;
            case "startDateExpr":
            case "endDateExpr":
            case "startDateTimeZoneExpr":
            case "endDateTimeZoneExpr":
            case "textExpr":
            case "descriptionExpr":
            case "allDayExpr":
            case "recurrenceRuleExpr":
            case "recurrenceExceptionExpr":
                this._updateExpression(name, value);
                this._appointmentModel.setDataAccessors(this._combineDataAccessors());

                this._initAppointmentTemplate();
                this.repaint();
                break;
            case "adaptivityEnabled":
                this._toggleAdaptiveClass();
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
    },

    _updateHeader: function() {
        var viewCountConfig = this._getViewCountConfig();
        this._header.option("intervalCount", viewCountConfig.intervalCount);
        this._header.option("displayedDate", this._workSpace._getViewStartByOptions());
        this._header.option("min", this._dateOption("min"));
        this._header.option("max", this._dateOption("max"));
        this._header.option("currentDate", this._dateOption("currentDate"));
        this._header.option("firstDayOfWeek", this._getCurrentViewOption("firstDayOfWeek"));
        this._header.option("currentView", this._currentView);
    },

    _dateOption: function(optionName) {
        var optionValue = this._getCurrentViewOption(optionName);

        return dateSerialization.deserializeDate(optionValue);
    },

    _getSerializationFormat: function(optionName) {
        var value = this._getCurrentViewOption(optionName);

        if(typeof value === "number") {
            return "number";
        }

        if(!typeUtils.isString(value)) {
            return;
        }

        return dateSerialization.getDateSerializationFormat(value);
    },

    _bringEditingModeToAppointments: function(editing) {
        var editingConfig = {
            allowDelete: editing.allowUpdating && editing.allowDeleting
        };

        if(!this._isAgenda()) {
            editingConfig.allowDrag = editing.allowDragging;
            editingConfig.allowResize = editing.allowResizing;
            editingConfig.allowAllDayResize = editing.allowResizing && this._supportAllDayResizing();
        }

        this._appointments.option(editingConfig);
        this.repaint();
    },

    _isAgenda: function() {
        return this._getAppointmentsRenderingStrategy() === "agenda";
    },

    _allowDragging: function() {
        return this._editing.allowDragging && !this._isAgenda();
    },

    _allowResizing: function() {
        return this._editing.allowResizing && !this._isAgenda();
    },

    _allowAllDayResizing: function() {
        return this._editing.allowResizing && this._supportAllDayResizing();
    },

    _supportAllDayResizing: function() {
        return this._getCurrentViewType() !== "day" || this._currentView.intervalCount > 1;
    },

    _isAllDayExpanded: function(items) {
        return this.option("showAllDayPanel") && this._appointmentModel.hasAllDayAppointments(items, this._getCurrentViewOption("startDayHour"), this._getCurrentViewOption("endDayHour"));
    },

    _getTimezoneOffsetByOption: function(date) {
        return this._calculateTimezoneByValue(this.option("timeZone"), date);
    },

    _calculateTimezoneByValue: function(timezone, date) {
        var result = timezone;

        if(typeof timezone === "string") {
            date = date || new Date();
            let dateUtc = Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes()
            );
            result = SchedulerTimezones.getTimezoneOffsetById(timezone, dateUtc);
        }
        return result;
    },

    _filterAppointmentsByDate: function() {
        var dateRange = this._workSpace.getDateRange();
        this._appointmentModel.filterByDate(dateRange[0], dateRange[1], this.option("remoteFiltering"), this.option("dateSerializationFormat"));
    },

    _loadResources: function() {
        var groups = this._getCurrentViewOption("groups"),
            result = new Deferred();

        this._resourcesManager.loadResources(groups).done((function(resources) {
            this._loadedResources = resources;
            result.resolve(resources);
        }).bind(this));

        return result.promise();
    },

    _dataSourceLoadedCallback: Callbacks(),

    _reloadDataSource: function() {
        var result = new Deferred();

        if(this._dataSource) {

            this._dataSource.load().done((function() {
                loading.hide();

                this._fireContentReadyAction(result);
            }).bind(this)).fail(function() {
                loading.hide();
                result.reject();
            });

            this._dataSource.isLoading() && loading.show({
                container: this.$element(),
                position: {
                    of: this.$element()
                }
            });
        } else {
            this._fireContentReadyAction(result);
        }

        return result.promise();
    },

    _fireContentReadyAction: function(result) {
        this.callBase();
        result && result.resolve();
    },

    _dimensionChanged: function() {
        var filteredItems = this.getFilteredItems();

        this._toggleSmallClass();

        if(!this._isAgenda() && filteredItems && this._isVisible()) {
            this._workSpace._cleanAllowedPositions();
            this._workSpace.option("allDayExpanded", this._isAllDayExpanded(filteredItems));
            this._workSpace._dimensionChanged();

            var appointments = this._layoutManager.createAppointmentsMap(filteredItems);

            this._appointments.option("items", appointments);
        }

        this.hideAppointmentTooltip();

        this.resizePopup();
        this._appointmentPopup.updatePopupFullScreenMode();
    },

    _clean: function() {
        this._cleanPopup();
        this.callBase();
    },

    _toggleSmallClass: function() {
        var width = this.$element().get(0).getBoundingClientRect().width;
        this.$element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
    },

    _toggleAdaptiveClass: function() {
        this.$element().toggleClass(WIDGET_ADAPTIVE_CLASS, this.option("adaptivityEnabled"));
    },

    _visibilityChanged: function(visible) {
        visible && this._dimensionChanged();
    },

    _dataSourceOptions: function() {
        return { paginate: false };
    },

    _init: function() {
        this._initExpressions({
            startDate: this.option("startDateExpr"),
            endDate: this.option("endDateExpr"),
            startDateTimeZone: this.option("startDateTimeZoneExpr"),
            endDateTimeZone: this.option("endDateTimeZoneExpr"),
            allDay: this.option("allDayExpr"),
            text: this.option("textExpr"),
            description: this.option("descriptionExpr"),
            recurrenceRule: this.option("recurrenceRuleExpr"),
            recurrenceException: this.option("recurrenceExceptionExpr")
        });

        this.callBase();

        this._initDataSource();

        this._loadedResources = [];

        this._proxiedCustomizeStoreLoadOptionsHandler = this._customizeStoreLoadOptionsHandler.bind(this);
        this._customizeStoreLoadOptions();

        this.$element()
            .addClass(WIDGET_CLASS)
            .toggleClass(WIDGET_WIN_NO_TOUCH_CLASS, !!(browser.msie && touch));

        this._initEditing();

        this._resourcesManager = new SchedulerResourceManager(this.option("resources"));

        var combinedDataAccessors = this._combineDataAccessors();

        this._appointmentModel = new SchedulerAppointmentModel(this._dataSource, combinedDataAccessors, this.getAppointmentDurationInMinutes());

        this._initActions();

        this._compactAppointmentsHelper = new CompactAppointmentsHelper(this);

        this._subscribes = subscribes;
    },

    _initTemplates: function() {
        this.callBase();
        this._initAppointmentTemplate();

        this._defaultTemplates["appointmentTooltip"] = new EmptyTemplate();
        this._defaultTemplates["dropDownAppointment"] = new EmptyTemplate();
    },

    _initAppointmentTemplate: function() {
        const { expr } = this._dataAccessors;
        const createGetter = (property) => dataCoreUtils.compileGetter(`appointmentData.${property}`);

        this._defaultTemplates["item"] = new BindableTemplate(($container, data, model) => {
            this.getAppointmentsInstance()._renderAppointmentTemplate($container, data, model);
        }, [
            "html",
            "text",
            "startDate",
            "endDate",
            "allDay",
            "description",
            "recurrenceRule",
            "recurrenceException",
            "startDateTimeZone",
            "endDateTimeZone"
        ], this.option("integrationOptions.watchMethod"), {
            "text": createGetter(expr.textExpr),
            "startDate": createGetter(expr.startDateExpr),
            "endDate": createGetter(expr.endDateExpr),
            "startDateTimeZone": createGetter(expr.startDateTimeZoneExpr),
            "endDateTimeZone": createGetter(expr.endDateTimeZoneExpr),
            "allDay": createGetter(expr.allDayExpr),
            "recurrenceRule": createGetter(expr.recurrenceRuleExpr)
        });
    },

    _combineDataAccessors: function() {
        var resourcesDataAccessors = this._resourcesManager._dataAccessors,
            result = extend(true, {}, this._dataAccessors);

        each(resourcesDataAccessors, (function(type, accessor) {
            result[type].resources = accessor;
        }).bind(this));

        return result;
    },

    _renderContent: function() {
        this._renderContentImpl();
    },

    _dataSourceChangedHandler: function(result) {
        if(this._readyToRenderAppointments) {
            this._workSpaceRecalculation.done((function() {
                this._filteredItems = this.fire("prerenderFilter");
                this._workSpace.option("allDayExpanded", this._isAllDayExpanded(this._filteredItems));

                if(this._isAgenda()) {
                    this.getRenderingStrategyInstance().calculateRows(this._filteredItems, 7, this.option("currentDate"), true);
                }

                if(this._filteredItems.length && this._isVisible()) {
                    this._appointments.option("items", this._getAppointmentsToRepaint());

                    this._appointmentModel.cleanModelState();
                } else {
                    this._appointments.option("items", []);
                }
                if(this._isAgenda()) {
                    this._workSpace._renderView();
                    // TODO: remove rows calculation from this callback
                    this._dataSourceLoadedCallback.fireWith(this, [result]);
                }
            }).bind(this));
        }
    },

    _getAppointmentsToRepaint: function() {
        var appointments = this._layoutManager.createAppointmentsMap(this._filteredItems);
        return this._layoutManager.getRepaintedAppointments(appointments, this.getAppointmentsInstance().option("items"));
    },

    _initExpressions: function(fields) {
        var isDateField = function(field) {
            return field === "startDate" || field === "endDate";
        };

        if(!this._dataAccessors) {
            this._dataAccessors = {
                getter: {},
                setter: {},
                expr: {}
            };
        }

        each(fields, (function(name, expr) {
            if(expr) {

                var getter = dataCoreUtils.compileGetter(expr),
                    setter = dataCoreUtils.compileSetter(expr);

                var dateGetter,
                    dateSetter;

                if(isDateField(name)) {
                    var that = this;
                    dateGetter = function() {
                        var value = getter.apply(this, arguments);
                        if(config().forceIsoDateParsing) {
                            if(!that.option("dateSerializationFormat")) {
                                var format = dateSerialization.getDateSerializationFormat(value);
                                if(format) {
                                    that.option("dateSerializationFormat", format);
                                }
                            }
                            value = dateSerialization.deserializeDate(value);
                        }
                        return value;
                    };
                    dateSetter = function(object, value) {
                        if(config().forceIsoDateParsing || that.option("dateSerializationFormat")) {
                            value = dateSerialization.serializeDate(value, that.option("dateSerializationFormat"));
                        }
                        setter.call(this, object, value);
                    };
                }

                this._dataAccessors.getter[name] = dateGetter || getter;
                this._dataAccessors.setter[name] = dateSetter || setter;
                this._dataAccessors.expr[name + "Expr"] = expr;
            } else {
                delete this._dataAccessors.getter[name];
                delete this._dataAccessors.setter[name];
                delete this._dataAccessors.expr[name + "Expr"];
            }
        }).bind(this));
    },

    _updateExpression: function(name, value) {
        var exprObj = {};
        exprObj[name.replace("Expr", "")] = value;
        this._initExpressions(exprObj);
    },

    _initEditing: function() {
        var editing = this.option("editing");

        this._editing = {
            allowAdding: !!editing,
            allowUpdating: !!editing,
            allowDeleting: !!editing,
            allowResizing: !!editing,
            allowDragging: !!editing
        };

        if(typeUtils.isObject(editing)) {
            this._editing = extend(this._editing, editing);
        }

        this._editing.allowDragging = this._editing.allowDragging && this._editing.allowUpdating;
        this._editing.allowResizing = this._editing.allowResizing && this._editing.allowUpdating;

        this.$element().toggleClass(WIDGET_READONLY_CLASS, this._isReadOnly());
    },

    _isReadOnly: function() {
        var result = true,
            editing = this._editing;

        for(var prop in editing) {
            if(Object.prototype.hasOwnProperty.call(editing, prop)) {
                result = result && !editing[prop];
            }
        }

        return result;
    },

    _customizeStoreLoadOptions: function() {
        this._dataSource && this._dataSource.on("customizeStoreLoadOptions", this._proxiedCustomizeStoreLoadOptionsHandler);
    },

    _dispose: function() {
        this._appointmentTooltip && this._appointmentTooltip.dispose();
        this.hideAppointmentPopup();
        this.hideAppointmentTooltip();

        this._cleanAsyncTemplatesTimer();

        this._dataSource && this._dataSource.off("customizeStoreLoadOptions", this._proxiedCustomizeStoreLoadOptionsHandler);
        this.callBase();
    },

    _customizeStoreLoadOptionsHandler: function(options) {
        // TODO: deprecated since 16.1 (manually)
        options.storeLoadOptions.dxScheduler = {
            startDate: this.getStartViewDate(),
            endDate: this.getEndViewDate(),
            resources: this.option("resources")
        };
    },

    _initActions: function() {
        this._actions = {
            "onAppointmentAdding": this._createActionByOption("onAppointmentAdding"),
            "onAppointmentAdded": this._createActionByOption("onAppointmentAdded"),
            "onAppointmentUpdating": this._createActionByOption("onAppointmentUpdating"),
            "onAppointmentUpdated": this._createActionByOption("onAppointmentUpdated"),
            "onAppointmentDeleting": this._createActionByOption("onAppointmentDeleting"),
            "onAppointmentDeleted": this._createActionByOption("onAppointmentDeleted"),
            "onAppointmentFormOpening": this._createActionByOption("onAppointmentFormOpening")
        };
    },

    _getAppointmentRenderedAction: function() {
        return this._createActionByOption("onAppointmentRendered", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _renderFocusTarget: noop,

    _initMarkup: function() {
        this.callBase();

        this._processCurrentView();
        this._renderHeader();

        this._layoutManager = new SchedulerLayoutManager(this, this._getAppointmentsRenderingStrategy());

        this._appointments = this._createComponent("<div>", SchedulerAppointments, this._appointmentsConfig());
        this._appointments.option("itemTemplate", this._getAppointmentTemplate("appointmentTemplate"));

        this._appointmentTooltip = this.option("adaptivityEnabled") ? new MobileTooltipStrategy(this) : new DesktopTooltipStrategy(this);
        this._appointmentPopup = new AppointmentPopup(this);

        if(this._isLoaded()) {
            this._initMarkupCore(this._loadedResources);
            this._dataSourceChangedHandler(this._dataSource.items());
            this._fireContentReadyAction();
        } else {
            this._loadResources().done((function(resources) {
                this._initMarkupCore(resources);
                this._reloadDataSource();
            }).bind(this));
        }
    },

    _initMarkupCore: function(resources) {
        this._readyToRenderAppointments = windowUtils.hasWindow();

        this._workSpace && this._cleanWorkspace();

        this._renderWorkSpace(resources);
        this._appointments.option({
            fixedContainer: this._workSpace.getFixedContainer(),
            allDayContainer: this._workSpace.getAllDayContainer()
        });
        this._waitAsyncTemplates(() => {
            this._workSpaceRecalculation && this._workSpaceRecalculation.resolve();
        });
        this._filterAppointmentsByDate();
    },

    _isLoaded: function() {
        return this._isResourcesLoaded() && this._isDataSourceLoaded();
    },

    _isResourcesLoaded: function() {
        return typeUtils.isDefined(this._loadedResources);
    },

    _isDataSourceLoaded: function() {
        return this._dataSource && this._dataSource.isLoaded();
    },

    _render: function() {
        // NOTE: remove small class applying after adaptivity implementation
        this._toggleSmallClass();

        this._toggleAdaptiveClass();

        this.callBase();
    },

    _renderHeader: function() {
        var $header = $("<div>").appendTo(this.$element());
        this._header = this._createComponent($header, SchedulerHeader, this._headerConfig());
    },

    _headerConfig: function() {
        var result,
            currentViewOptions = this._getCurrentViewOptions(),
            countConfig = this._getViewCountConfig();

        result = extend({
            firstDayOfWeek: this.option("firstDayOfWeek"),
            currentView: this._currentView,
            tabIndex: this.option("tabIndex"),
            focusStateEnabled: this.option("focusStateEnabled"),
            width: this.option("width"),
            rtlEnabled: this.option("rtlEnabled"),
            useDropDownViewSwitcher: this.option("useDropDownViewSwitcher"),
            _dropDownButtonIcon: this.option("_dropDownButtonIcon"),
            customizeDateNavigatorText: this.option("customizeDateNavigatorText")
        }, currentViewOptions);

        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.views = this.option("views");
        result.min = new Date(this._dateOption("min"));
        result.max = new Date(this._dateOption("max"));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption("currentDate")));

        return result;
    },

    _appointmentsConfig: function() {
        var that = this;

        var config = {
            observer: this,
            onItemRendered: this._getAppointmentRenderedAction(),
            onItemClick: this._createActionByOption("onAppointmentClick"),
            onItemContextMenu: this._createActionByOption("onAppointmentContextMenu"),
            onAppointmentDblClick: this._createActionByOption("onAppointmentDblClick"),
            tabIndex: this.option("tabIndex"),
            focusStateEnabled: this.option("focusStateEnabled"),
            allowDrag: this._allowDragging(),
            allowDelete: this._editing.allowUpdating && this._editing.allowDeleting,
            allowResize: this._allowResizing(),
            allowAllDayResize: this._allowAllDayResizing(),
            rtlEnabled: this.option("rtlEnabled"),
            onContentReady: function() {
                that._workSpace && that._workSpace.option("allDayExpanded", that._isAllDayExpanded(that.getFilteredItems()));
            }
        };

        return config;
    },

    getCollectorOffset: function() {
        if(this._workSpace.needApplyCollectorOffset() && !this.option("adaptivityEnabled")) {
            return this.option("_collectorOffset");
        } else {
            return 0;
        }
    },

    getAppointmentDurationInMinutes: function() {
        return this._getCurrentViewOption("cellDuration");
    },

    _processCurrentView: function() {
        var views = this.option("views"),
            currentView = this.option("currentView"),
            that = this;

        this._currentView = currentView;

        each(views, function(_, view) {
            var isViewIsObject = typeUtils.isObject(view),
                viewName = isViewIsObject ? view.name : view,
                viewType = view.type;

            if(currentView === viewName || currentView === viewType) {
                that._currentView = view;
                return false;
            }
        });
    },

    _getCurrentViewType: function() {
        return this._currentView.type || this._currentView;
    },

    _getAppointmentsRenderingStrategy: function() {
        return VIEWS_CONFIG[this._getCurrentViewType()].renderingStrategy;
    },

    _renderWorkSpace: function(groups) {
        this._readyToRenderAppointments && this._toggleSmallClass();
        var $workSpace = $("<div>").appendTo(this.$element());

        var countConfig = this._getViewCountConfig();
        this._workSpace = this._createComponent($workSpace, VIEWS_CONFIG[this._getCurrentViewType()].workSpace, this._workSpaceConfig(groups, countConfig));
        this._allowDragging() && this._workSpace.initDragBehavior(this);
        this._workSpace.getWorkArea().append(this._appointments.$element());

        this._recalculateWorkspace();
        countConfig.startDate && this._header && this._header.option("currentDate", this._workSpace._getHeaderDate());

        this._appointments.option("_collectorOffset", this.getCollectorOffset());
    },

    _getViewCountConfig: function() {
        var currentView = this.option("currentView");

        var view = this._getViewByName(currentView),
            viewCount = view && view.intervalCount || 1,
            startDate = view && view.startDate || null;

        return {
            intervalCount: viewCount,
            startDate: startDate
        };
    },

    _getViewByName: function(name) {
        var views = this.option("views");

        for(var i = 0; i < views.length; i++) {
            if(views[i].name === name || views[i].type === name || views[i] === name) return views[i];
        }
    },

    _recalculateWorkspace: function() {
        this._workSpaceRecalculation = new Deferred();
        this._waitAsyncTemplates(() => {
            domUtils.triggerResizeEvent(this._workSpace.$element());
            this._workSpace._refreshDateTimeIndication();
        });
    },

    _workSpaceConfig: function(groups, countConfig) {
        var result,
            currentViewOptions = this._getCurrentViewOptions();

        result = extend({
            noDataText: this.option("noDataText"),
            firstDayOfWeek: this.option("firstDayOfWeek"),
            startDayHour: this.option("startDayHour"),
            endDayHour: this.option("endDayHour"),
            tabIndex: this.option("tabIndex"),
            accessKey: this.option("accessKey"),
            focusStateEnabled: this.option("focusStateEnabled"),
            cellDuration: this.option("cellDuration"),
            showAllDayPanel: this.option("showAllDayPanel"),
            showCurrentTimeIndicator: this.option("showCurrentTimeIndicator"),
            indicatorTime: this.option("indicatorTime"),
            indicatorUpdateInterval: this.option("indicatorUpdateInterval"),
            shadeUntilCurrentTime: this.option("shadeUntilCurrentTime"),
            allDayExpanded: this._appointments.option("items"),
            crossScrollingEnabled: this.option("crossScrollingEnabled"),
            dataCellTemplate: this.option("dataCellTemplate"),
            timeCellTemplate: this.option("timeCellTemplate"),
            resourceCellTemplate: this.option("resourceCellTemplate"),
            dateCellTemplate: this.option("dateCellTemplate"),
            allowMultipleCellSelection: this.option("allowMultipleCellSelection"),
            selectedCellData: this.option("selectedCellData"),
            onSelectionChanged: (args) => {
                this.option("selectedCellData", args.selectedCellData);
            },
            groupByDate: this._getCurrentViewOption("groupByDate")
        }, currentViewOptions);

        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.startDate = countConfig.startDate;
        result.groups = groups;
        result.onCellClick = this._createActionByOption("onCellClick");
        result.onCellContextMenu = this._createActionByOption("onCellContextMenu");
        result.min = new Date(this._dateOption("min"));
        result.max = new Date(this._dateOption("max"));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption("currentDate")));
        result.hoursInterval = result.cellDuration / 60;
        result.allDayExpanded = this._isAllDayExpanded(this.getFilteredItems());
        result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
        result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
        result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
        result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;

        return result;
    },

    _getCurrentViewOptions: function() {
        return this._currentView;
    },

    _getCurrentViewOption: function(optionName) {
        var currentViewOptions = this._getCurrentViewOptions();

        if(currentViewOptions && currentViewOptions[optionName] !== undefined) {
            return currentViewOptions[optionName];
        }

        return this.option(optionName);
    },

    _getAppointmentTemplate: function(optionName) {
        var currentViewOptions = this._getCurrentViewOptions();

        if(currentViewOptions && currentViewOptions[optionName]) {
            return this._getTemplate(currentViewOptions[optionName]);
        }

        return this._getTemplateByOption(optionName);
    },

    _updateOption: function(viewName, optionName, value) {
        var currentViewOptions = this._getCurrentViewOptions();

        if(!currentViewOptions || !typeUtils.isDefined(currentViewOptions[optionName])) {
            this["_" + viewName].option(optionName, value);
        }
    },

    _refreshWorkSpace: function(groups) {
        this._cleanWorkspace();

        delete this._workSpace;

        this._renderWorkSpace(groups);

        if(this._readyToRenderAppointments) {
            this._appointments.option({
                fixedContainer: this._workSpace.getFixedContainer(),
                allDayContainer: this._workSpace.getAllDayContainer()
            });
            this._waitAsyncTemplates(() => {
                this._workSpaceRecalculation.resolve();
            });
        }
    },

    _cleanWorkspace: function() {
        this._appointments.$element().detach();
        this._workSpace._dispose();
        this._workSpace.$element().remove();

        this.option("selectedCellData", []);
    },

    getWorkSpaceScrollable: function() {
        return this._workSpace.getScrollable();
    },

    getWorkSpaceScrollableScrollTop: function(allDay) {
        return this._workSpace.getGroupedScrollableScrollTop(allDay);
    },

    getWorkSpaceScrollableScrollLeft: function() {
        return this._workSpace.getScrollableScrollLeft();
    },

    getWorkSpaceScrollableContainer: function() {
        return this._workSpace.getScrollableContainer();
    },

    getWorkSpaceAllDayHeight: function() {
        return this._workSpace.getAllDayHeight();
    },

    getWorkSpaceAllDayOffset: function() {
        return this._workSpace.getAllDayOffset();
    },

    getWorkSpaceHeaderPanelHeight: function() {
        return this._workSpace.getHeaderPanelHeight();
    },

    getWorkSpaceDateTableOffset: function() {
        return !this.option("crossScrollingEnabled") || this.option("rtlEnabled") ? this._workSpace.getWorkSpaceLeftOffset() : 0;
    },

    getWorkSpace: function() {
        return this._workSpace;
    },

    getAppointmentModel: function() {
        return this._appointmentModel;
    },

    getHeader: function() {
        return this._header;
    },

    getMaxAppointmentsPerCell: function() {
        return this._getCurrentViewOption("maxAppointmentsPerCell");
    },

    _cleanPopup: function() {
        this._appointmentPopup.dispose();
    },

    _convertDatesByTimezoneBack: function(applyAppointmentTimezone, sourceAppointmentData, targetAppointmentData) {
        targetAppointmentData = targetAppointmentData || sourceAppointmentData;

        var processedStartDate = this.fire(
            "convertDateByTimezoneBack",
            this.fire("getField", "startDate", sourceAppointmentData),
            applyAppointmentTimezone && this.fire("getField", "startDateTimeZone", sourceAppointmentData)
        );

        var processedEndDate = this.fire(
            "convertDateByTimezoneBack",
            this.fire("getField", "endDate", sourceAppointmentData),
            applyAppointmentTimezone && this.fire("getField", "endDateTimeZone", sourceAppointmentData)
        );

        this.fire("setField", "startDate", targetAppointmentData, processedStartDate);
        this.fire("setField", "endDate", targetAppointmentData, processedEndDate);
    },

    _checkRecurringAppointment: function(targetAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing, dragEvent) {
        delete this._updatedRecAppointment;

        var recurrenceRule = this.fire("getField", "recurrenceRule", targetAppointment);

        if(!recurrenceUtils.getRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
            callback();
            return;
        }

        var editMode = this.option("recurrenceEditMode");
        switch(editMode) {
            case "series":
                callback();
                break;
            case "occurrence":
                this._singleAppointmentChangesHandler(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
                break;
            default:
                if(dragEvent) {
                    dragEvent.cancel = new Deferred();
                }
                this._showRecurrenceChangeConfirm(isDeleted)
                    .done((function(result) {
                        result && callback();
                        !result && this._singleAppointmentChangesHandler(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
                    }).bind(this))
                    .fail((function() {
                        this._appointments.moveAppointmentBack(dragEvent);
                    }).bind(this));
        }
    },

    _singleAppointmentChangesHandler: function(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
        exceptionDate = new Date(exceptionDate);

        function processAppointmentDates(appointment, commonTimezoneOffset) {
            var startDate = this.fire("getField", "startDate", appointment);
            var processedStartDate = this.fire(
                "convertDateByTimezoneBack",
                startDate,
                this.fire("getField", "startDateTimeZone", appointment)
            );

            var endDate = this.fire("getField", "endDate", appointment);
            var processedEndDate = this.fire(
                "convertDateByTimezoneBack",
                endDate,
                this.fire("getField", "endDateTimeZone", appointment)
            );

            if(typeof commonTimezoneOffset === "number" && !isNaN(commonTimezoneOffset)) {
                var startDateClientTzOffset = -(this._subscribes["getClientTimezoneOffset"](startDate) / toMs("hour"));
                var endDateClientTzOffset = -(this._subscribes["getClientTimezoneOffset"](endDate) / toMs("hour"));
                var processedStartDateInUTC = processedStartDate.getTime() - startDateClientTzOffset * toMs("hour"),
                    processedEndDateInUTC = processedEndDate.getTime() - endDateClientTzOffset * toMs("hour");

                processedStartDate = new Date(processedStartDateInUTC + commonTimezoneOffset * toMs("hour"));
                processedEndDate = new Date(processedEndDateInUTC + commonTimezoneOffset * toMs("hour"));
            }

            this.fire("setField", "startDate", appointment, processedStartDate);
            this.fire("setField", "endDate", appointment, processedEndDate);
        }

        this.fire("setField", "recurrenceRule", singleAppointment, "");
        this.fire("setField", "recurrenceException", singleAppointment, "");

        if(!isDeleted && !isPopupEditing) {

            processAppointmentDates.call(this, singleAppointment, this._getTimezoneOffsetByOption());

            this.addAppointment(singleAppointment);
        }

        var recurrenceException = this._makeDateAsRecurrenceException(exceptionDate, targetAppointment),
            updatedAppointment = extend({}, targetAppointment);

        this.fire("setField", "recurrenceException", updatedAppointment, recurrenceException);

        if(isPopupEditing) {
            this._updatedRecAppointment = updatedAppointment;

            processAppointmentDates.call(this, singleAppointment);

            this._showAppointmentPopup(singleAppointment, true, true);
            this._editAppointmentData = targetAppointment;

        } else {
            this._updateAppointment(targetAppointment, updatedAppointment, function() {
                this._appointments.moveAppointmentBack(dragEvent);
            }, dragEvent);
        }
    },

    _makeDateAsRecurrenceException: function(exceptionDate, targetAppointment) {
        var startDate = this._getStartDate(targetAppointment, true),
            startDateTimeZone = this.fire("getField", "startDateTimeZone", targetAppointment),
            exceptionByDate = this._getRecurrenceExceptionDate(exceptionDate, startDate, startDateTimeZone),
            recurrenceException = this.fire("getField", "recurrenceException", targetAppointment);

        return recurrenceException ? recurrenceException + "," + exceptionByDate : exceptionByDate;
    },

    _getRecurrenceExceptionDate: function(exceptionStartDate, targetStartDate, startDateTimeZone) {
        exceptionStartDate = this.fire("convertDateByTimezoneBack", exceptionStartDate, startDateTimeZone);
        var appointmentStartDate = this.fire("convertDateByTimezoneBack", targetStartDate, startDateTimeZone);

        exceptionStartDate.setHours(appointmentStartDate.getHours(),
            appointmentStartDate.getMinutes(),
            appointmentStartDate.getSeconds(),
            appointmentStartDate.getMilliseconds());

        var timezoneDiff = targetStartDate.getTimezoneOffset() - exceptionStartDate.getTimezoneOffset();
        exceptionStartDate = new Date(exceptionStartDate.getTime() - timezoneDiff * toMs("minute"));

        return dateSerialization.serializeDate(exceptionStartDate, UTC_FULL_DATE_FORMAT);
    },

    _showRecurrenceChangeConfirm: function(isDeleted) {
        var message = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteMessage" : "dxScheduler-confirmRecurrenceEditMessage"),
            seriesText = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteSeries" : "dxScheduler-confirmRecurrenceEditSeries"),
            occurrenceText = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteOccurrence" : "dxScheduler-confirmRecurrenceEditOccurrence");

        return dialog.custom({
            messageHtml: message,
            showCloseButton: true,
            showTitle: true,
            buttons: [
                { text: seriesText, onClick: function() { return true; } },
                { text: occurrenceText, onClick: function() { return false; } }
            ]
        }).show();
    },

    _getUpdatedData: function(options) {
        var target = options.data || options,
            cellData = this.getTargetCellData(),
            targetAllDay = this.fire("getField", "allDay", target),
            targetStartDate = new Date(this.fire("getField", "startDate", target)),
            targetEndDate = new Date(this.fire("getField", "endDate", target)),
            date = cellData.date || targetStartDate,
            duration = targetEndDate.getTime() - targetStartDate.getTime();

        if(this._workSpace.keepOriginalHours() && !isNaN(targetStartDate.getTime())) {
            var diff = targetStartDate.getTime() - dateUtils.trimTime(targetStartDate).getTime();
            date = new Date(dateUtils.trimTime(date).getTime() + diff);
        }

        var updatedData = {},
            allDay = cellData.allDay;

        this.fire("setField", "allDay", updatedData, allDay);
        this.fire("setField", "startDate", updatedData, date);

        var endDate = new Date(date.getTime() + duration);

        if(this.appointmentTakesAllDay(target) && !updatedData.allDay && this._workSpace.supportAllDayRow()) {
            endDate = this._workSpace.calculateEndDate(date);
        }

        if(targetAllDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
            var dateCopy = new Date(date);
            dateCopy.setHours(0);

            endDate = new Date(dateCopy.getTime() + duration);

            if(endDate.getHours() !== 0) {
                endDate.setHours(this._getCurrentViewOption("endDayHour"));
            }
        }

        this.fire("setField", "endDate", updatedData, endDate);
        this._resourcesManager.setResourcesToItem(updatedData, cellData.groups);

        return updatedData;
    },

    _getCoordinates: function(initialDates, dates, appointmentResources, allDay) {
        var result = [];

        for(var i = 0; i < dates.length; i++) {
            var currentCoords = this._workSpace.getCoordinatesByDateInGroup(dates[i], appointmentResources, allDay);

            for(var j = 0; j < currentCoords.length; j++) {
                extend(currentCoords[j], { startDate: dates[i], initialStartDate: initialDates[i] });
            }
            result = result.concat(currentCoords);
        }
        return result;
    },

    _isAppointmentRecurrence: function(appointmentData) {
        var recurrenceRule = this.fire("getField", "recurrenceRule", appointmentData);

        return recurrenceRule && recurrenceUtils.getRecurrenceRule(recurrenceRule).isValid;
    },

    resizePopup() {
        this._appointmentPopup.triggerResize();
    },

    _getSingleAppointmentData: function(appointmentData, options, skipCheckUpdate) {
        options = options || {};

        var $appointment = options.$appointment,
            updatedData = options.skipDateCalculation ? {} : this._getUpdatedData(options),
            resultAppointmentData = extend({}, appointmentData, updatedData),
            allDay = this.fire("getField", "allDay", appointmentData),
            isAllDay = this._workSpace.supportAllDayRow() && allDay,
            startDate = new Date(this.fire("getField", "startDate", resultAppointmentData)),
            endDate = new Date(this.fire("getField", "endDate", resultAppointmentData)),
            appointmentDuration = endDate.getTime() - startDate.getTime(),
            updatedStartDate,
            appointmentStartDate;

        if(typeUtils.isDefined($appointment) && (skipCheckUpdate === true || this._needUpdateAppointmentData($appointment))) {
            var apptDataCalculator = this.getRenderingStrategyInstance().getAppointmentDataCalculator();

            if(typeUtils.isFunction(apptDataCalculator)) {
                updatedStartDate = apptDataCalculator($appointment, startDate).startDate;
            } else {
                var coordinates = translator.locate($appointment);
                updatedStartDate = new Date(this._workSpace.getCellDataByCoordinates(coordinates, isAllDay).startDate);

                if($appointment.hasClass("dx-scheduler-appointment-reduced")) {
                    appointmentStartDate = $appointment.data("dxAppointmentStartDate");
                    if(appointmentStartDate) {
                        updatedStartDate = appointmentStartDate;
                    }
                }

                if(this._isAppointmentRecurrence(appointmentData)) {
                    appointmentStartDate = $appointment.data("dxAppointmentSettings") && $appointment.data("dxAppointmentSettings").startDate;
                    const isStartDateChanged = options.data && options.target && options.target.endDate && new Date(options.data.endDate).getTime() === new Date(options.target.endDate).getTime();
                    if(appointmentStartDate && !isStartDateChanged) {
                        updatedStartDate = appointmentStartDate;
                    }
                }

                if(!options.skipHoursProcessing) {
                    this.fire(
                        "convertDateByTimezoneBack",
                        updatedStartDate,
                        this.fire("getField", "startDateTimeZone", appointmentData)
                    );
                }
            }
        }

        if(!updatedStartDate && options.startDate) {
            updatedStartDate = options.startDate;
        }

        if(updatedStartDate) {
            this.fire("setField", "startDate", resultAppointmentData, updatedStartDate);
            this.fire("setField", "endDate", resultAppointmentData, new Date(updatedStartDate.getTime() + appointmentDuration));
        }

        return resultAppointmentData;
    },

    _needUpdateAppointmentData: function($appointment) {
        return $appointment.hasClass("dx-scheduler-appointment-compact") || $appointment.hasClass("dx-scheduler-appointment-recurrence");
    },

    subscribe: function(subject, action) {
        this._subscribes[subject] = subscribes[subject] = action;
    },

    fire: function(subject) {
        var callback = this._subscribes[subject],
            args = Array.prototype.slice.call(arguments);

        if(!typeUtils.isFunction(callback)) {
            throw errors.Error("E1031", subject);
        }

        return callback.apply(this, args.slice(1));
    },

    getTargetCellData: function() {
        return this._workSpace.getDataByDroppableCell();
    },

    _updateAppointment: function(target, appointment, onUpdatePrevented, dragEvent) {
        var updatingOptions = {
            newData: appointment,
            oldData: extend({}, target),
            cancel: false
        };

        var performFailAction = function(err) {
            if(typeUtils.isFunction(onUpdatePrevented)) {
                onUpdatePrevented.call(this);
            }

            if(err && err.name === "Error") {
                throw err;
            }
        }.bind(this);

        this._actions["onAppointmentUpdating"](updatingOptions);

        this._processActionResult(updatingOptions, function(canceled) {
            if(!canceled) {
                this._expandAllDayPanel(appointment);

                try {
                    this._appointmentModel
                        .update(target, appointment)
                        .done(() => {
                            if(dragEvent && typeUtils.isDeferred(dragEvent.cancel)) {
                                dragEvent.cancel.resolve(false);
                            }
                        })
                        .always((function(e) {
                            this._executeActionWhenOperationIsCompleted(this._actions["onAppointmentUpdated"], appointment, e);
                        }).bind(this))
                        .fail(function() {
                            performFailAction();
                        });
                } catch(err) {
                    performFailAction(err);
                }
            } else {
                performFailAction();
            }
        });
    },

    _processActionResult: function(actionOptions, callback) {
        if(typeUtils.isPromise(actionOptions.cancel)) {
            when(deferredUtils.fromPromise(actionOptions.cancel)).always((cancel) => {
                if(!typeUtils.isDefined(cancel)) {
                    cancel = actionOptions.cancel.state() === "rejected";
                }

                callback.call(this, cancel);
            });
        } else {
            callback.call(this, actionOptions.cancel);
        }
    },

    _expandAllDayPanel: function(appointment) {
        if(!this._isAllDayExpanded(this.getFilteredItems()) && this.appointmentTakesAllDay(appointment)) {
            this._workSpace.option("allDayExpanded", true);
        }
    },

    _executeActionWhenOperationIsCompleted: function(action, appointment, e) {
        var options = { appointmentData: appointment },
            isError = e && e.name === "Error";

        if(isError) {
            options.error = e;
        } else {
            this._appointmentPopup.isVisible() && this._appointmentPopup.hide();
        }
        action(options);

        this._fireContentReadyAction();
    },

    _showAppointmentPopup: function(data, visibleButtons, isProcessTimeZone) {
        this._appointmentPopup.show(data, visibleButtons, isProcessTimeZone);
    },

    getAppointmentPopup: function() {
        return this._appointmentPopup.getPopup();
    },

    getAppointmentDetailsForm: function() { // TODO for tests
        return this._appointmentPopup._appointmentForm;
    },

    getUpdatedAppointment: function() {
        return this._appointmentModel.getUpdatedAppointment();
    },

    getUpdatedAppointmentKeys: function() {
        return this._appointmentModel.getUpdatedAppointmentKeys();
    },

    getAppointmentsInstance: function() {
        return this._appointments;
    },

    getResourceManager: function() {
        return this._resourcesManager;
    },

    getLayoutManager: function() {
        return this._layoutManager;
    },

    getRenderingStrategyInstance: function() {
        return this._layoutManager.getRenderingStrategyInstance();
    },

    getFilteredItems: function() {
        return this._filteredItems;
    },

    getActions: function() {
        return this._actions;
    },

    appointmentTakesAllDay: function(appointment) {
        return this._appointmentModel.appointmentTakesAllDay(appointment, this._getCurrentViewOption("startDayHour"), this._getCurrentViewOption("endDayHour"));
    },

    _getStartDate: function(appointment, skipNormalize) {
        var startDate = this.fire("getField", "startDate", appointment),
            startDateTimeZone = this.fire("getField", "startDateTimeZone", appointment);

        startDate = dateUtils.makeDate(startDate);

        startDate = this.fire("convertDateByTimezone", startDate, startDateTimeZone);

        !skipNormalize && this.fire("updateAppointmentStartDate", {
            startDate: startDate,
            appointment: appointment,
            callback: function(result) {
                startDate = result;
            }
        });

        return startDate;
    },

    _getEndDate: function(appointment, skipNormalize) {
        var endDate = this.fire("getField", "endDate", appointment);

        if(endDate) {

            var endDateTimeZone = this.fire("getField", "endDateTimeZone", appointment);

            endDate = dateUtils.makeDate(endDate);

            endDate = this.fire("convertDateByTimezone", endDate, endDateTimeZone);

            !skipNormalize && this.fire("updateAppointmentEndDate", {
                endDate: endDate,
                callback: function(result) {
                    endDate = result;
                }
            });
        }
        return endDate;
    },

    _getRecurrenceException: function(appointmentData) {
        var recurrenceException = this.fire("getField", "recurrenceException", appointmentData);

        if(recurrenceException) {
            var startDate = this.fire("getField", "startDate", appointmentData),
                exceptions = recurrenceException.split(","),
                startDateTimeZone = this.fire("getField", "startDateTimeZone", appointmentData),
                exceptionByStartDate = this.fire("convertDateByTimezone", startDate, startDateTimeZone);

            for(var i = 0; i < exceptions.length; i++) {
                exceptions[i] = this._convertRecurrenceException(exceptions[i], exceptionByStartDate, startDateTimeZone);
            }

            recurrenceException = exceptions.join();
        }

        return recurrenceException;
    },

    _convertRecurrenceException: function(exception, exceptionByStartDate, startDateTimeZone) {
        exception = exception.replace(/\s/g, "");
        exception = dateSerialization.deserializeDate(exception);
        exception = this.fire("convertDateByTimezone", exception, startDateTimeZone);
        exception.setHours(exceptionByStartDate.getHours());
        exception = dateSerialization.serializeDate(exception, FULL_DATE_FORMAT);
        return exception;
    },

    recurrenceEditorVisibilityChanged: function(visible) {
        if(this._appointmentPopup._appointmentForm) {
            this._appointmentPopup._appointmentForm.$element()
                .find("." + RECURRENCE_EDITOR_ITEM_CLASS)
                .toggleClass(RECURRENCE_EDITOR_OPENED_ITEM_CLASS, visible);
        }
    },

    dayHasAppointment: function(day, appointment, trimTime) {
        var startDate = new Date(this.fire("getField", "startDate", appointment)),
            endDate = new Date(this.fire("getField", "endDate", appointment)),
            startDateTimeZone = this.fire("getField", "startDateTimeZone", appointment),
            endDateTimeZone = this.fire("getField", "endDateTimeZone", appointment);

        startDate = this.fire("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.fire("convertDateByTimezone", endDate, endDateTimeZone);

        if(day.getTime() === endDate.getTime()) {
            return startDate.getTime() === endDate.getTime();
        }

        if(trimTime) {
            day = dateUtils.trimTime(day);
            startDate = dateUtils.trimTime(startDate);
            endDate = dateUtils.trimTime(endDate);
        }

        var dayTimeStamp = day.getTime(),
            startDateTimeStamp = startDate.getTime(),
            endDateTimeStamp = endDate.getTime();


        return (inArray(dayTimeStamp, [startDateTimeStamp, endDateTimeStamp]) > -1)
                ||
                (startDateTimeStamp < dayTimeStamp && endDateTimeStamp > dayTimeStamp);
    },

    setTargetedAppointmentResources: function(targetedAppointment, appointmentElement, appointmentIndex) {
        var groups = this._getCurrentViewOption("groups");

        if(groups && groups.length) {
            var resourcesSetter = this._resourcesManager._dataAccessors.setter,
                workSpace = this._workSpace,
                getGroups,
                setResourceCallback;

            if(this._isAgenda()) {
                getGroups = function() {
                    var apptSettings = this.getLayoutManager()._positionMap[appointmentIndex];
                    return workSpace._getCellGroups(apptSettings[0].groupIndex);
                };

                setResourceCallback = function(_, group) {
                    resourcesSetter[group.name](targetedAppointment, group.id);
                };
            } else {
                getGroups = function() {
                    var setting = $(appointmentElement).data("dxAppointmentSettings") || {}; // TODO: in the future, necessary refactor the engine of determining groups
                    return workSpace.getCellDataByCoordinates({ left: setting.left, top: setting.top }).groups;
                };

                setResourceCallback = function(field, value) {
                    resourcesSetter[field](targetedAppointment, value);
                };
            }

            each(getGroups.call(this), setResourceCallback);
        }
    },

    /**
        * @name dxSchedulerMethods.getStartViewDate
        * @publicName getStartViewDate()
        * @return Date
        */
    getStartViewDate: function() {
        return this._workSpace.getStartViewDate();
    },

    /**
        * @name dxSchedulerMethods.getEndViewDate
        * @publicName getEndViewDate()
        * @return Date
        */
    getEndViewDate: function() {
        return this._workSpace.getEndViewDate();
    },

    /**
        * @name dxSchedulerMethods.showAppointmentPopup
        * @publicName showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)
        * @param1 appointmentData:Object|undefined
        * @param2 createNewAppointment:Boolean|undefined
        * @param3 currentAppointmentData:Object|undefined
        */
    showAppointmentPopup: function(appointmentData, createNewAppointment, currentAppointmentData) {
        var singleAppointment = currentAppointmentData || this._getSingleAppointmentData(appointmentData, { skipDateCalculation: true });
        var startDate = this.fire("getField", "startDate", currentAppointmentData || appointmentData);

        this._checkRecurringAppointment(appointmentData, singleAppointment, startDate, function() {
            if(createNewAppointment || typeUtils.isEmptyObject(appointmentData)) {
                delete this._editAppointmentData;
                this._editing.allowAdding && this._showAppointmentPopup(appointmentData, true, false);
            } else {
                this._editAppointmentData = appointmentData;
                this._showAppointmentPopup(appointmentData, this._editing.allowUpdating, true);
            }
        }.bind(this), false, true);
    },

    /**
        * @name dxSchedulerMethods.hideAppointmentPopup
        * @publicName hideAppointmentPopup(saveChanges)
        * @param1 saveChanges:Boolean|undefined
        */
    hideAppointmentPopup: function(saveChanges) {
        if(this._appointmentPopup.isVisible()) {
            saveChanges && this._appointmentPopup.saveChanges();
            this._appointmentPopup.hide();
        }
    },

    /**
        * @name dxSchedulerMethods.showAppointmentTooltip
        * @publicName showAppointmentTooltip(appointmentData, target, currentAppointmentData)
        * @param1 appointmentData:Object
        * @param2 target:string|Node|jQuery
        * @param3 currentAppointmentData:Object|undefined
        */
    showAppointmentTooltip: function(appointmentData, target, currentAppointmentData) {
        if(appointmentData) {
            this.showAppointmentTooltipCore(target, [{
                color: this._appointments._tryGetAppointmentColor(target),
                data: appointmentData,
                currentData: currentAppointmentData,
            }], true);
        }
    },

    showAppointmentTooltipCore: function(target, data, isSingleBehavior) {
        this._appointmentTooltip.show(target, data, isSingleBehavior);
    },

    /**
        * @name dxSchedulerMethods.hideAppointmentTooltip
        * @publicName hideAppointmentTooltip()
        */
    hideAppointmentTooltip: function() {
        this._appointmentTooltip.hide();
    },

    /**
        * @name dxSchedulerMethods.scrollToTime
        * @publicName scrollToTime(hours, minutes, date)
        * @param1 hours:Number
        * @param2 minutes:Number
        * @param3 date:Date|undefined
        */
    scrollToTime: function(hours, minutes, date) {
        this._workSpace.scrollToTime(hours, minutes, date);
    },

    /**
        * @name dxSchedulerMethods.addAppointment
        * @publicName addAppointment(appointment)
        * @param1 appointment:Object
        */
    addAppointment: function(appointment) {
        var text = this.fire("getField", "text", appointment);

        if(!text) {
            this.fire("setField", "text", appointment, "");
        }

        this._convertDatesByTimezoneBack(true, appointment);

        var addingOptions = {
            appointmentData: appointment,
            cancel: false
        };

        this._actions["onAppointmentAdding"](addingOptions);

        this._processActionResult(addingOptions, function(canceled) {
            if(!canceled) {
                this._expandAllDayPanel(appointment);
                this._appointmentModel.add(appointment, {
                    value: this._getTimezoneOffsetByOption(),
                    clientOffset: this.fire("getClientTimezoneOffset")
                }).always((function(e) {
                    this._executeActionWhenOperationIsCompleted(this._actions["onAppointmentAdded"], appointment, e);
                }).bind(this));
            }
        });
    },

    /**
        * @name dxSchedulerMethods.updateAppointment
        * @publicName updateAppointment(target, appointment)
        * @param1 target:Object
        * @param2 appointment:Object
        */
    updateAppointment: function(target, appointment) {
        this._updateAppointment(target, appointment);
    },

    /**
        * @name dxSchedulerMethods.deleteAppointment
        * @publicName deleteAppointment(appointment)
        * @param1 appointment:Object
        */
    deleteAppointment: function(appointment) {
        var deletingOptions = {
            appointmentData: appointment,
            cancel: false
        };

        this._actions["onAppointmentDeleting"](deletingOptions);

        this._processActionResult(deletingOptions, function(canceled) {
            if(!canceled) {
                this._appointmentModel.remove(appointment).always((function(e) {
                    this._executeActionWhenOperationIsCompleted(this._actions["onAppointmentDeleted"], appointment, e);
                }).bind(this));
            }
        });
    },

    focus: function() {
        if(this._editAppointmentData) {
            this._appointments.focus();
        } else {
            this._workSpace.focus();
        }
    },

    getFirstDayOfWeek: function() {
        return typeUtils.isDefined(this.option("firstDayOfWeek")) ? this.option("firstDayOfWeek") : dateLocalization.firstDayOfWeekIndex();
    },

    /**
        * @name dxSchedulerMethods.registerKeyHandler
        * @publicName registerKeyHandler(key, handler)
        * @hidden
        */

}).include(AsyncTemplateMixin, DataHelperMixin);

registerComponent("dxScheduler", Scheduler);

module.exports = Scheduler;
