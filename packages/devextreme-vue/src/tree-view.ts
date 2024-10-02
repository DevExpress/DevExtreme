export { ExplicitTypes } from "devextreme/ui/tree_view";
import { PropType } from "vue";
import TreeView, { Properties } from "devextreme/ui/tree_view";
import {  ContentReadyEvent , DisposingEvent , InitializedEvent , ItemClickEvent , ItemCollapsedEvent , ItemContextMenuEvent , ItemExpandedEvent , ItemHoldEvent , ItemRenderedEvent , ItemSelectionChangedEvent , OptionChangedEvent , SelectAllValueChangedEvent , SelectionChangedEvent ,} from "devextreme/ui/tree_view";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";
import { 
 ClickEvent  as OptionsClickEvent,
 ContentReadyEvent  as OptionsContentReadyEvent,
 DisposingEvent  as OptionsDisposingEvent,
 InitializedEvent  as OptionsInitializedEvent,
 OptionChangedEvent  as OptionsOptionChangedEvent,
} from "devextreme/ui/button";
import { 
 ChangeEvent  as SearchEditorOptionsChangeEvent,
 ContentReadyEvent  as SearchEditorOptionsContentReadyEvent,
 CopyEvent  as SearchEditorOptionsCopyEvent,
 CutEvent  as SearchEditorOptionsCutEvent,
 DisposingEvent  as SearchEditorOptionsDisposingEvent,
 EnterKeyEvent  as SearchEditorOptionsEnterKeyEvent,
 FocusInEvent  as SearchEditorOptionsFocusInEvent,
 FocusOutEvent  as SearchEditorOptionsFocusOutEvent,
 InitializedEvent  as SearchEditorOptionsInitializedEvent,
 InputEvent  as SearchEditorOptionsInputEvent,
 KeyDownEvent  as SearchEditorOptionsKeyDownEvent,
 KeyUpEvent  as SearchEditorOptionsKeyUpEvent,
 OptionChangedEvent  as SearchEditorOptionsOptionChangedEvent,
 PasteEvent  as SearchEditorOptionsPasteEvent,
 ValueChangedEvent  as SearchEditorOptionsValueChangedEvent,
} from "devextreme/ui/text_box";

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
    createChildren: Function as PropType<(parentNode: Object) => (any | Object[])>,
    dataSource: {},
    dataStructure: String as PropType<"plain" | "tree">,
    disabled: Boolean,
    disabledExpr: [Function, String] as PropType<(() => void) | (String)>,
    displayExpr: [Function, String] as PropType<((item: Object) => string) | (String)>,
    elementAttr: Object,
    expandAllEnabled: Boolean,
    expandedExpr: [Function, String] as PropType<(() => void) | (String)>,
    expandEvent: String as PropType<"dblclick" | "click">,
    expandIcon: {},
    expandNodesRecursive: Boolean,
    focusStateEnabled: Boolean,
    hasItemsExpr: [Function, String] as PropType<(() => void) | (String)>,
    height: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>,
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array as PropType<Object[]>,
    itemsExpr: [Function, String] as PropType<(() => void) | (String)>,
    itemTemplate: {},
    keyExpr: [Function, String] as PropType<(() => void) | (String)>,
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
    parentIdExpr: [Function, String] as PropType<(() => void) | (String)>,
    rootValue: {},
    rtlEnabled: Boolean,
    scrollDirection: String as PropType<"both" | "horizontal" | "vertical">,
    searchEditorOptions: Object,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String] as PropType<(Function[] | String[]) | (Function) | (String)>,
    searchMode: String as PropType<"contains" | "startswith" | "equals">,
    searchTimeout: Number,
    searchValue: String,
    selectAllText: String,
    selectByClick: Boolean,
    selectedExpr: [Function, String] as PropType<(() => void) | (String)>,
    selectionMode: String as PropType<"single" | "multiple">,
    selectNodesRecursive: Boolean,
    showCheckBoxesMode: String as PropType<"none" | "normal" | "selectAll">,
    tabIndex: Number,
    useNativeScrolling: Boolean,
    virtualModeEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>
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
    items: Array as PropType<Object[]>,
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
    height: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<(e: OptionsClickEvent) => void>,
    onContentReady: Function as PropType<(e: OptionsContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: OptionsDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: OptionsInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionsOptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<"text" | "outlined" | "contained">,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<"danger" | "default" | "normal" | "success">,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>
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
    buttons: Array as PropType<String[] | String[] | Object[]>,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>,
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
    onChange: Function as PropType<(e: SearchEditorOptionsChangeEvent) => void>,
    onContentReady: Function as PropType<(e: SearchEditorOptionsContentReadyEvent) => void>,
    onCopy: Function as PropType<(e: SearchEditorOptionsCopyEvent) => void>,
    onCut: Function as PropType<(e: SearchEditorOptionsCutEvent) => void>,
    onDisposing: Function as PropType<(e: SearchEditorOptionsDisposingEvent) => void>,
    onEnterKey: Function as PropType<(e: SearchEditorOptionsEnterKeyEvent) => void>,
    onFocusIn: Function as PropType<(e: SearchEditorOptionsFocusInEvent) => void>,
    onFocusOut: Function as PropType<(e: SearchEditorOptionsFocusOutEvent) => void>,
    onInitialized: Function as PropType<(e: SearchEditorOptionsInitializedEvent) => void>,
    onInput: Function as PropType<(e: SearchEditorOptionsInputEvent) => void>,
    onKeyDown: Function as PropType<(e: SearchEditorOptionsKeyDownEvent) => void>,
    onKeyUp: Function as PropType<(e: SearchEditorOptionsKeyUpEvent) => void>,
    onOptionChanged: Function as PropType<(e: SearchEditorOptionsOptionChangedEvent) => void>,
    onPaste: Function as PropType<(e: SearchEditorOptionsPasteEvent) => void>,
    onValueChanged: Function as PropType<(e: SearchEditorOptionsValueChangedEvent) => void>,
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
    validationErrors: Array as PropType<any[]>,
    validationMessageMode: String as PropType<"always" | "auto">,
    validationMessagePosition: String as PropType<"bottom" | "left" | "right" | "top">,
    validationStatus: String as PropType<"valid" | "invalid" | "pending">,
    value: String,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (Number | string)) | (Number) | (String)>
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
