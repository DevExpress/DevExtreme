"use client"
export { ExplicitTypes } from "devextreme/ui/accordion";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxAccordion, {
    Properties
} from "devextreme/ui/accordion";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxAccordionItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, ItemTitleClickEvent } from "devextreme/ui/accordion";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IAccordionOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onItemTitleClick?: ((e: ItemTitleClickEvent<TItem, TKey>) => void);
}

type IAccordionOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IAccordionOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemTitleRender?: (...params: any) => React.ReactNode;
  itemTitleComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxAccordionItem | string>;
  defaultSelectedIndex?: number;
  defaultSelectedItem?: any;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onItemsChange?: (value: Array<any | dxAccordionItem | string>) => void;
  onSelectedIndexChange?: (value: number) => void;
  onSelectedItemChange?: (value: any) => void;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

interface AccordionRef<TItem = any, TKey = any> {
  instance: () => dxAccordion<TItem, TKey>;
}

const Accordion = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IAccordionOptions<TItem, TKey>>, ref: ForwardedRef<AccordionRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedIndex","selectedItem","selectedItemKeys","selectedItems"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemContextMenu","onItemHold","onItemRendered","onItemTitleClick"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultSelectedIndex: "selectedIndex",
        defaultSelectedItem: "selectedItem",
        defaultSelectedItemKeys: "selectedItemKeys",
        defaultSelectedItems: "selectedItems",
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
        {
          tmplOption: "itemTitleTemplate",
          render: "itemTitleRender",
          component: "itemTitleComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IAccordionOptions<TItem, TKey>>>, {
          WidgetClass: dxAccordion,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IAccordionOptions<TItem, TKey>> & { ref?: Ref<AccordionRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// Accordion
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
  icon?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  title?: string;
  titleTemplate?: (() => string | any) | template;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
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
      }, {
        tmplOption: "titleTemplate",
        render: "titleRender",
        component: "titleComponent"
      }],
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

export default Accordion;
export {
  Accordion,
  IAccordionOptions,
  AccordionRef,
  Item,
  IItemProps
};
import type * as AccordionTypes from 'devextreme/ui/accordion_types';
export { AccordionTypes };

