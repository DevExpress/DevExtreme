"use client"
export { ExplicitTypes } from "devextreme/ui/tree_view";
import dxTreeView, {
    Properties
} from "devextreme/ui/tree_view";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
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
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<dxTreeViewItem>;
  onItemsChange?: (value: Array<dxTreeViewItem>) => void;
}>

class TreeView<TKey = any> extends BaseComponent<React.PropsWithChildren<ITreeViewOptions<TKey>>> {

  public get instance(): dxTreeView<TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxTreeView;

  protected subscribableOptions = ["items"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick","onItemCollapsed","onItemContextMenu","onItemExpanded","onItemHold","onItemRendered","onSelectAllValueChanged"];

  protected _defaults = {
    defaultItems: "items"
  };

  protected _expectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    searchEditorOptions: { optionName: "searchEditorOptions", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(TreeView as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  animationEnabled: PropTypes.bool,
  createChildren: PropTypes.func,
  dataStructure: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "plain",
      "tree"])
  ]),
  disabled: PropTypes.bool,
  disabledExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  displayExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  elementAttr: PropTypes.object,
  expandAllEnabled: PropTypes.bool,
  expandedExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  expandEvent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "dblclick",
      "click"])
  ]),
  expandNodesRecursive: PropTypes.bool,
  focusStateEnabled: PropTypes.bool,
  hasItemsExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  itemsExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  keyExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  noDataText: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemCollapsed: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemExpanded: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onItemSelectionChanged: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectAllValueChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  parentIdExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  rtlEnabled: PropTypes.bool,
  scrollDirection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "both",
      "horizontal",
      "vertical"])
  ]),
  searchEditorOptions: PropTypes.object,
  searchEnabled: PropTypes.bool,
  searchExpr: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  searchMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "contains",
      "startswith",
      "equals"])
  ]),
  searchTimeout: PropTypes.number,
  searchValue: PropTypes.string,
  selectAllText: PropTypes.string,
  selectByClick: PropTypes.bool,
  selectedExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple"])
  ]),
  selectNodesRecursive: PropTypes.bool,
  showCheckBoxesMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "none",
      "normal",
      "selectAll"])
  ]),
  tabIndex: PropTypes.number,
  useNativeScrolling: PropTypes.bool,
  virtualModeEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// SearchEditorOptions
type IButtonProps = React.PropsWithChildren<{
  location?: "after" | "before";
  name?: string;
  options?: dxButtonOptions;
}>
class Button extends NestedOption<IButtonProps> {
  public static OptionName = "buttons";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    options: { optionName: "options", isCollectionItem: false }
  };
}

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
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

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
  keyFn?: (data: any) => string;
}>
class Options extends NestedOption<IOptionsProps> {
  public static OptionName = "options";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

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
class SearchEditorOptions extends NestedOption<ISearchEditorOptionsProps> {
  public static OptionName = "searchEditorOptions";
  public static DefaultsProps = {
    defaultValue: "value"
  };
  public static ExpectedChildren = {
    button: { optionName: "buttons", isCollectionItem: true }
  };
}

export default TreeView;
export {
  TreeView,
  ITreeViewOptions,
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

