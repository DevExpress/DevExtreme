"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxForm, {
    Properties
} from "devextreme/ui/form";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, EditorEnterKeyEvent, InitializedEvent, FormItemType, dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem, FormItemComponent, LabelLocation } from "devextreme/ui/form";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TabPanelContentReadyEvent, DisposingEvent as TabPanelDisposingEvent, InitializedEvent as TabPanelInitializedEvent, OptionChangedEvent as TabPanelOptionChangedEvent, dxTabPanelOptions, dxTabPanelItem, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { ValidationRuleType, HorizontalAlignment, VerticalAlignment, ButtonStyle, template, ButtonType, ComparisonOperator, TabsIconPosition, TabsStyle, Position } from "devextreme/common";
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
  name?: string | undefined;
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
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
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
  width?: (() => number | string) | number | string | undefined;
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
// Form
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
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  captionRender?: (...params: any) => React.ReactNode;
  captionComponent?: React.ComponentType<any>;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        buttonOptions: { optionName: "buttonOptions", isCollectionItem: false },
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        label: { optionName: "label", isCollectionItem: false },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
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
// Form
type ISimpleItemProps = React.PropsWithChildren<{
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
  bindingOptions?: Record<string, any>;
  dataSource?: Array<any | dxTabPanelItem | string> | DataSource | DataSourceOptions | null | Store | string;
  deferRendering?: boolean;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  iconPosition?: TabsIconPosition;
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
  stylingMode?: TabsStyle;
  swipeEnabled?: boolean;
  tabIndex?: number;
  tabsPosition?: Position;
  visible?: boolean;
  width?: (() => number | string) | number | string | undefined;
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

