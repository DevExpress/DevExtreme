"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxFilterBuilder, {
    Properties
} from "devextreme/ui/filter_builder";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
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

interface FilterBuilderRef {
  instance: () => dxFilterBuilder;
}

const FilterBuilder = memo(
  forwardRef(
    (props: React.PropsWithChildren<IFilterBuilderOptions>, ref: ForwardedRef<FilterBuilderRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onEditorPrepared","onEditorPreparing","onInitialized","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        customOperation: { optionName: "customOperations", isCollectionItem: true },
        field: { optionName: "fields", isCollectionItem: true },
        filterOperationDescriptions: { optionName: "filterOperationDescriptions", isCollectionItem: false },
        groupOperationDescriptions: { optionName: "groupOperationDescriptions", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IFilterBuilderOptions>>, {
          WidgetClass: dxFilterBuilder,
          ref: baseRef,
          useRequestAnimationFrameFlag: true,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IFilterBuilderOptions> & { ref?: Ref<FilterBuilderRef> }) => ReactElement | null;


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
}>
const _componentCustomOperation = memo(
  (props: ICustomOperationProps) => {
    return React.createElement(NestedOption<ICustomOperationProps>, { ...props });
  }
);

const CustomOperation: typeof _componentCustomOperation & IElementDescriptor = Object.assign(_componentCustomOperation, {
  OptionName: "customOperations",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent"
  }],
})

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
}>
const _componentField = memo(
  (props: IFieldProps) => {
    return React.createElement(NestedOption<IFieldProps>, { ...props });
  }
);

const Field: typeof _componentField & IElementDescriptor = Object.assign(_componentField, {
  OptionName: "fields",
  IsCollectionItem: true,
  ExpectedChildren: {
    format: { optionName: "format", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent"
  }],
})

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
const _componentFilterOperationDescriptions = memo(
  (props: IFilterOperationDescriptionsProps) => {
    return React.createElement(NestedOption<IFilterOperationDescriptionsProps>, { ...props });
  }
);

const FilterOperationDescriptions: typeof _componentFilterOperationDescriptions & IElementDescriptor = Object.assign(_componentFilterOperationDescriptions, {
  OptionName: "filterOperationDescriptions",
})

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
const _componentFormat = memo(
  (props: IFormatProps) => {
    return React.createElement(NestedOption<IFormatProps>, { ...props });
  }
);

const Format: typeof _componentFormat & IElementDescriptor = Object.assign(_componentFormat, {
  OptionName: "format",
})

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
const _componentGroupOperationDescriptions = memo(
  (props: IGroupOperationDescriptionsProps) => {
    return React.createElement(NestedOption<IGroupOperationDescriptionsProps>, { ...props });
  }
);

const GroupOperationDescriptions: typeof _componentGroupOperationDescriptions & IElementDescriptor = Object.assign(_componentGroupOperationDescriptions, {
  OptionName: "groupOperationDescriptions",
})

// owners:
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: ((data: any) => string | number | boolean) | string;
}>
const _componentLookup = memo(
  (props: ILookupProps) => {
    return React.createElement(NestedOption<ILookupProps>, { ...props });
  }
);

const Lookup: typeof _componentLookup & IElementDescriptor = Object.assign(_componentLookup, {
  OptionName: "lookup",
})

export default FilterBuilder;
export {
  FilterBuilder,
  IFilterBuilderOptions,
  FilterBuilderRef,
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

