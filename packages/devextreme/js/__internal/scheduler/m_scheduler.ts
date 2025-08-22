import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import config from '@js/core/config';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import Callbacks from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
// @ts-expect-error
import { Deferred, fromPromise, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import {
  isDeferred,
  isDefined,
  isEmptyObject,
  isFunction,
  isObject,
  isPromise,
} from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import DataHelperMixin from '@js/data_helper';
import { custom as customDialog } from '@js/ui/dialog';
import type { Appointment, AppointmentTooltipShowingEvent } from '@js/ui/scheduler';
import errors from '@js/ui/widget/ui.errors';
import { dateUtilsTs } from '@ts/core/utils/date';

import { createA11yStatusContainer } from './a11y_status/a11y_status_render';
import { getA11yStatusText } from './a11y_status/a11y_status_text';
import { AppointmentForm } from './appointment_popup/m_form';
import { ACTION_TO_APPOINTMENT, AppointmentPopup } from './appointment_popup/m_popup';
import AppointmentCollection from './appointments/m_appointment_collection';
import NotifyScheduler from './base/m_widget_notify_scheduler';
import { SchedulerHeader } from './header/m_header';
import type { HeaderOptions } from './header/types';
import { CompactAppointmentsHelper } from './m_compact_appointments_helper';
import { AppointmentTooltipInfo } from './m_data_structures';
import { hide as hideLoading, show as showLoading } from './m_loading';
import { getRecurrenceProcessor } from './m_recurrence';
import type { SubscribeKey, SubscribeMethods } from './m_subscribes';
import subscribes from './m_subscribes';
import { utils } from './m_utils';
import timeZoneUtils, { type TimezoneLabel } from './m_utils_time_zone';
import { combineRemoteFilter } from './r1/filterting/remote';
import { createTimeZoneCalculator } from './r1/timezone_calculator/index';
import {
  excludeFromRecurrence,
  getToday,
  isAppointmentTakesAllDay,
  isDateAndTimeView,
  isTimelineView,
} from './r1/utils/index';
import { SchedulerOptionsBaseWidget } from './scheduler_options_base_widget';
import { DesktopTooltipStrategy } from './tooltip_strategies/m_desktop_tooltip_strategy';
import { MobileTooltipStrategy } from './tooltip_strategies/m_mobile_tooltip_strategy';
import { AppointmentAdapter } from './utils/appointment_adapter/appointment_adapter';
import { AppointmentDataAccessor } from './utils/data_accessor/appointment_data_accessor';
import type { IFieldExpr } from './utils/index';
import { macroTaskArray } from './utils/index';
import { isAgendaWorkspaceComponent } from './utils/is_agenda_workpace_component';
import { VIEWS } from './utils/options/constants_view';
import type { NormalizedView } from './utils/options/types';
import { setAppointmentGroupValues } from './utils/resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from './utils/resource_manager/group_utils';
import { createResourceEditorModel } from './utils/resource_manager/popup_utils';
import { ResourceManager } from './utils/resource_manager/resource_manager';
import { AppointmentDataSource } from './view_model/generate_view_model/data_provider/m_appointment_data_source';
import type {
  AppointmentAgendaViewModel,
  AppointmentViewModelPlain,
} from './view_model/generate_view_model/types';
import AppointmentLayoutManager from './view_model/m_appointments_layout_manager';
import SchedulerAgenda from './workspaces/m_agenda';
import SchedulerTimelineDay from './workspaces/m_timeline_day';
import SchedulerTimelineMonth from './workspaces/m_timeline_month';
import SchedulerTimelineWeek from './workspaces/m_timeline_week';
import SchedulerTimelineWorkWeek from './workspaces/m_timeline_work_week';
import SchedulerWorkSpaceDay from './workspaces/m_work_space_day';
import SchedulerWorkSpaceMonth from './workspaces/m_work_space_month';
import SchedulerWorkSpaceWeek from './workspaces/m_work_space_week';
import SchedulerWorkSpaceWorkWeek from './workspaces/m_work_space_work_week';

const toMs = dateUtils.dateToMilliseconds;

const WIDGET_CLASS = 'dx-scheduler';
const WIDGET_SMALL_CLASS = `${WIDGET_CLASS}-small`;
const WIDGET_ADAPTIVE_CLASS = `${WIDGET_CLASS}-adaptive`;
const WIDGET_READONLY_CLASS = `${WIDGET_CLASS}-readonly`;
const WIDGET_SMALL_WIDTH = 400;

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const UTC_FULL_DATE_FORMAT = `${FULL_DATE_FORMAT}Z`;

const VIEWS_CONFIG = {
  day: {
    workSpace: SchedulerWorkSpaceDay,
    renderingStrategy: 'vertical',
  },
  week: {
    workSpace: SchedulerWorkSpaceWeek,
    renderingStrategy: 'vertical',
  },
  workWeek: {
    workSpace: SchedulerWorkSpaceWorkWeek,
    renderingStrategy: 'vertical',
  },
  month: {
    workSpace: SchedulerWorkSpaceMonth,
    renderingStrategy: 'horizontalMonth',
  },
  timelineDay: {
    workSpace: SchedulerTimelineDay,
    renderingStrategy: 'horizontal',
  },
  timelineWeek: {
    workSpace: SchedulerTimelineWeek,
    renderingStrategy: 'horizontal',
  },
  timelineWorkWeek: {
    workSpace: SchedulerTimelineWorkWeek,
    renderingStrategy: 'horizontal',
  },
  timelineMonth: {
    workSpace: SchedulerTimelineMonth,
    renderingStrategy: 'horizontalMonthLine',
  },
  agenda: {
    workSpace: SchedulerAgenda,
    renderingStrategy: 'agenda',
  },
};

const StoreEventNames = {
  ADDING: 'onAppointmentAdding',
  ADDED: 'onAppointmentAdded',

  DELETING: 'onAppointmentDeleting',
  DELETED: 'onAppointmentDeleted',

  UPDATING: 'onAppointmentUpdating',
  UPDATED: 'onAppointmentUpdated',
};

const RECURRENCE_EDITING_MODE = {
  SERIES: 'editSeries',
  OCCURRENCE: 'editOccurrence',
  CANCEL: 'cancel',
};

class Scheduler extends SchedulerOptionsBaseWidget {
  // NOTE: Do not initialize variables here, because `_initMarkup` function runs before constructor,
  // and initialization in constructor will erase the data
  _timeZoneCalculator!: any;

  postponedOperations: any;

  _a11yStatus!: dxElementWrapper;

  _workSpace: any;

  _header?: SchedulerHeader;

  _appointments: any;

  appointmentDataSource!: AppointmentDataSource;

  _dataSource: any;

  _dataAccessors!: AppointmentDataAccessor;

  resourceManager!: ResourceManager;

  _actions: any;

  _createActionByOption: any;

  _appointmentTooltip: any;

  _readyToRenderAppointments?: boolean;

  _editing: any;

  _workSpaceRecalculation: any;

  _appointmentPopup: any;

  _compactAppointmentsHelper!: CompactAppointmentsHelper;

  _asyncTemplatesTimers!: any[];

  _dataSourceLoadedCallback: any;

  _subscribes: any;

  _notifyScheduler!: NotifyScheduler;

  _recurrenceDialog: any;

  _layoutManager!: AppointmentLayoutManager;

  _appointmentForm: any;

  _mainContainer: any;

  _all: any;

  _options: any;

  _editAppointmentData: any;

  _timeZonesPromise!: Promise<TimezoneLabel[]>;

  get timeZoneCalculator() {
    if (!this._timeZoneCalculator) {
      this._timeZoneCalculator = createTimeZoneCalculator(this.option('timeZone'));
    }

    return this._timeZoneCalculator;
  }

  _postponeDataSourceLoading(promise?: any) {
    this.postponedOperations.add('_reloadDataSource', this._reloadDataSource.bind(this), promise);
  }

  _postponeResourceLoading(forceReload = false) {
    const whenLoaded = this.postponedOperations.add('loadResources', () => {
      const groups = this.getViewOption('groups');

      return fromPromise(this.resourceManager.loadGroupResources(groups, forceReload));
    });

    // @ts-expect-error
    const resolveCallbacks = new Deferred();

    whenLoaded.done(() => {
      resolveCallbacks.resolve();
    });

    this._postponeDataSourceLoading(whenLoaded);

    return resolveCallbacks.promise();
  }

  _optionChanged(args) {
    this.schedulerOptionChanged(args);

    const { value, name } = args;

    switch (args.name) {
      case 'customizeDateNavigatorText':
        this._updateOption('header', name, value);
        break;
      case 'firstDayOfWeek':
        this._updateOption('workSpace', name, value);
        this._updateOption('header', name, value);
        break;
      case 'currentDate': {
        const dateValue = this.getViewOption(name);
        this.option('selectedCellData', []);
        this._updateOption('workSpace', name, dateValue);
        this._updateOption('header', name, dateValue);
        this._updateOption('header', 'startViewDate', this.getStartViewDate());
        this._appointments.option('items', []);
        this._filterAppointmentsByDate();

        this._postponeDataSourceLoading();
        break;
      }
      case 'dataSource':
        // @ts-expect-error
        this._initDataSource();

        this._postponeResourceLoading().done(() => {
          this.appointmentDataSource.setDataSource(this._dataSource);
          this._filterAppointmentsByDate();
          this._updateOption('workSpace', 'showAllDayPanel', this.option('showAllDayPanel'));
        });
        break;
      case 'min':
      case 'max': {
        const value = this.getViewOption(name);
        this._updateOption('header', name, value);
        this._updateOption('workSpace', name, value);
        break;
      }
      case 'views':
        if (this.currentView) {
          this.repaint();
        } else {
          this._updateOption('header', 'views', this.views);
        }
        break;
      case 'useDropDownViewSwitcher':
        this._updateOption('header', name, value);
        break;
      case 'currentView':
        this._appointments.option({
          items: [],
          allowDrag: this._allowDragging(),
          allowResize: this._allowResizing(),
          itemTemplate: this._getAppointmentTemplate('appointmentTemplate'),
        });

        this._postponeResourceLoading().done(() => {
          this._refreshWorkSpace();
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
        this._postponeResourceLoading().done(() => {
          this._refreshWorkSpace();
          this._filterAppointmentsByDate();
        });
        break;
      case 'resources':
        this.resourceManager?.dispose();
        this.resourceManager = new ResourceManager(this.option('resources'));
        this.updateAppointmentDataSource();

        this._postponeResourceLoading().done(() => {
          this._appointments.option('items', []);
          this._refreshWorkSpace();
          this._filterAppointmentsByDate();
          this._createAppointmentPopupForm();
        });
        break;
      case 'startDayHour':
      case 'endDayHour':
        this.updateAppointmentDataSource();

        this._appointments.option('items', []);
        this._updateOption('workSpace', name, value);
        this._appointments.repaint();
        this._filterAppointmentsByDate();

        this._postponeDataSourceLoading();
        break;
        // TODO Vinogradov refactoring: merge it with startDayHour / endDayHour
      case 'offset':

        this.updateAppointmentDataSource();

        this._appointments.option('items', []);
        this._updateOption('workSpace', 'viewOffset', this.normalizeViewOffsetValue(value));
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
        this._appointmentTooltip._options.onItemContextMenu = this._createActionByOption(name);
        break;
      case 'noDataText':
      case 'allowMultipleCellSelection':
      case 'selectedCellData':
      case 'accessKey':
      case 'onCellClick':
        this._updateOption('workSpace', name, value);
        break;
      case 'onCellContextMenu':
        this._updateOption('workSpace', name, value);
        break;
      case 'crossScrollingEnabled':
        this._postponeResourceLoading().done(() => {
          this._appointments.option('items', []);
          this._refreshWorkSpace();
          if (this._readyToRenderAppointments) {
            this._appointments.option('items', this._getAppointmentsToRepaint());
          }
        });
        break;
      case 'cellDuration':
        this._updateOption('workSpace', name, value);
        this._appointments.option('items', []);
        if (this._readyToRenderAppointments) {
          this._updateOption('workSpace', 'hoursInterval', value / 60);
          this._appointments.option('items', this._getAppointmentsToRepaint());
        }
        break;
      case 'tabIndex':
      case 'focusStateEnabled':
        this._updateOption('header', name, value);
        this._updateOption('workSpace', name, value);
        this._appointments.option(name, value);
        // @ts-expect-error
        super._optionChanged(args);
        break;
      case 'width':
        // TODO: replace with css
        this._updateOption('header', name, value);
        if (this.option('crossScrollingEnabled')) {
          this._updateOption('workSpace', 'width', value);
        }
        this._updateOption('workSpace', 'schedulerWidth', value);
        // @ts-expect-error
        super._optionChanged(args);
        this._dimensionChanged(null, true);
        break;
      case 'height':
        // @ts-expect-error
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
        this.updateAppointmentDataSource();
        this.repaint();
        break;
      case 'showCurrentTimeIndicator':
      case 'indicatorUpdateInterval':
      case 'shadeUntilCurrentTime':
      case 'groupByDate':
        this._updateOption('workSpace', name, value);
        this.repaint();
        break;
      case 'indicatorTime':
        this._updateOption('workSpace', name, value);
        this._updateOption('header', name, value);
        this.repaint();
        break;
      case 'appointmentDragging':
      case 'appointmentTooltipTemplate':
      case 'appointmentPopupTemplate':
      case 'recurrenceEditMode':
      case 'remoteFiltering':
      case 'timeZone':
        this.updateAppointmentDataSource();
        this.repaint();
        break;
      case 'dropDownAppointmentTemplate':
      case 'appointmentCollectorTemplate':
      case '_appointmentTooltipOffset':
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
        this.updateAppointmentDataSource();
        this._updateOption('workSpace', args.fullName, value);
        break;
      case 'renovateRender':
        this._updateOption('workSpace', name, value);
        break;
      case '_draggingMode':
        this._updateOption('workSpace', 'draggingMode', value);
        break;
      case 'toolbar':
        this._header
          ? this._header.onToolbarOptionChanged(args.fullName, value)
          : this.repaint();
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  _bringEditingModeToAppointments(editing) {
    const editingConfig: any = {
      allowDelete: editing.allowUpdating && editing.allowDeleting,
    };

    if (!this._isAgenda()) {
      editingConfig.allowDrag = editing.allowDragging;
      editingConfig.allowResize = editing.allowResizing;
      editingConfig.allowAllDayResize = editing.allowResizing && this._supportAllDayResizing();
    }

    this._appointments.option(editingConfig);
    this.repaint();
  }

  _isAgenda() {
    return this._layoutManager.appointmentRenderingStrategyName === 'agenda';
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
    return this.currentView.type !== 'day' || this.currentView.intervalCount > 1;
  }

  _isAllDayExpanded() {
    return this.option('showAllDayPanel') && this._layoutManager.hasAllDayAppointments();
  }

  _filterAppointmentsByDate() {
    if (!this._workSpace) {
      return;
    }

    const dateRange = this._workSpace.getDateRange();

    const startDate = this.timeZoneCalculator.createDate(dateRange[0], 'fromGrid');
    const endDate = this.timeZoneCalculator.createDate(dateRange[1], 'fromGrid');

    this.setRemoteFilter(
      startDate,
      endDate,
      this.option('remoteFiltering'),
      this.option('dateSerializationFormat'),
    );
  }

  setRemoteFilter(min, max, remoteFiltering = false, dateSerializationFormat?) {
    const dataSource = this._dataSource;
    const dataAccessors = this._dataAccessors;

    if (!dataSource || !remoteFiltering) {
      return;
    }

    const dataSourceFilter = dataSource.filter();
    const filter = combineRemoteFilter({
      dataSourceFilter,
      dataAccessors,
      min,
      max,
      dateSerializationFormat,
      forceIsoDateParsing: config().forceIsoDateParsing,
    });

    dataSource.filter(filter);
  }

  _reloadDataSource() {
    // @ts-expect-error
    const result = new Deferred();

    if (this._dataSource) {
      this._dataSource.load().done(() => {
        hideLoading();

        this._fireContentReadyAction(result);
      }).fail(() => {
        hideLoading();
        result.reject();
      });

      this._dataSource.isLoading() && showLoading({
        container: this.$element(),
        position: {
          of: this.$element(),
        },
      });
    } else {
      this._fireContentReadyAction(result);
    }

    return result.promise();
  }

  _fireContentReadyAction(result?: any) {
    // @ts-expect-error
    const contentReadyBase = super._fireContentReadyAction.bind(this);
    const fireContentReady = () => {
      contentReadyBase();
      result?.resolve();
    };

    if (this._workSpaceRecalculation) {
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

    // @ts-expect-error
    if (!this._isVisible()) {
      return;
    }

    this._toggleSmallClass();

    const workspace = this.getWorkSpace();

    if (
      !this._isAgenda()
      && this._layoutManager
      && workspace
      && !isAgendaWorkspaceComponent(workspace)
    ) {
      if (isForce || (!isFixedHeight || !isFixedWidth)) {
        workspace.option('allDayExpanded', this._isAllDayExpanded());
        workspace._dimensionChanged();
        const appointments = this._layoutManager.createAppointmentsMap();

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
    // @ts-expect-error
    super._clean();
  }

  _toggleSmallClass() {
    const { width } = getBoundingRect((this.$element() as any).get(0));
    (this.$element() as any).toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
  }

  _toggleAdaptiveClass() {
    (this.$element() as any).toggleClass(WIDGET_ADAPTIVE_CLASS, this.option('adaptivityEnabled'));
  }

  _visibilityChanged(visible) {
    visible && this._dimensionChanged(null, true);
  }

  _dataSourceOptions() {
    return { paginate: false };
  }

  _initAllDayPanel() {
    if (this.option('allDayPanelMode') === 'hidden') {
      this.option('showAllDayPanel', false);
    }
  }

  _init() {
    this._timeZonesPromise = timeZoneUtils.cacheTimeZones();
    this._initExpressions({
      startDateExpr: this.option('startDateExpr'),
      endDateExpr: this.option('endDateExpr'),
      startDateTimeZoneExpr: this.option('startDateTimeZoneExpr'),
      endDateTimeZoneExpr: this.option('endDateTimeZoneExpr'),
      allDayExpr: this.option('allDayExpr'),
      textExpr: this.option('textExpr'),
      descriptionExpr: this.option('descriptionExpr'),
      recurrenceRuleExpr: this.option('recurrenceRuleExpr'),
      recurrenceExceptionExpr: this.option('recurrenceExceptionExpr'),
      disabledExpr: this.option('disabledExpr'),
    } as IFieldExpr);

    super._init();

    this._initAllDayPanel();

    // @ts-expect-error
    this._initDataSource();

    this._customizeDataSourceLoadOptions();

    (this.$element() as any).addClass(WIDGET_CLASS);

    this._initEditing();

    this.updateAppointmentDataSource();

    this._initActions();

    this._compactAppointmentsHelper = new CompactAppointmentsHelper(this);

    this._asyncTemplatesTimers = [];

    this._dataSourceLoadedCallback = Callbacks();

    this._subscribes = subscribes;

    this.resourceManager = new ResourceManager(this.option('resources'));

    this._notifyScheduler = new NotifyScheduler({ scheduler: this });
  }

  createAppointmentDataSource() {
    this.appointmentDataSource?.destroy();
    this.appointmentDataSource = new AppointmentDataSource(this._dataSource);
  }

  updateAppointmentDataSource() {
    this._timeZoneCalculator = null;

    if (this.getWorkSpace()) {
      this.createAppointmentDataSource();
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
    // @ts-expect-error
    super._initTemplates();
  }

  _initAppointmentTemplate() {
    const { expr } = this._dataAccessors;
    const createGetter = (property) => compileGetter(`appointmentData.${property}`);

    const getDate = (getter) => (data) => {
      const value = getter(data);
      if (value instanceof Date) {
        return value.valueOf();
      }
      return value;
    };

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(
        ($container, data, model) => this.getAppointmentsInstance()._renderAppointmentTemplate($container, data, model),
        [
          'html',
          'text',
          'startDate',
          'endDate',
          'allDay',
          'description',
          'recurrenceRule',
          'recurrenceException',
          'startDateTimeZone',
          'endDateTimeZone',
        ],
        this.option('integrationOptions.watchMethod'),
        {
          text: createGetter(expr.textExpr),
          startDate: getDate(createGetter(expr.startDateExpr)),
          endDate: getDate(createGetter(expr.endDateExpr)),
          startDateTimeZone: createGetter(expr.startDateTimeZoneExpr),
          endDateTimeZone: createGetter(expr.endDateTimeZoneExpr),
          allDay: createGetter(expr.allDayExpr),
          recurrenceRule: createGetter(expr.recurrenceRuleExpr),
        },
      ),
    });
  }

  _renderContent() {
    // @ts-expect-error
    this._renderContentImpl();
  }

  _dataSourceChangedHandler(result?: Appointment[]) {
    if (this._readyToRenderAppointments) {
      this._workSpaceRecalculation.done(() => {
        this._layoutManager.prepareItems(result);
        this._renderAppointments();
        this._updateA11yStatus();
        this.getWorkSpace().onDataSourceChanged(this._layoutManager.filteredItems);
      });
    }
  }

  isVirtualScrolling() {
    const workspace = this.getWorkSpace();

    if (workspace) {
      return workspace.isVirtualScrolling();
    }

    const scrolling = this.getViewOption('scrolling');

    return scrolling?.mode === 'virtual';
  }

  _renderAppointments() {
    const workspace = this.getWorkSpace();
    this._layoutManager.filterAppointments();

    workspace.option('allDayExpanded', this._isAllDayExpanded());

    // @ts-expect-error
    const viewModel: AppointmentViewModelPlain[] = this._isVisible()
      ? this._getAppointmentsToRepaint()
      : [];

    this._appointments.option('items', viewModel);
    this.appointmentDataSource.cleanState();
  }

  _getAppointmentsToRepaint(): AppointmentViewModelPlain[] {
    const appointmentsMap = this._layoutManager.createAppointmentsMap();
    return appointmentsMap;
  }

  _initExpressions(fields: IFieldExpr) {
    this._dataAccessors = new AppointmentDataAccessor(
      fields,
      Boolean(config().forceIsoDateParsing),
      this.option('dateSerializationFormat'),
    );
  }

  _updateExpression(name: string, value: string) {
    this._dataAccessors.updateExpression(name, value);
  }

  _initEditing() {
    const editing = this.option('editing');

    this._editing = {
      allowAdding: Boolean(editing),
      allowUpdating: Boolean(editing),
      allowDeleting: Boolean(editing),
      allowResizing: Boolean(editing),
      allowDragging: Boolean(editing),
    };

    if (isObject(editing)) {
      this._editing = extend(this._editing, editing);
    }

    this._editing.allowDragging = this._editing.allowDragging && this._editing.allowUpdating;
    this._editing.allowResizing = this._editing.allowResizing && this._editing.allowUpdating;
    const isReadOnly = Object.values(this._editing).every((value) => !value);

    (this.$element() as any).toggleClass(WIDGET_READONLY_CLASS, isReadOnly);
  }

  _dispose() {
    this.resourceManager?.dispose();
    this._appointmentTooltip?.dispose();
    this._recurrenceDialog?.hide(RECURRENCE_EDITING_MODE.CANCEL);

    this.hideAppointmentPopup();
    this.hideAppointmentTooltip();

    this._asyncTemplatesTimers.forEach(clearTimeout);
    this._asyncTemplatesTimers = [];

    // NOTE: Stop all scheduled macro tasks
    macroTaskArray.dispose();

    // @ts-expect-error
    super._dispose();
  }

  _initActions() {
    this._actions = {
      onAppointmentAdding: this._createActionByOption(StoreEventNames.ADDING),
      onAppointmentAdded: this._createActionByOption(StoreEventNames.ADDED),
      onAppointmentUpdating: this._createActionByOption(StoreEventNames.UPDATING),
      onAppointmentUpdated: this._createActionByOption(StoreEventNames.UPDATED),
      onAppointmentDeleting: this._createActionByOption(StoreEventNames.DELETING),
      onAppointmentDeleted: this._createActionByOption(StoreEventNames.DELETED),
      onAppointmentFormOpening: this._createActionByOption('onAppointmentFormOpening'),
      onAppointmentTooltipShowing: this._createActionByOption('onAppointmentTooltipShowing'),
    };
  }

  _getAppointmentRenderedAction() {
    return this._createActionByOption('onAppointmentRendered', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _renderFocusTarget() { return noop(); }

  _updateA11yStatus() {
    const dateRange = this._workSpace.getDateRange();
    const indicatorTime = this.option('showCurrentTimeIndicator')
      ? getToday(this.option('indicatorTime') as Date, this.timeZoneCalculator)
      : undefined;
    const label = getA11yStatusText(
      this.currentView,
      dateRange[0],
      dateRange[1],
      this._appointments.appointmentsCount,
      indicatorTime,
    );

    // @ts-expect-error
    this.setAria({ label });
    this._a11yStatus.text(label);
  }

  _renderA11yStatus() {
    this._a11yStatus = createA11yStatusContainer();
    this._a11yStatus.prependTo(this.$element());
    // @ts-expect-error
    this.setAria({ role: 'group' });
  }

  _initMarkupOnResourceLoaded() {
    if (!(this as any)._disposed) {
      this._initMarkupCore();
      this._reloadDataSource();
    }
  }

  _initMarkup(): void {
    super._initMarkup();

    this._renderA11yStatus();
    this._renderMainContainer();
    this._renderHeader();

    this._layoutManager = new AppointmentLayoutManager(this);

    // @ts-expect-error
    this._appointments = this._createComponent('<div>', AppointmentCollection, this._appointmentsConfig());
    this._appointments.option('itemTemplate', this._getAppointmentTemplate('appointmentTemplate'));

    this._appointmentTooltip = new (this.option('adaptivityEnabled')
      ? MobileTooltipStrategy
      : DesktopTooltipStrategy)(this._getAppointmentTooltipOptions());

    this._createAppointmentPopupForm();

    // @ts-expect-error
    if (this._isDataSourceLoaded() || this._isDataSourceLoading()) {
      this._initMarkupCore();
      this._dataSourceChangedHandler(this._dataSource.items());
      this._fireContentReadyAction();
    } else {
      const groups = this.getViewOption('groups');

      if (groups?.length) {
        this.resourceManager.loadGroupResources(groups, true)
          .then(() => this._initMarkupOnResourceLoaded());
      } else {
        this._initMarkupOnResourceLoaded();
      }
    }
  }

  _createAppointmentPopupForm() {
    if (this._appointmentForm) {
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
      createResourceEditorModel: () => createResourceEditorModel(this.resourceManager.resourceById),
      getDataAccessors: () => this._dataAccessors,
      // @ts-expect-error
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
      // @ts-expect-error
      createComponent: (element, component, options) => this._createComponent(element, component, options),
      focus: () => this.focus(),

      getResourceManager: () => this.resourceManager,

      getEditingConfig: () => this._editing,

      getTimeZoneCalculator: () => this.timeZoneCalculator,
      getDataAccessors: () => this._dataAccessors,
      getAppointmentFormOpening: () => this._actions.onAppointmentFormOpening,
      processActionResult: (arg, canceled) => this._processActionResult(arg, canceled),

      addAppointment: (appointment) => this.addAppointment(appointment),
      updateAppointment: (sourceAppointment, updatedAppointment) => this.updateAppointment(sourceAppointment, updatedAppointment),

      updateScrollPosition: (startDate, appointmentGroupValues, inAllDayRow) => {
        this._workSpace.updateScrollPosition(startDate, appointmentGroupValues, inAllDayRow);
      },
    };

    return new AppointmentPopup(scheduler, form);
  }

  _getAppointmentTooltipOptions() {
    const that = this;
    return {
      // @ts-expect-error
      createComponent: that._createComponent.bind(that),
      container: that.$element(),
      getScrollableContainer: that.getWorkSpaceScrollableContainer.bind(that),
      addDefaultTemplates: that._templateManager.addDefaultTemplates.bind(that._templateManager),
      getAppointmentTemplate: that._getAppointmentTemplate.bind(that),
      showAppointmentPopup: that.showAppointmentPopup.bind(that),
      checkAndDeleteAppointment: that.checkAndDeleteAppointment.bind(that),
      isAppointmentInAllDayPanel: that.isAppointmentInAllDayPanel.bind(that),

      createFormattedDateText: (appointment, targetedAppointment, format) => (this.fire as any)('getTextAndFormatDate', appointment, targetedAppointment, format),
      getAppointmentDisabled: (appointment) => this._dataAccessors.get('disabled', appointment),
      onItemContextMenu: that._createActionByOption('onAppointmentContextMenu'),
      createEventArgs: that._createEventArgs.bind(that),
    };
  }

  _createEventArgs(e) {
    const config = {
      itemData: e.itemData.appointment,
      itemElement: e.itemElement,
      targetedAppointment: e.itemData.targetedAppointment,
    };
    return extend({}, (this.fire as any)('mapAppointmentFields', config), {
      component: e.component,
      element: e.element,
      event: e.event,
      model: e.model,
    });
  }

  checkAndDeleteAppointment(appointment, targetedAppointment) {
    const targetedAdapter = new AppointmentAdapter(
      targetedAppointment,
      this._dataAccessors,
    );

    const deletingOptions = this.fireOnAppointmentDeleting(appointment, targetedAdapter);
    this._checkRecurringAppointment(
      appointment,
      targetedAppointment,
      targetedAdapter.startDate,
      () => {
        this.processDeleteAppointment(appointment, deletingOptions);
      },
      true,
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

  _initMarkupCore() {
    this._readyToRenderAppointments = hasWindow();

    this._workSpace && this._cleanWorkspace();

    this._renderWorkSpace();
    this._appointments.option({
      fixedContainer: this._workSpace.getFixedContainer(),
      allDayContainer: this._workSpace.getAllDayContainer(),
    });
    this._waitAsyncTemplate(() => this._workSpaceRecalculation?.resolve());

    this.createAppointmentDataSource();
    this._filterAppointmentsByDate();
    this._validateKeyFieldIfAgendaExist();
    this._updateA11yStatus();
  }

  _isDataSourceLoaded() {
    return this._dataSource?.isLoaded();
  }

  _render() {
    this._toggleAdaptiveClass();

    this.getWorkSpace()?.updateHeaderEmptyCellWidth();

    // @ts-expect-error
    super._render();
  }

  _renderHeader() {
    const toolbarOptions = this.option('toolbar');
    const isHeaderShown = Boolean(
      toolbarOptions.visible ?? toolbarOptions.items?.length,
    );

    if (isHeaderShown) {
      const $header = $('<div>').appendTo(this._mainContainer);
      const headerOptions = this._headerConfig();
      // @ts-expect-error
      this._header = this._createComponent($header, SchedulerHeader, headerOptions);
    }
  }

  _headerConfig(): HeaderOptions {
    return {
      currentView: this.currentView,
      views: this.views,
      currentDate: this.getViewOption('currentDate'),
      min: this.getViewOption('min'),
      max: this.getViewOption('max'),
      indicatorTime: this.option('indicatorTime'),
      startViewDate: this.getStartViewDate(),
      tabIndex: this.option('tabIndex'),
      focusStateEnabled: this.option('focusStateEnabled'),
      useDropDownViewSwitcher: this.option('useDropDownViewSwitcher'),
      firstDayOfWeek: this.getFirstDayOfWeek(),
      toolbar: this.option('toolbar'),
      customizeDateNavigatorText: this.option('customizeDateNavigatorText'),
      onCurrentViewChange: (name): void => {
        this.option('currentView', name);
      },
      onCurrentDateChange: (date): void => {
        this.option('currentDate', date);
      },
    };
  }

  _appointmentsConfig() {
    const config = {
      getResourceManager: () => this.resourceManager,
      getAppointmentColor: this.createGetAppointmentColor(),

      getAppointmentDataSource: () => this.appointmentDataSource,
      dataAccessors: this._dataAccessors,
      notifyScheduler: this._notifyScheduler,
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
      groups: this.getViewOption('groups'),
      timeZoneCalculator: this.timeZoneCalculator,
      getResizableStep: () => (this._workSpace ? this._workSpace.positionHelper.getResizableStep() : 0),
      getDOMElementsMetaData: () => this._workSpace?.getDOMElementsMetaData(),
      getViewDataProvider: () => this._workSpace?.viewDataProvider,
      isVerticalGroupedWorkSpace: () => this._workSpace._isVerticalGroupedWorkSpace(),
      isDateAndTimeView: () => isDateAndTimeView(this._workSpace.type),
      onContentReady: () => {
        this._workSpace?.option('allDayExpanded', this._isAllDayExpanded());
      },
    };

    return config;
  }

  getCollectorOffset() {
    if (this._workSpace.needApplyCollectorOffset() && !this.option('adaptivityEnabled')) {
      return this.option('_collectorOffset');
    }
    return 0;
  }

  getAppointmentDurationInMinutes() {
    return this.getViewOption('cellDuration');
  }

  _renderWorkSpace() {
    const currentViewOptions = this.currentView;
    if (!currentViewOptions) {
      return;
    }

    if (this._readyToRenderAppointments) {
      this._toggleSmallClass();
      // TODO(9): Get rid of it as soon as you can. Workspace didn't render
      Promise.resolve().then(() => {
        this._toggleSmallClass();
        this._workSpace?.updateHeaderEmptyCellWidth();
      });
    }
    const $workSpace = $('<div>').appendTo(this._mainContainer);

    const currentViewType = currentViewOptions.type;
    const workSpaceComponent = VIEWS_CONFIG[currentViewType].workSpace;
    const workSpaceConfig = this._workSpaceConfig(currentViewOptions);
    // @ts-expect-error
    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);

    this._allowDragging() && this._workSpace.initDragBehavior(this, this._all);
    this._workSpace._attachTablesEvents();
    this._workSpace.getWorkArea().append(this._appointments.$element());

    this._recalculateWorkspace();
    if (currentViewOptions.startDate) {
      this._updateOption('header', 'currentDate', this._workSpace._getHeaderDate());
    }

    this._appointments.option('_collectorOffset', this.getCollectorOffset());
  }

  _recalculateWorkspace() {
    // @ts-expect-error
    this._workSpaceRecalculation = new Deferred();
    this._waitAsyncTemplate(() => {
      triggerResizeEvent(this._workSpace.$element());
      this._workSpace.renderCurrentDateTimeLineAndShader();
    });
  }

  _workSpaceConfig(currentViewOptions: NormalizedView) {
    const scrolling = this.getViewOption('scrolling');
    const isVirtualScrolling = scrolling.mode === 'virtual';
    const horizontalVirtualScrollingAllowed = isVirtualScrolling
            && (
              !isDefined(scrolling.orientation)
                || ['horizontal', 'both'].includes(scrolling.orientation)
            );
    const crossScrollingEnabled = this.option('crossScrollingEnabled')
            || horizontalVirtualScrollingAllowed
            || isTimelineView(currentViewOptions.type);

    const result = extend({
      resources: this.option('resources'),
      getResourceManager: () => this.resourceManager,
      getFilteredItems: () => this._layoutManager.filteredItems,

      noDataText: this.option('noDataText'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      viewOffset: this.getViewOffsetMs(),
      tabIndex: this.option('tabIndex'),
      accessKey: this.option('accessKey'),
      focusStateEnabled: this.option('focusStateEnabled'),
      cellDuration: this.option('cellDuration'),
      showAllDayPanel: this.option('showAllDayPanel'),
      showCurrentTimeIndicator: this.option('showCurrentTimeIndicator'),
      indicatorTime: this.option('indicatorTime'),
      indicatorUpdateInterval: this.option('indicatorUpdateInterval'),
      shadeUntilCurrentTime: this.option('shadeUntilCurrentTime'),
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
      groupByDate: this.getViewOption('groupByDate'),
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
    }, currentViewOptions);

    result.notifyScheduler = this._notifyScheduler;
    result.groups = this.resourceManager.groupResources();
    result.onCellClick = this._createActionByOption('onCellClick');
    result.onCellContextMenu = this._createActionByOption('onCellContextMenu');
    result.currentDate = this.getViewOption('currentDate');
    result.hoursInterval = result.cellDuration / 60;
    result.allDayExpanded = false;
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
    if (this._options.silent('templatesRenderAsynchronously')) {
      const timer = setTimeout(() => {
        callback();
        clearTimeout(timer);
      });
      this._asyncTemplatesTimers.push(timer);
    } else {
      callback();
    }
  }

  _getAppointmentTemplate(optionName) {
    if (this.currentView?.[optionName]) {
      return this._getTemplate(this.currentView[optionName]);
    }

    // @ts-expect-error
    return this._getTemplateByOption(optionName);
  }

  _updateOption<T>(viewName: 'workSpace' | 'header', optionName: string, value: T): void {
    this[`_${viewName}`]?.option(optionName, value);
  }

  _refreshWorkSpace(): void {
    this._cleanWorkspace();

    delete this._workSpace;

    this._renderWorkSpace();

    if (this._readyToRenderAppointments) {
      this._appointments.option({
        fixedContainer: this._workSpace.getFixedContainer(),
        allDayContainer: this._workSpace.getAllDayContainer(),
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

  _checkRecurringAppointment(
    rawAppointment,
    singleAppointment,
    exceptionDate,
    callback,
    isDeleted,
    isPopupEditing?: any,
    dragEvent?: any,
    recurrenceEditMode?: any,
  ) {
    const recurrenceRule = this._dataAccessors.get('recurrenceRule', rawAppointment);

    if (!getRecurrenceProcessor().evalRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
      callback();
      return;
    }

    const editMode = recurrenceEditMode || this.option('recurrenceEditMode');
    switch (editMode) {
      case 'series':
        callback();
        break;
      case 'occurrence':
        this._excludeAppointmentFromSeries(rawAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
        break;
      default:
        if (dragEvent) {
          // @ts-expect-error
          dragEvent.cancel = new Deferred();
        }
        this._showRecurrenceChangeConfirm(isDeleted)
          .done((editingMode) => {
            editingMode === RECURRENCE_EDITING_MODE.SERIES && callback();

            editingMode === RECURRENCE_EDITING_MODE.OCCURRENCE && this._excludeAppointmentFromSeries(
              rawAppointment,
              singleAppointment,
              exceptionDate,
              isDeleted,
              isPopupEditing,
              dragEvent,
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
    );

    const singleRawAppointment = { ...newRawAppointment };
    /* eslint-disable @typescript-eslint/no-dynamic-delete */
    delete singleRawAppointment[this._dataAccessors.expr.recurrenceExceptionExpr];
    delete singleRawAppointment[this._dataAccessors.expr.recurrenceRuleExpr];

    const keyPropertyName = this.appointmentDataSource.keyName;
    delete singleRawAppointment[keyPropertyName];
    /* eslint-enable @typescript-eslint/no-dynamic-delete */

    const canCreateNewAppointment = !isDeleted && !isPopupEditing;
    if (canCreateNewAppointment) {
      this.addAppointment(singleRawAppointment);
    }

    if (isPopupEditing) {
      this._appointmentPopup.show(singleRawAppointment, {
        isToolbarVisible: true,
        action: ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES,
        excludeInfo: {
          sourceAppointment: rawAppointment,
          updatedAppointment: appointment.source,
        },
      });
      this._editAppointmentData = rawAppointment;
    } else {
      this._updateAppointment(rawAppointment, appointment.source, () => {
        this._appointments.moveAppointmentBack(dragEvent);
      }, dragEvent);
    }
  }

  _createRecurrenceException(appointment, exceptionDate) {
    const result: any[] = [];

    if (appointment.recurrenceException) {
      result.push(appointment.recurrenceException);
    }
    result.push(this._getSerializedDate(exceptionDate, appointment.startDate, appointment.allDay));

    return result.join();
  }

  _getSerializedDate(date, startDate, isAllDay) {
    isAllDay && date.setHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      startDate.getMilliseconds(),
    );

    return dateSerialization.serializeDate(date, UTC_FULL_DATE_FORMAT);
  }

  _showRecurrenceChangeConfirm(isDeleted) {
    const title = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteTitle' : 'dxScheduler-confirmRecurrenceEditTitle');
    const message = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteMessage' : 'dxScheduler-confirmRecurrenceEditMessage');
    const seriesText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteSeries' : 'dxScheduler-confirmRecurrenceEditSeries');
    const occurrenceText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteOccurrence' : 'dxScheduler-confirmRecurrenceEditOccurrence');

    this._recurrenceDialog = customDialog({
      title,
      messageHtml: message,
      showCloseButton: true,
      showTitle: true,
      buttons: [
        { text: seriesText, onClick() { return RECURRENCE_EDITING_MODE.SERIES; } },
        { text: occurrenceText, onClick() { return RECURRENCE_EDITING_MODE.OCCURRENCE; } },
      ],
      popupOptions: {
        wrapperAttr: { class: 'dx-dialog' },
      },
    } as any);

    return this._recurrenceDialog.show();
  }

  _getUpdatedData(rawAppointment) {
    const viewOffset = this.getViewOffsetMs();

    const getConvertedFromGrid = (date: any): Date | undefined => {
      if (!date) {
        return undefined;
      }

      const result = this.timeZoneCalculator.createDate(date, 'fromGrid');
      return dateUtilsTs.addOffsets(result, [-viewOffset]);
    };

    const targetCell = this.getTargetCellData();
    const appointment = new AppointmentAdapter(
      rawAppointment,
      this._dataAccessors,
    );

    const cellStartDate = getConvertedFromGrid(targetCell.startDate);
    const cellEndDate = getConvertedFromGrid(targetCell.endDate);

    let appointmentStartDate = new Date(appointment.startDate);
    appointmentStartDate = dateUtilsTs.addOffsets(appointmentStartDate, [-viewOffset]);
    let appointmentEndDate = new Date(appointment.endDate);
    appointmentEndDate = dateUtilsTs.addOffsets(appointmentEndDate, [-viewOffset]);
    let resultedStartDate = cellStartDate ?? appointmentStartDate;

    if (!dateUtilsTs.isValidDate(appointmentStartDate)) {
      appointmentStartDate = resultedStartDate;
    }

    if (!dateUtilsTs.isValidDate(appointmentEndDate)) {
      appointmentEndDate = cellEndDate!;
    }

    const duration = appointmentEndDate.getTime() - appointmentStartDate.getTime();

    const isKeepAppointmentHours = this._workSpace.keepOriginalHours()
            && dateUtilsTs.isValidDate(appointment.startDate)
            && dateUtilsTs.isValidDate(cellStartDate);

    if (isKeepAppointmentHours) {
      const startDate = this.timeZoneCalculator.createDate(appointmentStartDate, 'toGrid');
      const timeInMs = startDate.getTime() - dateUtils.trimTime(startDate).getTime();

      const targetCellStartDate = dateUtilsTs.addOffsets(targetCell.startDate, [-viewOffset]);
      resultedStartDate = new Date(dateUtils.trimTime(targetCellStartDate).getTime() + timeInMs);
      resultedStartDate = this.timeZoneCalculator.createDate(resultedStartDate, 'fromGrid');
    }

    const result = new AppointmentAdapter(
      {},
      this._dataAccessors,
    );

    if (targetCell.allDay !== undefined) {
      result.allDay = targetCell.allDay;
    }
    result.startDate = resultedStartDate;

    let resultedEndDate = new Date(resultedStartDate.getTime() + duration);

    if (this.appointmentTakesAllDay(rawAppointment) && !result.allDay && this._workSpace.supportAllDayRow()) {
      resultedEndDate = this._workSpace.calculateEndDate(resultedStartDate);
    }

    if (appointment.allDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
      const dateCopy = new Date(resultedStartDate);
      dateCopy.setHours(0);

      resultedEndDate = new Date(dateCopy.getTime() + duration);

      if (resultedEndDate.getHours() !== 0) {
        resultedEndDate.setHours(this.getViewOption('endDayHour'));
      }
    }

    result.startDate = dateUtilsTs.addOffsets(result.startDate, [viewOffset]);
    result.endDate = dateUtilsTs.addOffsets(resultedEndDate, [viewOffset]);
    const rawResult = result.source;

    setAppointmentGroupValues(rawResult, this.resourceManager.resourceById, targetCell.groups);

    return rawResult;
  }

  getTargetedAppointment(appointment, element) {
    const settings = utils.dataAccessors.getAppointmentSettings(element)!;
    const info = 'info' in settings ? settings.info : undefined;

    const adapter = new AppointmentAdapter(
      appointment,
      this._dataAccessors,
    );

    const targetedAdapter = adapter.clone();

    if (this._isAgenda() && adapter.isRecurrent) {
      const { agendaSettings } = settings as AppointmentAgendaViewModel;

      targetedAdapter.startDate = this._dataAccessors.get('startDate', agendaSettings);
      targetedAdapter.endDate = this._dataAccessors.get('endDate', agendaSettings);
    } else if (settings) {
      targetedAdapter.startDate = info ? info.sourceAppointment.startDate : adapter.startDate; // TODO: in agenda we haven't info field
      targetedAdapter.endDate = info ? info.sourceAppointment.endDate : adapter.endDate;
    }

    const rawTargetedAppointment = targetedAdapter.source;
    if (element) {
      this.setTargetedAppointmentResources(rawTargetedAppointment, element);
    }

    if (info) {
      rawTargetedAppointment.displayStartDate = new Date(info.appointment.startDate);
      rawTargetedAppointment.displayEndDate = new Date(info.appointment.endDate);
    }

    return rawTargetedAppointment;
  }

  subscribe(subject, action) {
    this._subscribes[subject] = subscribes[subject] = action;
  }

  fire<Subject extends SubscribeKey>(
    subject: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> {
    const callback = this._subscribes[subject];

    if (!isFunction(callback)) {
      throw errors.Error('E1031', subject);
    }

    return callback.call(this, ...args);
  }

  getTargetCellData() {
    return this._workSpace.getDataByDroppableCell();
  }

  _updateAppointment(target, rawAppointment, onUpdatePrevented?: any, dragEvent?: any) {
    const updatingOptions = {
      newData: rawAppointment,
      oldData: extend({}, target),
      cancel: false,
    };

    const performFailAction = function (err?: any) {
      if (onUpdatePrevented) {
        onUpdatePrevented.call(this);
      }

      if (err && err.name === 'Error') {
        throw err;
      }
    }.bind(this);

    this._actions[StoreEventNames.UPDATING](updatingOptions);

    if (dragEvent && !isDeferred(dragEvent.cancel)) {
      // @ts-expect-error
      dragEvent.cancel = new Deferred();
    }

    return this._processActionResult(updatingOptions, function (canceled) {
      // @ts-expect-error
      let deferred = new Deferred();

      if (!canceled) {
        this._expandAllDayPanel(rawAppointment);

        try {
          deferred = this.appointmentDataSource
            .update(target, rawAppointment)
            .done(() => {
              dragEvent?.cancel.resolve(false);
            })
            .always((storeAppointment) => this._onDataPromiseCompleted(StoreEventNames.UPDATED, storeAppointment))
            .fail(() => performFailAction());
        } catch (err) {
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
    // @ts-expect-error
    const deferred = new Deferred();
    const resolveCallback = (callbackResult) => {
      when(fromPromise(callbackResult))
        .always(deferred.resolve);
    };

    if (isPromise(actionOptions.cancel)) {
      when(fromPromise(actionOptions.cancel)).always((cancel) => {
        if (!isDefined(cancel)) {
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
    if (!this._isAllDayExpanded() && this.appointmentTakesAllDay(appointment)) {
      this._updateOption('workSpace', 'allDayExpanded', true);
    }
  }

  _onDataPromiseCompleted(handlerName, storeAppointment, appointment?: any) {
    const args: any = { appointmentData: appointment || storeAppointment };

    if (storeAppointment instanceof Error) {
      args.error = storeAppointment;
    } else {
      this._appointmentPopup.visible && this._appointmentPopup.hide();
    }

    this._actions[handlerName](args);
    this._fireContentReadyAction();
  }

  /// #DEBUG
  getAppointmentDetailsForm() { // for tests
    return this._appointmentForm.form;
  }
  /// #ENDDEBUG

  getAppointmentsInstance() {
    return this._appointments;
  }

  getLayoutManager() {
    return this._layoutManager;
  }

  getActions() {
    return this._actions;
  }

  appointmentTakesAllDay(rawAppointment) {
    const appointment = new AppointmentAdapter(
      rawAppointment,
      this._dataAccessors,
    );

    return isAppointmentTakesAllDay(
      appointment,
      this.getViewOption('allDayPanelMode'),
    );
  }

  dayHasAppointment(day, rawAppointment, trimTime) {
    const getConvertedToTimeZone = (date) => this.timeZoneCalculator.createDate(date, 'toGrid');

    const appointment = new AppointmentAdapter(
      rawAppointment,
      this._dataAccessors,
    );

    let startDate = new Date(appointment.startDate);
    let endDate = new Date(appointment.endDate);

    startDate = getConvertedToTimeZone(startDate);
    endDate = getConvertedToTimeZone(endDate);

    if (day.getTime() === endDate.getTime()) {
      return startDate.getTime() === endDate.getTime();
    }

    if (trimTime) {
      day = dateUtils.trimTime(day);
      startDate = dateUtils.trimTime(startDate);
      endDate = dateUtils.trimTime(endDate);
    }

    const dayTimeStamp = day.getTime();
    const startDateTimeStamp = startDate.getTime();
    const endDateTimeStamp = endDate.getTime();

    return startDateTimeStamp <= dayTimeStamp && dayTimeStamp <= endDateTimeStamp;
  }

  setTargetedAppointmentResources(rawAppointment, element) {
    const groups = this.getViewOption('groups');

    if (groups?.length) {
      const { resourceById, groupsLeafs } = this.resourceManager;
      const appointmentSettings = utils.dataAccessors.getAppointmentSettings(element);
      const cellGroups = getLeafGroupValues(groupsLeafs, appointmentSettings?.groupIndex);

      setAppointmentGroupValues(rawAppointment, resourceById, cellGroups);
    }
  }

  getStartViewDate() {
    return this._workSpace?.getStartViewDate();
  }

  getEndViewDate() {
    return this._workSpace.getEndViewDate();
  }

  showAddAppointmentPopup(cellData, cellGroups) {
    const appointmentAdapter = new AppointmentAdapter({}, this._dataAccessors);

    appointmentAdapter.allDay = Boolean(cellData.allDay);
    appointmentAdapter.startDate = cellData.startDateUTC;
    appointmentAdapter.endDate = cellData.endDateUTC;

    const resultAppointment = extend(appointmentAdapter.source, cellGroups);
    this.showAppointmentPopup(resultAppointment, true);
  }

  showAppointmentPopup(rawAppointment, createNewAppointment, rawTargetedAppointment?: any) {
    const newRawTargetedAppointment = { ...rawTargetedAppointment };
    if (newRawTargetedAppointment) {
      delete newRawTargetedAppointment.displayStartDate;
      delete newRawTargetedAppointment.displayEndDate;
    }

    const newTargetedAppointment = extend({}, rawAppointment, newRawTargetedAppointment);

    const isCreateAppointment = createNewAppointment ?? isEmptyObject(rawAppointment);

    if (isEmptyObject(rawAppointment)) {
      rawAppointment = this.createPopupAppointment();
    }

    if (isCreateAppointment) {
      delete this._editAppointmentData; // TODO
      this._editing.allowAdding && this._appointmentPopup.show(rawAppointment, {
        isToolbarVisible: true,
        action: ACTION_TO_APPOINTMENT.CREATE,
      });
    } else {
      const startDate = this._dataAccessors.get('startDate', newRawTargetedAppointment || rawAppointment);

      this._checkRecurringAppointment(rawAppointment, newTargetedAppointment, startDate, () => {
        this._editAppointmentData = rawAppointment; // TODO

        this._appointmentPopup.show(rawAppointment, {
          isToolbarVisible: this._editing.allowUpdating,
          action: ACTION_TO_APPOINTMENT.UPDATE,
        });
      }, false, true);
    }
  }

  createPopupAppointment() {
    const result: any = {};
    const toMs = dateUtils.dateToMilliseconds;

    const startDate = new Date(this.option('currentDate'));
    const endDate = new Date(startDate.getTime() + this.option('cellDuration') * toMs('minute'));

    this._dataAccessors.set('startDate', result, startDate);
    this._dataAccessors.set('endDate', result, endDate);

    return result;
  }

  hideAppointmentPopup(saveChanges?: any) {
    if (this._appointmentPopup?.visible) {
      saveChanges && this._appointmentPopup.saveChangesAsync();
      this._appointmentPopup.hide();
    }
  }

  showAppointmentTooltip(appointment, element, targetedAppointment) {
    if (appointment) {
      const settings: any = utils.dataAccessors.getAppointmentSettings(element);

      const appointmentConfig = {
        itemData: targetedAppointment || appointment,
        groupIndex: settings?.groupIndex,
        groups: this.option('groups'),
      };

      const getAppointmentColor = this.createGetAppointmentColor();
      const deferredColor = getAppointmentColor(appointmentConfig) as any;

      const info = new AppointmentTooltipInfo(appointment, targetedAppointment, deferredColor);
      this.showAppointmentTooltipCore(element, [info]);
    }
  }

  createGetAppointmentColor() {
    return (appointmentConfig) => fromPromise(
      this.resourceManager.getAppointmentColor(appointmentConfig),
    );
  }

  showAppointmentTooltipCore(target: dxElementWrapper, data, options?: any) {
    const arg: Omit<AppointmentTooltipShowingEvent, 'component' | 'element'> = {
      cancel: false,
      appointments: data.map((item) => {
        const result = {
          appointmentData: item.appointment,
          currentAppointmentData: { ...item.targetedAppointment },
          color: item.color,
        };

        if (item.settings.info) {
          const { startDate, endDate } = item.settings.info.appointment;

          result.currentAppointmentData.displayStartDate = startDate;
          result.currentAppointmentData.displayEndDate = endDate;
        }

        return result;
      }),
      targetElement: getPublicElement(target),
    };

    this._createActionByOption('onAppointmentTooltipShowing')(arg);

    if (this._appointmentTooltip.isAlreadyShown(target)) {
      this.hideAppointmentTooltip();
    } else {
      this._processActionResult(arg, (canceled) => {
        !canceled && this._appointmentTooltip.show(target, data, { ...this._getExtraAppointmentTooltipOptions(), ...options });
      });
    }
  }

  hideAppointmentTooltip() {
    this._appointmentTooltip?.hide();
  }

  scrollToTime(hours, minutes, date) {
    errors.log('W0002', 'dxScheduler', 'scrollToTime', '21.1', 'Use the "scrollTo" method instead');
    this._workSpace.scrollToTime(hours, minutes, date);
  }

  scrollTo(date, groupValues, allDay) {
    this._workSpace.scrollTo(date, groupValues, allDay);
  }

  _isHorizontalVirtualScrolling() {
    const scrolling = this.option('scrolling');
    const { orientation, mode } = scrolling;
    const isVirtualScrolling = mode === 'virtual';

    return isVirtualScrolling
            && (orientation === 'horizontal' || orientation === 'both');
  }

  addAppointment(rawAppointment) {
    // NOTE: mutation of raw appointment
    const appointment = new AppointmentAdapter(
      rawAppointment,
      this._dataAccessors,
    );
    appointment.text = appointment.text || '';

    const serializedAppointment = appointment.serialize().source;

    const addingOptions = {
      appointmentData: serializedAppointment,
      cancel: false,
    };

    this._actions[StoreEventNames.ADDING](addingOptions);

    return this._processActionResult(addingOptions, (canceled) => {
      if (canceled) {
        // @ts-expect-error
        return new Deferred().resolve();
      }

      this._expandAllDayPanel(serializedAppointment);

      return this.appointmentDataSource
        .add(serializedAppointment)
        .always((storeAppointment) => this._onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment));
    });
  }

  updateAppointment(target, appointment) {
    return this._updateAppointment(target, appointment);
  }

  deleteAppointment(rawAppointment) {
    const deletingOptions = this.fireOnAppointmentDeleting(rawAppointment);
    this.processDeleteAppointment(rawAppointment, deletingOptions);
  }

  fireOnAppointmentDeleting(rawAppointment, targetedAppointmentData?: any) {
    const deletingOptions = {
      appointmentData: rawAppointment,
      targetedAppointmentData,
      cancel: false,
    };

    this._actions[StoreEventNames.DELETING](deletingOptions);

    return deletingOptions;
  }

  processDeleteAppointment(rawAppointment, deletingOptions) {
    this._processActionResult(deletingOptions, function (canceled) {
      if (!canceled) {
        this.appointmentDataSource
          .remove(rawAppointment)
          .always((storeAppointment) => this._onDataPromiseCompleted(
            StoreEventNames.DELETED,
            storeAppointment,
            rawAppointment,
          ));
      }
    });
  }

  deleteRecurrence(
    appointment,
    date: Date | string,
    recurrenceEditMode,
  ) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
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
    if (this._editAppointmentData) {
      this._appointments.focus();
    } else {
      this._workSpace.focus();
    }
  }

  getFirstDayOfWeek() {
    return isDefined(this.getViewOption('firstDayOfWeek'))
      ? this.getViewOption('firstDayOfWeek')
      : dateLocalization.firstDayOfWeekIndex();
  }

  _validateKeyFieldIfAgendaExist() {
    if (!this.appointmentDataSource.isDataSourceInit) {
      return;
    }

    const hasAgendaView = this.hasAgendaView();
    const isKeyNotExist = !this.appointmentDataSource.keyName;

    if (hasAgendaView && isKeyNotExist) {
      errors.log('W1023');
    }
  }

  _getDragBehavior() {
    return this._workSpace.dragBehavior;
  }

  getViewOffsetMs(): number {
    const offsetFromOptions = this.getViewOption('offset');
    return this.normalizeViewOffsetValue(offsetFromOptions);
  }

  private normalizeViewOffsetValue(viewOffset?: number): number {
    if (!isDefined(viewOffset) || this.currentView?.type === VIEWS.AGENDA) {
      return 0;
    }

    return viewOffset * toMs('minute');
  }
}

(Scheduler as any).include(DataHelperMixin);

// @ts-ignore
registerComponent('dxScheduler', Scheduler);

export default Scheduler;
