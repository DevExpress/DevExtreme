import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import type { DataSource } from '@js/common/data';
import registerComponent from '@js/core/component_registrator';
import config from '@js/core/config';
import { getPublicElement } from '@js/core/element';
import type { PostponedOperations } from '@js/core/postponed_operations';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { FunctionTemplate } from '@js/core/templates/function_template';
import type { TemplateBase } from '@js/core/templates/template_base';
import Callbacks from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import type { DeferredObj } from '@js/core/utils/deferred';
// @ts-expect-error untyped deferred module re-export
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
import type { DataSourceOptions } from '@js/data/data_source';
import DataHelperMixin from '@js/data_helper';
import type { CustomDialogOptions } from '@js/ui/dialog';
import { custom as customDialog } from '@js/ui/dialog';
import type { ItemContextMenuEvent } from '@js/ui/list';
import type {
  Appointment,
  AppointmentAddingEvent,
  AppointmentClickEvent,
  AppointmentContextMenuEvent,
  AppointmentDblClickEvent,
  AppointmentFormOpeningEvent,
  AppointmentRenderedEvent,
  AppointmentTooltipShowingEvent,
  AppointmentUpdatingEvent,
  CellClickEvent,
  CellContextMenuEvent,
  DayOfWeek,
  Occurrence,
  Properties as SchedulerProperties,
  RecurrenceEditMode,
  SelectionEndEvent,
} from '@js/ui/scheduler';
import errors from '@js/ui/widget/ui.errors';
import type { Options } from '@ts/core/options/m_index';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { OptionChanged } from '@ts/core/widget/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import { createA11yStatusContainer } from './a11y_status/a11y_status_render';
import { getA11yStatusText } from './a11y_status/a11y_status_text';
import { AppointmentDragController, type WorkSpaceDraggableOptions } from './appointment_drag_controller';
import type { AppointmentFormConfig } from './appointment_popup/form';
import { AppointmentForm } from './appointment_popup/form';
import { AppointmentPopup } from './appointment_popup/popup';
import type { AppointmentCollectionOptions } from './appointments/appointment_collection_options';
import AppointmentCollection from './appointments/m_appointment_collection';
import type { AppointmentsProperties } from './appointments_new/appointments';
import { Appointments } from './appointments_new/appointments';
import NotifyScheduler from './base/widget_notify_scheduler';
import { SchedulerHeader } from './header/header';
import type { HeaderOptions } from './header/types';
import { hide as hideLoading, show as showLoading } from './loading';
import type AppointmentDragBehavior from './m_appointment_drag_behavior';
import { CompactAppointmentsHelper } from './m_compact_appointments_helper';
import type { SubscribeKey, SubscribeMethods } from './m_subscribes';
import subscribes from './m_subscribes';
import { combineRemoteFilter } from './r1/filterting/remote';
import { createTimeZoneCalculator, type TimeZoneCalculator } from './r1/timezone_calculator/index';
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
import type { AppointmentTooltipExtraOptions, AppointmentTooltipOptions } from './tooltip_strategies/tooltip_strategy_base';
import type {
  AppointmentTooltipContextMenuEventArgs,
  AppointmentTooltipItem,
  CreateComponentFn,
  DOMMetaData,
  GroupBoundsOffset,
  MappedAppointmentFields,
  SafeAppointment,
  ScrollToGroupValuesOrOptions, ScrollToOptions, TargetedAppointment,
  ViewCellData,
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
import type { GroupValues } from './utils/resource_manager/types';
import timeZoneUtils, { type TimezoneLabel } from './utils_time_zone';
import AppointmentLayoutManager from './view_model/appointments_layout_manager';
import type { CollectorCSS, RealSize } from './view_model/generate_view_model/steps/add_geometry/types';
import { AppointmentDataSource } from './view_model/m_appointment_data_source';
import type { AppointmentItemViewModel, AppointmentViewModelPlain, PanelName } from './view_model/types';
import SchedulerAgenda from './workspaces/agenda';
import SchedulerTimelineDay from './workspaces/timeline_day';
import SchedulerTimelineMonth from './workspaces/timeline_month';
import SchedulerTimelineWeek from './workspaces/timeline_week';
import type ViewDataProvider from './workspaces/view_model/view_data_provider';
import type { WorkspaceOptionsInternal } from './workspaces/work_space';
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
} as const;

type StoreEventName = typeof StoreEventNames[keyof typeof StoreEventNames];

const RECURRENCE_EDITING_MODE = {
  SERIES: 'editSeries',
  OCCURRENCE: 'editOccurrence',
  CANCEL: 'cancel',
};

type DroppableCellData = Pick<ViewCellData, 'startDate' | 'endDate' | 'allDay' | 'groups'>;

interface WorkSpaceCoordinates {
  top: number;
  left: number;
  groupIndex?: number;
}

interface WorkSpacePositionHelper {
  getResizableStep: () => number;
  getHorizontalMax: (groupIndex: number) => number;
  getVerticalMax: (options: {
    groupIndex: number;
    isVirtualScrolling: boolean;
    showAllDayPanel: boolean;
    supportAllDayRow: boolean;
    isGroupedAllDayPanel: boolean;
    isVerticalGrouping: boolean;
  }) => number;
}

interface VirtualScrollingDispatcherLike {
  cellCountInsideLeftVirtualCell: number;
  cellCountInsideRightVirtualCell: number;
  cellCountInsideTopVirtualRow: number;
}

interface SchedulerWorkSpaceLike {
  type: ViewType;
  NAME?: string;
  dragBehavior: AppointmentDragBehavior | null;
  positionHelper: WorkSpacePositionHelper;
  virtualScrollingDispatcher: VirtualScrollingDispatcherLike;
  viewDataProvider: ViewDataProvider;
  option: (name: string | Record<string, unknown>, value?: unknown) => unknown;
  getDateRange: () => Date[];
  getCellFromDragTarget: ($dragTarget: dxElementWrapper) => dxElementWrapper | null;
  renderAgendaLayout?: (viewModel: AppointmentViewModelPlain[]) => void;
  calculateEndDate: (startDate: Date) => Date;
  updateScrollPosition: (date: Date, groupValues: GroupValues, inAllDayRow: boolean) => void;
  supportAllDayRow: () => boolean;
  getAllDayContainer: () => dxElementWrapper | null;
  getFixedContainer: () => dxElementWrapper;
  getDOMElementsMetaData: () => DOMMetaData;
  isVerticalGroupedWorkSpace: () => boolean;
  isVirtualScrolling: () => boolean;
  isGroupedByDate: () => boolean;
  needRecalculateResizableArea: () => boolean;
  getHeaderDate: () => Date;
  updateHeaderEmptyCellWidth: () => void;
  initDragBehavior: (scheduler: unknown) => void;
  attachTablesEvents: () => void;
  getWorkArea: () => dxElementWrapper;
  $element: () => dxElementWrapper;
  renderCurrentDateTimeLineAndShader: () => void;
  _dispose: () => void;
  _dimensionChanged: () => void;
  getScrollable: () => Scrollable;
  getScrollableContainer: () => dxElementWrapper;
  getCellData: ($cell: dxElementWrapper) => DroppableCellData;
  getCellWidth: () => number;
  getCellHeight: () => number;
  getGroupCount: () => number;
  getGroupBounds: (coordinates: WorkSpaceCoordinates) => GroupBoundsOffset | undefined;
  getPanelDOMSize: (panelName: PanelName) => RealSize;
  getCollectorDimension: (isCompactCollector: boolean, panelName: PanelName) => CollectorCSS;
  getAgendaVerticalStepHeight: () => number;
  createDragBehaviorBase: (
    targetElement: dxElementWrapper,
    rootElement: dxElementWrapper,
    options: Record<string, unknown>,
  ) => void;
  removeDroppableCellClass: () => void;
  keepOriginalHours: () => boolean;
  getDataByDroppableCell: () => DroppableCellData;
  getStartViewDate: () => Date | undefined;
  getEndViewDate: () => Date;
  scrollTo: (
    date: Date,
    groupValuesOrOptions?: ScrollToGroupValuesOrOptions,
    allDay?: boolean,
    throwWarning?: boolean,
    align?: 'start' | 'center',
  ) => void;
  focus: () => void;
}

type SchedulerActionCancel = boolean | PromiseLike<boolean> | DeferredObj<boolean | undefined>;

type SchedulerActionOptions = {
  cancel: SchedulerActionCancel;
} & Record<string, unknown>;

type ProcessActionCallback = (
  canceled: boolean,
) => unknown;

interface SchedulerDragEvent {
  cancel: DeferredObj<boolean>;
}

type SchedulerEventArgs<T extends { component?: unknown; element?: unknown }> = Omit<T, 'component' | 'element'>;

type AppointmentAddingOptions = Pick<AppointmentAddingEvent, 'appointmentData' | 'cancel'>;

type AppointmentUpdatingOptions = Pick<AppointmentUpdatingEvent, 'newData' | 'oldData' | 'cancel'>;

interface AppointmentCompletedOptions {
  appointmentData: SafeAppointment;
  error?: Error;
}

interface AppointmentDeletingOptions {
  [key: string]: unknown;
  appointmentData: SafeAppointment;
  targetedAppointmentData?: SafeAppointment | AppointmentAdapter;
  cancel: SchedulerActionCancel;
}

interface SchedulerActions {
  onAppointmentAdding: (args: AppointmentAddingOptions) => void;
  onAppointmentAdded: (args: AppointmentCompletedOptions) => void;
  onAppointmentUpdating: (args: AppointmentUpdatingOptions) => void;
  onAppointmentUpdated: (args: AppointmentCompletedOptions) => void;
  onAppointmentDeleting: (args: AppointmentDeletingOptions) => void;
  onAppointmentDeleted: (args: AppointmentCompletedOptions) => void;
  onAppointmentFormOpening: (args: SchedulerEventArgs<AppointmentFormOpeningEvent>) => void;
  onAppointmentTooltipShowing: (args: SchedulerEventArgs<AppointmentTooltipShowingEvent>) => void;
  onSelectionEnd: (args: SchedulerEventArgs<SelectionEndEvent>) => void;
  onAppointmentRendered: (args: AppointmentRenderedEvent) => void;
  onAppointmentClick: (args: AppointmentClickEvent) => void;
  onAppointmentDblClick: (args: AppointmentDblClickEvent) => void;
  onAppointmentContextMenu: (args: AppointmentContextMenuEvent) => void;
}

interface SelectedCellsClickCellData {
  startDate?: Date;
  endDate?: Date;
  startDateUTC: number;
  endDateUTC: number;
  allDay?: boolean;
}

interface SchedulerEditing {
  allowAdding: boolean;
  allowUpdating: boolean;
  allowDeleting: boolean;
  allowResizing: boolean;
  allowDragging: boolean;
}

type SchedulerEditingObject = Exclude<NonNullable<SchedulerProperties['editing']>, boolean>;

type SchedulerEditingState = SchedulerEditing & Partial<SchedulerEditingObject>;

interface RecurrenceDialog {
  show: () => DeferredObj<string>;
  hide: (mode: string) => void;
}

type AppointmentsEditingOptions = Partial<{
  allowDelete: boolean;
  allowDrag: boolean;
  allowResize: boolean;
  allowAllDayResize: boolean;
}>;

interface SchedulerAppointmentsHost {
  option: ((options: Record<string, unknown>) => unknown) & ((name: string, value?: unknown) => unknown);
  repaint: () => void;
  $element: () => dxElementWrapper;
  focus: () => void;
  moveAppointmentBack: (dragEvent?: SchedulerDragEvent | null) => void;
  updateResizableArea: () => void;
  renderDragClone: (...args: unknown[]) => dxElementWrapper;
  getAppointmentData: (...args: unknown[]) => unknown;
}

class Scheduler extends SchedulerOptionsBaseWidget {
  // NOTE: Do not initialize variables here, because `_initMarkup` function runs before constructor,
  // and initialization in constructor will erase the data
  private timeZoneCalculatorInstance: TimeZoneCalculator | null = null;

  declare postponedOperations: PostponedOperations;

  declare _disposed?: boolean;

  declare _options: Options;

  private a11yStatus!: dxElementWrapper;

  // TODO: used externally in m_appointment_drag_behavior.ts,
  // m_subscribes.ts, workspaces/work_space.ts
  _workSpace!: SchedulerWorkSpaceLike;

  private header?: SchedulerHeader;

  // TODO: used externally in m_appointment_drag_behavior.ts,
  // m_subscribes.ts, workspaces/work_space.ts
  _appointments!: SchedulerAppointmentsHost;

  private appointmentDragController!: AppointmentDragController;

  appointmentDataSource!: AppointmentDataSource;

  declare _dataSource: DataSource | undefined;

  // TODO: used externally in workspaces/work_space.ts
  // eslint-disable-next-line @typescript-eslint/naming-convention -- inherited Widget API
  declare _createComponent: CreateComponentFn;

  // TODO: used externally in m_subscribes.ts,
  // view_model/preparation/prepare_appointments.ts,
  // view_model/filtration/utils/get_filter_options/get_filter_options.ts
  _dataAccessors!: AppointmentDataAccessor;

  resourceManager!: ResourceManager;

  private actions!: SchedulerActions;

  // TODO: used externally in workspaces/work_space.ts
  declare _createActionByOption: (
    optionName: string,
    config?: { excludeValidators?: string[] },
  ) => (event?: unknown) => void;

  private appointmentTooltip!: MobileTooltipStrategy | DesktopTooltipStrategy;

  private readyToRenderAppointments?: boolean;

  private editing!: SchedulerEditingState;

  private workSpaceRecalculation!: DeferredObj<void>;

  private appointmentPopup!: AppointmentPopup;

  // TODO: used externally in m_subscribes.ts
  _compactAppointmentsHelper!: CompactAppointmentsHelper;

  private asyncTemplatesTimers: ReturnType<typeof setTimeout>[] = [];

  private readonly updatingAppointments: Set<Appointment> = new Set();

  private dataSourceLoadedCallback!: ReturnType<typeof Callbacks>;

  private subscribes: SubscribeMethods = subscribes;

  private notifyScheduler!: NotifyScheduler;

  private recurrenceDialog?: RecurrenceDialog;

  // TODO: used externally in m_subscribes.ts
  _layoutManager!: AppointmentLayoutManager;

  private appointmentForm!: AppointmentForm;

  private mainContainer!: dxElementWrapper;

  private $draggableContainer?: dxElementWrapper;

  private editAppointmentData?: SafeAppointment;

  private timeZonesPromise!: Promise<TimezoneLabel[]>;

  get timeZoneCalculator(): TimeZoneCalculator {
    if (!this.timeZoneCalculatorInstance) {
      this.timeZoneCalculatorInstance = createTimeZoneCalculator(this.option('timeZone'));
    }

    return this.timeZoneCalculatorInstance;
  }

  private postponeDataSourceLoading(promise?: DeferredObj<unknown>): void {
    this.postponedOperations.add('_reloadDataSource', this.reloadDataSource.bind(this), promise);
  }

  private postponeResourceLoading(forceReload = false): DeferredObj<void> {
    const whenLoaded = this.postponedOperations.add('loadResources', () => {
      const groups = this.getViewOption('groups');

      return when(this.resourceManager.loadGroupResources(groups, forceReload));
    }, undefined);

    const resolveCallbacks: DeferredObj<void> = Deferred();

    whenLoaded.done(() => {
      resolveCallbacks.resolve();
    });

    this.postponeDataSourceLoading(whenLoaded);

    return resolveCallbacks;
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
          if (this._dataSource) {
            this.appointmentDataSource.setDataSource(this._dataSource);
          }
          this.setRemoteFilterIfNeeded();
          this.updateOption('workSpace', 'showAllDayPanel', this.option('showAllDayPanel'));
        });
        break;
      case 'min':
      case 'max': {
        const viewValue = this.getViewOption(name);
        this.updateOption('header', name, viewValue);
        this.updateOption('workSpace', name, viewValue);
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
        if (this.header) {
          this.header.onToolbarOptionChanged(args.fullName, value);
        } else {
          this.repaint();
        }
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  private bringEditingModeToAppointments(editing: SchedulerEditing): void {
    const editingConfig: AppointmentsEditingOptions = {
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

  private isAgenda(): boolean {
    return this.currentView.type === 'agenda';
  }

  private allowDragging(): boolean {
    return this.editing.allowDragging && !this.isAgenda();
  }

  private canDragAppointment(appointmentData: Appointment): boolean {
    return this.allowDragging() && !this._isAppointmentBeingUpdated(appointmentData);
  }

  private allowResizing(): boolean {
    return this.editing.allowResizing && !this.isAgenda();
  }

  private allowAllDayResizing(): boolean {
    return this.editing.allowResizing && this.supportAllDayResizing();
  }

  private supportAllDayResizing(): boolean {
    return this.currentView.type !== 'day' || this.currentView.intervalCount > 1;
  }

  private isAllDayExpanded(): boolean {
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

  private reloadDataSource(): Promise<void> {
    const result: DeferredObj<void> = Deferred();

    if (this._dataSource) {
      this._dataSource.load().then(() => {
        hideLoading().catch(noop);

        this._fireContentReadyAction(result);
      }).catch(() => {
        hideLoading().catch(noop);
        result.reject();
      });

      if (this._dataSource.isLoading()) {
        showLoading({
          container: this.$element().get(0),
          position: {
            of: this.$element().get(0),
          },
        }).catch(noop);
      }
    } else {
      this._fireContentReadyAction(result);
    }

    return result.promise();
  }

  _fireContentReadyAction(result?: DeferredObj<void>): void {
    // @ts-expect-error
    const contentReadyBase = super._fireContentReadyAction.bind(this);
    const fireContentReady = (): void => {
      contentReadyBase();
      result?.resolve();
    };

    if (this.workSpaceRecalculation?.state() === 'pending') {
      this.workSpaceRecalculation.done(() => {
        fireContentReady();
      });
    } else {
      fireContentReady();
    }
  }

  _dimensionChanged(value: unknown, isForce = false): void {
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

  _clean(): void {
    this.cleanPopup();
    // @ts-expect-error
    super._clean();
  }

  private toggleSmallClass(): void {
    const element = this.$element().get(0);
    const { width } = getBoundingRect(element);
    this.$element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
  }

  private toggleAdaptiveClass(): void {
    (this.$element()).toggleClass(WIDGET_ADAPTIVE_CLASS, this.option('adaptivityEnabled'));
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged(null, true);
    }
  }

  _dataSourceOptions(): DataSourceOptions {
    return { paginate: false };
  }

  private initAllDayPanel(): void {
    if (this.option('allDayPanelMode') === 'hidden') {
      this.option('showAllDayPanel', false);
    }
  }

  _init(): void {
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

    this.$element().addClass(WIDGET_CLASS);

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
      $draggableContainer: (): dxElementWrapper => this.$draggableContainer ?? this.$element(),
      canDragAppointment: this.canDragAppointment.bind(this),
      getCellFromDragTarget: ($dragTarget: dxElementWrapper): dxElementWrapper | null => (
        this._workSpace.getCellFromDragTarget($dragTarget)
      ),

      // @ts-expect-error _createComponent is not defined in ts
      createComponent: this._createComponent.bind(this),
      hideAppointmentTooltip: this.hideAppointmentTooltip.bind(this),

      updateAppointmentOnDrop: this.updateAppointmentOnDrop.bind(this),
    });
  }

  createAppointmentDataSource(): void {
    this.appointmentDataSource?.destroy();
    if (!this._dataSource) {
      return;
    }
    this.appointmentDataSource = new AppointmentDataSource(this._dataSource);
  }

  updateAppointmentDataSource(): void {
    this.timeZoneCalculatorInstance = null;

    if (this.getWorkSpace()) {
      this.createAppointmentDataSource();
    }
  }

  private customizeDataSourceLoadOptions(): void {
    // @ts-expect-error customizeStoreLoadOptions is a custom DataSource event
    this._dataSource?.on('customizeStoreLoadOptions', ({ storeLoadOptions }) => {
      storeLoadOptions.startDate = this.getStartViewDate();
      storeLoadOptions.endDate = this.getEndViewDate();
    });
  }

  _initTemplates(): void {
    this.initAppointmentTemplate();

    this._templateManager.addDefaultTemplates({
      appointmentTooltip: new EmptyTemplate(),
      dropDownAppointment: new EmptyTemplate(),
    });
    // @ts-expect-error
    super._initTemplates();
  }

  // TODO<Appointments>: delete this method when old impl is removed
  private initAppointmentTemplate(): void {
    const { expr } = this._dataAccessors;
    const createGetter = (property: string): ((data: unknown) => unknown) => (
      compileGetter(`appointmentData.${property}`) as (data: unknown) => unknown
    );

    const getDate = (getter: (data: unknown) => unknown) => (data: unknown): unknown => {
      const value = getter(data);
      if (value instanceof Date) {
        return value.valueOf();
      }
      return value;
    };

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(
        ($container, data, model) => this.getAppointmentsInstance()
          ._renderAppointmentTemplate($container, data, model),
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

  _renderContent(): void {
    // @ts-expect-error
    this._renderContentImpl();
  }

  _dataSourceChangedHandler(result?: Appointment[]): void {
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

  private renderAppointments(): void {
    const workspace = this.getWorkSpace();
    this._layoutManager.filterAppointments();

    workspace?.option('allDayExpanded', this.isAllDayExpanded());

    // @ts-expect-error
    const viewModel: AppointmentViewModelPlain[] = this._isVisible()
      ? this._layoutManager.generateViewModel()
      : [];

    this._appointments.option('items', viewModel);
    this.appointmentDataSource.cleanState();

    if (this.isAgenda()) {
      this._workSpace.renderAgendaLayout?.(viewModel);
    }
  }

  private initExpressions(fields: IFieldExpr): void {
    this._dataAccessors = new AppointmentDataAccessor(
      fields,
      Boolean(config().forceIsoDateParsing),
      this.option('dateSerializationFormat'),
    );
  }

  private updateExpression(name: string, value: string): void {
    this._dataAccessors.updateExpression(name, value);
  }

  private initEditing(): void {
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

    this.$element().toggleClass(WIDGET_READONLY_CLASS, isReadOnly);
  }

  _dispose(): void {
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

  private initActions(): void {
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
    } as SchedulerActions;
  }

  // TODO<Appointments>: delete this method when old impl is removed
  private getAppointmentRenderedAction(): (args: AppointmentRenderedEvent) => void {
    return this._createActionByOption('onAppointmentRendered', {
      excludeValidators: ['disabled', 'readOnly'],
    }) as (args: AppointmentRenderedEvent) => void;
  }

  _renderFocusTarget(): void { return noop(); }

  private updateA11yStatus(): void {
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

  private renderA11yStatus(): void {
    this.a11yStatus = createA11yStatusContainer();
    this.a11yStatus.prependTo(this.$element());
    // @ts-expect-error
    this.setAria({ role: 'application' });
  }

  private initMarkupOnResourceLoaded(): void {
    if (!this._disposed) {
      this.initMarkupCore();
      this.reloadDataSource().catch(noop);
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
        onAppointmentClick: (args: AppointmentClickEvent) => this.actions.onAppointmentClick(args),
        onAppointmentDblClick: (...args) => this.actions.onAppointmentDblClick(...args),
        onAppointmentContextMenu: (...args) => this.actions.onAppointmentContextMenu(...args),
        onDeleteKeyPress: (e) => {
          this.checkAndDeleteAppointment(e.appointmentData, e.targetedAppointmentData);
        },

        getResourceManager: () => this.resourceManager,
        getAppointmentDataSource: () => this.appointmentDataSource,
        getDataAccessor: () => this._dataAccessors,
        getStartViewDate: (): Date => {
          const startViewDate = this.getStartViewDate();
          if (!startViewDate) {
            throw errors.Error('E0001');
          }
          return startViewDate;
        },
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
      this._dataSourceChangedHandler(this._dataSource?.items() ?? []);
      this._fireContentReadyAction();
    } else {
      const groups = this.getViewOption('groups');

      if (groups?.length) {
        this.resourceManager.loadGroupResources(groups, true)
          .then(() => this.initMarkupOnResourceLoaded())
          .catch(noop);
      } else {
        this.initMarkupOnResourceLoaded();
      }
    }
  }

  private createAppointmentPopupForm(): void {
    if (this.appointmentForm) {
      this.appointmentForm.dispose();
    }
    this.appointmentForm = this.createAppointmentForm();

    this.appointmentPopup?.dispose();
    this.appointmentPopup = this.createAppointmentPopup(this.appointmentForm);
  }

  private renderMainContainer(): void {
    this.mainContainer = $('<div>').addClass('dx-scheduler-container');
    this.$draggableContainer = $('<div>')
      .addClass('dx-scheduler-draggable-container')
      .appendTo(this.mainContainer);

    this.$element().append(this.mainContainer);
  }

  createAppointmentForm(): AppointmentForm {
    const appointmentFormConfig: AppointmentFormConfig = {
      dataAccessors: this._dataAccessors,
      editing: this.editing,
      resourceManager: this.resourceManager,
      firstDayOfWeek: this.getFirstDayOfWeek(),
      startDayHour: this.option('startDayHour') ?? 0,
      createComponent: this._createComponent.bind(this),
      getCalculatedEndDate: (startDateWithStartHour: Date): Date => (
        this._workSpace.calculateEndDate(startDateWithStartHour)
      ),
    };

    return new AppointmentForm(appointmentFormConfig);
  }

  createAppointmentPopup(form: AppointmentForm): AppointmentPopup {
    const scheduler = {
      getElement: (): dxElementWrapper => this.$element(),
      createComponent: this._createComponent.bind(this),
      focus: (): void => { this.focus(); },

      getResourceManager: (): ResourceManager => this.resourceManager,

      getEditingConfig: (): SchedulerEditingState => this.editing,

      getTimeZoneCalculator: (): TimeZoneCalculator => this.timeZoneCalculator,
      getDataAccessors: (): AppointmentDataAccessor => this._dataAccessors,
      getAppointmentFormOpening: (): SchedulerActions['onAppointmentFormOpening'] => (
        this.actions.onAppointmentFormOpening
      ),
      processActionResult: (
        arg: SchedulerActionOptions,
        canceled: ProcessActionCallback,
      ): Promise<void> => this.processActionResult(arg, canceled),

      addAppointment: (appointment: SafeAppointment): Promise<void> => (
        this.addAppointment(appointment)
      ),
      updateAppointment: (
        sourceAppointment: SafeAppointment,
        updatedAppointment: SafeAppointment,
      ): Promise<void> => this.updateAppointment(sourceAppointment, updatedAppointment),

    };
    return new AppointmentPopup(scheduler as never, form);
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

  private getAppointmentTooltipOptions(): AppointmentTooltipOptions {
    return {
      createComponent: this._createComponent.bind(this) as AppointmentTooltipOptions['createComponent'],
      container: this.$element(),
      getScrollableContainer: this.getWorkSpaceScrollableContainer.bind(this),
      addDefaultTemplates: this._templateManager.addDefaultTemplates.bind(this._templateManager),
      getAppointmentTemplate: this.getAppointmentTemplate.bind(this),
      showAppointmentPopup: this.showAppointmentPopup.bind(this),
      checkAndDeleteAppointment: this.checkAndDeleteAppointment.bind(this),
      isAppointmentInAllDayPanel: this.isAppointmentInAllDayPanel.bind(this),

      createFormattedDateText: (appointment, targetedAppointment, format) => this.fire(
        'createFormattedDateText',
        appointment,
        (targetedAppointment ?? appointment) as TargetedAppointment,
        format,
      ),
      getAppointmentDisabled: (appointment) => this._dataAccessors.get('disabled', appointment),
      onItemContextMenu: this._createActionByOption('onAppointmentContextMenu'),
      createEventArgs: this._createEventArgs.bind(this),

      newAppointments: Boolean(this.option('_newAppointments')),
      onAppointmentClick: (args: AppointmentClickEvent) => this.actions.onAppointmentClick(args),
      onListInitialized: (e): void => {
        if (this.option('_newAppointments') && e.element) {
          this.appointmentDragController.createTooltipDraggable(
            $(e.element),
            {
              dragTemplate: this._appointments.renderDragClone.bind(this._appointments),
            },
          );
        }
      },
      onListDisposing: (): void => {
        this.appointmentDragController.disposeTooltipDraggable();
      },
    } satisfies AppointmentTooltipOptions;
  }

  // TODO<Appointments>: delete this method when old impl is removed
  _createEventArgs(
    e: ItemContextMenuEvent<AppointmentTooltipItem>,
  ): AppointmentTooltipContextMenuEventArgs {
    const itemData = e.itemData?.appointment;
    if (!itemData) {
      throw errors.Error('E0001');
    }

    const eventConfig: {
      itemData: SafeAppointment;
      itemElement: dxElementWrapper;
      targetedAppointment?: SafeAppointment | TargetedAppointment;
    } = {
      itemData,
      itemElement: $(e.itemElement),
      targetedAppointment: e.itemData?.targetedAppointment,
    };
    const mappedFields = this.fire('mapAppointmentFields', eventConfig) as MappedAppointmentFields;

    return extend({}, mappedFields, {
      component: e.component,
      element: e.element,
      event: e.event,
      model: e.model,
    }) as AppointmentTooltipContextMenuEventArgs;
  }

  checkAndDeleteAppointment(
    appointment: SafeAppointment,
    targetedAppointment?: SafeAppointment | TargetedAppointment,
  ): void {
    const targetedData = targetedAppointment ?? appointment;
    const targetedAdapter = new AppointmentAdapter(
      targetedData,
      this._dataAccessors,
    );
    const deletingOptions = this.fireOnAppointmentDeleting(appointment, targetedAdapter);
    this.checkRecurringAppointment(
      appointment,
      targetedData,
      targetedAdapter.startDate,
      () => {
        this.processDeleteAppointment(appointment, deletingOptions);
      },
      true,
    );
  }

  private getExtraAppointmentTooltipOptions(): AppointmentTooltipExtraOptions {
    return {
      rtlEnabled: this.option('rtlEnabled'),
      focusStateEnabled: this.option('focusStateEnabled'),
      editing: this.option('editing'),
      offset: this.option('_appointmentTooltipOffset'),
    };
  }

  isAppointmentInAllDayPanel(appointmentData: SafeAppointment | Appointment): boolean {
    const workSpace = this._workSpace;
    const itTakesAllDay = this.appointmentTakesAllDay(appointmentData);

    return itTakesAllDay && workSpace.supportAllDayRow() && Boolean(workSpace.option('showAllDayPanel'));
  }

  private initMarkupCore(): void {
    this.readyToRenderAppointments = hasWindow();

    if (this._workSpace) {
      this.cleanWorkspace();
    }

    this.renderWorkSpace();
    if (this.option('_newAppointments')) {
      this._appointments.option('$allDayContainer', this._workSpace.getAllDayContainer());
    } else {
      this._appointments.option({
        fixedContainer: this._workSpace.getFixedContainer(),
        allDayContainer: this._workSpace.getAllDayContainer(),
      });
    }
    this.waitAsyncTemplate((): void => { this.workSpaceRecalculation?.resolve(); });

    this.createAppointmentDataSource();
    this.setRemoteFilterIfNeeded();
    this.validateKeyFieldIfAgendaExist();
    this.updateA11yStatus();
  }

  private isDataSourceLoaded(): boolean {
    return Boolean(this._dataSource?.isLoaded());
  }

  _render(): void {
    this.getWorkSpace()?.updateHeaderEmptyCellWidth();

    // @ts-expect-error
    super._render();
  }

  private renderHeader(): void {
    const toolbarOptions = this.option('toolbar');
    const isHeaderShown = Boolean(
      toolbarOptions.visible ?? toolbarOptions.items?.length,
    );

    if (isHeaderShown) {
      const $header = $('<div>').appendTo(this.mainContainer);
      const headerOptions = this.headerConfig();
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
      startViewDate: this.getStartViewDate() ?? new Date(),
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

  private appointmentsConfig(): AppointmentCollectionOptions {
    const collectionConfig: AppointmentCollectionOptions = {
      getResourceManager: () => this.resourceManager,
      getAppointmentDataSource: () => this.appointmentDataSource,
      getSortedAppointments: () => this._layoutManager.sortedItems,
      scrollTo: this.scrollTo.bind(this),
      appointmentTooltip: this.appointmentTooltip,
      dataAccessors: this._dataAccessors,
      notifyScheduler: this.notifyScheduler,
      onItemRendered: this.getAppointmentRenderedAction(),
      onItemClick: this._createActionByOption('onAppointmentClick') as (args: AppointmentClickEvent) => void,
      onItemContextMenu: this._createActionByOption('onAppointmentContextMenu') as (args: AppointmentContextMenuEvent) => void,
      onAppointmentDblClick: this._createActionByOption('onAppointmentDblClick') as (args: AppointmentDblClickEvent) => void,
      tabIndex: this.option('tabIndex') ?? 0,
      focusStateEnabled: Boolean(this.option('focusStateEnabled')),
      allowDrag: this.allowDragging(),
      allowDelete: this.editing.allowUpdating && this.editing.allowDeleting,
      allowResize: this.allowResizing(),
      allowAllDayResize: this.allowAllDayResizing(),
      rtlEnabled: Boolean(this.option('rtlEnabled')),
      groups: this.getViewOption('groups'),
      groupByDate: Boolean(this.getViewOption('groupByDate')),
      timeZoneCalculator: this.timeZoneCalculator,
      getResizableStep: () => (
        this._workSpace ? this._workSpace.positionHelper.getResizableStep() : 0
      ),
      getDOMElementsMetaData: () => this._workSpace?.getDOMElementsMetaData(),
      getViewDataProvider: () => this._workSpace?.viewDataProvider,
      isVerticalGroupedWorkSpace: () => this._workSpace.isVerticalGroupedWorkSpace(),
      isDateAndTimeView: () => isDateAndTimeView(this._workSpace.type),
      onContentReady: () => {
        this._workSpace?.option('allDayExpanded', this.isAllDayExpanded());
      },
    };

    return collectionConfig;
  }

  private renderWorkSpace(): void {
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
      }).catch(noop);
    }
    const $workSpace = $('<div>').appendTo(this.mainContainer);

    const currentViewType = this.currentView.type;
    const workSpaceComponent = VIEWS_CONFIG[currentViewType].workSpace;
    const workSpaceConfig = this.workSpaceConfig(this.currentView);
    // @ts-expect-error
    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig) as SchedulerWorkSpaceLike;

    if (!this.option('_newAppointments')) {
      if (this.allowDragging()) {
        this._workSpace.initDragBehavior(this);
      }
    }
    this._workSpace.attachTablesEvents();
    this._workSpace.getWorkArea().append(this._appointments.$element());
  }

  renderAgendaWorkspace(): void {
    const $workSpace = $('<div>').appendTo(this.mainContainer);
    const workSpaceConfig = this.workSpaceConfig(this.currentView);
    const workSpaceComponent = VIEWS_CONFIG.agenda.workSpace;
    // @ts-expect-error
    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig) as SchedulerWorkSpaceLike;
    this._workSpace.getWorkArea().append(this._appointments.$element());
  }

  private recalculateWorkspace(): void {
    // @ts-expect-error
    this.workSpaceRecalculation = new Deferred();
    triggerResizeEvent(this._workSpace.$element());
    this.waitAsyncTemplate(() => {
      this._workSpace.renderCurrentDateTimeLineAndShader();
    });
  }

  private workSpaceConfig(currentViewOptions: NormalizedView): WorkspaceOptionsInternal {
    const cellDuration = this.option('cellDuration');
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

    const workSpaceOptions = extend({
      newAppointments: Boolean(this.option('_newAppointments')),
      resources: this.option('resources'),
      getResourceManager: () => this.resourceManager,
      getFilteredItems: () => this._layoutManager.filteredItems, // NOTE: used only in agenda

      noDataText: this.option('noDataText') || messageLocalization.format('dxCollectionWidget-noDataText'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      viewOffset: this.getViewOffsetMs(),
      tabIndex: this.option('tabIndex') ?? 0,
      accessKey: this.option('accessKey') ?? '',
      focusStateEnabled: Boolean(this.option('focusStateEnabled')),
      showAllDayPanel: this.option('showAllDayPanel'),
      showCurrentTimeIndicator: this.option('showCurrentTimeIndicator'),
      indicatorTime: this.option('indicatorTime') ?? new Date(),
      indicatorUpdateInterval: this.option('indicatorUpdateInterval'),
      shadeUntilCurrentTime: this.option('shadeUntilCurrentTime'),
      crossScrollingEnabled,
      dataCellTemplate: this.option('dataCellTemplate'),
      timeCellTemplate: this.option('timeCellTemplate'),
      resourceCellTemplate: this.option('resourceCellTemplate'),
      dateCellTemplate: this.option('dateCellTemplate'),
      allowMultipleCellSelection: this.option('allowMultipleCellSelection'),
      selectedCellData: this.option('selectedCellData'),
      onSelectionChanged: (args: { selectedCellData: ViewCellData[] }) => {
        this.option('selectedCellData', args.selectedCellData);
      },
      onSelectionEnd: (args: { selectedCellData: ViewCellData[] }) => {
        this.actions.onSelectionEnd({
          selectedCellData: args.selectedCellData,
        });
      },
      groupByDate: Boolean(this.getViewOption('groupByDate')),
      skippedDays: this.getViewOption('hiddenWeekDays') as number[],
      scrolling,
      draggingMode: this.option('_draggingMode'),
      timeZoneCalculator: this.timeZoneCalculator,
      schedulerHeight: this.option('height'),
      schedulerWidth: this.option('width'),
      allDayPanelMode: this.option('allDayPanelMode'),
      onSelectedCellsClick: this.showAddAppointmentPopup.bind(this),
      renderAppointments: (): void => { this.renderAppointments(); },
      onShowAllDayPanel: (value: boolean) => this.option('showAllDayPanel', value),
      getHeaderHeight: (): number => utils.DOM.getHeaderHeight(this.header),
      onScrollEnd: (): void => {
        if (!this.option('_newAppointments')) {
          (this._appointments as unknown as AppointmentCollection).updateResizableArea();
        }
      },
      onInitialized: (e) => {
        if (this.option('_newAppointments')) {
          this.appointmentDragController.createWorkSpaceDraggable(
            $(e.element),
            {
              getAppointmentData: this._appointments.getAppointmentData.bind(
                this._appointments,
              ) as WorkSpaceDraggableOptions['getAppointmentData'],
            },
          );
        }
      },
      onDisposing: (): void => {
        if (this.option('_newAppointments')) {
          this.appointmentDragController.disposeWorkSpaceDraggable();
        }
      },
      rtlEnabled: Boolean(this.option('rtlEnabled')),
      hoursInterval: cellDuration / 60,
      allDayExpanded: false,
      currentDate: this.getViewOption('currentDate'),
    }, currentViewOptions) as WorkspaceOptionsInternal;

    workSpaceOptions.notifyScheduler = this.notifyScheduler;
    workSpaceOptions.groups = this.resourceManager.groupResources();
    workSpaceOptions.onCellClick = this._createActionByOption('onCellClick') as (e: CellClickEvent) => void;
    workSpaceOptions.onCellContextMenu = this._createActionByOption('onCellContextMenu') as (e: CellContextMenuEvent) => void;
    workSpaceOptions.skippedDays = this.getViewOption('hiddenWeekDays') as number[];
    workSpaceOptions.dataCellTemplate = workSpaceOptions.dataCellTemplate
      ? this._getTemplate(workSpaceOptions.dataCellTemplate) as TemplateBase
      : null;
    workSpaceOptions.timeCellTemplate = workSpaceOptions.timeCellTemplate
      ? this._getTemplate(workSpaceOptions.timeCellTemplate) as TemplateBase
      : null;
    workSpaceOptions.resourceCellTemplate = workSpaceOptions.resourceCellTemplate
      ? this._getTemplate(workSpaceOptions.resourceCellTemplate) as TemplateBase
      : null;
    workSpaceOptions.dateCellTemplate = workSpaceOptions.dateCellTemplate
      ? this._getTemplate(workSpaceOptions.dateCellTemplate) as TemplateBase
      : null;

    return workSpaceOptions;
  }

  private waitAsyncTemplate(callback: () => void): void {
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

  getAppointmentTemplate(optionName: string): FunctionTemplate {
    if (this.currentView?.[optionName]) {
      return this._getTemplate(this.currentView[optionName]);
    }

    // @ts-expect-error
    return this._getTemplateByOption(optionName) as FunctionTemplate;
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

    // @ts-expect-error
    this._workSpace = undefined;

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

      this.waitAsyncTemplate((): void => { this.workSpaceRecalculation.resolve(); });
    }
  }

  private cleanWorkspace(): void {
    this._appointments.$element().detach();
    this._workSpace._dispose();
    this._workSpace.$element().remove();

    this.option('selectedCellData', []);
  }

  getWorkSpaceScrollable(): Scrollable {
    return this._workSpace.getScrollable();
  }

  getWorkSpaceScrollableContainer(): dxElementWrapper {
    return this._workSpace.getScrollableContainer();
  }

  getWorkSpace(): SchedulerWorkSpaceLike {
    return this._workSpace;
  }

  getHeader(): SchedulerHeader | undefined {
    return this.header;
  }

  private cleanPopup(): void {
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
          ).finally(resolve).catch(noop);
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
    rawAppointment: SafeAppointment,
    singleAppointment: SafeAppointment,
    exceptionDate: Date,
    callback: () => void,
    isDeleted: boolean,
    isPopupEditing?: boolean,
    dragEvent?: SchedulerDragEvent | null,
    recurrenceEditMode?: RecurrenceEditMode,
    onCancel?: () => void,
  ): void {
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
        this.excludeAppointmentFromSeries(
          rawAppointment,
          singleAppointment,
          exceptionDate,
          isDeleted,
          Boolean(isPopupEditing),
          dragEvent,
        );
        break;
      default:
        if (dragEvent) {
          // @ts-expect-error
          dragEvent.cancel = new Deferred();
        }
        this.showRecurrenceChangeConfirm(isDeleted)
          .done((editingMode) => {
            if (editingMode === RECURRENCE_EDITING_MODE.SERIES) {
              callback();
            }

            if (editingMode === RECURRENCE_EDITING_MODE.OCCURRENCE) {
              this.excludeAppointmentFromSeries(
                rawAppointment,
                singleAppointment,
                exceptionDate,
                isDeleted,
                Boolean(isPopupEditing),
                dragEvent,
              );
            }
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

  private excludeAppointmentFromSeries(
    rawAppointment: SafeAppointment,
    newRawAppointment: SafeAppointment,
    exceptionDate: Date,
    isDeleted: boolean,
    isPopupEditing: boolean,
    dragEvent?: SchedulerDragEvent | null,
  ): void {
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
      this.addAppointment(singleRawAppointment).catch(noop);
    }

    if (isPopupEditing) {
      this.appointmentPopup.show(singleRawAppointment, {
        onSave: (newAppointment) => (
          this.updateAppointment(rawAppointment, appointment.source)
            .then(() => this.addAppointment(newAppointment as SafeAppointment))
            .then(() => { this.scrollToAppointment(newAppointment as SafeAppointment); })
        ),
        title: messageLocalization.format('dxScheduler-editPopupTitle'),
        readOnly: Boolean(appointment.source) && appointment.disabled,
      });
      this.editAppointmentData = rawAppointment;
    } else {
      this.updateAppointmentCore(rawAppointment, appointment.source, () => {
        this._appointments.moveAppointmentBack(dragEvent);
      }, dragEvent).catch(noop);
    }
  }

  private createRecurrenceException(
    appointment: SafeAppointment & { recurrenceException?: string },
    exceptionDate: Date,
  ): string {
    const result: string[] = [];

    if (appointment.recurrenceException) {
      result.push(appointment.recurrenceException);
    }
    const adapter = new AppointmentAdapter(appointment, this._dataAccessors);
    result.push(this.getSerializedDate(exceptionDate, adapter.startDate, Boolean(adapter.allDay)));

    return result.join();
  }

  private getSerializedDate(date: Date, startDate: Date, isAllDay: boolean): string {
    if (isAllDay) {
      date.setHours(
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
        startDate.getMilliseconds(),
      );
    }

    return dateSerialization.serializeDate(date, UTC_FULL_DATE_FORMAT) as string;
  }

  private showRecurrenceChangeConfirm(isDeleted: boolean): DeferredObj<string> {
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
        { text: seriesText, onClick: (): string => RECURRENCE_EDITING_MODE.SERIES },
        { text: occurrenceText, onClick: (): string => RECURRENCE_EDITING_MODE.OCCURRENCE },
      ],
      popupOptions: {
        wrapperAttr: { class: POPUP_DIALOG_CLASS },
        onHidden: (): void => {
          this._appointments?.focus();
        },
      },
    } as CustomDialogOptions) as RecurrenceDialog;

    return this.recurrenceDialog.show();
  }

  getUpdatedData(rawAppointment: Appointment, $cell?: dxElementWrapper): SafeAppointment {
    const viewOffset = this.getViewOffsetMs();

    const getConvertedFromGrid = (date: Date | undefined): Date | undefined => {
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

    if (!dateUtilsTs.isValidDate(appointmentEndDate) && cellEndDate) {
      appointmentEndDate = cellEndDate;
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

    if (
      this.appointmentTakesAllDay(rawAppointment)
      && !result.allDay
      && this._workSpace.supportAllDayRow()
    ) {
      resultedEndDate = this._workSpace.calculateEndDate(resultedStartDate);
    }

    if (
      appointment.allDay
      && !this._workSpace.supportAllDayRow()
      && !this._workSpace.keepOriginalHours()
    ) {
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
  getTargetedAppointment(
    appointment: SafeAppointment,
    element: dxElementWrapper,
  ): TargetedAppointment {
    const settings = utils.dataAccessors.getAppointmentSettings(element);
    if (!settings) {
      throw errors.Error('E0001');
    }
    return getTargetedAppointment(
      appointment,
      settings,
      this._dataAccessors,
      this.resourceManager,
    );
  }

  subscribe<K extends SubscribeKey>(subject: K, action: SubscribeMethods[K]): void {
    this.subscribes[subject] = action;
    subscribes[subject] = action;
  }

  fire<Subject extends SubscribeKey>(
    subject: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> {
    const callback = this.subscribes[subject];

    if (!isFunction(callback)) {
      throw errors.Error('E1031', subject);
    }

    // subscribes callbacks are not fully typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (callback as (
      this: Scheduler,
      ...callbackArgs: Parameters<SubscribeMethods[Subject]>
    ) => ReturnType<SubscribeMethods[Subject]>).apply(this, args);
  }

  getTargetCellData(): DroppableCellData {
    return this._workSpace.getDataByDroppableCell();
  }

  updateAppointmentCore(
    target: SafeAppointment,
    rawAppointment: SafeAppointment,
    onUpdatePrevented?: () => void,
    dragEvent?: SchedulerDragEvent | null,
  ): Promise<void> {
    const updatingOptions = {
      newData: rawAppointment,
      oldData: extend({}, target),
      cancel: false,
    };

    const performFailAction = function performFailAction(this: Scheduler, err?: Error): void {
      if (onUpdatePrevented) {
        onUpdatePrevented.call(this);
      }

      if (err?.name === 'Error') {
        throw err;
      }
    }.bind(this);

    this.actions[StoreEventNames.UPDATING](updatingOptions);

    if (dragEvent && !isDeferred(dragEvent.cancel)) {
      dragEvent.cancel = Deferred<boolean>();
    }

    if (isPromise(updatingOptions.cancel) && (dragEvent || this.option('_newAppointments'))) {
      this.updatingAppointments.add(target);
    }

    return this.processActionResult(updatingOptions, (canceled) => {
      if (!canceled) {
        this.expandAllDayPanel(rawAppointment);

        try {
          return this.appointmentDataSource
            .update(target, rawAppointment)
            .done(() => {
              dragEvent?.cancel.resolve(false);
            })
            .always((storeAppointment) => {
              this.updatingAppointments.delete(target);
              if (isDefined(storeAppointment)) {
                this.onDataPromiseCompleted(StoreEventNames.UPDATED, storeAppointment);
              }
            })
            .fail(() => performFailAction())
            .then(() => undefined);
        } catch (err: unknown) {
          performFailAction(err instanceof Error ? err : undefined);
          this.updatingAppointments.delete(target);
          return Deferred().resolve().promise();
        }
      }

      performFailAction();
      this.updatingAppointments.delete(target);
      return Deferred().resolve().promise();
    });
  }

  private processActionResult(
    actionOptions: SchedulerActionOptions,
    callback: ProcessActionCallback,
  ): Promise<void> {
    const deferred: DeferredObj<void> = Deferred();
    const resolveCallback = (callbackResult: unknown): void => {
      when(fromPromise(callbackResult))
        .always(() => { deferred.resolve(); });
    };

    if (isPromise(actionOptions.cancel)) {
      when(fromPromise(actionOptions.cancel)).always((cancel) => {
        let isCanceled = cancel;
        if (!isDefined(isCanceled)) {
          isCanceled = (actionOptions.cancel as DeferredObj<boolean>).state() === 'rejected';
        }
        resolveCallback(callback.call(this, isCanceled));
      });
    } else {
      resolveCallback(callback.call(this, actionOptions.cancel as boolean));
    }

    return deferred.promise();
  }

  private expandAllDayPanel(appointment: SafeAppointment | Appointment): void {
    if (!this.isAllDayExpanded() && this.appointmentTakesAllDay(appointment)) {
      this.updateOption('workSpace', 'allDayExpanded', true);
    }
  }

  private onDataPromiseCompleted(
    handlerName: StoreEventName,
    storeAppointment: SafeAppointment | Error,
    appointment?: SafeAppointment,
  ): void {
    const args: AppointmentCompletedOptions = {
      appointmentData: (appointment ?? storeAppointment) as SafeAppointment,
    };

    if (storeAppointment instanceof Error) {
      args.error = storeAppointment;
    } else if (this.appointmentPopup.visible) {
      this.appointmentPopup.hide();
    }

    const handler = this.actions[handlerName] as (args: AppointmentCompletedOptions) => void;
    handler(args);
    this._fireContentReadyAction();
  }

  getAppointmentsInstance(): Appointments | AppointmentCollection {
    return this._appointments as unknown as Appointments | AppointmentCollection;
  }

  getLayoutManager(): AppointmentLayoutManager {
    return this._layoutManager;
  }

  getActions(): SchedulerActions {
    return this.actions;
  }

  appointmentTakesAllDay(rawAppointment: SafeAppointment | Appointment): boolean {
    const appointment = new AppointmentAdapter(
      rawAppointment,
      this._dataAccessors,
    );

    return isAppointmentTakesAllDay(
      appointment,
      this.getViewOption('allDayPanelMode'),
    );
  }

  dayHasAppointment(
    day: Date,
    rawAppointment: SafeAppointment | Appointment,
    trimTime: boolean,
  ): boolean {
    const getConvertedToTimeZone = (date: Date): Date => this.timeZoneCalculator.createDate(date, 'toGrid');

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

    let dayStart = day;
    let startDateStart = startDate;
    let endDateEnd = endDate;

    if (trimTime) {
      dayStart = dateUtils.trimTime(day);
      startDateStart = dateUtils.trimTime(startDate);
      endDateEnd = dateUtils.trimTime(endDate);
    }

    const dayTimeStamp = dayStart.getTime();
    const startDateTimeStamp = startDateStart.getTime();
    const endDateTimeStamp = endDateEnd.getTime();

    return startDateTimeStamp <= dayTimeStamp && dayTimeStamp <= endDateTimeStamp;
  }

  getStartViewDate(): Date | undefined {
    return this._workSpace?.getStartViewDate();
  }

  getEndViewDate(): Date {
    return this._workSpace.getEndViewDate();
  }

  showAddAppointmentPopup(cellData: SelectedCellsClickCellData, cellGroups: GroupValues): void {
    const appointmentAdapter = new AppointmentAdapter({}, this._dataAccessors);

    appointmentAdapter.allDay = Boolean(cellData.allDay);
    appointmentAdapter.startDate = new Date(cellData.startDateUTC);
    appointmentAdapter.endDate = new Date(cellData.endDateUTC);

    const resultAppointment = extend(appointmentAdapter.source, cellGroups);
    this.showAppointmentPopup(resultAppointment, true);
  }

  showAppointmentPopup(
    rawAppointment?: SafeAppointment,
    createNewAppointment?: boolean,
    rawTargetedAppointment?: SafeAppointment | TargetedAppointment,
  ): void {
    const newRawTargetedAppointment = rawTargetedAppointment
      ? { ...rawTargetedAppointment }
      : {} as SafeAppointment;
    if (rawTargetedAppointment) {
      delete newRawTargetedAppointment.displayStartDate;
      delete newRawTargetedAppointment.displayEndDate;
    }

    const isCreateAppointment = createNewAppointment ?? isEmptyObject(rawAppointment);

    if (isCreateAppointment) {
      const appointmentData = isEmptyObject(rawAppointment)
        ? this.createPopupAppointment()
        : rawAppointment as SafeAppointment;

      delete this.editAppointmentData; // TODO
      if (this.editing.allowAdding) {
        this.appointmentPopup.show(appointmentData, {
          onSave: (appointment) => (
            this.addAppointment(appointment as SafeAppointment)
              .then(() => { this.scrollToAppointment(appointment as SafeAppointment); })
          ),
          title: messageLocalization.format('dxScheduler-newPopupTitle'),
          readOnly: false,
        });
      }
    } else {
      const appointmentData = rawAppointment as SafeAppointment;
      const newTargetedAppointment = extend(
        {},
        appointmentData,
        newRawTargetedAppointment,
      ) as SafeAppointment;
      const startDate = this._dataAccessors.get(
        'startDate',
        Object.keys(newRawTargetedAppointment).length ? newRawTargetedAppointment : appointmentData,
      );

      this.checkRecurringAppointment(appointmentData, newTargetedAppointment, startDate, () => {
        this.editAppointmentData = appointmentData; // TODO

        const adapter = new AppointmentAdapter(appointmentData, this._dataAccessors);
        const isDisabled = Boolean(adapter.source) && adapter.disabled;
        const readOnly = isDisabled || !this.editing.allowUpdating;

        this.appointmentPopup.show(appointmentData, {
          onSave: (appointment) => (
            this.updateAppointment(appointmentData, appointment as SafeAppointment)
              .then(() => { this.scrollToAppointment(appointment as SafeAppointment); })
          ),
          title: messageLocalization.format('dxScheduler-editPopupTitle'),
          readOnly,
        });
      }, false, true);
    }
  }

  createPopupAppointment(): SafeAppointment {
    const result: SafeAppointment = {};
    const msPerMinute = dateUtils.dateToMilliseconds('minute');

    const startDate = new Date(this.option('currentDate'));
    const endDate = new Date(startDate.getTime() + this.option('cellDuration') * msPerMinute);

    this._dataAccessors.set('startDate', result, startDate);
    this._dataAccessors.set('endDate', result, endDate);

    return result;
  }

  hideAppointmentPopup(saveChanges?: boolean): void {
    if (this.appointmentPopup?.visible) {
      if (saveChanges) {
        this.appointmentPopup.saveChangesAsync().catch(noop);
      }
      this.appointmentPopup.hide();
    }
  }

  // NOTE: public API
  showAppointmentTooltip(
    appointment: SafeAppointment,
    element: dxElementWrapper,
    targetedAppointment?: SafeAppointment,
  ): void {
    if (appointment) {
      const settings = utils.dataAccessors.getAppointmentSettings(element);
      if (!settings) {
        return;
      }

      const appointmentConfig = {
        itemData: targetedAppointment ?? appointment,
        groupIndex: settings.groupIndex ?? 0,
      };

      const info: AppointmentTooltipItem = {
        appointment,
        targetedAppointment,
        color: this.resourceManager.getAppointmentColor(appointmentConfig),
        settings: settings as AppointmentItemViewModel,
      };

      this.showAppointmentTooltipCore(element, [info]);
    }
  }

  showAppointmentTooltipCore(
    target: dxElementWrapper,
    data: AppointmentTooltipItem[],
    options?: AppointmentTooltipExtraOptions,
  ): void {
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
      this.processActionResult({ ...arg, cancel: arg.cancel ?? false }, (canceled) => {
        if (!canceled) {
          this.appointmentTooltip.show(target, data, {
            ...this.getExtraAppointmentTooltipOptions(),
            ...options,
          });
        }
      }).catch(noop);
    }
  }

  hideAppointmentTooltip(): void {
    this.appointmentTooltip?.hide();
  }

  scrollTo(
    date: Date,
    groupValuesOrOptions?: ScrollToGroupValuesOrOptions,
    allDay?: boolean | undefined,
  ): void {
    if (this.isScrollOptionsObject(groupValuesOrOptions)) {
      this._workSpace.scrollTo(
        date,
        groupValuesOrOptions.group,
        groupValuesOrOptions.allDay,
        true,
        groupValuesOrOptions.alignInView ?? 'center',
      );
      return;
    }

    if (isDefined(groupValuesOrOptions) || isDefined(allDay)) {
      errors.log(
        'W0002',
        'dxScheduler',
        'scrollTo(date, group, allDay)',
        '26.1',
        'Use scrollTo(date, { group, allDay, alignInView }) instead.',
      );
    }

    this._workSpace.scrollTo(date, groupValuesOrOptions, allDay, true, 'center');
  }

  private isScrollOptionsObject(
    options?: ScrollToGroupValuesOrOptions,
  ): options is ScrollToOptions {
    return Boolean(options) && typeof options === 'object'
      && (
        'alignInView' in options
        || 'allDay' in options
        || 'group' in options
      );
  }

  private isHorizontalVirtualScrolling(): boolean {
    const scrolling = this.option('scrolling');
    const { orientation, mode } = scrolling;
    const isVirtualScrolling = mode === 'virtual';

    return isVirtualScrolling
      && (orientation === 'horizontal' || orientation === 'both');
  }

  addAppointment(rawAppointment: SafeAppointment): Promise<void> {
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
        return Deferred().resolve().promise();
      }

      this.expandAllDayPanel(serializedAppointment);

      return this.appointmentDataSource
        .add(serializedAppointment)
        .always((storeAppointment) => {
          this.onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment);
        });
    });
  }

  updateAppointment(target: SafeAppointment, appointment: SafeAppointment): Promise<void> {
    return this.updateAppointmentCore(target, appointment);
  }

  deleteAppointment(rawAppointment: SafeAppointment): void {
    const deletingOptions = this.fireOnAppointmentDeleting(rawAppointment);
    this.processDeleteAppointment(rawAppointment, deletingOptions);
  }

  fireOnAppointmentDeleting(
    rawAppointment: SafeAppointment,
    targetedAppointmentData?: SafeAppointment | AppointmentAdapter,
  ): AppointmentDeletingOptions {
    const deletingOptions: AppointmentDeletingOptions = {
      appointmentData: rawAppointment,
      targetedAppointmentData,
      cancel: false,
    };

    this.actions[StoreEventNames.DELETING](deletingOptions);

    return deletingOptions;
  }

  processDeleteAppointment(
    rawAppointment: SafeAppointment,
    deletingOptions: AppointmentDeletingOptions,
  ): void {
    this.processActionResult(deletingOptions, (canceled) => {
      if (!canceled) {
        this.appointmentDataSource
          .remove(rawAppointment)
          .always((storeAppointment) => {
            if (isDefined(storeAppointment)) {
              this.onDataPromiseCompleted(
                StoreEventNames.DELETED,
                storeAppointment,
                rawAppointment,
              );
            }
          });
      }
    }).catch(noop);
  }

  deleteRecurrence(
    appointment: SafeAppointment,
    date: Date | string,
    recurrenceEditMode: RecurrenceEditMode,
  ): void {
    const dateValue = typeof date === 'string' ? new Date(date) : date;
    this.checkRecurringAppointment(
      appointment,
      {},
      dateValue,
      () => {
        this.processDeleteAppointment(
          appointment,
          { appointmentData: appointment, cancel: false },
        );
      },
      true,
      false,
      undefined,
      recurrenceEditMode,
    );
  }

  focus(): void {
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

  private validateKeyFieldIfAgendaExist(): void {
    if (!this.appointmentDataSource?.isDataSourceInit) {
      return;
    }

    const hasAgendaView = this.hasAgendaView();
    const isKeyNotExist = !this.appointmentDataSource.keyName;

    if (hasAgendaView && isKeyNotExist) {
      errors.log('W1023');
    }
  }

  // TODO: used externally in m_appointment_drag_behavior.ts
  _getDragBehavior(): AppointmentDragBehavior | null {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Scheduler as any).include(DataHelperMixin);

// @ts-ignore
registerComponent('dxScheduler', Scheduler);

export default Scheduler;
