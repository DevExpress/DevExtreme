export { ExplicitTypes } from "devextreme/ui/list";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import List, { Properties } from "devextreme/ui/list";
import  DataSource from "devextreme/data/data_source";
import {
 dxListItem,
 ItemDeleteMode,
 ListMenuMode,
 ContentReadyEvent,
 DisposingEvent,
 GroupRenderedEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemDeletedEvent,
 ItemDeletingEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 ItemReorderedEvent,
 ItemSwipeEvent,
 OptionChangedEvent,
 PageLoadingEvent,
 PullRefreshEvent,
 ScrollEvent,
 SelectAllValueChangedEvent,
 SelectionChangedEvent,
 SelectionChangingEvent,
} from "devextreme/ui/list";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 dxSortableOptions,
 AddEvent,
 DisposingEvent as SortableDisposingEvent,
 DragChangeEvent,
 DragEndEvent,
 DragMoveEvent,
 DragStartEvent,
 InitializedEvent as SortableInitializedEvent,
 OptionChangedEvent as SortableOptionChangedEvent,
 RemoveEvent,
 ReorderEvent,
} from "devextreme/ui/sortable";
import {
 PageLoadMode,
 SearchMode,
 SelectAllMode,
 SingleMultipleAllOrNone,
 ScrollbarMode,
 TextEditorButtonLocation,
 DragDirection,
 DragHighlight,
 Orientation,
 ButtonStyle,
 ButtonType,
 TextBoxPredefinedButton,
 TextEditorButton,
 LabelMode,
 MaskMode,
 EditorStyle,
 ValidationMessageMode,
 Position,
 ValidationStatus,
} from "devextreme/common";
import {
 dxTextBoxOptions,
 TextBoxType,
 ChangeEvent,
 ContentReadyEvent as TextBoxContentReadyEvent,
 CopyEvent,
 CutEvent,
 DisposingEvent as TextBoxDisposingEvent,
 EnterKeyEvent,
 FocusInEvent,
 FocusOutEvent,
 InitializedEvent as TextBoxInitializedEvent,
 InputEvent,
 KeyDownEvent,
 KeyUpEvent,
 OptionChangedEvent as TextBoxOptionChangedEvent,
 PasteEvent,
 ValueChangedEvent,
} from "devextreme/ui/text_box";
import {
 dxButtonOptions,
 ClickEvent,
 ContentReadyEvent as ButtonContentReadyEvent,
 DisposingEvent as ButtonDisposingEvent,
 InitializedEvent as ButtonInitializedEvent,
 OptionChangedEvent as ButtonOptionChangedEvent,
} from "devextreme/ui/button";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowItemDeleting" |
  "bounceEnabled" |
  "collapsibleGroups" |
  "dataSource" |
  "disabled" |
  "displayExpr" |
  "elementAttr" |
  "focusStateEnabled" |
  "grouped" |
  "groupTemplate" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "indicateLoading" |
  "itemDeleteMode" |
  "itemDragging" |
  "itemHoldTimeout" |
  "items" |
  "itemTemplate" |
  "keyExpr" |
  "menuItems" |
  "menuMode" |
  "nextButtonText" |
  "noDataText" |
  "onContentReady" |
  "onDisposing" |
  "onGroupRendered" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemDeleted" |
  "onItemDeleting" |
  "onItemHold" |
  "onItemRendered" |
  "onItemReordered" |
  "onItemSwipe" |
  "onOptionChanged" |
  "onPageLoading" |
  "onPullRefresh" |
  "onScroll" |
  "onSelectAllValueChanged" |
  "onSelectionChanged" |
  "onSelectionChanging" |
  "pageLoadingText" |
  "pageLoadMode" |
  "pulledDownText" |
  "pullingDownText" |
  "pullRefreshEnabled" |
  "refreshingText" |
  "repaintChangesOnly" |
  "rtlEnabled" |
  "scrollByContent" |
  "scrollByThumb" |
  "scrollingEnabled" |
  "searchEditorOptions" |
  "searchEnabled" |
  "searchExpr" |
  "searchMode" |
  "searchTimeout" |
  "searchValue" |
  "selectAllMode" |
  "selectAllText" |
  "selectByClick" |
  "selectedItemKeys" |
  "selectedItems" |
  "selectionMode" |
  "showScrollbar" |
  "showSelectionControls" |
  "tabIndex" |
  "useNativeScrolling" |
  "visible" |
  "width"
>;

interface DxList extends AccessibleOptions {
  readonly instance?: List;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowItemDeleting: Boolean,
    bounceEnabled: Boolean,
    collapsibleGroups: Boolean,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxListItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    displayExpr: [Function, String] as PropType<(((item: any) => string)) | string>,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    indicateLoading: Boolean,
    itemDeleteMode: String as PropType<ItemDeleteMode>,
    itemDragging: Object as PropType<dxSortableOptions | Record<string, any>>,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxListItem | string>>,
    itemTemplate: {},
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    menuItems: Array as PropType<Array<Record<string, any>>>,
    menuMode: String as PropType<ListMenuMode>,
    nextButtonText: String,
    noDataText: String,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onGroupRendered: Function as PropType<((e: GroupRenderedEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemDeleted: Function as PropType<((e: ItemDeletedEvent) => void)>,
    onItemDeleting: Function as PropType<((e: ItemDeletingEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onItemReordered: Function as PropType<((e: ItemReorderedEvent) => void)>,
    onItemSwipe: Function as PropType<((e: ItemSwipeEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onPageLoading: Function as PropType<((e: PageLoadingEvent) => void)>,
    onPullRefresh: Function as PropType<((e: PullRefreshEvent) => void)>,
    onScroll: Function as PropType<((e: ScrollEvent) => void)>,
    onSelectAllValueChanged: Function as PropType<((e: SelectAllValueChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onSelectionChanging: Function as PropType<((e: SelectionChangingEvent) => void)>,
    pageLoadingText: String,
    pageLoadMode: String as PropType<PageLoadMode>,
    pulledDownText: String,
    pullingDownText: String,
    pullRefreshEnabled: Boolean,
    refreshingText: String,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    scrollingEnabled: Boolean,
    searchEditorOptions: Object as PropType<dxTextBoxOptions<any> | Record<string, any>>,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    searchMode: String as PropType<SearchMode>,
    searchTimeout: Number,
    searchValue: String,
    selectAllMode: String as PropType<SelectAllMode>,
    selectAllText: String,
    selectByClick: Boolean,
    selectedItemKeys: Array as PropType<Array<any>>,
    selectedItems: Array as PropType<Array<any>>,
    selectionMode: String as PropType<SingleMultipleAllOrNone>,
    showScrollbar: String as PropType<ScrollbarMode>,
    showSelectionControls: Boolean,
    tabIndex: Number,
    useNativeScrolling: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowItemDeleting": null,
    "update:bounceEnabled": null,
    "update:collapsibleGroups": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:displayExpr": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:grouped": null,
    "update:groupTemplate": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:indicateLoading": null,
    "update:itemDeleteMode": null,
    "update:itemDragging": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:keyExpr": null,
    "update:menuItems": null,
    "update:menuMode": null,
    "update:nextButtonText": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onGroupRendered": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemDeleted": null,
    "update:onItemDeleting": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onItemReordered": null,
    "update:onItemSwipe": null,
    "update:onOptionChanged": null,
    "update:onPageLoading": null,
    "update:onPullRefresh": null,
    "update:onScroll": null,
    "update:onSelectAllValueChanged": null,
    "update:onSelectionChanged": null,
    "update:onSelectionChanging": null,
    "update:pageLoadingText": null,
    "update:pageLoadMode": null,
    "update:pulledDownText": null,
    "update:pullingDownText": null,
    "update:pullRefreshEnabled": null,
    "update:refreshingText": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollByThumb": null,
    "update:scrollingEnabled": null,
    "update:searchEditorOptions": null,
    "update:searchEnabled": null,
    "update:searchExpr": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:searchValue": null,
    "update:selectAllMode": null,
    "update:selectAllText": null,
    "update:selectByClick": null,
    "update:selectedItemKeys": null,
    "update:selectedItems": null,
    "update:selectionMode": null,
    "update:showScrollbar": null,
    "update:showSelectionControls": null,
    "update:tabIndex": null,
    "update:useNativeScrolling": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): List {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = List;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" },
      itemDragging: { isCollectionItem: false, optionName: "itemDragging" },
      menuItem: { isCollectionItem: true, optionName: "menuItems" },
      searchEditorOptions: { isCollectionItem: false, optionName: "searchEditorOptions" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxList = defineComponent(componentConfig);


const DxButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: String as PropType<TextEditorButtonLocation>,
    name: String,
    options: Object as PropType<dxButtonOptions | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxButtonConfig);

const DxButton = defineComponent(DxButtonConfig);

(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
(DxButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

const DxCursorOffsetConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
};

prepareConfigurationComponentConfig(DxCursorOffsetConfig);

const DxCursorOffset = defineComponent(DxCursorOffsetConfig);

(DxCursorOffset as any).$_optionName = "cursorOffset";

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:badge": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:showChevron": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    badge: String,
    disabled: Boolean,
    html: String,
    icon: String,
    showChevron: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

const DxItemDraggingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDropInsideItem": null,
    "update:allowReordering": null,
    "update:autoScroll": null,
    "update:bindingOptions": null,
    "update:boundary": null,
    "update:container": null,
    "update:cursorOffset": null,
    "update:data": null,
    "update:dragDirection": null,
    "update:dragTemplate": null,
    "update:dropFeedbackMode": null,
    "update:elementAttr": null,
    "update:filter": null,
    "update:group": null,
    "update:handle": null,
    "update:height": null,
    "update:itemOrientation": null,
    "update:moveItemOnDrop": null,
    "update:onAdd": null,
    "update:onDisposing": null,
    "update:onDragChange": null,
    "update:onDragEnd": null,
    "update:onDragMove": null,
    "update:onDragStart": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onRemove": null,
    "update:onReorder": null,
    "update:rtlEnabled": null,
    "update:scrollSensitivity": null,
    "update:scrollSpeed": null,
    "update:width": null,
  },
  props: {
    allowDropInsideItem: Boolean,
    allowReordering: Boolean,
    autoScroll: Boolean,
    bindingOptions: Object as PropType<Record<string, any>>,
    boundary: {},
    container: {},
    cursorOffset: [Object, String] as PropType<Record<string, any> | string>,
    data: {},
    dragDirection: String as PropType<DragDirection>,
    dragTemplate: {},
    dropFeedbackMode: String as PropType<DragHighlight>,
    elementAttr: Object as PropType<Record<string, any>>,
    filter: String,
    group: String,
    handle: String,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    itemOrientation: String as PropType<Orientation>,
    moveItemOnDrop: Boolean,
    onAdd: Function as PropType<((e: AddEvent) => void)>,
    onDisposing: Function as PropType<((e: SortableDisposingEvent) => void)>,
    onDragChange: Function as PropType<((e: DragChangeEvent) => void)>,
    onDragEnd: Function as PropType<((e: DragEndEvent) => void)>,
    onDragMove: Function as PropType<((e: DragMoveEvent) => void)>,
    onDragStart: Function as PropType<((e: DragStartEvent) => void)>,
    onInitialized: Function as PropType<((e: SortableInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: SortableOptionChangedEvent) => void)>,
    onRemove: Function as PropType<((e: RemoveEvent) => void)>,
    onReorder: Function as PropType<((e: ReorderEvent) => void)>,
    rtlEnabled: Boolean,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxItemDraggingConfig);

const DxItemDragging = defineComponent(DxItemDraggingConfig);

(DxItemDragging as any).$_optionName = "itemDragging";
(DxItemDragging as any).$_expectedChildren = {
  cursorOffset: { isCollectionItem: false, optionName: "cursorOffset" }
};

const DxMenuItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:action": null,
    "update:text": null,
  },
  props: {
    action: Function as PropType<((itemElement: any, itemData: any) => void)>,
    text: String
  }
};

prepareConfigurationComponentConfig(DxMenuItemConfig);

const DxMenuItem = defineComponent(DxMenuItemConfig);

(DxMenuItem as any).$_optionName = "menuItems";
(DxMenuItem as any).$_isCollectionItem = true;

const DxOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    bindingOptions: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ButtonContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: ButtonDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: ButtonInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: ButtonOptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

const DxSearchEditorOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
    "update:buttons": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:label": null,
    "update:labelMode": null,
    "update:mask": null,
    "update:maskChar": null,
    "update:maskInvalidMessage": null,
    "update:maskRules": null,
    "update:maxLength": null,
    "update:mode": null,
    "update:name": null,
    "update:onChange": null,
    "update:onContentReady": null,
    "update:onCopy": null,
    "update:onCut": null,
    "update:onDisposing": null,
    "update:onEnterKey": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onInput": null,
    "update:onKeyDown": null,
    "update:onKeyUp": null,
    "update:onOptionChanged": null,
    "update:onPaste": null,
    "update:onValueChanged": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showClearButton": null,
    "update:showMaskMode": null,
    "update:spellcheck": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:useMaskedValue": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeEvent": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    bindingOptions: Object as PropType<Record<string, any>>,
    buttons: Array as PropType<Array<string | TextBoxPredefinedButton | TextEditorButton>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    label: String,
    labelMode: String as PropType<LabelMode>,
    mask: String,
    maskChar: String,
    maskInvalidMessage: String,
    maskRules: {},
    maxLength: [Number, String],
    mode: String as PropType<TextBoxType>,
    name: String,
    onChange: Function as PropType<((e: ChangeEvent) => void)>,
    onContentReady: Function as PropType<((e: TextBoxContentReadyEvent) => void)>,
    onCopy: Function as PropType<((e: CopyEvent) => void)>,
    onCut: Function as PropType<((e: CutEvent) => void)>,
    onDisposing: Function as PropType<((e: TextBoxDisposingEvent) => void)>,
    onEnterKey: Function as PropType<((e: EnterKeyEvent) => void)>,
    onFocusIn: Function as PropType<((e: FocusInEvent) => void)>,
    onFocusOut: Function as PropType<((e: FocusOutEvent) => void)>,
    onInitialized: Function as PropType<((e: TextBoxInitializedEvent) => void)>,
    onInput: Function as PropType<((e: InputEvent) => void)>,
    onKeyDown: Function as PropType<((e: KeyDownEvent) => void)>,
    onKeyUp: Function as PropType<((e: KeyUpEvent) => void)>,
    onOptionChanged: Function as PropType<((e: TextBoxOptionChangedEvent) => void)>,
    onPaste: Function as PropType<((e: PasteEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showClearButton: Boolean,
    showMaskMode: String as PropType<MaskMode>,
    spellcheck: Boolean,
    stylingMode: String as PropType<EditorStyle>,
    tabIndex: Number,
    text: String,
    useMaskedValue: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Position>,
    validationStatus: String as PropType<ValidationStatus>,
    value: String,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxSearchEditorOptionsConfig);

const DxSearchEditorOptions = defineComponent(DxSearchEditorOptionsConfig);

(DxSearchEditorOptions as any).$_optionName = "searchEditorOptions";
(DxSearchEditorOptions as any).$_expectedChildren = {
  button: { isCollectionItem: true, optionName: "buttons" }
};

export default DxList;
export {
  DxList,
  DxButton,
  DxCursorOffset,
  DxItem,
  DxItemDragging,
  DxMenuItem,
  DxOptions,
  DxSearchEditorOptions
};
import type * as DxListTypes from "devextreme/ui/list_types";
export { DxListTypes };
