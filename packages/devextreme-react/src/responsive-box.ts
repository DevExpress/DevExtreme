"use client"
export { ExplicitTypes } from "devextreme/ui/responsive_box";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxResponsiveBox, {
    Properties
} from "devextreme/ui/responsive_box";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxResponsiveBoxItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "devextreme/ui/responsive_box";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IResponsiveBoxOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
}

type IResponsiveBoxOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IResponsiveBoxOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxResponsiveBoxItem | string>;
  onItemsChange?: (value: Array<any | dxResponsiveBoxItem | string>) => void;
}>

interface ResponsiveBoxRef<TItem = any, TKey = any> {
  instance: () => dxResponsiveBox<TItem, TKey>;
}

const ResponsiveBox = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IResponsiveBoxOptions<TItem, TKey>>, ref: ForwardedRef<ResponsiveBoxRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
      }), []);

      const expectedChildren = useMemo(() => ({
        col: { optionName: "cols", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true },
        row: { optionName: "rows", isCollectionItem: true }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IResponsiveBoxOptions<TItem, TKey>>>, {
          WidgetClass: dxResponsiveBox,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IResponsiveBoxOptions<TItem, TKey>> & { ref?: Ref<ResponsiveBoxRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// ResponsiveBox
type IColProps = React.PropsWithChildren<{
  baseSize?: number | string;
  ratio?: number;
  screen?: string;
  shrink?: number;
}>
const _componentCol = memo(
  (props: IColProps) => {
    return React.createElement(NestedOption<IColProps>, { ...props });
  }
);

const Col: typeof _componentCol & IElementDescriptor = Object.assign(_componentCol, {
  OptionName: "cols",
  IsCollectionItem: true,
})

// owners:
// ResponsiveBox
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
  location?: Array<Record<string, any>> | Record<string, any> | {
    col?: number;
    colspan?: number;
    row?: number;
    rowspan?: number;
    screen?: string;
  }[];
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
  ExpectedChildren: {
    location: { optionName: "location", isCollectionItem: true }
  },
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Item
type ILocationProps = React.PropsWithChildren<{
  col?: number;
  colspan?: number;
  row?: number;
  rowspan?: number;
  screen?: string;
}>
const _componentLocation = memo(
  (props: ILocationProps) => {
    return React.createElement(NestedOption<ILocationProps>, { ...props });
  }
);

const Location: typeof _componentLocation & IElementDescriptor = Object.assign(_componentLocation, {
  OptionName: "location",
  IsCollectionItem: true,
})

// owners:
// ResponsiveBox
type IRowProps = React.PropsWithChildren<{
  baseSize?: number | string;
  ratio?: number;
  screen?: string;
  shrink?: number;
}>
const _componentRow = memo(
  (props: IRowProps) => {
    return React.createElement(NestedOption<IRowProps>, { ...props });
  }
);

const Row: typeof _componentRow & IElementDescriptor = Object.assign(_componentRow, {
  OptionName: "rows",
  IsCollectionItem: true,
})

export default ResponsiveBox;
export {
  ResponsiveBox,
  IResponsiveBoxOptions,
  ResponsiveBoxRef,
  Col,
  IColProps,
  Item,
  IItemProps,
  Location,
  ILocationProps,
  Row,
  IRowProps
};
import type * as ResponsiveBoxTypes from 'devextreme/ui/responsive_box_types';
export { ResponsiveBoxTypes };

