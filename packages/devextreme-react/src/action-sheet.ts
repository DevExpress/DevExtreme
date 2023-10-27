"use client"
export { ExplicitTypes } from "devextreme/ui/action_sheet";
import dxActionSheet, {
    Properties
} from "devextreme/ui/action_sheet";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxActionSheetItem, CancelClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "devextreme/ui/action_sheet";
import type { NativeEventInfo } from "devextreme/events/index";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IActionSheetOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onCancelClick?: ((e: CancelClickEvent<TItem, TKey>) => void);
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
}

type IActionSheetOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IActionSheetOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxActionSheetItem | string>;
  defaultVisible?: boolean;
  onItemsChange?: (value: Array<any | dxActionSheetItem | string>) => void;
  onVisibleChange?: (value: boolean) => void;
}>

class ActionSheet<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IActionSheetOptions<TItem, TKey>>> {

  public get instance(): dxActionSheet<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxActionSheet;

  protected subscribableOptions = ["items","visible"];

  protected independentEvents = ["onCancelClick","onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"];

  protected _defaults = {
    defaultItems: "items",
    defaultVisible: "visible"
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
(ActionSheet as any).propTypes = {
  cancelText: PropTypes.string,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  onCancelClick: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  usePopover: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// ActionSheet
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  icon?: string;
  onClick?: ((e: NativeEventInfo<any>) => void);
  stylingMode?: "text" | "outlined" | "contained";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  type?: "danger" | "default" | "normal" | "success";
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

export default ActionSheet;
export {
  ActionSheet,
  IActionSheetOptions,
  Item,
  IItemProps
};
import type * as ActionSheetTypes from 'devextreme/ui/action_sheet_types';
export { ActionSheetTypes };

