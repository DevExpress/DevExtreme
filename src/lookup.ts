import Lookup, { Properties } from "devextreme/ui/lookup";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "applyButtonText" |
  "applyValueMode" |
  "cancelButtonText" |
  "cleanSearchOnOpening" |
  "clearButtonText" |
  "dataSource" |
  "deferRendering" |
  "disabled" |
  "displayExpr" |
  "displayValue" |
  "dropDownCentered" |
  "dropDownOptions" |
  "elementAttr" |
  "fieldTemplate" |
  "focusStateEnabled" |
  "fullScreen" |
  "grouped" |
  "groupTemplate" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "isValid" |
  "items" |
  "itemTemplate" |
  "label" |
  "labelMode" |
  "minSearchLength" |
  "name" |
  "nextButtonText" |
  "noDataText" |
  "onClosed" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onOpened" |
  "onOptionChanged" |
  "onPageLoading" |
  "onPullRefresh" |
  "onScroll" |
  "onSelectionChanged" |
  "onValueChanged" |
  "opened" |
  "pageLoadingText" |
  "pageLoadMode" |
  "placeholder" |
  "pulledDownText" |
  "pullingDownText" |
  "pullRefreshEnabled" |
  "refreshingText" |
  "rtlEnabled" |
  "searchEnabled" |
  "searchExpr" |
  "searchMode" |
  "searchPlaceholder" |
  "searchStartEvent" |
  "searchTimeout" |
  "selectedItem" |
  "showCancelButton" |
  "showClearButton" |
  "showDataBeforeSearch" |
  "stylingMode" |
  "tabIndex" |
  "text" |
  "useItemTextAsTitle" |
  "useNativeScrolling" |
  "usePopover" |
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

interface DxLookup extends AccessibleOptions {
  readonly instance?: Lookup;
}
const DxLookup = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    applyButtonText: String,
    applyValueMode: String,
    cancelButtonText: String,
    cleanSearchOnOpening: Boolean,
    clearButtonText: String,
    dataSource: {},
    deferRendering: Boolean,
    disabled: Boolean,
    displayExpr: [Function, String],
    displayValue: String,
    dropDownCentered: Boolean,
    dropDownOptions: Object,
    elementAttr: Object,
    fieldTemplate: {},
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    grouped: Boolean,
    groupTemplate: {},
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isValid: Boolean,
    items: Array,
    itemTemplate: {},
    label: String,
    labelMode: String,
    minSearchLength: Number,
    name: String,
    nextButtonText: String,
    noDataText: String,
    onClosed: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onOpened: Function,
    onOptionChanged: Function,
    onPageLoading: Function,
    onPullRefresh: Function,
    onScroll: Function,
    onSelectionChanged: Function,
    onValueChanged: Function,
    opened: Boolean,
    pageLoadingText: String,
    pageLoadMode: String,
    placeholder: String,
    pulledDownText: String,
    pullingDownText: String,
    pullRefreshEnabled: Boolean,
    refreshingText: String,
    rtlEnabled: Boolean,
    searchEnabled: Boolean,
    searchExpr: [Array, Function, String],
    searchMode: String,
    searchPlaceholder: String,
    searchStartEvent: String,
    searchTimeout: Number,
    selectedItem: {},
    showCancelButton: Boolean,
    showClearButton: Boolean,
    showDataBeforeSearch: Boolean,
    stylingMode: String,
    tabIndex: Number,
    text: String,
    useItemTextAsTitle: Boolean,
    useNativeScrolling: Boolean,
    usePopover: Boolean,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: {},
    valueChangeEvent: String,
    valueExpr: [Function, String],
    visible: Boolean,
    width: [Function, Number, String],
    wrapItemText: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:applyButtonText": null,
    "update:applyValueMode": null,
    "update:cancelButtonText": null,
    "update:cleanSearchOnOpening": null,
    "update:clearButtonText": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:displayExpr": null,
    "update:displayValue": null,
    "update:dropDownCentered": null,
    "update:dropDownOptions": null,
    "update:elementAttr": null,
    "update:fieldTemplate": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:grouped": null,
    "update:groupTemplate": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isValid": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:label": null,
    "update:labelMode": null,
    "update:minSearchLength": null,
    "update:name": null,
    "update:nextButtonText": null,
    "update:noDataText": null,
    "update:onClosed": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onOpened": null,
    "update:onOptionChanged": null,
    "update:onPageLoading": null,
    "update:onPullRefresh": null,
    "update:onScroll": null,
    "update:onSelectionChanged": null,
    "update:onValueChanged": null,
    "update:opened": null,
    "update:pageLoadingText": null,
    "update:pageLoadMode": null,
    "update:placeholder": null,
    "update:pulledDownText": null,
    "update:pullingDownText": null,
    "update:pullRefreshEnabled": null,
    "update:refreshingText": null,
    "update:rtlEnabled": null,
    "update:searchEnabled": null,
    "update:searchExpr": null,
    "update:searchMode": null,
    "update:searchPlaceholder": null,
    "update:searchStartEvent": null,
    "update:searchTimeout": null,
    "update:selectedItem": null,
    "update:showCancelButton": null,
    "update:showClearButton": null,
    "update:showDataBeforeSearch": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:useItemTextAsTitle": null,
    "update:useNativeScrolling": null,
    "update:usePopover": null,
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
    instance(): Lookup {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Lookup;
    (this as any).$_expectedChildren = {
      dropDownOptions: { isCollectionItem: false, optionName: "dropDownOptions" },
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
});

const DxAnimation = createConfigurationComponent({
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
});
(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};
const DxAt = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String,
    y: String
  }
});
(DxAt as any).$_optionName = "at";
const DxBoundaryOffset = createConfigurationComponent({
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
(DxBoundaryOffset as any).$_optionName = "boundaryOffset";
const DxCollision = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String,
    y: String
  }
});
(DxCollision as any).$_optionName = "collision";
const DxDropDownOptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:copyRootClassesToWrapper": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:enableBodyScroll": null,
    "update:height": null,
    "update:hideEvent": null,
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
    "update:onShowing": null,
    "update:onShown": null,
    "update:onTitleRendered": null,
    "update:position": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showEvent": null,
    "update:showTitle": null,
    "update:target": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    animation: Object,
    bindingOptions: Object,
    closeOnOutsideClick: [Boolean, Function],
    container: {},
    contentTemplate: {},
    copyRootClassesToWrapper: Boolean,
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: {},
    enableBodyScroll: Boolean,
    height: [Function, Number, String],
    hideEvent: [Object, String],
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
    onShowing: Function,
    onShown: Function,
    onTitleRendered: Function,
    position: [Object, String],
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showEvent: [Object, String],
    showTitle: Boolean,
    target: {},
    title: String,
    titleTemplate: {},
    toolbarItems: Array,
    visible: Boolean,
    width: [Function, Number, String],
    wrapperAttr: {}
  }
});
(DxDropDownOptions as any).$_optionName = "dropDownOptions";
(DxDropDownOptions as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  hideEvent: { isCollectionItem: false, optionName: "hideEvent" },
  position: { isCollectionItem: false, optionName: "position" },
  showEvent: { isCollectionItem: false, optionName: "showEvent" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
};
const DxFrom = createConfigurationComponent({
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
});
(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};
const DxHide = createConfigurationComponent({
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
    direction: String,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: String
  }
});
(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};
const DxHideEvent = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: Number,
    name: String
  }
});
(DxHideEvent as any).$_optionName = "hideEvent";
const DxItem = createConfigurationComponent({
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
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxMy = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String,
    y: String
  }
});
(DxMy as any).$_optionName = "my";
const DxOffset = createConfigurationComponent({
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
(DxOffset as any).$_optionName = "offset";
const DxPosition = createConfigurationComponent({
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
    at: [Object, String],
    boundary: {},
    boundaryOffset: [Object, String],
    collision: [Object, String],
    my: [Object, String],
    of: {},
    offset: [Object, String]
  }
});
(DxPosition as any).$_optionName = "position";
const DxShow = createConfigurationComponent({
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
    direction: String,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: String
  }
});
(DxShow as any).$_optionName = "show";
const DxShowEvent = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:delay": null,
    "update:name": null,
  },
  props: {
    delay: Number,
    name: String
  }
});
(DxShowEvent as any).$_optionName = "showEvent";
const DxTo = createConfigurationComponent({
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
});
(DxTo as any).$_optionName = "to";
const DxToolbarItem = createConfigurationComponent({
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
    locateInMenu: String,
    location: String,
    menuItemTemplate: {},
    options: {},
    showText: String,
    template: {},
    text: String,
    toolbar: String,
    visible: Boolean,
    widget: String
  }
});
(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

export default DxLookup;
export {
  DxLookup,
  DxAnimation,
  DxAt,
  DxBoundaryOffset,
  DxCollision,
  DxDropDownOptions,
  DxFrom,
  DxHide,
  DxHideEvent,
  DxItem,
  DxMy,
  DxOffset,
  DxPosition,
  DxShow,
  DxShowEvent,
  DxTo,
  DxToolbarItem
};
import type * as DxLookupTypes from "devextreme/ui/lookup_types";
export { DxLookupTypes };
