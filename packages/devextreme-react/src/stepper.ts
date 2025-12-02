"use client"
export { ExplicitTypes } from "devextreme/ui/stepper";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxStepper, {
    Properties
} from "devextreme/ui/stepper";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxStepperItem, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, SelectionChangingEvent } from "devextreme/ui/stepper";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IStepperOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onSelectionChanging?: ((e: SelectionChangingEvent<TItem, TKey>) => void);
}

type IStepperOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IStepperOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<dxStepperItem>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<dxStepperItem>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
}>

interface StepperRef<TItem = any, TKey = any> {
  instance: () => dxStepper<TItem, TKey>;
}

const Stepper = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IStepperOptions<TItem, TKey>>, ref: ForwardedRef<StepperRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), []);

      const subscribableOptions = useMemo(() => (["items","selectedIndex","selectedItem"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemRendered","onSelectionChanging"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultSelectedIndex: "selectedIndex",
        defaultSelectedItem: "selectedItem",
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
        React.createElement(BaseComponent<React.PropsWithChildren<IStepperOptions<TItem, TKey>>>, {
          WidgetClass: dxStepper,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IStepperOptions<TItem, TKey>> & { ref?: Ref<StepperRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// Stepper
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  hint?: string;
  icon?: string;
  isValid?: boolean;
  label?: string;
  optional?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
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

export default Stepper;
export {
  Stepper,
  IStepperOptions,
  StepperRef,
  Item,
  IItemProps
};
import type * as StepperTypes from 'devextreme/ui/stepper_types';
export { StepperTypes };

