"use client"
export { ExplicitTypes } from "devextreme/ui/tree_view";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTreeView, {
    Properties
} from "devextreme/ui/tree_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxTreeViewItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemCollapsedEvent, ItemContextMenuEvent, ItemExpandedEvent, ItemHoldEvent, ItemRenderedEvent, SelectAllValueChangedEvent } from "devextreme/ui/tree_view";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TextBoxContentReadyEvent, DisposingEvent as TextBoxDisposingEvent, InitializedEvent as TextBoxInitializedEvent, OptionChangedEvent as TextBoxOptionChangedEvent, ChangeEvent, CopyEvent, CutEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InputEvent, KeyDownEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";
import type { TextEditorButton } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITreeViewOptionsNarrowedEvents<TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TKey>) => void);
  onItemCollapsed?: ((e: ItemCollapsedEvent<TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TKey>) => void);
  onItemExpanded?: ((e: ItemExpandedEvent<TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TKey>) => void);
  onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TKey>) => void);
}

type ITreeViewOptions<TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TKey>, ITreeViewOptionsNarrowedEvents<TKey>> & IHtmlOptions & {
  dataSource?: Properties<TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<dxTreeViewItem>;
  onItemsChange?: (value: Array<dxTreeViewItem>) => void;
}>

interface TreeViewRef<TKey = any> {
  instance: () => dxTreeView<TKey>;
}

const TreeView = memo(
  forwardRef(
    <TKey = any>(props: React.PropsWithChildren<ITreeViewOptions<TKey>>, ref: ForwardedRef<TreeViewRef<TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onItemClick","onItemCollapsed","onItemContextMenu","onItemExpanded","onItemHold","onItemRendered","onSelectAllValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
      }), []);

      const expectedChildren = useMemo(() => ({
        item: { optionName: "items", isCollectionItem: true },
        searchEditorOptions: { optionName: "searchEditorOptions", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ITreeViewOptions<TKey>>>, {
          WidgetClass: dxTreeView,
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
) as <TKey = any>(props: React.PropsWithChildren<ITreeViewOptions<TKey>> & { ref?: Ref<TreeViewRef<TKey>> }) => ReactElement | null;


// owners:
// SearchEditorOptions
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
// TreeView
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  expanded?: boolean;
  hasItems?: boolean;
  html?: string;
  icon?: string;
  id?: number | string;
  items?: Array<dxTreeViewItem>;
  parentId?: number | string;
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
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
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
// TreeView
type ISearchEditorOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  buttons?: Array<string | "clear" | TextEditorButton>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  isDirty?: boolean;
  isValid?: boolean;
  label?: string;
  labelMode?: "static" | "floating" | "hidden" | "outside";
  mask?: string;
  maskChar?: string;
  maskInvalidMessage?: string;
  maskRules?: any;
  maxLength?: number | string;
  mode?: "email" | "password" | "search" | "tel" | "text" | "url";
  name?: string;
  onChange?: ((e: ChangeEvent) => void);
  onContentReady?: ((e: TextBoxContentReadyEvent) => void);
  onCopy?: ((e: CopyEvent) => void);
  onCut?: ((e: CutEvent) => void);
  onDisposing?: ((e: TextBoxDisposingEvent) => void);
  onEnterKey?: ((e: EnterKeyEvent) => void);
  onFocusIn?: ((e: FocusInEvent) => void);
  onFocusOut?: ((e: FocusOutEvent) => void);
  onInitialized?: ((e: TextBoxInitializedEvent) => void);
  onInput?: ((e: InputEvent) => void);
  onKeyDown?: ((e: KeyDownEvent) => void);
  onKeyUp?: ((e: KeyUpEvent) => void);
  onOptionChanged?: ((e: TextBoxOptionChangedEvent) => void);
  onPaste?: ((e: PasteEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
  placeholder?: string;
  readOnly?: boolean;
  rtlEnabled?: boolean;
  showClearButton?: boolean;
  showMaskMode?: "always" | "onFocus";
  spellcheck?: boolean;
  stylingMode?: "outlined" | "underlined" | "filled";
  tabIndex?: number;
  text?: string;
  useMaskedValue?: boolean;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: "always" | "auto";
  validationMessagePosition?: "bottom" | "left" | "right" | "top";
  validationStatus?: "valid" | "invalid" | "pending";
  value?: string;
  valueChangeEvent?: string;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>
const _componentSearchEditorOptions = memo(
  (props: ISearchEditorOptionsProps) => {
    return React.createElement(NestedOption<ISearchEditorOptionsProps>, { ...props });
  }
);

const SearchEditorOptions: typeof _componentSearchEditorOptions & IElementDescriptor = Object.assign(_componentSearchEditorOptions, {
  OptionName: "searchEditorOptions",
  DefaultsProps: {
    defaultValue: "value"
  },
  ExpectedChildren: {
    button: { optionName: "buttons", isCollectionItem: true }
  },
})

export default TreeView;
export {
  TreeView,
  ITreeViewOptions,
  TreeViewRef,
  Button,
  IButtonProps,
  Item,
  IItemProps,
  Options,
  IOptionsProps,
  SearchEditorOptions,
  ISearchEditorOptionsProps
};
import type * as TreeViewTypes from 'devextreme/ui/tree_view_types';
export { TreeViewTypes };

