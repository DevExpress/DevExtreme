"use client"
export { ExplicitTypes } from "devextreme/ui/tab_panel";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTabPanel, {
    Properties
} from "devextreme/ui/tab_panel";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxTabPanelItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, SelectionChangingEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { template } from "devextreme/common";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITabPanelOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onSelectionChanging?: ((e: SelectionChangingEvent<TItem, TKey>) => void);
  onTitleClick?: ((e: TitleClickEvent<TItem, TKey>) => void);
  onTitleHold?: ((e: TitleHoldEvent<TItem, TKey>) => void);
  onTitleRendered?: ((e: TitleRenderedEvent<TItem, TKey>) => void);
}

type ITabPanelOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, ITabPanelOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxTabPanelItem | string>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<any | dxTabPanelItem | string>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
}>

interface TabPanelRef<TItem = any, TKey = any> {
  instance: () => dxTabPanel<TItem, TKey>;
}

const TabPanel = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<ITabPanelOptions<TItem, TKey>>, ref: ForwardedRef<TabPanelRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedIndex","selectedItem"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered","onSelectionChanging","onTitleClick","onTitleHold","onTitleRendered"]), []);

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
        {
          tmplOption: "itemTitleTemplate",
          render: "itemTitleRender",
          component: "itemTitleComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ITabPanelOptions<TItem, TKey>>>, {
          WidgetClass: dxTabPanel,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<ITabPanelOptions<TItem, TKey>> & { ref?: Ref<TabPanelRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// TabPanel
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
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
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

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

export default TabPanel;
export {
  TabPanel,
  ITabPanelOptions,
  TabPanelRef,
  Item,
  IItemProps
};
import type * as TabPanelTypes from 'devextreme/ui/tab_panel_types';
export { TabPanelTypes };

