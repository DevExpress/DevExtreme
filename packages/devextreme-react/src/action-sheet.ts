"use client"
export { ExplicitTypes } from "devextreme/ui/action_sheet";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxActionSheet, {
    Properties
} from "devextreme/ui/action_sheet";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxActionSheetItem, CancelClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "devextreme/ui/action_sheet";
import type { NativeEventInfo } from "devextreme/common/core/events";
import type { ButtonStyle, template, ButtonType } from "devextreme/common";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IActionSheetOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onCancelClick?: ((e: CancelClickEvent<TItem, TKey>) => void);
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
}

type IActionSheetOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IActionSheetOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxActionSheetItem | string>;
  defaultVisible?: boolean;
  onItemsChange?: (value: Array<any | dxActionSheetItem | string>) => void;
  onVisibleChange?: (value: boolean) => void;
}>

interface ActionSheetRef<TItem = any, TKey = any> {
  instance: () => dxActionSheet<TItem, TKey>;
}

const ActionSheet = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IActionSheetOptions<TItem, TKey>>, ref: ForwardedRef<ActionSheetRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","visible"]), []);
      const independentEvents = useMemo(() => (["onCancelClick","onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultVisible: "visible",
      }), []);

      const expectedChildren = useMemo(() => ({
        item: { optionName: "items", isCollectionItem: true }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IActionSheetOptions<TItem, TKey>>>, {
          WidgetClass: dxActionSheet,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IActionSheetOptions<TItem, TKey>> & { ref?: Ref<ActionSheetRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// ActionSheet
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  icon?: string;
  onClick?: ((e: NativeEventInfo<any>) => void);
  stylingMode?: ButtonStyle;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType;
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

export default ActionSheet;
export {
  ActionSheet,
  IActionSheetOptions,
  ActionSheetRef,
  Item,
  IItemProps
};
import type * as ActionSheetTypes from 'devextreme/ui/action_sheet_types';
export { ActionSheetTypes };

