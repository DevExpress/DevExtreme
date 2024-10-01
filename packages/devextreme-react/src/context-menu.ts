"use client"
export { ExplicitTypes } from "devextreme/ui/context_menu";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxContextMenu, {
    Properties
} from "devextreme/ui/context_menu";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxContextMenuItem, ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, PositioningEvent, ShowingEvent, ShownEvent } from "devextreme/ui/context_menu";
import type { AnimationConfig, AnimationState, AnimationType } from "devextreme/animation/fx";
import type { HorizontalAlignment, VerticalAlignment, Direction, PositionAlignment, SubmenuShowMode } from "devextreme/common";
import type { CollisionResolution, PositionConfig, CollisionResolutionCombination } from "devextreme/animation/position";
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
  defaultItems?: Array<dxContextMenuItem>;
  defaultSelectedItem?: any;
  defaultVisible?: boolean;
  onItemsChange?: (value: Array<dxContextMenuItem>) => void;
  onSelectedItemChange?: (value: any) => void;
  onVisibleChange?: (value: boolean) => void;
}>

interface ContextMenuRef<TKey = any> {
  instance: () => dxContextMenu<TKey>;
}

const ContextMenu = memo(
  forwardRef(
    <TKey = any>(props: React.PropsWithChildren<IContextMenuOptions<TKey>>, ref: ForwardedRef<ContextMenuRef<TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedItem","visible"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onHidden","onHiding","onInitialized","onItemClick","onItemContextMenu","onItemRendered","onPositioning","onShowing","onShown"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultSelectedItem: "selectedItem",
        defaultVisible: "visible",
      }), []);

      const expectedChildren = useMemo(() => ({
        animation: { optionName: "animation", isCollectionItem: false },
        item: { optionName: "items", isCollectionItem: true },
        position: { optionName: "position", isCollectionItem: false },
        showEvent: { optionName: "showEvent", isCollectionItem: false },
        showSubmenuMode: { optionName: "showSubmenuMode", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IContextMenuOptions<TKey>>>, {
          WidgetClass: dxContextMenu,
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
) as <TKey = any>(props: React.PropsWithChildren<IContextMenuOptions<TKey>> & { ref?: Ref<ContextMenuRef<TKey>> }) => ReactElement | null;


// owners:
// ContextMenu
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
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
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
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: CollisionResolution;
  y?: CollisionResolution;
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
// ShowSubmenuMode
type IDelayProps = React.PropsWithChildren<{
  hide?: number;
  show?: number;
}>
const _componentDelay = memo(
  (props: IDelayProps) => {
    return React.createElement(NestedOption<IDelayProps>, { ...props });
  }
);

const Delay: typeof _componentDelay & IElementDescriptor = Object.assign(_componentDelay, {
  OptionName: "delay",
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
  direction?: Direction;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
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
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
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
// ContextMenu
// From
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
  direction?: Direction;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
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
// ContextMenu
type IShowEventProps = React.PropsWithChildren<{
  delay?: number;
  name?: string;
}>
const _componentShowEvent = memo(
  (props: IShowEventProps) => {
    return React.createElement(NestedOption<IShowEventProps>, { ...props });
  }
);

const ShowEvent: typeof _componentShowEvent & IElementDescriptor = Object.assign(_componentShowEvent, {
  OptionName: "showEvent",
})

// owners:
// ContextMenu
type IShowSubmenuModeProps = React.PropsWithChildren<{
  delay?: number | Record<string, any> | {
    hide?: number;
    show?: number;
  };
  name?: SubmenuShowMode;
}>
const _componentShowSubmenuMode = memo(
  (props: IShowSubmenuModeProps) => {
    return React.createElement(NestedOption<IShowSubmenuModeProps>, { ...props });
  }
);

const ShowSubmenuMode: typeof _componentShowSubmenuMode & IElementDescriptor = Object.assign(_componentShowSubmenuMode, {
  OptionName: "showSubmenuMode",
  ExpectedChildren: {
    delay: { optionName: "delay", isCollectionItem: false }
  },
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

export default ContextMenu;
export {
  ContextMenu,
  IContextMenuOptions,
  ContextMenuRef,
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

