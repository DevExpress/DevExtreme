"use client"
import dxForm, {
    Properties
} from "devextreme/ui/form";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, EditorEnterKeyEvent, InitializedEvent, dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from "devextreme/ui/form";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TabPanelContentReadyEvent, DisposingEvent as TabPanelDisposingEvent, InitializedEvent as TabPanelInitializedEvent, OptionChangedEvent as TabPanelOptionChangedEvent, dxTabPanelOptions, dxTabPanelItem, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangedEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
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

class Form extends BaseComponent<React.PropsWithChildren<IFormOptions>> {

  public get instance(): dxForm {
    return this._instance;
  }

  protected _WidgetClass = dxForm;

  protected subscribableOptions = ["formData"];

  protected independentEvents = ["onContentReady","onDisposing","onEditorEnterKey","onInitialized"];

  protected _defaults = {
    defaultFormData: "formData"
  };

  protected _expectedChildren = {
    ButtonItem: { optionName: "items", isCollectionItem: true },
    colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false },
    EmptyItem: { optionName: "items", isCollectionItem: true },
    GroupItem: { optionName: "items", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true },
    SimpleItem: { optionName: "items", isCollectionItem: true },
    TabbedItem: { optionName: "items", isCollectionItem: true }
  };
}
(Form as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  alignItemLabels: PropTypes.bool,
  alignItemLabelsInAllGroups: PropTypes.bool,
  colCount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  colCountByScreen: PropTypes.object,
  customizeItem: PropTypes.func,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  isDirty: PropTypes.bool,
  items: PropTypes.array,
  labelLocation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "left",
      "right",
      "top"])
  ]),
  labelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "static",
      "floating",
      "hidden",
      "outside"])
  ]),
  minColWidth: PropTypes.number,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onEditorEnterKey: PropTypes.func,
  onFieldDataChanged: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  optionalMark: PropTypes.string,
  readOnly: PropTypes.bool,
  requiredMark: PropTypes.string,
  requiredMessage: PropTypes.string,
  rtlEnabled: PropTypes.bool,
  screenByWidth: PropTypes.func,
  scrollingEnabled: PropTypes.bool,
  showColonAfterLabel: PropTypes.bool,
  showOptionalMark: PropTypes.bool,
  showRequiredMark: PropTypes.bool,
  showValidationSummary: PropTypes.bool,
  tabIndex: PropTypes.number,
  validationGroup: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// SimpleItem
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
class AsyncRule extends NestedOption<IAsyncRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "async"
  };
}

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
class ButtonItem extends NestedOption<IButtonItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    buttonOptions: { optionName: "buttonOptions", isCollectionItem: false }
  };
  public static PredefinedProps = {
    itemType: "button"
  };
}

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
  keyFn?: (data: any) => string;
}>
class ButtonOptions extends NestedOption<IButtonOptionsProps> {
  public static OptionName = "buttonOptions";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

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
class ColCountByScreen extends NestedOption<IColCountByScreenProps> {
  public static OptionName = "colCountByScreen";
}

// owners:
// SimpleItem
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class CompareRule extends NestedOption<ICompareRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "compare"
  };
}

// owners:
// SimpleItem
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
class CustomRule extends NestedOption<ICustomRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "custom"
  };
}

// owners:
// SimpleItem
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class EmailRule extends NestedOption<IEmailRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "email"
  };
}

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
class EmptyItem extends NestedOption<IEmptyItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    itemType: "empty"
  };
}

// owners:
// Form
type IGroupItemProps = React.PropsWithChildren<{
  alignItemLabels?: boolean;
  caption?: string;
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
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class GroupItem extends NestedOption<IGroupItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
  public static PredefinedProps = {
    itemType: "group"
  };
}

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
  visible?: boolean;
  visibleIndex?: number;
  alignItemLabels?: boolean;
  caption?: string;
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
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "tabTemplate",
    render: "tabRender",
    component: "tabComponent",
    keyFn: "tabKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

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
  keyFn?: (data: any) => string;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// SimpleItem
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class NumericRule extends NestedOption<INumericRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "numeric"
  };
}

// owners:
// SimpleItem
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class PatternRule extends NestedOption<IPatternRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "pattern"
  };
}

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
class RangeRule extends NestedOption<IRangeRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "range"
  };
}

// owners:
// SimpleItem
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RequiredRule extends NestedOption<IRequiredRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

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
  keyFn?: (data: any) => string;
}>
class SimpleItem extends NestedOption<ISimpleItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
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
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
  public static PredefinedProps = {
    itemType: "simple"
  };
}

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
class StringLengthRule extends NestedOption<IStringLengthRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "stringLength"
  };
}

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
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Tab extends NestedOption<ITabProps> {
  public static OptionName = "tabs";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "tabTemplate",
    render: "tabRender",
    component: "tabComponent",
    keyFn: "tabKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

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
class TabbedItem extends NestedOption<ITabbedItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    tab: { optionName: "tabs", isCollectionItem: true },
    tabPanelOptions: { optionName: "tabPanelOptions", isCollectionItem: false }
  };
  public static PredefinedProps = {
    itemType: "tabbed"
  };
}

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
  itemKeyFn?: (data: any) => string;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
  itemTitleKeyFn?: (data: any) => string;
}>
class TabPanelOptions extends NestedOption<ITabPanelOptionsProps> {
  public static OptionName = "tabPanelOptions";
  public static DefaultsProps = {
    defaultItems: "items",
    defaultSelectedIndex: "selectedIndex",
    defaultSelectedItem: "selectedItem"
  };
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    tabPanelOptionsItem: { optionName: "items", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }, {
    tmplOption: "itemTitleTemplate",
    render: "itemTitleRender",
    component: "itemTitleComponent",
    keyFn: "itemTitleKeyFn"
  }];
}

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
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class TabPanelOptionsItem extends NestedOption<ITabPanelOptionsItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "tabTemplate",
    render: "tabRender",
    component: "tabComponent",
    keyFn: "tabKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

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
class ValidationRule extends NestedOption<IValidationRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

export default Form;
export {
  Form,
  IFormOptions,
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

