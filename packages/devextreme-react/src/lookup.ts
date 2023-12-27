"use client"
import dxLookup, {
    Properties
} from "devextreme/ui/lookup";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClosedEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, OpenedEvent, PageLoadingEvent, PullRefreshEvent, ScrollEvent, ValueChangedEvent } from "devextreme/ui/lookup";
import type { ContentReadyEvent as PopoverContentReadyEvent, DisposingEvent as PopoverDisposingEvent, InitializedEvent as PopoverInitializedEvent, HiddenEvent, HidingEvent, OptionChangedEvent, ShowingEvent, ShownEvent, TitleRenderedEvent } from "devextreme/ui/popover";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { event } from "devextreme/events/index";
import type { template } from "devextreme/core/templates/template";
import type { PositionConfig } from "devextreme/animation/position";
import type { dxPopupToolbarItem } from "devextreme/ui/popup";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ILookupOptionsNarrowedEvents = {
  onClosed?: ((e: ClosedEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onOpened?: ((e: OpenedEvent) => void);
  onPageLoading?: ((e: PageLoadingEvent) => void);
  onPullRefresh?: ((e: PullRefreshEvent) => void);
  onScroll?: ((e: ScrollEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type ILookupOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ILookupOptionsNarrowedEvents> & IHtmlOptions & {
  fieldRender?: (...params: any) => React.ReactNode;
  fieldComponent?: React.ComponentType<any>;
  fieldKeyFn?: (data: any) => string;
  groupRender?: (...params: any) => React.ReactNode;
  groupComponent?: React.ComponentType<any>;
  groupKeyFn?: (data: any) => string;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultOpened?: boolean;
  defaultValue?: any;
  onOpenedChange?: (value: boolean) => void;
  onValueChange?: (value: any) => void;
}>

class Lookup extends BaseComponent<React.PropsWithChildren<ILookupOptions>> {

  public get instance(): dxLookup {
    return this._instance;
  }

  protected _WidgetClass = dxLookup;

  protected subscribableOptions = ["opened","value"];

  protected independentEvents = ["onClosed","onContentReady","onDisposing","onInitialized","onItemClick","onOpened","onPageLoading","onPullRefresh","onScroll","onValueChanged"];

  protected _defaults = {
    defaultOpened: "opened",
    defaultValue: "value"
  };

  protected _expectedChildren = {
    dropDownOptions: { optionName: "dropDownOptions", isCollectionItem: false },
    item: { optionName: "items", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "fieldTemplate",
    render: "fieldRender",
    component: "fieldComponent",
    keyFn: "fieldKeyFn"
  }, {
    tmplOption: "groupTemplate",
    render: "groupRender",
    component: "groupComponent",
    keyFn: "groupKeyFn"
  }, {
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(Lookup as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  applyButtonText: PropTypes.string,
  applyValueMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "instantly",
      "useButtons"])
  ]),
  cancelButtonText: PropTypes.string,
  cleanSearchOnOpening: PropTypes.bool,
  clearButtonText: PropTypes.string,
  deferRendering: PropTypes.bool,
  disabled: PropTypes.bool,
  displayExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  displayValue: PropTypes.string,
  dropDownCentered: PropTypes.bool,
  dropDownOptions: PropTypes.object,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  fullScreen: PropTypes.bool,
  grouped: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  isDirty: PropTypes.bool,
  isValid: PropTypes.bool,
  items: PropTypes.array,
  label: PropTypes.string,
  labelMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "static",
      "floating",
      "hidden",
      "outside"])
  ]),
  minSearchLength: PropTypes.number,
  name: PropTypes.string,
  nextButtonText: PropTypes.string,
  noDataText: PropTypes.string,
  onClosed: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onOpened: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPageLoading: PropTypes.func,
  onPullRefresh: PropTypes.func,
  onScroll: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  opened: PropTypes.bool,
  pageLoadingText: PropTypes.string,
  pageLoadMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "nextButton",
      "scrollBottom"])
  ]),
  placeholder: PropTypes.string,
  pulledDownText: PropTypes.string,
  pullingDownText: PropTypes.string,
  pullRefreshEnabled: PropTypes.bool,
  refreshingText: PropTypes.string,
  rtlEnabled: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  searchExpr: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  searchMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "contains",
      "startswith"])
  ]),
  searchPlaceholder: PropTypes.string,
  searchStartEvent: PropTypes.string,
  searchTimeout: PropTypes.number,
  showCancelButton: PropTypes.bool,
  showClearButton: PropTypes.bool,
  showDataBeforeSearch: PropTypes.bool,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "outlined",
      "underlined",
      "filled"])
  ]),
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  useItemTextAsTitle: PropTypes.bool,
  useNativeScrolling: PropTypes.bool,
  usePopover: PropTypes.bool,
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "auto"])
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top",
      "auto"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  valueChangeEvent: PropTypes.string,
  valueExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  wrapItemText: PropTypes.bool
};


// owners:
// DropDownOptions
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
// Lookup
type IDropDownOptionsProps = React.PropsWithChildren<{
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  copyRootClassesToWrapper?: boolean;
  deferRendering?: boolean;
  disabled?: boolean;
  elementAttr?: any;
  enableBodyScroll?: boolean;
  height?: (() => number | string) | number | string;
  hideEvent?: Record<string, any> | string | {
    delay?: number;
    name?: string;
  };
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number | string) | number | string;
  maxWidth?: (() => number | string) | number | string;
  minHeight?: (() => number | string) | number | string;
  minWidth?: (() => number | string) | number | string;
  onContentReady?: ((e: PopoverContentReadyEvent) => void);
  onDisposing?: ((e: PopoverDisposingEvent) => void);
  onHidden?: ((e: HiddenEvent) => void);
  onHiding?: ((e: HidingEvent) => void);
  onInitialized?: ((e: PopoverInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onShowing?: ((e: ShowingEvent) => void);
  onShown?: ((e: ShownEvent) => void);
  onTitleRendered?: ((e: TitleRenderedEvent) => void);
  position?: PositionConfig | "bottom" | "left" | "right" | "top";
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showEvent?: Record<string, any> | string | {
    delay?: number;
    name?: string;
  };
  showTitle?: boolean;
  target?: any | string;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  defaultPosition?: PositionConfig | "bottom" | "left" | "right" | "top";
  onPositionChange?: (value: PositionConfig | "bottom" | "left" | "right" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
}>
class DropDownOptions extends NestedOption<IDropDownOptionsProps> {
  public static OptionName = "dropDownOptions";
  public static DefaultsProps = {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  };
  public static ExpectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    hideEvent: { optionName: "hideEvent", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    showEvent: { optionName: "showEvent", isCollectionItem: false },
    toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
  };
  public static TemplateProps = [{
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
// DropDownOptions
type IHideEventProps = React.PropsWithChildren<{
  delay?: number;
  name?: string;
}>
class HideEvent extends NestedOption<IHideEventProps> {
  public static OptionName = "hideEvent";
}

// owners:
// Lookup
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
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
// From
// DropDownOptions
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
// DropDownOptions
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
// DropDownOptions
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

export default Lookup;
export {
  Lookup,
  ILookupOptions,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Collision,
  ICollisionProps,
  DropDownOptions,
  IDropDownOptionsProps,
  From,
  IFromProps,
  Hide,
  IHideProps,
  HideEvent,
  IHideEventProps,
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
  To,
  IToProps,
  ToolbarItem,
  IToolbarItemProps
};
import type * as LookupTypes from 'devextreme/ui/lookup_types';
export { LookupTypes };

