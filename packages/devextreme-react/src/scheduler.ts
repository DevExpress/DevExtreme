"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxScheduler, {
    Properties
} from "devextreme/ui/scheduler";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ViewType, AppointmentAddedEvent, AppointmentAddingEvent, AppointmentClickEvent, AppointmentContextMenuEvent, AppointmentDblClickEvent, AppointmentDeletedEvent, AppointmentDeletingEvent, AppointmentFormOpeningEvent, AppointmentRenderedEvent, AppointmentTooltipShowingEvent, AppointmentUpdatedEvent, AppointmentUpdatingEvent, CellClickEvent, CellContextMenuEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, SchedulerPredefinedToolbarItem, DateNavigatorItemProperties, SchedulerPredefinedDateNavigatorItem, dxSchedulerToolbarItem, AllDayPanelMode, AppointmentCollectorTemplateData, AppointmentTemplateData, AppointmentTooltipTemplateData, CellAppointmentsLimit, dxSchedulerScrolling } from "devextreme/ui/scheduler";
import type { ContentReadyEvent as ButtonGroupContentReadyEvent, DisposingEvent as ButtonGroupDisposingEvent, InitializedEvent as ButtonGroupInitializedEvent, dxButtonGroupItem, ItemClickEvent, OptionChangedEvent, SelectionChangedEvent } from "devextreme/ui/button_group";
import type { event } from "devextreme/events/events.types";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { ToolbarItemLocation, template, ToolbarItemComponent, ButtonType, SingleMultipleOrNone, ButtonStyle, ScrollMode, FirstDayOfWeek, Orientation } from "devextreme/common";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

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
  resourceCellRender?: (...params: any) => React.ReactNode;
  resourceCellComponent?: React.ComponentType<any>;
  timeCellRender?: (...params: any) => React.ReactNode;
  timeCellComponent?: React.ComponentType<any>;
  defaultCurrentDate?: Date | number | string;
  defaultCurrentView?: string | ViewType;
  onCurrentDateChange?: (value: Date | number | string) => void;
  onCurrentViewChange?: (value: string | ViewType) => void;
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
      ), []);

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
        toolbar: { optionName: "toolbar", isCollectionItem: false },
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
  data?: any | undefined;
  group?: string | undefined;
  onAdd?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void);
  onDragEnd?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toItemData: any }) => void);
  onDragMove?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any }) => void);
  onDragStart?: ((e: { cancel: boolean, component: dxScheduler, event: event, fromData: any, itemData: any, itemElement: any }) => void);
  onRemove?: ((e: { component: dxScheduler, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable }) => void);
  scrollSensitivity?: number;
  scrollSpeed?: number;
}>
const _componentAppointmentDragging = (props: IAppointmentDraggingProps) => {
  return React.createElement(NestedOption<IAppointmentDraggingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "appointmentDragging",
    },
  });
};

const AppointmentDragging = Object.assign<typeof _componentAppointmentDragging, NestedComponentMeta>(_componentAppointmentDragging, {
  componentType: "option",
});

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
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

// owners:
// Toolbar
// Options
type IItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: SchedulerPredefinedToolbarItem;
  options?: DateNavigatorItemProperties | Record<string, any>;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  elementAttr?: Record<string, any>;
  hint?: string;
  icon?: string;
  type?: ButtonType | string;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        options: { optionName: "options", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// ToolbarItem
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  buttonTemplate?: ((buttonData: any, buttonContent: any) => string | any) | template;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  items?: Array<dxButtonGroupItem | SchedulerPredefinedDateNavigatorItem>;
  keyExpr?: (() => void) | string;
  onContentReady?: ((e: ButtonGroupContentReadyEvent) => void);
  onDisposing?: ((e: ButtonGroupDisposingEvent) => void);
  onInitialized?: ((e: ButtonGroupInitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onSelectionChanged?: ((e: SelectionChangedEvent) => void);
  rtlEnabled?: boolean;
  selectedItemKeys?: Array<any>;
  selectedItems?: Array<any>;
  selectionMode?: SingleMultipleOrNone;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  visible?: boolean;
  width?: number | string | undefined;
  defaultSelectedItemKeys?: Array<any>;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  defaultSelectedItems?: Array<any>;
  onSelectedItemsChange?: (value: Array<any>) => void;
  buttonRender?: (...params: any) => React.ReactNode;
  buttonComponent?: React.ComponentType<any>;
}>
const _componentOptions = (props: IOptionsProps) => {
  return React.createElement(NestedOption<IOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "options",
      DefaultsProps: {
        defaultSelectedItemKeys: "selectedItemKeys",
        defaultSelectedItems: "selectedItems"
      },
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        optionsItem: { optionName: "items", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "buttonTemplate",
        render: "buttonRender",
        component: "buttonComponent"
      }],
    },
  });
};

const Options = Object.assign<typeof _componentOptions, NestedComponentMeta>(_componentOptions, {
  componentType: "option",
});

// owners:
// Options
type IOptionsItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  hint?: string;
  icon?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType | string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentOptionsItem = (props: IOptionsItemProps) => {
  return React.createElement(NestedOption<IOptionsItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const OptionsItem = Object.assign<typeof _componentOptionsItem, NestedComponentMeta>(_componentOptionsItem, {
  componentType: "option",
});

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
const _componentResource = (props: IResourceProps) => {
  return React.createElement(NestedOption<IResourceProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "resources",
      IsCollectionItem: true,
    },
  });
};

const Resource = Object.assign<typeof _componentResource, NestedComponentMeta>(_componentResource, {
  componentType: "option",
});

// owners:
// Scheduler
// View
type IScrollingProps = React.PropsWithChildren<{
  mode?: ScrollMode;
}>
const _componentScrolling = (props: IScrollingProps) => {
  return React.createElement(NestedOption<IScrollingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scrolling",
    },
  });
};

const Scrolling = Object.assign<typeof _componentScrolling, NestedComponentMeta>(_componentScrolling, {
  componentType: "option",
});

// owners:
// Scheduler
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<dxSchedulerToolbarItem | SchedulerPredefinedToolbarItem>;
  multiline?: boolean;
  visible?: boolean | undefined;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        toolbarItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: SchedulerPredefinedToolbarItem;
  options?: DateNavigatorItemProperties | Record<string, any>;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        options: { optionName: "options", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

// owners:
// Scheduler
type IViewProps = React.PropsWithChildren<{
  agendaDuration?: number;
  allDayPanelMode?: AllDayPanelMode;
  appointmentCollectorTemplate?: ((data: AppointmentCollectorTemplateData, collectorElement: any) => string | any) | template;
  appointmentTemplate?: ((model: AppointmentTemplateData | { appointmentData: Record<string, any>, targetedAppointmentData: Record<string, any> }, itemIndex: number, contentElement: any) => string | any) | template;
  appointmentTooltipTemplate?: ((model: AppointmentTooltipTemplateData | { appointmentData: Record<string, any>, targetedAppointmentData: Record<string, any> }, itemIndex: number, contentElement: any) => string | any) | template;
  cellDuration?: number;
  dataCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  dateCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  endDayHour?: number;
  firstDayOfWeek?: FirstDayOfWeek | undefined;
  groupByDate?: boolean;
  groupOrientation?: Orientation;
  groups?: Array<string>;
  intervalCount?: number;
  maxAppointmentsPerCell?: CellAppointmentsLimit | number;
  name?: string | undefined;
  offset?: number;
  resourceCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  scrolling?: dxSchedulerScrolling;
  startDate?: Date | number | string | undefined;
  startDayHour?: number;
  timeCellTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  type?: undefined | ViewType;
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
  resourceCellRender?: (...params: any) => React.ReactNode;
  resourceCellComponent?: React.ComponentType<any>;
  timeCellRender?: (...params: any) => React.ReactNode;
  timeCellComponent?: React.ComponentType<any>;
}>
const _componentView = (props: IViewProps) => {
  return React.createElement(NestedOption<IViewProps>, {
    ...props,
    elementDescriptor: {
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
        tmplOption: "resourceCellTemplate",
        render: "resourceCellRender",
        component: "resourceCellComponent"
      }, {
        tmplOption: "timeCellTemplate",
        render: "timeCellRender",
        component: "timeCellComponent"
      }],
    },
  });
};

const View = Object.assign<typeof _componentView, NestedComponentMeta>(_componentView, {
  componentType: "option",
});

export default Scheduler;
export {
  Scheduler,
  ISchedulerOptions,
  SchedulerRef,
  AppointmentDragging,
  IAppointmentDraggingProps,
  Editing,
  IEditingProps,
  Item,
  IItemProps,
  Options,
  IOptionsProps,
  OptionsItem,
  IOptionsItemProps,
  Resource,
  IResourceProps,
  Scrolling,
  IScrollingProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  View,
  IViewProps
};
import type * as SchedulerTypes from 'devextreme/ui/scheduler_types';
export { SchedulerTypes };

