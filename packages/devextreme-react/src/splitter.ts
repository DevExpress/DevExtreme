"use client"
export { ExplicitTypes } from "devextreme/ui/splitter";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSplitter, {
    Properties
} from "devextreme/ui/splitter";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxSplitterItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemCollapsedEvent, ItemContextMenuEvent, ItemExpandedEvent, ItemRenderedEvent, ResizeEvent, ResizeEndEvent, ResizeStartEvent, dxSplitterOptions } from "devextreme/ui/splitter";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISplitterOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemCollapsed?: ((e: ItemCollapsedEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemExpanded?: ((e: ItemExpandedEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onResize?: ((e: ResizeEvent<TKey>) => void);
  onResizeEnd?: ((e: ResizeEndEvent<TKey>) => void);
  onResizeStart?: ((e: ResizeStartEvent<TKey>) => void);
}

type ISplitterOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, ISplitterOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<dxSplitterItem>;
  onItemsChange?: (value: Array<dxSplitterItem>) => void;
}>

interface SplitterRef<TItem = any, TKey = any> {
  instance: () => dxSplitter<TItem, TKey>;
}

const Splitter = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<ISplitterOptions<TItem, TKey>>, ref: ForwardedRef<SplitterRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemCollapsed","onItemContextMenu","onItemExpanded","onItemRendered","onResize","onResizeEnd","onResizeStart"]), []);

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
        React.createElement(BaseComponent<React.PropsWithChildren<ISplitterOptions<TItem, TKey>>>, {
          WidgetClass: dxSplitter,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<ISplitterOptions<TItem, TKey>> & { ref?: Ref<SplitterRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// Splitter
type IItemProps = React.PropsWithChildren<{
  collapsed?: boolean;
  collapsedSize?: number | string | undefined;
  collapsible?: boolean;
  maxSize?: number | string | undefined;
  minSize?: number | string | undefined;
  resizable?: boolean;
  size?: number | string | undefined;
  splitter?: dxSplitterOptions | undefined;
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

export default Splitter;
export {
  Splitter,
  ISplitterOptions,
  SplitterRef,
  Item,
  IItemProps
};
import type * as SplitterTypes from 'devextreme/ui/splitter_types';
export { SplitterTypes };

