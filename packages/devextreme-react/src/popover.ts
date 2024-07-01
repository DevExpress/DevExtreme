"use client"
import dxPopover, {
    Properties
} from "devextreme/ui/popover";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { PositionConfig } from "devextreme/animation/position";
import type { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, ShowingEvent, ShownEvent, TitleRenderedEvent } from "devextreme/ui/popover";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { template } from "devextreme/core/templates/template";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IPopoverOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onHidden?: ((e: HiddenEvent) => void);
  onHiding?: ((e: HidingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onShowing?: ((e: ShowingEvent) => void);
  onShown?: ((e: ShownEvent) => void);
  onTitleRendered?: ((e: TitleRenderedEvent) => void);
}

type IPopoverOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IPopoverOptionsNarrowedEvents> & IHtmlOptions & {
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
  defaultHeight?: (() => number | string) | number | string;
  defaultPosition?: PositionConfig | "bottom" | "left" | "right" | "top";
  defaultVisible?: boolean;
  defaultWidth?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  onPositionChange?: (value: PositionConfig | "bottom" | "left" | "right" | "top") => void;
  onVisibleChange?: (value: boolean) => void;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
}>

class Popover extends BaseComponent<React.PropsWithChildren<IPopoverOptions>> {

  public get instance(): dxPopover {
    return this._instance;
  }

  protected _WidgetClass = dxPopover;

  protected isPortalComponent = true;

  protected subscribableOptions = ["height","position","visible","width"];

  protected independentEvents = ["onContentReady","onDisposing","onHidden","onHiding","onInitialized","onShowing","onShown","onTitleRendered"];

  protected _defaults = {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  };

  protected _expectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    hideEvent: { optionName: "hideEvent", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    showEvent: { optionName: "showEvent", isCollectionItem: false },
    toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent",
    keyFn: "titleKeyFn"
  }];
}
(Popover as any).propTypes = {
  animation: PropTypes.object,
  closeOnOutsideClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  copyRootClassesToWrapper: PropTypes.bool,
  deferRendering: PropTypes.bool,
  disabled: PropTypes.bool,
  enableBodyScroll: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hideEvent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  hideOnOutsideClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  hideOnParentScroll: PropTypes.bool,
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  maxWidth: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  minHeight: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  minWidth: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onHidden: PropTypes.func,
  onHiding: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onShowing: PropTypes.func,
  onShown: PropTypes.func,
  onTitleRendered: PropTypes.func,
  position: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ])
  ]),
  rtlEnabled: PropTypes.bool,
  shading: PropTypes.bool,
  shadingColor: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showEvent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  toolbarItems: PropTypes.array,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Popover
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
// Popover
type IHideEventProps = React.PropsWithChildren<{
  delay?: number;
  name?: string;
}>
class HideEvent extends NestedOption<IHideEventProps> {
  public static OptionName = "hideEvent";
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
// Popover
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
// Popover
type IShowEventProps = React.PropsWithChildren<{
  delay?: number;
  name?: string;
}>
class ShowEvent extends NestedOption<IShowEventProps> {
  public static OptionName = "showEvent";
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

// owners:
// Popover
type IToolbarItemProps = React.PropsWithChildren<{
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
  toolbar?: "bottom" | "top";
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class ToolbarItem extends NestedOption<IToolbarItemProps> {
  public static OptionName = "toolbarItems";
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

export default Popover;
export {
  Popover,
  IPopoverOptions,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Collision,
  ICollisionProps,
  From,
  IFromProps,
  Hide,
  IHideProps,
  HideEvent,
  IHideEventProps,
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
  To,
  IToProps,
  ToolbarItem,
  IToolbarItemProps
};
import type * as PopoverTypes from 'devextreme/ui/popover_types';
export { PopoverTypes };

