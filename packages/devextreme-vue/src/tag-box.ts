import TagBox, { Properties } from "devextreme/ui/tag_box";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "acceptCustomValue" |
  "accessKey" |
  "activeStateEnabled" |
  "applyValueMode" |
  "buttons" |
  "customItemCreateEvent" |
  "dataSource" |
  "deferRendering" |
  "disabled" |
  "displayExpr" |
  "dropDownButtonTemplate" |
  "dropDownOptions" |
  "elementAttr" |
  "fieldTemplate" |
  "focusStateEnabled" |
  "grouped" |
  "groupTemplate" |
  "height" |
  "hideSelectedItems" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "isDirty" |
  "isValid" |
  "items" |
  "itemTemplate" |
  "label" |
  "labelMode" |
  "maxDisplayedTags" |
  "maxFilterQueryLength" |
  "maxLength" |
  "minSearchLength" |
  "multiline" |
  "name" |
  "noDataText" |
  "onChange" |
  "onClosed" |
  "onContentReady" |
  "onCustomItemCreating" |
  "onDisposing" |
  "onEnterKey" |
  "onFocusIn" |
  "onFocusOut" |
  "onInitialized" |
  "onInput" |
  "onItemClick" |
  "onKeyDown" |
  "onKeyUp" |
  "onMultiTagPreparing" |
  "onOpened" |
  "onOptionChanged" |
  "onSelectAllValueChanged" |
  "onSelectionChanged" |
  "onSelectionChanging" |
  "onValueChanged" |
  "opened" |
  "openOnFieldClick" |
  "placeholder" |
  "readOnly" |
  "rtlEnabled" |
  "searchEnabled" |
  "searchExpr" |
  "searchMode" |
  "searchTimeout" |
  "selectAllMode" |
  "selectAllText" |
  "selectedItems" |
  "showClearButton" |
  "showDataBeforeSearch" |
  "showDropDownButton" |
  "showMultiTagOnly" |
  "showSelectionControls" |
  "stylingMode" |
  "tabIndex" |
  "tagTemplate" |
  "text" |
  "useItemTextAsTitle" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "valueChangeEvent" |
  "valueExpr" |
  "visible" |
  "width" |
  "wrapItemText"
>;

interface DxTagBox extends AccessibleOptions {
  readonly instance?: TagBox;
}

const componentConfig = {
  props: {
    acceptCustomValue: Boolean,
    accessKey: String,
    activeStateEnabled: Boolean,
    applyValueMode: {},
    buttons: Array,
    customItemCreateEvent: String,
    dataSource: {},
    deferRendering: Boolean,
    disabled: Boolean,
    displayExpr: [Function, String],
    dropDownButtonTemplate: {},
    dropDownOptions: Object,
    elementAttr: Object,
    fieldTemplate: {},
    focusStateEnabled: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String],
    hideSelectedItems: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    items: Array,
    itemTemplate: {},
    label: String,
    labelMode: {},
    maxDisplayedTags: Number,
    maxFilterQueryLength: Number,
    maxLength: [Number, String],
    minSearchLength: Number,
    multiline: Boolean,
    name: String,
    noDataText: String,
    onChange: Function,
    onClosed: Function,
    onContentReady: Function,
    onCustomItemCreating: Function,
    onDisposing: Function,
    onEnterKey: Function,
    onFocusIn: Function,
    onFocusOut: Function,
    onInitialized: Function,
    onInput: Function,
    onItemClick: Function,
    onKeyDown: Function,
    onKeyUp: Function,
    onMultiTagPreparing: Function,
    onOpened: Function,
    onOptionChanged: Function,
    onSelectAllValueChanged: Function,
    onSelectionChanged: Function,
    onSelectionChanging: Function,
    onValueChanged: Function,
    opened: Boolean,
    openOnFieldClick: Boolean,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String],
    searchMode: {},
    searchTimeout: Number,
    selectAllMode: {},
    selectAllText: String,
    selectedItems: Array,
    showClearButton: Boolean,
    showDataBeforeSearch: Boolean,
    showDropDownButton: Boolean,
    showMultiTagOnly: Boolean,
    showSelectionControls: Boolean,
    stylingMode: {},
    tabIndex: Number,
    tagTemplate: {},
    text: String,
    useItemTextAsTitle: Boolean,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: {},
    validationMessagePosition: {},
    validationStatus: {},
    value: Array,
    valueChangeEvent: String,
    valueExpr: [Function, String],
    visible: Boolean,
    width: [Function, Number, String],
    wrapItemText: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:acceptCustomValue": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:applyValueMode": null,
    "update:buttons": null,
    "update:customItemCreateEvent": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:displayExpr": null,
    "update:dropDownButtonTemplate": null,
    "update:dropDownOptions": null,
    "update:elementAttr": null,
    "update:fieldTemplate": null,
    "update:focusStateEnabled": null,
    "update:grouped": null,
    "update:groupTemplate": null,
    "update:height": null,
    "update:hideSelectedItems": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:label": null,
    "update:labelMode": null,
    "update:maxDisplayedTags": null,
    "update:maxFilterQueryLength": null,
    "update:maxLength": null,
    "update:minSearchLength": null,
    "update:multiline": null,
    "update:name": null,
    "update:noDataText": null,
    "update:onChange": null,
    "update:onClosed": null,
    "update:onContentReady": null,
    "update:onCustomItemCreating": null,
    "update:onDisposing": null,
    "update:onEnterKey": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onInput": null,
    "update:onItemClick": null,
    "update:onKeyDown": null,
    "update:onKeyUp": null,
    "update:onMultiTagPreparing": null,
    "update:onOpened": null,
    "update:onOptionChanged": null,
    "update:onSelectAllValueChanged": null,
    "update:onSelectionChanged": null,
    "update:onSelectionChanging": null,
    "update:onValueChanged": null,
    "update:opened": null,
    "update:openOnFieldClick": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:searchEnabled": null,
    "update:searchExpr": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:selectAllMode": null,
    "update:selectAllText": null,
    "update:selectedItems": null,
    "update:showClearButton": null,
    "update:showDataBeforeSearch": null,
    "update:showDropDownButton": null,
    "update:showMultiTagOnly": null,
    "update:showSelectionControls": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:tagTemplate": null,
    "update:text": null,
    "update:useItemTextAsTitle": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeEvent": null,
    "update:valueExpr": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapItemText": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): TagBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TagBox;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      button: { isCollectionItem: true, optionName: "buttons" },
      dropDownOptions: { isCollectionItem: false, optionName: "dropDownOptions" },
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxTagBox = defineComponent(componentConfig);


const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: [Object, Number, String],
    show: [Object, Number, String]
  }
};

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};

const DxAtConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: {},
    y: {}
  }
};

prepareConfigurationComponentConfig(DxAtConfig);

const DxAt = defineComponent(DxAtConfig);

(DxAt as any).$_optionName = "at";

const DxBoundaryOffsetConfig = {
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

prepareConfigurationComponentConfig(DxBoundaryOffsetConfig);

const DxBoundaryOffset = defineComponent(DxBoundaryOffsetConfig);

(DxBoundaryOffset as any).$_optionName = "boundaryOffset";

const DxButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: {},
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

const DxCollisionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: {},
    y: {}
  }
};

prepareConfigurationComponentConfig(DxCollisionConfig);

const DxCollision = defineComponent(DxCollisionConfig);

(DxCollision as any).$_optionName = "collision";

const DxDropDownOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
    "update:enableBodyScroll": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onHidden": null,
    "update:onHiding": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:onTitleRendered": null,
    "update:position": null,
    "update:resizeEnabled": null,
    "update:restorePosition": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showTitle": null,
    "update:tabIndex": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    accessKey: String,
    animation: Object,
    bindingOptions: Object,
    closeOnOutsideClick: [Boolean, Function],
    container: {},
    contentTemplate: {},
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Function, Number, String],
    hideOnOutsideClick: [Boolean, Function],
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String],
    maxWidth: [Function, Number, String],
    minHeight: [Function, Number, String],
    minWidth: [Function, Number, String],
    onContentReady: Function,
    onDisposing: Function,
    onHidden: Function,
    onHiding: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onResize: Function,
    onResizeEnd: Function,
    onResizeStart: Function,
    onShowing: Function,
    onShown: Function,
    onTitleRendered: Function,
    position: {},
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabIndex: Number,
    title: String,
    titleTemplate: {},
    toolbarItems: Array,
    visible: Boolean,
    width: [Function, Number, String],
    wrapperAttr: {}
  }
};

prepareConfigurationComponentConfig(DxDropDownOptionsConfig);

const DxDropDownOptions = defineComponent(DxDropDownOptionsConfig);

(DxDropDownOptions as any).$_optionName = "dropDownOptions";
(DxDropDownOptions as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  position: { isCollectionItem: false, optionName: "position" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
};

const DxFromConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxFromConfig);

const DxFrom = defineComponent(DxFromConfig);

(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};

const DxHideConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function,
    delay: Number,
    direction: {},
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: {}
  }
};

prepareConfigurationComponentConfig(DxHideConfig);

const DxHide = defineComponent(DxHideConfig);

(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:html": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    html: String,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

const DxMyConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: {},
    y: {}
  }
};

prepareConfigurationComponentConfig(DxMyConfig);

const DxMy = defineComponent(DxMyConfig);

(DxMy as any).$_optionName = "my";

const DxOffsetConfig = {
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

prepareConfigurationComponentConfig(DxOffsetConfig);

const DxOffset = defineComponent(DxOffsetConfig);

(DxOffset as any).$_optionName = "offset";

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
    stylingMode: {},
    tabIndex: Number,
    template: {},
    text: String,
    type: {},
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String]
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

const DxPositionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:at": null,
    "update:boundary": null,
    "update:boundaryOffset": null,
    "update:collision": null,
    "update:my": null,
    "update:of": null,
    "update:offset": null,
  },
  props: {
    at: {},
    boundary: {},
    boundaryOffset: [Object, String],
    collision: {},
    my: {},
    of: {},
    offset: [Object, String]
  }
};

prepareConfigurationComponentConfig(DxPositionConfig);

const DxPosition = defineComponent(DxPositionConfig);

(DxPosition as any).$_optionName = "position";

const DxShowConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function,
    delay: Number,
    direction: {},
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: {}
  }
};

prepareConfigurationComponentConfig(DxShowConfig);

const DxShow = defineComponent(DxShowConfig);

(DxShow as any).$_optionName = "show";

const DxToConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxToConfig);

const DxTo = defineComponent(DxToConfig);

(DxTo as any).$_optionName = "to";

const DxToolbarItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:toolbar": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: {},
    location: {},
    menuItemTemplate: {},
    options: {},
    showText: {},
    template: {},
    text: String,
    toolbar: {},
    visible: Boolean,
    widget: {}
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

export default DxTagBox;
export {
  DxTagBox,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxButton,
  DxCollision,
  DxDropDownOptions,
  DxFrom,
  DxHide,
  DxItem,
  DxMy,
  DxOffset,
  DxOptions,
  DxPosition,
  DxShow,
  DxTo,
  DxToolbarItem
};
import type * as DxTagBoxTypes from "devextreme/ui/tag_box_types";
export { DxTagBoxTypes };
