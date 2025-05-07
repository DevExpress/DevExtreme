"use client"
export { ExplicitTypes } from "devextreme/ui/validation_summary";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxValidationSummary, {
    Properties
} from "devextreme/ui/validation_summary";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent } from "devextreme/ui/validation_summary";
import type { template } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IValidationSummaryOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
}

type IValidationSummaryOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IValidationSummaryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | CollectionWidgetItem | string>;
  onItemsChange?: (value: Array<any | CollectionWidgetItem | string>) => void;
}>

interface ValidationSummaryRef<TItem = any, TKey = any> {
  instance: () => dxValidationSummary<TItem, TKey>;
}

const ValidationSummary = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IValidationSummaryOptions<TItem, TKey>>, ref: ForwardedRef<ValidationSummaryRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
      }), []);

      const expectedChildren = useMemo(() => ({
        item: { optionName: "items", isCollectionItem: true }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IValidationSummaryOptions<TItem, TKey>>>, {
          WidgetClass: dxValidationSummary,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IValidationSummaryOptions<TItem, TKey>> & { ref?: Ref<ValidationSummaryRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// ValidationSummary
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
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

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

export default ValidationSummary;
export {
  ValidationSummary,
  IValidationSummaryOptions,
  ValidationSummaryRef,
  Item,
  IItemProps
};
import type * as ValidationSummaryTypes from 'devextreme/ui/validation_summary_types';
export { ValidationSummaryTypes };

