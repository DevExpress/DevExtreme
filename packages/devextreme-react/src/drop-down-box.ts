"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDropDownBox, {
    Properties
} from "devextreme/ui/drop_down_box";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ChangeEvent, ClosedEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, OpenedEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/drop_down_box";
import type { DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, ContentReadyEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { event, EventInfo } from "devextreme/events/index";
import type { template } from "devextreme/core/templates/template";
import type { Component } from "devextreme/core/component";
import type { PositionConfig } from "devextreme/animation/position";
import type { dxPopupToolbarItem } from "devextreme/ui/popup";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxOverlay from "devextreme/ui/overlay";
import type DOMComponent from "devextreme/core/dom_component";
import type dxPopup from "devextreme/ui/popup";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDropDownBoxOptionsNarrowedEvents = {
  onChange?: ((e: ChangeEvent) => void);
  onClosed?: ((e: ClosedEvent) => void);
  onCopy?: ((e: CopyEvent) => void);
  onCut?: ((e: CutEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onEnterKey?: ((e: EnterKeyEvent) => void);
  onFocusIn?: ((e: FocusInEvent) => void);
  onFocusOut?: ((e: FocusOutEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onInput?: ((e: InputEvent) => void);
  onKeyDown?: ((e: KeyDownEvent) => void);
  onKeyUp?: ((e: KeyUpEvent) => void);
  onOpened?: ((e: OpenedEvent) => void);
  onPaste?: ((e: PasteEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IDropDownBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IDropDownBoxOptionsNarrowedEvents> & IHtmlOptions & {
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  dropDownButtonRender?: (...params: any) => React.ReactNode;
  dropDownButtonComponent?: React.ComponentType<any>;
  fieldRender?: (...params: any) => React.ReactNode;
  fieldComponent?: React.ComponentType<any>;
  defaultOpened?: boolean;
  onOpenedChange?: (value: boolean) => void;
}>

interface DropDownBoxRef {
  instance: () => dxDropDownBox;
}

const DropDownBox = memo(
  forwardRef(
    (props: React.PropsWithChildren<IDropDownBoxOptions>, ref: ForwardedRef<DropDownBoxRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["opened"]), []);
      const independentEvents = useMemo(() => (["onChange","onClosed","onCopy","onCut","onDisposing","onEnterKey","onFocusIn","onFocusOut","onInitialized","onInput","onKeyDown","onKeyUp","onOpened","onPaste","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultOpened: "opened",
      }), []);

      const expectedChildren = useMemo(() => ({
        button: { optionName: "buttons", isCollectionItem: true },
        dropDownOptions: { optionName: "dropDownOptions", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "contentTemplate",
          render: "contentRender",
          component: "contentComponent"
        },
        {
          tmplOption: "dropDownButtonTemplate",
          render: "dropDownButtonRender",
          component: "dropDownButtonComponent"
        },
        {
          tmplOption: "fieldTemplate",
          render: "fieldRender",
          component: "fieldComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IDropDownBoxOptions>>, {
          WidgetClass: dxDropDownBox,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IDropDownBoxOptions> & { ref?: Ref<DropDownBoxRef> }) => ReactElement | null;


// owners:
// DropDownOptions
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
const _componentAnimation = memo(
  (props: IAnimationProps) => {
    return React.createElement(NestedOption<IAnimationProps>, { ...props });
  }
);

const Animation: typeof _componentAnimation & IElementDescriptor = Object.assign(_componentAnimation, {
  OptionName: "animation",
  ExpectedChildren: {
    hide: { optionName: "hide", isCollectionItem: false },
    show: { optionName: "show", isCollectionItem: false }
  },
})

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
const _componentAt = memo(
  (props: IAtProps) => {
    return React.createElement(NestedOption<IAtProps>, { ...props });
  }
);

const At: typeof _componentAt & IElementDescriptor = Object.assign(_componentAt, {
  OptionName: "at",
})

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentBoundaryOffset = memo(
  (props: IBoundaryOffsetProps) => {
    return React.createElement(NestedOption<IBoundaryOffsetProps>, { ...props });
  }
);

const BoundaryOffset: typeof _componentBoundaryOffset & IElementDescriptor = Object.assign(_componentBoundaryOffset, {
  OptionName: "boundaryOffset",
})

// owners:
// DropDownBox
type IButtonProps = React.PropsWithChildren<{
  location?: "after" | "before";
  name?: string;
  options?: dxButtonOptions;
}>
const _componentButton = memo(
  (props: IButtonProps) => {
    return React.createElement(NestedOption<IButtonProps>, { ...props });
  }
);

const Button: typeof _componentButton & IElementDescriptor = Object.assign(_componentButton, {
  OptionName: "buttons",
  IsCollectionItem: true,
  ExpectedChildren: {
    options: { optionName: "options", isCollectionItem: false }
  },
})

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: "fit" | "flip" | "flipfit" | "none";
  y?: "fit" | "flip" | "flipfit" | "none";
}>
const _componentCollision = memo(
  (props: ICollisionProps) => {
    return React.createElement(NestedOption<ICollisionProps>, { ...props });
  }
);

const Collision: typeof _componentCollision & IElementDescriptor = Object.assign(_componentCollision, {
  OptionName: "collision",
})

// owners:
// DropDownBox
type IDropDownOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number | string) | number | string;
  maxWidth?: (() => number | string) | number | string;
  minHeight?: (() => number | string) | number | string;
  minWidth?: (() => number | string) | number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  defaultPosition?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  onPositionChange?: (value: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentDropDownOptions = memo(
  (props: IDropDownOptionsProps) => {
    return React.createElement(NestedOption<IDropDownOptionsProps>, { ...props });
  }
);

const DropDownOptions: typeof _componentDropDownOptions & IElementDescriptor = Object.assign(_componentDropDownOptions, {
  OptionName: "dropDownOptions",
  DefaultsProps: {
        defaultHeight: "height",
        defaultPosition: "position",
        defaultVisible: "visible",
        defaultWidth: "width"
  },
  ExpectedChildren: {
    animation: { optionName: "animation", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
  },
  TemplateProps: [{
          tmplOption: "contentTemplate",
          render: "contentRender",
          component: "contentComponent"
        }, {
          tmplOption: "titleTemplate",
          render: "titleRender",
          component: "titleComponent"
        }],
})

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentFrom = memo(
  (props: IFromProps) => {
    return React.createElement(NestedOption<IFromProps>, { ...props });
  }
);

const From: typeof _componentFrom & IElementDescriptor = Object.assign(_componentFrom, {
  OptionName: "from",
  ExpectedChildren: {
    position: { optionName: "position", isCollectionItem: false }
  },
})

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
const _componentHide = memo(
  (props: IHideProps) => {
    return React.createElement(NestedOption<IHideProps>, { ...props });
  }
);

const Hide: typeof _componentHide & IElementDescriptor = Object.assign(_componentHide, {
  OptionName: "hide",
  ExpectedChildren: {
    from: { optionName: "from", isCollectionItem: false },
    to: { optionName: "to", isCollectionItem: false }
  },
})

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
const _componentMy = memo(
  (props: IMyProps) => {
    return React.createElement(NestedOption<IMyProps>, { ...props });
  }
);

const My: typeof _componentMy & IElementDescriptor = Object.assign(_componentMy, {
  OptionName: "my",
})

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentOffset = memo(
  (props: IOffsetProps) => {
    return React.createElement(NestedOption<IOffsetProps>, { ...props });
  }
);

const Offset: typeof _componentOffset & IElementDescriptor = Object.assign(_componentOffset, {
  OptionName: "offset",
})

// owners:
// Button
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: "text" | "outlined" | "contained";
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: "danger" | "default" | "normal" | "success";
  useSubmitBehavior?: boolean;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentOptions = memo(
  (props: IOptionsProps) => {
    return React.createElement(NestedOption<IOptionsProps>, { ...props });
  }
);

const Options: typeof _componentOptions & IElementDescriptor = Object.assign(_componentOptions, {
  OptionName: "options",
  TemplateProps: [{
          tmplOption: "template",
          render: "render",
          component: "component"
        }],
})

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
const _componentPosition = memo(
  (props: IPositionProps) => {
    return React.createElement(NestedOption<IPositionProps>, { ...props });
  }
);

const Position: typeof _componentPosition & IElementDescriptor = Object.assign(_componentPosition, {
  OptionName: "position",
})

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
const _componentShow = memo(
  (props: IShowProps) => {
    return React.createElement(NestedOption<IShowProps>, { ...props });
  }
);

const Show: typeof _componentShow & IElementDescriptor = Object.assign(_componentShow, {
  OptionName: "show",
})

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentTo = memo(
  (props: IToProps) => {
    return React.createElement(NestedOption<IToProps>, { ...props });
  }
);

const To: typeof _componentTo & IElementDescriptor = Object.assign(_componentTo, {
  OptionName: "to",
})

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
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = memo(
  (props: IToolbarItemProps) => {
    return React.createElement(NestedOption<IToolbarItemProps>, { ...props });
  }
);

const ToolbarItem: typeof _componentToolbarItem & IElementDescriptor = Object.assign(_componentToolbarItem, {
  OptionName: "toolbarItems",
  IsCollectionItem: true,
  TemplateProps: [{
          tmplOption: "menuItemTemplate",
          render: "menuItemRender",
          component: "menuItemComponent"
        }, {
          tmplOption: "template",
          render: "render",
          component: "component"
        }],
})

export default DropDownBox;
export {
  DropDownBox,
  IDropDownBoxOptions,
  DropDownBoxRef,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Button,
  IButtonProps,
  Collision,
  ICollisionProps,
  DropDownOptions,
  IDropDownOptionsProps,
  From,
  IFromProps,
  Hide,
  IHideProps,
  My,
  IMyProps,
  Offset,
  IOffsetProps,
  Options,
  IOptionsProps,
  Position,
  IPositionProps,
  Show,
  IShowProps,
  To,
  IToProps,
  ToolbarItem,
  IToolbarItemProps
};
import type * as DropDownBoxTypes from 'devextreme/ui/drop_down_box_types';
export { DropDownBoxTypes };

