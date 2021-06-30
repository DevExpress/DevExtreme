import registerComponent from '../../core/component_registrator';
import config from '../../core/config';
import devices from '../../core/devices';
import $ from '../../core/renderer';
import { BindableTemplate } from '../../core/templates/bindable_template';
import { EmptyTemplate } from '../../core/templates/empty_template';
import { inArray } from '../../core/utils/array';
import Callbacks from '../../core/utils/callbacks';
import { noop } from '../../core/utils/common';
import { compileGetter, compileSetter } from '../../core/utils/data';
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
import { AppointmentPopup, ACTION_TO_APPOINTMENT } from './appointmentPopup/popup';
import { CompactAppointmentsHelper } from './compactAppointmentsHelper';
import { DesktopTooltipStrategy } from './tooltip_strategies/desktopTooltipStrategy';
import { MobileTooltipStrategy } from './tooltip_strategies/mobileTooltipStrategy';
import { hide as hideLoading, show as showLoading } from './loading';
import AppointmentCollection from './appointments/appointmentCollection';
import AppointmentLayoutManager from './appointments.layout_manager';
import { Header } from './header/header';
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
import { AppointmentSettingsGenerator } from './appointments/settingsGenerator';
import { utils } from './utils';
import {
    createFactoryInstances,
    disposeFactoryInstances,
    getResourceManager,
    getAppointmentDataProvider,
    getTimeZoneCalculator
} from './instanceFactory';
import { getCellGroups } from './resources/utils';
import { ExpressionUtils } from './expressionUtils';

// STYLE scheduler
const MINUTES_IN_HOUR = 60;

const WIDGET_CLASS = 'dx-scheduler';
const WIDGET_SMALL_CLASS = `${WIDGET_CLASS}-small`;
const WIDGET_ADAPTIVE_CLASS = `${WIDGET_CLASS}-adaptive`;
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
                * @type_function_param3 contentElement:DxElement
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
                * @type_function_param3 contentElement:DxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo DateCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:DxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo DataCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:DxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo TimeCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:DxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo ResourceCellTemplate
                * @type template|function
                * @default null
                * @type_function_param1 itemData:object
                * @type_function_param2 itemIndex:number
                * @type_function_param3 itemElement:DxElement
                * @type_function_return string|Element|jQuery
                */

            /**
                * @pseudo AppointmentCollectorTemplate
                * @type template|function
                * @default "appointmentCollector"
                * @type_function_param1 data:object
                * @type_function_param1_field1 appointmentCount:number
                * @type_function_param1_field2 isCompact:boolean
                * @type_function_param2 collectorElement:DxElement
                * @type_function_return string|Element|jQuery
                */

            views: ['day', 'week'],
            currentView: 'day', // TODO: should we calculate currentView if views array contains only one item, for example 'month'?
            currentDate: dateUtils.trimTime(new Date()),
            min: undefined,
            max: undefined,
            dateSerializationFormat: undefined,
            firstDayOfWeek: undefined,

            groups: [],

            resources: [],

            dataSource: null,

            customizeDateNavigatorText: undefined,

            appointmentTemplate: 'item',

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

            renovateRender: true,

            _draggingMode: 'outlook',

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
        });

        return extend(true, defaultOptions, {
            integrationOptions: {
                useDeferUpdateForTemplates: false
            }
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

    _getAppointmentSettingsGenerator() {
        return new AppointmentSettingsGenerator(this);
    }

    _postponeDataSourceLoading(promise) {
        this.postponedOperations.add('_reloadDataSource', this._reloadDataSource.bind(this), promise);
    }

    _postponeResourceLoading() {
        const whenLoaded = this.postponedOperations.add('loadResources', () => {
            const groups = this._getCurrentViewOption('groups');
            return getResourceManager(this.key).loadResources(groups);
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

                getAppointmentDataProvider(this.key).setDataSource(this._dataSource);

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

                this.updateFactoryInstances();

                this._postponeResourceLoading().done((resources) => {
                    this._appointments.option('items', []);
                    this._refreshWorkSpace(resources);
                    this._filterAppointmentsByDate();
                });
                break;
            case 'startDayHour':
            case 'endDayHour':
                this.fire('validateDayHours');

                this.updateFactoryInstances();

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
                this.updateFactoryInstances();

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
                this.updateFactoryInstances();
                this.repaint();
                break;
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
            case 'disabledExpr':
                this._updateExpression(name, value);

                getAppointmentDataProvider(this.key).updateDataAccessors(
                    utils.dataAccessors.combine(this.key, this._dataAccessors)
                );

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
            case 'renovateRender':
                this._updateOption('workSpace', name, value);
                break;
            case '_draggingMode':
                this._workSpace.option('draggingMode', value);
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
        return this.option('showAllDayPanel') && getAppointmentDataProvider(this.key).hasAllDayAppointments(items);
    }

    _getTimezoneOffsetByOption(date) {
        return timeZoneUtils.calculateTimezoneByValue(this.option('timeZone'), date);
    }

    _filterAppointmentsByDate() {
        const dateRange = this._workSpace.getDateRange();
        const timeZoneCalculator = getTimeZoneCalculator(this.key);

        const startDate = timeZoneCalculator.createDate(dateRange[0], { path: 'fromGrid' });
        const endDate = timeZoneCalculator.createDate(dateRange[1], { path: 'fromGrid' });

        getAppointmentDataProvider(this.key).filterByDate(startDate, endDate, this.option('remoteFiltering'), this.option('dateSerializationFormat'));
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
        const { filteredItems } = getAppointmentDataProvider(this.key);

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
            recurrenceException: this.option('recurrenceExceptionExpr'),
            disabled: this.option('disabledExpr')
        });

        super._init();

        this._initDataSource();

        this.$element().addClass(WIDGET_CLASS);

        this._initEditing();

        this.updateFactoryInstances();

        this._initActions();

        this._compactAppointmentsHelper = new CompactAppointmentsHelper(this);

        this._asyncTemplatesTimers = [];

        this._dataSourceLoadedCallback = Callbacks();

        this._subscribes = subscribes;
    }

    updateFactoryInstances() {
        const model = this._options._optionManager._options;
        this.key = createFactoryInstances({
            key: this.key,
            scheduler: this,
            model,
            getIsVirtualScrolling: this.isVirtualScrolling.bind(this),
            resources: this.option('resources'),
            dataSource: this._dataSource,
            startDayHour: this._getCurrentViewOption('startDayHour'),
            endDayHour: this._getCurrentViewOption('endDayHour'),
            appointmentDuration: this._getCurrentViewOption('cellDuration'),
            firstDayOfWeek: this.getFirstDayOfWeek(),
            showAllDayPanel: this.option('showAllDayPanel'),
            timeZone: this.option('timeZone'),
            getDataAccessors: function(key) {
                return utils.dataAccessors.combine(key, this._dataAccessors);
            }.bind(this),
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

    _dataSourceChangedHandler(result) {
        if(this._readyToRenderAppointments) {
            this._workSpaceRecalculation.done((function() {

                this._renderAppointments();

                const { filteredItems } = getAppointmentDataProvider(this.key);

                this.getWorkSpace().onDataSourceChanged(filteredItems);

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
        getAppointmentDataProvider(this.key).filter();
    }

    _renderAppointments() {
        const workspace = this.getWorkSpace();

        this._filterAppointments();

        const { filteredItems } = getAppointmentDataProvider(this.key);

        workspace.preRenderAppointments({
            allDayExpanded: this._isAllDayExpanded(filteredItems),
            appointments: filteredItems
        });

        if(filteredItems.length && this._isVisible()) {
            this._appointments.option('items', this._getAppointmentsToRepaint());
            getAppointmentDataProvider(this.key).cleanState();
        } else {
            this._appointments.option('items', []);
        }
    }

    _getAppointmentsToRepaint() {
        const { filteredItems } = getAppointmentDataProvider(this.key);

        const appointments = this._layoutManager.createAppointmentsMap(filteredItems);
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
        this._recurrenceDialog?.hide(RECURRENCE_EDITING_MODE.CANCEL);

        this.hideAppointmentPopup();
        this.hideAppointmentTooltip();

        this._asyncTemplatesTimers.forEach(clearTimeout);
        this._asyncTemplatesTimers = [];

        super._dispose();

        disposeFactoryInstances(this.key);
    }

    _initActions() {

        this._actions = {
            'onAppointmentAdding': this._createActionByOption(StoreEventNames.ADDING),
            'onAppointmentAdded': this._createActionByOption(StoreEventNames.ADDED),
            'onAppointmentUpdating': this._createActionByOption(StoreEventNames.UPDATING),
            'onAppointmentUpdated': this._createActionByOption(StoreEventNames.UPDATED),
            'onAppointmentDeleting': this._createActionByOption(StoreEventNames.DELETING),
            'onAppointmentDeleted': this._createActionByOption(StoreEventNames.DELETED),
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

        this._layoutManager = new AppointmentLayoutManager(this, this._getAppointmentsRenderingStrategy());

        this._appointments = this._createComponent('<div>', AppointmentCollection, this._appointmentsConfig());
        this._appointments.option('itemTemplate', this._getAppointmentTemplate('appointmentTemplate'));

        this._appointmentTooltip = new (this.option('adaptivityEnabled')
            ? MobileTooltipStrategy
            : DesktopTooltipStrategy)(this._getAppointmentTooltipOptions());

        this._appointmentPopup = this.createAppointmentPopup();

        if(this._isLoaded() || this._isDataSourceLoading()) {
            this._initMarkupCore(getResourceManager(this.key).loadedResources);
            this._dataSourceChangedHandler(this._dataSource.items());
            this._fireContentReadyAction();
        } else {
            const groups = this._getCurrentViewOption('groups');
            getResourceManager(this.key).loadResources(groups).done((resources) => {
                this._initMarkupCore(resources);
                this._reloadDataSource();
            });
        }
    }

    createAppointmentPopup() {
        const scheduler = {
            getKey: () => this.key,
            getElement: () => this.$element(),
            createComponent: (element, component, options) => this._createComponent(element, component, options),
            focus: () => this.focus(),
            getResourceManager: () => this.fire('getResourceManager'),
            getResources: () => this.option('resources'),

            getEditingConfig: () => this._editing,

            getDataAccessors: () => this._dataAccessors,
            getAppointmentFormOpening: () => this._actions['onAppointmentFormOpening'],
            processActionResult: (arg, canceled) => this._processActionResult(arg, canceled),

            addAppointment: (appointment) => this.addAppointment(appointment),
            updateAppointment: (sourceAppointment, updatedAppointment) => this.updateAppointment(sourceAppointment, updatedAppointment),

            getFirstDayOfWeek: () => this.option('firstDayOfWeek'),
            getStartDayHour: () => this.option('startDayHour'),
            getCalculatedEndDate: (startDateWithStartHour) => this._workSpace.calculateEndDate(startDateWithStartHour),

            updateScrollPosition: (startDate, resourceItem, inAllDayRow) => {
                this._workSpace.updateScrollPosition(startDate, resourceItem, inAllDayRow);
            }
        };

        return new AppointmentPopup(scheduler);
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
            getAppointmentDisabled: (appointment) => createAppointmentAdapter(this.key, appointment).disabled
        };
    }

    checkAndDeleteAppointment(appointment, targetedAppointment) {
        const targetedAdapter = createAppointmentAdapter(this.key, targetedAppointment);

        this._checkRecurringAppointment(appointment, targetedAppointment, targetedAdapter.startDate, () => {
            this.deleteAppointment(appointment);
        }, true);
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
        return getResourceManager(this.key).isLoaded() && this._isDataSourceLoaded();
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
        this._header = this._createComponent($header, Header, this._headerConfig());
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

        result.todayDate = () => {
            const result = getTimeZoneCalculator(this.key).createDate(new Date(), { path: 'toGrid' });
            return result;
        };

        return result;
    }

    _appointmentsConfig() {
        const config = {
            key: this.key,
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
            groups: this._getCurrentViewOption('groups'),
            onContentReady: () => {
                const filteredItems = getAppointmentDataProvider(this.key).filteredItems;
                this._workSpace?.option('allDayExpanded', this._isAllDayExpanded(filteredItems));
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

        this._currentView = null;

        each(views, function(_, view) {
            const isViewIsObject = isObject(view);
            const viewName = isViewIsObject ? view.name : view;
            const viewType = view.type;

            if(currentView === viewName || currentView === viewType) {
                that._currentView = view;
                return false;
            }
        });

        if(!this._currentView) {
            const isCurrentViewValid = !!VIEWS_CONFIG[currentView];
            if(isCurrentViewValid) {
                this._currentView = currentView;
            } else {
                this._currentView = views[0];
            }
        }
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
        const isVirtualScrolling = scrolling.mode === 'virtual' ||
            currentViewOptions.scrolling?.mode === 'virtual';
        const horizontalVirtualScrollingAllowed = isVirtualScrolling &&
            (
                !isDefined(scrolling.orientation) ||
                ['horizontal', 'both'].filter(
                    item => scrolling.orientation === item || currentViewOptions.scrolling?.orientation === item
                ).length > 0
            );
        const crossScrollingEnabled = this.option('crossScrollingEnabled') ||
            horizontalVirtualScrollingAllowed;

        const result = extend({
            key: this.key,
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
            resourceManager: getResourceManager(this.key),

            // TODO: SSR does not work correctly with renovated render
            renovateRender: this._isRenovatedRender(isVirtualScrolling),
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
        result.allDayExpanded = this._isAllDayExpanded(getAppointmentDataProvider(this.key).filteredItems);
        result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
        result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
        result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
        result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;

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

    getWorkSpaceScrollableContainer() {
        return this._workSpace.getScrollableContainer();
    }

    getWorkSpaceDateTableOffset() {
        return !this.option('crossScrollingEnabled') || this.option('rtlEnabled') ? this._workSpace.getWorkSpaceLeftOffset() : 0;
    }

    getWorkSpace() {
        return this._workSpace;
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
        const recurrenceRule = ExpressionUtils.getField(this.key, 'recurrenceRule', targetAppointment);

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
                this._excludeAppointmentFromSeries(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
                break;
            default:
                if(dragEvent) {
                    dragEvent.cancel = new Deferred();
                }
                this._showRecurrenceChangeConfirm(isDeleted)
                    .done((editingMode) => {
                        editingMode === RECURRENCE_EDITING_MODE.SERIES && callback();

                        editingMode === RECURRENCE_EDITING_MODE.OCCURENCE && this._excludeAppointmentFromSeries(
                            targetAppointment, singleAppointment, exceptionDate,
                            isDeleted, isPopupEditing, dragEvent,
                        );
                    })
                    .fail(() => this._appointments.moveAppointmentBack(dragEvent));
        }
    }

    _excludeAppointmentFromSeries(rawAppointment, newRawAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
        const appointment = createAppointmentAdapter(this.key, { ...rawAppointment });
        const newAppointment = createAppointmentAdapter(this.key, newRawAppointment);

        newAppointment.recurrenceRule = '';
        newAppointment.recurrenceException = '';

        const canCreateNewAppointment = !isDeleted && !isPopupEditing;
        if(canCreateNewAppointment) {
            const keyPropertyName = getAppointmentDataProvider(this.key).keyName;
            delete newRawAppointment[keyPropertyName];

            this.addAppointment(newRawAppointment);
        }

        appointment.recurrenceException = this._createRecurrenceException(appointment, exceptionDate);

        if(isPopupEditing) {
            this._appointmentPopup.show(newRawAppointment, {
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
                onHidden: (e) => {
                    e.component.$element().remove();
                },
            },
        });

        return this._recurrenceDialog.show();
    }

    _getUpdatedData(rawAppointment) {
        const timeZoneCalculator = getTimeZoneCalculator(this.key);
        const getConvertedFromGrid = date => date
            ? timeZoneCalculator.createDate(date, { path: 'fromGrid' })
            : undefined;

        const isValidDate = date => !isNaN(new Date(date).getTime());

        const targetCell = this.getTargetCellData();
        const appointment = createAppointmentAdapter(this.key, rawAppointment);

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

            const startDate = timeZoneCalculator.createDate(appointment.startDate, { path: 'toGrid' });
            const timeInMs = startDate.getTime() - trimTime(startDate).getTime();

            resultedStartDate = new Date(trimTime(targetCell.startDate).getTime() + timeInMs);
            resultedStartDate = timeZoneCalculator.createDate(resultedStartDate, { path: 'fromGrid' });
        }

        const result = createAppointmentAdapter(this.key, {});
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

        getResourceManager(this.key).setResourcesToItem(rawResult, targetCell.groups);

        return rawResult;
    }

    getTargetedAppointment(appointment, element) {
        const settings = utils.dataAccessors.getAppointmentSettings(element);
        const info = utils.dataAccessors.getAppointmentInfo(element);

        const appointmentIndex = $(element).data(this._appointments._itemIndexKey());

        const adapter = createAppointmentAdapter(this.key, appointment);
        const targetedAdapter = adapter.clone();

        if(this._isAgenda() && adapter.isRecurrent) {
            const getStartDate = this.getRenderingStrategyInstance().getAppointmentDataCalculator();
            const newStartDate = getStartDate($(element), adapter.startDate).startDate;

            targetedAdapter.startDate = newStartDate;
            targetedAdapter.endDate = new Date(newStartDate.getTime() + adapter.duration);

        } else if(settings) {
            targetedAdapter.startDate = info ? info.sourceAppointment.startDate : adapter.startDate; // TODO: in agenda we havn't info field
            targetedAdapter.endDate = info ? info.sourceAppointment.endDate : adapter.endDate;
        }

        const rawTargetedAppointment = targetedAdapter.source();
        if(element) {
            this.setTargetedAppointmentResources(rawTargetedAppointment, element, appointmentIndex);
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
                    deferred = getAppointmentDataProvider(this.key)
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
        if(!this._isAllDayExpanded(getAppointmentDataProvider(this.key).filteredItems) && this.appointmentTakesAllDay(appointment)) {
            this._workSpace.option('allDayExpanded', true);
        }
    }

    _onDataPromiseCompleted(handlerName, storeAppointment, appointment) {
        const args = { appointmentData: appointment || storeAppointment };

        if(storeAppointment instanceof Error) {
            args.error = storeAppointment;
        } else {
            this._appointmentPopup.isVisible() && this._appointmentPopup.hide();
        }

        this._actions[handlerName](args);
        this._fireContentReadyAction();
    }

    getAppointmentPopup() { // TODO remove
        return this._appointmentPopup.getPopup();
    }

    ///#DEBUG
    getAppointmentDetailsForm() { // TODO for tests
        return this._appointmentPopup._appointmentForm;
    }
    ///#ENDDEBUG

    getAppointmentsInstance() {
        return this._appointments;
    }

    getLayoutManager() {
        return this._layoutManager;
    }

    getRenderingStrategyInstance() {
        return this._layoutManager.getRenderingStrategyInstance();
    }

    getActions() {
        return this._actions;
    }

    appointmentTakesAllDay(appointment) {
        return getAppointmentDataProvider(this.key).appointmentTakesAllDay(
            appointment,
            this._getCurrentViewOption('startDayHour'),
            this._getCurrentViewOption('endDayHour')
        );
    }

    dayHasAppointment(day, rawAppointment, trimTime) {
        const getConvertedToTimeZone = date => {
            return getTimeZoneCalculator(this.key).createDate(date, { path: 'toGrid' });
        };

        const appointment = createAppointmentAdapter(this.key, rawAppointment);

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


        return (inArray(dayTimeStamp, [startDateTimeStamp, endDateTimeStamp]) > -1)
            ||
            (startDateTimeStamp < dayTimeStamp && endDateTimeStamp > dayTimeStamp);
    }

    setTargetedAppointmentResources(rawAppointment, element, appointmentIndex) {
        const groups = this._getCurrentViewOption('groups');

        if(groups?.length) {
            const resourcesSetter = getResourceManager(this.key)._dataAccessors.setter;
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
        return this._workSpace.getStartViewDate();
    }

    getEndViewDate() {
        return this._workSpace.getEndViewDate();
    }

    showAppointmentPopup(rawAppointment, createNewAppointment, rawTargetedAppointment) {

        const appointment = createAppointmentAdapter(this.key, (rawTargetedAppointment || rawAppointment));
        const newTargetedAppointment = extend({}, rawAppointment, rawTargetedAppointment);

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

        const startDate = this.option('currentDate');
        const endDate = new Date(startDate.getTime() + this.option('cellDuration') * toMs('minute'));

        ExpressionUtils.setField(this.key, 'startDate', result, startDate);
        ExpressionUtils.setField(this.key, 'endDate', result, endDate);

        return result;
    }

    hideAppointmentPopup(saveChanges) {
        if(this._appointmentPopup && this._appointmentPopup.isVisible()) {
            saveChanges && this._appointmentPopup.saveChanges();
            this._appointmentPopup.hide();
        }
    }

    showAppointmentTooltip(appointment, element, targetedAppointment) {
        if(appointment) {
            const settings = utils.dataAccessors.getAppointmentSettings(element);

            const deferredColor = getResourceManager(this.key).getAppointmentColor({
                itemData: targetedAppointment || appointment,
                groupIndex: settings?.groupIndex,
                groups: this.option('groups'),
                workspaceGroups: this.getWorkSpace().option('groups')
            });

            const info = new AppointmentTooltipInfo(appointment, targetedAppointment, deferredColor);
            this.showAppointmentTooltipCore(element, [info]);
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

    _isHorizontalVirtualScrolling() {
        const scrolling = this.option('scrolling');
        const { orientation, mode } = scrolling;
        const isVirtualScrolling = mode === 'virtual';

        return isVirtualScrolling &&
            (orientation === 'horizontal' || orientation === 'both');
    }

    addAppointment(rawAppointment) {
        const appointment = createAppointmentAdapter(this.key, rawAppointment);
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

            return getAppointmentDataProvider(this.key)
                .add(serializedAppointment)
                .always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment));
        });
    }

    updateAppointment(target, appointment) {
        return this._updateAppointment(target, appointment);
    }

    deleteAppointment(rawAppointment) {
        const deletingOptions = {
            appointmentData: rawAppointment,
            cancel: false
        };

        this._actions[StoreEventNames.DELETING](deletingOptions);

        this._processActionResult(deletingOptions, function(canceled) {
            if(!canceled) {
                getAppointmentDataProvider(this.key)
                    .remove(rawAppointment)
                    .always(storeAppointment => this._onDataPromiseCompleted(StoreEventNames.DELETED, storeAppointment, rawAppointment));
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
        return isDefined(this.option('firstDayOfWeek'))
            ? this.option('firstDayOfWeek')
            : dateLocalization.firstDayOfWeekIndex();
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
