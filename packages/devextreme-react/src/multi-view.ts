"use client"
export { ExplicitTypes } from "devextreme/ui/multi_view";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxMultiView, {
    Properties
} from "devextreme/ui/multi_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxMultiViewItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "devextreme/ui/multi_view";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IMultiViewOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
}

type IMultiViewOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IMultiViewOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxMultiViewItem | string>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<any | dxMultiViewItem | string>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
}>

interface MultiViewRef<TItem = any, TKey = any> {
  instance: () => dxMultiView<TItem, TKey>;
}

const MultiView = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IMultiViewOptions<TItem, TKey>>, ref: ForwardedRef<MultiViewRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedIndex","selectedItem"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"]), []);

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
        React.createElement(BaseComponent<React.PropsWithChildren<IMultiViewOptions<TItem, TKey>>>, {
          WidgetClass: dxMultiView,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IMultiViewOptions<TItem, TKey>> & { ref?: Ref<MultiViewRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// MultiView
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

export default MultiView;
export {
  MultiView,
  IMultiViewOptions,
  MultiViewRef,
  Item,
  IItemProps
};
import type * as MultiViewTypes from 'devextreme/ui/multi_view_types';
export { MultiViewTypes };

