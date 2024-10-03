"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxForm, {
    Properties
} from "devextreme/ui/form";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, EditorEnterKeyEvent, InitializedEvent, dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from "devextreme/ui/form";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TabPanelContentReadyEvent, DisposingEvent as TabPanelDisposingEvent, InitializedEvent as TabPanelInitializedEvent, OptionChangedEvent as TabPanelOptionChangedEvent, dxTabPanelOptions, dxTabPanelItem, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { template } from "devextreme/core/templates/template";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type DataSource from "devextreme/data/data_source";

import type * as CommonTypes from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IFormOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onEditorEnterKey?: ((e: EditorEnterKeyEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IFormOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IFormOptionsNarrowedEvents> & IHtmlOptions & {
  defaultFormData?: any;
  onFormDataChange?: (value: any) => void;
}>

interface FormRef {
  instance: () => dxForm;
}

const Form = memo(
  forwardRef(
    (props: React.PropsWithChildren<IFormOptions>, ref: ForwardedRef<FormRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["formData"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onEditorEnterKey","onInitialized"]), []);

      const defaults = useMemo(() => ({
        defaultFormData: "formData",
      }), []);

      const expectedChildren = useMemo(() => ({
        ButtonItem: { optionName: "items", isCollectionItem: true },
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false },
        EmptyItem: { optionName: "items", isCollectionItem: true },
        GroupItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true },
        SimpleItem: { optionName: "items", isCollectionItem: true },
        TabbedItem: { optionName: "items", isCollectionItem: true }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IFormOptions>>, {
          WidgetClass: dxForm,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IFormOptions> & { ref?: Ref<FormRef> }) => ReactElement | null;


// owners:
// SimpleItem
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
const _componentAsyncRule = memo(
  (props: IAsyncRuleProps) => {
    return React.createElement(NestedOption<IAsyncRuleProps>, { ...props });
  }
);

const AsyncRule: typeof _componentAsyncRule & IElementDescriptor = Object.assign(_componentAsyncRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "async"
  },
})

// owners:
// Form
type IButtonItemProps = React.PropsWithChildren<{
  buttonOptions?: dxButtonOptions;
  colSpan?: number;
  cssClass?: string;
  horizontalAlignment?: "center" | "left" | "right";
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  name?: string;
  verticalAlignment?: "bottom" | "center" | "top";
  visible?: boolean;
  visibleIndex?: number;
}>
const _componentButtonItem = memo(
  (props: IButtonItemProps) => {
    return React.createElement(NestedOption<IButtonItemProps>, { ...props });
  }
);

const ButtonItem: typeof _componentButtonItem & IElementDescriptor = Object.assign(_componentButtonItem, {
  OptionName: "items",
  IsCollectionItem: true,
  ExpectedChildren: {
    buttonOptions: { optionName: "buttonOptions", isCollectionItem: false }
  },
  PredefinedProps: {
    itemType: "button"
  },
})

// owners:
// ButtonItem
type IButtonOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: "text" | "outlined" | "contained";
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: "danger" | "default" | "normal" | "success";
  useSubmitBehavior?: boolean;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentButtonOptions = memo(
  (props: IButtonOptionsProps) => {
    return React.createElement(NestedOption<IButtonOptionsProps>, { ...props });
  }
);

const ButtonOptions: typeof _componentButtonOptions & IElementDescriptor = Object.assign(_componentButtonOptions, {
  OptionName: "buttonOptions",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Form
// GroupItem
// Tab
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}>
const _componentColCountByScreen = memo(
  (props: IColCountByScreenProps) => {
    return React.createElement(NestedOption<IColCountByScreenProps>, { ...props });
  }
);

const ColCountByScreen: typeof _componentColCountByScreen & IElementDescriptor = Object.assign(_componentColCountByScreen, {
  OptionName: "colCountByScreen",
})

// owners:
// SimpleItem
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentCompareRule = memo(
  (props: ICompareRuleProps) => {
    return React.createElement(NestedOption<ICompareRuleProps>, { ...props });
  }
);

const CompareRule: typeof _componentCompareRule & IElementDescriptor = Object.assign(_componentCompareRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "compare"
  },
})

// owners:
// SimpleItem
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
const _componentCustomRule = memo(
  (props: ICustomRuleProps) => {
    return React.createElement(NestedOption<ICustomRuleProps>, { ...props });
  }
);

const CustomRule: typeof _componentCustomRule & IElementDescriptor = Object.assign(_componentCustomRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "custom"
  },
})

// owners:
// SimpleItem
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentEmailRule = memo(
  (props: IEmailRuleProps) => {
    return React.createElement(NestedOption<IEmailRuleProps>, { ...props });
  }
);

const EmailRule: typeof _componentEmailRule & IElementDescriptor = Object.assign(_componentEmailRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "email"
  },
})

// owners:
// Form
type IEmptyItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  name?: string;
  visible?: boolean;
  visibleIndex?: number;
}>
const _componentEmptyItem = memo(
  (props: IEmptyItemProps) => {
    return React.createElement(NestedOption<IEmptyItemProps>, { ...props });
  }
);

const EmptyItem: typeof _componentEmptyItem & IElementDescriptor = Object.assign(_componentEmptyItem, {
  OptionName: "items",
  IsCollectionItem: true,
  PredefinedProps: {
    itemType: "empty"
  },
})

// owners:
// Form
type IGroupItemProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  caption?: string;
  captionTemplate?: ((data: { caption: string, component: dxForm, name: string }, itemElement: any) => string | any) | template;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  colSpan?: number;
  cssClass?: string;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  name?: string;
  template?: ((data: { component: dxForm, formData: Record<string, any> }, itemElement: any) => string | any) | template;
  visible?: boolean;
  visibleIndex?: number;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentGroupItem = memo(
  (props: IGroupItemProps) => {
    return React.createElement(NestedOption<IGroupItemProps>, { ...props });
  }
);

const GroupItem: typeof _componentGroupItem & IElementDescriptor = Object.assign(_componentGroupItem, {
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
})

// owners:
// TabPanelOptions
// Form
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
  colSpan?: number;
  cssClass?: string;
  dataField?: string;
  editorOptions?: any;
  editorType?: "dxAutocomplete" | "dxCalendar" | "dxCheckBox" | "dxColorBox" | "dxDateBox" | "dxDateRangeBox" | "dxDropDownBox" | "dxHtmlEditor" | "dxLookup" | "dxNumberBox" | "dxRadioGroup" | "dxRangeSlider" | "dxSelectBox" | "dxSlider" | "dxSwitch" | "dxTagBox" | "dxTextArea" | "dxTextBox";
  helpText?: string;
  isRequired?: boolean;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    location?: "left" | "right" | "top";
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string;
    visible?: boolean;
  };
  name?: string;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visibleIndex?: number;
  alignItemLabels?: boolean;
  caption?: string;
  captionTemplate?: ((data: { caption: string, component: dxForm, name: string }, itemElement: any) => string | any) | template;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabPanelOptions?: dxTabPanelOptions;
  tabs?: Array<Record<string, any>> | {
    alignItemLabels?: boolean;
    badge?: string;
    colCount?: number;
    colCountByScreen?: Record<string, any> | {
      lg?: number;
      md?: number;
      sm?: number;
      xs?: number;
    };
    disabled?: boolean;
    icon?: string;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template;
    template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template;
    title?: string;
  }[];
  buttonOptions?: dxButtonOptions;
  horizontalAlignment?: "center" | "left" | "right";
  verticalAlignment?: "bottom" | "center" | "top";
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
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
  }, {
    tmplOption: "captionTemplate",
    render: "captionRender",
    component: "captionComponent"
  }],
})

// owners:
// SimpleItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  location?: "left" | "right" | "top";
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// SimpleItem
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentNumericRule = memo(
  (props: INumericRuleProps) => {
    return React.createElement(NestedOption<INumericRuleProps>, { ...props });
  }
);

const NumericRule: typeof _componentNumericRule & IElementDescriptor = Object.assign(_componentNumericRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "numeric"
  },
})

// owners:
// SimpleItem
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentPatternRule = memo(
  (props: IPatternRuleProps) => {
    return React.createElement(NestedOption<IPatternRuleProps>, { ...props });
  }
);

const PatternRule: typeof _componentPatternRule & IElementDescriptor = Object.assign(_componentPatternRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "pattern"
  },
})

// owners:
// SimpleItem
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentRangeRule = memo(
  (props: IRangeRuleProps) => {
    return React.createElement(NestedOption<IRangeRuleProps>, { ...props });
  }
);

const RangeRule: typeof _componentRangeRule & IElementDescriptor = Object.assign(_componentRangeRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "range"
  },
})

// owners:
// SimpleItem
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentRequiredRule = memo(
  (props: IRequiredRuleProps) => {
    return React.createElement(NestedOption<IRequiredRuleProps>, { ...props });
  }
);

const RequiredRule: typeof _componentRequiredRule & IElementDescriptor = Object.assign(_componentRequiredRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "required"
  },
})

// owners:
// Form
type ISimpleItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  dataField?: string;
  editorOptions?: any;
  editorType?: "dxAutocomplete" | "dxCalendar" | "dxCheckBox" | "dxColorBox" | "dxDateBox" | "dxDateRangeBox" | "dxDropDownBox" | "dxHtmlEditor" | "dxLookup" | "dxNumberBox" | "dxRadioGroup" | "dxRangeSlider" | "dxSelectBox" | "dxSlider" | "dxSwitch" | "dxTagBox" | "dxTextArea" | "dxTextBox";
  helpText?: string;
  isRequired?: boolean;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    location?: "left" | "right" | "top";
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string;
    visible?: boolean;
  };
  name?: string;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: Record<string, any>, editorType: string, name: string }, itemElement: any) => string | any) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentSimpleItem = memo(
  (props: ISimpleItemProps) => {
    return React.createElement(NestedOption<ISimpleItemProps>, { ...props });
  }
);

const SimpleItem: typeof _componentSimpleItem & IElementDescriptor = Object.assign(_componentSimpleItem, {
  OptionName: "items",
  IsCollectionItem: true,
  ExpectedChildren: {
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
})

// owners:
// SimpleItem
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentStringLengthRule = memo(
  (props: IStringLengthRuleProps) => {
    return React.createElement(NestedOption<IStringLengthRuleProps>, { ...props });
  }
);

const StringLengthRule: typeof _componentStringLengthRule & IElementDescriptor = Object.assign(_componentStringLengthRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "stringLength"
  },
})

// owners:
// TabbedItem
type ITabProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  badge?: string;
  colCount?: number;
  colCountByScreen?: Record<string, any> | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  disabled?: boolean;
  icon?: string;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template;
  template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template;
  title?: string;
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTab = memo(
  (props: ITabProps) => {
    return React.createElement(NestedOption<ITabProps>, { ...props });
  }
);

const Tab: typeof _componentTab & IElementDescriptor = Object.assign(_componentTab, {
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
})

// owners:
// Form
type ITabbedItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  name?: string;
  tabPanelOptions?: dxTabPanelOptions;
  tabs?: Array<Record<string, any>> | {
    alignItemLabels?: boolean;
    badge?: string;
    colCount?: number;
    colCountByScreen?: Record<string, any> | {
      lg?: number;
      md?: number;
      sm?: number;
      xs?: number;
    };
    disabled?: boolean;
    icon?: string;
    items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
    tabTemplate?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template;
    template?: ((tabData: any, tabIndex: number, tabElement: any) => any) | template;
    title?: string;
  }[];
  visible?: boolean;
  visibleIndex?: number;
}>
const _componentTabbedItem = memo(
  (props: ITabbedItemProps) => {
    return React.createElement(NestedOption<ITabbedItemProps>, { ...props });
  }
);

const TabbedItem: typeof _componentTabbedItem & IElementDescriptor = Object.assign(_componentTabbedItem, {
  OptionName: "items",
  IsCollectionItem: true,
  ExpectedChildren: {
    tab: { optionName: "tabs", isCollectionItem: true },
    tabPanelOptions: { optionName: "tabPanelOptions", isCollectionItem: false }
  },
  PredefinedProps: {
    itemType: "tabbed"
  },
})

// owners:
// TabbedItem
type ITabPanelOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  animationEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  dataSource?: Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string;
  deferRendering?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  iconPosition?: "top" | "end" | "bottom" | "start";
  itemHoldTimeout?: number;
  items?: Array<any | dxTabPanelItem | string>;
  itemTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  itemTitleTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  loop?: boolean;
  noDataText?: string;
  onContentReady?: ((e: TabPanelContentReadyEvent) => void);
  onDisposing?: ((e: TabPanelDisposingEvent) => void);
  onInitialized?: ((e: TabPanelInitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
  onItemHold?: ((e: ItemHoldEvent) => void);
  onItemRendered?: ((e: ItemRenderedEvent) => void);
  onOptionChanged?: ((e: TabPanelOptionChangedEvent) => void);
  onSelectionChanged?: ((e: SelectionChangedEvent) => void);
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
  stylingMode?: "primary" | "secondary";
  swipeEnabled?: boolean;
  tabIndex?: number;
  tabsPosition?: "bottom" | "left" | "right" | "top";
  visible?: boolean;
  width?: (() => number | string) | number | string;
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
const _componentTabPanelOptions = memo(
  (props: ITabPanelOptionsProps) => {
    return React.createElement(NestedOption<ITabPanelOptionsProps>, { ...props });
  }
);

const TabPanelOptions: typeof _componentTabPanelOptions & IElementDescriptor = Object.assign(_componentTabPanelOptions, {
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
})

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
const _componentTabPanelOptionsItem = memo(
  (props: ITabPanelOptionsItemProps) => {
    return React.createElement(NestedOption<ITabPanelOptionsItemProps>, { ...props });
  }
);

const TabPanelOptionsItem: typeof _componentTabPanelOptionsItem & IElementDescriptor = Object.assign(_componentTabPanelOptionsItem, {
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
})

// owners:
// SimpleItem
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  pattern?: RegExp | string;
}>
const _componentValidationRule = memo(
  (props: IValidationRuleProps) => {
    return React.createElement(NestedOption<IValidationRuleProps>, { ...props });
  }
);

const ValidationRule: typeof _componentValidationRule & IElementDescriptor = Object.assign(_componentValidationRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "required"
  },
})

export default Form;
export {
  Form,
  IFormOptions,
  FormRef,
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
  EmailRule,
  IEmailRuleProps,
  EmptyItem,
  IEmptyItemProps,
  GroupItem,
  IGroupItemProps,
  Item,
  IItemProps,
  Label,
  ILabelProps,
  NumericRule,
  INumericRuleProps,
  PatternRule,
  IPatternRuleProps,
  RangeRule,
  IRangeRuleProps,
  RequiredRule,
  IRequiredRuleProps,
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
  ValidationRule,
  IValidationRuleProps
};
import type * as FormTypes from 'devextreme/ui/form_types';
export { FormTypes };

