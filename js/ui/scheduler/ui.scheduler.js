import registerComponent from '../../core/component_registrator';
import config from '../../core/config';
import devices from '../../core/devices';
import $ from '../../core/renderer';
import { BindableTemplate } from '../../core/templates/bindable_template';
import { EmptyTemplate } from '../../core/templates/empty_template';
import { inArray } from '../../core/utils/array';
import browser from '../../core/utils/browser';
import Callbacks from '../../core/utils/callbacks';
import { noop } from '../../core/utils/common';
import { compileGetter, compileSetter } from '../../core/utils/data';
import { getBoundingRect } from '../../core/utils/position';
import dateUtils from '../../core/utils/date';
import dateSerialization from '../../core/utils/date_serialization';
import { Deferred, when, fromPromise } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { touch } from '../../core/utils/support';
import {
    isDefined,
    isString,
    isObject,
    isFunction,
    isEmptyObject,
    isDeferred,
    isPromise
} from '../../core/utils/type';
import { hasWindow } from '../../core/utils/window';
import DataHelperMixin from '../../data_helper';
import { triggerResizeEvent } from '../../events/visibility_change';
import dateLocalization from '../../localization/date';
import messageLocalization from '../../localization/message';
import { custom as customDialog } from '../dialog';
import { isMaterial } from '../themes';
import errors from '../widget/ui.errors';
import Widget from '../widget/ui.widget';
import AppointmentPopup from './appointmentPopup';
import { CompactAppointmentsHelper } from './compactAppointmentsHelper';
import { DesktopTooltipStrategy } from './tooltip_strategies/desktopTooltipStrategy';
import { MobileTooltipStrategy } from './tooltip_strategies/mobileTooltipStrategy';
import { hide as hideLoading, show as showLoading } from './ui.loading';
import SchedulerAppointments from './ui.scheduler.appointments';
import SchedulerLayoutManager from './ui.scheduler.appointments.layout_manager';
import SchedulerAppointmentModel from './ui.scheduler.appointment_model';
import SchedulerHeader from './ui.scheduler.header';
import SchedulerResourceManager from './ui.scheduler.resource_manager';
import subscribes from './ui.scheduler.subscribes';
import { getRecurrenceProcessor } from './recurrence';
import timeZoneUtils from './utils.timeZone';
import SchedulerAgenda from './workspaces/ui.scheduler.agenda';
import SchedulerTimelineDay from './workspaces/ui.scheduler.timeline_day';
import SchedulerTimelineMonth from './workspaces/ui.scheduler.timeline_month';
import SchedulerTimelineWeek from './workspaces/ui.scheduler.timeline_week';
import SchedulerTimelineWorkWeek from './workspaces/ui.scheduler.timeline_work_week';
import SchedulerWorkSpaceDay from './workspaces/ui.scheduler.work_space_day';
import SchedulerWorkSpaceMonth from './workspaces/ui.scheduler.work_space_month';
import SchedulerWorkSpaceWeek from './workspaces/ui.scheduler.work_space_week';
import SchedulerWorkSpaceWorkWeek from './workspaces/ui.scheduler.work_space_work_week';
import AppointmentAdapter from './appointmentAdapter';
import { TimeZoneCalculator } from './timeZoneCalculator';
import { AppointmentTooltipInfo } from './dataStructures';
import { AppointmentSettingsGenerator } from './appointmentSettingsGenerator';
import utils from './utils';
import DateAdapter from './dateAdapter';

// STYLE scheduler
const MINUTES_IN_HOUR = 60;

const WIDGET_CLASS = 'dx-scheduler';
const WIDGET_SMALL_CLASS = `${WIDGET_CLASS}-small`;
const WIDGET_ADAPTIVE_CLASS = `${WIDGET_CLASS}-adaptive`;
const WIDGET_WIN_NO_TOUCH_CLASS = `${WIDGET_CLASS}-win-no-touch`;
const WIDGET_READONLY_CLASS = `${WIDGET_CLASS}-readonly`;
const WIDGET_SMALL_WIDTH = 400;

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const UTC_FULL_DATE_FORMAT = FULL_DATE_FORMAT + 'Z';

const VIEWS_CONFIG = {
    day: {
        workSpace: SchedulerWorkSpaceDay,
        renderingStrategy: 'vertical'
    },
    week: {
        workSpace: SchedulerWorkSpaceWeek,
        renderingStrategy: 'vertical'
    },
    workWeek: {
        workSpace: SchedulerWorkSpaceWorkWeek,
        renderingStrategy: 'vertical'
    },
    month: {
        workSpace: SchedulerWorkSpaceMonth,
        renderingStrategy: 'horizontalMonth'
    },
    timelineDay: {
        workSpace: SchedulerTimelineDay,
        renderingStrategy: 'horizontal'
    },
    timelineWeek: {
        workSpace: SchedulerTimelineWeek,
        renderingStrategy: 'horizontal'
    },
    timelineWorkWeek: {
        workSpace: SchedulerTimelineWorkWeek,
        renderingStrategy: 'horizontal'
    },
    timelineMonth: {
        workSpace: SchedulerTimelineMonth,
        renderingStrategy: 'horizontalMonthLine'
    },
    agenda: {
        workSpace: SchedulerAgenda,
        renderingStrategy: 'agenda'
    }
};

class Scheduler extends Widget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
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
                * @type_function_return string|Element|jQuery
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
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo DateCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo DataCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo TimeCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo ResourceCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:dxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo AppointmentCollectorTemplate
                * @type template|function
                * @default "appointmentCollector"
                * @type_function_param1 data:object
                * @type_function_param1_field1 appointmentCount:number
                * @type_function_param1_field2 isCompact:boolean
                * @type_function_param2 collectorElement:dxElement
                * @type_function_return string|Element|jQuery
                */

            views: ['day', 'week'],

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
                * @type_function_return string|Element|jQuery
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
                * @name dxSchedulerOptions.views.scrolling
                * @type dxSchedulerScrolling
                */

            currentView: 'day', // TODO: should we calculate currentView if views array contains only one item, for example 'month'?
            currentDate: dateUtils.trimTime(new Date()),
            min: undefined,
            max: undefined,
            dateSerializationFormat: undefined,
            firstDayOfWeek: undefined,

            groups: [],

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

            dataSource: null,

            customizeDateNavigatorText: undefined,

            appointmentTemplate: 'item',

            dropDownAppointmentTemplate: 'dropDownAppointment',

            appointmentCollectorTemplate: 'appointmentCollector',

            dataCellTemplate: null,

            timeCellTemplate: null,

            resourceCellTemplate: null,

            dateCellTemplate: null,

            startDayHour: 0,

            endDayHour: 24,

            editing: {
                allowAdding: true,
                allowDeleting: true,
                allowDragging: true,
                allowResizing: true,
                allowUpdating: true,
                allowTimeZoneEditing: false,
                allowEditingTimeZones: false
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
                 * @default false @for Android|iOS
                */
            /**
                 * @name dxSchedulerOptions.editing.allowDragging
                 * @type boolean
                 * @default true
                 * @default false @for Android|iOS
                */
            /**
                * @name dxSchedulerOptions.editing.allowTimeZoneEditing
                * @type boolean
                * @default false
                */
            /**
                * @name dxSchedulerOptions.editing.allowEditingTimeZones
                * @type boolean
                * @default false
                * @deprecated dxSchedulerOptions.editing.allowTimeZoneEditing
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

            showCurrentTimeIndicator: true,

            shadeUntilCurrentTime: false,

            indicatorUpdateInterval: 300000,

            /**
                * @hidden
                * @name dxSchedulerOptions.indicatorTime
                * @type Date
                * @default undefined
                */
            indicatorTime: undefined,

            recurrenceEditMode: 'dialog',

            cellDuration: 30,

            maxAppointmentsPerCell: 'auto',

            selectedCellData: [],

            groupByDate: false,

            onAppointmentRendered: null,

            onAppointmentClick: null,

            onAppointmentDblClick: null,

            onAppointmentContextMenu: null,

            onCellClick: null,

            onCellContextMenu: null,

            onAppointmentAdding: null,

            onAppointmentAdded: null,

            onAppointmentUpdating: null,

            onAppointmentUpdated: null,

            onAppointmentDeleting: null,

            onAppointmentDeleted: null,

            onAppointmentFormOpening: null,

            appointmentTooltipTemplate: 'appointmentTooltip',

            /**
                * @hidden
                * @name dxSchedulerOptions.appointmentPopupTemplate
                * @type template|function
                * @default "appointmentPopup"
                * @type_function_param1 appointmentData:object
                * @type_function_param2 contentElement:dxElement
                * @type_function_return string|Element|jQuery
                */
            appointmentPopupTemplate: 'appointmentPopup',

            crossScrollingEnabled: false,

            useDropDownViewSwitcher: false,

            startDateExpr: 'startDate',

            endDateExpr: 'endDate',

            textExpr: 'text',

            descriptionExpr: 'description',

            allDayExpr: 'allDay',

            recurrenceRuleExpr: 'recurrenceRule',

            recurrenceExceptionExpr: 'recurrenceException',

            remoteFiltering: false,

            timeZone: '',

            startDateTimeZoneExpr: 'startDateTimeZone',

            endDateTimeZoneExpr: 'endDateTimeZone',

            noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),

            adaptivityEnabled: false,

            allowMultipleCellSelection: true,

            scrolling: {
                mode: 'standard',
            },

            renovateRender: false,

            _appointmentTooltipOffset: { x: 0, y: 0 },
            _appointmentTooltipButtonsPosition: 'bottom',
            _appointmentTooltipOpenButtonText: messageLocalization.format('dxScheduler-openAppointment'),
            _dropDownButtonIcon: 'overflow',
            _appointmentCountPerCell: 2,
            _collectorOffset: 0,
            _appointmentOffset: 26,

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
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return !devices.current().generic;
                },
                options: {
                    useDropDownViewSwitcher: true,


                    editing: {
                        allowDragging: false,
                        allowResizing: false
                    }
                }
            },
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    useDropDownViewSwitcher: true,
                    dateCellTemplate: function(data, index, element) {
                        const text = data.text;

                        text.split(' ').forEach(function(text, index) {
                            const span = $('<span>')
                                .text(text)
                                .addClass('dx-scheduler-header-panel-cell-date');

                            $(element).append(span);
                            if(!index) $(element).append(' ');
                        });
                    },

                    _appointmentTooltipOffset: { x: 0, y: 11 },
                    _appointmentTooltipButtonsPosition: 'top',
                    _appointmentTooltipOpenButtonText: null,
                    _dropDownButtonIcon: 'chevrondown',
                    _appointmentCountPerCell: 1,
                    _collectorOffset: 20,
                    _appointmentOffset: 30
                }
            }
        ]);
    }

    _setDeprecatedOptions() {
        super._setDeprecatedOptions();

        extend(this._deprecatedOptions, {
            dropDownAppointmentTemplate: { since: '19.2', message: 'appointmentTooltipTemplate' },
            allowEditingTimeZones: { since: '20.1', alias: 'allowTimeZoneEditing' }
        });
    }

    _getAppointmentSettingsGenerator() {
        return new AppointmentSettingsGenerator(this);
    }

    _postponeDataSourceLoading(promise) {
        this.postponedOperations.add('_reloadDataSource', this._reloadDataSource.bind(this), promise);
    }

    _postponeResourceLoading() {
        const whenLoaded = this.postponedOperations.add('_loadResources', () => {
            return this._loadResources();
        });
        const resolveCallbacks = new Deferred();

        whenLoaded.done((resources) => {
            resolveCallbacks.resolve(resources);
        });
        this._postponeDataSourceLoading(whenLoaded);

        return resolveCallbacks.promise();
    }

    _optionChanged(args) {
        let value = args.value;
        const name = args.name;

        switch(args.name) {
            case 'customizeDateNavigatorText':
                this._updateOption('header', name, value);
                break;
            case 'firstDayOfWeek':
                this._updateOption('workSpace', name, value);
                this._updateOption('header', name, value);
                break;
            case 'currentDate':
                value = this._dateOption(name);
                value = dateUtils.trimTime(new Date(value));
                this.option('selectedCellData', []);
                this._workSpace.option(name, new Date(value));
                this._header.option(name, new Date(value));
                this._header.option('displayedDate', this._workSpace._getViewStartByOptions());
                this._appointments.option('items', []);
                this._filterAppointmentsByDate();

                this._postponeDataSourceLoading();
                break;
            case 'dataSource':
                this._initDataSource();
                this._appointmentModel.setDataSource(this._dataSource);

                this._postponeResourceLoading().done((resources) => {
                    this._filterAppointmentsByDate();
                    this._updateOption('workSpace', 'showAllDayPanel', this.option('showAllDayPanel'));
                });
                break;
            case 'min':
            case 'max':
                value = this._dateOption(name);
                this._updateOption('header', name, new Date(value));
                this._updateOption('workSpace', name, new Date(value));
                break;
            case 'views':
                this._processCurrentView();
                if(this._getCurrentViewOptions()) {
                    this.repaint();
                } else {
                    this._header.option(name, value);
                }
                break;
            case 'useDropDownViewSwitcher':
                this._header.option(name, value);
                break;
            case 'currentView':
                this._processCurrentView();

                this.fire('validateDayHours');

                this.getLayoutManager().initRenderingStrategy(this._getAppointmentsRenderingStrategy());

                this._validateCellDuration();

                this._appointments.option({
                    items: [],
                    allowDrag: this._allowDragging(),
                    allowResize: this._allowResizing(),
                    itemTemplate: this._getAppointmentTemplate('appointmentTemplate')
                });

                this._postponeResourceLoading().done((resources) => {
                    this._refreshWorkSpace(resources);
                    this._updateHeader();
                    this._filterAppointmentsByDate();
                    this._appointments.option('allowAllDayResize', value !== 'day');
                });
                break;
            case 'appointmentTemplate':
                this._appointments.option('itemTemplate', value);
                break;
            case 'dateCellTemplate':
            case 'resourceCellTemplate':
            case 'dataCellTemplate':
            case 'timeCellTemplate':
                this._updateOption('workSpace', name, value);
                this.repaint();
                break;
            case 'groups':
                this._postponeResourceLoading().done((resources) => {
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                });
                break;
            case 'resources':
                this._resourcesManager.setResources(this.option('resources'));
                this._appointmentModel.setDataAccessors(this._combineDataAccessors());

                this._postponeResourceLoading().done((resources) => {
                    this._appointments.option('items', []);
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                });
                break;
            case 'startDayHour':
            case 'endDayHour':
                this.fire('validateDayHours');
                this._appointments.option('items', []);
                this._updateOption('workSpace', name, value);
                this._appointments.repaint();
                this._filterAppointmentsByDate();

                this._postponeDataSourceLoading();
                break;
            case 'onAppointmentAdding':
            case 'onAppointmentAdded':
            case 'onAppointmentUpdating':
            case 'onAppointmentUpdated':
            case 'onAppointmentDeleting':
            case 'onAppointmentDeleted':
            case 'onAppointmentFormOpening':
                this._actions[name] = this._createActionByOption(name);
                break;
            case 'onAppointmentRendered':
                this._appointments.option('onItemRendered', this._getAppointmentRenderedAction());
                break;
            case 'onAppointmentClick':
                this._appointments.option('onItemClick', this._createActionByOption(name));
                break;
            case 'onAppointmentDblClick':
                this._appointments.option(name, this._createActionByOption(name));
                break;
            case 'onAppointmentContextMenu':
                this._appointments.option('onItemContextMenu', this._createActionByOption(name));
                break;
            case 'noDataText':
            case 'allowMultipleCellSelection':
            case 'selectedCellData':
            case 'accessKey':
            case 'onCellClick':
                this._workSpace.option(name, value);
                break;
            case 'onCellContextMenu':
                this._workSpace.option(name, value);
                break;
            case 'crossScrollingEnabled':
                this._postponeResourceLoading().done((resources) => {
                    this._appointments.option('items', []);
                    this._refreshWorkSpace(resources);
                    if(this._readyToRenderAppointments) {
                        this._appointments.option('items', this._getAppointmentsToRepaint());
                    }
                });
                break;
            case 'cellDuration':
                this._validateCellDuration();
                this._appointments.option('items', []);
                if(this._readyToRenderAppointments) {
                    this._updateOption('workSpace', 'hoursInterval', value / 60);
                    this._appointments.option('items', this._getAppointmentsToRepaint());
                }
                break;
            case 'tabIndex':
            case 'focusStateEnabled':
                this._updateOption('header', name, value);
                this._updateOption('workSpace', name, value);
                this._appointments.option(name, value);
                super._optionChanged(args);
                break;
            case 'width':
                // TODO: replace with css
                this._updateOption('header', name, value);
                if(this.option('crossScrollingEnabled')) {
                    this._updateOption('workSpace', 'width', value);
                }
                super._optionChanged(args);
                this._dimensionChanged();
                break;
            case 'height':
                super._optionChanged(args);
                this._dimensionChanged();
                break;
            case 'editing': {
                this._initEditing();
                const editing = this._editing;

                this._bringEditingModeToAppointments(editing);

                this.hideAppointmentTooltip();
                this._cleanPopup();
                break;
            }
            case 'showAllDayPanel':
                this._postponeResourceLoading().done((resources) => {
                    this._filterAppointmentsByDate();
                    this._updateOption('workSpace', 'allDayExpanded', value);
                    this._updateOption('workSpace', name, value);
                });
                break;
            case 'showCurrentTimeIndicator':
            case 'indicatorTime':
            case 'indicatorUpdateInterval':
            case 'shadeUntilCurrentTime':
            case 'groupByDate':
                this._updateOption('workSpace', name, value);
                this.repaint();
                break;
            case 'appointmentDragging':
            case 'appointmentTooltipTemplate':
            case 'appointmentPopupTemplate':
            case 'recurrenceEditMode':
            case 'remoteFiltering':
            case 'timeZone':
            case 'dropDownAppointmentTemplate':
            case 'appointmentCollectorTemplate':
            case '_appointmentTooltipOffset':
            case '_appointmentTooltipButtonsPosition':
            case '_appointmentTooltipOpenButtonText':
            case '_dropDownButtonIcon':
            case '_appointmentCountPerCell':
            case '_collectorOffset':
            case '_appointmentOffset':
                this.repaint();
                break;
            case 'dateSerializationFormat':
                break;
            case 'maxAppointmentsPerCell':
                break;
            case 'startDateExpr':
            case 'endDateExpr':
            case 'startDateTimeZoneExpr':
            case 'endDateTimeZoneExpr':
            case 'textExpr':
            case 'descriptionExpr':
            case 'allDayExpr':
            case 'recurrenceRuleExpr':
            case 'recurrenceExceptionExpr':
                this._updateExpression(name, value);
                this._appointmentModel.setDataAccessors(this._combineDataAccessors());

                this._initAppointmentTemplate();
                this.repaint();
                break;
            case 'adaptivityEnabled':
                this._toggleAdaptiveClass();
                this.repaint();
                break;
            case 'scrolling':
                this._updateOption('workSpace', args.fullName, value);
                break;
            case 'renovateRender':
                this._updateOption('workSpace', name, value);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _updateHeader() {
        const viewCountConfig = this._getViewCountConfig();
        this._header.option('intervalCount', viewCountConfig.intervalCount);
        this._header.option('displayedDate', this._workSpace._getViewStartByOptions());
        this._header.option('min', this._dateOption('min'));
        this._header.option('max', this._dateOption('max'));
        this._header.option('currentDate', this._dateOption('currentDate'));
        this._header.option('firstDayOfWeek', this._getCurrentViewOption('firstDayOfWeek'));
        this._header.option('currentView', this._currentView);
    }

    _dateOption(optionName) {
        const optionValue = this._getCurrentViewOption(optionName);

        return dateSerialization.deserializeDate(optionValue);
    }

    _getSerializationFormat(optionName) {
        const value = this._getCurrentViewOption(optionName);

        if(typeof value === 'number') {
            return 'number';
        }

        if(!isString(value)) {
            return;
        }

        return dateSerialization.getDateSerializationFormat(value);
    }

    _bringEditingModeToAppointments(editing) {
        const editingConfig = {
            allowDelete: editing.allowUpdating && editing.allowDeleting
        };

        if(!this._isAgenda()) {
            editingConfig.allowDrag = editing.allowDragging;
            editingConfig.allowResize = editing.allowResizing;
            editingConfig.allowAllDayResize = editing.allowResizing && this._supportAllDayResizing();
        }

        this._appointments.option(editingConfig);
        this.repaint();
    }

    _isAgenda() {
        return this._getAppointmentsRenderingStrategy() === 'agenda';
    }

    _allowDragging() {
        return this._editing.allowDragging && !this._isAgenda();
    }

    _allowResizing() {
        return this._editing.allowResizing && !this._isAgenda();
    }

    _allowAllDayResizing() {
        return this._editing.allowResizing && this._supportAllDayResizing();
    }

    _supportAllDayResizing() {
        return this._getCurrentViewType() !== 'day' || this._currentView.intervalCount > 1;
    }

    _isAllDayExpanded(items) {
        return this.option('showAllDayPanel') && this._appointmentModel.hasAllDayAppointments(items, this._getCurrentViewOption('startDayHour'), this._getCurrentViewOption('endDayHour'));
    }

    _getTimezoneOffsetByOption(date) {
        return timeZoneUtils.calculateTimezoneByValue(this.option('timeZone'), date);
    }

    _filterAppointmentsByDate() {
        const dateRange = this._workSpace.getDateRange();
        this._appointmentModel.filterByDate(dateRange[0], dateRange[1], this.option('remoteFiltering'), this.option('dateSerializationFormat'));
    }

    _loadResources() {
        const groups = this._getCurrentViewOption('groups');
        const result = new Deferred();

        this._resourcesManager.loadResources(groups).done((function(resources) {
            this._loadedResources = resources;
            result.resolve(resources);
        }).bind(this));

        return result.promise();
    }

    _reloadDataSource() {
        const result = new Deferred();

        if(this._dataSource) {

            this._dataSource.load().done((function() {
                hideLoading();

                this._fireContentReadyAction(result);
            }).bind(this)).fail(function() {
                hideLoading();
                result.reject();
            });

            this._dataSource.isLoading() && showLoading({
                container: this.$element(),
                position: {
                    of: this.$element()
                }
            });
        } else {
            this._fireContentReadyAction(result);
        }

        return result.promise();
    }

    _fireContentReadyAction(result) {
        const contentReadyBase = super._fireContentReadyAction.bind(this);
        const fireContentReady = () => {
            contentReadyBase();
            result?.resolve();
        };

        if(this._workSpaceRecalculation) {
            this._workSpaceRecalculation?.done(() => {
                fireContentReady();
            });
        } else {
            fireContentReady();
        }
    }

    _dimensionChanged() {
        const filteredItems = this.getFilteredItems();

        this._toggleSmallClass();

        if(!this._isAgenda() && filteredItems && this._isVisible()) {
            this._workSpace._cleanAllowedPositions();
            this._workSpace.option('allDayExpanded', this._isAllDayExpanded(filteredItems));
            this._workSpace._dimensionChanged();

            const appointments = this._layoutManager.createAppointmentsMap(filteredItems);

            this._appointments.option('items', appointments);
        }

        this.hideAppointmentTooltip();

        this._appointmentPopup.triggerResize();
        this._appointmentPopup.updatePopupFullScreenMode();
    }

    _clean() {
        this._cleanPopup();
        super._clean();
    }

    _toggleSmallClass() {
        const width = getBoundingRect(this.$element().get(0)).width;
        this.$element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
    }

    _toggleAdaptiveClass() {
        this.$element().toggleClass(WIDGET_ADAPTIVE_CLASS, this.option('adaptivityEnabled'));
    }

    _visibilityChanged(visible) {
        visible && this._dimensionChanged();
    }

    _dataSourceOptions() {
        return { paginate: false };
    }

    _init() {
        this._initExpressions({
            startDate: this.option('startDateExpr'),
            endDate: this.option('endDateExpr'),
            startDateTimeZone: this.option('startDateTimeZoneExpr'),
            endDateTimeZone: this.option('endDateTimeZoneExpr'),
            allDay: this.option('allDayExpr'),
            text: this.option('textExpr'),
            description: this.option('descriptionExpr'),
            recurrenceRule: this.option('recurrenceRuleExpr'),
            recurrenceException: this.option('recurrenceExceptionExpr')
        });

        super._init();

        this._initDataSource();

        this._loadedResources = [];

        this.$element()
            .addClass(WIDGET_CLASS)
            .toggleClass(WIDGET_WIN_NO_TOUCH_CLASS, !!(browser.msie && touch));

        this._initEditing();

        this._resourcesManager = new SchedulerResourceManager(this.option('resources'));

        const combinedDataAccessors = this._combineDataAccessors();

        this._appointmentModel = new SchedulerAppointmentModel(this._dataSource, combinedDataAccessors, this.getAppointmentDurationInMinutes());

        this._initActions();

        this._compactAppointmentsHelper = new CompactAppointmentsHelper(this);

        this._asyncTemplatesTimers = [];

        this._dataSourceLoadedCallback = Callbacks();

        this._subscribes = subscribes;

        this.timeZoneCalculator = new TimeZoneCalculator({
            getClientOffset: date => this.fire('getClientTimezoneOffset', date),
            getCommonOffset: date => this._getTimezoneOffsetByOption(date),
            getAppointmentOffset: (date, appointmentTimezone) => timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date)
        });
    }

    _initTemplates() {
        this._initAppointmentTemplate();

        this._templateManager.addDefaultTemplates({
            appointmentTooltip: new EmptyTemplate(),
            dropDownAppointment: new EmptyTemplate(),
        });
        super._initTemplates();
    }

    _initAppointmentTemplate() {
        const { expr } = this._dataAccessors;
        const createGetter = (property) => compileGetter(`appointmentData.${property}`);

        this._templateManager.addDefaultTemplates({
            ['item']: new BindableTemplate(($container, data, model) => {
                this.getAppointmentsInstance()._renderAppointmentTemplate($container, data, model);
            }, [
                'html',
                'text',
                'startDate',
                'endDate',
                'allDay',
                'description',
                'recurrenceRule',
                'recurrenceException',
                'startDateTimeZone',
                'endDateTimeZone'
            ], this.option('integrationOptions.watchMethod'), {
                'text': createGetter(expr.textExpr),
                'startDate': createGetter(expr.startDateExpr),
                'endDate': createGetter(expr.endDateExpr),
                'startDateTimeZone': createGetter(expr.startDateTimeZoneExpr),
                'endDateTimeZone': createGetter(expr.endDateTimeZoneExpr),
                'allDay': createGetter(expr.allDayExpr),
                'recurrenceRule': createGetter(expr.recurrenceRuleExpr)
            })
        });
    }

    _combineDataAccessors() {
        const resourcesDataAccessors = this._resourcesManager._dataAccessors;
        const result = extend(true, {}, this._dataAccessors);

        each(resourcesDataAccessors, (function(type, accessor) {
            result[type].resources = accessor;
        }).bind(this));

        return result;
    }

    _renderContent() {
        this._renderContentImpl();
    }

    _dataSourceChangedHandler(result) {
        if(this._readyToRenderAppointments) {
            this._workSpaceRecalculation.done((function() {

                this._renderAppointments();

                if(this._isAgenda()) {
                    this._workSpace._renderView();
                    // TODO: remove rows calculation from this callback
                    this._dataSourceLoadedCallback.fireWith(this, [result]);
                }
            }).bind(this));
        }
    }

    isVirtualScrolling() {
        return this.getWorkSpace()?.isVirtualScrolling();
    }

    _filterAppointments() {
        const prerenderFilterName = this.isVirtualScrolling()
            ? 'prerenderFilterVirtual'
            : 'prerenderFilter';

        return this.fire(prerenderFilterName);
    }

    _renderAppointments() {
        this._filteredItems = this._filterAppointments();

        this._workSpace.option('allDayExpanded', this._isAllDayExpanded(this._filteredItems));

        if(this._isAgenda()) {
            this.getRenderingStrategyInstance().calculateRows(this._filteredItems, 7, this.option('currentDate'), true);
        }

        if(this._filteredItems.length && this._isVisible()) {
            this._appointments.option('items', this._getAppointmentsToRepaint());
            this._appointmentModel.cleanModelState();
        } else {
            this._appointments.option('items', []);
        }
    }

    _getAppointmentsToRepaint() {
        const appointments = this._layoutManager.createAppointmentsMap(this._filteredItems);
        return this._layoutManager.getRepaintedAppointments(appointments, this.getAppointmentsInstance().option('items'));
    }

    _initExpressions(fields) {
        const isDateField = function(field) {
            return field === 'startDate' || field === 'endDate';
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

                const getter = compileGetter(expr);
                const setter = compileSetter(expr);

                let dateGetter;
                let dateSetter;

                if(isDateField(name)) {
                    const that = this;
                    dateGetter = function() {
                        let value = getter.apply(this, arguments);
                        if(config().forceIsoDateParsing) {
                            if(!that.option('dateSerializationFormat')) {
                                const format = dateSerialization.getDateSerializationFormat(value);
                                if(format) {
                                    that.option('dateSerializationFormat', format);
                                }
                            }
                            value = dateSerialization.deserializeDate(value);
                        }
                        return value;
                    };
                    dateSetter = function(object, value) {
                        if(config().forceIsoDateParsing || that.option('dateSerializationFormat')) {
                            value = dateSerialization.serializeDate(value, that.option('dateSerializationFormat'));
                        }
                        setter.call(this, object, value);
                    };
                }

                this._dataAccessors.getter[name] = dateGetter || getter;
                this._dataAccessors.setter[name] = dateSetter || setter;
                this._dataAccessors.expr[name + 'Expr'] = expr;
            } else {
                delete this._dataAccessors.getter[name];
                delete this._dataAccessors.setter[name];
                delete this._dataAccessors.expr[name + 'Expr'];
            }
        }).bind(this));
    }

    _updateExpression(name, value) {
        const exprObj = {};
        exprObj[name.replace('Expr', '')] = value;
        this._initExpressions(exprObj);
    }

    _initEditing() {
        const editing = this.option('editing');

        this._editing = {
            allowAdding: !!editing,
            allowUpdating: !!editing,
            allowDeleting: !!editing,
            allowResizing: !!editing,
            allowDragging: !!editing
        };

        if(isObject(editing)) {
            this._editing = extend(this._editing, editing);
        }

        this._editing.allowDragging = this._editing.allowDragging && this._editing.allowUpdating;
        this._editing.allowResizing = this._editing.allowResizing && this._editing.allowUpdating;

        this.$element().toggleClass(WIDGET_READONLY_CLASS, this._isReadOnly());
    }

    _isReadOnly() {
        let result = true;
        const editing = this._editing;

        for(const prop in editing) {
            if(Object.prototype.hasOwnProperty.call(editing, prop)) {
                result = result && !editing[prop];
            }
        }

        return result;
    }

    _dispose() {
        this._appointmentTooltip && this._appointmentTooltip.dispose();
        this.hideAppointmentPopup();
        this.hideAppointmentTooltip();

        this._asyncTemplatesTimers.forEach(clearTimeout);
        this._asyncTemplatesTimers = [];

        super._dispose();
    }

    _initActions() {
        this._actions = {
            'onAppointmentAdding': this._createActionByOption('onAppointmentAdding'),
            'onAppointmentAdded': this._createActionByOption('onAppointmentAdded'),
            'onAppointmentUpdating': this._createActionByOption('onAppointmentUpdating'),
            'onAppointmentUpdated': this._createActionByOption('onAppointmentUpdated'),
            'onAppointmentDeleting': this._createActionByOption('onAppointmentDeleting'),
            'onAppointmentDeleted': this._createActionByOption('onAppointmentDeleted'),
            'onAppointmentFormOpening': this._createActionByOption('onAppointmentFormOpening')
        };
    }

    _getAppointmentRenderedAction() {
        return this._createActionByOption('onAppointmentRendered', {
            excludeValidators: ['disabled', 'readOnly']
        });
    }

    _renderFocusTarget() { return noop(); }

    _initMarkup() {
        super._initMarkup();

        this.fire('validateDayHours');
        this._validateCellDuration();

        this._processCurrentView();
        this._renderHeader();

        this._layoutManager = new SchedulerLayoutManager(this, this._getAppointmentsRenderingStrategy());

        this._appointments = this._createComponent('<div>', SchedulerAppointments, this._appointmentsConfig());
        this._appointments.option('itemTemplate', this._getAppointmentTemplate('appointmentTemplate'));

        this._appointmentTooltip = new (this.option('adaptivityEnabled') ?
            MobileTooltipStrategy : DesktopTooltipStrategy)(this._getAppointmentTooltipOptions());
        this._appointmentPopup = new AppointmentPopup(this);

        if(this._isLoaded() || this._isDataSourceLoading()) {
            this._initMarkupCore(this._loadedResources);
            this._dataSourceChangedHandler(this._dataSource.items());
            this._fireContentReadyAction();
        } else {
            this._loadResources().done((function(resources) {
                this._initMarkupCore(resources);
                this._reloadDataSource();
            }).bind(this));
        }
    }

    _getAppointmentTooltipOptions() {
        const that = this;
        return {
            createComponent: that._createComponent.bind(that),
            container: that.$element(),
            getScrollableContainer: that.getWorkSpaceScrollableContainer.bind(that),
            addDefaultTemplates: that._templateManager.addDefaultTemplates.bind(that._templateManager),
            getAppointmentTemplate: that._getAppointmentTemplate.bind(that),
            showAppointmentPopup: that.showAppointmentPopup.bind(that),
            checkAndDeleteAppointment: that.checkAndDeleteAppointment.bind(that),
            isAppointmentInAllDayPanel: that.isAppointmentInAllDayPanel.bind(that),

            createFormattedDateText: (appointment, targetedAppointment, format) => this.fire('getTextAndFormatDate', appointment, targetedAppointment, format)
        };
    }

    checkAndDeleteAppointment(appointment, targetedAppointment) {
        const targetedAdapter = this.createAppointmentAdapter(targetedAppointment);

        const that = this;
        this._checkRecurringAppointment(appointment, targetedAppointment, targetedAdapter.startDate, (function() {
            that.deleteAppointment(appointment);
        }), true);
    }

    _getExtraAppointmentTooltipOptions() {
        return {
            rtlEnabled: this.option('rtlEnabled'),
            focusStateEnabled: this.option('focusStateEnabled'),
            editing: this.option('editing'),
            offset: this.option('_appointmentTooltipOffset'),
        };
    }

    isAppointmentInAllDayPanel(appointmentData) {
        const workSpace = this._workSpace;
        const itTakesAllDay = this.appointmentTakesAllDay(appointmentData);

        return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option('showAllDayPanel');
    }

    _initMarkupCore(resources) {
        this._readyToRenderAppointments = hasWindow();

        this._workSpace && this._cleanWorkspace();

        this._renderWorkSpace(resources);
        this._appointments.option({
            fixedContainer: this._workSpace.getFixedContainer(),
            allDayContainer: this._workSpace.getAllDayContainer()
        });
        this._waitAsyncTemplate(() => this._workSpaceRecalculation?.resolve());
        this._filterAppointmentsByDate();
    }

    _isLoaded() {
        return this._isResourcesLoaded() && this._isDataSourceLoaded();
    }

    _isResourcesLoaded() {
        return isDefined(this._loadedResources);
    }

    _isDataSourceLoaded() {
        return this._dataSource && this._dataSource.isLoaded();
    }

    _render() {
        // NOTE: remove small class applying after adaptivity implementation
        this._toggleSmallClass();

        this._toggleAdaptiveClass();

        super._render();
    }

    _renderHeader() {
        const $header = $('<div>').appendTo(this.$element());
        this._header = this._createComponent($header, SchedulerHeader, this._headerConfig());
    }

    _headerConfig() {
        const currentViewOptions = this._getCurrentViewOptions();
        const countConfig = this._getViewCountConfig();

        const result = extend({
            isAdaptive: this.option('adaptivityEnabled'),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            currentView: this._currentView,
            tabIndex: this.option('tabIndex'),
            focusStateEnabled: this.option('focusStateEnabled'),
            width: this.option('width'),
            rtlEnabled: this.option('rtlEnabled'),
            useDropDownViewSwitcher: this.option('useDropDownViewSwitcher'),
            _dropDownButtonIcon: this.option('_dropDownButtonIcon'),
            customizeDateNavigatorText: this.option('customizeDateNavigatorText')
        }, currentViewOptions);

        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.views = this.option('views');
        result.min = new Date(this._dateOption('min'));
        result.max = new Date(this._dateOption('max'));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption('currentDate')));

        return result;
    }

    _appointmentsConfig() {
        const that = this;

        const config = {
            observer: this,
            onItemRendered: this._getAppointmentRenderedAction(),
            onItemClick: this._createActionByOption('onAppointmentClick'),
            onItemContextMenu: this._createActionByOption('onAppointmentContextMenu'),
            onAppointmentDblClick: this._createActionByOption('onAppointmentDblClick'),
            tabIndex: this.option('tabIndex'),
            focusStateEnabled: this.option('focusStateEnabled'),
            allowDrag: this._allowDragging(),
            allowDelete: this._editing.allowUpdating && this._editing.allowDeleting,
            allowResize: this._allowResizing(),
            allowAllDayResize: this._allowAllDayResizing(),
            rtlEnabled: this.option('rtlEnabled'),
            currentView: this.option('currentView'),
            onContentReady: function() {
                that._workSpace && that._workSpace.option('allDayExpanded', that._isAllDayExpanded(that.getFilteredItems()));
            }
        };

        return config;
    }

    getCollectorOffset() {
        if(this._workSpace.needApplyCollectorOffset() && !this.option('adaptivityEnabled')) {
            return this.option('_collectorOffset');
        } else {
            return 0;
        }
    }

    getAppointmentDurationInMinutes() {
        return this._getCurrentViewOption('cellDuration');
    }

    _processCurrentView() {
        const views = this.option('views');
        const currentView = this.option('currentView');
        const that = this;

        this._currentView = currentView;

        each(views, function(_, view) {
            const isViewIsObject = isObject(view);
            const viewName = isViewIsObject ? view.name : view;
            const viewType = view.type;

            if(currentView === viewName || currentView === viewType) {
                that._currentView = view;
                return false;
            }
        });
    }

    _validateCellDuration() {
        const endDayHour = this._getCurrentViewOption('endDayHour');
        const startDayHour = this._getCurrentViewOption('startDayHour');
        const cellDuration = this._getCurrentViewOption('cellDuration');

        if((endDayHour - startDayHour) * MINUTES_IN_HOUR % cellDuration !== 0) {
            errors.log('W1015');
        }
    }

    _getCurrentViewType() {
        return this._currentView.type || this._currentView;
    }

    _getAppointmentsRenderingStrategy() {
        return VIEWS_CONFIG[this._getCurrentViewType()].renderingStrategy;
    }

    _renderWorkSpace(groups) {
        this._readyToRenderAppointments && this._toggleSmallClass();
        const $workSpace = $('<div>').appendTo(this.$element());

        const countConfig = this._getViewCountConfig();

        const workSpaceComponent = VIEWS_CONFIG[this._getCurrentViewType()].workSpace;
        const workSpaceConfig = this._workSpaceConfig(groups, countConfig);
        this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);

        this._allowDragging() && this._workSpace.initDragBehavior(this, this._all);
        this._workSpace._attachTablesEvents();
        this._workSpace.getWorkArea().append(this._appointments.$element());

        this._recalculateWorkspace();
        countConfig.startDate && this._header && this._header.option('currentDate', this._workSpace._getHeaderDate());

        this._appointments.option('_collectorOffset', this.getCollectorOffset());
    }

    _getViewCountConfig() {
        const currentView = this.option('currentView');

        const view = this._getViewByName(currentView);
        const viewCount = view && view.intervalCount || 1;
        const startDate = view && view.startDate || null;

        return {
            intervalCount: viewCount,
            startDate: startDate
        };
    }

    _getViewByName(name) {
        const views = this.option('views');

        for(let i = 0; i < views.length; i++) {
            if(views[i].name === name || views[i].type === name || views[i] === name) return views[i];
        }
    }

    _recalculateWorkspace() {
        this._workSpaceRecalculation = new Deferred();
        this._waitAsyncTemplate(() => {
            triggerResizeEvent(this._workSpace.$element());
            this._workSpace._refreshDateTimeIndication();
        });
    }

    _workSpaceConfig(groups, countConfig) {
        const currentViewOptions = this._getCurrentViewOptions();
        const scrolling = this.option('scrolling');

        const result = extend({
            noDataText: this.option('noDataText'),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            startDayHour: this.option('startDayHour'),
            endDayHour: this.option('endDayHour'),
            tabIndex: this.option('tabIndex'),
            accessKey: this.option('accessKey'),
            focusStateEnabled: this.option('focusStateEnabled'),
            cellDuration: this.option('cellDuration'),
            showAllDayPanel: this.option('showAllDayPanel'),
            showCurrentTimeIndicator: this.option('showCurrentTimeIndicator'),
            indicatorTime: this.option('indicatorTime'),
            indicatorUpdateInterval: this.option('indicatorUpdateInterval'),
            shadeUntilCurrentTime: this.option('shadeUntilCurrentTime'),
            allDayExpanded: this._appointments.option('items'),
            crossScrollingEnabled: this.option('crossScrollingEnabled'),
            dataCellTemplate: this.option('dataCellTemplate'),
            timeCellTemplate: this.option('timeCellTemplate'),
            resourceCellTemplate: this.option('resourceCellTemplate'),
            dateCellTemplate: this.option('dateCellTemplate'),
            allowMultipleCellSelection: this.option('allowMultipleCellSelection'),
            selectedCellData: this.option('selectedCellData'),
            onSelectionChanged: (args) => {
                this.option('selectedCellData', args.selectedCellData);
            },
            groupByDate: this._getCurrentViewOption('groupByDate'),
            scrolling: scrolling,
            renovateRender: this.option('renovateRender')
                || scrolling.mode === 'virtual'
                || currentViewOptions.scrolling?.mode === 'virtual'
        }, currentViewOptions);

        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.startDate = countConfig.startDate;
        result.groups = groups;
        result.onCellClick = this._createActionByOption('onCellClick');
        result.onCellContextMenu = this._createActionByOption('onCellContextMenu');
        result.min = new Date(this._dateOption('min'));
        result.max = new Date(this._dateOption('max'));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption('currentDate')));
        result.hoursInterval = result.cellDuration / 60;
        result.allDayExpanded = this._isAllDayExpanded(this.getFilteredItems());
        result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
        result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
        result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
        result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;

        return result;
    }

    _waitAsyncTemplate(callback) {
        if(this._options.silent('templatesRenderAsynchronously')) {
            const timer = setTimeout(() => {
                callback();
                clearTimeout(timer);
            });
            this._asyncTemplatesTimers.push(timer);
        } else {
            callback();
        }
    }

    _getCurrentViewOptions() {
        return this._currentView;
    }

    _getCurrentViewOption(optionName) {
        const currentViewOptions = this._getCurrentViewOptions();

        if(currentViewOptions && currentViewOptions[optionName] !== undefined) {
            return currentViewOptions[optionName];
        }

        return this.option(optionName);
    }

    _getAppointmentTemplate(optionName) {
        const currentViewOptions = this._getCurrentViewOptions();

        if(currentViewOptions && currentViewOptions[optionName]) {
            return this._getTemplate(currentViewOptions[optionName]);
        }

        return this._getTemplateByOption(optionName);
    }

    _updateOption(viewName, optionName, value) {
        const currentViewOptions = this._getCurrentViewOptions();

        if(!currentViewOptions || !isDefined(currentViewOptions[optionName])) {
            this['_' + viewName].option(optionName, value);
        }
    }

    _refreshWorkSpace(groups) {
        this._cleanWorkspace();

        delete this._workSpace;

        this._renderWorkSpace(groups);

        if(this._readyToRenderAppointments) {
            this._appointments.option({
                fixedContainer: this._workSpace.getFixedContainer(),
                allDayContainer: this._workSpace.getAllDayContainer()
            });
            this._waitAsyncTemplate(() => this._workSpaceRecalculation.resolve());
        }
    }

    _cleanWorkspace() {
        this._appointments.$element().detach();
        this._workSpace._dispose();
        this._workSpace.$element().remove();

        this.option('selectedCellData', []);
    }

    getWorkSpaceScrollable() {
        return this._workSpace.getScrollable();
    }

    getWorkSpaceScrollableScrollTop(allDay) {
        return this._workSpace.getGroupedScrollableScrollTop(allDay);
    }

    getWorkSpaceScrollableScrollLeft() {
        return this._workSpace.getScrollableScrollLeft();
    }

    getWorkSpaceScrollableContainer() {
        return this._workSpace.getScrollableContainer();
    }

    getWorkSpaceAllDayHeight() {
        return this._workSpace.getAllDayHeight();
    }

    getWorkSpaceAllDayOffset() {
        return this._workSpace.getAllDayOffset();
    }

    getWorkSpaceHeaderPanelHeight() {
        return this._workSpace.getHeaderPanelHeight();
    }

    getWorkSpaceDateTableOffset() {
        return !this.option('crossScrollingEnabled') || this.option('rtlEnabled') ? this._workSpace.getWorkSpaceLeftOffset() : 0;
    }

    getWorkSpace() {
        return this._workSpace;
    }

    getAppointmentModel() {
        return this._appointmentModel;
    }

    getHeader() {
        return this._header;
    }

    getMaxAppointmentsPerCell() {
        return this._getCurrentViewOption('maxAppointmentsPerCell');
    }

    _cleanPopup() {
        this._appointmentPopup && this._appointmentPopup.dispose();
    }

    _checkRecurringAppointment(targetAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing, dragEvent) {
        delete this._updatedRecAppointment;

        const recurrenceRule = this.fire('getField', 'recurrenceRule', targetAppointment);

        if(!getRecurrenceProcessor().evalRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
            callback();
            return;
        }

        const editMode = this.option('recurrenceEditMode');
        switch(editMode) {
            case 'series':
                callback();
                break;
            case 'occurrence':
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
    }

    _getCorrectedExceptionDateByDST(exceptionDate, appointment, targetedAppointment) {
        const offset = appointment.startDate.getTimezoneOffset() - targetedAppointment.startDate.getTimezoneOffset();
        if(offset !== 0) {
            return DateAdapter(exceptionDate)
                .addTime(offset * dateUtils.dateToMilliseconds('minute'))
                .result();
        }
        return exceptionDate;
    }

    _singleAppointmentChangesHandler(rawAppointment, rawTargetedAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
        const appointment = this.createAppointmentAdapter(rawAppointment);
        const targetedAppointment = this.createAppointmentAdapter(rawTargetedAppointment);
        const updatedAppointment = this.createAppointmentAdapter(rawAppointment);

        targetedAppointment.recurrenceRule = '';
        targetedAppointment.recurrenceException = '';

        if(!isDeleted && !isPopupEditing) {
            this.addAppointment(rawTargetedAppointment);
        }

        const correctedExceptionDate = this._getCorrectedExceptionDateByDST(exceptionDate, appointment, targetedAppointment);
        updatedAppointment.recurrenceException = this._createRecurrenceException(correctedExceptionDate, rawAppointment);

        if(isPopupEditing) {
            // TODO: need to refactor - move as parameter to appointment popup
            this._updatedRecAppointment = updatedAppointment.source();

            this._appointmentPopup.show(rawTargetedAppointment, true);
            this._editAppointmentData = rawAppointment;

        } else {
            this._updateAppointment(rawAppointment, updatedAppointment.source(), function() {
                this._appointments.moveAppointmentBack(dragEvent);
            }, dragEvent);
        }
    }

    _createRecurrenceException(exceptionDate, targetAppointment) {
        const result = [];
        const adapter = this.createAppointmentAdapter(targetAppointment);

        if(adapter.recurrenceException) {
            result.push(adapter.recurrenceException);
        }
        result.push(this._serializeRecurrenceException(exceptionDate, adapter.startDate, adapter.allDay));

        return result.join();
    }


    _serializeRecurrenceException(exceptionDate, targetStartDate, isAllDay) {
        isAllDay && exceptionDate.setHours(targetStartDate.getHours(),
            targetStartDate.getMinutes(),
            targetStartDate.getSeconds(),
            targetStartDate.getMilliseconds());

        return dateSerialization.serializeDate(exceptionDate, UTC_FULL_DATE_FORMAT);
    }

    _showRecurrenceChangeConfirm(isDeleted) {
        const message = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteMessage' : 'dxScheduler-confirmRecurrenceEditMessage');
        const seriesText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteSeries' : 'dxScheduler-confirmRecurrenceEditSeries');
        const occurrenceText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteOccurrence' : 'dxScheduler-confirmRecurrenceEditOccurrence');

        return customDialog({
            messageHtml: message,
            showCloseButton: true,
            showTitle: true,
            buttons: [
                { text: seriesText, onClick: function() { return true; } },
                { text: occurrenceText, onClick: function() { return false; } }
            ]
        }).show();
    }

    _getUpdatedData(options) {
        const target = options.data || options;
        const cellData = this.getTargetCellData();
        const targetAllDay = this.fire('getField', 'allDay', target);
        let targetStartDate = new Date(this.fire('getField', 'startDate', target));
        let targetEndDate = new Date(this.fire('getField', 'endDate', target));
        let date = cellData.startDate || targetStartDate;

        if(!targetStartDate || isNaN(targetStartDate)) {
            targetStartDate = date;
        }
        const targetStartTime = targetStartDate.getTime();

        if(!targetEndDate || isNaN(targetEndDate)) {
            targetEndDate = cellData.endDate;
        }
        const targetEndTime = targetEndDate.getTime() || cellData.endData;

        const duration = targetEndTime - targetStartTime;

        if(this._workSpace.keepOriginalHours()) {
            const diff = targetStartTime - dateUtils.trimTime(targetStartDate).getTime();
            date = new Date(dateUtils.trimTime(date).getTime() + diff);
        }

        const updatedData = {};
        const allDay = cellData.allDay;

        this.fire('setField', 'allDay', updatedData, allDay);
        this.fire('setField', 'startDate', updatedData, date);

        let endDate = new Date(date.getTime() + duration);

        if(this.appointmentTakesAllDay(target) && !updatedData.allDay && this._workSpace.supportAllDayRow()) {
            endDate = this._workSpace.calculateEndDate(date);
        }

        if(targetAllDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
            const dateCopy = new Date(date);
            dateCopy.setHours(0);

            endDate = new Date(dateCopy.getTime() + duration);

            if(endDate.getHours() !== 0) {
                endDate.setHours(this._getCurrentViewOption('endDayHour'));
            }
        }

        endDate = new Date(endDate.getTime() - timeZoneUtils.getTimezoneOffsetChangeInMs(targetStartDate, targetEndDate, date, endDate));

        this.fire('setField', 'endDate', updatedData, endDate);
        this._resourcesManager.setResourcesToItem(updatedData, cellData.groups);

        return updatedData;
    }

    getTargetedAppointment(appointment, element) {
        const settings = utils.dataAccessors.getAppointmentSettings(element);
        const info = utils.dataAccessors.getAppointmentInfo(element);

        const appointmentIndex = $(element).data(this._appointments._itemIndexKey());

        const adapter = this.createAppointmentAdapter(appointment);
        const targetedAdapter = adapter.clone();

        const isRecurrenceAppointment = adapter.recurrenceRule && getRecurrenceProcessor().isValidRecurrenceRule(adapter.recurrenceRule);

        if(this._isAgenda() && isRecurrenceAppointment) {
            const getStartDate = this.getRenderingStrategyInstance().getAppointmentDataCalculator();
            const newStartDate = getStartDate($(element), adapter.startDate).startDate;

            targetedAdapter.startDate = newStartDate;
            targetedAdapter.endDate = new Date(newStartDate.getTime() + adapter.duration);

        } else if(settings) {
            targetedAdapter.startDate = info ? info.sourceAppointment.startDate : adapter.startDate; // TODO: in agenda we havn't info field
            targetedAdapter.endDate = info ? info.sourceAppointment.endDate : adapter.endDate;
        }

        element && this.setTargetedAppointmentResources(targetedAdapter.source(), element, appointmentIndex);

        return targetedAdapter.source();
    }

    subscribe(subject, action) {
        this._subscribes[subject] = subscribes[subject] = action;
    }

    fire(subject) {
        const callback = this._subscribes[subject];
        const args = Array.prototype.slice.call(arguments);

        if(!isFunction(callback)) {
            throw errors.Error('E1031', subject);
        }

        return callback.apply(this, args.slice(1));
    }

    getTargetCellData() {
        return this._workSpace.getDataByDroppableCell();
    }

    _updateAppointment(target, appointment, onUpdatePrevented, dragEvent) {
        const updatingOptions = {
            newData: appointment,
            oldData: extend({}, target),
            cancel: false
        };

        const performFailAction = function(err) {
            if(isFunction(onUpdatePrevented)) {
                onUpdatePrevented.call(this);
            }

            if(err && err.name === 'Error') {
                throw err;
            }
        }.bind(this);

        this._actions['onAppointmentUpdating'](updatingOptions);

        if(dragEvent && !isDeferred(dragEvent.cancel)) {
            dragEvent.cancel = new Deferred();
        }

        return this._processActionResult(updatingOptions, function(canceled) {
            let deferred = new Deferred();

            if(!canceled) {
                this._expandAllDayPanel(appointment);

                try {
                    deferred = this._appointmentModel
                        .update(target, appointment)
                        .done(() => {
                            dragEvent && dragEvent.cancel.resolve(false);
                        })
                        .always((function(e) {
                            this._executeActionWhenOperationIsCompleted(this._actions['onAppointmentUpdated'], appointment, e);
                        }).bind(this))
                        .fail(function() {
                            performFailAction();
                        });
                } catch(err) {
                    performFailAction(err);
                    deferred.resolve();
                }
            } else {
                performFailAction();
                deferred.resolve();
            }

            return deferred.promise();
        });
    }

    _processActionResult(actionOptions, callback) {
        const deferred = new Deferred();
        const resolveCallback = callbackResult => {
            when(fromPromise(callbackResult))
                .always(deferred.resolve);
        };

        if(isPromise(actionOptions.cancel)) {
            when(fromPromise(actionOptions.cancel)).always((cancel) => {
                if(!isDefined(cancel)) {
                    cancel = actionOptions.cancel.state() === 'rejected';
                }
                resolveCallback(callback.call(this, cancel));
            });
        } else {
            resolveCallback(callback.call(this, actionOptions.cancel));
        }

        return deferred.promise();
    }

    _expandAllDayPanel(appointment) {
        if(!this._isAllDayExpanded(this.getFilteredItems()) && this.appointmentTakesAllDay(appointment)) {
            this._workSpace.option('allDayExpanded', true);
        }
    }

    _executeActionWhenOperationIsCompleted(action, appointment, e) {
        const options = { appointmentData: appointment };
        const isError = e && e.name === 'Error';

        if(isError) {
            options.error = e;
        } else {
            this._appointmentPopup.isVisible() && this._appointmentPopup.hide();
        }
        action(options);

        this._fireContentReadyAction();
    }

    getAppointmentPopup() {
        return this._appointmentPopup.getPopup();
    }

    ///#DEBUG
    getAppointmentDetailsForm() { // TODO for tests
        return this._appointmentPopup._appointmentForm;
    }
    ///#ENDDEBUG

    getUpdatedAppointment() {
        return this._appointmentModel.getUpdatedAppointment();
    }

    getUpdatedAppointmentKeys() {
        return this._appointmentModel.getUpdatedAppointmentKeys();
    }

    getAppointmentsInstance() {
        return this._appointments;
    }

    getResourceManager() {
        return this._resourcesManager;
    }

    getLayoutManager() {
        return this._layoutManager;
    }

    getRenderingStrategyInstance() {
        return this._layoutManager.getRenderingStrategyInstance();
    }

    getFilteredItems() {
        return this._filteredItems;
    }

    getActions() {
        return this._actions;
    }

    appointmentTakesAllDay(appointment) {
        return this._appointmentModel.appointmentTakesAllDay(appointment, this._getCurrentViewOption('startDayHour'), this._getCurrentViewOption('endDayHour'));
    }

    // TODO: use for appointment model
    _getRecurrenceException(appointmentData) {
        let recurrenceException = this.fire('getField', 'recurrenceException', appointmentData);

        if(recurrenceException) {
            const startDate = this.fire('getField', 'startDate', appointmentData);
            const exceptions = recurrenceException.split(',');
            const startDateTimeZone = this.fire('getField', 'startDateTimeZone', appointmentData);

            for(let i = 0; i < exceptions.length; i++) {
                exceptions[i] = this._convertRecurrenceException(exceptions[i], startDate, startDateTimeZone);
            }

            recurrenceException = exceptions.join();
        }

        return recurrenceException;
    }

    _convertRecurrenceException(exceptionString, startDate, startDateTimeZone) {
        exceptionString = exceptionString.replace(/\s/g, '');

        const exceptionDate = dateSerialization.deserializeDate(exceptionString);
        const convertedStartDate = this.fire('convertDateByTimezone', startDate, startDateTimeZone);
        let convertedExceptionDate = this.fire('convertDateByTimezone', exceptionDate, startDateTimeZone);

        convertedExceptionDate = timeZoneUtils.correctRecurrenceExceptionByTimezone(convertedExceptionDate, convertedStartDate, this.option('timeZone'), startDateTimeZone);
        exceptionString = dateSerialization.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT);
        return exceptionString;
    }

    dayHasAppointment(day, appointment, trimTime) {
        let startDate = new Date(this.fire('getField', 'startDate', appointment));
        let endDate = new Date(this.fire('getField', 'endDate', appointment));
        const startDateTimeZone = this.fire('getField', 'startDateTimeZone', appointment);
        const endDateTimeZone = this.fire('getField', 'endDateTimeZone', appointment);

        startDate = this.fire('convertDateByTimezone', startDate, startDateTimeZone);
        endDate = this.fire('convertDateByTimezone', endDate, endDateTimeZone);

        if(day.getTime() === endDate.getTime()) {
            return startDate.getTime() === endDate.getTime();
        }

        if(trimTime) {
            day = dateUtils.trimTime(day);
            startDate = dateUtils.trimTime(startDate);
            endDate = dateUtils.trimTime(endDate);
        }

        const dayTimeStamp = day.getTime();
        const startDateTimeStamp = startDate.getTime();
        const endDateTimeStamp = endDate.getTime();


        return (inArray(dayTimeStamp, [startDateTimeStamp, endDateTimeStamp]) > -1)
                ||
                (startDateTimeStamp < dayTimeStamp && endDateTimeStamp > dayTimeStamp);
    }

    setTargetedAppointmentResources(targetedAppointment, appointmentElement, appointmentIndex) {
        const groups = this._getCurrentViewOption('groups');

        if(groups && groups.length) {
            const resourcesSetter = this._resourcesManager._dataAccessors.setter;
            const workSpace = this._workSpace;
            let getGroups;
            let setResourceCallback;

            if(this._isAgenda()) {
                getGroups = function() {
                    const apptSettings = this.getLayoutManager()._positionMap[appointmentIndex];
                    return workSpace._getCellGroups(apptSettings[0].groupIndex);
                };

                setResourceCallback = function(_, group) {
                    resourcesSetter[group.name](targetedAppointment, group.id);
                };
            } else {
                getGroups = function() {
                    const setting = $(appointmentElement).data('dxAppointmentSettings') || {}; // TODO: in the future, necessary refactor the engine of determining groups
                    return workSpace.getCellDataByCoordinates({ left: setting.left, top: setting.top }).groups;
                };

                setResourceCallback = function(field, value) {
                    resourcesSetter[field](targetedAppointment, value);
                };
            }

            each(getGroups.call(this), setResourceCallback);
        }
    }

    getStartViewDate() {
        return this._workSpace.getStartViewDate();
    }

    getEndViewDate() {
        return this._workSpace.getEndViewDate();
    }

    showAppointmentPopup(rawAppointment, createNewAppointment, rawTargetedAppointment) {
        const appointment = this.createAppointmentAdapter(rawTargetedAppointment || rawAppointment);
        const newTargetedAppointment = extend({}, rawAppointment, rawTargetedAppointment);

        this._checkRecurringAppointment(rawAppointment, newTargetedAppointment, appointment.startDate, () => {
            if(createNewAppointment || isEmptyObject(rawAppointment)) {
                delete this._editAppointmentData;
                this._editing.allowAdding && this._appointmentPopup.show(rawAppointment, true);
            } else {
                this._editAppointmentData = rawAppointment;
                this._appointmentPopup.show(rawAppointment, this._editing.allowUpdating);
            }
        }, false, true);
    }

    hideAppointmentPopup(saveChanges) {
        if(this._appointmentPopup && this._appointmentPopup.isVisible()) {
            saveChanges && this._appointmentPopup.saveChanges();
            this._appointmentPopup.hide();
        }
    }

    showAppointmentTooltip(appointment, target, targetedAppointment) {
        if(appointment) {
            const info = new AppointmentTooltipInfo(appointment, targetedAppointment, this._appointments._tryGetAppointmentColor(target));
            this.showAppointmentTooltipCore(target, [info]);
        }
    }

    showAppointmentTooltipCore(target, data, options) {
        if(this._appointmentTooltip.isAlreadyShown(target)) {
            this.hideAppointmentTooltip();
        } else {
            this._appointmentTooltip.show(
                target, data, extend(this._getExtraAppointmentTooltipOptions(), options)
            );
        }
    }

    hideAppointmentTooltip() {
        this._appointmentTooltip && this._appointmentTooltip.hide();
    }

    scrollToTime(hours, minutes, date) {
        this._workSpace.scrollToTime(hours, minutes, date);
    }

    scrollTo(date, groups, allDay) {
        this._workSpace.scrollTo(date, groups, allDay);
    }

    addAppointment(appointment) {
        const adapter = this.createAppointmentAdapter(appointment);
        adapter.text = adapter.text || '';

        const serializedAppointment = adapter.source(true);

        const addingOptions = {
            appointmentData: serializedAppointment,
            cancel: false
        };

        this._actions['onAppointmentAdding'](addingOptions);

        return this._processActionResult(addingOptions, canceled => {
            if(canceled) {
                return new Deferred().resolve();
            }

            this._expandAllDayPanel(serializedAppointment);

            return this._appointmentModel.add(serializedAppointment)
                .always(e => this._executeActionWhenOperationIsCompleted(this._actions['onAppointmentAdded'], serializedAppointment, e));
        });
    }

    updateAppointment(target, appointment) {
        return this._updateAppointment(target, appointment);
    }

    deleteAppointment(appointment) {
        const deletingOptions = {
            appointmentData: appointment,
            cancel: false
        };

        this._actions['onAppointmentDeleting'](deletingOptions);

        this._processActionResult(deletingOptions, function(canceled) {
            if(!canceled) {
                this._appointmentModel.remove(appointment).always((function(e) {
                    this._executeActionWhenOperationIsCompleted(this._actions['onAppointmentDeleted'], appointment, e);
                }).bind(this));
            }
        });
    }

    focus() {
        if(this._editAppointmentData) {
            this._appointments.focus();
        } else {
            this._workSpace.focus();
        }
    }

    getFirstDayOfWeek() {
        return isDefined(this.option('firstDayOfWeek')) ? this.option('firstDayOfWeek') : dateLocalization.firstDayOfWeekIndex();
    }

    createAppointmentAdapter(rawAppointment) {
        const options = {
            getField: (rawAppointment, property) => this.fire('getField', property, rawAppointment),
            setField: (rawAppointment, property, value) => this.fire('setField', property, rawAppointment, value),
            getTimeZoneCalculator: () => this.timeZoneCalculator
        };
        return new AppointmentAdapter(rawAppointment, options);
    }

    /**
        * @name dxSchedulerMethods.registerKeyHandler
        * @publicName registerKeyHandler(key, handler)
        * @hidden
        */
}

Scheduler.include(DataHelperMixin);

registerComponent('dxScheduler', Scheduler);

export default Scheduler;
