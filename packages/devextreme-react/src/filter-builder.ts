"use client"
import dxFilterBuilder, {
    Properties
} from "devextreme/ui/filter_builder";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, EditorPreparedEvent, EditorPreparingEvent, InitializedEvent, ValueChangedEvent, dxFilterBuilderField } from "devextreme/ui/filter_builder";
import type { template } from "devextreme/core/templates/template";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IFilterBuilderOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onEditorPrepared?: ((e: EditorPreparedEvent) => void);
  onEditorPreparing?: ((e: EditorPreparingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IFilterBuilderOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IFilterBuilderOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: Array<any> | (() => any) | string;
  onValueChange?: (value: Array<any> | (() => any) | string) => void;
}>

class FilterBuilder extends BaseComponent<React.PropsWithChildren<IFilterBuilderOptions>> {

  public get instance(): dxFilterBuilder {
    return this._instance;
  }

  protected _WidgetClass = dxFilterBuilder;

  protected useRequestAnimationFrameFlag = true;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onContentReady","onDisposing","onEditorPrepared","onEditorPreparing","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };

  protected _expectedChildren = {
    customOperation: { optionName: "customOperations", isCollectionItem: true },
    field: { optionName: "fields", isCollectionItem: true },
    filterOperationDescriptions: { optionName: "filterOperationDescriptions", isCollectionItem: false },
    groupOperationDescriptions: { optionName: "groupOperationDescriptions", isCollectionItem: false }
  };
}
(FilterBuilder as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowHierarchicalFields: PropTypes.bool,
  customOperations: PropTypes.array,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  fields: PropTypes.array,
  filterOperationDescriptions: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  groupOperationDescriptions: PropTypes.object,
  groupOperations: PropTypes.array,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  maxGroupLevel: PropTypes.number,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onEditorPrepared: PropTypes.func,
  onEditorPreparing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// FilterBuilder
type ICustomOperationProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>);
  caption?: string;
  customizeText?: ((fieldInfo: { field: dxFilterBuilderField, value: string | number | Date, valueText: string }) => string);
  dataTypes?: Array<"string" | "number" | "date" | "boolean" | "object" | "datetime">;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  hasValue?: boolean;
  icon?: string;
  name?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
  editorKeyFn?: (data: any) => string;
}>
class CustomOperation extends NestedOption<ICustomOperationProps> {
  public static OptionName = "customOperations";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent",
    keyFn: "editorKeyFn"
  }];
}

// owners:
// FilterBuilder
type IFieldProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>);
  caption?: string;
  customizeText?: ((fieldInfo: { value: string | number | Date, valueText: string }) => string);
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  editorOptions?: any;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  falseText?: string;
  filterOperations?: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | string>;
  format?: LocalizationTypes.Format;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    dataSource?: Array<any> | DataSourceOptions | Store;
    displayExpr?: ((data: any) => string) | string;
    valueExpr?: ((data: any) => string | number | boolean) | string;
  };
  name?: string;
  trueText?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
  editorKeyFn?: (data: any) => string;
}>
class Field extends NestedOption<IFieldProps> {
  public static OptionName = "fields";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    format: { optionName: "format", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent",
    keyFn: "editorKeyFn"
  }];
}

// owners:
// FilterBuilder
type IFilterOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  isBlank?: string;
  isNotBlank?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
class FilterOperationDescriptions extends NestedOption<IFilterOperationDescriptionsProps> {
  public static OptionName = "filterOperationDescriptions";
}

// owners:
// Field
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class Format extends NestedOption<IFormatProps> {
  public static OptionName = "format";
}

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
class GroupOperationDescriptions extends NestedOption<IGroupOperationDescriptionsProps> {
  public static OptionName = "groupOperationDescriptions";
}

// owners:
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: ((data: any) => string | number | boolean) | string;
}>
class Lookup extends NestedOption<ILookupProps> {
  public static OptionName = "lookup";
}

export default FilterBuilder;
export {
  FilterBuilder,
  IFilterBuilderOptions,
  CustomOperation,
  ICustomOperationProps,
  Field,
  IFieldProps,
  FilterOperationDescriptions,
  IFilterOperationDescriptionsProps,
  Format,
  IFormatProps,
  GroupOperationDescriptions,
  IGroupOperationDescriptionsProps,
  Lookup,
  ILookupProps
};
import type * as FilterBuilderTypes from 'devextreme/ui/filter_builder_types';
export { FilterBuilderTypes };

