export { ExplicitTypes } from "devextreme/ui/list";
import { PropType } from "vue";
import { defineComponent } from "vue";
import List, { Properties } from "devextreme/ui/list";
import { prepareComponentConfig } from "./core/index";
import {
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
 ClickEvent,
 ContentReadyEvent as ButtonContentReadyEvent,
 DisposingEvent as ButtonDisposingEvent,
 InitializedEvent as ButtonInitializedEvent,
 OptionChangedEvent as ButtonOptionChangedEvent,
} from "devextreme/ui/button";
import {
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
    dataSource: {},
    disabled: Boolean,
    displayExpr: [Function, String] as PropType<((item: Object) => string) | string>,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    indicateLoading: Boolean,
    itemDeleteMode: String as PropType<"context" | "slideButton" | "slideItem" | "static" | "swipe" | "toggle">,
    itemDragging: Object,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any>>,
    itemTemplate: {},
    keyExpr: [Function, String] as PropType<(() => void) | string>,
    menuItems: Array as PropType<Array<Object>>,
    menuMode: String as PropType<"context" | "slide">,
    nextButtonText: String,
    noDataText: String,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onGroupRendered: Function as PropType<(e: GroupRenderedEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onItemClick: Function as PropType<(e: ItemClickEvent) => void>,
    onItemContextMenu: Function as PropType<(e: ItemContextMenuEvent) => void>,
    onItemDeleted: Function as PropType<(e: ItemDeletedEvent) => void>,
    onItemDeleting: Function as PropType<(e: ItemDeletingEvent) => void>,
    onItemHold: Function as PropType<(e: ItemHoldEvent) => void>,
    onItemRendered: Function as PropType<(e: ItemRenderedEvent) => void>,
    onItemReordered: Function as PropType<(e: ItemReorderedEvent) => void>,
    onItemSwipe: Function as PropType<(e: ItemSwipeEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onPageLoading: Function as PropType<(e: PageLoadingEvent) => void>,
    onPullRefresh: Function as PropType<(e: PullRefreshEvent) => void>,
    onScroll: Function as PropType<(e: ScrollEvent) => void>,
    onSelectAllValueChanged: Function as PropType<(e: SelectAllValueChangedEvent) => void>,
    onSelectionChanged: Function as PropType<(e: SelectionChangedEvent) => void>,
    onSelectionChanging: Function as PropType<(e: SelectionChangingEvent) => void>,
    pageLoadingText: String,
    pageLoadMode: String as PropType<"nextButton" | "scrollBottom">,
    pulledDownText: String,
    pullingDownText: String,
    pullRefreshEnabled: Boolean,
    refreshingText: String,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    scrollingEnabled: Boolean,
    searchEditorOptions: Object,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String] as PropType<(Array<Function | string>) | Function | string>,
    searchMode: String as PropType<"contains" | "startswith" | "equals">,
    searchTimeout: Number,
    searchValue: String,
    selectAllMode: String as PropType<"allPages" | "page">,
    selectAllText: String,
    selectByClick: Boolean,
    selectedItemKeys: Array as PropType<Array<any>>,
    selectedItems: Array as PropType<Array<any>>,
    selectionMode: String as PropType<"single" | "multiple" | "all" | "none">,
    showScrollbar: String as PropType<"always" | "never" | "onHover" | "onScroll">,
    showSelectionControls: Boolean,
    tabIndex: Number,
    useNativeScrolling: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    location: String as PropType<"after" | "before">,
    name: String,
    options: Object
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
    bindingOptions: Object,
    boundary: {},
    container: {},
    cursorOffset: [Object, String],
    data: {},
    dragDirection: String as PropType<"both" | "horizontal" | "vertical">,
    dragTemplate: {},
    dropFeedbackMode: String as PropType<"push" | "indicate">,
    elementAttr: Object,
    filter: String,
    group: String,
    handle: String,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    itemOrientation: String as PropType<"horizontal" | "vertical">,
    moveItemOnDrop: Boolean,
    onAdd: Function as PropType<(e: AddEvent) => void>,
    onDisposing: Function as PropType<(e: SortableDisposingEvent) => void>,
    onDragChange: Function as PropType<(e: DragChangeEvent) => void>,
    onDragEnd: Function as PropType<(e: DragEndEvent) => void>,
    onDragMove: Function as PropType<(e: DragMoveEvent) => void>,
    onDragStart: Function as PropType<(e: DragStartEvent) => void>,
    onInitialized: Function as PropType<(e: SortableInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: SortableOptionChangedEvent) => void>,
    onRemove: Function as PropType<(e: RemoveEvent) => void>,
    onReorder: Function as PropType<(e: ReorderEvent) => void>,
    rtlEnabled: Boolean,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    action: Function as PropType<(itemElement: any, itemData: Object) => void>,
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
    bindingOptions: Object,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<(e: ClickEvent) => void>,
    onContentReady: Function as PropType<(e: ButtonContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: ButtonDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: ButtonInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: ButtonOptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<"text" | "outlined" | "contained">,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<"danger" | "default" | "normal" | "success">,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    bindingOptions: Object,
    buttons: Array as PropType<Array<string | "clear" | Object>>,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    label: String,
    labelMode: String as PropType<"static" | "floating" | "hidden" | "outside">,
    mask: String,
    maskChar: String,
    maskInvalidMessage: String,
    maskRules: {},
    maxLength: [Number, String],
    mode: String as PropType<"email" | "password" | "search" | "tel" | "text" | "url">,
    name: String,
    onChange: Function as PropType<(e: ChangeEvent) => void>,
    onContentReady: Function as PropType<(e: TextBoxContentReadyEvent) => void>,
    onCopy: Function as PropType<(e: CopyEvent) => void>,
    onCut: Function as PropType<(e: CutEvent) => void>,
    onDisposing: Function as PropType<(e: TextBoxDisposingEvent) => void>,
    onEnterKey: Function as PropType<(e: EnterKeyEvent) => void>,
    onFocusIn: Function as PropType<(e: FocusInEvent) => void>,
    onFocusOut: Function as PropType<(e: FocusOutEvent) => void>,
    onInitialized: Function as PropType<(e: TextBoxInitializedEvent) => void>,
    onInput: Function as PropType<(e: InputEvent) => void>,
    onKeyDown: Function as PropType<(e: KeyDownEvent) => void>,
    onKeyUp: Function as PropType<(e: KeyUpEvent) => void>,
    onOptionChanged: Function as PropType<(e: TextBoxOptionChangedEvent) => void>,
    onPaste: Function as PropType<(e: PasteEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showClearButton: Boolean,
    showMaskMode: String as PropType<"always" | "onFocus">,
    spellcheck: Boolean,
    stylingMode: String as PropType<"outlined" | "underlined" | "filled">,
    tabIndex: Number,
    text: String,
    useMaskedValue: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<"always" | "auto">,
    validationMessagePosition: String as PropType<"bottom" | "left" | "right" | "top">,
    validationStatus: String as PropType<"valid" | "invalid" | "pending">,
    value: String,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
