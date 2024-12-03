"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxLookup, {
    Properties
} from "devextreme/ui/lookup";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClosedEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, OpenedEvent, PageLoadingEvent, PullRefreshEvent, ScrollEvent, ValueChangedEvent } from "devextreme/ui/lookup";
import type { ContentReadyEvent as PopoverContentReadyEvent, DisposingEvent as PopoverDisposingEvent, InitializedEvent as PopoverInitializedEvent, HiddenEvent, HidingEvent, OptionChangedEvent, ShowingEvent, ShownEvent, TitleRenderedEvent } from "devextreme/ui/popover";
import type { AnimationConfig, CollisionResolution, PositionConfig, AnimationState, AnimationType, CollisionResolutionCombination } from "devextreme/common/core/animation";
import type { HorizontalAlignment, VerticalAlignment, template, Position as CommonPosition, Direction, PositionAlignment, ToolbarItemLocation, ToolbarItemComponent } from "devextreme/common";
import type { event } from "devextreme/events/events.types";
import type { dxPopupToolbarItem, ToolbarLocation } from "devextreme/ui/popup";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";

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
  groupRender?: (...params: any) => React.ReactNode;
  groupComponent?: React.ComponentType<any>;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultOpened?: boolean;
  defaultValue?: any;
  onOpenedChange?: (value: boolean) => void;
  onValueChange?: (value: any) => void;
}>

interface LookupRef {
  instance: () => dxLookup;
}

const Lookup = memo(
  forwardRef(
    (props: React.PropsWithChildren<ILookupOptions>, ref: ForwardedRef<LookupRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["opened","value"]), []);
      const independentEvents = useMemo(() => (["onClosed","onContentReady","onDisposing","onInitialized","onItemClick","onOpened","onPageLoading","onPullRefresh","onScroll","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultOpened: "opened",
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        dropDownOptions: { optionName: "dropDownOptions", isCollectionItem: false },
        item: { optionName: "items", isCollectionItem: true }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "fieldTemplate",
          render: "fieldRender",
          component: "fieldComponent"
        },
        {
          tmplOption: "groupTemplate",
          render: "groupRender",
          component: "groupComponent"
        },
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ILookupOptions>>, {
          WidgetClass: dxLookup,
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
) as (props: React.PropsWithChildren<ILookupOptions> & { ref?: Ref<LookupRef> }) => ReactElement | null;


// owners:
// DropDownOptions
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
const _componentAnimation = (props: IAnimationProps) => {
  return React.createElement(NestedOption<IAnimationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "animation",
      ExpectedChildren: {
        hide: { optionName: "hide", isCollectionItem: false },
        show: { optionName: "show", isCollectionItem: false }
      },
    },
  });
};

const Animation = Object.assign<typeof _componentAnimation, NestedComponentMeta>(_componentAnimation, {
  componentType: "option",
});

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentAt = (props: IAtProps) => {
  return React.createElement(NestedOption<IAtProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "at",
    },
  });
};

const At = Object.assign<typeof _componentAt, NestedComponentMeta>(_componentAt, {
  componentType: "option",
});

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentBoundaryOffset = (props: IBoundaryOffsetProps) => {
  return React.createElement(NestedOption<IBoundaryOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "boundaryOffset",
    },
  });
};

const BoundaryOffset = Object.assign<typeof _componentBoundaryOffset, NestedComponentMeta>(_componentBoundaryOffset, {
  componentType: "option",
});

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: CollisionResolution;
  y?: CollisionResolution;
}>
const _componentCollision = (props: ICollisionProps) => {
  return React.createElement(NestedOption<ICollisionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "collision",
    },
  });
};

const Collision = Object.assign<typeof _componentCollision, NestedComponentMeta>(_componentCollision, {
  componentType: "option",
});

// owners:
// Lookup
type IDropDownOptionsProps = React.PropsWithChildren<{
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string | undefined;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  enableBodyScroll?: boolean;
  height?: (() => number | string) | number | string;
  hideEvent?: Record<string, any> | string | undefined | {
    delay?: number | undefined;
    name?: string | undefined;
  };
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
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
  position?: CommonPosition | PositionConfig;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showEvent?: Record<string, any> | string | undefined | {
    delay?: number | undefined;
    name?: string | undefined;
  };
  showTitle?: boolean;
  target?: any | string | undefined;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  defaultPosition?: CommonPosition | PositionConfig;
  onPositionChange?: (value: CommonPosition | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentDropDownOptions = (props: IDropDownOptionsProps) => {
  return React.createElement(NestedOption<IDropDownOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dropDownOptions",
      DefaultsProps: {
        defaultHeight: "height",
        defaultPosition: "position",
        defaultVisible: "visible",
        defaultWidth: "width"
      },
      ExpectedChildren: {
        animation: { optionName: "animation", isCollectionItem: false },
        hideEvent: { optionName: "hideEvent", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false },
        showEvent: { optionName: "showEvent", isCollectionItem: false },
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
    },
  });
};

const DropDownOptions = Object.assign<typeof _componentDropDownOptions, NestedComponentMeta>(_componentDropDownOptions, {
  componentType: "option",
});

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentFrom = (props: IFromProps) => {
  return React.createElement(NestedOption<IFromProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "from",
      ExpectedChildren: {
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const From = Object.assign<typeof _componentFrom, NestedComponentMeta>(_componentFrom, {
  componentType: "option",
});

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentHide = (props: IHideProps) => {
  return React.createElement(NestedOption<IHideProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hide",
      ExpectedChildren: {
        from: { optionName: "from", isCollectionItem: false },
        to: { optionName: "to", isCollectionItem: false }
      },
    },
  });
};

const Hide = Object.assign<typeof _componentHide, NestedComponentMeta>(_componentHide, {
  componentType: "option",
});

// owners:
// DropDownOptions
type IHideEventProps = React.PropsWithChildren<{
  delay?: number | undefined;
  name?: string | undefined;
}>
const _componentHideEvent = (props: IHideEventProps) => {
  return React.createElement(NestedOption<IHideEventProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hideEvent",
    },
  });
};

const HideEvent = Object.assign<typeof _componentHideEvent, NestedComponentMeta>(_componentHideEvent, {
  componentType: "option",
});

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
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentMy = (props: IMyProps) => {
  return React.createElement(NestedOption<IMyProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "my",
    },
  });
};

const My = Object.assign<typeof _componentMy, NestedComponentMeta>(_componentMy, {
  componentType: "option",
});

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentOffset = (props: IOffsetProps) => {
  return React.createElement(NestedOption<IOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "offset",
    },
  });
};

const Offset = Object.assign<typeof _componentOffset, NestedComponentMeta>(_componentOffset, {
  componentType: "option",
});

// owners:
// From
// DropDownOptions
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: CollisionResolutionCombination | Record<string, any> | {
    x?: CollisionResolution;
    y?: CollisionResolution;
  };
  my?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
const _componentPosition = (props: IPositionProps) => {
  return React.createElement(NestedOption<IPositionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "position",
    },
  });
};

const Position = Object.assign<typeof _componentPosition, NestedComponentMeta>(_componentPosition, {
  componentType: "option",
});

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentShow = (props: IShowProps) => {
  return React.createElement(NestedOption<IShowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "show",
    },
  });
};

const Show = Object.assign<typeof _componentShow, NestedComponentMeta>(_componentShow, {
  componentType: "option",
});

// owners:
// DropDownOptions
type IShowEventProps = React.PropsWithChildren<{
  delay?: number | undefined;
  name?: string | undefined;
}>
const _componentShowEvent = (props: IShowEventProps) => {
  return React.createElement(NestedOption<IShowEventProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "showEvent",
    },
  });
};

const ShowEvent = Object.assign<typeof _componentShowEvent, NestedComponentMeta>(_componentShowEvent, {
  componentType: "option",
});

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentTo = (props: IToProps) => {
  return React.createElement(NestedOption<IToProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "to",
    },
  });
};

const To = Object.assign<typeof _componentTo, NestedComponentMeta>(_componentTo, {
  componentType: "option",
});

// owners:
// DropDownOptions
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  toolbar?: ToolbarLocation;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

export default Lookup;
export {
  Lookup,
  ILookupOptions,
  LookupRef,
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

