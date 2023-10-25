"use client"
export { ExplicitTypes } from "devextreme/ui/context_menu";
import dxContextMenu, {
    Properties
} from "devextreme/ui/context_menu";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxContextMenuItem, ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, PositioningEvent, ShowingEvent, ShownEvent } from "devextreme/ui/context_menu";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { PositionConfig } from "devextreme/animation/position";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IContextMenuOptionsNarrowedEvents<TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TKey>) => void);
  onHidden?: ((e: HiddenEvent<TKey>) => void);
  onHiding?: ((e: HidingEvent<TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TKey>) => void);
  onPositioning?: ((e: PositioningEvent<TKey>) => void);
  onShowing?: ((e: ShowingEvent<TKey>) => void);
  onShown?: ((e: ShownEvent<TKey>) => void);
}

type IContextMenuOptions<TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TKey>, IContextMenuOptionsNarrowedEvents<TKey>> & IHtmlOptions & {
  dataSource?: Properties<TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<dxContextMenuItem>;
  defaultSelectedItem?: any;
  defaultVisible?: boolean;
  onItemsChange?: (value: Array<dxContextMenuItem>) => void;
  onSelectedItemChange?: (value: any) => void;
  onVisibleChange?: (value: boolean) => void;
}>

class ContextMenu<TKey = any> extends BaseComponent<React.PropsWithChildren<IContextMenuOptions<TKey>>> {

  public get instance(): dxContextMenu<TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxContextMenu;

  protected subscribableOptions = ["items","selectedItem","visible"];

  protected independentEvents = ["onContentReady","onDisposing","onHidden","onHiding","onInitialized","onItemClick","onItemContextMenu","onItemRendered","onPositioning","onShowing","onShown"];

  protected _defaults = {
    defaultItems: "items",
    defaultSelectedItem: "selectedItem",
    defaultVisible: "visible"
  };

  protected _expectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    item: { optionName: "items", isCollectionItem: true },
    position: { optionName: "position", isCollectionItem: false },
    showEvent: { optionName: "showEvent", isCollectionItem: false },
    showSubmenuMode: { optionName: "showSubmenuMode", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(ContextMenu as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  animation: PropTypes.object,
  closeOnOutsideClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  cssClass: PropTypes.string,
  disabled: PropTypes.bool,
  disabledExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  displayExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hideOnOutsideClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  itemsExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onHidden: PropTypes.func,
  onHiding: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPositioning: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onShowing: PropTypes.func,
  onShown: PropTypes.func,
  position: PropTypes.object,
  rtlEnabled: PropTypes.bool,
  selectByClick: PropTypes.bool,
  selectedExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "none"])
  ]),
  showEvent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  showSubmenuMode: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "onClick",
      "onHover"])
  ])
  ]),
  submenuDirection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto",
      "left",
      "right"])
  ]),
  tabIndex: PropTypes.number,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// ContextMenu
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
  public static ExpectedChildren = {
    hide: { optionName: "hide", isCollectionItem: false },
    show: { optionName: "show", isCollectionItem: false }
  };
}

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class At extends NestedOption<IAtProps> {
  public static OptionName = "at";
}

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class BoundaryOffset extends NestedOption<IBoundaryOffsetProps> {
  public static OptionName = "boundaryOffset";
}

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: "fit" | "flip" | "flipfit" | "none";
  y?: "fit" | "flip" | "flipfit" | "none";
}>
class Collision extends NestedOption<ICollisionProps> {
  public static OptionName = "collision";
}

// owners:
// ShowSubmenuMode
type IDelayProps = React.PropsWithChildren<{
  hide?: number;
  show?: number;
}>
class Delay extends NestedOption<IDelayProps> {
  public static OptionName = "delay";
}

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
class From extends NestedOption<IFromProps> {
  public static OptionName = "from";
  public static ExpectedChildren = {
    position: { optionName: "position", isCollectionItem: false }
  };
}

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Hide extends NestedOption<IHideProps> {
  public static OptionName = "hide";
  public static ExpectedChildren = {
    from: { optionName: "from", isCollectionItem: false },
    to: { optionName: "to", isCollectionItem: false }
  };
}

// owners:
// ContextMenu
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxContextMenuItem>;
  selectable?: boolean;
  selected?: boolean;
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

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class My extends NestedOption<IMyProps> {
  public static OptionName = "my";
}

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class Offset extends NestedOption<IOffsetProps> {
  public static OptionName = "offset";
}

// owners:
// ContextMenu
// From
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: Record<string, any> | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | {
    x?: "fit" | "flip" | "flipfit" | "none";
    y?: "fit" | "flip" | "flipfit" | "none";
  };
  my?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
class Position extends NestedOption<IPositionProps> {
  public static OptionName = "position";
}

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Show extends NestedOption<IShowProps> {
  public static OptionName = "show";
}

// owners:
// ContextMenu
type IShowEventProps = React.PropsWithChildren<{
  delay?: number;
  name?: string;
}>
class ShowEvent extends NestedOption<IShowEventProps> {
  public static OptionName = "showEvent";
}

// owners:
// ContextMenu
type IShowSubmenuModeProps = React.PropsWithChildren<{
  delay?: number | Record<string, any> | {
    hide?: number;
    show?: number;
  };
  name?: "onClick" | "onHover";
}>
class ShowSubmenuMode extends NestedOption<IShowSubmenuModeProps> {
  public static OptionName = "showSubmenuMode";
  public static ExpectedChildren = {
    delay: { optionName: "delay", isCollectionItem: false }
  };
}

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
class To extends NestedOption<IToProps> {
  public static OptionName = "to";
}

export default ContextMenu;
export {
  ContextMenu,
  IContextMenuOptions,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Collision,
  ICollisionProps,
  Delay,
  IDelayProps,
  From,
  IFromProps,
  Hide,
  IHideProps,
  Item,
  IItemProps,
  My,
  IMyProps,
  Offset,
  IOffsetProps,
  Position,
  IPositionProps,
  Show,
  IShowProps,
  ShowEvent,
  IShowEventProps,
  ShowSubmenuMode,
  IShowSubmenuModeProps,
  To,
  IToProps
};
import type * as ContextMenuTypes from 'devextreme/ui/context_menu_types';
export { ContextMenuTypes };

