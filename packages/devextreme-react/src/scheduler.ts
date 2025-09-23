"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxScheduler, {
    Properties
} from "devextreme/ui/scheduler";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ViewType, AppointmentAddedEvent, AppointmentAddingEvent, AppointmentClickEvent, AppointmentContextMenuEvent, AppointmentDblClickEvent, AppointmentDeletedEvent, AppointmentDeletingEvent, AppointmentFormOpeningEvent, AppointmentRenderedEvent, AppointmentTooltipShowingEvent, AppointmentUpdatedEvent, AppointmentUpdatingEvent, CellClickEvent, CellContextMenuEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, dxSchedulerForm, SchedulerPredefinedToolbarItem, DateNavigatorItemProperties, SchedulerPredefinedDateNavigatorItem, dxSchedulerToolbarItem, AllDayPanelMode, AppointmentCollectorTemplateData, AppointmentTemplateData, AppointmentTooltipTemplateData, CellAppointmentsLimit, dxSchedulerScrolling } from "devextreme/ui/scheduler";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as ButtonGroupContentReadyEvent, DisposingEvent as ButtonGroupDisposingEvent, InitializedEvent as ButtonGroupInitializedEvent, OptionChangedEvent as ButtonGroupOptionChangedEvent, dxButtonGroupItem, ItemClickEvent, SelectionChangedEvent } from "devextreme/ui/button_group";
import type { ContentReadyEvent as TabPanelContentReadyEvent, DisposingEvent as TabPanelDisposingEvent, InitializedEvent as TabPanelInitializedEvent, OptionChangedEvent as TabPanelOptionChangedEvent, dxTabPanelOptions, ItemClickEvent as TabPanelItemClickEvent, SelectionChangedEvent as TabPanelSelectionChangedEvent, dxTabPanelItem, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { event } from "devextreme/events/events.types";
import type { ValidationRuleType, HorizontalAlignment, VerticalAlignment, ButtonStyle, template, ButtonType, ComparisonOperator, ToolbarItemLocation, ToolbarItemComponent, SingleMultipleOrNone, ScrollMode, TabsIconPosition, TabsStyle, Position, FirstDayOfWeek, Orientation } from "devextreme/common";
import type { FormItemType, FormPredefinedButtonItem, dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem, FormItemComponent, LabelLocation } from "devextreme/ui/form";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";
import type dxForm from "devextreme/ui/form";
import type DataSource from "devextreme/data/data_source";

import type * as CommonTypes from "devextreme/common";

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
// SimpleItem
type IAiOptionsProps = React.PropsWithChildren<{
  disabled?: boolean;
  instruction?: string | undefined;
}>
const _componentAiOptions = (props: IAiOptionsProps) => {
  return React.createElement(NestedOption<IAiOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aiOptions",
    },
  });
};

const AiOptions = Object.assign<typeof _componentAiOptions, NestedComponentMeta>(_componentAiOptions, {
  componentType: "option",
});

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
// SimpleItem
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
const _componentAsyncRule = (props: IAsyncRuleProps) => {
  return React.createElement(NestedOption<IAsyncRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "async"
      },
    },
  });
};

const AsyncRule = Object.assign<typeof _componentAsyncRule, NestedComponentMeta>(_componentAsyncRule, {
  componentType: "option",
});

// owners:
// Form
type IButtonItemProps = React.PropsWithChildren<{
  buttonOptions?: dxButtonOptions | undefined;
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  horizontalAlignment?: HorizontalAlignment;
  itemType?: FormItemType;
  name?: FormPredefinedButtonItem | string | undefined;
  verticalAlignment?: VerticalAlignment;
  visible?: boolean;
  visibleIndex?: number | undefined;
}>
const _componentButtonItem = (props: IButtonItemProps) => {
  return React.createElement(NestedOption<IButtonItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        buttonOptions: { optionName: "buttonOptions", isCollectionItem: false }
      },
      PredefinedProps: {
        itemType: "button"
      },
    },
  });
};

const ButtonItem = Object.assign<typeof _componentButtonItem, NestedComponentMeta>(_componentButtonItem, {
  componentType: "option",
});

// owners:
// ButtonItem
type IButtonOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType | string;
  useSubmitBehavior?: boolean;
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: number | string | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentButtonOptions = (props: IButtonOptionsProps) => {
  return React.createElement(NestedOption<IButtonOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttonOptions",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ButtonOptions = Object.assign<typeof _componentButtonOptions, NestedComponentMeta>(_componentButtonOptions, {
  componentType: "option",
});

// owners:
// GroupItem
// Tab
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number | undefined;
  md?: number | undefined;
  sm?: number | undefined;
  xs?: number | undefined;
}>
const _componentColCountByScreen = (props: IColCountByScreenProps) => {
  return React.createElement(NestedOption<IColCountByScreenProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "colCountByScreen",
    },
  });
};

const ColCountByScreen = Object.assign<typeof _componentColCountByScreen, NestedComponentMeta>(_componentColCountByScreen, {
  componentType: "option",
});

// owners:
// SimpleItem
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentCompareRule = (props: ICompareRuleProps) => {
  return React.createElement(NestedOption<ICompareRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "compare"
      },
    },
  });
};

const CompareRule = Object.assign<typeof _componentCompareRule, NestedComponentMeta>(_componentCompareRule, {
  componentType: "option",
});

// owners:
// SimpleItem
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
const _componentCustomRule = (props: ICustomRuleProps) => {
  return React.createElement(NestedOption<ICustomRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "custom"
      },
    },
  });
};

const CustomRule = Object.assign<typeof _componentCustomRule, NestedComponentMeta>(_componentCustomRule, {
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
  form?: dxSchedulerForm | undefined;
}>
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
      ExpectedChildren: {
        form: { optionName: "form", isCollectionItem: false }
      },
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

// owners:
// SimpleItem
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentEmailRule = (props: IEmailRuleProps) => {
  return React.createElement(NestedOption<IEmailRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "email"
      },
    },
  });
};

const EmailRule = Object.assign<typeof _componentEmailRule, NestedComponentMeta>(_componentEmailRule, {
  componentType: "option",
});

// owners:
// Form
type IEmptyItemProps = React.PropsWithChildren<{
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  itemType?: FormItemType;
  name?: string | undefined;
  visible?: boolean;
  visibleIndex?: number | undefined;
}>
const _componentEmptyItem = (props: IEmptyItemProps) => {
  return React.createElement(NestedOption<IEmptyItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      PredefinedProps: {
        itemType: "empty"
      },
    },
  });
};

const EmptyItem = Object.assign<typeof _componentEmptyItem, NestedComponentMeta>(_componentEmptyItem, {
  componentType: "option",
});

// owners:
// Editing
type IFormProps = React.PropsWithChildren<{
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  onCanceled?: ((formData: any) => void);
  onSaved?: ((formData: any) => void);
}>
const _componentForm = (props: IFormProps) => {
  return React.createElement(NestedOption<IFormProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "form",
      ExpectedChildren: {
        ButtonItem: { optionName: "items", isCollectionItem: true },
        EmptyItem: { optionName: "items", isCollectionItem: true },
        GroupItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true },
        SimpleItem: { optionName: "items", isCollectionItem: true },
        TabbedItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Form = Object.assign<typeof _componentForm, NestedComponentMeta>(_componentForm, {
  componentType: "option",
});

// owners:
// Form
type IGroupItemProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  caption?: string | undefined;
  captionTemplate?: ((data: { caption: string, component: dxForm, name: string }, itemElement: any) => string | any) | template;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  itemType?: FormItemType;
  name?: string | undefined;
  template?: ((data: { component: dxForm, formData: Record<string, any> }, itemElement: any) => string | any) | template;
  visible?: boolean;
  visibleIndex?: number | undefined;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentGroupItem = (props: IGroupItemProps) => {
  return React.createElement(NestedOption<IGroupItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "captionTemplate",
        render: "captionRender",
        component: "captionComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
      PredefinedProps: {
        itemType: "group"
      },
    },
  });
};

const GroupItem = Object.assign<typeof _componentGroupItem, NestedComponentMeta>(_componentGroupItem, {
  componentType: "option",
});

// owners:
// TabPanelOptions
// Form
// Toolbar
// Options
type IItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  tabTemplate?: (() => string | any) | template;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  title?: string;
  visible?: boolean;
  aiOptions?: Record<string, any> | {
    disabled?: boolean;
    instruction?: string | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  editorOptions?: any | undefined;
  editorType?: FormItemComponent;
  helpText?: string | undefined;
  isRequired?: boolean | undefined;
  itemType?: FormItemType;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    location?: LabelLocation;
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string | undefined;
    visible?: boolean;
  };
  name?: string | undefined | FormPredefinedButtonItem | SchedulerPredefinedToolbarItem;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visibleIndex?: number | undefined;
  alignItemLabels?: boolean;
  caption?: string | undefined;
  captionTemplate?: ((data: { caption: string, component: dxForm, name: string }, itemElement: any) => string | any) | template;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabPanelOptions?: dxTabPanelOptions | undefined;
  tabs?: Array<Record<string, any>> | {
    alignItemLabels?: boolean;
    badge?: string | undefined;
    colCount?: number;
    colCountByScreen?: Record<string, any> | {
      lg?: number | undefined;
      md?: number | undefined;
      sm?: number | undefined;
      xs?: number | undefined;
    };
    disabled?: boolean;
    icon?: string | undefined;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    title?: string | undefined;
  }[];
  buttonOptions?: dxButtonOptions | undefined;
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: DateNavigatorItemProperties | Record<string, any>;
  showText?: ShowTextMode;
  widget?: ToolbarItemComponent;
  elementAttr?: Record<string, any>;
  hint?: string;
  type?: ButtonType | string;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        aiOptions: { optionName: "aiOptions", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        buttonOptions: { optionName: "buttonOptions", isCollectionItem: false },
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        label: { optionName: "label", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        options: { optionName: "options", isCollectionItem: false },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        tab: { optionName: "tabs", isCollectionItem: true },
        tabPanelOptions: { optionName: "tabPanelOptions", isCollectionItem: false },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }, {
        tmplOption: "captionTemplate",
        render: "captionRender",
        component: "captionComponent"
      }, {
        tmplOption: "menuItemTemplate",
        render: "menuItemRender",
        component: "menuItemComponent"
      }],
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// SimpleItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  location?: LabelLocation;
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
  text?: string | undefined;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// SimpleItem
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentNumericRule = (props: INumericRuleProps) => {
  return React.createElement(NestedOption<INumericRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "numeric"
      },
    },
  });
};

const NumericRule = Object.assign<typeof _componentNumericRule, NestedComponentMeta>(_componentNumericRule, {
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
  onOptionChanged?: ((e: ButtonGroupOptionChangedEvent) => void);
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
// SimpleItem
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: ValidationRuleType;
}>
const _componentPatternRule = (props: IPatternRuleProps) => {
  return React.createElement(NestedOption<IPatternRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "pattern"
      },
    },
  });
};

const PatternRule = Object.assign<typeof _componentPatternRule, NestedComponentMeta>(_componentPatternRule, {
  componentType: "option",
});

// owners:
// SimpleItem
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
}>
const _componentRangeRule = (props: IRangeRuleProps) => {
  return React.createElement(NestedOption<IRangeRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "range"
      },
    },
  });
};

const RangeRule = Object.assign<typeof _componentRangeRule, NestedComponentMeta>(_componentRangeRule, {
  componentType: "option",
});

// owners:
// SimpleItem
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentRequiredRule = (props: IRequiredRuleProps) => {
  return React.createElement(NestedOption<IRequiredRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "required"
      },
    },
  });
};

const RequiredRule = Object.assign<typeof _componentRequiredRule, NestedComponentMeta>(_componentRequiredRule, {
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
// Form
type ISimpleItemProps = React.PropsWithChildren<{
  aiOptions?: Record<string, any> | {
    disabled?: boolean;
    instruction?: string | undefined;
  };
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  editorOptions?: any | undefined;
  editorType?: FormItemComponent;
  helpText?: string | undefined;
  isRequired?: boolean | undefined;
  itemType?: FormItemType;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    location?: LabelLocation;
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string | undefined;
    visible?: boolean;
  };
  name?: string | undefined;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: Record<string, any>, editorType: string, name: string }, itemElement: any) => string | any) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentSimpleItem = (props: ISimpleItemProps) => {
  return React.createElement(NestedOption<ISimpleItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        aiOptions: { optionName: "aiOptions", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        label: { optionName: "label", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
      PredefinedProps: {
        itemType: "simple"
      },
    },
  });
};

const SimpleItem = Object.assign<typeof _componentSimpleItem, NestedComponentMeta>(_componentSimpleItem, {
  componentType: "option",
});

// owners:
// SimpleItem
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentStringLengthRule = (props: IStringLengthRuleProps) => {
  return React.createElement(NestedOption<IStringLengthRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "stringLength"
      },
    },
  });
};

const StringLengthRule = Object.assign<typeof _componentStringLengthRule, NestedComponentMeta>(_componentStringLengthRule, {
  componentType: "option",
});

// owners:
// TabbedItem
type ITabProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  badge?: string | undefined;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  disabled?: boolean;
  icon?: string | undefined;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
  template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
  title?: string | undefined;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTab = (props: ITabProps) => {
  return React.createElement(NestedOption<ITabProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tabs",
      IsCollectionItem: true,
      ExpectedChildren: {
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Tab = Object.assign<typeof _componentTab, NestedComponentMeta>(_componentTab, {
  componentType: "option",
});

// owners:
// Form
type ITabbedItemProps = React.PropsWithChildren<{
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  itemType?: FormItemType;
  name?: string | undefined;
  tabPanelOptions?: dxTabPanelOptions | undefined;
  tabs?: Array<Record<string, any>> | {
    alignItemLabels?: boolean;
    badge?: string | undefined;
    colCount?: number;
    colCountByScreen?: Record<string, any> | {
      lg?: number | undefined;
      md?: number | undefined;
      sm?: number | undefined;
      xs?: number | undefined;
    };
    disabled?: boolean;
    icon?: string | undefined;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template | undefined;
    title?: string | undefined;
  }[];
  visible?: boolean;
  visibleIndex?: number | undefined;
}>
const _componentTabbedItem = (props: ITabbedItemProps) => {
  return React.createElement(NestedOption<ITabbedItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        tab: { optionName: "tabs", isCollectionItem: true },
        tabPanelOptions: { optionName: "tabPanelOptions", isCollectionItem: false }
      },
      PredefinedProps: {
        itemType: "tabbed"
      },
    },
  });
};

const TabbedItem = Object.assign<typeof _componentTabbedItem, NestedComponentMeta>(_componentTabbedItem, {
  componentType: "option",
});

// owners:
// TabbedItem
type ITabPanelOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  animationEnabled?: boolean;
  dataSource?: Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string;
  deferRendering?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  iconPosition?: TabsIconPosition;
  itemHoldTimeout?: number;
  items?: Array<any | dxTabPanelItem | string>;
  itemTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  itemTitleTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  keyExpr?: (() => void) | string;
  loop?: boolean;
  noDataText?: string;
  onContentReady?: ((e: TabPanelContentReadyEvent) => void);
  onDisposing?: ((e: TabPanelDisposingEvent) => void);
  onInitialized?: ((e: TabPanelInitializedEvent) => void);
  onItemClick?: ((e: TabPanelItemClickEvent) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
  onItemHold?: ((e: ItemHoldEvent) => void);
  onItemRendered?: ((e: ItemRenderedEvent) => void);
  onOptionChanged?: ((e: TabPanelOptionChangedEvent) => void);
  onSelectionChanged?: ((e: TabPanelSelectionChangedEvent) => void);
  onSelectionChanging?: ((e: SelectionChangingEvent) => void);
  onTitleClick?: ((e: TitleClickEvent) => void);
  onTitleHold?: ((e: TitleHoldEvent) => void);
  onTitleRendered?: ((e: TitleRenderedEvent) => void);
  repaintChangesOnly?: boolean;
  rtlEnabled?: boolean;
  scrollByContent?: boolean;
  scrollingEnabled?: boolean;
  selectedIndex?: number;
  selectedItem?: any;
  showNavButtons?: boolean;
  stylingMode?: TabsStyle;
  swipeEnabled?: boolean;
  tabIndex?: number;
  tabsPosition?: Position;
  visible?: boolean;
  width?: number | string | undefined;
  defaultItems?: Array<any | dxTabPanelItem | string>;
  onItemsChange?: (value: Array<any | dxTabPanelItem | string>) => void;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (value: number) => void;
  defaultSelectedItem?: any;
  onSelectedItemChange?: (value: any) => void;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
}>
const _componentTabPanelOptions = (props: ITabPanelOptionsProps) => {
  return React.createElement(NestedOption<ITabPanelOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tabPanelOptions",
      DefaultsProps: {
        defaultItems: "items",
        defaultSelectedIndex: "selectedIndex",
        defaultSelectedItem: "selectedItem"
      },
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        tabPanelOptionsItem: { optionName: "items", isCollectionItem: true }
      },
      TemplateProps: [{
        tmplOption: "itemTemplate",
        render: "itemRender",
        component: "itemComponent"
      }, {
        tmplOption: "itemTitleTemplate",
        render: "itemTitleRender",
        component: "itemTitleComponent"
      }],
    },
  });
};

const TabPanelOptions = Object.assign<typeof _componentTabPanelOptions, NestedComponentMeta>(_componentTabPanelOptions, {
  componentType: "option",
});

// owners:
// TabPanelOptions
type ITabPanelOptionsItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  tabTemplate?: (() => string | any) | template;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  title?: string;
  visible?: boolean;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTabPanelOptionsItem = (props: ITabPanelOptionsItemProps) => {
  return React.createElement(NestedOption<ITabPanelOptionsItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "tabTemplate",
        render: "tabRender",
        component: "tabComponent"
      }, {
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const TabPanelOptionsItem = Object.assign<typeof _componentTabPanelOptionsItem, NestedComponentMeta>(_componentTabPanelOptionsItem, {
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
// SimpleItem
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  pattern?: RegExp | string;
}>
const _componentValidationRule = (props: IValidationRuleProps) => {
  return React.createElement(NestedOption<IValidationRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "required"
      },
    },
  });
};

const ValidationRule = Object.assign<typeof _componentValidationRule, NestedComponentMeta>(_componentValidationRule, {
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
  dropDownAppointmentTemplate?: ((itemData: any, itemIndex: number, contentElement: any) => string | any) | template;
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
  dropDownAppointmentRender?: (...params: any) => React.ReactNode;
  dropDownAppointmentComponent?: React.ComponentType<any>;
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
  AiOptions,
  IAiOptionsProps,
  AppointmentDragging,
  IAppointmentDraggingProps,
  AsyncRule,
  IAsyncRuleProps,
  ButtonItem,
  IButtonItemProps,
  ButtonOptions,
  IButtonOptionsProps,
  ColCountByScreen,
  IColCountByScreenProps,
  CompareRule,
  ICompareRuleProps,
  CustomRule,
  ICustomRuleProps,
  Editing,
  IEditingProps,
  EmailRule,
  IEmailRuleProps,
  EmptyItem,
  IEmptyItemProps,
  Form,
  IFormProps,
  GroupItem,
  IGroupItemProps,
  Item,
  IItemProps,
  Label,
  ILabelProps,
  NumericRule,
  INumericRuleProps,
  Options,
  IOptionsProps,
  OptionsItem,
  IOptionsItemProps,
  PatternRule,
  IPatternRuleProps,
  RangeRule,
  IRangeRuleProps,
  RequiredRule,
  IRequiredRuleProps,
  Resource,
  IResourceProps,
  Scrolling,
  IScrollingProps,
  SimpleItem,
  ISimpleItemProps,
  StringLengthRule,
  IStringLengthRuleProps,
  Tab,
  ITabProps,
  TabbedItem,
  ITabbedItemProps,
  TabPanelOptions,
  ITabPanelOptionsProps,
  TabPanelOptionsItem,
  ITabPanelOptionsItemProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  ValidationRule,
  IValidationRuleProps,
  View,
  IViewProps
};
import type * as SchedulerTypes from 'devextreme/ui/scheduler_types';
export { SchedulerTypes };

