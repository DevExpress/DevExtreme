"use client"
export { ExplicitTypes } from "devextreme/ui/menu";
import dxMenu, {
    Properties
} from "devextreme/ui/menu";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxMenuItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, SubmenuHiddenEvent, SubmenuHidingEvent, SubmenuShowingEvent, SubmenuShownEvent } from "devextreme/ui/menu";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { PositionConfig } from "devextreme/animation/position";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IMenuOptionsNarrowedEvents<TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TKey>) => void);
  onSubmenuHidden?: ((e: SubmenuHiddenEvent<TKey>) => void);
  onSubmenuHiding?: ((e: SubmenuHidingEvent<TKey>) => void);
  onSubmenuShowing?: ((e: SubmenuShowingEvent<TKey>) => void);
  onSubmenuShown?: ((e: SubmenuShownEvent<TKey>) => void);
}

type IMenuOptions<TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TKey>, IMenuOptionsNarrowedEvents<TKey>> & IHtmlOptions & {
  dataSource?: Properties<TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<dxMenuItem>;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<dxMenuItem>) => void;
  onSelectedItemChange?: (value: any) => void;
}>

class Menu<TKey = any> extends BaseComponent<React.PropsWithChildren<IMenuOptions<TKey>>> {

  public get instance(): dxMenu<TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxMenu;

  protected subscribableOptions = ["items","selectedItem"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemRendered","onSubmenuHidden","onSubmenuHiding","onSubmenuShowing","onSubmenuShown"];

  protected _defaults = {
    defaultItems: "items",
    defaultSelectedItem: "selectedItem"
  };

  protected _expectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    item: { optionName: "items", isCollectionItem: true },
    showFirstSubmenuMode: { optionName: "showFirstSubmenuMode", isCollectionItem: false },
    showSubmenuMode: { optionName: "showSubmenuMode", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(Menu as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  adaptivityEnabled: PropTypes.bool,
  animation: PropTypes.object,
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
  hideSubmenuOnMouseLeave: PropTypes.bool,
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  itemsExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemRendered: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onSubmenuHidden: PropTypes.func,
  onSubmenuHiding: PropTypes.func,
  onSubmenuShowing: PropTypes.func,
  onSubmenuShown: PropTypes.func,
  orientation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "horizontal",
      "vertical"])
  ]),
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
  showFirstSubmenuMode: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "onClick",
      "onHover"])
  ])
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
      "leftOrTop",
      "rightOrBottom"])
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
// Menu
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
// ShowFirstSubmenuMode
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
// Menu
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxMenuItem>;
  linkAttr?: Record<string, any>;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  url?: string;
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
  public static ExpectedChildren = {
    at: { optionName: "at", isCollectionItem: false },
    boundaryOffset: { optionName: "boundaryOffset", isCollectionItem: false },
    collision: { optionName: "collision", isCollectionItem: false },
    my: { optionName: "my", isCollectionItem: false },
    offset: { optionName: "offset", isCollectionItem: false }
  };
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
// Menu
type IShowFirstSubmenuModeProps = React.PropsWithChildren<{
  delay?: number | Record<string, any> | {
    hide?: number;
    show?: number;
  };
  name?: "onClick" | "onHover";
}>
class ShowFirstSubmenuMode extends NestedOption<IShowFirstSubmenuModeProps> {
  public static OptionName = "showFirstSubmenuMode";
  public static ExpectedChildren = {
    delay: { optionName: "delay", isCollectionItem: false }
  };
}

// owners:
// Menu
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

export default Menu;
export {
  Menu,
  IMenuOptions,
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
  ShowFirstSubmenuMode,
  IShowFirstSubmenuModeProps,
  ShowSubmenuMode,
  IShowSubmenuModeProps,
  To,
  IToProps
};
import type * as MenuTypes from 'devextreme/ui/menu_types';
export { MenuTypes };

