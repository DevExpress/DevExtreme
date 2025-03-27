"use client"
export { ExplicitTypes } from "devextreme/ui/card_view";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCardView, {
    Properties
} from "devextreme/ui/card_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DataRow, Column as CardViewColumn, PredefinedToolbarItem, ToolbarItem } from "devextreme/ui/card_view";
import type { template, ToolbarItemLocation, ToolbarItemComponent, Mode, DisplayMode } from "devextreme/common";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { PagerPageSize } from "devextreme/common/grids";

type ICardViewOptions<TRowData = any, TKey = any> = React.PropsWithChildren<Properties<TRowData, TKey> & IHtmlOptions & {
  dataSource?: Properties<TRowData, TKey>["dataSource"];
  cardRender?: (...params: any) => React.ReactNode;
  cardComponent?: React.ComponentType<any>;
}>

interface CardViewRef<TRowData = any, TKey = any> {
  instance: () => dxCardView<TRowData, TKey>;
}

const CardView = memo(
  forwardRef(
    <TRowData = any, TKey = any>(props: React.PropsWithChildren<ICardViewOptions<TRowData, TKey>>, ref: ForwardedRef<CardViewRef<TRowData, TKey>>) => {
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
        pager: { optionName: "pager", isCollectionItem: false },
        paging: { optionName: "paging", isCollectionItem: false },
        remoteOperations: { optionName: "remoteOperations", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "cardTemplate",
          render: "cardRender",
          component: "cardComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICardViewOptions<TRowData, TKey>>>, {
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
) as <TRowData = any, TKey = any>(props: React.PropsWithChildren<ICardViewOptions<TRowData, TKey>> & { ref?: Ref<CardViewRef<TRowData, TKey>> }) => ReactElement | null;


// owners:
// CardView
type ICardCoverProps = React.PropsWithChildren<{
  altExpr?: ((data: any) => string) | string;
  imageExpr?: ((data: any) => string) | string;
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
  captionExpr?: ((data: any) => string) | string;
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
// CardView
type IColumnProps = React.PropsWithChildren<{
  fieldCaptionTemplate?: ((dataRow: DataRow) => string | any) | template;
  fieldTemplate?: ((dataRow: DataRow) => string | any) | template;
  fieldValueTemplate?: ((dataRow: DataRow) => string | any) | template;
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
  CardCover,
  ICardCoverProps,
  CardHeader,
  ICardHeaderProps,
  Column,
  IColumnProps,
  HeaderPanel,
  IHeaderPanelProps,
  Item,
  IItemProps,
  Pager,
  IPagerProps,
  Paging,
  IPagingProps,
  RemoteOperations,
  IRemoteOperationsProps,
  Toolbar,
  IToolbarProps
};
import type * as CardViewTypes from 'devextreme/ui/card_view_types';
export { CardViewTypes };

