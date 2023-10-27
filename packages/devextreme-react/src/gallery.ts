"use client"
export { ExplicitTypes } from "devextreme/ui/gallery";
import dxGallery, {
    Properties
} from "devextreme/ui/gallery";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxGalleryItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "devextreme/ui/gallery";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IGalleryOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
}

type IGalleryOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IGalleryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxGalleryItem | string>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<any | dxGalleryItem | string>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
}>

class Gallery<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IGalleryOptions<TItem, TKey>>> {

  public get instance(): dxGallery<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxGallery;

  protected subscribableOptions = ["items","selectedIndex","selectedItem"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"];

  protected _defaults = {
    defaultItems: "items",
    defaultSelectedIndex: "selectedIndex",
    defaultSelectedItem: "selectedItem"
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
(Gallery as any).propTypes = {
  accessKey: PropTypes.string,
  animationDuration: PropTypes.number,
  animationEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  indicatorEnabled: PropTypes.bool,
  initialItemWidth: PropTypes.number,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  loop: PropTypes.bool,
  noDataText: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  selectedIndex: PropTypes.number,
  showIndicator: PropTypes.bool,
  showNavButtons: PropTypes.bool,
  slideshowDelay: PropTypes.number,
  stretchImages: PropTypes.bool,
  swipeEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  wrapAround: PropTypes.bool
};


// owners:
// Gallery
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
  imageAlt?: string;
  imageSrc?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
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

export default Gallery;
export {
  Gallery,
  IGalleryOptions,
  Item,
  IItemProps
};
import type * as GalleryTypes from 'devextreme/ui/gallery_types';
export { GalleryTypes };

