"use client"
export { ExplicitTypes } from "devextreme/ui/card_view";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCardView, {
    Properties
} from "devextreme/ui/card_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { AnimationConfig, CollisionResolution, PositionConfig, AnimationState, AnimationType, CollisionResolutionCombination } from "devextreme/common/core/animation";
import type { HorizontalAlignment, VerticalAlignment, template, Direction, ToolbarItemLocation, ToolbarItemComponent, PositionAlignment, Mode, DisplayMode } from "devextreme/common";
import type { CardInfo, Column as CardViewColumn, PredefinedToolbarItem, ToolbarItem } from "devextreme/ui/card_view";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { event } from "devextreme/events/events.types";
import type { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent } from "devextreme/ui/load_panel";
import type { PagerPageSize } from "devextreme/common/grids";

type ICardViewOptions<TCardData = any, TKey = any> = React.PropsWithChildren<Properties<TCardData, TKey> & IHtmlOptions & {
  dataSource?: Properties<TCardData, TKey>["dataSource"];
  cardFooterRender?: (...params: any) => React.ReactNode;
  cardFooterComponent?: React.ComponentType<any>;
  cardRender?: (...params: any) => React.ReactNode;
  cardComponent?: React.ComponentType<any>;
  noDataRender?: (...params: any) => React.ReactNode;
  noDataComponent?: React.ComponentType<any>;
}>

interface CardViewRef<TCardData = any, TKey = any> {
  instance: () => dxCardView<TCardData, TKey>;
}

const CardView = memo(
  forwardRef(
    <TCardData = any, TKey = any>(props: React.PropsWithChildren<ICardViewOptions<TCardData, TKey>>, ref: ForwardedRef<CardViewRef<TCardData, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onContentReady","onDataErrorOccurred","onDisposing","onInitialized"]), []);

      const expectedChildren = useMemo(() => ({
        cardCover: { optionName: "cardCover", isCollectionItem: false },
        cardHeader: { optionName: "cardHeader", isCollectionItem: false },
        column: { optionName: "columns", isCollectionItem: true },
        headerPanel: { optionName: "headerPanel", isCollectionItem: false },
        loadPanel: { optionName: "loadPanel", isCollectionItem: false },
        pager: { optionName: "pager", isCollectionItem: false },
        paging: { optionName: "paging", isCollectionItem: false },
        remoteOperations: { optionName: "remoteOperations", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "cardFooterTemplate",
          render: "cardFooterRender",
          component: "cardFooterComponent"
        },
        {
          tmplOption: "cardTemplate",
          render: "cardRender",
          component: "cardComponent"
        },
        {
          tmplOption: "noDataTemplate",
          render: "noDataRender",
          component: "noDataComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICardViewOptions<TCardData, TKey>>>, {
          WidgetClass: dxCardView,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as <TCardData = any, TKey = any>(props: React.PropsWithChildren<ICardViewOptions<TCardData, TKey>> & { ref?: Ref<CardViewRef<TCardData, TKey>> }) => ReactElement | null;


// owners:
// LoadPanel
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
// CardView
type ICardCoverProps = React.PropsWithChildren<{
  altExpr?: ((data: any) => string) | string;
  aspectRatio?: string;
  imageExpr?: ((data: any) => string) | string;
  maxHeight?: number;
}>
const _componentCardCover = (props: ICardCoverProps) => {
  return React.createElement(NestedOption<ICardCoverProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cardCover",
    },
  });
};

const CardCover = Object.assign<typeof _componentCardCover, NestedComponentMeta>(_componentCardCover, {
  componentType: "option",
});

// owners:
// CardView
type ICardHeaderProps = React.PropsWithChildren<{
  visible?: boolean;
}>
const _componentCardHeader = (props: ICardHeaderProps) => {
  return React.createElement(NestedOption<ICardHeaderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cardHeader",
    },
  });
};

const CardHeader = Object.assign<typeof _componentCardHeader, NestedComponentMeta>(_componentCardHeader, {
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
// CardView
type IColumnProps = React.PropsWithChildren<{
  fieldCaptionTemplate?: ((card: CardInfo) => string | any) | template;
  fieldTemplate?: ((card: CardInfo) => string | any) | template;
  fieldValueTemplate?: ((card: CardInfo) => string | any) | template;
  headerItemCssClass?: string;
  headerItemTemplate?: ((column: CardViewColumn) => string | any) | template;
  fieldCaptionRender?: (...params: any) => React.ReactNode;
  fieldCaptionComponent?: React.ComponentType<any>;
  fieldRender?: (...params: any) => React.ReactNode;
  fieldComponent?: React.ComponentType<any>;
  fieldValueRender?: (...params: any) => React.ReactNode;
  fieldValueComponent?: React.ComponentType<any>;
  headerItemRender?: (...params: any) => React.ReactNode;
  headerItemComponent?: React.ComponentType<any>;
}>
const _componentColumn = (props: IColumnProps) => {
  return React.createElement(NestedOption<IColumnProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columns",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "fieldCaptionTemplate",
        render: "fieldCaptionRender",
        component: "fieldCaptionComponent"
      }, {
        tmplOption: "fieldTemplate",
        render: "fieldRender",
        component: "fieldComponent"
      }, {
        tmplOption: "fieldValueTemplate",
        render: "fieldValueRender",
        component: "fieldValueComponent"
      }, {
        tmplOption: "headerItemTemplate",
        render: "headerItemRender",
        component: "headerItemComponent"
      }],
    },
  });
};

const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
  componentType: "option",
});

// owners:
// Hide
// Show
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
// CardView
type IHeaderPanelProps = React.PropsWithChildren<{
  dragging?: Record<string, any>;
  itemCssClass?: string;
  itemTemplate?: ((e: { column: CardViewColumn }) => string | any) | template;
  visible?: boolean;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
}>
const _componentHeaderPanel = (props: IHeaderPanelProps) => {
  return React.createElement(NestedOption<IHeaderPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerPanel",
      TemplateProps: [{
        tmplOption: "itemTemplate",
        render: "itemRender",
        component: "itemComponent"
      }],
    },
  });
};

const HeaderPanel = Object.assign<typeof _componentHeaderPanel, NestedComponentMeta>(_componentHeaderPanel, {
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
// Toolbar
type IItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: PredefinedToolbarItem | string;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
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

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// CardView
type ILoadPanelProps = React.PropsWithChildren<{
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string | undefined;
  deferRendering?: boolean;
  delay?: number;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  indicatorSrc?: string;
  maxHeight?: (() => number | string) | number | string;
  maxWidth?: (() => number | string) | number | string;
  message?: string;
  minHeight?: (() => number | string) | number | string;
  minWidth?: (() => number | string) | number | string;
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onHidden?: ((e: HiddenEvent) => void);
  onHiding?: ((e: HidingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onShowing?: ((e: ShowingEvent) => void);
  onShown?: ((e: ShownEvent) => void);
  position?: (() => void) | PositionAlignment | PositionConfig;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
}>
const _componentLoadPanel = (props: ILoadPanelProps) => {
  return React.createElement(NestedOption<ILoadPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "loadPanel",
      DefaultsProps: {
        defaultPosition: "position",
        defaultVisible: "visible"
      },
      ExpectedChildren: {
        animation: { optionName: "animation", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const LoadPanel = Object.assign<typeof _componentLoadPanel, NestedComponentMeta>(_componentLoadPanel, {
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
// CardView
type IPagerProps = React.PropsWithChildren<{
  allowedPageSizes?: Array<number | PagerPageSize> | Mode;
  displayMode?: DisplayMode;
  infoText?: string;
  label?: string;
  showInfo?: boolean;
  showNavigationButtons?: boolean;
  showPageSizeSelector?: boolean;
  visible?: boolean | Mode;
}>
const _componentPager = (props: IPagerProps) => {
  return React.createElement(NestedOption<IPagerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "pager",
    },
  });
};

const Pager = Object.assign<typeof _componentPager, NestedComponentMeta>(_componentPager, {
  componentType: "option",
});

// owners:
// CardView
type IPagingProps = React.PropsWithChildren<{
  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;
  defaultPageIndex?: number;
  onPageIndexChange?: (value: number) => void;
  defaultPageSize?: number;
  onPageSizeChange?: (value: number) => void;
}>
const _componentPaging = (props: IPagingProps) => {
  return React.createElement(NestedOption<IPagingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "paging",
      DefaultsProps: {
        defaultPageIndex: "pageIndex",
        defaultPageSize: "pageSize"
      },
    },
  });
};

const Paging = Object.assign<typeof _componentPaging, NestedComponentMeta>(_componentPaging, {
  componentType: "option",
});

// owners:
// From
// To
// LoadPanel
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
      ExpectedChildren: {
        at: { optionName: "at", isCollectionItem: false },
        boundaryOffset: { optionName: "boundaryOffset", isCollectionItem: false },
        collision: { optionName: "collision", isCollectionItem: false },
        my: { optionName: "my", isCollectionItem: false },
        offset: { optionName: "offset", isCollectionItem: false }
      },
    },
  });
};

const Position = Object.assign<typeof _componentPosition, NestedComponentMeta>(_componentPosition, {
  componentType: "option",
});

// owners:
// CardView
type IRemoteOperationsProps = React.PropsWithChildren<{
  filtering?: boolean;
  paging?: boolean;
  sorting?: boolean;
  summary?: boolean;
}>
const _componentRemoteOperations = (props: IRemoteOperationsProps) => {
  return React.createElement(NestedOption<IRemoteOperationsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "remoteOperations",
    },
  });
};

const RemoteOperations = Object.assign<typeof _componentRemoteOperations, NestedComponentMeta>(_componentRemoteOperations, {
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
      ExpectedChildren: {
        from: { optionName: "from", isCollectionItem: false },
        to: { optionName: "to", isCollectionItem: false }
      },
    },
  });
};

const Show = Object.assign<typeof _componentShow, NestedComponentMeta>(_componentShow, {
  componentType: "option",
});

// owners:
// Hide
// Show
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
      ExpectedChildren: {
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const To = Object.assign<typeof _componentTo, NestedComponentMeta>(_componentTo, {
  componentType: "option",
});

// owners:
// CardView
type IToolbarProps = React.PropsWithChildren<{
  items?: Array<PredefinedToolbarItem | ToolbarItem>;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

export default CardView;
export {
  CardView,
  ICardViewOptions,
  CardViewRef,
  Animation,
  IAnimationProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  CardCover,
  ICardCoverProps,
  CardHeader,
  ICardHeaderProps,
  Collision,
  ICollisionProps,
  Column,
  IColumnProps,
  From,
  IFromProps,
  HeaderPanel,
  IHeaderPanelProps,
  Hide,
  IHideProps,
  Item,
  IItemProps,
  LoadPanel,
  ILoadPanelProps,
  My,
  IMyProps,
  Offset,
  IOffsetProps,
  Pager,
  IPagerProps,
  Paging,
  IPagingProps,
  Position,
  IPositionProps,
  RemoteOperations,
  IRemoteOperationsProps,
  Show,
  IShowProps,
  To,
  IToProps,
  Toolbar,
  IToolbarProps
};
import type * as CardViewTypes from 'devextreme/ui/card_view_types';
export { CardViewTypes };

