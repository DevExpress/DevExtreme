import dxScheduler, {
    Properties
} from "devextreme/ui/scheduler";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { AppointmentAddedEvent, AppointmentAddingEvent, AppointmentClickEvent, AppointmentContextMenuEvent, AppointmentDblClickEvent, AppointmentDeletedEvent, AppointmentDeletingEvent, AppointmentFormOpeningEvent, AppointmentRenderedEvent, AppointmentTooltipShowingEvent, AppointmentUpdatedEvent, AppointmentUpdatingEvent, CellClickEvent, CellContextMenuEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, AppointmentTemplateData, AppointmentTooltipTemplateData, dxSchedulerScrolling } from "devextreme/ui/scheduler";
import type { event } from "devextreme/events/index";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/abstract_store";
import type { template } from "devextreme/core/templates/template";

import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";
import type DataSource from "devextreme/data/data_source";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISchedulerOptionsNarrowedEvents = {
  onAppointmentAdded?: ((e: AppointmentAddedEvent) => void);
  onAppointmentAdding?: ((e: AppointmentAddingEvent) => void);
  onAppointmentClick?: ((e: AppointmentClickEvent) => void);
  onAppointmentContextMenu?: ((e: AppointmentContextMenuEvent) => void);
  onAppointmentDblClick?: ((e: AppointmentDblClickEvent) => void);
  onAppointmentDeleted?: ((e: AppointmentDeletedEvent) => void);
  onAppointmentDeleting?: ((e: AppointmentDeletingEvent) => void);
  onAppointmentFormOpening?: ((e: AppointmentFormOpeningEvent) => void);
  onAppointmentRendered?: ((e: AppointmentRenderedEvent) => void);
  onAppointmentTooltipShowing?: ((e: AppointmentTooltipShowingEvent) => void);
  onAppointmentUpdated?: ((e: AppointmentUpdatedEvent) => void);
  onAppointmentUpdating?: ((e: AppointmentUpdatingEvent) => void);
  onCellClick?: ((e: CellClickEvent) => void);
  onCellContextMenu?: ((e: CellContextMenuEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type ISchedulerOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISchedulerOptionsNarrowedEvents> & IHtmlOptions & {
  appointmentCollectorRender?: (...params: any) => React.ReactNode;
  appointmentCollectorComponent?: React.ComponentType<any>;
  appointmentCollectorKeyFn?: (data: any) => string;
  appointmentRender?: (...params: any) => React.ReactNode;
  appointmentComponent?: React.ComponentType<any>;
  appointmentKeyFn?: (data: any) => string;
  appointmentTooltipRender?: (...params: any) => React.ReactNode;
  appointmentTooltipComponent?: React.ComponentType<any>;
  appointmentTooltipKeyFn?: (data: any) => string;
  dataCellRender?: (...params: any) => React.ReactNode;
  dataCellComponent?: React.ComponentType<any>;
  dataCellKeyFn?: (data: any) => string;
  dateCellRender?: (...params: any) => React.ReactNode;
  dateCellComponent?: React.ComponentType<any>;
  dateCellKeyFn?: (data: any) => string;
  dropDownAppointmentRender?: (...params: any) => React.ReactNode;
  dropDownAppointmentComponent?: React.ComponentType<any>;
  dropDownAppointmentKeyFn?: (data: any) => string;
  resourceCellRender?: (...params: any) => React.ReactNode;
  resourceCellComponent?: React.ComponentType<any>;
  resourceCellKeyFn?: (data: any) => string;
  timeCellRender?: (...params: any) => React.ReactNode;
  timeCellComponent?: React.ComponentType<any>;
  timeCellKeyFn?: (data: any) => string;
  defaultCurrentDate?: any | number | string;
  defaultCurrentView?: "agenda" | "day" | "month" | "timelineDay" | "timelineMonth" | "timelineWeek" | "timelineWorkWeek" | "week" | "workWeek";
  onCurrentDateChange?: (value: any | number | string) => void;
  onCurrentViewChange?: (value: "agenda" | "day" | "month" | "timelineDay" | "timelineMonth" | "timelineWeek" | "timelineWorkWeek" | "week" | "workWeek") => void;
}>

class Scheduler extends BaseComponent<React.PropsWithChildren<ISchedulerOptions>> {

  public get instance(): dxScheduler {
    return this._instance;
  }

  protected _WidgetClass = dxScheduler;

  protected subscribableOptions = ["currentDate","currentView"];

  protected independentEvents = ["onAppointmentAdded","onAppointmentAdding","onAppointmentClick","onAppointmentContextMenu","onAppointmentDblClick","onAppointmentDeleted","onAppointmentDeleting","onAppointmentFormOpening","onAppointmentRendered","onAppointmentTooltipShowing","onAppointmentUpdated","onAppointmentUpdating","onCellClick","onCellContextMenu","onContentReady","onDisposing","onInitialized"];

  protected _defaults = {
    defaultCurrentDate: "currentDate",
    defaultCurrentView: "currentView"
  };

  protected _expectedChildren = {
    appointmentDragging: { optionName: "appointmentDragging", isCollectionItem: false },
    editing: { optionName: "editing", isCollectionItem: false },
    resource: { optionName: "resources", isCollectionItem: true },
    scrolling: { optionName: "scrolling", isCollectionItem: false },
    view: { optionName: "views", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "appointmentCollectorTemplate",
    render: "appointmentCollectorRender",
    component: "appointmentCollectorComponent",
    keyFn: "appointmentCollectorKeyFn"
  }, {
    tmplOption: "appointmentTemplate",
    render: "appointmentRender",
    component: "appointmentComponent",
    keyFn: "appointmentKeyFn"
  }, {
    tmplOption: "appointmentTooltipTemplate",
    render: "appointmentTooltipRender",
    component: "appointmentTooltipComponent",
    keyFn: "appointmentTooltipKeyFn"
  }, {
    tmplOption: "dataCellTemplate",
    render: "dataCellRender",
    component: "dataCellComponent",
    keyFn: "dataCellKeyFn"
  }, {
    tmplOption: "dateCellTemplate",
    render: "dateCellRender",
    component: "dateCellComponent",
    keyFn: "dateCellKeyFn"
  }, {
    tmplOption: "dropDownAppointmentTemplate",
    render: "dropDownAppointmentRender",
    component: "dropDownAppointmentComponent",
    keyFn: "dropDownAppointmentKeyFn"
  }, {
    tmplOption: "resourceCellTemplate",
    render: "resourceCellRender",
    component: "resourceCellComponent",
    keyFn: "resourceCellKeyFn"
  }, {
    tmplOption: "timeCellTemplate",
    render: "timeCellRender",
    component: "timeCellComponent",
    keyFn: "timeCellKeyFn"
  }];
}
(Scheduler as any).propTypes = {
  accessKey: PropTypes.string,
  adaptivityEnabled: PropTypes.bool,
  allDayExpr: PropTypes.string,
  allDayPanelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "all",
      "allDay",
      "hidden"])
  ]),
  appointmentDragging: PropTypes.object,
  cellDuration: PropTypes.number,
  crossScrollingEnabled: PropTypes.bool,
  currentView: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "agenda",
      "day",
      "month",
      "timelineDay",
      "timelineMonth",
      "timelineWeek",
      "timelineWorkWeek",
      "week",
      "workWeek"])
  ]),
  customizeDateNavigatorText: PropTypes.func,
  dateSerializationFormat: PropTypes.string,
  descriptionExpr: PropTypes.string,
  disabled: PropTypes.bool,
  editing: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  elementAttr: PropTypes.object,
  endDateExpr: PropTypes.string,
  endDateTimeZoneExpr: PropTypes.string,
  endDayHour: PropTypes.number,
  firstDayOfWeek: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      0,
      1,
      2,
      3,
      4,
      5,
      6])
  ]),
  focusStateEnabled: PropTypes.bool,
  groupByDate: PropTypes.bool,
  groups: PropTypes.array,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  indicatorUpdateInterval: PropTypes.number,
  maxAppointmentsPerCell: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto",
      "unlimited"])
  ])
  ]),
  noDataText: PropTypes.string,
  offset: PropTypes.number,
  onAppointmentAdded: PropTypes.func,
  onAppointmentAdding: PropTypes.func,
  onAppointmentClick: PropTypes.func,
  onAppointmentContextMenu: PropTypes.func,
  onAppointmentDblClick: PropTypes.func,
  onAppointmentDeleted: PropTypes.func,
  onAppointmentDeleting: PropTypes.func,
  onAppointmentFormOpening: PropTypes.func,
  onAppointmentRendered: PropTypes.func,
  onAppointmentTooltipShowing: PropTypes.func,
  onAppointmentUpdated: PropTypes.func,
  onAppointmentUpdating: PropTypes.func,
  onCellClick: PropTypes.func,
  onCellContextMenu: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  recurrenceEditMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "dialog",
      "occurrence",
      "series"])
  ]),
  recurrenceExceptionExpr: PropTypes.string,
  recurrenceRuleExpr: PropTypes.string,
  remoteFiltering: PropTypes.bool,
  resources: PropTypes.array,
  rtlEnabled: PropTypes.bool,
  scrolling: PropTypes.object,
  selectedCellData: PropTypes.array,
  shadeUntilCurrentTime: PropTypes.bool,
  showAllDayPanel: PropTypes.bool,
  showCurrentTimeIndicator: PropTypes.bool,
  startDateExpr: PropTypes.string,
  startDateTimeZoneExpr: PropTypes.string,
  startDayHour: PropTypes.number,
  tabIndex: PropTypes.number,
  textExpr: PropTypes.string,
  timeZone: PropTypes.string,
  useDropDownViewSwitcher: PropTypes.bool,
  views: PropTypes.array,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Scheduler
type IAppointmentDraggingProps = React.PropsWithChildren<{
  autoScroll?: boolean;
  data?: any;
  group?: string;
  onAdd?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void);
  onDragEnd?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void);
  onDragMove?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void);
  onDragStart?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void);
  onRemove?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void);
  scrollSensitivity?: number;
  scrollSpeed?: number;
}>
class AppointmentDragging extends NestedOption<IAppointmentDraggingProps> {
  public static OptionName = "appointmentDragging";
}

// owners:
// Scheduler
type IEditingProps = React.PropsWithChildren<{
  allowAdding?: boolean;
  allowDeleting?: boolean;
  allowDragging?: boolean;
  allowResizing?: boolean;
  allowTimeZoneEditing?: boolean;
  allowUpdating?: boolean;
}>
class Editing extends NestedOption<IEditingProps> {
  public static OptionName = "editing";
}

// owners:
// Scheduler
type IResourceProps = React.PropsWithChildren<{
  allowMultiple?: boolean;
  colorExpr?: string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  displayExpr?: ((resource: any) => string) | string;
  fieldExpr?: string;
  label?: string;
  useColorAsDefault?: boolean;
  valueExpr?: (() => void) | string;
}>
class Resource extends NestedOption<IResourceProps> {
  public static OptionName = "resources";
  public static IsCollectionItem = true;
}

// owners:
// Scheduler
// View
type IScrollingProps = React.PropsWithChildren<{
  mode?: "standard" | "virtual";
}>
class Scrolling extends NestedOption<IScrollingProps> {
  public static OptionName = "scrolling";
}

// owners:
// Scheduler
type IViewProps = React.PropsWithChildren<{
  agendaDuration?: number;
  allDayPanelMode?: "all" | "allDay" | "hidden";
  appointmentCollectorTemplate?: ((data: { appointmentCount: number, isCompact: boolean }, collectorElement: any) => string | any) | template;
  appointmentTemplate?: ((model: AppointmentTemplateData | { appointmentData: Record<string, any>, targetedAppointmentData: Record<string, any> }, itemIndex: number, contentElement: any) => string | any) | template;
  appointmentTooltipTemplate?: ((model: AppointmentTooltipTemplateData | { appointmentData: Record<string, any>, targetedAppointmentData: Record<string, any> }, itemIndex: number, contentElement: any) => string | any) | template;
  cellDuration?: number;
  dataCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  dateCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  dropDownAppointmentTemplate?: ((itemData: any, itemIndex: number, contentElement: any) => string | any) | template;
  endDayHour?: number;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  groupByDate?: boolean;
  groupOrientation?: "horizontal" | "vertical";
  groups?: Array<string>;
  intervalCount?: number;
  maxAppointmentsPerCell?: number | "auto" | "unlimited";
  name?: string;
  offset?: number;
  resourceCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  scrolling?: dxSchedulerScrolling;
  startDate?: any | number | string;
  startDayHour?: number;
  timeCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  type?: "agenda" | "day" | "month" | "timelineDay" | "timelineMonth" | "timelineWeek" | "timelineWorkWeek" | "week" | "workWeek";
  appointmentCollectorRender?: (...params: any) => React.ReactNode;
  appointmentCollectorComponent?: React.ComponentType<any>;
  appointmentCollectorKeyFn?: (data: any) => string;
  appointmentRender?: (...params: any) => React.ReactNode;
  appointmentComponent?: React.ComponentType<any>;
  appointmentKeyFn?: (data: any) => string;
  appointmentTooltipRender?: (...params: any) => React.ReactNode;
  appointmentTooltipComponent?: React.ComponentType<any>;
  appointmentTooltipKeyFn?: (data: any) => string;
  dataCellRender?: (...params: any) => React.ReactNode;
  dataCellComponent?: React.ComponentType<any>;
  dataCellKeyFn?: (data: any) => string;
  dateCellRender?: (...params: any) => React.ReactNode;
  dateCellComponent?: React.ComponentType<any>;
  dateCellKeyFn?: (data: any) => string;
  dropDownAppointmentRender?: (...params: any) => React.ReactNode;
  dropDownAppointmentComponent?: React.ComponentType<any>;
  dropDownAppointmentKeyFn?: (data: any) => string;
  resourceCellRender?: (...params: any) => React.ReactNode;
  resourceCellComponent?: React.ComponentType<any>;
  resourceCellKeyFn?: (data: any) => string;
  timeCellRender?: (...params: any) => React.ReactNode;
  timeCellComponent?: React.ComponentType<any>;
  timeCellKeyFn?: (data: any) => string;
}>
class View extends NestedOption<IViewProps> {
  public static OptionName = "views";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    scrolling: { optionName: "scrolling", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "appointmentCollectorTemplate",
    render: "appointmentCollectorRender",
    component: "appointmentCollectorComponent",
    keyFn: "appointmentCollectorKeyFn"
  }, {
    tmplOption: "appointmentTemplate",
    render: "appointmentRender",
    component: "appointmentComponent",
    keyFn: "appointmentKeyFn"
  }, {
    tmplOption: "appointmentTooltipTemplate",
    render: "appointmentTooltipRender",
    component: "appointmentTooltipComponent",
    keyFn: "appointmentTooltipKeyFn"
  }, {
    tmplOption: "dataCellTemplate",
    render: "dataCellRender",
    component: "dataCellComponent",
    keyFn: "dataCellKeyFn"
  }, {
    tmplOption: "dateCellTemplate",
    render: "dateCellRender",
    component: "dateCellComponent",
    keyFn: "dateCellKeyFn"
  }, {
    tmplOption: "dropDownAppointmentTemplate",
    render: "dropDownAppointmentRender",
    component: "dropDownAppointmentComponent",
    keyFn: "dropDownAppointmentKeyFn"
  }, {
    tmplOption: "resourceCellTemplate",
    render: "resourceCellRender",
    component: "resourceCellComponent",
    keyFn: "resourceCellKeyFn"
  }, {
    tmplOption: "timeCellTemplate",
    render: "timeCellRender",
    component: "timeCellComponent",
    keyFn: "timeCellKeyFn"
  }];
}

export default Scheduler;
export {
  Scheduler,
  ISchedulerOptions,
  AppointmentDragging,
  IAppointmentDraggingProps,
  Editing,
  IEditingProps,
  Resource,
  IResourceProps,
  Scrolling,
  IScrollingProps,
  View,
  IViewProps
};
import type * as SchedulerTypes from 'devextreme/ui/scheduler_types';
export { SchedulerTypes };

