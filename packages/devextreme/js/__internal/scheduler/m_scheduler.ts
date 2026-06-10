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
import type {
  Appointment, AppointmentTooltipShowingEvent, DayOfWeek, Occurrence,
} from '@js/ui/scheduler';
import errors from '@js/ui/widget/ui.errors';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { OptionChanged } from '@ts/core/widget/types';

import { createA11yStatusContainer } from './a11y_status/a11y_status_render';
import { getA11yStatusText } from './a11y_status/a11y_status_text';
import { AppointmentDragController } from './appointment_drag_controller';
import type { AppointmentFormConfig } from './appointment_popup/form';
import { AppointmentForm } from './appointment_popup/form';
import { AppointmentPopup } from './appointment_popup/popup';
import AppointmentCollection from './appointments/m_appointment_collection';
import type { AppointmentsProperties } from './appointments_new/appointments';
import { Appointments } from './appointments_new/appointments';
import NotifyScheduler from './base/widget_notify_scheduler';
import { SchedulerHeader } from './header/header';
import type { HeaderOptions } from './header/types';
import { hide as hideLoading, show as showLoading } from './loading';
import { CompactAppointmentsHelper } from './m_compact_appointments_helper';
import type { SubscribeKey, SubscribeMethods } from './m_subscribes';
import subscribes from './m_subscribes';
import { combineRemoteFilter } from './r1/filterting/remote';
import { createTimeZoneCalculator } from './r1/timezone_calculator/index';
import {
  excludeFromRecurrence,
  getToday,
  isAppointmentTakesAllDay,
  isDateAndTimeView,
  isTimelineView,
} from './r1/utils/index';
import { validateRRule } from './recurrence/validate_rule';
import { SchedulerOptionsBaseWidget } from './scheduler_options_base_widget';
import { DesktopTooltipStrategy } from './tooltip_strategies/desktop_tooltip_strategy';
import { MobileTooltipStrategy } from './tooltip_strategies/mobile_tooltip_strategy';
import type { AppointmentTooltipExtraOptions } from './tooltip_strategies/tooltip_strategy_base';
import type {
  AppointmentTooltipItem,
  SafeAppointment,
  ScrollToGroupValuesOrOptions, ScrollToOptions, TargetedAppointment,
  ViewType,
} from './types';
import { utils } from './utils';
import { AppointmentAdapter } from './utils/appointment_adapter/appointment_adapter';
import { AppointmentDataAccessor } from './utils/data_accessor/appointment_data_accessor';
import { getTargetedAppointment } from './utils/get_targeted_appointment';
import type { IFieldExpr } from './utils/index';
import { macroTaskArray } from './utils/index';
import { isAgendaWorkspaceComponent } from './utils/is_agenda_workpace_component';
import { VIEWS } from './utils/options/constants_view';
import type { NormalizedView, SafeSchedulerOptions } from './utils/options/types';
import { getAppointmentGroupValues, setAppointmentGroupValues } from './utils/resource_manager/appointment_groups_utils';
import { ResourceManager } from './utils/resource_manager/resource_manager';
import timeZoneUtils, { type TimezoneLabel } from './utils_time_zone';
import AppointmentLayoutManager from './view_model/appointments_layout_manager';
import { AppointmentDataSource } from './view_model/m_appointment_data_source';
import type { AppointmentViewModelPlain } from './view_model/types';
import SchedulerAgenda from './workspaces/agenda';
import SchedulerTimelineDay from './workspaces/timeline_day';
import SchedulerTimelineMonth from './workspaces/timeline_month';
import SchedulerTimelineWeek from './workspaces/timeline_week';
import SchedulerWorkSpaceDay from './workspaces/work_space_day';
import SchedulerWorkSpaceMonth from './workspaces/work_space_month';
import SchedulerWorkSpaceWeek from './workspaces/work_space_week';

const toMs = dateUtils.dateToMilliseconds;

const WIDGET_CLASS = 'dx-scheduler';
const WIDGET_SMALL_CLASS = `${WIDGET_CLASS}-small`;
const WIDGET_ADAPTIVE_CLASS = `${WIDGET_CLASS}-adaptive`;
const WIDGET_READONLY_CLASS = `${WIDGET_CLASS}-readonly`;
export const POPUP_DIALOG_CLASS = 'dx-dialog';
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
    workSpace: SchedulerWorkSpaceWeek,
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
    workSpace: SchedulerTimelineWeek,
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
  private timeZoneCalculatorInstance!: any;

  postponedOperations: any;

  private a11yStatus!: dxElementWrapper;

  // TODO: used externally in m_appointment_drag_behavior.ts, m_subscribes.ts, workspaces/m_work_space.ts
  _workSpace: any;

  private header?: SchedulerHeader;

  // TODO: used externally in m_appointment_drag_behavior.ts, m_subscribes.ts, workspaces/m_work_space.ts
  _appointments: any;

  private appointmentDragController!: AppointmentDragController;

  appointmentDataSource!: AppointmentDataSource;

  _dataSource: any;

  // TODO: used externally in m_subscribes.ts, view_model/preparation/prepare_appointments.ts, view_model/filtration/utils/get_filter_options/get_filter_options.ts
  _dataAccessors!: AppointmentDataAccessor;

  resourceManager!: ResourceManager;

  private actions: any;

  _createActionByOption: any;

  private appointmentTooltip!: MobileTooltipStrategy | DesktopTooltipStrategy;

  private readyToRenderAppointments?: boolean;

  private editing: any;

  private workSpaceRecalculation: any;

  private appointmentPopup: any;

  // TODO: used externally in m_subscribes.ts
  _compactAppointmentsHelper!: CompactAppointmentsHelper;

  private asyncTemplatesTimers!: any[];

  private readonly updatingAppointments: Set<Appointment> = new Set();

  private dataSourceLoadedCallback: any;

  private subscribes: any;

  private notifyScheduler!: NotifyScheduler;

  private recurrenceDialog: any;

  // TODO: used externally in m_subscribes.ts
  _layoutManager!: AppointmentLayoutManager;

  private appointmentForm: any;

  private mainContainer: any;

  private $draggableContainer?: dxElementWrapper;

  private readonly all: any;

  _options: any;

  private editAppointmentData: any;

  private timeZonesPromise!: Promise<TimezoneLabel[]>;

  get timeZoneCalculator() {
    if (!this.timeZoneCalculatorInstance) {
      this.timeZoneCalculatorInstance = createTimeZoneCalculator(this.option('timeZone'));
    }

    return this.timeZoneCalculatorInstance;
  }

  private postponeDataSourceLoading(promise?: any) {
    this.postponedOperations.add('_reloadDataSource', this.reloadDataSource.bind(this), promise);
  }

  private postponeResourceLoading(forceReload = false) {
    const whenLoaded = this.postponedOperations.add('loadResources', () => {
      const groups = this.getViewOption('groups');

      return fromPromise(this.resourceManager.loadGroupResources(groups, forceReload));
    });

    // @ts-expect-error
    const resolveCallbacks = new Deferred();

    whenLoaded.done(() => {
      resolveCallbacks.resolve();
    });

    this.postponeDataSourceLoading(whenLoaded);

    return resolveCallbacks.promise();
  }

  _optionChanged(args: OptionChanged<SafeSchedulerOptions>): void {
    this.schedulerOptionChanged(args);

    const { value, name } = args;

    switch (args.name) {
      case 'customizeDateNavigatorText':
        this.updateOption('header', name, value);
        break;
      case 'firstDayOfWeek':
        this.updateOption('workSpace', name, value);
        this.updateOption('header', name, value);
        this.createAppointmentPopupForm();
        break;
      case 'currentDate': {
        const dateValue = this.getViewOption(name);
        this.option('selectedCellData', []);
        this.updateOption('workSpace', name, dateValue);
        this.updateOption('header', name, dateValue);
        this.updateOption('header', 'startViewDate', this.getStartViewDate());
        this._appointments.option('items', []);
        this.setRemoteFilterIfNeeded();

        this.postponeDataSourceLoading();
        break;
      }
      case 'dataSource':
        // @ts-expect-error
        this._initDataSource();

        this.postponeResourceLoading().done(() => {
          this.appointmentDataSource.setDataSource(this._dataSource);
          this.setRemoteFilterIfNeeded();
          this.updateOption('workSpace', 'showAllDayPanel', this.option('showAllDayPanel'));
        });
        break;
      case 'min':
      case 'max': {
        const value = this.getViewOption(name);
        this.updateOption('header', name, value);
        this.updateOption('workSpace', name, value);
        break;
      }
      case 'views':
        if (this.currentView) {
          this.repaint();
        } else {
          this.updateOption('header', 'views', this.views);
        }
        break;
      case 'hiddenWeekDays':
        this.repaint();
        break;
      case 'useDropDownViewSwitcher':
        this.updateOption('header', name, value);
        break;
      case 'currentView':

        if (this.option('_newAppointments')) {
          this._appointments.option({
            currentView: value,
            viewModel: [],
            appointmentTemplate: this.getViewOption('appointmentTemplate'),
            appointmentCollectorTemplate: this.getViewOption('appointmentCollectorTemplate'),
          });
        } else {
          this._appointments.option({
            items: [],
            allowDrag: this.allowDragging(),
            allowResize: this.allowResizing(),
            itemTemplate: this.getAppointmentTemplate('appointmentTemplate'),
          });
        }

        this.postponeResourceLoading().done(() => {
          this.refreshWorkSpace();
          this.header?.option(this.headerConfig());
          this.setRemoteFilterIfNeeded();

          if (!this.option('_newAppointments')) {
            this._appointments.option('allowAllDayResize', value !== 'day');
          }
        });
        // NOTE:
        // Calling postponed operations (promises) here, because when we update options with
        // usage of the beginUpdate / endUpdate methods, other option changes
        // may try to access not initialized values inside the scheduler component.
        this.postponedOperations.callPostponedOperations();
        break;
      case 'appointmentTemplate':
        if (this.option('_newAppointments')) {
          this._appointments.option('appointmentTemplate', this.getViewOption('appointmentTemplate'));
        } else {
          this._appointments.option('itemTemplate', value);
        }
        break;
      case 'dateCellTemplate':
      case 'resourceCellTemplate':
      case 'dataCellTemplate':
      case 'timeCellTemplate':
        this.repaint();
        break;
      case 'groups':
        this.postponeResourceLoading().done(() => {
          this.refreshWorkSpace();
          this.setRemoteFilterIfNeeded();
        });
        break;
      case 'resources':
        this.resourceManager?.dispose();
        this.resourceManager = new ResourceManager(this.option('resources'));
        this.updateAppointmentDataSource();
        this.createAppointmentPopupForm();

        this.postponeResourceLoading().done(() => {
          this._appointments.option('items', []);
          this.refreshWorkSpace();
          this.setRemoteFilterIfNeeded();
        });
        break;
      case 'startDayHour':
      case 'endDayHour':
        this.updateAppointmentDataSource();

        this._appointments.option('items', []);
        this.updateOption('workSpace', name, value);
        if (!this.option('_newAppointments')) {
          // TODO<Appointments>: no need to call repaint on new appointments
          this._appointments.repaint();
        }
        this.setRemoteFilterIfNeeded();

        this.postponeDataSourceLoading();
        this.createAppointmentPopupForm();
        break;
      // TODO Vinogradov refactoring: merge it with startDayHour / endDayHour
      case 'offset':

        this.updateAppointmentDataSource();

        this._appointments.option('items', []);
        this.updateOption('workSpace', 'viewOffset', this.normalizeViewOffsetValue(value));
        if (!this.option('_newAppointments')) {
          // TODO<Appointments>: no need to call repaint on new appointments
          this._appointments.repaint();
        }
        this.setRemoteFilterIfNeeded();

        this.postponeDataSourceLoading();
        break;
      case StoreEventNames.ADDING:
      case StoreEventNames.ADDED:
      case StoreEventNames.UPDATING:
      case StoreEventNames.UPDATED:
      case StoreEventNames.DELETING:
      case StoreEventNames.DELETED:
      case 'onAppointmentFormOpening':
      case 'onAppointmentTooltipShowing':
      case 'onSelectionEnd':
        this.actions[name] = this._createActionByOption(name);
        break;
      case 'onAppointmentRendered':
        if (this.option('_newAppointments')) {
          this.actions.onAppointmentRendered = this._createActionByOption('onAppointmentRendered');
        } else {
          this._appointments.option('onItemRendered', this.getAppointmentRenderedAction());
        }
        break;
      case 'onAppointmentClick':
        if (this.option('_newAppointments')) {
          this.actions.onAppointmentClick = this._createActionByOption('onAppointmentClick');
        } else {
          this._appointments.option('onItemClick', this._createActionByOption(name));
        }
        break;
      case 'onAppointmentDblClick':
        if (this.option('_newAppointments')) {
          this.actions.onAppointmentDblClick = this._createActionByOption('onAppointmentDblClick');
        } else {
          this._appointments.option(name, this._createActionByOption(name));
        }
        break;
      case 'onAppointmentContextMenu':
        if (this.option('_newAppointments')) {
          this.actions.onAppointmentContextMenu = this._createActionByOption('onAppointmentContextMenu');
        } else {
          this._appointments.option('onItemContextMenu', this._createActionByOption(name));
        }
        this.appointmentTooltip._options.onItemContextMenu = this._createActionByOption(name);
        break;
      case 'noDataText':
      case 'allowMultipleCellSelection':
      case 'selectedCellData':
      case 'accessKey':
      case 'onCellClick':
        this.updateOption('workSpace', name, value);
        break;
      case 'onCellContextMenu':
        this.updateOption('workSpace', name, value);
        break;
      case 'crossScrollingEnabled':
        this.postponeResourceLoading().done(() => {
          this._appointments.option('items', []);
          this.refreshWorkSpace();
          if (this.readyToRenderAppointments) {
            this._appointments.option('items', this._layoutManager.generateViewModel());
          }
        });
        break;
      case 'cellDuration':
        this.updateOption('workSpace', name, value);
        this._appointments.option('items', []);
        if (this.readyToRenderAppointments) {
          this.updateOption('workSpace', 'hoursInterval', value / 60);
          this._appointments.option('items', this._layoutManager.generateViewModel());
        }
        break;
      case 'snapToCellsMode':
        this._appointments.option('items', []);
        if (this.readyToRenderAppointments) {
          this._appointments.option('items', this._layoutManager.generateViewModel());
        }
        break;
      case 'tabIndex':
      case 'focusStateEnabled':
        this.updateOption('header', name, value);
        this.updateOption('workSpace', name, value);
        this._appointments.option(name, value);
        // @ts-expect-error
        super._optionChanged(args);
        break;
      case 'width':
        // TODO: replace with css
        this.updateOption('header', name, value);
        if (this.option('crossScrollingEnabled')) {
          this.updateOption('workSpace', 'width', value);
        }
        this.updateOption('workSpace', 'schedulerWidth', value);
        // @ts-expect-error
        super._optionChanged(args);
        this._dimensionChanged(null, true);
        break;
      case 'height':
        // @ts-expect-error
        super._optionChanged(args);
        this._dimensionChanged(null, true);
        this.updateOption('workSpace', 'schedulerHeight', value);
        break;
      case 'editing': {
        this.initEditing();
        const { editing } = this;

        if (this.option('_newAppointments')) {
          this._appointments.option('allowDelete', this.editing.allowDeleting);
        } else {
          this.bringEditingModeToAppointments(editing);
        }

        this.hideAppointmentTooltip();
        this.createAppointmentPopupForm();
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
        this.updateOption('workSpace', name, value);
        this.repaint();
        break;
      case 'skippedDays':
        break;
      case 'indicatorTime':
        this.updateOption('workSpace', name, value);
        this.updateOption('header', name, value);
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
      case 'appointmentCollectorTemplate':
        if (this.option('_newAppointments')) {
          this._appointments.option('appointmentCollectorTemplate', this.getViewOption('appointmentCollectorTemplate'));
        } else {
          this.repaint();
        }
        break;
      case '_appointmentTooltipOffset':
        this.repaint();
        break;
      case 'dateSerializationFormat':
        break;
      case 'maxAppointmentsPerCell':
        this.repaint();
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
      case 'visibleExpr':
        this.updateExpression(name, value);
        this.initAppointmentTemplate();
        this.repaint();
        break;
      case 'adaptivityEnabled':
        this.toggleAdaptiveClass();
        this.repaint();
        break;
      case 'scrolling':
        this.option('crossScrollingEnabled', this.isHorizontalVirtualScrolling() || this.option('crossScrollingEnabled'));

        this.updateOption('workSpace', args.fullName, value);
        break;
      case 'allDayPanelMode':
        this.updateAppointmentDataSource();
        this.updateOption('workSpace', args.fullName, value);
        break;
      case '_draggingMode':
        this.updateOption('workSpace', 'draggingMode', value);
        break;
      case 'toolbar':
        this.header
          ? this.header.onToolbarOptionChanged(args.fullName, value)
          : this.repaint();
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  private bringEditingModeToAppointments(editing) {
    const editingConfig: any = {
      allowDelete: editing.allowUpdating && editing.allowDeleting,
    };

    if (!this.isAgenda()) {
      editingConfig.allowDrag = editing.allowDragging;
      editingConfig.allowResize = editing.allowResizing;
      editingConfig.allowAllDayResize = editing.allowResizing && this.supportAllDayResizing();
    }

    this._appointments.option(editingConfig);
    this.repaint();
  }

  private isAgenda() {
    return this.currentView.type === 'agenda';
  }

  private allowDragging(): boolean {
    return this.editing.allowDragging && !this.isAgenda();
  }

  private canDragAppointment(appointmentData: Appointment): boolean {
    return this.allowDragging() && !this._isAppointmentBeingUpdated(appointmentData);
  }

  private allowResizing() {
    return this.editing.allowResizing && !this.isAgenda();
  }

  private allowAllDayResizing() {
    return this.editing.allowResizing && this.supportAllDayResizing();
  }

  private supportAllDayResizing() {
    return this.currentView.type !== 'day' || this.currentView.intervalCount > 1;
  }

  private isAllDayExpanded() {
    return this.option('showAllDayPanel') && this._layoutManager.hasAllDayAppointments();
  }

  private setRemoteFilterIfNeeded(): void {
    const dataSource = this._dataSource;
    const remoteFiltering = this.option('remoteFiltering');

    if (!this._workSpace || !remoteFiltering || !dataSource) {
      return;
    }

    const dateRange = this._workSpace.getDateRange();
    const startDate = this.timeZoneCalculator.createDate(dateRange[0], 'fromGrid');
    const endDate = this.timeZoneCalculator.createDate(dateRange[1], 'fromGrid');

    const dateSerializationFormat = this.option('dateSerializationFormat');
    const dataSourceFilter = dataSource.filter();

    const filter = combineRemoteFilter({
      dataSourceFilter,
      dataAccessors: this._dataAccessors,
      min: startDate,
      max: endDate,
      dateSerializationFormat,
      forceIsoDateParsing: config().forceIsoDateParsing,
    });

    dataSource.filter(filter);
  }

  private reloadDataSource() {
    // @ts-expect-error
    const result = new Deferred();

    if (this._dataSource) {
      this._dataSource.load().done(() => {
        hideLoading().catch(noop);

        this._fireContentReadyAction(result);
      }).fail(() => {
        hideLoading().catch(noop);
        result.reject();
      });

      if (this._dataSource.isLoading()) {
        showLoading({
          container: this.$element().get(0),
          position: {
            of: this.$element() as any,
          },
        }).catch(noop);
      }
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

    if (this.workSpaceRecalculation) {
      this.workSpaceRecalculation?.done(() => {
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

    this.toggleSmallClass();

    const workspace = this.getWorkSpace();

    if (
      !this.isAgenda()
      && this._layoutManager
      && workspace
      && !isAgendaWorkspaceComponent(workspace)
    ) {
      if (isForce || (!isFixedHeight || !isFixedWidth)) {
        workspace.option('allDayExpanded', this.isAllDayExpanded());
        workspace._dimensionChanged();
        const appointments = this._layoutManager.generateViewModel();

        this._appointments.option('items', appointments);
      }
    }

    this.hideAppointmentTooltip();

    // TODO popup
    this.appointmentPopup.triggerResize();
    this.appointmentPopup.updatePopupFullScreenMode();
  }

  _clean() {
    this.cleanPopup();
    // @ts-expect-error
    super._clean();
  }

  private toggleSmallClass() {
    const { width } = getBoundingRect((this.$element() as any).get(0));
    (this.$element() as any).toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
  }

  private toggleAdaptiveClass() {
    (this.$element() as any).toggleClass(WIDGET_ADAPTIVE_CLASS, this.option('adaptivityEnabled'));
  }

  _visibilityChanged(visible) {
    visible && this._dimensionChanged(null, true);
  }

  _dataSourceOptions() {
    return { paginate: false };
  }

  private initAllDayPanel() {
    if (this.option('allDayPanelMode') === 'hidden') {
      this.option('showAllDayPanel', false);
    }
  }

  _init() {
    this.timeZonesPromise = timeZoneUtils.cacheTimeZones();
    this.initExpressions({
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
      visibleExpr: this.option('visibleExpr'),
    } as IFieldExpr);

    super._init();

    this.initAllDayPanel();

    // @ts-expect-error
    this._initDataSource();

    this.customizeDataSourceLoadOptions();

    (this.$element() as any).addClass(WIDGET_CLASS);

    this.initEditing();

    this.updateAppointmentDataSource();

    this.initActions();

    this._compactAppointmentsHelper = new CompactAppointmentsHelper(this);

    this.asyncTemplatesTimers = [];

    this.dataSourceLoadedCallback = Callbacks();

    this.subscribes = subscribes;

    this.resourceManager = new ResourceManager(this.option('resources'));

    this.notifyScheduler = new NotifyScheduler({ scheduler: this });

    this.appointmentDragController = new AppointmentDragController({
      component: this,
      $draggableContainer: () => this.$draggableContainer!,
      canDragAppointment: this.canDragAppointment.bind(this),
      getCellFromDragTarget: ($dragTarget) => this._workSpace.getCellFromDragTarget($dragTarget),

      // @ts-expect-error _createComponent is not defined in ts
      createComponent: this._createComponent.bind(this),
      hideAppointmentTooltip: this.hideAppointmentTooltip.bind(this),

      updateAppointmentOnDrop: this.updateAppointmentOnDrop.bind(this),
    });
  }

  createAppointmentDataSource() {
    this.appointmentDataSource?.destroy();
    this.appointmentDataSource = new AppointmentDataSource(this._dataSource);
  }

  updateAppointmentDataSource() {
    this.timeZoneCalculatorInstance = null;

    if (this.getWorkSpace()) {
      this.createAppointmentDataSource();
    }
  }

  private customizeDataSourceLoadOptions() {
    this._dataSource?.on('customizeStoreLoadOptions', ({ storeLoadOptions }) => {
      storeLoadOptions.startDate = this.getStartViewDate();
      storeLoadOptions.endDate = this.getEndViewDate();
    });
  }

  _initTemplates() {
    this.initAppointmentTemplate();

    this._templateManager.addDefaultTemplates({
      appointmentTooltip: new EmptyTemplate(),
      dropDownAppointment: new EmptyTemplate(),
    });
    // @ts-expect-error
    super._initTemplates();
  }

  // TODO<Appointments>: delete this method when old impl is removed
  private initAppointmentTemplate() {
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
    if (this.readyToRenderAppointments) {
      this.workSpaceRecalculation.done(() => {
        this._layoutManager.prepareAppointments(result);
        this.renderAppointments();
        this.updateA11yStatus();
      });
    }
  }

  isVirtualScrolling(): boolean {
    const workspace = this.getWorkSpace();

    if (workspace) {
      return workspace.isVirtualScrolling();
    }

    const scrolling = this.getViewOption('scrolling');

    return scrolling?.mode === 'virtual';
  }

  private renderAppointments() {
    const workspace = this.getWorkSpace();
    this._layoutManager.filterAppointments();

    workspace.option('allDayExpanded', this.isAllDayExpanded());

    // @ts-expect-error
    const viewModel: AppointmentViewModelPlain[] = this._isVisible()
      ? this._layoutManager.generateViewModel()
      : [];

    this._appointments.option('items', viewModel);
    this.appointmentDataSource.cleanState();

    if (this.isAgenda()) {
      this._workSpace.renderAgendaLayout(viewModel);
    }
  }

  private initExpressions(fields: IFieldExpr) {
    this._dataAccessors = new AppointmentDataAccessor(
      fields,
      Boolean(config().forceIsoDateParsing),
      this.option('dateSerializationFormat'),
    );
  }

  private updateExpression(name: string, value: string) {
    this._dataAccessors.updateExpression(name, value);
  }

  private initEditing() {
    const editing = this.option('editing');

    this.editing = {
      allowAdding: Boolean(editing),
      allowUpdating: Boolean(editing),
      allowDeleting: Boolean(editing),
      allowResizing: Boolean(editing),
      allowDragging: Boolean(editing),
    };

    if (isObject(editing)) {
      this.editing = extend(this.editing, editing);
    }

    this.editing.allowDragging = this.editing.allowDragging && this.editing.allowUpdating;
    this.editing.allowResizing = this.editing.allowResizing && this.editing.allowUpdating;

    const isReadOnly = Object.values({
      ...this.editing,
      form: undefined,
      popup: undefined,
    }).every((value) => !value);

    (this.$element() as any).toggleClass(WIDGET_READONLY_CLASS, isReadOnly);
  }

  _dispose() {
    this.resourceManager?.dispose();
    this.appointmentTooltip?.dispose();
    this.recurrenceDialog?.hide(RECURRENCE_EDITING_MODE.CANCEL);

    this.hideAppointmentPopup();
    this.hideAppointmentTooltip();

    this.asyncTemplatesTimers.forEach(clearTimeout);
    this.asyncTemplatesTimers = [];

    // NOTE: Stop all scheduled macro tasks
    macroTaskArray.dispose();

    // @ts-expect-error
    super._dispose();
  }

  private initActions() {
    this.actions = {
      onAppointmentAdding: this._createActionByOption(StoreEventNames.ADDING),
      onAppointmentAdded: this._createActionByOption(StoreEventNames.ADDED),
      onAppointmentUpdating: this._createActionByOption(StoreEventNames.UPDATING),
      onAppointmentUpdated: this._createActionByOption(StoreEventNames.UPDATED),
      onAppointmentDeleting: this._createActionByOption(StoreEventNames.DELETING),
      onAppointmentDeleted: this._createActionByOption(StoreEventNames.DELETED),
      onAppointmentFormOpening: this._createActionByOption('onAppointmentFormOpening'),
      onAppointmentTooltipShowing: this._createActionByOption('onAppointmentTooltipShowing'),
      onSelectionEnd: this._createActionByOption('onSelectionEnd'),
      onAppointmentRendered: this._createActionByOption('onAppointmentRendered'),
      onAppointmentClick: this._createActionByOption('onAppointmentClick'),
      onAppointmentDblClick: this._createActionByOption('onAppointmentDblClick'),
      onAppointmentContextMenu: this._createActionByOption('onAppointmentContextMenu'),
    };
  }

  // TODO<Appointments>: delete this method when old impl is removed
  private getAppointmentRenderedAction() {
    return this._createActionByOption('onAppointmentRendered', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _renderFocusTarget() { return noop(); }

  private updateA11yStatus() {
    const dateRange = this._workSpace.getDateRange();
    const indicatorTime = this.option('showCurrentTimeIndicator')
      ? getToday(this.option('indicatorTime') as Date, this.timeZoneCalculator)
      : undefined;
    const label = getA11yStatusText(
      this.currentView,
      dateRange[0],
      dateRange[1],
      this._layoutManager.filteredItems.length,
      indicatorTime,
    );

    // @ts-expect-error
    this.setAria({ label });
    this.a11yStatus.text(label);
  }

  private renderA11yStatus() {
    this.a11yStatus = createA11yStatusContainer();
    this.a11yStatus.prependTo(this.$element());
    // @ts-expect-error
    this.setAria({ role: 'application' });
  }

  private initMarkupOnResourceLoaded() {
    if (!(this as any)._disposed) {
      this.initMarkupCore();
      this.reloadDataSource();
    }
  }

  _initMarkup(): void {
    super._initMarkup();

    this.renderA11yStatus();
    this.renderMainContainer();
    this.renderHeader();
    this.toggleAdaptiveClass();

    this._layoutManager = new AppointmentLayoutManager(this);

    this.appointmentTooltip = new (this.option('adaptivityEnabled')
      ? MobileTooltipStrategy
      : DesktopTooltipStrategy)(this.getAppointmentTooltipOptions());

    if (this.option('_newAppointments')) {
      const appointmentsConfig: Partial<AppointmentsProperties> = {
        tabIndex: this.option('tabIndex'),
        currentView: this.option('currentView') as ViewType,
        allowDelete: this.editing.allowDeleting,
        appointmentTemplate: this.getViewOption('appointmentTemplate'),
        appointmentCollectorTemplate: this.getViewOption('appointmentCollectorTemplate'),

        onAppointmentRendered: (...args) => this.actions.onAppointmentRendered(...args),
        onAppointmentClick: (...args) => this.actions.onAppointmentClick(...args),
        onAppointmentDblClick: (...args) => this.actions.onAppointmentDblClick(...args),
        onAppointmentContextMenu: (...args) => this.actions.onAppointmentContextMenu(...args),
        onDeleteKeyPress: (e) => {
          this.checkAndDeleteAppointment(e.appointmentData, e.targetedAppointmentData);
        },

        getResourceManager: () => this.resourceManager,
        getAppointmentDataSource: () => this.appointmentDataSource,
        getDataAccessor: () => this._dataAccessors,
        getStartViewDate: () => this.getStartViewDate(),
        getSortedItems: () => this._layoutManager.sortedItems,

        isVirtualScrolling: () => this.isVirtualScrolling(),

        scrollTo: this.scrollTo.bind(this),
        showAppointmentTooltip: this.showAppointmentTooltipCore.bind(this),
        showEditAppointmentPopup: (
          appointmentData: SafeAppointment,
          targetedAppointmentData: TargetedAppointment,
        ) => {
          this.showAppointmentPopup(appointmentData, false, targetedAppointmentData);
        },
      };
      // @ts-expect-error
      this._appointments = this._createComponent('<div>', Appointments, appointmentsConfig);
    } else {
      // @ts-expect-error
      this._appointments = this._createComponent('<div>', AppointmentCollection, this.appointmentsConfig());
      this._appointments.option('itemTemplate', this.getAppointmentTemplate('appointmentTemplate'));
    }

    this.createAppointmentPopupForm();

    // @ts-expect-error
    if (this.isDataSourceLoaded() || this._isDataSourceLoading()) {
      this.initMarkupCore();
      this._dataSourceChangedHandler(this._dataSource.items());
      this._fireContentReadyAction();
    } else {
      const groups = this.getViewOption('groups');

      if (groups?.length) {
        this.resourceManager.loadGroupResources(groups, true)
          .then(() => this.initMarkupOnResourceLoaded());
      } else {
        this.initMarkupOnResourceLoaded();
      }
    }
  }

  private createAppointmentPopupForm() {
    if (this.appointmentForm) {
      this.appointmentForm.dispose();
    }
    this.appointmentForm = this.createAppointmentForm();

    this.appointmentPopup?.dispose();
    this.appointmentPopup = this.createAppointmentPopup(this.appointmentForm);
  }

  private renderMainContainer() {
    this.mainContainer = $('<div>').addClass('dx-scheduler-container');
    this.$draggableContainer = $('<div>')
      .addClass('dx-scheduler-draggable-container')
      .appendTo(this.mainContainer);

    this.$element().append(this.mainContainer);
  }

  createAppointmentForm() {
    const config: AppointmentFormConfig = {
      dataAccessors: this._dataAccessors,
      editing: this.editing,
      resourceManager: this.resourceManager,
      firstDayOfWeek: this.getFirstDayOfWeek(),
      startDayHour: this.option('startDayHour') ?? 0,
      // @ts-expect-error
      createComponent: (element, component, options) => this._createComponent(element, component, options),
      getCalculatedEndDate: (startDateWithStartHour) => this._workSpace.calculateEndDate(startDateWithStartHour),
    };

    return new AppointmentForm(config);
  }

  createAppointmentPopup(form) {
    const scheduler = {
      getElement: () => this.$element(),
      // @ts-expect-error
      createComponent: (element, component, options) => this._createComponent(element, component, options),
      focus: () => this.focus(),

      getResourceManager: () => this.resourceManager,

      getEditingConfig: () => this.editing,

      getTimeZoneCalculator: () => this.timeZoneCalculator,
      getDataAccessors: () => this._dataAccessors,
      getAppointmentFormOpening: () => this.actions.onAppointmentFormOpening,
      processActionResult: (arg, canceled) => this.processActionResult(arg, canceled),

      addAppointment: (appointment) => this.addAppointment(appointment),
      updateAppointment: (sourceAppointment, updatedAppointment) => this.updateAppointment(sourceAppointment, updatedAppointment),

    };
    return new AppointmentPopup(scheduler, form);
  }

  private scrollToAppointment(appointment: Record<string, unknown>): void {
    const adapter = new AppointmentAdapter(appointment, this._dataAccessors);
    const { startDate, endDate, allDay } = adapter;

    if (!startDate) {
      return;
    }

    const startTime = startDate.getTime();
    const endTime = endDate ? endDate.getTime() : startTime;
    const dayInMs = toMs('day');

    const inAllDayRow = allDay || (endTime - startTime) >= dayInMs;
    const appointmentGroupValues = getAppointmentGroupValues(
      appointment,
      this.resourceManager.resources,
    );

    this._workSpace.updateScrollPosition(startDate, appointmentGroupValues, inAllDayRow);
  }

  private getAppointmentTooltipOptions() {
    const that = this;
    return {
      // @ts-expect-error
      createComponent: that._createComponent.bind(that),
      container: that.$element(),
      getScrollableContainer: that.getWorkSpaceScrollableContainer.bind(that),
      addDefaultTemplates: that._templateManager.addDefaultTemplates.bind(that._templateManager),
      getAppointmentTemplate: that.getAppointmentTemplate.bind(that),
      showAppointmentPopup: that.showAppointmentPopup.bind(that),
      checkAndDeleteAppointment: that.checkAndDeleteAppointment.bind(that),
      isAppointmentInAllDayPanel: that.isAppointmentInAllDayPanel.bind(that),

      createFormattedDateText: (appointment, targetedAppointment, format) => this.fire('createFormattedDateText', appointment, targetedAppointment, format),
      getAppointmentDisabled: (appointment) => this._dataAccessors.get('disabled', appointment),
      onItemContextMenu: that._createActionByOption('onAppointmentContextMenu'),
      createEventArgs: that._createEventArgs.bind(that),

      newAppointments: Boolean(this.option('_newAppointments')),
      onAppointmentClick: (...args) => this.actions.onAppointmentClick(...args),
      onListInitialized: (e) => {
        if (this.option('_newAppointments')) {
          this.appointmentDragController.createTooltipDraggable(
            e.element,
            {
              dragTemplate: this._appointments.renderDragClone.bind(this._appointments),
            },
          );
        }
      },
      onListDisposing: () => {
        this.appointmentDragController.disposeTooltipDraggable();
      },
    };
  }

  // TODO<Appointments>: delete this method when old impl is removed
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
    this.checkRecurringAppointment(
      appointment,
      targetedAppointment,
      targetedAdapter.startDate,
      () => {
        this.processDeleteAppointment(appointment, deletingOptions);
      },
      true,
    );
  }

  private getExtraAppointmentTooltipOptions() {
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

  private initMarkupCore() {
    this.readyToRenderAppointments = hasWindow();

    this._workSpace && this.cleanWorkspace();

    this.renderWorkSpace();
    if (this.option('_newAppointments')) {
      this._appointments.option('$allDayContainer', this._workSpace.getAllDayContainer());
    } else {
      this._appointments.option({
        fixedContainer: this._workSpace.getFixedContainer(),
        allDayContainer: this._workSpace.getAllDayContainer(),
      });
    }
    this.waitAsyncTemplate(() => this.workSpaceRecalculation?.resolve());

    this.createAppointmentDataSource();
    this.setRemoteFilterIfNeeded();
    this.validateKeyFieldIfAgendaExist();
    this.updateA11yStatus();
  }

  private isDataSourceLoaded() {
    return this._dataSource?.isLoaded();
  }

  _render() {
    this.getWorkSpace()?.updateHeaderEmptyCellWidth();

    // @ts-expect-error
    super._render();
  }

  private renderHeader() {
    const toolbarOptions = this.option('toolbar');
    const isHeaderShown = Boolean(
      toolbarOptions.visible ?? toolbarOptions.items?.length,
    );

    if (isHeaderShown) {
      const $header = $('<div>').appendTo(this.mainContainer);
      const headerOptions = this.headerConfig();
      // @ts-expect-error
      this.header = this._createComponent($header, SchedulerHeader, headerOptions);
    }
  }

  private headerConfig(): HeaderOptions {
    return {
      currentView: this.currentView,
      skippedDays: this.getViewOption('hiddenWeekDays') as number[],
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

  private appointmentsConfig() {
    const config = {
      getResourceManager: () => this.resourceManager,
      getAppointmentDataSource: () => this.appointmentDataSource,
      getSortedAppointments: () => this._layoutManager.sortedItems,
      scrollTo: this.scrollTo.bind(this),
      appointmentTooltip: this.appointmentTooltip,
      dataAccessors: this._dataAccessors,
      notifyScheduler: this.notifyScheduler,
      onItemRendered: this.getAppointmentRenderedAction(),
      onItemClick: this._createActionByOption('onAppointmentClick'),
      onItemContextMenu: this._createActionByOption('onAppointmentContextMenu'),
      onAppointmentDblClick: this._createActionByOption('onAppointmentDblClick'),
      tabIndex: this.option('tabIndex'),
      focusStateEnabled: this.option('focusStateEnabled'),
      allowDrag: this.allowDragging(),
      allowDelete: this.editing.allowUpdating && this.editing.allowDeleting,
      allowResize: this.allowResizing(),
      allowAllDayResize: this.allowAllDayResizing(),
      rtlEnabled: this.option('rtlEnabled'),
      groups: this.getViewOption('groups'),
      groupByDate: this.getViewOption('groupByDate'),
      timeZoneCalculator: this.timeZoneCalculator,
      getResizableStep: () => (this._workSpace ? this._workSpace.positionHelper.getResizableStep() : 0),
      getDOMElementsMetaData: () => this._workSpace?.getDOMElementsMetaData(),
      getViewDataProvider: () => this._workSpace?.viewDataProvider,
      isVerticalGroupedWorkSpace: () => this._workSpace.isVerticalGroupedWorkSpace(),
      isDateAndTimeView: () => isDateAndTimeView(this._workSpace.type),
      onContentReady: () => {
        this._workSpace?.option('allDayExpanded', this.isAllDayExpanded());
      },
    };

    return config;
  }

  private renderWorkSpace() {
    const currentViewOptions = this.currentView;
    if (!currentViewOptions) {
      return;
    }

    if (this.isAgenda()) {
      this.renderAgendaWorkspace();
    } else {
      this.renderGridWorkspace();
    }

    this.recalculateWorkspace();
    if (currentViewOptions.startDate) {
      this.updateOption('header', 'currentDate', this._workSpace.getHeaderDate());
    }
  }

  renderGridWorkspace(): void {
    if (this.readyToRenderAppointments) {
      this.toggleSmallClass();
      // TODO(9): Get rid of it as soon as you can. Workspace didn't render
      Promise.resolve().then(() => {
        this.toggleSmallClass();
        this._workSpace?.updateHeaderEmptyCellWidth();
      });
    }
    const $workSpace = $('<div>').appendTo(this.mainContainer);

    const currentViewType = this.currentView.type;
    const workSpaceComponent = VIEWS_CONFIG[currentViewType].workSpace;
    const workSpaceConfig = this.workSpaceConfig(this.currentView);
    // @ts-expect-error
    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);

    if (!this.option('_newAppointments')) {
      this.allowDragging() && this._workSpace.initDragBehavior(this, this.all);
    }
    this._workSpace.attachTablesEvents();
    this._workSpace.getWorkArea().append(this._appointments.$element());
  }

  renderAgendaWorkspace(): void {
    const $workSpace = $('<div>').appendTo(this.mainContainer);
    const workSpaceConfig = this.workSpaceConfig(this.currentView);
    const workSpaceComponent = VIEWS_CONFIG.agenda.workSpace;
    // @ts-expect-error
    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);
    this._workSpace.getWorkArea().append(this._appointments.$element());
  }

  private recalculateWorkspace() {
    // @ts-expect-error
    this.workSpaceRecalculation = new Deferred();
    triggerResizeEvent(this._workSpace.$element());
    this.waitAsyncTemplate(() => {
      this._workSpace.renderCurrentDateTimeLineAndShader();
    });
  }

  private workSpaceConfig(currentViewOptions: NormalizedView) {
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
      newAppointments: Boolean(this.option('_newAppointments')),
      resources: this.option('resources'),
      getResourceManager: () => this.resourceManager,
      getFilteredItems: () => this._layoutManager.filteredItems, // NOTE: used only in agenda

      noDataText: this.option('noDataText') || messageLocalization.format('dxCollectionWidget-noDataText'),
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
      onSelectionEnd: (args) => {
        this.actions.onSelectionEnd({
          component: this,
          element: this.$element(),
          selectedCellData: args.selectedCellData,
        });
      },
      groupByDate: this.getViewOption('groupByDate'),
      skippedDays: this.getViewOption('hiddenWeekDays') as number[],
      scrolling,
      draggingMode: this.option('_draggingMode'),
      timeZoneCalculator: this.timeZoneCalculator,
      schedulerHeight: this.option('height'),
      schedulerWidth: this.option('width'),
      allDayPanelMode: this.option('allDayPanelMode'),
      onSelectedCellsClick: this.showAddAppointmentPopup.bind(this),
      renderAppointments: () => { this.renderAppointments(); },
      onShowAllDayPanel: (value) => this.option('showAllDayPanel', value),
      getHeaderHeight: () => utils.DOM.getHeaderHeight(this.header),
      onScrollEnd: () => this._appointments.updateResizableArea(),
      onInitialized: (e) => {
        if (this.option('_newAppointments')) {
          this.appointmentDragController.createWorkSpaceDraggable(
            e.element,
            {
              getAppointmentData: this._appointments.getAppointmentData.bind(this._appointments),
            },
          );
        }
      },
      onDisposing: () => {
        if (this.option('_newAppointments')) {
          this.appointmentDragController.disposeWorkSpaceDraggable();
        }
      },

    }, currentViewOptions);

    result.notifyScheduler = this.notifyScheduler;
    result.groups = this.resourceManager.groupResources();
    result.onCellClick = this._createActionByOption('onCellClick');
    result.onCellContextMenu = this._createActionByOption('onCellContextMenu');
    result.currentDate = this.getViewOption('currentDate');
    result.skippedDays = this.getViewOption('hiddenWeekDays') as number[];
    result.hoursInterval = result.cellDuration / 60;
    result.allDayExpanded = false;
    result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
    result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
    result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
    result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;

    return result;
  }

  private waitAsyncTemplate(callback) {
    if (this._options.silent('templatesRenderAsynchronously')) {
      const timer = setTimeout(() => {
        callback();
        clearTimeout(timer);
      });
      this.asyncTemplatesTimers.push(timer);
    } else {
      callback();
    }
  }

  getAppointmentTemplate(optionName) {
    if (this.currentView?.[optionName]) {
      return this._getTemplate(this.currentView[optionName]);
    }

    // @ts-expect-error
    return this._getTemplateByOption(optionName);
  }

  private updateOption<T>(viewName: 'workSpace' | 'header', optionName: string, value: T): void {
    if (viewName === 'header') {
      this.header?.option(optionName, value);
    } else {
      this._workSpace?.option(optionName, value);
    }
  }

  private refreshWorkSpace(): void {
    this.cleanWorkspace();

    delete this._workSpace;

    this.renderWorkSpace();

    if (this.readyToRenderAppointments) {
      if (this.option('_newAppointments')) {
        this._appointments.option('$allDayContainer', this._workSpace.getAllDayContainer());
      } else {
        this._appointments.option({
          fixedContainer: this._workSpace.getFixedContainer(),
          allDayContainer: this._workSpace.getAllDayContainer(),
        });
      }

      this.waitAsyncTemplate(() => this.workSpaceRecalculation.resolve());
    }
  }

  private cleanWorkspace() {
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
    return this.header;
  }

  private cleanPopup() {
    this.appointmentPopup?.dispose();
  }

  private updateAppointmentOnDrop(
    appointmentData: Appointment,
    targetedAppointmentData: TargetedAppointment,
    $cell: dxElementWrapper,
  ): Promise<void> {
    const updatedData = this.getUpdatedData(appointmentData, $cell);
    const newAppointmentData = extend({}, appointmentData, updatedData);
    const startDate = this._dataAccessors.get('startDate', targetedAppointmentData);

    return new Promise((resolve) => {
      this.checkRecurringAppointment(
        appointmentData,
        newAppointmentData,
        startDate,
        () => {
          this.updateAppointmentCore(
            appointmentData,
            newAppointmentData,
          ).always(resolve);
        },
        false,
        undefined,
        undefined,
        undefined,
        (): void => { resolve(); },
      );
    });
  }

  checkRecurringAppointment(
    rawAppointment,
    singleAppointment,
    exceptionDate,
    callback,
    isDeleted,
    isPopupEditing?: any,
    dragEvent?: any,
    recurrenceEditMode?: any,
    onCancel?: () => void,
  ) {
    const recurrenceRule = this._dataAccessors.get('recurrenceRule', rawAppointment);

    if (!validateRRule(recurrenceRule) || !this.editing.allowUpdating) {
      callback();
      return;
    }

    const editMode = recurrenceEditMode || this.option('recurrenceEditMode');
    switch (editMode) {
      case 'series':
        callback();
        break;
      case 'occurrence':
        this.excludeAppointmentFromSeries(rawAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
        break;
      default:
        if (dragEvent) {
          // @ts-expect-error
          dragEvent.cancel = new Deferred();
        }
        this.showRecurrenceChangeConfirm(isDeleted)
          .done((editingMode) => {
            editingMode === RECURRENCE_EDITING_MODE.SERIES && callback();

            editingMode === RECURRENCE_EDITING_MODE.OCCURRENCE && this.excludeAppointmentFromSeries(
              rawAppointment,
              singleAppointment,
              exceptionDate,
              isDeleted,
              isPopupEditing,
              dragEvent,
            );
          })
          .fail(() => {
            if (this.option('_newAppointments')) {
              onCancel?.();
            } else {
              this._appointments.moveAppointmentBack(dragEvent);
            }
          });
    }
  }

  private excludeAppointmentFromSeries(rawAppointment, newRawAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
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
      this.appointmentPopup.show(singleRawAppointment, {
        onSave: (newAppointment) => {
          this.updateAppointment(rawAppointment, appointment.source);
          return when(this.addAppointment(newAppointment))
            .done(() => this.scrollToAppointment(newAppointment));
        },
        title: messageLocalization.format('dxScheduler-editPopupTitle'),
        readOnly: Boolean(appointment.source) && appointment.disabled,
      });
      this.editAppointmentData = rawAppointment;
    } else {
      this.updateAppointmentCore(rawAppointment, appointment.source, () => {
        this._appointments.moveAppointmentBack(dragEvent);
      }, dragEvent);
    }
  }

  private createRecurrenceException(appointment, exceptionDate) {
    const result: any[] = [];

    if (appointment.recurrenceException) {
      result.push(appointment.recurrenceException);
    }
    result.push(this.getSerializedDate(exceptionDate, appointment.startDate, appointment.allDay));

    return result.join();
  }

  private getSerializedDate(date, startDate, isAllDay) {
    isAllDay && date.setHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      startDate.getMilliseconds(),
    );

    return dateSerialization.serializeDate(date, UTC_FULL_DATE_FORMAT);
  }

  private showRecurrenceChangeConfirm(isDeleted) {
    const title = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteTitle' : 'dxScheduler-confirmRecurrenceEditTitle');
    const message = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteMessage' : 'dxScheduler-confirmRecurrenceEditMessage');
    const seriesText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteSeries' : 'dxScheduler-confirmRecurrenceEditSeries');
    const occurrenceText = messageLocalization.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteOccurrence' : 'dxScheduler-confirmRecurrenceEditOccurrence');

    this.recurrenceDialog = customDialog({
      title,
      messageHtml: message,
      showCloseButton: true,
      showTitle: true,
      buttons: [
        { text: seriesText, onClick() { return RECURRENCE_EDITING_MODE.SERIES; } },
        { text: occurrenceText, onClick() { return RECURRENCE_EDITING_MODE.OCCURRENCE; } },
      ],
      popupOptions: {
        wrapperAttr: { class: POPUP_DIALOG_CLASS },
        onHidden: () => {
          this._appointments?.focus();
        },
      },
    } as any);

    return this.recurrenceDialog.show();
  }

  getUpdatedData(rawAppointment, $cell?) {
    const viewOffset = this.getViewOffsetMs();

    const getConvertedFromGrid = (date: any): Date | undefined => {
      if (!date) {
        return undefined;
      }

      const result = this.timeZoneCalculator.createDate(date, 'fromGrid');
      return dateUtilsTs.addOffsets(result, -viewOffset);
    };

    const targetCell = $cell
      ? this._workSpace.getCellData($cell)
      : this.getTargetCellData();
    const appointment = new AppointmentAdapter(
      rawAppointment,
      this._dataAccessors,
    );

    const cellStartDate = getConvertedFromGrid(targetCell.startDate);
    const cellEndDate = getConvertedFromGrid(targetCell.endDate);

    let appointmentStartDate = new Date(appointment.startDate);
    appointmentStartDate = dateUtilsTs.addOffsets(appointmentStartDate, -viewOffset);
    let appointmentEndDate = new Date(appointment.endDate);
    appointmentEndDate = dateUtilsTs.addOffsets(appointmentEndDate, -viewOffset);
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

      const targetCellStartDate = dateUtilsTs.addOffsets(targetCell.startDate, -viewOffset);
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

    result.startDate = dateUtilsTs.addOffsets(result.startDate, viewOffset);
    result.endDate = dateUtilsTs.addOffsets(resultedEndDate, viewOffset);
    const rawResult = result.source;

    setAppointmentGroupValues(rawResult, this.resourceManager.resourceById, targetCell.groups);

    return rawResult;
  }

  // TODO<Appointments>: delete this method when old impl is removed
  getTargetedAppointment(appointment: SafeAppointment, element: dxElementWrapper): TargetedAppointment {
    const settings = utils.dataAccessors.getAppointmentSettings(element)!;
    return getTargetedAppointment(
      appointment,
      settings,
      this._dataAccessors,
      this.resourceManager,
    );
  }

  subscribe(subject, action) {
    this.subscribes[subject] = subscribes[subject] = action;
  }

  fire<Subject extends SubscribeKey>(
    subject: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> {
    const callback = this.subscribes[subject];

    if (!isFunction(callback)) {
      throw errors.Error('E1031', subject);
    }

    return callback.call(this, ...args);
  }

  getTargetCellData() {
    return this._workSpace.getDataByDroppableCell();
  }

  updateAppointmentCore(target, rawAppointment, onUpdatePrevented?: any, dragEvent?: any) {
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

    this.actions[StoreEventNames.UPDATING](updatingOptions);

    if (dragEvent && !isDeferred(dragEvent.cancel)) {
      // @ts-expect-error
      dragEvent.cancel = new Deferred();
    }

    if (isPromise(updatingOptions.cancel) && (dragEvent || this.option('_newAppointments'))) {
      this.updatingAppointments.add(target);
    }

    return this.processActionResult(updatingOptions, function (canceled) {
      // @ts-expect-error
      let deferred = new Deferred();

      if (!canceled) {
        this.expandAllDayPanel(rawAppointment);

        try {
          deferred = this.appointmentDataSource
            .update(target, rawAppointment)
            .done(() => {
              dragEvent?.cancel.resolve(false);
            })
            .always((storeAppointment) => {
              this.updatingAppointments.delete(target);
              this.onDataPromiseCompleted(StoreEventNames.UPDATED, storeAppointment);
            })
            .fail(() => performFailAction());
        } catch (err) {
          performFailAction(err);
          this.updatingAppointments.delete(target);
          deferred.resolve();
        }
      } else {
        performFailAction();
        this.updatingAppointments.delete(target);
        deferred.resolve();
      }

      return deferred.promise();
    });
  }

  private processActionResult(actionOptions, callback) {
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

  private expandAllDayPanel(appointment) {
    if (!this.isAllDayExpanded() && this.appointmentTakesAllDay(appointment)) {
      this.updateOption('workSpace', 'allDayExpanded', true);
    }
  }

  private onDataPromiseCompleted(handlerName, storeAppointment, appointment?: any) {
    const args: any = { appointmentData: appointment || storeAppointment };

    if (storeAppointment instanceof Error) {
      args.error = storeAppointment;
    } else {
      this.appointmentPopup.visible && this.appointmentPopup.hide();
    }

    this.actions[handlerName](args);
    this._fireContentReadyAction();
  }

  getAppointmentsInstance() {
    return this._appointments;
  }

  getLayoutManager() {
    return this._layoutManager;
  }

  getActions() {
    return this.actions;
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

  showAppointmentPopup(rawAppointment?: any, createNewAppointment?: boolean, rawTargetedAppointment?: any) {
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
      delete this.editAppointmentData; // TODO
      if (this.editing.allowAdding) {
        this.appointmentPopup.show(rawAppointment, {
          onSave: (appointment) => when(this.addAppointment(appointment))
            .done(() => this.scrollToAppointment(appointment)),
          title: messageLocalization.format('dxScheduler-newPopupTitle'),
          readOnly: false,
        });
      }
    } else {
      const startDate = this._dataAccessors.get('startDate', newRawTargetedAppointment || rawAppointment);

      this.checkRecurringAppointment(rawAppointment, newTargetedAppointment, startDate, () => {
        this.editAppointmentData = rawAppointment; // TODO

        const adapter = new AppointmentAdapter(rawAppointment, this._dataAccessors);
        const isDisabled = Boolean(adapter.source) && adapter.disabled;
        const readOnly = isDisabled || !this.editing.allowUpdating;

        this.appointmentPopup.show(rawAppointment, {
          onSave: (appointment) => when(this.updateAppointment(rawAppointment, appointment))
            .done(() => this.scrollToAppointment(appointment)),
          title: messageLocalization.format('dxScheduler-editPopupTitle'),
          readOnly,
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
    if (this.appointmentPopup?.visible) {
      saveChanges && this.appointmentPopup.saveChangesAsync();
      this.appointmentPopup.hide();
    }
  }

  // NOTE: public API
  showAppointmentTooltip(
    appointment: SafeAppointment,
    element: dxElementWrapper,
    targetedAppointment?: SafeAppointment,
  ) {
    if (appointment) {
      const settings: any = utils.dataAccessors.getAppointmentSettings(element);
      const appointmentConfig = {
        itemData: targetedAppointment ?? appointment,
        groupIndex: settings?.groupIndex,
      };

      const info: AppointmentTooltipItem = {
        appointment,
        targetedAppointment,
        color: this.resourceManager.getAppointmentColor(appointmentConfig),
        settings,
      };

      this.showAppointmentTooltipCore(element, [info]);
    }
  }

  showAppointmentTooltipCore(
    target: dxElementWrapper,
    data: AppointmentTooltipItem[],
    options?: AppointmentTooltipExtraOptions,
  ) {
    const arg: Omit<AppointmentTooltipShowingEvent, 'component' | 'element'> = {
      cancel: false,
      appointments: data.map((item) => ({
        appointmentData: item.appointment,
        currentAppointmentData: { ...item.targetedAppointment },
        color: item.color as Promise<string>,
      })),
      targetElement: getPublicElement(target),
    };

    this._createActionByOption('onAppointmentTooltipShowing')(arg);

    if (this.appointmentTooltip.isShownForTarget(target)) {
      this.hideAppointmentTooltip();
    } else {
      this.processActionResult(arg, (canceled) => {
        !canceled && this.appointmentTooltip.show(target, data, {
          ...this.getExtraAppointmentTooltipOptions(),
          ...options,
        });
      });
    }
  }

  hideAppointmentTooltip() {
    this.appointmentTooltip?.hide();
  }

  scrollTo(
    date: Date,
    groupValuesOrOptions?: ScrollToGroupValuesOrOptions,
    allDay?: boolean | undefined,
  ) {
    let groupValues;
    let allDayValue;
    let align: 'start' | 'center' = 'center';

    if (this.isScrollOptionsObject(groupValuesOrOptions)) {
      groupValues = groupValuesOrOptions.group;
      allDayValue = groupValuesOrOptions.allDay;
      align = groupValuesOrOptions.alignInView ?? 'center';
    } else {
      if (isDefined(groupValuesOrOptions) || isDefined(allDay)) {
        errors.log('W0002', 'dxScheduler', 'scrollTo(date, group, allDay)', '26.1', 'Use scrollTo(date, { group, allDay, alignInView }) instead.');
      }

      groupValues = groupValuesOrOptions;
      allDayValue = allDay;
    }

    this._workSpace.scrollTo(date, groupValues, allDayValue, true, align);
  }

  private isScrollOptionsObject(options?: ScrollToGroupValuesOrOptions): options is ScrollToOptions {
    return Boolean(options) && typeof options === 'object'
      && ('alignInView' in options || 'allDay' in options || 'group' in options);
  }

  private isHorizontalVirtualScrolling() {
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

    this.actions[StoreEventNames.ADDING](addingOptions);

    return this.processActionResult(addingOptions, (canceled) => {
      if (canceled) {
        // @ts-expect-error
        return new Deferred().resolve();
      }

      this.expandAllDayPanel(serializedAppointment);

      return this.appointmentDataSource
        .add(serializedAppointment)
        .always((storeAppointment) => this.onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment));
    });
  }

  updateAppointment(target, appointment) {
    return this.updateAppointmentCore(target, appointment);
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

    this.actions[StoreEventNames.DELETING](deletingOptions);

    return deletingOptions;
  }

  processDeleteAppointment(rawAppointment, deletingOptions) {
    this.processActionResult(deletingOptions, function (canceled) {
      if (!canceled) {
        this.appointmentDataSource
          .remove(rawAppointment)
          .always((storeAppointment) => this.onDataPromiseCompleted(
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
    this.checkRecurringAppointment(
      appointment,
      {},
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
    if (this.editAppointmentData) {
      this._appointments.focus();
    } else {
      this._workSpace.focus();
    }
  }

  getOccurrences(startDate: Date, endDate: Date, rawAppointments: Appointment[]): Occurrence[] {
    return this._layoutManager.getOccurrences(startDate, endDate, rawAppointments);
  }

  getFirstDayOfWeek(): DayOfWeek {
    return isDefined(this.getViewOption('firstDayOfWeek'))
      ? this.getViewOption('firstDayOfWeek') as DayOfWeek
      : dateLocalization.firstDayOfWeekIndex() as DayOfWeek;
  }

  private validateKeyFieldIfAgendaExist() {
    if (!this.appointmentDataSource.isDataSourceInit) {
      return;
    }

    const hasAgendaView = this.hasAgendaView();
    const isKeyNotExist = !this.appointmentDataSource.keyName;

    if (hasAgendaView && isKeyNotExist) {
      errors.log('W1023');
    }
  }

  // TODO: used externally in m_appointment_drag_behavior.ts
  _getDragBehavior() {
    return this._workSpace.dragBehavior;
  }

  // TODO: used externally in m_appointment_drag_behavior.ts
  _isAppointmentBeingUpdated(appointmentData: Appointment): boolean {
    return this.updatingAppointments.has(appointmentData);
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
