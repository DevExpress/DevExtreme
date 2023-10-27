"use client"
export { ExplicitTypes } from "devextreme/ui/list";
import dxList, {
    Properties
} from "devextreme/ui/list";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxListItem, ContentReadyEvent, DisposingEvent, GroupRenderedEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemDeletedEvent, ItemDeletingEvent, ItemHoldEvent, ItemRenderedEvent, ItemReorderedEvent, ItemSwipeEvent, PageLoadingEvent, PullRefreshEvent, ScrollEvent, SelectAllValueChangedEvent } from "devextreme/ui/list";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, OptionChangedEvent as ButtonOptionChangedEvent, ClickEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TextBoxContentReadyEvent, DisposingEvent as TextBoxDisposingEvent, InitializedEvent as TextBoxInitializedEvent, OptionChangedEvent as TextBoxOptionChangedEvent, ChangeEvent, CopyEvent, CutEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InputEvent, KeyDownEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import type { DisposingEvent as SortableDisposingEvent, InitializedEvent as SortableInitializedEvent, AddEvent, DragChangeEvent, DragEndEvent, DragMoveEvent, DragStartEvent, OptionChangedEvent, RemoveEvent, ReorderEvent } from "devextreme/ui/sortable";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";
import type { TextEditorButton } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IListOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onGroupRendered?: ((e: GroupRenderedEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
  onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
  onItemDeleted?: ((e: ItemDeletedEvent<TItem, TKey>) => void);
  onItemDeleting?: ((e: ItemDeletingEvent<TItem, TKey>) => void);
  onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
  onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
  onItemReordered?: ((e: ItemReorderedEvent<TItem, TKey>) => void);
  onItemSwipe?: ((e: ItemSwipeEvent<TItem, TKey>) => void);
  onPageLoading?: ((e: PageLoadingEvent<TItem, TKey>) => void);
  onPullRefresh?: ((e: PullRefreshEvent<TItem, TKey>) => void);
  onScroll?: ((e: ScrollEvent<TItem, TKey>) => void);
  onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TItem, TKey>) => void);
}

type IListOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IListOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  groupRender?: (...params: any) => React.ReactNode;
  groupComponent?: React.ComponentType<any>;
  groupKeyFn?: (data: any) => string;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | dxListItem | string>;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onItemsChange?: (value: Array<any | dxListItem | string>) => void;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

class List<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IListOptions<TItem, TKey>>> {

  public get instance(): dxList<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxList;

  protected subscribableOptions = ["items","selectedItemKeys","selectedItems"];

  protected independentEvents = ["onContentReady","onDisposing","onGroupRendered","onInitialized","onItemClick","onItemContextMenu","onItemDeleted","onItemDeleting","onItemHold","onItemRendered","onItemReordered","onItemSwipe","onPageLoading","onPullRefresh","onScroll","onSelectAllValueChanged"];

  protected _defaults = {
    defaultItems: "items",
    defaultSelectedItemKeys: "selectedItemKeys",
    defaultSelectedItems: "selectedItems"
  };

  protected _expectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    itemDragging: { optionName: "itemDragging", isCollectionItem: false },
    menuItem: { optionName: "menuItems", isCollectionItem: true },
    searchEditorOptions: { optionName: "searchEditorOptions", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "groupTemplate",
    render: "groupRender",
    component: "groupComponent",
    keyFn: "groupKeyFn"
  }, {
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(List as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowItemDeleting: PropTypes.bool,
  bounceEnabled: PropTypes.bool,
  collapsibleGroups: PropTypes.bool,
  disabled: PropTypes.bool,
  displayExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  grouped: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  indicateLoading: PropTypes.bool,
  itemDeleteMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "context",
      "slideButton",
      "slideItem",
      "static",
      "swipe",
      "toggle"])
  ]),
  itemDragging: PropTypes.object,
  itemHoldTimeout: PropTypes.number,
  items: PropTypes.array,
  keyExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  menuItems: PropTypes.array,
  menuMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "context",
      "slide"])
  ]),
  nextButtonText: PropTypes.string,
  noDataText: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onGroupRendered: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onItemContextMenu: PropTypes.func,
  onItemDeleted: PropTypes.func,
  onItemDeleting: PropTypes.func,
  onItemHold: PropTypes.func,
  onItemRendered: PropTypes.func,
  onItemReordered: PropTypes.func,
  onItemSwipe: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPageLoading: PropTypes.func,
  onPullRefresh: PropTypes.func,
  onScroll: PropTypes.func,
  onSelectAllValueChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  pageLoadingText: PropTypes.string,
  pageLoadMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "nextButton",
      "scrollBottom"])
  ]),
  pulledDownText: PropTypes.string,
  pullingDownText: PropTypes.string,
  pullRefreshEnabled: PropTypes.bool,
  refreshingText: PropTypes.string,
  repaintChangesOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  scrollByContent: PropTypes.bool,
  scrollByThumb: PropTypes.bool,
  scrollingEnabled: PropTypes.bool,
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
  selectAllMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "allPages",
      "page"])
  ]),
  selectAllText: PropTypes.string,
  selectByClick: PropTypes.bool,
  selectedItemKeys: PropTypes.array,
  selectedItems: PropTypes.array,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple",
      "all",
      "none"])
  ]),
  showScrollbar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "never",
      "onHover",
      "onScroll"])
  ]),
  showSelectionControls: PropTypes.bool,
  tabIndex: PropTypes.number,
  useNativeScrolling: PropTypes.bool,
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
// ItemDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class CursorOffset extends NestedOption<ICursorOffsetProps> {
  public static OptionName = "cursorOffset";
}

// owners:
// List
type IItemProps = React.PropsWithChildren<{
  badge?: string;
  disabled?: boolean;
  html?: string;
  icon?: string;
  key?: string;
  showChevron?: boolean;
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
// List
type IItemDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  bindingOptions?: Record<string, any>;
  boundary?: any | string;
  container?: any | string;
  cursorOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  data?: any;
  dragDirection?: "both" | "horizontal" | "vertical";
  dragTemplate?: ((dragInfo: { fromIndex: number, itemData: any, itemElement: any }, containerElement: any) => string | any) | template;
  dropFeedbackMode?: "push" | "indicate";
  elementAttr?: Record<string, any>;
  filter?: string;
  group?: string;
  handle?: string;
  height?: (() => number | string) | number | string;
  itemOrientation?: "horizontal" | "vertical";
  moveItemOnDrop?: boolean;
  onAdd?: ((e: AddEvent) => void);
  onDisposing?: ((e: SortableDisposingEvent) => void);
  onDragChange?: ((e: DragChangeEvent) => void);
  onDragEnd?: ((e: DragEndEvent) => void);
  onDragMove?: ((e: DragMoveEvent) => void);
  onDragStart?: ((e: DragStartEvent) => void);
  onInitialized?: ((e: SortableInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onRemove?: ((e: RemoveEvent) => void);
  onReorder?: ((e: ReorderEvent) => void);
  rtlEnabled?: boolean;
  scrollSensitivity?: number;
  scrollSpeed?: number;
  width?: (() => number | string) | number | string;
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
  dragKeyFn?: (data: any) => string;
}>
class ItemDragging extends NestedOption<IItemDraggingProps> {
  public static OptionName = "itemDragging";
  public static ExpectedChildren = {
    cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "dragTemplate",
    render: "dragRender",
    component: "dragComponent",
    keyFn: "dragKeyFn"
  }];
}

// owners:
// List
type IMenuItemProps = React.PropsWithChildren<{
  action?: ((itemElement: any, itemData: any) => void);
  text?: string;
}>
class MenuItem extends NestedOption<IMenuItemProps> {
  public static OptionName = "menuItems";
  public static IsCollectionItem = true;
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
  onOptionChanged?: ((e: ButtonOptionChangedEvent) => void);
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
// List
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

export default List;
export {
  List,
  IListOptions,
  Button,
  IButtonProps,
  CursorOffset,
  ICursorOffsetProps,
  Item,
  IItemProps,
  ItemDragging,
  IItemDraggingProps,
  MenuItem,
  IMenuItemProps,
  Options,
  IOptionsProps,
  SearchEditorOptions,
  ISearchEditorOptionsProps
};
import type * as ListTypes from 'devextreme/ui/list_types';
export { ListTypes };

