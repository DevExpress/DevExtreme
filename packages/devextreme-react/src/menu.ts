"use client"
export { ExplicitTypes } from "devextreme/ui/menu";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxMenu, {
    Properties
} from "devextreme/ui/menu";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
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
  defaultItems?: Array<dxMenuItem>;
  defaultSelectedItem?: any;
  onItemsChange?: (value: Array<dxMenuItem>) => void;
  onSelectedItemChange?: (value: any) => void;
}>

interface MenuRef<TKey = any> {
  instance: () => dxMenu<TKey>;
}

const Menu = memo(
  forwardRef(
    <TKey = any>(props: React.PropsWithChildren<IMenuOptions<TKey>>, ref: ForwardedRef<MenuRef<TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedItem"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemRendered","onSubmenuHidden","onSubmenuHiding","onSubmenuShowing","onSubmenuShown"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultSelectedItem: "selectedItem",
      }), []);

      const expectedChildren = useMemo(() => ({
        animation: { optionName: "animation", isCollectionItem: false },
        item: { optionName: "items", isCollectionItem: true },
        showFirstSubmenuMode: { optionName: "showFirstSubmenuMode", isCollectionItem: false },
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
        React.createElement(BaseComponent<React.PropsWithChildren<IMenuOptions<TKey>>>, {
          WidgetClass: dxMenu,
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
) as <TKey = any>(props: React.PropsWithChildren<IMenuOptions<TKey>> & { ref?: Ref<MenuRef<TKey>> }) => ReactElement | null;


// owners:
// Menu
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
// ShowFirstSubmenuMode
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
const _componentPosition = memo(
  (props: IPositionProps) => {
    return React.createElement(NestedOption<IPositionProps>, { ...props });
  }
);

const Position: typeof _componentPosition & IElementDescriptor = Object.assign(_componentPosition, {
  OptionName: "position",
  ExpectedChildren: {
    at: { optionName: "at", isCollectionItem: false },
    boundaryOffset: { optionName: "boundaryOffset", isCollectionItem: false },
    collision: { optionName: "collision", isCollectionItem: false },
    my: { optionName: "my", isCollectionItem: false },
    offset: { optionName: "offset", isCollectionItem: false }
  },
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
// Menu
type IShowFirstSubmenuModeProps = React.PropsWithChildren<{
  delay?: number | Record<string, any> | {
    hide?: number;
    show?: number;
  };
  name?: "onClick" | "onHover";
}>
const _componentShowFirstSubmenuMode = memo(
  (props: IShowFirstSubmenuModeProps) => {
    return React.createElement(NestedOption<IShowFirstSubmenuModeProps>, { ...props });
  }
);

const ShowFirstSubmenuMode: typeof _componentShowFirstSubmenuMode & IElementDescriptor = Object.assign(_componentShowFirstSubmenuMode, {
  OptionName: "showFirstSubmenuMode",
  ExpectedChildren: {
    delay: { optionName: "delay", isCollectionItem: false }
  },
})

// owners:
// Menu
type IShowSubmenuModeProps = React.PropsWithChildren<{
  delay?: number | Record<string, any> | {
    hide?: number;
    show?: number;
  };
  name?: "onClick" | "onHover";
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

export default Menu;
export {
  Menu,
  IMenuOptions,
  MenuRef,
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

