"use client"
export { ExplicitTypes } from "devextreme/ui/splitter";
import dxSplitter, {
    Properties
} from "devextreme/ui/splitter";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxSplitterItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, ResizeEvent, ResizeEndEvent, ResizeStartEvent, dxSplitterOptions, OptionChangedEvent } from "devextreme/ui/splitter";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type DataSource from "devextreme/data/data_source";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISplitterOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onResize?: ((e: ResizeEvent<TItem, TKey>) => void);
  onResizeEnd?: ((e: ResizeEndEvent<TItem, TKey>) => void);
  onResizeStart?: ((e: ResizeStartEvent<TItem, TKey>) => void);
}

type ISplitterOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, ISplitterOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxSplitterItem | string>;
  onItemsChange?: (value: Array<any | dxSplitterItem | string>) => void;
}>

class Splitter<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<ISplitterOptions<TItem, TKey>>> {

  public get instance(): dxSplitter<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxSplitter;

  protected subscribableOptions = ["items"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemRendered","onResize","onResizeEnd","onResizeStart"];

  protected _defaults = {
    defaultItems: "items"
  };

  protected _expectedChildren = {
    item: { optionName: "items", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(Splitter as any).propTypes = {
  allowKeyboardNavigation: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  orientation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "horizontal",
      "vertical"])
  ]),
  repaintChangesOnly: PropTypes.bool,
  resizeMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "live",
      "postponed"])
  ]),
  rtlEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Splitter
type IItemProps = React.PropsWithChildren<{
  collapsed?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  maxSize?: number | string;
  minSize?: number | string;
  resizable?: boolean;
  size?: number | string;
  splitterComponent?: dxSplitterOptions;
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
    splitterComponent: { optionName: "splitterComponent", isCollectionItem: false }
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
type ISplitterComponentProps = React.PropsWithChildren<{
  allowKeyboardNavigation?: boolean;
  bindingOptions?: Record<string, any>;
  dataSource?: Array<any | dxSplitterItem | string> | DataSource | DataSourceOptions | null | Store | string;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  height?: (() => number | string) | number | string;
  hoverStateEnabled?: boolean;
  items?: Array<any | dxSplitterItem | string>;
  itemTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
  onItemRendered?: ((e: ItemRenderedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onResize?: ((e: ResizeEvent) => void);
  onResizeEnd?: ((e: ResizeEndEvent) => void);
  onResizeStart?: ((e: ResizeStartEvent) => void);
  orientation?: "horizontal" | "vertical";
  repaintChangesOnly?: boolean;
  resizeMode?: "live" | "postponed";
  rtlEnabled?: boolean;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  defaultItems?: Array<any | dxSplitterItem | string>;
  onItemsChange?: (value: Array<any | dxSplitterItem | string>) => void;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
}>
class SplitterComponent extends NestedOption<ISplitterComponentProps> {
  public static OptionName = "splitterComponent";
  public static DefaultsProps = {
    defaultItems: "items"
  };
  public static TemplateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}

export default Splitter;
export {
  Splitter,
  ISplitterOptions,
  Item,
  IItemProps,
  SplitterComponent,
  ISplitterComponentProps
};
import type * as SplitterTypes from 'devextreme/ui/splitter_types';
export { SplitterTypes };

