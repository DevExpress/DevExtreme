export { ExplicitTypes } from "devextreme/ui/tree_view";
import { PropType } from "vue";
import TreeView, { Properties } from "devextreme/ui/tree_view";
import {
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemCollapsedEvent,
 ItemContextMenuEvent,
 ItemExpandedEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 ItemSelectionChangedEvent,
 OptionChangedEvent,
 SelectAllValueChangedEvent,
 SelectionChangedEvent,
} from "devextreme/ui/tree_view";
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
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "animationEnabled" |
  "collapseIcon" |
  "createChildren" |
  "dataSource" |
  "dataStructure" |
  "disabled" |
  "disabledExpr" |
  "displayExpr" |
  "elementAttr" |
  "expandAllEnabled" |
  "expandedExpr" |
  "expandEvent" |
  "expandIcon" |
  "expandNodesRecursive" |
  "focusStateEnabled" |
  "hasItemsExpr" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "itemHoldTimeout" |
  "items" |
  "itemsExpr" |
  "itemTemplate" |
  "keyExpr" |
  "noDataText" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemCollapsed" |
  "onItemContextMenu" |
  "onItemExpanded" |
  "onItemHold" |
  "onItemRendered" |
  "onItemSelectionChanged" |
  "onOptionChanged" |
  "onSelectAllValueChanged" |
  "onSelectionChanged" |
  "parentIdExpr" |
  "rootValue" |
  "rtlEnabled" |
  "scrollDirection" |
  "searchEditorOptions" |
  "searchEnabled" |
  "searchExpr" |
  "searchMode" |
  "searchTimeout" |
  "searchValue" |
  "selectAllText" |
  "selectByClick" |
  "selectedExpr" |
  "selectionMode" |
  "selectNodesRecursive" |
  "showCheckBoxesMode" |
  "tabIndex" |
  "useNativeScrolling" |
  "virtualModeEnabled" |
  "visible" |
  "width"
>;

interface DxTreeView extends AccessibleOptions {
  readonly instance?: TreeView;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationEnabled: Boolean,
    collapseIcon: {},
    createChildren: Function as PropType<(parentNode: Object) => (any)>,
    dataSource: {},
    dataStructure: String as PropType<"plain" | "tree">,
    disabled: Boolean,
    disabledExpr: [Function, String] as PropType<(() => void) | string>,
    displayExpr: [Function, String] as PropType<((item: Object) => string) | string>,
    elementAttr: Object,
    expandAllEnabled: Boolean,
    expandedExpr: [Function, String] as PropType<(() => void) | string>,
    expandEvent: String as PropType<"dblclick" | "click">,
    expandIcon: {},
    expandNodesRecursive: Boolean,
    focusStateEnabled: Boolean,
    hasItemsExpr: [Function, String] as PropType<(() => void) | string>,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<Object>>,
    itemsExpr: [Function, String] as PropType<(() => void) | string>,
    itemTemplate: {},
    keyExpr: [Function, String] as PropType<(() => void) | string>,
    noDataText: String,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onItemClick: Function as PropType<(e: ItemClickEvent) => void>,
    onItemCollapsed: Function as PropType<(e: ItemCollapsedEvent) => void>,
    onItemContextMenu: Function as PropType<(e: ItemContextMenuEvent) => void>,
    onItemExpanded: Function as PropType<(e: ItemExpandedEvent) => void>,
    onItemHold: Function as PropType<(e: ItemHoldEvent) => void>,
    onItemRendered: Function as PropType<(e: ItemRenderedEvent) => void>,
    onItemSelectionChanged: Function as PropType<(e: ItemSelectionChangedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onSelectAllValueChanged: Function as PropType<(e: SelectAllValueChangedEvent) => void>,
    onSelectionChanged: Function as PropType<(e: SelectionChangedEvent) => void>,
    parentIdExpr: [Function, String] as PropType<(() => void) | string>,
    rootValue: {},
    rtlEnabled: Boolean,
    scrollDirection: String as PropType<"both" | "horizontal" | "vertical">,
    searchEditorOptions: Object,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String] as PropType<(Array<Function | string>) | Function | string>,
    searchMode: String as PropType<"contains" | "startswith" | "equals">,
    searchTimeout: Number,
    searchValue: String,
    selectAllText: String,
    selectByClick: Boolean,
    selectedExpr: [Function, String] as PropType<(() => void) | string>,
    selectionMode: String as PropType<"single" | "multiple">,
    selectNodesRecursive: Boolean,
    showCheckBoxesMode: String as PropType<"none" | "normal" | "selectAll">,
    tabIndex: Number,
    useNativeScrolling: Boolean,
    virtualModeEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationEnabled": null,
    "update:collapseIcon": null,
    "update:createChildren": null,
    "update:dataSource": null,
    "update:dataStructure": null,
    "update:disabled": null,
    "update:disabledExpr": null,
    "update:displayExpr": null,
    "update:elementAttr": null,
    "update:expandAllEnabled": null,
    "update:expandedExpr": null,
    "update:expandEvent": null,
    "update:expandIcon": null,
    "update:expandNodesRecursive": null,
    "update:focusStateEnabled": null,
    "update:hasItemsExpr": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemsExpr": null,
    "update:itemTemplate": null,
    "update:keyExpr": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemCollapsed": null,
    "update:onItemContextMenu": null,
    "update:onItemExpanded": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onItemSelectionChanged": null,
    "update:onOptionChanged": null,
    "update:onSelectAllValueChanged": null,
    "update:onSelectionChanged": null,
    "update:parentIdExpr": null,
    "update:rootValue": null,
    "update:rtlEnabled": null,
    "update:scrollDirection": null,
    "update:searchEditorOptions": null,
    "update:searchEnabled": null,
    "update:searchExpr": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:searchValue": null,
    "update:selectAllText": null,
    "update:selectByClick": null,
    "update:selectedExpr": null,
    "update:selectionMode": null,
    "update:selectNodesRecursive": null,
    "update:showCheckBoxesMode": null,
    "update:tabIndex": null,
    "update:useNativeScrolling": null,
    "update:virtualModeEnabled": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): TreeView {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TreeView;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" },
      searchEditorOptions: { isCollectionItem: false, optionName: "searchEditorOptions" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxTreeView = defineComponent(componentConfig);


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

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:expanded": null,
    "update:hasItems": null,
    "update:html": null,
    "update:icon": null,
    "update:id": null,
    "update:items": null,
    "update:parentId": null,
    "update:selected": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    expanded: Boolean,
    hasItems: Boolean,
    html: String,
    icon: String,
    id: [Number, String],
    items: Array as PropType<Array<Object>>,
    parentId: [Number, String],
    selected: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

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

export default DxTreeView;
export {
  DxTreeView,
  DxButton,
  DxItem,
  DxOptions,
  DxSearchEditorOptions
};
import type * as DxTreeViewTypes from "devextreme/ui/tree_view_types";
export { DxTreeViewTypes };
