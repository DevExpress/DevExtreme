"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxButtonGroup, {
    Properties
} from "devextreme/ui/button_group";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent } from "devextreme/ui/button_group";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template, ButtonType } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IButtonGroupOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
}

type IButtonGroupOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IButtonGroupOptionsNarrowedEvents> & IHtmlOptions & {
  buttonRender?: (...params: any) => React.ReactNode;
  buttonComponent?: React.ComponentType<any>;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

interface ButtonGroupRef {
  instance: () => dxButtonGroup;
}

const ButtonGroup = memo(
  forwardRef(
    (props: React.PropsWithChildren<IButtonGroupOptions>, ref: ForwardedRef<ButtonGroupRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["selectedItemKeys","selectedItems"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick"]), []);

      const defaults = useMemo(() => ({
        defaultSelectedItemKeys: "selectedItemKeys",
        defaultSelectedItems: "selectedItems",
      }), []);

      const expectedChildren = useMemo(() => ({
        item: { optionName: "items", isCollectionItem: true }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "buttonTemplate",
          render: "buttonRender",
          component: "buttonComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IButtonGroupOptions>>, {
          WidgetClass: dxButtonGroup,
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
) as (props: React.PropsWithChildren<IButtonGroupOptions> & { ref?: Ref<ButtonGroupRef> }) => ReactElement | null;


// owners:
// ButtonGroup
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  hint?: string;
  icon?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType;
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

export default ButtonGroup;
export {
  ButtonGroup,
  IButtonGroupOptions,
  ButtonGroupRef,
  Item,
  IItemProps
};
import type * as ButtonGroupTypes from 'devextreme/ui/button_group_types';
export { ButtonGroupTypes };

