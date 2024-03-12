"use client"
export { ExplicitTypes } from "devextreme/ui/splitter";
import dxSplitter, {
    Properties
} from "devextreme/ui/splitter";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxSplitterItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemCollapsedEvent, ItemContextMenuEvent, ItemExpandedEvent, ItemRenderedEvent, ResizeEvent, ResizeEndEvent, ResizeStartEvent, dxSplitterOptions } from "devextreme/ui/splitter";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

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

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemCollapsed","onItemContextMenu","onItemExpanded","onItemRendered","onResize","onResizeEnd","onResizeStart"];

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
  onItemCollapsed: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemExpanded: PropTypes.func,
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
  rtlEnabled: PropTypes.bool,
  separatorSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
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
  collapsedSize?: number | string;
  collapsible?: boolean;
  disabled?: boolean;
  maxSize?: number | string;
  minSize?: number | string;
  resizable?: boolean;
  size?: number | string;
  splitter?: dxSplitterOptions;
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
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

export default Splitter;
export {
  Splitter,
  ISplitterOptions,
  Item,
  IItemProps
};
import type * as SplitterTypes from 'devextreme/ui/splitter_types';
export { SplitterTypes };

