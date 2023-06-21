import registerComponent from '../../core/component_registrator';
import config from '../../core/config';
import devices from '../../core/devices';
import $ from '../../core/renderer';
import { BindableTemplate } from '../../core/templates/bindable_template';
import { EmptyTemplate } from '../../core/templates/empty_template';
import Callbacks from '../../core/utils/callbacks';
import { noop } from '../../core/utils/common';
import { compileGetter } from '../../core/utils/data';
import { getBoundingRect } from '../../core/utils/position';
import dateUtils from '../../core/utils/date';
import dateSerialization from '../../core/utils/date_serialization';
import { Deferred, when, fromPromise } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import {
    isDefined,
    isString,
    isObject,
    isFunction,
    isEmptyObject,
    isDeferred,
    isPromise,
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
import { AppointmentPopup, ACTION_TO_APPOINTMENT } from './appointmentPopup/popup';
import { AppointmentForm } from './appointmentPopup/form';
import { CompactAppointmentsHelper } from './compactAppointmentsHelper';
import { DesktopTooltipStrategy } from './tooltip_strategies/desktopTooltipStrategy';
import { MobileTooltipStrategy } from './tooltip_strategies/mobileTooltipStrategy';
import { hide as hideLoading, show as showLoading } from './loading';
import AppointmentCollection from './appointments/appointmentCollection';
import AppointmentLayoutManager from './appointments.layout_manager';
import { SchedulerHeader } from './header/header';
import subscribes from './subscribes';
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
import { createAppointmentAdapter } from './appointmentAdapter';
import { AppointmentTooltipInfo } from './dataStructures';
import { utils } from './utils';
import {
    createExpressions,
    createResourceEditorModel,
    getAppointmentColor,
    getCellGroups,
    loadResources,
    setResourceToAppointment
} from './resources/utils';
import { ExpressionUtils } from './expressionUtils';
import {
    validateDayHours,
    isDateAndTimeView,
    isTimelineView
} from '../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { renderAppointments } from './appointments/render';
import { AgendaResourceProcessor } from './resources/agendaResourceProcessor';
import { AppointmentDataProvider } from './appointments/dataProvider/appointmentDataProvider';
import { getAppointmentTakesAllDay } from '../../renovation/ui/scheduler/appointment/utils/getAppointmentTakesAllDay';
import { getPreparedDataItems } from '../../renovation/ui/scheduler/utils/data';
import { getCurrentView } from '../../renovation/ui/scheduler/model/views';
import { createTimeZoneCalculator } from '../../renovation/ui/scheduler/timeZoneCalculator/createTimeZoneCalculator';
import { excludeFromRecurrence } from '../../renovation/ui/scheduler/utils/recurrence/excludeFromRecurrence';

// STYLE scheduler
const MINUTES_IN_HOUR = 60;
const DEFAULT_AGENDA_DURATION = 7;

const WIDGET_CLASS = 'dx-scheduler';
const WIDGET_SMALL_CLASS = `${WIDGET_CLASS}-small`;
const WIDGET_ADAPTIVE_CLASS = `${WIDGET_CLASS}-adaptive`;
const WIDGET_READONLY_CLASS = `${WIDGET_CLASS}-readonly`;
const WIDGET_SMALL_WIDTH = 400;

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const UTC_FULL_DATE_FORMAT = FULL_DATE_FORMAT + 'Z';

const DEFAULT_APPOINTMENT_TEMPLATE_NAME = 'item';
const DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME = 'appointmentCollector';
const DEFAULT_DROP_DOWN_APPOINTMENT_TEMPLATE_NAME = 'dropDownAppointment';

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

const StoreEventNames = {
    ADDING: 'onAppointmentAdding',
    ADDED: 'onAppointmentAdded',

    DELETING: 'onAppointmentDeleting',
    DELETED: 'onAppointmentDeleted',

    UPDATING: 'onAppointmentUpdating',
    UPDATED: 'onAppointmentUpdated'
};

const RECURRENCE_EDITING_MODE = {
    SERIES: 'editSeries',
    OCCURENCE: 'editOccurence',
    CANCEL: 'cancel',
};

class Scheduler extends Widget {
    _getDefaultOptions() {
        const defaultOptions = extend(super._getDefaultOptions(), {

            views: ['day', 'week'],
            currentView: 'day', // TODO: should we calculate currentView if views array contains only one item, for example 'month'?
            currentDate: dateUtils.trimTime(new Date()),
            min: undefined,
            max: undefined,
            dateSerializationFormat: undefined,
            firstDayOfWeek: undefined,

            groups: [],

            resources: [],
            loadedResources: [],
            resourceLoaderMap: new Map(),

            dataSource: null,

            customizeDateNavigatorText: undefined,

            appointmentTemplate: DEFAULT_APPOINTMENT_TEMPLATE_NAME,

            dropDownAppointmentTemplate: DEFAULT_DROP_DOWN_APPOINTMENT_TEMPLATE_NAME,

            appointmentCollectorTemplate: DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME,

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
                allowTimeZoneEditing: false
            },

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

            onAppointmentTooltipShowing: null,

            appointmentTooltipTemplate: 'appointmentTooltip',

            /**
                * @hidden
                * @name dxSchedulerOptions.appointmentPopupTemplate
                * @type template|function
                * @default "appointmentPopup"
                * @type_function_param1 appointmentData:object
                * @type_function_param2 contentElement:DxElement
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

            disabledExpr: 'disabled',

            remoteFiltering: false,

            timeZone: '',

            startDateTimeZoneExpr: 'startDateTimeZone',

            endDateTimeZoneExpr: 'endDateTimeZone',

            noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),

            adaptivityEnabled: false,

            allowMultipleCellSelection: true,

            scrolling: {
                mode: 'standard'
            },

            allDayPanelMode: 'all',

            renovateRender: true,

            _draggingMode: 'outlook',

            _appointmentTooltipOffset: { x: 0, y: 0 },
            _appointmentTooltipButtonsPosition: 'bottom',
            _appointmentTooltipOpenButtonText: messageLocalization.format('dxScheduler-openAppointment'),
            _appointmentCountPerCell: 2,
            _collectorOffset: 0,
            _appointmentOffset: 26,

            toolbar: [
                {
                    location: 'before',
                    defaultElement: 'dateNavigator',
                },
                {
                    location: 'after',
                    defaultElement: 'viewSwitcher',
                }
            ]

            /**
                * @name dxSchedulerOptions.activeStateEnabled
                * @hidden
                */

            /**
                * @name dxSchedulerOptions.hoverStateEnabled
                * @hidden
                */
        });

        return extend(true, defaultOptions, {
            integrationOptions: {
                useDeferUpdateForTemplates: false
            }
        });
    }

    get filteredItems() {
        if(!this._filteredItems) {
            this._filteredItems = [];
        }
        return this._filteredItems;
    }

    set filteredItems(value) {
        this._filteredItems = value;
    }

    get preparedItems() {
        if(!this._preparedItems) {
            this._preparedItems = [];
        }
        return this._preparedItems;
    }

    set preparedItems(value) {
        this._preparedItems = value;
    }

    get currentView() {
        return getCurrentView(
            this.option('currentView'),
            this.option('views')
        );
    }

    get currentViewType() {
        return isObject(this.currentView)
            ? this.currentView.type
            : this.currentView;
    }

    get timeZoneCalculator() {
        if(!this._timeZoneCalculator) {
            this._timeZoneCalculator = createTimeZoneCalculator(this.option('timeZone'));
        }

        return this._timeZoneCalculator;
    }

    _setDeprecatedOptions() {
        super._setDeprecatedOptions();

        extend(this._deprecatedOptions, {
            dropDownAppointmentTemplate: { since: '19.2', message: 'appointmentTooltipTemplate' },
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
                    _appointmentCountPerCell: 1,
                    _collectorOffset: 20,
                    _appointmentOffset: 30
                }
            }
        ]);
    }

    _postponeDataSourceLoading(promise) {
        this.postponedOperations.add('_reloadDataSource', this._reloadDataSource.bind(this), promise);
    }

    _postponeResourceLoading() {
        const whenLoaded = this.postponedOperations.add('loadResources', () => {
            const groups = this._getCurrentViewOption('groups');

            return loadResources(groups, this.option('resources'), this.option('resourceLoaderMap'));
        });

        const resolveCallbacks = new Deferred();

        whenLoaded.done((resources) => {
            this.option('loadedResources', resources);
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
                this._header?.option(name, new Date(value));
                this._header?.option('startViewDate', this.getStartViewDate());
                this._appointments.option('items', []);
                this._filterAppointmentsByDate();

                this._postponeDataSourceLoading();
                break;
            case 'dataSource':
                this._initDataSource();

                this.appointmentDataProvider.setDataSource(this._dataSource);

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
                if(this._getCurrentViewOptions()) {
                    this.repaint();
                } else {
                    this._header?.option(name, value);
                }
                break;
            case 'useDropDownViewSwitcher':
                this._header?.option(name, value);
                break;
            case 'currentView':
                this._validateDayHours();

                this._validateCellDuration();

                this._appointments.option({
                    items: [],
                    allowDrag: this._allowDragging(),
                    allowResize: this._allowResizing(),
                    itemTemplate: this._getAppointmentTemplate('appointmentTemplate')
                });

                this._postponeResourceLoading().done((resources) => {
                    this._refreshWorkSpace(resources);
                    this._header?.option(this._headerConfig());
                    this._filterAppointmentsByDate();
                    this._appointments.option('allowAllDayResize', value !== 'day');
                });
                // NOTE:
                // Calling postponed operations (promises) here, because when we update options with
                // usage of the beginUpdate / endUpdate methods, other option changes
                // may try to access not initialized values inside the scheduler component.
                this.postponedOperations.callPostponedOperations();
                break;
            case 'appointmentTemplate':
                this._appointments.option('itemTemplate', value);
                break;
            case 'dateCellTemplate':
            case 'resourceCellTemplate':
            case 'dataCellTemplate':
            case 'timeCellTemplate':
                this.repaint();
                break;
            case 'groups':
                this._postponeResourceLoading().done((resources) => {
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                });
                break;
            case 'resources':
                this._dataAccessors.resources = createExpressions(this.option('resources'));
                this.agendaResourceProcessor.initializeState(this.option('resources'));
                this.updateInstances();

                this._postponeResourceLoading().done((resources) => {
                    this._appointments.option('items', []);
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                    this._createAppointmentPopupForm();
                });
                break;
            case 'startDayHour':
            case 'endDayHour':
                this._validateDayHours();

                this.updateInstances();

                this._appointments.option('items', []);
                this._updateOption('workSpace', name, value);
                this._appointments.repaint();
                this._filterAppointmentsByDate();

                this._postponeDataSourceLoading();
                break;
            case StoreEventNames.ADDING:
            case StoreEventNames.ADDED:
            case StoreEventNames.UPDATING:
            case StoreEventNames.UPDATED:
            case StoreEventNames.DELETING:
            case StoreEventNames.DELETED:
            case 'onAppointmentFormOpening':
            case 'onAppointmentTooltipShowing':
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
                this._updateOption('workSpace', name, value);
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
                this._updateOption('workSpace', 'schedulerWidth', value);
                super._optionChanged(args);
                this._dimensionChanged(null, true);
                break;
            case 'height':
                super._optionChanged(args);
                this._dimensionChanged(null, true);
                this._updateOption('workSpace', 'schedulerHeight', value);
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
                this.updateInstances();
                this.repaint();
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
                this.updateInstances();
                this.repaint();
                break;
            case 'dropDownAppointmentTemplate':
            case 'appointmentCollectorTemplate':
            case '_appointmentTooltipOffset':
            case '_appointmentTooltipButtonsPosition':
            case '_appointmentTooltipOpenButtonText':
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
            case 'disabledExpr':
                this._updateExpression(name, value);
                this.appointmentDataProvider.updateDataAccessors(this._dataAccessors);

                this._initAppointmentTemplate();
                this.repaint();
                break;
            case 'adaptivityEnabled':
                this._toggleAdaptiveClass();
                this.repaint();
                break;
            case 'scrolling':
                this.option('crossScrollingEnabled', this._isHorizontalVirtualScrolling() || this.option('crossScrollingEnabled'));

                this._updateOption('workSpace', args.fullName, value);
                break;
            case 'allDayPanelMode':
                this._updateOption('workSpace', args.fullName, value);
                break;
            case 'renovateRender':
                this._updateOption('workSpace', name, value);
                break;
            case '_draggingMode':
                this._workSpace.option('draggingMode', value);
                break;
            case 'toolbar':
                this._header
                    ? this._header.option('items', value)
                    : this.repaint();
                break;
            case 'loadedResources':
            case 'resourceLoaderMap':
                break;
            default:
                super._optionChanged(args);
        }
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
        return this.getLayoutManager().appointmentRenderingStrategyName === 'agenda';
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
        return this.currentViewType !== 'day' || this.currentView.intervalCount > 1;
    }

    _isAllDayExpanded() {
        return this.option('showAllDayPanel') && this.appointmentDataProvider.hasAllDayAppointments(
            this.filteredItems,
            this.preparedItems
        );
    }

    _getTimezoneOffsetByOption(date) {
        return timeZoneUtils.calculateTimezoneByValue(this.option('timeZone'), date);
    }

    _filterAppointmentsByDate() {
        const dateRange = this._workSpace.getDateRange();

        const startDate = this.timeZoneCalculator.createDate(dateRange[0], { path: 'fromGrid' });
        const endDate = this.timeZoneCalculator.createDate(dateRange[1], { path: 'fromGrid' });

        this.appointmentDataProvider.filterByDate(
            startDate,
            endDate,
            this.option('remoteFiltering'),
            this.option('dateSerializationFormat')
        );
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

    _dimensionChanged(value, isForce = false) {
        const isFixedHeight = typeof this.option('height') === 'number';
        const isFixedWidth = typeof this.option('width') === 'number';

        if(!this._isVisible()) {
            return;
        }

        this._toggleSmallClass();

        const workspace = this.getWorkSpace();

        if(!this._isAgenda() && this.filteredItems && workspace) {
            if(isForce || (!isFixedHeight || !isFixedWidth)) {
                workspace.option('allDayExpanded', this._isAllDayExpanded());
                workspace._dimensionChanged();
                const appointments = this.getLayoutManager().createAppointmentsMap(this.filteredItems);

                this._appointments.option('items', appointments);
            }
        }

        this.hideAppointmentTooltip();

        // TODO popup
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
        visible && this._dimensionChanged(null, true);
    }

    _dataSourceOptions() {
        return { paginate: false };
    }

    _initAllDayPanel() {
        if(this.option('allDayPanelMode') === 'hidden') {
            this.option('showAllDayPanel', false);
        }
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
            recurrenceException: this.option('recurrenceExceptionExpr'),
            disabled: this.option('disabledExpr')
        });

        super._init();

        this._initAllDayPanel();

        this._initDataSource();

        this._customizeDataSourceLoadOptions();

        this.$element().addClass(WIDGET_CLASS);

        this._initEditing();

        this.updateInstances();

        this._initActions();

        this._compactAppointmentsHelper = new CompactAppointmentsHelper(this);

        this._asyncTemplatesTimers = [];

        this._dataSourceLoadedCallback = Callbacks();

        this._subscribes = subscribes;

        this.agendaResourceProcessor = new AgendaResourceProcessor(this.option('resources'));
    }

    createAppointmentDataProvider() {
        this.appointmentDataProvider?.destroy();
        this.appointmentDataProvider = new AppointmentDataProvider({
            dataSource: this._dataSource,
            dataAccessors: this._dataAccessors,
            timeZoneCalculator: this.timeZoneCalculator,
            dateSerializationFormat: this.option('dateSerializationFormat'),
            resources: this.option('resources'),
            startDayHour: this._getCurrentViewOption('startDayHour'),
            endDayHour: this._getCurrentViewOption('endDayHour'),
            appointmentDuration: this._getCurrentViewOption('cellDuration'),
            allDayPanelMode: this._getCurrentViewOption('allDayPanelMode'),
            showAllDayPanel: this.option('showAllDayPanel'),
            getLoadedResources: () => this.option('loadedResources'),
            getIsVirtualScrolling: () => this.isVirtualScrolling(),
            getSupportAllDayRow: () => this._workSpace.supportAllDayRow(),
            getViewType: () => this._workSpace.type,
            getViewDirection: () => this._workSpace.viewDirection,
            getDateRange: () => this._workSpace.getDateRange(),
            getGroupCount: () => this._workSpace._getGroupCount(),
            getViewDataProvider: () => this._workSpace.viewDataProvider,
        });
    }

    updateInstances() {
        this._timeZoneCalculator = null;

        if(this.getWorkSpace()) {
            this.createAppointmentDataProvider();
        }
    }

    _customizeDataSourceLoadOptions() {
        this._dataSource?.on('customizeStoreLoadOptions', ({ storeLoadOptions }) => {
            storeLoadOptions.startDate = this.getStartViewDate();
            storeLoadOptions.endDate = this.getEndViewDate();
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

        const getDate = getter => {
            return (data) => {
                const value = getter(data);
                if(value instanceof Date) {
                    return value.valueOf();
                }
                return value;
            };
        };

        this._templateManager.addDefaultTemplates({
            ['item']: new BindableTemplate(($container, data, model) => this.getAppointmentsInstance()._renderAppointmentTemplate($container, data, model)
                , [
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
                    'startDate': getDate(createGetter(expr.startDateExpr)),
                    'endDate': getDate(createGetter(expr.endDateExpr)),
                    'startDateTimeZone': createGetter(expr.startDateTimeZoneExpr),
                    'endDateTimeZone': createGetter(expr.endDateTimeZoneExpr),
                    'allDay': createGetter(expr.allDayExpr),
                    'recurrenceRule': createGetter(expr.recurrenceRuleExpr)
                })
        });
    }

    _renderContent() {
        this._renderContentImpl();
    }

    _updatePreparedItems(items) {
        this.preparedItems = getPreparedDataItems(
            items,
            this._dataAccessors,
            this._getCurrentViewOption('cellDuration'),
            this.timeZoneCalculator
        );
    }

    _dataSourceChangedHandler(result) {
        if(this._readyToRenderAppointments) {
            this._workSpaceRecalculation.done((function() {
                this._updatePreparedItems(result);
                this._renderAppointments();
                this.getWorkSpace().onDataSourceChanged(this.filteredItems);
            }).bind(this));
        }
    }

    isVirtualScrolling() {
        const workspace = this.getWorkSpace();

        if(workspace) {
            return workspace.isVirtualScrolling();
        }

        const currentViewOptions = this._getCurrentViewOptions();
        const scrolling = this.option('scrolling');

        return scrolling?.mode === 'virtual' ||
            currentViewOptions?.scrolling?.mode === 'virtual';
    }

    _filterAppointments() {
        this.filteredItems = this.appointmentDataProvider.filter(this.preparedItems);
    }

    _renderAppointments() {
        const workspace = this.getWorkSpace();
        this._filterAppointments();

        workspace.option('allDayExpanded', this._isAllDayExpanded());

        let viewModel = [];
        if(this._isVisible()) {
            viewModel = this._getAppointmentsToRepaint();
        }

        if(this.option('isRenovatedAppointments')) {
            renderAppointments({
                instance: this,
                $dateTable: this.getWorkSpace()._getDateTable(),
                viewModel
            });
        } else {
            this._appointments.option('items', viewModel);
        }

        this.appointmentDataProvider.cleanState();
    }

    _getAppointmentsToRepaint() {
        const layoutManager = this.getLayoutManager();

        const appointmentsMap = layoutManager.createAppointmentsMap(this.filteredItems);
        if(this.option('isRenovatedAppointments')) {
            const appointmentTemplate = this.option('appointmentTemplate') !== DEFAULT_APPOINTMENT_TEMPLATE_NAME
                ? this.option('appointmentTemplate')
                : undefined;
            return {
                appointments: appointmentsMap,
                appointmentTemplate
            };
        }

        return layoutManager.getRepaintedAppointments(
            appointmentsMap,
            this.getAppointmentsInstance().option('items')
        );
    }

    _initExpressions(fields) {
        this._dataAccessors = utils.dataAccessors.create(
            fields,
            this._dataAccessors,
            config().forceIsoDateParsing,
            this.option('dateSerializationFormat')
        );

        this._dataAccessors.resources = createExpressions(this.option('resources'));
    }

    _updateExpression(name, value) {
        const exprObj = {};
        exprObj[name.replace('Expr', '')] = value;
        this._initExpressions(exprObj);
    }

    getResourceDataAccessors() {
        return this._dataAccessors.resources;
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
        this._recurrenceDialog?.hide(RECURRENCE_EDITING_MODE.CANCEL);

        this.hideAppointmentPopup();
        this.hideAppointmentTooltip();

        this._asyncTemplatesTimers.forEach(clearTimeout);
        this._asyncTemplatesTimers = [];

        super._dispose();
    }

    _initActions() {

        this._actions = {
            'onAppointmentAdding': this._createActionByOption(StoreEventNames.ADDING),
            'onAppointmentAdded': this._createActionByOption(StoreEventNames.ADDED),
            'onAppointmentUpdating': this._createActionByOption(StoreEventNames.UPDATING),
            'onAppointmentUpdated': this._createActionByOption(StoreEventNames.UPDATED),
            'onAppointmentDeleting': this._createActionByOption(StoreEventNames.DELETING),
            'onAppointmentDeleted': this._createActionByOption(StoreEventNames.DELETED),
            'onAppointmentFormOpening': this._createActionByOption('onAppointmentFormOpening'),
            'onAppointmentTooltipShowing': this._createActionByOption('onAppointmentTooltipShowing'),
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

        this._validateDayHours();
        this._validateCellDuration();

        this._renderMainContainer();

        this._renderHeader();

        this._layoutManager = new AppointmentLayoutManager(this);

        this._appointments = this._createComponent('<div>', AppointmentCollection, this._appointmentsConfig());
        this._appointments.option('itemTemplate', this._getAppointmentTemplate('appointmentTemplate'));

        this._appointmentTooltip = new (this.option('adaptivityEnabled')
            ? MobileTooltipStrategy
            : DesktopTooltipStrategy)(this._getAppointmentTooltipOptions());

        this._createAppointmentPopupForm();

        if(this._isDataSourceLoaded() || this._isDataSourceLoading()) {
            this._initMarkupCore(this.option('loadedResources'));
            this._dataSourceChangedHandler(this._dataSource.items());
            this._fireContentReadyAction();
        } else {
            const groups = this._getCurrentViewOption('groups');
            loadResources(groups, this.option('resources'), this.option('resourceLoaderMap')).done((resources) => {
                this.option('loadedResources', resources);
                this._initMarkupCore(resources);
                this._reloadDataSource();
            });
        }
    }

    _createAppointmentPopupForm() {
        if(this._appointmentForm) {
            this._appointmentForm.form?.dispose();
        }
        this._appointmentForm = this.createAppointmentForm();

        this._appointmentPopup?.dispose();
        this._appointmentPopup = this.createAppointmentPopup(this._appointmentForm);
    }

    _renderMainContainer() {
        this._mainContainer = $('<div>').addClass('dx-scheduler-container');

        this.$element().append(this._mainContainer);
    }

    createAppointmentForm() {
        const scheduler = {
            createResourceEditorModel: () => {
                return createResourceEditorModel(this.option('resources'), this.option('loadedResources'));
            },
            getDataAccessors: () => this._dataAccessors,
            createComponent: (element, component, options) => this._createComponent(element, component, options),

            getEditingConfig: () => this._editing,

            getFirstDayOfWeek: () => this.option('firstDayOfWeek'),
            getStartDayHour: () => this.option('startDayHour'),
            getCalculatedEndDate: (startDateWithStartHour) => this._workSpace.calculateEndDate(startDateWithStartHour),
            getTimeZoneCalculator: () => this.timeZoneCalculator,
        };

        return new AppointmentForm(scheduler);
    }

    createAppointmentPopup(form) {
        const scheduler = {
            getElement: () => this.$element(),
            createComponent: (element, component, options) => this._createComponent(element, component, options),
            focus: () => this.focus(),

            getResources: () => {
                return this.option('resources');
            },

            getEditingConfig: () => this._editing,

            getTimeZoneCalculator: () => this.timeZoneCalculator,
            getDataAccessors: () => this._dataAccessors,
            getAppointmentFormOpening: () => this._actions['onAppointmentFormOpening'],
            processActionResult: (arg, canceled) => this._processActionResult(arg, canceled),

            addAppointment: (appointment) => this.addAppointment(appointment),
            updateAppointment: (sourceAppointment, updatedAppointment) => this.updateAppointment(sourceAppointment, updatedAppointment),

            updateScrollPosition: (startDate, resourceItem, inAllDayRow) => {
                this._workSpace.updateScrollPosition(startDate, resourceItem, inAllDayRow);
            }
        };

        return new AppointmentPopup(scheduler, form);
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

            createFormattedDateText: (appointment, targetedAppointment, format) => this.fire('getTextAndFormatDate', appointment, targetedAppointment, format),
            getAppointmentDisabled: (appointment) => createAppointmentAdapter(
                appointment,
                this._dataAccessors,
                this.timeZoneCalculator
            ).disabled
        };
    }

    checkAndDeleteAppointment(appointment, targetedAppointment) {
        const targetedAdapter = createAppointmentAdapter(
            targetedAppointment,
            this._dataAccessors,
            this.timeZoneCalculator
        );

        const deletingOptions = this.fireOnAppointmentDeleting(appointment, targetedAdapter);
        this._checkRecurringAppointment(
            appointment,
            targetedAppointment,
            targetedAdapter.startDate,
            () => {
                this.processDeleteAppointment(appointment, deletingOptions);
            },
            true
        );
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

        this.createAppointmentDataProvider();

        this._filterAppointmentsByDate();
    }

    _isDataSourceLoaded() { // TODO
        return this._dataSource && this._dataSource.isLoaded();
    }

    _render() {
        // NOTE: remove small class applying after adaptivity implementation
        this._toggleSmallClass();

        this._toggleAdaptiveClass();

        this.getWorkSpace()?.updateHeaderEmptyCellWidth();

        super._render();
    }

    _renderHeader() {
        if(this.option('toolbar').length !== 0) {
            const $header = $('<div>').appendTo(this._mainContainer);
            this._header = this._createComponent($header, SchedulerHeader, this._headerConfig());
        }
    }

    _headerConfig() {
        const currentViewOptions = this._getCurrentViewOptions();
        const countConfig = this._getViewCountConfig();

        const result = extend({
            firstDayOfWeek: this.getFirstDayOfWeek(),
            currentView: this.option('currentView'),
            isAdaptive: this.option('adaptivityEnabled'),
            tabIndex: this.option('tabIndex'),
            focusStateEnabled: this.option('focusStateEnabled'),
            rtlEnabled: this.option('rtlEnabled'),
            useDropDownViewSwitcher: this.option('useDropDownViewSwitcher'),
            customizeDateNavigatorText: this.option('customizeDateNavigatorText'),
            agendaDuration: currentViewOptions['agendaDuration'] || DEFAULT_AGENDA_DURATION
        }, currentViewOptions);

        result.intervalCount = countConfig.intervalCount;
        result.views = this.option('views');
        result.min = new Date(this._dateOption('min'));
        result.max = new Date(this._dateOption('max'));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption('currentDate')));
        result.onCurrentViewChange = (name) => {
            this.option('currentView', name);
        },
        result.onCurrentDateChange = (date) => {
            this.option('currentDate', date);
        };
        result.items = this.option('toolbar');
        result.startViewDate = this.getStartViewDate();

        result.todayDate = () => {
            const result = this.timeZoneCalculator.createDate(new Date(), { path: 'toGrid' });
            return result;
        };

        return result;
    }

    _appointmentsConfig() {
        const config = {
            getResources: () => this.option('resources'),
            getResourceDataAccessors: this.getResourceDataAccessors.bind(this),
            getAgendaResourceProcessor: () => this.agendaResourceProcessor,
            getAppointmentColor: this.createGetAppointmentColor(),

            getAppointmentDataProvider: () => this.appointmentDataProvider,
            dataAccessors: this._dataAccessors,
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
            currentView: this.currentView,
            groups: this._getCurrentViewOption('groups'),
            isRenovatedAppointments: this.option('isRenovatedAppointments'),
            timeZoneCalculator: this.timeZoneCalculator,
            getResizableStep: () => this._workSpace ? this._workSpace.positionHelper.getResizableStep() : 0,
            getDOMElementsMetaData: () => this._workSpace?.getDOMElementsMetaData(),
            getViewDataProvider: () => this._workSpace?.viewDataProvider,
            isVerticalViewDirection: () => this.getRenderingStrategyInstance().getDirection() === 'vertical',
            isVerticalGroupedWorkSpace: () => this._workSpace._isVerticalGroupedWorkSpace(),
            isDateAndTimeView: () => isDateAndTimeView(this._workSpace.type),
            onContentReady: () => {
                this._workSpace?.option('allDayExpanded', this._isAllDayExpanded());
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

    _validateCellDuration() {
        const endDayHour = this._getCurrentViewOption('endDayHour');
        const startDayHour = this._getCurrentViewOption('startDayHour');
        const cellDuration = this._getCurrentViewOption('cellDuration');

        if((endDayHour - startDayHour) * MINUTES_IN_HOUR % cellDuration !== 0) {
            errors.log('W1015');
        }
    }

    _getCurrentViewType() { // TODO get rid of mapping
        return this.currentViewType;
    }

    _renderWorkSpace(groups) {
        this._readyToRenderAppointments && this._toggleSmallClass();
        const $workSpace = $('<div>').appendTo(this._mainContainer);

        const countConfig = this._getViewCountConfig();

        const workSpaceComponent = VIEWS_CONFIG[this._getCurrentViewType()].workSpace;
        const workSpaceConfig = this._workSpaceConfig(groups, countConfig);
        this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);

        this._allowDragging() && this._workSpace.initDragBehavior(this, this._all);
        this._workSpace._attachTablesEvents();
        this._workSpace.getWorkArea().append(this._appointments.$element());

        this._recalculateWorkspace();
        countConfig.startDate && this._header?.option('currentDate', this._workSpace._getHeaderDate());

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
        const isVirtualScrolling = scrolling.mode === 'virtual' ||
            currentViewOptions.scrolling?.mode === 'virtual';
        const horizontalVirtualScrollingAllowed = isVirtualScrolling &&
            (
                !isDefined(scrolling.orientation) ||
                ['horizontal', 'both'].filter(
                    item => scrolling.orientation === item || currentViewOptions.scrolling?.orientation === item
                ).length > 0
            );
        const crossScrollingEnabled = this.option('crossScrollingEnabled')
            || horizontalVirtualScrollingAllowed
            || isTimelineView(this.currentViewType);

        const result = extend({
            resources: this.option('resources'),
            loadedResources: this.option('loadedResources'),
            getFilteredItems: () => this.filteredItems,
            getResourceDataAccessors: this.getResourceDataAccessors.bind(this),

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
            crossScrollingEnabled,
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
            scrolling,
            draggingMode: this.option('_draggingMode'),
            timeZoneCalculator: this.timeZoneCalculator,
            schedulerHeight: this.option('height'),
            schedulerWidth: this.option('width'),
            allDayPanelMode: this.option('allDayPanelMode'),
            onSelectedCellsClick: this.showAddAppointmentPopup.bind(this),
            onRenderAppointments: this._renderAppointments.bind(this),
            onShowAllDayPanel: (value) => this.option('showAllDayPanel', value),
            getHeaderHeight: () => utils.DOM.getHeaderHeight(this._header),
            onScrollEnd: () => this._appointments.updateResizableArea(),

            // TODO: SSR does not work correctly with renovated render
            renovateRender: this._isRenovatedRender(isVirtualScrolling),
            isRenovatedAppointments: this.option('isRenovatedAppointments'),
        }, currentViewOptions);

        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.startDate = countConfig.startDate;
        result.groups = groups;
        result.onCellClick = this._createActionByOption('onCellClick');
        result.onCellContextMenu = this._createActionByOption('onCellContextMenu');
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption('currentDate')));
        result.hoursInterval = result.cellDuration / 60;
        result.allDayExpanded = false;
        result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
        result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
        result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
        result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;
        result.getAppointmentDataProvider = () => this.appointmentDataProvider;

        return result;
    }

    _isRenovatedRender(isVirtualScrolling) {
        return (this.option('renovateRender') && hasWindow()) || isVirtualScrolling;
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
        return this.currentView;
    }

    _getCurrentViewOption(optionName) {
        if(this.currentView && this.currentView[optionName] !== undefined) {
            return this.currentView[optionName];
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

    getWorkSpaceScrollableContainer() {
        return this._workSpace.getScrollableContainer();
    }

    getWorkSpace() {
        return this._workSpace;
    }

    getHeader() {
        return this._header;
    }

    _cleanPopup() {
        this._appointmentPopup?.dispose();
    }

    _checkRecurringAppointment(rawAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing, dragEvent, recurrenceEditMode) {
        const recurrenceRule = ExpressionUtils.getField(this._dataAccessors, 'recurrenceRule', rawAppointment);

        if(!getRecurrenceProcessor().evalRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
            callback();
            return;
        }

        const editMode = recurrenceEditMode || this.option('recurrenceEditMode');
        switch(editMode) {
            case 'series':
                callback();
                break;
            case 'occurrence':
                this._excludeAppointmentFromSeries(rawAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
                break;
            default:
                if(dragEvent) {
                    dragEvent.cancel = new Deferred();
                }
                this._showRecurrenceChangeConfirm(isDeleted)
                    .done((editingMode) => {
                        editingMode === RECURRENCE_EDITING_MODE.SERIES && callback();

                        editingMode === RECURRENCE_EDITING_MODE.OCCURENCE && this._excludeAppointmentFromSeries(
                            rawAppointment, singleAppointment, exceptionDate,
                            isDeleted, isPopupEditing, dragEvent,
                        );
                    })
                    .fail(() => this._appointments.moveAppointmentBack(dragEvent));
        }
    }

    _excludeAppointmentFromSeries(rawAppointment, newRawAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
        const appointment = excludeFromRecurrence(
            rawAppointment,
            exceptionDate,
            this._dataAccessors,
            this._timeZoneCalculator,
        );

        const singleRawAppointment = { ...newRawAppointment };
        delete singleRawAppointment[this._dataAccessors.expr.recurrenceExceptionExpr];
        delete singleRawAppointment[this._dataAccessors.expr.recurrenceRuleExpr];

        const keyPropertyName = this.appointmentDataProvider.keyName;
        delete singleRawAppointment[keyPropertyName];

        const canCreateNewAppointment = !isDeleted && !isPopupEditing;
        if(canCreateNewAppointment) {
            this.addAppointment(singleRawAppointment);
        }

        if(isPopupEditing) {
            this._appointmentPopup.show(singleRawAppointment, {
                isToolbarVisible: true,
                action: ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES,
                excludeInfo: {
                    sourceAppointment: rawAppointment,
                    updatedAppointment: appointment.source()
                }
            });
            this._editAppointmentData = rawAppointment;
        } else {
            this._updateAppointment(rawAppointment, appointment.source(), () => {
                this._appointments.moveAppointmentBack(dragEvent);
            }, dragEvent);
        }
    }

    _createRecurrenceException(appointment, exceptionDate) {
        const result = [];

        if(appointment.recurrenceException) {
            result.push(appointment.recurrenceException);
        }
        result.push(this._getSerializedDate(exceptionDate, appointment.startDate, appointment.allDay));

        return result.join();
    }

    _getSerializedDate(date, startDate, isAllDay) {
        isAllDay && date.setHours(startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
            startDate.getMilliseconds());

        return dateSerialization.serializeDate(date, UTC_FULL_DATE_FORMAT);
    }

    _showRecurrenceChangeConfirm(isDeleted) {
        const message = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteMessage' : 'dxScheduler-confirmRecurrenceEditMessage');
        const seriesText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteSeries' : 'dxScheduler-confirmRecurrenceEditSeries');
        const occurrenceText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteOccurrence' : 'dxScheduler-confirmRecurrenceEditOccurrence');

        this._recurrenceDialog = customDialog({
            messageHtml: message,
            showCloseButton: true,
            showTitle: true,
            buttons: [
                { text: seriesText, onClick: function() { return RECURRENCE_EDITING_MODE.SERIES; } },
                { text: occurrenceText, onClick: function() { return RECURRENCE_EDITING_MODE.OCCURENCE; } }
            ],
            popupOptions: {
                wrapperAttr: { class: 'dx-dialog' }
            }
        });

        return this._recurrenceDialog.show();
    }

    _getUpdatedData(rawAppointment) {
        const getConvertedFromGrid = date => date
            ? this.timeZoneCalculator.createDate(date, { path: 'fromGrid' })
            : undefined;

        const isValidDate = date => !isNaN(new Date(date).getTime());

        const targetCell = this.getTargetCellData();
        const appointment = createAppointmentAdapter(
            rawAppointment,
            this._dataAccessors,
            this.timeZoneCalculator
        );

        const cellStartDate = getConvertedFromGrid(targetCell.startDate);
        const cellEndDate = getConvertedFromGrid(targetCell.endDate);

        let appointmentStartDate = new Date(appointment.startDate);
        let appointmentEndDate = new Date(appointment.endDate);
        let resultedStartDate = cellStartDate || appointmentStartDate;

        if(!isValidDate(appointmentStartDate)) {
            appointmentStartDate = resultedStartDate;
        }

        if(!isValidDate(appointmentEndDate)) {
            appointmentEndDate = cellEndDate;
        }

        const duration = appointmentEndDate.getTime() - appointmentStartDate.getTime();

        const isKeepAppointmentHours = this._workSpace.keepOriginalHours()
            && isValidDate(appointment.startDate)
            && isValidDate(cellStartDate);

        if(isKeepAppointmentHours) {
            const { trimTime } = dateUtils;

            const startDate = this.timeZoneCalculator.createDate(appointment.startDate, { path: 'toGrid' });
            const timeInMs = startDate.getTime() - trimTime(startDate).getTime();

            resultedStartDate = new Date(trimTime(targetCell.startDate).getTime() + timeInMs);
            resultedStartDate = this.timeZoneCalculator.createDate(resultedStartDate, { path: 'fromGrid' });
        }

        const result = createAppointmentAdapter(
            {},
            this._dataAccessors,
            this.timeZoneCalculator
        );

        if(targetCell.allDay !== undefined) {
            result.allDay = targetCell.allDay;
        }
        result.startDate = resultedStartDate;

        let resultedEndDate = new Date(resultedStartDate.getTime() + duration);

        if(this.appointmentTakesAllDay(rawAppointment) && !result.allDay && this._workSpace.supportAllDayRow()) {
            resultedEndDate = this._workSpace.calculateEndDate(resultedStartDate);
        }

        if(appointment.allDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
            const dateCopy = new Date(resultedStartDate);
            dateCopy.setHours(0);

            resultedEndDate = new Date(dateCopy.getTime() + duration);

            if(resultedEndDate.getHours() !== 0) {
                resultedEndDate.setHours(this._getCurrentViewOption('endDayHour'));
            }
        }

        const timeZoneOffset = timeZoneUtils.getTimezoneOffsetChangeInMs(appointmentStartDate, appointmentEndDate, resultedStartDate, resultedEndDate);
        result.endDate = new Date(resultedEndDate.getTime() - timeZoneOffset);

        const rawResult = result.source();

        setResourceToAppointment(this.option('resources'), this.getResourceDataAccessors(), rawResult, targetCell.groups);

        return rawResult;
    }

    getTargetedAppointment(appointment, element) {
        const settings = utils.dataAccessors.getAppointmentSettings(element);
        const info = utils.dataAccessors.getAppointmentInfo(element);

        const appointmentIndex = $(element).data(this._appointments._itemIndexKey());

        const adapter = createAppointmentAdapter(
            appointment,
            this._dataAccessors,
            this.timeZoneCalculator
        );

        const targetedAdapter = adapter.clone();

        if(this._isAgenda() && adapter.isRecurrent) {
            const agendaSettings = settings.agendaSettings;

            targetedAdapter.startDate = ExpressionUtils.getField(this._dataAccessors, 'startDate', agendaSettings);
            targetedAdapter.endDate = ExpressionUtils.getField(this._dataAccessors, 'endDate', agendaSettings);

        } else if(settings) {
            targetedAdapter.startDate = info ? info.sourceAppointment.startDate : adapter.startDate; // TODO: in agenda we havn't info field
            targetedAdapter.endDate = info ? info.sourceAppointment.endDate : adapter.endDate;
        }

        const rawTargetedAppointment = targetedAdapter.source();
        if(element) {
            this.setTargetedAppointmentResources(rawTargetedAppointment, element, appointmentIndex);
        }

        if(info) {
            rawTargetedAppointment.displayStartDate = new Date(info.appointment.startDate);
            rawTargetedAppointment.displayEndDate = new Date(info.appointment.endDate);
        }

        return rawTargetedAppointment;
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

    _updateAppointment(target, rawAppointment, onUpdatePrevented, dragEvent) {
        const updatingOptions = {
            newData: rawAppointment,
            oldData: extend({}, target),
            cancel: false
        };

        const performFailAction = function(err) {
            if(onUpdatePrevented) {
                onUpdatePrevented.call(this);
            }

            if(err && err.name === 'Error') {
                throw err;
            }
        }.bind(this);

        this._actions[StoreEventNames.UPDATING](updatingOptions);

        if(dragEvent && !isDeferred(dragEvent.cancel)) {
            dragEvent.cancel = new Deferred();
        }

        return this._processActionResult(updatingOptions, function(canceled) {
            let deferred = new Deferred();

            if(!canceled) {
                this._expandAllDayPanel(rawAppointment);

                try {
                    deferred = this.appointmentDataProvider
                        .update(target, rawAppointment)
                        .done(() => {
                            dragEvent && dragEvent.cancel.resolve(false);
                        })
                        .always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.UPDATED, storeAppointment))
                        .fail(() => performFailAction());
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
        if(!this._isAllDayExpanded() && this.appointmentTakesAllDay(appointment)) {
            this._workSpace.option('allDayExpanded', true);
        }
    }

    _onDataPromiseCompleted(handlerName, storeAppointment, appointment) {
        const args = { appointmentData: appointment || storeAppointment };

        if(storeAppointment instanceof Error) {
            args.error = storeAppointment;
        } else {
            this._appointmentPopup.visible && this._appointmentPopup.hide();
        }

        this._actions[handlerName](args);
        this._fireContentReadyAction();
    }

    ///#DEBUG
    getAppointmentDetailsForm() { // TODO for tests
        return this._appointmentForm.form;
    }
    ///#ENDDEBUG

    getAppointmentsInstance() {
        return this._appointments;
    }

    getLayoutManager() {
        return this._layoutManager;
    }

    getRenderingStrategyInstance() {
        return this.getLayoutManager().getRenderingStrategyInstance();
    }

    getActions() {
        return this._actions;
    }

    appointmentTakesAllDay(rawAppointment) {
        const appointment = createAppointmentAdapter(
            rawAppointment,
            this._dataAccessors,
            this.timeZoneCalculator
        );

        return getAppointmentTakesAllDay(
            appointment,
            this._getCurrentViewOption('startDayHour'),
            this._getCurrentViewOption('endDayHour'),
            this._getCurrentViewOption('allDayPanelMode'),
        );
    }

    dayHasAppointment(day, rawAppointment, trimTime) {
        const getConvertedToTimeZone = date => {
            return this.timeZoneCalculator.createDate(date, { path: 'toGrid' });
        };

        const appointment = createAppointmentAdapter(
            rawAppointment,
            this._dataAccessors,
            this.timeZoneCalculator
        );

        let startDate = new Date(appointment.startDate);
        let endDate = new Date(appointment.endDate);

        startDate = getConvertedToTimeZone(startDate);
        endDate = getConvertedToTimeZone(endDate);

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


        return startDateTimeStamp <= dayTimeStamp && dayTimeStamp <= endDateTimeStamp;
    }

    setTargetedAppointmentResources(rawAppointment, element, appointmentIndex) {
        const groups = this._getCurrentViewOption('groups');

        if(groups?.length) {
            const resourcesSetter = this.getResourceDataAccessors().setter;
            const workSpace = this._workSpace;
            let getGroups;
            let setResourceCallback;

            if(this._isAgenda()) {
                getGroups = function() {
                    const apptSettings = this.getLayoutManager()._positionMap[appointmentIndex];

                    return getCellGroups(
                        apptSettings[0].groupIndex,
                        this.getWorkSpace().option('groups')
                    );
                };

                setResourceCallback = function(_, group) {
                    resourcesSetter[group.name](rawAppointment, group.id);
                };
            } else {
                getGroups = function() {
                    // TODO: in the future, necessary refactor the engine of determining groups
                    const setting = utils.dataAccessors.getAppointmentSettings(element) || {};
                    return workSpace.getCellDataByCoordinates({ left: setting.left, top: setting.top }).groups;
                };

                setResourceCallback = function(field, value) {
                    resourcesSetter[field](rawAppointment, value);
                };
            }

            each(getGroups.call(this), setResourceCallback);
        }
    }

    getStartViewDate() {
        return this._workSpace?.getStartViewDate();
    }

    getEndViewDate() {
        return this._workSpace.getEndViewDate();
    }

    showAddAppointmentPopup(cellData, cellGroups) {
        const appointmentAdapter = createAppointmentAdapter(
            {},
            this._dataAccessors,
            this.timeZoneCalculator
        );

        appointmentAdapter.allDay = cellData.allDay;
        appointmentAdapter.startDate = this.timeZoneCalculator.createDate(cellData.startDate, { path: 'fromGrid' });
        appointmentAdapter.endDate = this.timeZoneCalculator.createDate(cellData.endDate, { path: 'fromGrid' });

        const resultAppointment = extend(appointmentAdapter.source(), cellGroups);
        this.showAppointmentPopup(resultAppointment, true);
    }

    showAppointmentPopup(rawAppointment, createNewAppointment, rawTargetedAppointment) {
        const newRawTargetedAppointment = { ...rawTargetedAppointment };
        if(newRawTargetedAppointment) {
            delete newRawTargetedAppointment.displayStartDate;
            delete newRawTargetedAppointment.displayEndDate;
        }

        const appointment = createAppointmentAdapter(
            (newRawTargetedAppointment || rawAppointment),
            this._dataAccessors,
            this.timeZoneCalculator
        );

        const newTargetedAppointment = extend({}, rawAppointment, newRawTargetedAppointment);

        const isCreateAppointment = createNewAppointment ?? isEmptyObject(rawAppointment);

        if(isEmptyObject(rawAppointment)) {
            rawAppointment = this.createPopupAppointment();
        }

        if(isCreateAppointment) {
            delete this._editAppointmentData; // TODO
            this._editing.allowAdding && this._appointmentPopup.show(rawAppointment, {
                isToolbarVisible: true,
                action: ACTION_TO_APPOINTMENT.CREATE
            });
        } else {
            this._checkRecurringAppointment(rawAppointment, newTargetedAppointment, appointment.startDate, () => {
                this._editAppointmentData = rawAppointment; // TODO

                this._appointmentPopup.show(rawAppointment, {
                    isToolbarVisible: this._editing.allowUpdating,
                    action: ACTION_TO_APPOINTMENT.UPDATE,
                });
            }, false, true);
        }
    }

    createPopupAppointment() {
        const result = {};
        const toMs = dateUtils.dateToMilliseconds;

        const startDate = new Date(this.option('currentDate'));
        const endDate = new Date(startDate.getTime() + this.option('cellDuration') * toMs('minute'));

        ExpressionUtils.setField(this._dataAccessors, 'startDate', result, startDate);
        ExpressionUtils.setField(this._dataAccessors, 'endDate', result, endDate);

        return result;
    }

    hideAppointmentPopup(saveChanges) {
        if(this._appointmentPopup?.visible) {
            saveChanges && this._appointmentPopup.saveChangesAsync();
            this._appointmentPopup.hide();
        }
    }

    showAppointmentTooltip(appointment, element, targetedAppointment) {
        if(appointment) {
            const settings = utils.dataAccessors.getAppointmentSettings(element);

            const appointmentConfig = {
                itemData: targetedAppointment || appointment,
                groupIndex: settings?.groupIndex,
                groups: this.option('groups')
            };

            const getAppointmentColor = this.createGetAppointmentColor();
            const deferredColor = getAppointmentColor(appointmentConfig);

            const info = new AppointmentTooltipInfo(appointment, targetedAppointment, deferredColor);
            this.showAppointmentTooltipCore(element, [info]);
        }
    }

    createGetAppointmentColor() {
        return (appointmentConfig) => {
            const resourceConfig = {
                resources: this.option('resources'),
                dataAccessors: this.getResourceDataAccessors(),
                loadedResources: this.option('loadedResources'),
                resourceLoaderMap: this.option('resourceLoaderMap')
            };

            return getAppointmentColor(resourceConfig, appointmentConfig);
        };
    }

    showAppointmentTooltipCore(target, data, options) {
        const arg = {
            cancel: false,
            appointments: data.map(item => {
                const result = {
                    appointmentData: item.appointment,
                    currentAppointmentData: { ...item.targetedAppointment },
                    color: item.color
                };

                if(item.settings.info) {
                    const { startDate, endDate } = item.settings.info.appointment;

                    result.currentAppointmentData.displayStartDate = startDate;
                    result.currentAppointmentData.displayEndDate = endDate;
                }

                return result;
            }),
            targetElement: target
        };

        this._createActionByOption('onAppointmentTooltipShowing')(arg);

        if(this._appointmentTooltip.isAlreadyShown(target)) {
            this.hideAppointmentTooltip();
        } else {
            this._processActionResult(arg, canceled => {
                !canceled && this._appointmentTooltip.show(
                    target, data, { ...this._getExtraAppointmentTooltipOptions(), ...options }
                );
            });
        }
    }

    hideAppointmentTooltip() {
        this._appointmentTooltip && this._appointmentTooltip.hide();
    }

    scrollToTime(hours, minutes, date) {
        errors.log('W0002', 'dxScheduler', 'scrollToTime', '21.1', 'Use the "scrollTo" method instead');
        this._workSpace.scrollToTime(hours, minutes, date);
    }

    scrollTo(date, groups, allDay) {
        this._workSpace.scrollTo(date, groups, allDay);
    }

    _isHorizontalVirtualScrolling() {
        const scrolling = this.option('scrolling');
        const { orientation, mode } = scrolling;
        const isVirtualScrolling = mode === 'virtual';

        return isVirtualScrolling &&
            (orientation === 'horizontal' || orientation === 'both');
    }

    addAppointment(rawAppointment) {
        const appointment = createAppointmentAdapter(
            rawAppointment,
            this._dataAccessors,
            this.timeZoneCalculator
        );
        appointment.text = appointment.text || '';

        const serializedAppointment = appointment.source(true);

        const addingOptions = {
            appointmentData: serializedAppointment,
            cancel: false
        };

        this._actions[StoreEventNames.ADDING](addingOptions);

        return this._processActionResult(addingOptions, canceled => {
            if(canceled) {
                return new Deferred().resolve();
            }

            this._expandAllDayPanel(serializedAppointment);

            return this.appointmentDataProvider
                .add(serializedAppointment)
                .always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment));
        });
    }

    updateAppointment(target, appointment) {
        return this._updateAppointment(target, appointment);
    }

    deleteAppointment(rawAppointment) {
        const deletingOptions = this.fireOnAppointmentDeleting(rawAppointment);
        this.processDeleteAppointment(rawAppointment, deletingOptions);
    }

    fireOnAppointmentDeleting(rawAppointment, targetedAppointmentData) {
        const deletingOptions = {
            appointmentData: rawAppointment,
            targetedAppointmentData,
            cancel: false
        };

        this._actions[StoreEventNames.DELETING](deletingOptions);

        return deletingOptions;
    }

    processDeleteAppointment(rawAppointment, deletingOptions) {
        this._processActionResult(deletingOptions, function(canceled) {
            if(!canceled) {
                this.appointmentDataProvider
                    .remove(rawAppointment)
                    .always(storeAppointment => this._onDataPromiseCompleted(
                        StoreEventNames.DELETED,
                        storeAppointment,
                        rawAppointment,
                    ));
            }
        });
    }

    deleteRecurrence(
        appointment,
        date,
        recurrenceEditMode,
    ) {
        this._checkRecurringAppointment(
            appointment,
            { },
            date,
            () => {
                this.processDeleteAppointment(
                    appointment,
                    { cancel: false },
                );
            },
            true,
            false,
            null,
            recurrenceEditMode,
        );
    }

    focus() {
        if(this._editAppointmentData) {
            this._appointments.focus();
        } else {
            this._workSpace.focus();
        }
    }

    getFirstDayOfWeek() {
        return isDefined(this.option('firstDayOfWeek'))
            ? this.option('firstDayOfWeek')
            : dateLocalization.firstDayOfWeekIndex();
    }

    _validateDayHours() {
        const startDayHour = this._getCurrentViewOption('startDayHour');
        const endDayHour = this._getCurrentViewOption('endDayHour');

        validateDayHours(startDayHour, endDayHour);
    }

    _getDragBehavior() {
        return this._workSpace.dragBehavior;
    }

    /**
        * @name dxScheduler.registerKeyHandler
        * @publicName registerKeyHandler(key, handler)
        * @hidden
        */
}

Scheduler.include(DataHelperMixin);

registerComponent('dxScheduler', Scheduler);

export default Scheduler;
