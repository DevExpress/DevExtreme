"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxScheduler, {
    Properties
} from "devextreme/ui/scheduler";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ViewType, AppointmentAddedEvent, AppointmentAddingEvent, AppointmentClickEvent, AppointmentContextMenuEvent, AppointmentDblClickEvent, AppointmentDeletedEvent, AppointmentDeletingEvent, AppointmentFormOpeningEvent, AppointmentRenderedEvent, AppointmentTooltipShowingEvent, AppointmentUpdatedEvent, AppointmentUpdatingEvent, CellClickEvent, CellContextMenuEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, AllDayPanelMode, AppointmentTemplateData, AppointmentTooltipTemplateData, CellAppointmentsLimit, dxSchedulerScrolling } from "devextreme/ui/scheduler";
import type { event } from "devextreme/events/index";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { ScrollMode, FirstDayOfWeek, Orientation } from "devextreme/common";
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
  appointmentRender?: (...params: any) => React.ReactNode;
  appointmentComponent?: React.ComponentType<any>;
  appointmentTooltipRender?: (...params: any) => React.ReactNode;
  appointmentTooltipComponent?: React.ComponentType<any>;
  dataCellRender?: (...params: any) => React.ReactNode;
  dataCellComponent?: React.ComponentType<any>;
  dateCellRender?: (...params: any) => React.ReactNode;
  dateCellComponent?: React.ComponentType<any>;
  dropDownAppointmentRender?: (...params: any) => React.ReactNode;
  dropDownAppointmentComponent?: React.ComponentType<any>;
  resourceCellRender?: (...params: any) => React.ReactNode;
  resourceCellComponent?: React.ComponentType<any>;
  timeCellRender?: (...params: any) => React.ReactNode;
  timeCellComponent?: React.ComponentType<any>;
  defaultCurrentDate?: Date | number | string;
  defaultCurrentView?: ViewType;
  onCurrentDateChange?: (value: Date | number | string) => void;
  onCurrentViewChange?: (value: ViewType) => void;
}>

interface SchedulerRef {
  instance: () => dxScheduler;
}

const Scheduler = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISchedulerOptions>, ref: ForwardedRef<SchedulerRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["currentDate","currentView"]), []);
      const independentEvents = useMemo(() => (["onAppointmentAdded","onAppointmentAdding","onAppointmentClick","onAppointmentContextMenu","onAppointmentDblClick","onAppointmentDeleted","onAppointmentDeleting","onAppointmentFormOpening","onAppointmentRendered","onAppointmentTooltipShowing","onAppointmentUpdated","onAppointmentUpdating","onCellClick","onCellContextMenu","onContentReady","onDisposing","onInitialized"]), []);

      const defaults = useMemo(() => ({
        defaultCurrentDate: "currentDate",
        defaultCurrentView: "currentView",
      }), []);

      const expectedChildren = useMemo(() => ({
        appointmentDragging: { optionName: "appointmentDragging", isCollectionItem: false },
        editing: { optionName: "editing", isCollectionItem: false },
        resource: { optionName: "resources", isCollectionItem: true },
        scrolling: { optionName: "scrolling", isCollectionItem: false },
        view: { optionName: "views", isCollectionItem: true }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "appointmentCollectorTemplate",
          render: "appointmentCollectorRender",
          component: "appointmentCollectorComponent"
        },
        {
          tmplOption: "appointmentTemplate",
          render: "appointmentRender",
          component: "appointmentComponent"
        },
        {
          tmplOption: "appointmentTooltipTemplate",
          render: "appointmentTooltipRender",
          component: "appointmentTooltipComponent"
        },
        {
          tmplOption: "dataCellTemplate",
          render: "dataCellRender",
          component: "dataCellComponent"
        },
        {
          tmplOption: "dateCellTemplate",
          render: "dateCellRender",
          component: "dateCellComponent"
        },
        {
          tmplOption: "dropDownAppointmentTemplate",
          render: "dropDownAppointmentRender",
          component: "dropDownAppointmentComponent"
        },
        {
          tmplOption: "resourceCellTemplate",
          render: "resourceCellRender",
          component: "resourceCellComponent"
        },
        {
          tmplOption: "timeCellTemplate",
          render: "timeCellRender",
          component: "timeCellComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISchedulerOptions>>, {
          WidgetClass: dxScheduler,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISchedulerOptions> & { ref?: Ref<SchedulerRef> }) => ReactElement | null;


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
const _componentAppointmentDragging = memo(
  (props: IAppointmentDraggingProps) => {
    return React.createElement(NestedOption<IAppointmentDraggingProps>, { ...props });
  }
);

const AppointmentDragging: typeof _componentAppointmentDragging & IElementDescriptor = Object.assign(_componentAppointmentDragging, {
  OptionName: "appointmentDragging",
})

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
const _componentEditing = memo(
  (props: IEditingProps) => {
    return React.createElement(NestedOption<IEditingProps>, { ...props });
  }
);

const Editing: typeof _componentEditing & IElementDescriptor = Object.assign(_componentEditing, {
  OptionName: "editing",
})

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
const _componentResource = memo(
  (props: IResourceProps) => {
    return React.createElement(NestedOption<IResourceProps>, { ...props });
  }
);

const Resource: typeof _componentResource & IElementDescriptor = Object.assign(_componentResource, {
  OptionName: "resources",
  IsCollectionItem: true,
})

// owners:
// Scheduler
// View
type IScrollingProps = React.PropsWithChildren<{
  mode?: ScrollMode;
}>
const _componentScrolling = memo(
  (props: IScrollingProps) => {
    return React.createElement(NestedOption<IScrollingProps>, { ...props });
  }
);

const Scrolling: typeof _componentScrolling & IElementDescriptor = Object.assign(_componentScrolling, {
  OptionName: "scrolling",
})

// owners:
// Scheduler
type IViewProps = React.PropsWithChildren<{
  agendaDuration?: number;
  allDayPanelMode?: AllDayPanelMode;
  appointmentCollectorTemplate?: ((data: { appointmentCount: number, isCompact: boolean }, collectorElement: any) => string | any) | template;
  appointmentTemplate?: ((model: AppointmentTemplateData | { appointmentData: Record<string, any>, targetedAppointmentData: Record<string, any> }, itemIndex: number, contentElement: any) => string | any) | template;
  appointmentTooltipTemplate?: ((model: AppointmentTooltipTemplateData | { appointmentData: Record<string, any>, targetedAppointmentData: Record<string, any> }, itemIndex: number, contentElement: any) => string | any) | template;
  cellDuration?: number;
  dataCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  dateCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  dropDownAppointmentTemplate?: ((itemData: any, itemIndex: number, contentElement: any) => string | any) | template;
  endDayHour?: number;
  firstDayOfWeek?: FirstDayOfWeek;
  groupByDate?: boolean;
  groupOrientation?: Orientation;
  groups?: Array<string>;
  intervalCount?: number;
  maxAppointmentsPerCell?: CellAppointmentsLimit | number;
  name?: string;
  offset?: number;
  resourceCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  scrolling?: dxSchedulerScrolling;
  startDate?: Date | number | string;
  startDayHour?: number;
  timeCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  type?: ViewType;
  appointmentCollectorRender?: (...params: any) => React.ReactNode;
  appointmentCollectorComponent?: React.ComponentType<any>;
  appointmentRender?: (...params: any) => React.ReactNode;
  appointmentComponent?: React.ComponentType<any>;
  appointmentTooltipRender?: (...params: any) => React.ReactNode;
  appointmentTooltipComponent?: React.ComponentType<any>;
  dataCellRender?: (...params: any) => React.ReactNode;
  dataCellComponent?: React.ComponentType<any>;
  dateCellRender?: (...params: any) => React.ReactNode;
  dateCellComponent?: React.ComponentType<any>;
  dropDownAppointmentRender?: (...params: any) => React.ReactNode;
  dropDownAppointmentComponent?: React.ComponentType<any>;
  resourceCellRender?: (...params: any) => React.ReactNode;
  resourceCellComponent?: React.ComponentType<any>;
  timeCellRender?: (...params: any) => React.ReactNode;
  timeCellComponent?: React.ComponentType<any>;
}>
const _componentView = memo(
  (props: IViewProps) => {
    return React.createElement(NestedOption<IViewProps>, { ...props });
  }
);

const View: typeof _componentView & IElementDescriptor = Object.assign(_componentView, {
  OptionName: "views",
  IsCollectionItem: true,
  ExpectedChildren: {
    scrolling: { optionName: "scrolling", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "appointmentCollectorTemplate",
    render: "appointmentCollectorRender",
    component: "appointmentCollectorComponent"
  }, {
    tmplOption: "appointmentTemplate",
    render: "appointmentRender",
    component: "appointmentComponent"
  }, {
    tmplOption: "appointmentTooltipTemplate",
    render: "appointmentTooltipRender",
    component: "appointmentTooltipComponent"
  }, {
    tmplOption: "dataCellTemplate",
    render: "dataCellRender",
    component: "dataCellComponent"
  }, {
    tmplOption: "dateCellTemplate",
    render: "dateCellRender",
    component: "dateCellComponent"
  }, {
    tmplOption: "dropDownAppointmentTemplate",
    render: "dropDownAppointmentRender",
    component: "dropDownAppointmentComponent"
  }, {
    tmplOption: "resourceCellTemplate",
    render: "resourceCellRender",
    component: "resourceCellComponent"
  }, {
    tmplOption: "timeCellTemplate",
    render: "timeCellRender",
    component: "timeCellComponent"
  }],
})

export default Scheduler;
export {
  Scheduler,
  ISchedulerOptions,
  SchedulerRef,
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

