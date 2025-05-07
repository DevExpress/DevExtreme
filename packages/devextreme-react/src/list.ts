"use client"
export { ExplicitTypes } from "devextreme/ui/list";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxList, {
    Properties
} from "devextreme/ui/list";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxListItem, ContentReadyEvent, DisposingEvent, GroupRenderedEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemDeletedEvent, ItemDeletingEvent, ItemHoldEvent, ItemRenderedEvent, ItemReorderedEvent, ItemSwipeEvent, PageLoadingEvent, PullRefreshEvent, ScrollEvent, SelectAllValueChangedEvent, SelectionChangingEvent } from "devextreme/ui/list";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, OptionChangedEvent as ButtonOptionChangedEvent, ClickEvent } from "devextreme/ui/button";
import type { ContentReadyEvent as TextBoxContentReadyEvent, DisposingEvent as TextBoxDisposingEvent, InitializedEvent as TextBoxInitializedEvent, OptionChangedEvent as TextBoxOptionChangedEvent, TextBoxType, ChangeEvent, CopyEvent, CutEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InputEvent, KeyDownEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import type { DisposingEvent as SortableDisposingEvent, InitializedEvent as SortableInitializedEvent, AddEvent, DragChangeEvent, DragEndEvent, DragMoveEvent, DragStartEvent, OptionChangedEvent, RemoveEvent, ReorderEvent } from "devextreme/ui/sortable";
import type { TextEditorButtonLocation, template, DragDirection, DragHighlight, Orientation, ButtonStyle, ButtonType, TextBoxPredefinedButton, TextEditorButton, LabelMode, MaskMode, EditorStyle, ValidationMessageMode, Position, ValidationStatus } from "devextreme/common";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

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
  onSelectionChanging?: ((e: SelectionChangingEvent<TItem, TKey>) => void);
}

type IListOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IListOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  groupRender?: (...params: any) => React.ReactNode;
  groupComponent?: React.ComponentType<any>;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  defaultItems?: Array<any | dxListItem | string>;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onItemsChange?: (value: Array<any | dxListItem | string>) => void;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

interface ListRef<TItem = any, TKey = any> {
  instance: () => dxList<TItem, TKey>;
}

const List = memo(
  forwardRef(
    <TItem = any, TKey = any>(props: React.PropsWithChildren<IListOptions<TItem, TKey>>, ref: ForwardedRef<ListRef<TItem, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items","selectedItemKeys","selectedItems"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onGroupRendered","onInitialized","onItemClick","onItemContextMenu","onItemDeleted","onItemDeleting","onItemHold","onItemRendered","onItemReordered","onItemSwipe","onPageLoading","onPullRefresh","onScroll","onSelectAllValueChanged","onSelectionChanging"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
        defaultSelectedItemKeys: "selectedItemKeys",
        defaultSelectedItems: "selectedItems",
      }), []);

      const expectedChildren = useMemo(() => ({
        item: { optionName: "items", isCollectionItem: true },
        itemDragging: { optionName: "itemDragging", isCollectionItem: false },
        menuItem: { optionName: "menuItems", isCollectionItem: true },
        searchEditorOptions: { optionName: "searchEditorOptions", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "groupTemplate",
          render: "groupRender",
          component: "groupComponent"
        },
        {
          tmplOption: "itemTemplate",
          render: "itemRender",
          component: "itemComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IListOptions<TItem, TKey>>>, {
          WidgetClass: dxList,
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
) as <TItem = any, TKey = any>(props: React.PropsWithChildren<IListOptions<TItem, TKey>> & { ref?: Ref<ListRef<TItem, TKey>> }) => ReactElement | null;


// owners:
// SearchEditorOptions
type IButtonProps = React.PropsWithChildren<{
  location?: TextEditorButtonLocation;
  name?: string | undefined;
  options?: dxButtonOptions | undefined;
}>
const _componentButton = (props: IButtonProps) => {
  return React.createElement(NestedOption<IButtonProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttons",
      IsCollectionItem: true,
      ExpectedChildren: {
        options: { optionName: "options", isCollectionItem: false }
      },
    },
  });
};

const Button = Object.assign<typeof _componentButton, NestedComponentMeta>(_componentButton, {
  componentType: "option",
});

// owners:
// ItemDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentCursorOffset = (props: ICursorOffsetProps) => {
  return React.createElement(NestedOption<ICursorOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cursorOffset",
    },
  });
};

const CursorOffset = Object.assign<typeof _componentCursorOffset, NestedComponentMeta>(_componentCursorOffset, {
  componentType: "option",
});

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

// owners:
// List
type IItemDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  bindingOptions?: Record<string, any>;
  boundary?: any | string | undefined;
  container?: any | string | undefined;
  cursorOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  data?: any | undefined;
  dragDirection?: DragDirection;
  dragTemplate?: ((dragInfo: { fromIndex: number, itemData: any, itemElement: any }, containerElement: any) => string | any) | template | undefined;
  dropFeedbackMode?: DragHighlight;
  elementAttr?: Record<string, any>;
  filter?: string;
  group?: string | undefined;
  handle?: string;
  height?: (() => number | string) | number | string | undefined;
  itemOrientation?: Orientation;
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
  width?: (() => number | string) | number | string | undefined;
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
}>
const _componentItemDragging = (props: IItemDraggingProps) => {
  return React.createElement(NestedOption<IItemDraggingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "itemDragging",
      ExpectedChildren: {
        cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "dragTemplate",
        render: "dragRender",
        component: "dragComponent"
      }],
    },
  });
};

const ItemDragging = Object.assign<typeof _componentItemDragging, NestedComponentMeta>(_componentItemDragging, {
  componentType: "option",
});

// owners:
// List
type IMenuItemProps = React.PropsWithChildren<{
  action?: ((itemElement: any, itemData: any) => void);
  text?: string;
}>
const _componentMenuItem = (props: IMenuItemProps) => {
  return React.createElement(NestedOption<IMenuItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "menuItems",
      IsCollectionItem: true,
    },
  });
};

const MenuItem = Object.assign<typeof _componentMenuItem, NestedComponentMeta>(_componentMenuItem, {
  componentType: "option",
});

// owners:
// Button
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: ButtonOptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: ButtonType | string;
  useSubmitBehavior?: boolean;
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: (() => number | string) | number | string | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentOptions = (props: IOptionsProps) => {
  return React.createElement(NestedOption<IOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "options",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Options = Object.assign<typeof _componentOptions, NestedComponentMeta>(_componentOptions, {
  componentType: "option",
});

// owners:
// List
type ISearchEditorOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  buttons?: Array<string | TextBoxPredefinedButton | TextEditorButton>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  isDirty?: boolean;
  isValid?: boolean;
  label?: string;
  labelMode?: LabelMode;
  mask?: string;
  maskChar?: string;
  maskInvalidMessage?: string;
  maskRules?: any;
  maxLength?: number | string;
  mode?: TextBoxType;
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
  showMaskMode?: MaskMode;
  spellcheck?: boolean;
  stylingMode?: EditorStyle;
  tabIndex?: number;
  text?: string;
  useMaskedValue?: boolean;
  validationError?: any;
  validationErrors?: Array<any>;
  validationMessageMode?: ValidationMessageMode;
  validationMessagePosition?: Position;
  validationStatus?: ValidationStatus;
  value?: string;
  valueChangeEvent?: string;
  visible?: boolean;
  width?: (() => number | string) | number | string | undefined;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>
const _componentSearchEditorOptions = (props: ISearchEditorOptionsProps) => {
  return React.createElement(NestedOption<ISearchEditorOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "searchEditorOptions",
      DefaultsProps: {
        defaultValue: "value"
      },
      ExpectedChildren: {
        button: { optionName: "buttons", isCollectionItem: true }
      },
    },
  });
};

const SearchEditorOptions = Object.assign<typeof _componentSearchEditorOptions, NestedComponentMeta>(_componentSearchEditorOptions, {
  componentType: "option",
});

export default List;
export {
  List,
  IListOptions,
  ListRef,
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

