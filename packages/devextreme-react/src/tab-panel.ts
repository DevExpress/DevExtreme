"use client"
export { ExplicitTypes } from "devextreme/ui/tab_panel";
import dxTabPanel, {
    Properties
} from "devextreme/ui/tab_panel";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxTabPanelItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, TitleClickEvent, TitleHoldEvent, TitleRenderedEvent } from "devextreme/ui/tab_panel";
import type { template } from "devextreme/core/templates/template";
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
  onTitleClick?: ((e: TitleClickEvent<TItem, TKey>) => void);
  onTitleHold?: ((e: TitleHoldEvent<TItem, TKey>) => void);
  onTitleRendered?: ((e: TitleRenderedEvent<TItem, TKey>) => void);
}

type ITabPanelOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, ITabPanelOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
  itemTitleKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxTabPanelItem | string>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<any | dxTabPanelItem | string>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
}>

class TabPanel<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<ITabPanelOptions<TItem, TKey>>> {

  public get instance(): dxTabPanel<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxTabPanel;

  protected subscribableOptions = ["items","selectedIndex","selectedItem"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered","onTitleClick","onTitleHold","onTitleRendered"];

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
  }, {
    tmplOption: "itemTitleTemplate",
    render: "itemTitleRender",
    component: "itemTitleComponent",
    keyFn: "itemTitleKeyFn"
  }];
}
(TabPanel as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  animationEnabled: PropTypes.bool,
  deferRendering: PropTypes.bool,
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
  iconPosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "top",
      "end",
      "bottom",
      "start"])
  ]),
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
  onTitleClick: PropTypes.func,
  onTitleHold: PropTypes.func,
  onTitleRendered: PropTypes.func,
  repaintChangesOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  scrollByContent: PropTypes.bool,
  scrollingEnabled: PropTypes.bool,
  selectedIndex: PropTypes.number,
  showNavButtons: PropTypes.bool,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "primary",
      "secondary"])
  ]),
  swipeEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  tabsPosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


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
  tabRender?: (...params: any) => React.ReactNode;
  tabComponent?: React.ComponentType<any>;
  tabKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "tabTemplate",
    render: "tabRender",
    component: "tabComponent",
    keyFn: "tabKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

export default TabPanel;
export {
  TabPanel,
  ITabPanelOptions,
  Item,
  IItemProps
};
import type * as TabPanelTypes from 'devextreme/ui/tab_panel_types';
export { TabPanelTypes };

