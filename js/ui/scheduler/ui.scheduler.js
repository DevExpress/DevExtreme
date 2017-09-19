"use strict";

var $ = require("../../core/renderer"),
    Callbacks = require("../../core/utils/callbacks"),
    translator = require("../../animation/translator"),
    errors = require("../widget/ui.errors"),
    dialog = require("../dialog"),
    recurrenceUtils = require("./utils.recurrence"),
    domUtils = require("../../core/utils/dom"),
    dateUtils = require("../../core/utils/date"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    dateSerialization = require("../../core/utils/date_serialization"),
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    devices = require("../../core/devices"),
    config = require("../../core/config"),
    registerComponent = require("../../core/component_registrator"),
    messageLocalization = require("../../localization/message"),
    dateSerialization = require("../../core/utils/date_serialization"),
    Widget = require("../widget/ui.widget"),
    subscribes = require("./ui.scheduler.subscribes"),
    FunctionTemplate = require("../widget/function_template"),
    appointmentTooltip = require("./ui.scheduler.appointment_tooltip"),
    SchedulerHeader = require("./ui.scheduler.header"),
    SchedulerWorkSpaceDay = require("./ui.scheduler.work_space_day"),
    SchedulerWorkSpaceWeek = require("./ui.scheduler.work_space_week"),
    SchedulerWorkSpaceWorkWeek = require("./ui.scheduler.work_space_work_week"),
    SchedulerWorkSpaceMonth = require("./ui.scheduler.work_space_month"),
    SchedulerTimelineDay = require("./ui.scheduler.timeline_day"),
    SchedulerTimelineWeek = require("./ui.scheduler.timeline_week"),
    SchedulerTimelineWorkWeek = require("./ui.scheduler.timeline_work_week"),
    SchedulerTimelineMonth = require("./ui.scheduler.timeline_month"),
    SchedulerAgenda = require("./ui.scheduler.agenda"),
    SchedulerResourceManager = require("./ui.scheduler.resource_manager"),
    SchedulerAppointmentModel = require("./ui.scheduler.appointment_model"),
    SchedulerAppointments = require("./ui.scheduler.appointments"),
    SchedulerLayoutManager = require("./ui.scheduler.appointments.layout_manager"),
    DropDownAppointments = require("./ui.scheduler.appointments.drop_down"),
    SchedulerTimezones = require("./ui.scheduler.timezones"),
    DataHelperMixin = require("../../data_helper"),
    loading = require("./ui.loading"),
    AppointmentForm = require("./ui.scheduler.appointment_form"),
    Popup = require("../popup"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    EmptyTemplate = require("../widget/empty_template"),
    BindableTemplate = require("../widget/bindable_template");

var WIDGET_CLASS = "dx-scheduler",
    WIDGET_SMALL_CLASS = "dx-scheduler-small",
    WIDGET_READONLY_CLASS = "dx-scheduler-readonly",
    APPOINTMENT_POPUP_CLASS = "dx-scheduler-appointment-popup",
    RECURRENCE_EDITOR_ITEM_CLASS = "dx-scheduler-recurrence-rule-item",
    RECURRENCE_EDITOR_OPENED_ITEM_CLASS = "dx-scheduler-recurrence-rule-item-opened",
    WIDGET_SMALL_WIDTH = 400,
    APPOINTEMENT_POPUP_WIDTH = 610;

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

var Scheduler = Widget.inherit({
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
                * @type Array
                * @default []
                */

                /**
                * @pseudo FirstDayOfWeek
                * @type number
                * @default undefined
                * @acceptValues 0|1|2|3|4|5|6
                */

                /**
                * @pseudo CellDuration
                * @type number
                * @default 30
                */

                /**
                * @pseudo AppointmentTemplate
                * @type template
                * @default "item"
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:jQuery
                * @type_function_return string|Node|jQuery
                */

                /**
                * @pseudo AppointmentTooltipTemplate
                * @type template
                * @default "appointmentTooltip"
                * @type_function_param1 appointmentData:object
                * @type_function_param2 contentElement:jQuery
                * @type_function_return string|jQuery
                */

                /**
                * @pseudo DateCellTemplate
                * @type template
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:jQuery
                * @type_function_return string|Node|jQuery
                */

                /**
                * @pseudo DataCellTemplate
                * @type template
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:jQuery
                * @type_function_return string|Node|jQuery
                */

                /**
                * @pseudo TimeCellTemplate
                * @type template
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:jQuery
                * @type_function_return string|Node|jQuery
                */

                /**
                * @pseudo ResourceCellTemplate
                * @type template
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:jQuery
                * @type_function_return string|Node|jQuery
                */

                /**
                * @name dxSchedulerOptions_views
                * @publicName views
                * @type Array
                * @default ['day', 'week']
                * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
                */
            views: ["day", "week"],

                /**
                * @name dxSchedulerOptions_views_type
                * @publicName type
                * @type string
                * @default undefined
                * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
                */

                /**
                * @name dxSchedulerOptions_views_name
                * @publicName name
                * @type string
                * @default undefined
                */

                /**
                * @name dxSchedulerOptions_views_maxAppointmentsPerCell
                * @publicName maxAppointmentsPerCell
                * @type number|string
                * @default undefined
                * @acceptValues 'auto'|'unlimited'
                */

                /**
                * @name dxSchedulerOptions_views_intervalCount
                * @publicName intervalCount
                * @type number
                * @default 1
                */

                /**
                * @name dxSchedulerOptions_views_startDate
                * @publicName startDate
                * @type Date|number|string
                * @default undefined
                */

                /**
                * @name dxSchedulerOptions_views_startDayHour
                * @publicName startDayHour
                * @extends StartDayHour
                */

                /**
                * @name dxSchedulerOptions_views_endDayHour
                * @publicName endDayHour
                * @extends EndDayHour
                */

                /**
                * @name dxSchedulerOptions_views_groups
                * @publicName groups
                * @extends Groups
                */

                /**
                * @name dxSchedulerOptions_views_firstDayOfWeek
                * @publicName firstDayOfWeek
                * @extends FirstDayOfWeek
                */

                /**
                * @name dxSchedulerOptions_views_cellDuration
                * @publicName cellDuration
                * @extends CellDuration
                */

                /**
                * @name dxSchedulerOptions_views_appointmentTemplate
                * @publicName appointmentTemplate
                * @extends AppointmentTemplate
                */

                /**
                * @name dxSchedulerOptions_views_appointmentTooltipTemplate
                * @publicName appointmentTooltipTemplate
                * @extends AppointmentTooltipTemplate
                */

                /**
                * @name dxSchedulerOptions_views_dateCellTemplate
                * @publicName dateCellTemplate
                * @extends DateCellTemplate
                */

                /**
                * @name dxSchedulerOptions_views_timeCellTemplate
                * @publicName timeCellTemplate
                * @extends TimeCellTemplate
                */

                /**
                * @name dxSchedulerOptions_views_dataCellTemplate
                * @publicName dataCellTemplate
                * @extends DataCellTemplate
                */

                /**
                * @name dxSchedulerOptions_views_resourceCellTemplate
                * @publicName resourceCellTemplate
                * @extends ResourceCellTemplate
                */

                /**
                * @name dxSchedulerOptions_views_agendaDuration
                * @publicName agendaDuration
                * @type number
                * default 7
                */

                /**
                * @name dxSchedulerOptions_currentView
                * @publicName currentView
                * @type string
                * @default "day"
                * @acceptValues 'day'|'week'|'workWeek'|'month'|'timelineDay'|'timelineWeek'|'timelineWorkWeek'|'timelineMonth'|'agenda'
                */
            currentView: "day", //TODO: should we calculate currentView if views array contains only one item, for example 'month'?
                /**
                * @name dxSchedulerOptions_currentDate
                * @publicName currentDate
                * @type Date|number|string
                * @default new Date()
                */
            currentDate: dateUtils.trimTime(new Date()),
                /**
                * @name dxSchedulerOptions_min
                * @publicName min
                * @type Date|number|string
                * @default undefined
                */
            min: undefined,
                /**
                * @name dxSchedulerOptions_max
                * @publicName max
                * @type Date|number|string
                * @default undefined
                */
            max: undefined,
                /**
                * @name dxSchedulerOptions_dateSerializationFormat
                * @publicName dateSerializationFormat
                * @type string
                * @default undefined
                */
            dateSerializationFormat: undefined,
                /**
                * @name dxSchedulerOptions_firstDayOfWeek
                * @publicName firstDayOfWeek
                * @extends FirstDayOfWeek
                */
            firstDayOfWeek: undefined,

                /**
                * @name dxSchedulerOptions_groups
                * @publicName groups
                * @extends Groups
                */
            groups: [],

                /**
                * @name dxSchedulerOptions_resources
                * @publicName resources
                * @type Array
                * @default []
                */
            resources: [
                    /**
                    * @name dxSchedulerOptions_resources_field
                    * @publicName field
                    * @deprecated
                    * @type String
                    * @default ""
                    */

                    /**
                    * @name dxSchedulerOptions_resources_fieldExpr
                    * @publicName fieldExpr
                    * @type String
                    * @default ""
                    */

                    /**
                    * @name dxSchedulerOptions_resources_colorExpr
                    * @publicName colorExpr
                    * @type String
                    * @default "color"
                    */

                    /**
                    * @name dxSchedulerOptions_resources_label
                    * @publicName label
                    * @type String
                    * @default ""
                    */

                    /**
                    * @name dxSchedulerOptions_resources_allowMultiple
                    * @publicName allowMultiple
                    * @type Boolean
                    * @default false
                    */

                    /**
                    * @name dxSchedulerOptions_resources_mainColor
                    * @publicName mainColor
                    * @deprecated
                    * @type Boolean
                    * @default false
                    */

                    /**
                    * @name dxSchedulerOptions_resources_useColorAsDefault
                    * @publicName useColorAsDefault
                    * @type Boolean
                    * @default false
                    */

                    /**
                    * @name dxSchedulerOptions_resources_valueExpr
                    * @publicName valueExpr
                    * @type string|function
                    * @default 'id'
                    */

                    /**
                    * @name dxSchedulerOptions_resources_displayExpr
                    * @publicName displayExpr
                    * @type string|function
                    * @default 'text'
                    */

                    /**
                    * @name dxSchedulerOptions_resources_dataSource
                    * @publicName dataSource
                    * @type string|array|DataSource|DataSourceOptions
                    * @default null
                    */
            ],

                /**
                * @name dxSchedulerOptions_dataSource
                * @publicName dataSource
                * @type string|array|DataSource|DataSourceOptions
                * @default null
                */
            dataSource: null,

                /**
                * @name dxSchedulerOptions_appointmentTemplate
                * @publicName appointmentTemplate
                * @extends AppointmentTemplate
                */
            appointmentTemplate: "item",

                /**
                * @name dxSchedulerOptions_dataCellTemplate
                * @publicName dataCellTemplate
                * @extends DataCellTemplate
                */
            dataCellTemplate: null,

                /**
                * @name dxSchedulerOptions_timeCellTemplate
                * @publicName timeCellTemplate
                * @extends TimeCellTemplate
                */
            timeCellTemplate: null,

                /**
                * @name dxSchedulerOptions_resourceCellTemplate
                * @publicName resourceCellTemplate
                * @extends ResourceCellTemplate
                */
            resourceCellTemplate: null,

                /**
                * @name dxSchedulerOptions_dateCellTemplate
                * @publicName dateCellTemplate
                * @extends DateCellTemplate
                */
            dateCellTemplate: null,

                /**
                * @name dxSchedulerOptions_startDayHour
                * @publicName startDayHour
                * @extends StartDayHour
                */
            startDayHour: 0,

                /**
                * @name dxSchedulerOptions_endDayHour
                * @publicName endDayHour
                * @extends EndDayHour
                */
            endDayHour: 24,

                /**
                * @name dxSchedulerOptions_editing
                * @publicName editing
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
                * @name dxSchedulerOptions_editing_allowAdding
                * @publicName allowAdding
                * @type boolean
                * @default true
                */
                /**
                * @name dxSchedulerOptions_editing_allowUpdating
                * @publicName allowUpdating
                * @type boolean
                * @default true
                */
                /**
                * @name dxSchedulerOptions_editing_allowDeleting
                * @publicName allowDeleting
                * @type boolean
                * @default true
                */
                /**
                * @name dxSchedulerOptions_editing_allowResizing
                * @publicName allowResizing
                * @type boolean
                * @default true
                */
                /**
                * @name dxSchedulerOptions_editing_allowDragging
                * @publicName allowDragging
                * @type boolean
                * @default true
                */

                /**
                * @name dxSchedulerOptions_showAllDayPanel
                * @publicName showAllDayPanel
                * @type boolean
                * @default true
                */
            showAllDayPanel: true,

            /**
                * @name dxSchedulerOptions_showCurrentTimeIndicator
                * @publicName showCurrentTimeIndicator
                * @type boolean
                * @default true
                */
            showCurrentTimeIndicator: true,
            indicatorTime: undefined,
            currentIndicatorInterval: 10000,

                /**
                * @name dxSchedulerOptions_recurrenceEditMode
                * @publicName recurrenceEditMode
                * @type string
                * @default "dialog"
                * @acceptValues 'dialog'|'series'|'occurrence'
                */
            recurrenceEditMode: "dialog",

                /**
                * @name dxSchedulerOptions_cellDuration
                * @publicName cellDuration
                * @extends CellDuration
                */
            cellDuration: 30,

                /**
                * @name dxSchedulerOptions_onAppointmentRendered
                * @publicName onAppointmentRendered
                * @extends Action
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:jQuery
                * @action
                */
            onAppointmentRendered: null,

                /**
                * @name dxSchedulerOptions_onAppointmentClick
                * @publicName onAppointmentClick
                * @type function|string
                * @extends Action
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:jQuery
                * @type_function_param1_field7 jQueryEvent:jQueryEvent
                * @type_function_param1_field8 cancel:Boolean
                * @action
                */
            onAppointmentClick: null,

                /**
                * @name dxSchedulerOptions_onAppointmentDblClick
                * @publicName onAppointmentDblClick
                * @type function|string
                * @extends Action
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 targetedAppointmentData:object
                * @type_function_param1_field6 appointmentElement:jQuery
                * @type_function_param1_field7 jQueryEvent:jQueryEvent
                * @type_function_param1_field8 cancel:Boolean
                * @action
                */
            onAppointmentDblClick: null,

                /**
                * @name dxSchedulerOptions_onCellClick
                * @publicName onCellClick
                * @type function|string
                * @extends Action
                * @type_function_param1_field4 cellData:object
                * @type_function_param1_field5 cellElement:jQuery
                * @type_function_param1_field6 jQueryEvent:jQueryEvent
                * @type_function_param1_field7 cancel:Boolean
                * @action
                */
            onCellClick: null,

                /**
                * @name dxSchedulerOptions_onAppointmentAdding
                * @publicName onAppointmentAdding
                * @extends Action
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 cancel:Boolean|Promise
                * @action
                */
            onAppointmentAdding: null,

                /**
                * @name dxSchedulerOptions_onAppointmentAdded
                * @publicName onAppointmentAdded
                * @extends Action
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 error:JavaScript Error object
                * @action
                */
            onAppointmentAdded: null,

                /**
                * @name dxSchedulerOptions_onAppointmentUpdating
                * @publicName onAppointmentUpdating
                * @extends Action
                * @type_function_param1_field4 oldData:Object
                * @type_function_param1_field5 newData:Object
                * @type_function_param1_field6 cancel:Boolean|Promise
                * @action
                */
            onAppointmentUpdating: null,

                /**
                * @name dxSchedulerOptions_onAppointmentUpdated
                * @publicName onAppointmentUpdated
                * @extends Action
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 error:JavaScript Error object
                * @action
                */
            onAppointmentUpdated: null,

                /**
                * @name dxSchedulerOptions_onAppointmentDeleting
                * @publicName onAppointmentDeleting
                * @extends Action
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 cancel:Boolean|Promise
                * @action
                */
            onAppointmentDeleting: null,

                /**
                * @name dxSchedulerOptions_onAppointmentDeleted
                * @publicName onAppointmentDeleted
                * @extends Action
                * @type_function_param1_field4 appointmentData:Object
                * @type_function_param1_field5 error:JavaScript Error object
                * @action
                */
            onAppointmentDeleted: null,

                /**
                * @name dxSchedulerOptions_onAppointmentFormCreated
                * @publicName onAppointmentFormCreated
                * @extends Action
                * @type_function_param1_field4 appointmentData:object
                * @type_function_param1_field5 form:Object
                * @action
               */
            onAppointmentFormCreated: null,

                /**
                * @name dxSchedulerOptions_appointmentTooltipTemplate
                * @publicName appointmentTooltipTemplate
                * @extends AppointmentTooltipTemplate
                */
            appointmentTooltipTemplate: "appointmentTooltip",

                /**
                * @hidden
                * @name dxSchedulerOptions_appointmentPopupTemplate
                * @publicName appointmentPopupTemplate
                * @type template
                * @default "appointmentPopup"
                * @type_function_param1 appointmentData:object
                * @type_function_param2 contentElement:jQuery
                * @type_function_return string|jQuery
                */
            appointmentPopupTemplate: "appointmentPopup",

                /**
                * @name dxSchedulerOptions_crossScrollingEnabled
                * @publicName crossScrollingEnabled
                * @type boolean
                * @default false
                */
            crossScrollingEnabled: false,

                /**
                * @name dxSchedulerOptions_useDropDownViewSwitcher
                * @publicName useDropDownViewSwitcher
                * @type boolean
                * @default false
                */
            useDropDownViewSwitcher: false,

                /**
                * @name dxSchedulerOptions_startDateExpr
                * @publicName startDateExpr
                * @type string
                * @default 'startDate'
                */
            startDateExpr: "startDate",

                /**
                * @name dxSchedulerOptions_endDateExpr
                * @publicName endDateExpr
                * @type string
                * @default 'endDate'
                */
            endDateExpr: "endDate",

                /**
                * @name dxSchedulerOptions_textExpr
                * @publicName textExpr
                * @type string
                * @default 'text'
                */
            textExpr: "text",

                /**
                * @name dxSchedulerOptions_descriptionExpr
                * @publicName descriptionExpr
                * @type string
                * @default 'description'
                */
            descriptionExpr: "description",

                /**
                * @name dxSchedulerOptions_allDayExpr
                * @publicName allDayExpr
                * @type string
                * @default 'allDay'
                */
            allDayExpr: "allDay",

                /**
                * @name dxSchedulerOptions_recurrenceRuleExpr
                * @publicName recurrenceRuleExpr
                * @type string
                * @default 'recurrenceRule'
                */
            recurrenceRuleExpr: "recurrenceRule",

                /**
                * @name dxSchedulerOptions_recurrenceExceptionExpr
                * @publicName recurrenceExceptionExpr
                * @type string
                * @default 'recurrenceException'
                */
            recurrenceExceptionExpr: "recurrenceException",

                /**
                * @name dxSchedulerOptions_remoteFiltering
                * @publicName remoteFiltering
                * @type boolean
                * @default false
                */
            remoteFiltering: false,

                /**
                * @name dxSchedulerOptions_timeZone
                * @publicName timeZone
                * @type string
                * @default ""
                */
            timeZone: "",

                /**
                * @name dxSchedulerOptions_startDateTimeZoneExpr
                * @publicName startDateTimeZoneExpr
                * @type string
                * @default 'startDateTimeZone'
                */
            startDateTimeZoneExpr: "startDateTimeZone",

                /**
                * @name dxSchedulerOptions_endDateTimeZoneExpr
                * @publicName endDateTimeZoneExpr
                * @type string
                * @default 'endDateTimeZone'
                */
            endDateTimeZoneExpr: "endDateTimeZone",

                /**
                * @name dxSchedulerOptions_noDataText
                * @publicName noDataText
                * @type string
                * @default "No data to display"
                */
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),

            allowMultipleCellSelection: true

                /**
                * @name dxSchedulerOptions_onContentReady
                * @publicName onContentReady
                * @extends Action
                * @hidden false
                * @action
                */

                /**
                * @name dxSchedulerOptions_activeStateEnabled
                * @publicName activeStateEnabled
                * @hidden
                * @extend_doc
                */

                /**
                * @name dxSchedulerOptions_hoverStateEnabled
                * @publicName hoverStateEnabled
                * @hidden
                * @extend_doc
                */

                /**
                * @name dxSchedulerAppointmentTemplate_html
                * @publicName html
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTemplate_disabled
                * @publicName disabled
                * @type boolean
                * @default false
                */
                /**
                * @name dxSchedulerAppointmentTemplate_visible
                * @publicName visible
                * @type boolean
                * @default true
                */
                /**
                * @name dxSchedulerAppointmentTemplate_template
                * @publicName template
                * @type template
                */
                /**
                * @name dxSchedulerAppointmentTemplate_text
                * @publicName text
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTemplate_startDate
                * @publicName startDate
                * @type Date
                */
                /**
                * @name dxSchedulerAppointmentTemplate_endDate
                * @publicName endDate
                * @type Date
                */
                /**
                * @name dxSchedulerAppointmentTemplate_description
                * @publicName description
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTemplate_recurrenceRule
                * @publicName recurrenceRule
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTemplate_recurrenceException
                * @publicName recurrenceException
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTemplate_allDay
                * @publicName allDay
                * @type Boolean
                */
                /**
                * @name dxSchedulerAppointmentTemplate_startDateTimeZone
                * @publicName startDateTimeZone
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTemplate_endDateTimeZone
                * @publicName endDateTimeZone
                * @type String
                */

                /**
                * @name dxSchedulerAppointmentTooltipTemplate_text
                * @publicName text
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_startDate
                * @publicName startDate
                * @type Date
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_endDate
                * @publicName endDate
                * @type Date
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_description
                * @publicName description
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_recurrenceRule
                * @publicName recurrenceRule
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_recurrenceException
                * @publicName recurrenceException
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_allDay
                * @publicName allDay
                * @type Boolean
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_startDateTimeZone
                * @publicName startDateTimeZone
                * @type String
                */
                /**
                * @name dxSchedulerAppointmentTooltipTemplate_endDateTimeZone
                * @publicName endDateTimeZone
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
                        * @name dxSchedulerOptions_focusStateEnabled
                        * @publicName focusStateEnabled
                        * @type boolean
                        * @custom_default_for_generic true
                        * @extend_doc
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
                       * @name dxSchedulerOptions_useDropDownViewSwitcher
                       * @publicName useDropDownViewSwitcher
                       * @custom_default_for_mobile true
                       */
                    useDropDownViewSwitcher: true,

                        /**
                       * @name dxSchedulerOptions_editing_allowResizing
                       * @publicName allowResizing
                       * @custom_default_for_mobile false
                       */

                        /**
                       * @name dxSchedulerOptions_editing_allowDragging
                       * @publicName allowDragging
                       * @custom_default_for_mobile false
                       */
                    editing: {
                        allowDragging: false,
                        allowResizing: false
                    }
                }
            }
        ]);
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
                /**
                * @name dxSchedulerOptions_horizontalScrollingEnabled
                * @publicName horizontalScrollingEnabled
                * @deprecated dxSchedulerOptions_crossScrollingEnabled
                * @extend_doc
                */
            "horizontalScrollingEnabled": { since: "16.1", alias: "crossScrollingEnabled" }
        });
    },

    _optionChanged: function(args) {
        var value = args.value,
            name = args.name;

        switch(args.name) {
            case "firstDayOfWeek":
                this._updateOption("workSpace", name, value);
                this._updateOption("header", name, value);
                break;
            case "currentDate":
                value = this._dateOption(name);
                value = dateUtils.trimTime(new Date(value));
                this._workSpace.option(name, value);
                this._header.option(name, this._workSpace._getViewStartByOptions());
                this._appointments.option("items", []);
                this._filterAppointmentsByDate();
                this._reloadDataSource();
                break;
            case "dataSource":
                this._initDataSource();
                this._customizeStoreLoadOptions();
                this._appointmentModel.setDataSource(this._dataSource);
                this._loadResources().done((function() {
                    this._filterAppointmentsByDate();
                    this._updateOption("workSpace", "showAllDayPanel", this.option("showAllDayPanel"));
                    this._reloadDataSource();
                }).bind(this));
                break;
            case "min":
            case "max":
                value = this._dateOption(name);
                this._updateOption("header", name, new Date(value));
                this._updateOption("workSpace", name, new Date(value));
                break;
            case "views":
                this._processCurrentView();
                if(!!this._getCurrentViewOptions()) {
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

                var viewCountConfig = this._getViewCountConfig();
                this._appointments.option({
                    items: [],
                    allowDrag: this._allowDragging(),
                    allowResize: this._allowResizing(),
                    appointmentDurationInMinutes: this._getCurrentViewOption("cellDuration")
                });
                this._header.option("intervalCount", viewCountConfig.intervalCount);
                this._header.option("startDate", viewCountConfig.startDate || new Date(this.option("currentDate")));
                this._header.option("min", this._dateOption("min"));
                this._header.option("max", this._dateOption("max"));
                this._header.option("currentDate", this._dateOption("currentDate"));
                this._header.option("firstDayOfWeek", this._getCurrentViewOption("firstDayOfWeek"));
                this._header.option("currentView", this._currentView);
                this._loadResources().done((function(resources) {
                    this.getLayoutManager().initRenderingStrategy(this._getAppointmentsRenderingStrategy());
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                    this._appointments.option("allowAllDayResize", value !== "day");
                    this._reloadDataSource();
                }).bind(this));
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
                this._loadResources().done((function(resources) {
                    this._workSpace.option(name, resources);
                    this._filterAppointmentsByDate();
                    this._reloadDataSource();
                }).bind(this));
                break;
            case "resources":
                this._resourcesManager.setResources(this.option("resources"));
                this._appointmentModel.setDataAccessors(this._combineDataAccessors());
                this._loadResources().done((function(resources) {
                    this._workSpace.option("groups", resources);
                    this._filterAppointmentsByDate();
                    this._reloadDataSource();
                }).bind(this));
                break;
            case "startDayHour":
            case "endDayHour":
                this._appointments.option("items", []);
                this._updateOption("workSpace", name, value);
                this._appointments.repaint();
                this._filterAppointmentsByDate();
                this._reloadDataSource();
                break;
            case "onAppointmentAdding":
            case "onAppointmentAdded":
            case "onAppointmentUpdating":
            case "onAppointmentUpdated":
            case "onAppointmentDeleting":
            case "onAppointmentDeleted":
            case "onAppointmentFormCreated":
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
            case "noDataText":
            case "allowMultipleCellSelection":
            case "accessKey":
            case "onCellClick":
                this._workSpace.option(name, value);
                break;
            case "crossScrollingEnabled":
                this._loadResources().done((function(resources) {
                    this._refreshWorkSpace(resources);
                    this._appointments.repaint();
                }).bind(this));
                break;
            case "cellDuration":
                this._updateOption("workSpace", "hoursInterval", value / 60);
                this._appointments.option("appointmentDurationInMinutes", value);
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._updateOption("header", name, value);
                this._updateOption("workSpace", name, value);
                this._appointments.option(name, value);
                this.callBase(args);
                break;
            case "width":
                //TODO: replace with css
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
                this._loadResources().done((function() {
                    this._filterAppointmentsByDate();
                    this._updateOption("workSpace", "allDayExpanded", value);
                    this._updateOption("workSpace", name, value);
                    this._reloadDataSource();
                }).bind(this));
                break;
            case "showCurrentTimeIndicator":
            case "indicatorTime":
            case "currentIndicatorInterval":
                this._updateOption("workSpace", name, value);
                break;
            case "appointmentTooltipTemplate":
            case "appointmentPopupTemplate":
            case "recurrenceEditMode":
            case "remoteFiltering":
            case "timeZone":
                this.repaint();
                break;
            case "dateSerializationFormat":
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
                this._initAppointmentTemplate();
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
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
        this._dropDownAppointments.repaintExisting(this.element());
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
            result = SchedulerTimezones
                    .getTimezoneOffsetById(timezone,
                Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes())
                        );
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
        if(this._dataSource) {

            this._dataSource.load().done((function() {
                loading.hide();

                this._fireContentReadyAction();
            }).bind(this)).fail(function() {
                loading.hide();
            });

            this._dataSource.isLoading() && loading.show({
                container: this.element(),
                position: {
                    of: this.element()
                }
            });
        }
    },

    _dimensionChanged: function() {
        var filteredItems = this.getFilteredItems();

        this._toggleSmallClass();

        if(!this._isAgenda() && filteredItems && this._isVisible()) {
            this._workSpace._cleanAllowedPositions();
            this._workSpace.option("allDayExpanded", this._isAllDayExpanded(filteredItems));

            var appointments = this._layoutManager.createAppointmentsMap(filteredItems);

            this._appointments.option("items", appointments);
        }

        this.hideAppointmentTooltip();
    },

    _clean: function() {
        this._cleanPopup();
        this.callBase();
    },

    _toggleSmallClass: function() {
        var width = this.element().outerWidth();
        this.element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
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

        this.element().addClass(WIDGET_CLASS);
        this._initEditing();

        this._resourcesManager = new SchedulerResourceManager(this.option("resources"));

        var combinedDataAccessors = this._combineDataAccessors();

        this._appointmentModel = new SchedulerAppointmentModel(this._dataSource, {
            startDateExpr: this.option("startDateExpr"),
            endDateExpr: this.option("endDateExpr"),
            allDayExpr: this.option("allDayExpr"),
            recurrenceRuleExpr: this.option("recurrenceRuleExpr"),
            recurrenceExceptionExpr: this.option("recurrenceExceptionExpr")
        }, combinedDataAccessors);

        this._initActions();
        this._processCurrentView();

        this._dropDownAppointments = new DropDownAppointments();
        this._subscribes = subscribes;
    },

    _initTemplates: function() {
        this.callBase();
        this._initAppointmentTemplate();

        this._defaultTemplates["appointmentTooltip"] = new EmptyTemplate(this);
        this._defaultTemplates["appointmentPopup"] = new EmptyTemplate(this);
    },

    _initAppointmentTemplate: function() {
        var that = this;

        this._defaultTemplates["item"] = new BindableTemplate(function($container, data, model) {
            var appointmentsInst = that.getAppointmentsInstance();
            appointmentsInst._renderAppointmentTemplate.call(appointmentsInst, $container, data, model);
        }, [
            "html",
            "text", "startDate", "endDate", "allDay", "description", "recurrenceRule", "recurrenceException", "startDateTimeZone", "endDateTimeZone"
        ], this.option("integrationOptions.watchMethod"), {
            "text": this._dataAccessors.getter["text"],
            "startDate": this._dataAccessors.getter["startDate"],
            "endDate": this._dataAccessors.getter["endDate"],
            "startDateTimeZone": this._dataAccessors.getter["startDateTimeZone"],
            "endDateTimeZone": this._dataAccessors.getter["endDateTimeZone"],
            "allDay": this._dataAccessors.getter["allDay"],
            "recurrenceRule": this._dataAccessors.getter["recurrenceRule"]
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
        this._workSpaceRecalculation.done((function() {
            var appointmentsToRepaint = result;
            this._filteredItems = this.fire("prerenderFilter");
            this._workSpace.option("allDayExpanded", this._isAllDayExpanded(this._filteredItems));

            if(this._isAgenda()) {
                this.getRenderingStrategyInstance().calculateRows(this._filteredItems, 7, this.option("currentDate"), true);
            }

            if(this._filteredItems.length && this._isVisible()) {
                var appointments = this._layoutManager.createAppointmentsMap(this._filteredItems);
                appointmentsToRepaint = this._layoutManager.markRepaintedAppointments(appointments, this.getAppointmentsInstance().option("items"));
                this._appointments.option("items", appointmentsToRepaint);

                delete this.instance._updatedAppointment;
            } else {
                this._appointments.option("items", []);
            }
            if(this._isAgenda()) {
                this._workSpace._renderView();
                    // TODO: remove rows calculation from this callback
                this._dataSourceLoadedCallback.fireWith(this, [result]);
            }
        }).bind(this));
    },

    _initExpressions: function(fields) {
        var dataCoreUtils = require("../../core/utils/data"),
            isDateField = function(field) {
                return field === "startDate" || field === "endDate";
            };

        if(!this._dataAccessors) {
            this._dataAccessors = {
                getter: {},
                setter: {}
            };
        }

        each(fields, (function(name, expr) {
            if(!!expr) {

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
                                that.option("dateSerializationFormat", dateSerialization.getDateSerializationFormat(value));
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
            } else {
                delete this._dataAccessors.getter[name];
                delete this._dataAccessors.setter[name];
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

        this.element().toggleClass(WIDGET_READONLY_CLASS, this._isReadOnly());
    },

    _isReadOnly: function() {
        var result = true,
            editing = this._editing;

        for(var prop in editing) {
            if(editing.hasOwnProperty(prop)) {
                result = result && !editing[prop];
            }
        }

        return result;
    },

    _customizeStoreLoadOptions: function() {
        this._dataSource && this._dataSource.on("customizeStoreLoadOptions", this._proxiedCustomizeStoreLoadOptionsHandler);
    },

    _dispose: function() {
        this.hideAppointmentPopup();
        this.hideAppointmentTooltip();

        clearTimeout(this._repaintTimer);

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
            "onAppointmentFormCreated": this._createActionByOption("onAppointmentFormCreated")
        };
    },

    _getAppointmentRenderedAction: function() {
        return this._createActionByOption("onAppointmentRendered", {
            excludeValidators: ["designMode", "disabled", "readOnly"]
        });
    },

    _renderFocusTarget: noop,

    _render: function() {
        this.callBase();
        this._renderHeader();

        this._layoutManager = new SchedulerLayoutManager(this, this._getAppointmentsRenderingStrategy());

        this._appointments = this._createComponent("<div>", SchedulerAppointments, this._appointmentsConfig());
        this._appointments.option("itemTemplate", this._getAppointmentTemplate("appointmentTemplate"));

        this._toggleSmallClass();

        this._loadResources().done((function(resources) {
            this._renderWorkSpace(resources);

            var $fixedContainer = this._workSpace.getFixedContainer(),
                $allDayContainer = this._workSpace.getAllDayContainer();

            this._appointments.option({
                fixedContainer: $fixedContainer,
                allDayContainer: $allDayContainer
            });

            this._filterAppointmentsByDate();
            this._reloadDataSource();
        }).bind(this));
    },

    _renderHeader: function() {
        var $header = $("<div>").appendTo(this.element());
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
            useDropDownViewSwitcher: this.option("useDropDownViewSwitcher")
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
            onAppointmentDblClick: this._createActionByOption("onAppointmentDblClick"),
            tabIndex: this.option("tabIndex"),
            focusStateEnabled: this.option("focusStateEnabled"),
            appointmentDurationInMinutes: this._getCurrentViewOption("cellDuration"),
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

    _getDayDuration: function() {
        return this._getCurrentViewOption("endDayHour") - this._getCurrentViewOption("startDayHour");
    },

    _renderWorkSpace: function(groups) {
        var $workSpace = $("<div>").appendTo(this.element());

        var countConfig = this._getViewCountConfig();
        this._workSpace = this._createComponent($workSpace, VIEWS_CONFIG[this._getCurrentViewType()].workSpace, this._workSpaceConfig(groups, countConfig));
        this._workSpace.getWorkArea().append(this._appointments.element());

        this._recalculateWorkspace();

        countConfig.startDate && this._header && this._header.option("currentDate", this._workSpace.getStartViewDate());
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

        domUtils.triggerResizeEvent(this._workSpace.element());
        this._workSpaceRecalculation.resolve();
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
            currentIndicatorInterval: this.option("currentIndicatorInterval"),
            allDayExpanded: this._appointments.option("items"),
            crossScrollingEnabled: this.option("crossScrollingEnabled"),
            dataCellTemplate: this.option("dataCellTemplate"),
            timeCellTemplate: this.option("timeCellTemplate"),
            resourceCellTemplate: this.option("resourceCellTemplate"),
            dateCellTemplate: this.option("dateCellTemplate"),
            allowMultipleCellSelection: this.option("allowMultipleCellSelection")
        }, currentViewOptions);

        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.startDate = countConfig.startDate;
        result.groups = groups;
        result.onCellClick = this._createActionByOption("onCellClick");
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
        var result,
            currentView = this.option("currentView");

        each(this.option("views"), function(_, view) {
            if(typeUtils.isObject(view) && view.type === currentView) {
                result = view;
                return false;
            }
        });

        return result;
    },

    _getCurrentViewOption: function(optionName) {
        var currentViewOptions = this._getCurrentViewOptions();

        if(currentViewOptions && currentViewOptions[optionName]) {
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
        this._appointments.element().detach();
        this._workSpace._dispose();
        this._workSpace.element().remove();

        delete this._workSpace;

        this._renderWorkSpace(groups);

        this._appointments.option({
            fixedContainer: this._workSpace.getFixedContainer(),
            allDayContainer: this._workSpace.getAllDayContainer()
        });
    },

    getWorkSpaceScrollable: function() {
        return this._workSpace.getScrollable();
    },

    getWorkSpaceScrollableScrollTop: function() {
        return this._workSpace.getScrollableScrollTop();
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

    getWorkSpaceHeaderPanelHeight: function() {
        return this._workSpace.getHeaderPanelHeight();
    },

    getWorkSpaceDateTableOffset: function() {
        return !this.option("crossScrollingEnabled") || this.option("rtlEnabled") ? this._workSpace.getTimePanelWidth() : 0;
    },

    getWorkSpace: function() {
        return this._workSpace;
    },

    getHeader: function() {
        return this._header;
    },

    getMaxAppointmentsPerCell: function() {
        return this._currentView.maxAppointmentsPerCell;
    },

    _createPopup: function(appointmentData, processTimeZone) {
        this._$popup = $("<div>")
                .addClass(APPOINTMENT_POPUP_CLASS)
                .appendTo(this.element());

        this._initDynamicPopupTemplate(appointmentData, processTimeZone);

        this._popup = this._createComponent(this._$popup, Popup, this._popupConfig(appointmentData));
    },

    _popupContent: function(appointmentData, processTimeZone) {
        var $popupContent = this._popup.content();
        this._createAppointmentForm(appointmentData, $popupContent, processTimeZone);

        return $popupContent;
    },

    _createAppointmentForm: function(appointmentData, $content, processTimeZone) {
        var allDay = this.fire("getField", "allDay", appointmentData),
            resources = this.option("resources"),
            startDate = this.fire("getField", "startDate", appointmentData),
            endDate = this.fire("getField", "endDate", appointmentData);

        each(this._resourcesManager.getResourcesFromItem(appointmentData, true) || {}, function(resourceName, resourceValue) {
            appointmentData[resourceName] = resourceValue;
        });

        var formData = extend(true, {}, appointmentData);

        if(processTimeZone) {
            startDate = this.fire("convertDateByTimezone", startDate);
            endDate = this.fire("convertDateByTimezone", endDate);

            this.fire("setField", "startDate", formData, startDate);
            this.fire("setField", "endDate", formData, endDate);
        }

        if(this._appointmentForm) {
            var startDateExpr = this.option("startDateExpr"),
                endDateExpr = this.option("endDateExpr");

            this._appointmentForm.option("formData", formData);
            this._appointmentForm.option("readOnly", this._editAppointmentData ? !this._editing.allowUpdating : false);

            var startDateFormItem = this._appointmentForm.itemOption(startDateExpr),
                endDateFormItem = this._appointmentForm.itemOption(endDateExpr);

            if(startDateFormItem && endDateFormItem) {
                var startDateEditorOptions = startDateFormItem.editorOptions,
                    endDateEditorOptions = endDateFormItem.editorOptions;

                if(allDay) {
                    startDateEditorOptions.type = endDateEditorOptions.type = "date";
                } else {
                    startDateEditorOptions.type = endDateEditorOptions.type = "datetime";
                }

                this._appointmentForm.itemOption(startDateExpr, "editorOptions", startDateEditorOptions);
                this._appointmentForm.itemOption(endDateExpr, "editorOptions", endDateEditorOptions);
            }
        } else {
            AppointmentForm.prepareAppointmentFormEditors(allDay, {
                textExpr: this.option("textExpr"),
                allDayExpr: this.option("allDayExpr"),
                startDateExpr: this.option("startDateExpr"),
                endDateExpr: this.option("endDateExpr"),
                descriptionExpr: this.option("descriptionExpr"),
                recurrenceRuleExpr: this.option("recurrenceRuleExpr"),
                startDateTimeZoneExpr: this.option("startDateTimeZoneExpr"),
                endDateTimeZoneExpr: this.option("endDateTimeZoneExpr")
            }, this);

            if(resources && resources.length) {
                this._resourcesManager.setResources(this.option("resources"));
                AppointmentForm.concatResources(this._resourcesManager.getEditors());
            }

            this._appointmentForm = AppointmentForm.create(
                this._createComponent.bind(this),
                $content,
                this._editAppointmentData ? !this._editing.allowUpdating : false,
                formData
             );

        }

        var recurrenceRuleExpr = this.option("recurrenceRuleExpr"),
            recurrentEditorItem = recurrenceRuleExpr ? this._appointmentForm.itemOption(recurrenceRuleExpr) : null;

        if(recurrentEditorItem) {
            var options = recurrentEditorItem.editorOptions || {};
            options.startDate = startDate;
            this._appointmentForm.itemOption(recurrenceRuleExpr, "editorOptions", options);
        }

        this._actions["onAppointmentFormCreated"]({
            form: this._appointmentForm,
            appointmentData: appointmentData
        });
    },

    _initDynamicPopupTemplate: function(appointmentData, processTimeZone) {
        var that = this;

        this._defaultTemplates["appointmentPopup"] = new FunctionTemplate(function(options) {
            var $popupContent = that._popupContent(appointmentData, processTimeZone);
            options.container.append($popupContent);

            return options.container;
        });
    },

    _popupConfig: function(appointmentData) {
        var template = this._getTemplateByOption("appointmentPopupTemplate");

        return {
            maxWidth: APPOINTEMENT_POPUP_WIDTH,
            onHiding: (function() {
                this.focus();
            }).bind(this),
            contentTemplate: new FunctionTemplate(function(options) {
                return template.render({
                    model: appointmentData,
                    container: options.container
                });
            }),
            defaultOptionsRules: [
                {
                    device: function() {
                        return !devices.current().generic;
                    },
                    options: {
                        fullScreen: true
                    }
                }
            ]
        };
    },

    _getPopupToolbarItems: function() {
        return [
                { shortcut: "done", location: "after", onClick: this._doneButtonClickHandler.bind(this) },
                { shortcut: "cancel", location: "after" }
        ];
    },

    _cleanPopup: function() {
        if(this._$popup) {
            this._popup.element().remove();
            delete this._$popup;
            delete this._popup;
            delete this._appointmentForm;
        }
    },

    _doneButtonClickHandler: function(args) {
        args.cancel = true;

        this._saveChanges(true);

        var startDate = this.fire("getField", "startDate", this._appointmentForm.option("formData"));
        this._workSpace.updateScrollPosition(startDate);
    },

    _saveChanges: function(disableButton) {
        var validation = this._appointmentForm.validate();

        if(validation && !validation.isValid) {
            return false;
        }

        disableButton && this._disableDoneButton();

        var formData = this._appointmentForm.option("formData"),
            oldData = this._editAppointmentData,
            recData = this._updatedRecAppointment;

        function convert(obj, dateFieldName) {
            var date = new Date(this.fire("getField", dateFieldName, obj));
            var tzDiff = this._getTimezoneOffsetByOption() * 3600000 + this.fire("getClientTimezoneOffset", date);

            return new Date(date.getTime() + tzDiff);
        }

        if(oldData) {
            var processedStartDate = this.fire(
                "convertDateByTimezoneBack",
                this.fire("getField", "startDate", formData)
                );

            var processedEndDate = this.fire(
                "convertDateByTimezoneBack",
                this.fire("getField", "endDate", formData)
                );

            this.fire("setField", "startDate", formData, processedStartDate);
            this.fire("setField", "endDate", formData, processedEndDate);
        }

        if(oldData && !recData) {
            this.updateAppointment(oldData, formData);
        } else {

            recData && this.updateAppointment(oldData, recData);
            delete this._updatedRecAppointment;

            if(typeof this._getTimezoneOffsetByOption() === "number") {
                this.fire("setField", "startDate", formData, convert.call(this, formData, "startDate"));
                this.fire("setField", "endDate", formData, convert.call(this, formData, "endDate"));
            }
            this.addAppointment(formData);
        }

        return true;
    },

    _disableDoneButton: function() {
        var toolbarItems = this._popup.option("toolbarItems");
        toolbarItems[0].options = { disabled: true };
        this._popup.option("toolbarItems", toolbarItems);
    },

    _checkRecurringAppointment: function(targetAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing) {
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
                this._singleAppointmentChangesHandler(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing);
                break;
            default:
                this._showRecurrenceChangeConfirm(isDeleted)
                    .done((function(result) {
                        result && callback();
                        !result && this._singleAppointmentChangesHandler(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing);
                    }).bind(this))
                    .fail((function() {
                        this._appointments.moveAppointmentBack();
                    }).bind(this));
        }
    },

    _singleAppointmentChangesHandler: function(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing) {
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
                var startDateClientTzOffset = -(this._subscribes["getClientTimezoneOffset"](startDate) / 3600000);
                var endDateClientTzOffset = -(this._subscribes["getClientTimezoneOffset"](endDate) / 3600000);
                var processedStartDateInUTC = processedStartDate.getTime() - startDateClientTzOffset * 3600000,
                    processedEndDateInUTC = processedEndDate.getTime() - endDateClientTzOffset * 3600000;

                processedStartDate = new Date(processedStartDateInUTC + commonTimezoneOffset * 3600000);
                processedEndDate = new Date(processedEndDateInUTC + commonTimezoneOffset * 3600000);
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

        var recurrenceException = this._getRecurrenceException(exceptionDate, targetAppointment),
            updatedAppointment = extend({}, targetAppointment, { recurrenceException: recurrenceException });

        if(isPopupEditing) {
            this._updatedRecAppointment = updatedAppointment;

            processAppointmentDates.call(this, singleAppointment);

            this._showAppointmentPopup(singleAppointment, true, true);
            this._editAppointmentData = targetAppointment;

        } else {
            this._updateAppointment(targetAppointment, updatedAppointment);
        }
    },

    _getRecurrenceException: function(exceptionDate, targetAppointment) {
        var startDate = this._getStartDate(targetAppointment, true),
            exceptionByDate = this._getRecurrenceExceptionDate(exceptionDate, startDate),
            recurrenceException = this.fire("getField", "recurrenceException", targetAppointment);

        return recurrenceException ? recurrenceException + "," + exceptionByDate : exceptionByDate;
    },

    _getRecurrenceExceptionDate: function(exceptionDate, targetStartDate) {
        exceptionDate.setHours(targetStartDate.getHours());
        exceptionDate.setMinutes(targetStartDate.getMinutes());
        exceptionDate.setSeconds(targetStartDate.getSeconds());

        return dateSerialization.serializeDate(exceptionDate, "yyyyMMddTHHmmss");
    },

    _showRecurrenceChangeConfirm: function(isDeleted) {
        var message = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteMessage" : "dxScheduler-confirmRecurrenceEditMessage"),
            seriesText = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteSeries" : "dxScheduler-confirmRecurrenceEditSeries"),
            occurrenceText = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteOccurrence" : "dxScheduler-confirmRecurrenceEditOccurrence");

        return dialog.custom({
            message: message,
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

        if(this._workSpace.keepOriginalHours()) {
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

        var groups = cellData.groups;

        var resourcesSetter = this._resourcesManager._dataAccessors.setter;

        for(var name in groups) {
            if(groups.hasOwnProperty(name)) {
                resourcesSetter[name](target, groups[name]);
            }
        }

        return updatedData;
    },

    _getCoordinates: function(dates, appointmentResources, allDay) {
        var result = [];

        for(var i = 0; i < dates.length; i++) {
            var currentCoords = this._workSpace.getCoordinatesByDateInGroup(dates[i], appointmentResources, allDay);

            for(var j = 0; j < currentCoords.length; j++) {
                extend(currentCoords[j], { startDate: dates[i] });
            }
            result = result.concat(currentCoords);
        }
        return result;
    },

    _getSingleAppointmentData: function(appointmentData, options) {
        options = options || {};

        var $appointment = options.$appointment,
            updatedData = options.skipDateCalculation ? {} : this._getUpdatedData(options),
            resultAppointmentData = extend({}, appointmentData, updatedData),
            allDay = this.fire("getField", "allDay", appointmentData),
            isAllDay = this._workSpace.supportAllDayRow() && allDay,
            startDate = new Date(this.fire("getField", "startDate", resultAppointmentData)),
            endDate = new Date(this.fire("getField", "endDate", resultAppointmentData)),
            appointmentDuration = endDate.getTime() - startDate.getTime(),
            updatedStartDate;

        if(typeUtils.isDefined($appointment)) {
            var apptDataCalculator = this.getRenderingStrategyInstance().getAppointmentDataCalculator();

            if(typeUtils.isFunction(apptDataCalculator)) {
                updatedStartDate = apptDataCalculator($appointment, startDate).startDate;
            } else if(this._needUpdateAppointmentData($appointment)) {
                var coordinates = translator.locate($appointment);
                updatedStartDate = new Date(this._workSpace.getCellDataByCoordinates(coordinates, isAllDay).startDate);

                if($appointment.hasClass("dx-scheduler-appointment-reduced")) {
                    var appointmentStartDate = $appointment.data("dxAppointmentStartDate");
                    if(appointmentStartDate) {
                        updatedStartDate = appointmentStartDate;
                    }
                }

                if(!options.skipHoursProcessing) {
                    updatedStartDate.setHours(startDate.getHours());
                    updatedStartDate.setMinutes(startDate.getMinutes());
                }
            }
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

    _updateAppointment: function(target, appointment, onUpdatePrevented) {
        var updatingOptions = {
            newData: appointment,
            oldData: target,
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
                    this._updatedAppointment = appointment;
                    this._appointmentModel
                        .update(target, appointment)
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
        when(deferredUtils.fromPromise(actionOptions.cancel)).done(callback.bind(this));
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
            if(this._popup && this._popup.option("visible")) {
                this._popup.hide();
            }
        }
        action(options);

        this._fireContentReadyAction();
    },

    _showAppointmentPopup: function(data, showButtons, processTimeZone) {
        if(!this._popup) {
            this._createPopup(data, processTimeZone);
        }
        var toolbarItems = [],
            showCloseButton = true;

        if(!typeUtils.isDefined(showButtons) || showButtons) {
            toolbarItems = this._getPopupToolbarItems();
            showCloseButton = this._popup.initialOption("showCloseButton");
        }

        this._popup.option({
            toolbarItems: toolbarItems,
            showCloseButton: showCloseButton
        });
        this._initDynamicPopupTemplate(data, processTimeZone);
        this._popup.option(this._popupConfig(data));
        this._popup.show();
    },

    getAppointmentPopup: function() {
        return this._popup;
    },

    getAppointmentDetailsForm: function() {
        return this._appointmentForm;
    },

    getUpdatedAppointment: function() {
        return this._updatedAppointment;
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

    _getEndDate: function(appointment) {
        var endDate = this.fire("getField", "endDate", appointment);

        if(endDate) {

            var endDateTimeZone = this.fire("getField", "endDateTimeZone", appointment);

            endDate = dateUtils.makeDate(endDate);

            endDate = this.fire("convertDateByTimezone", endDate, endDateTimeZone);

            this.fire("updateAppointmentEndDate", {
                endDate: endDate,
                callback: function(result) {
                    endDate = result;
                }
            });
        }
        return endDate;
    },

    recurrenceEditorVisibilityChanged: function(visible) {
        if(this._appointmentForm) {
            this._appointmentForm.element()
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
                    var apptPosition = appointmentElement.position();
                    return workSpace.getCellDataByCoordinates(apptPosition).groups;
                };

                setResourceCallback = function(field, value) {
                    resourcesSetter[field](targetedAppointment, value);
                };
            }

            each(getGroups.call(this), setResourceCallback);
        }
    },

        /**
        * @name dxSchedulerMethods_getStartViewDate
        * @publicName getStartViewDate()
        * @return Date
        */
    getStartViewDate: function() {
        return this._workSpace.getStartViewDate();
    },

        /**
        * @name dxSchedulerMethods_getEndViewDate
        * @publicName getEndViewDate()
        * @return Date
        */
    getEndViewDate: function() {
        return this._workSpace.getEndViewDate();
    },

        /**
        * @name dxSchedulerMethods_showAppointmentPopup
        * @publicName showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)
        * @param1 appointmentData:Object
        * @param2 createNewAppointment:Boolean
        * @param3 currentAppointmentData:Object
        */
    showAppointmentPopup: function(appointmentData, createNewAppointment, currentAppointmentData) {
        var singleAppointment = !currentAppointmentData && appointmentData.length ?
                this._getSingleAppointmentData(appointmentData) :
                currentAppointmentData;

        var startDate;

        if(currentAppointmentData) {
            startDate = this.fire("getField", "startDate", currentAppointmentData);
        } else {
            startDate = this.fire("getField", "startDate", appointmentData);
        }

        this._checkRecurringAppointment(appointmentData, singleAppointment, startDate, (function() {
            var editing = this._editing;

            if(createNewAppointment) {
                delete this._editAppointmentData;
                editing.allowAdding && this._showAppointmentPopup(appointmentData, true, false);
            } else {
                this._editAppointmentData = appointmentData;
                this._showAppointmentPopup(appointmentData, editing.allowUpdating, true);
            }
        }).bind(this), false, true);
    },

        /**
        * @name dxSchedulerMethods_hideAppointmentPopup
        * @publicName hideAppointmentPopup(saveChanges)
        * @param1 saveChanges:Boolean
        */
    hideAppointmentPopup: function(saveChanges) {
        if(!this._popup || !this._popup.option("visible")) {
            return;
        }

        if(saveChanges) {
            this._saveChanges();
        }

        this._popup.hide();
    },

        /**
        * @name dxSchedulerMethods_showAppointmentTooltip
        * @publicName showAppointmentTooltip(appointmentData, target, currentAppointmentData)
        * @param1 appointmentData:Object
        * @param2 target:string|Node|jQuery
        * @param3 currentAppointmentData:Object
        */
    showAppointmentTooltip: function(appointmentData, target, currentAppointmentData) {
        if(!appointmentData) {
            return;
        }
        currentAppointmentData = currentAppointmentData || appointmentData;
        appointmentTooltip.show(appointmentData, currentAppointmentData, target, this);
    },

        /**
        * @name dxSchedulerMethods_hideAppointmentTooltip
        * @publicName hideAppointmentTooltip()
        */
    hideAppointmentTooltip: function() {
        appointmentTooltip.hide();
    },

        /**
        * @name dxSchedulerMethods_scrollToTime
        * @publicName scrollToTime(hours, minutes, date)
        * @param1 hours:Number
        * @param2 minutes:Number
        * @param3 date:Date
        */
    scrollToTime: function(hours, minutes, date) {
        this._workSpace.scrollToTime(hours, minutes, date);
    },

        /**
        * @name dxSchedulerMethods_addAppointment
        * @publicName addAppointment(appointment)
        * @param1 appointment:Object
        */
    addAppointment: function(appointment) {
        var text = this.fire("getField", "text", appointment);

        if(!text) {
            this.fire("setField", "text", appointment, "");
        }

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
        * @name dxSchedulerMethods_updateAppointment
        * @publicName updateAppointment(target, appointment)
        * @param1 target:Object
        * @param2 appointment:Object
        */
    updateAppointment: function(target, appointment) {
        this._updateAppointment(target, appointment);
    },

        /**
        * @name dxSchedulerMethods_deleteAppointment
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
    }

        /**
        * @name dxSchedulerMethods_registerKeyHandler
        * @publicName registerKeyHandler(key, handler)
        * hidden
        * @extend_doc
        */

}).include(DataHelperMixin);

registerComponent("dxScheduler", Scheduler);

module.exports = Scheduler;
