export { ExplicitTypes } from "devextreme/ui/list";
import List, { Properties } from "devextreme/ui/list";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

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
const DxList = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowItemDeleting: Boolean,
    bounceEnabled: Boolean,
    collapsibleGroups: Boolean,
    dataSource: {},
    disabled: Boolean,
    displayExpr: [Function, String],
    elementAttr: Object,
    focusStateEnabled: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    indicateLoading: Boolean,
    itemDeleteMode: String,
    itemDragging: Object,
    itemHoldTimeout: Number,
    items: Array,
    itemTemplate: {},
    keyExpr: [Function, String],
    menuItems: Array,
    menuMode: String,
    nextButtonText: String,
    noDataText: String,
    onContentReady: Function,
    onDisposing: Function,
    onGroupRendered: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemDeleted: Function,
    onItemDeleting: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onItemReordered: Function,
    onItemSwipe: Function,
    onOptionChanged: Function,
    onPageLoading: Function,
    onPullRefresh: Function,
    onScroll: Function,
    onSelectAllValueChanged: Function,
    onSelectionChanged: Function,
    pageLoadingText: String,
    pageLoadMode: String,
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
    searchExpr: [Array, Function, String],
    searchMode: String,
    searchTimeout: Number,
    searchValue: String,
    selectAllMode: String,
    selectAllText: String,
    selectByClick: Boolean,
    selectedItemKeys: Array,
    selectedItems: Array,
    selectionMode: String,
    showScrollbar: String,
    showSelectionControls: Boolean,
    tabIndex: Number,
    useNativeScrolling: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
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
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" },
      itemDragging: { isCollectionItem: false, optionName: "itemDragging" },
      menuItem: { isCollectionItem: true, optionName: "menuItems" },
      searchEditorOptions: { isCollectionItem: false, optionName: "searchEditorOptions" }
    };
  }
});

const DxButton = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: String,
    name: String,
    options: Object
  }
});
(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
(DxButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};
const DxCursorOffset = createConfigurationComponent({
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
});
(DxCursorOffset as any).$_optionName = "cursorOffset";
const DxItem = createConfigurationComponent({
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
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxItemDragging = createConfigurationComponent({
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
    dragDirection: String,
    dragTemplate: {},
    dropFeedbackMode: String,
    elementAttr: Object,
    filter: String,
    group: String,
    handle: String,
    height: [Function, Number, String],
    itemOrientation: String,
    moveItemOnDrop: Boolean,
    onAdd: Function,
    onDisposing: Function,
    onDragChange: Function,
    onDragEnd: Function,
    onDragMove: Function,
    onDragStart: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onRemove: Function,
    onReorder: Function,
    rtlEnabled: Boolean,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    width: [Function, Number, String]
  }
});
(DxItemDragging as any).$_optionName = "itemDragging";
(DxItemDragging as any).$_expectedChildren = {
  cursorOffset: { isCollectionItem: false, optionName: "cursorOffset" }
};
const DxMenuItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:action": null,
    "update:text": null,
  },
  props: {
    action: Function,
    text: String
  }
});
(DxMenuItem as any).$_optionName = "menuItems";
(DxMenuItem as any).$_isCollectionItem = true;
const DxOptions = createConfigurationComponent({
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
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    stylingMode: String,
    tabIndex: Number,
    template: {},
    text: String,
    type: String,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String]
  }
});
(DxOptions as any).$_optionName = "options";
const DxSearchEditorOptions = createConfigurationComponent({
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
    buttons: Array,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isValid: Boolean,
    label: String,
    labelMode: String,
    mask: String,
    maskChar: String,
    maskInvalidMessage: String,
    maskRules: {},
    maxLength: [Number, String],
    mode: String,
    name: String,
    onChange: Function,
    onContentReady: Function,
    onCopy: Function,
    onCut: Function,
    onDisposing: Function,
    onEnterKey: Function,
    onFocusIn: Function,
    onFocusOut: Function,
    onInitialized: Function,
    onInput: Function,
    onKeyDown: Function,
    onKeyUp: Function,
    onOptionChanged: Function,
    onPaste: Function,
    onValueChanged: Function,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showClearButton: Boolean,
    showMaskMode: String,
    spellcheck: Boolean,
    stylingMode: String,
    tabIndex: Number,
    text: String,
    useMaskedValue: Boolean,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: String,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String]
  }
});
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
