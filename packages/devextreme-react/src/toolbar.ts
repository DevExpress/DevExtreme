"use client"
export { ExplicitTypes } from "devextreme/ui/toolbar";
import dxToolbar, {
    Properties
} from "devextreme/ui/toolbar";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxToolbarItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "devextreme/ui/toolbar";
import type { template } from "devextreme/core/templates/template";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IToolbarOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
}

type IToolbarOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IToolbarOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxToolbarItem | string>;
  onItemsChange?: (value: Array<any | dxToolbarItem | string>) => void;
}>

class Toolbar<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IToolbarOptions<TItem, TKey>>> {

  public get instance(): dxToolbar<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxToolbar;

  protected subscribableOptions = ["items"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"];

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
  }, {
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }];
}
(Toolbar as any).propTypes = {
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  multiline: PropTypes.bool,
  noDataText: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Toolbar
type IItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

export default Toolbar;
export {
  Toolbar,
  IToolbarOptions,
  Item,
  IItemProps
};
import type * as ToolbarTypes from 'devextreme/ui/toolbar_types';
export { ToolbarTypes };

