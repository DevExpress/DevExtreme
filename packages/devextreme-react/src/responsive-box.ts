"use client"
export { ExplicitTypes } from "devextreme/ui/responsive_box";
import dxResponsiveBox, {
    Properties
} from "devextreme/ui/responsive_box";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
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
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxResponsiveBoxItem | string>;
  onItemsChange?: (value: Array<any | dxResponsiveBoxItem | string>) => void;
}>

class ResponsiveBox<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IResponsiveBoxOptions<TItem, TKey>>> {

  public get instance(): dxResponsiveBox<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxResponsiveBox;

  protected subscribableOptions = ["items"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"];

  protected _defaults = {
    defaultItems: "items"
  };

  protected _expectedChildren = {
    col: { optionName: "cols", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true },
    row: { optionName: "rows", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(ResponsiveBox as any).propTypes = {
  cols: PropTypes.array,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hoverStateEnabled: PropTypes.bool,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rows: PropTypes.array,
  rtlEnabled: PropTypes.bool,
  screenByWidth: PropTypes.func,
  singleColumnScreen: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// ResponsiveBox
type IColProps = React.PropsWithChildren<{
  baseSize?: number | string;
  ratio?: number;
  screen?: string;
  shrink?: number;
}>
class Col extends NestedOption<IColProps> {
  public static OptionName = "cols";
  public static IsCollectionItem = true;
}

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
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    location: { optionName: "location", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Item
type ILocationProps = React.PropsWithChildren<{
  col?: number;
  colspan?: number;
  row?: number;
  rowspan?: number;
  screen?: string;
}>
class Location extends NestedOption<ILocationProps> {
  public static OptionName = "location";
  public static IsCollectionItem = true;
}

// owners:
// ResponsiveBox
type IRowProps = React.PropsWithChildren<{
  baseSize?: number | string;
  ratio?: number;
  screen?: string;
  shrink?: number;
}>
class Row extends NestedOption<IRowProps> {
  public static OptionName = "rows";
  public static IsCollectionItem = true;
}

export default ResponsiveBox;
export {
  ResponsiveBox,
  IResponsiveBoxOptions,
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

