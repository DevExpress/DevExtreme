"use client"
export { ExplicitTypes } from "devextreme/ui/tabs";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTabs, {
    Properties
} from "devextreme/ui/tabs";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxTabsItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangingEvent } from "devextreme/ui/tabs";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITabsOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onSelectionChanging?: ((e: SelectionChangingEvent<TItem, TKey>) => void);
}

type ITabsOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, ITabsOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxTabsItem | string>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onItemsChange?: (value: Array<any | dxTabsItem | string>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

interface TabsRef<TItem = any, TKey = any> {
  instance: () => dxTabs<TItem, TKey>;
}

const Tabs = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<ITabsOptions<TItem, TKey>>, ref: ForwardedRef<TabsRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedIndex","selectedItem","selectedItemKeys","selectedItems"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered","onSelectionChanging"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultSelectedIndex: "selectedIndex",
        defaultSelectedItem: "selectedItem",
        defaultSelectedItemKeys: "selectedItemKeys",
        defaultSelectedItems: "selectedItems",
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
        React.createElement(BaseComponent<React.PropsWithChildren<ITabsOptions<TItem, TKey>>>, {
          WidgetClass: dxTabs,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<ITabsOptions<TItem, TKey>> & { ref?: Ref<TabsRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// Tabs
type IItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
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

export default Tabs;
export {
  Tabs,
  ITabsOptions,
  TabsRef,
  Item,
  IItemProps
};
import type * as TabsTypes from 'devextreme/ui/tabs_types';
export { TabsTypes };

