import Pagination, { Properties } from "devextreme/ui/pagination";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowedPageSizes" |
  "disabled" |
  "displayMode" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "infoText" |
  "itemCount" |
  "label" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "pageIndex" |
  "pageSize" |
  "rtlEnabled" |
  "showInfo" |
  "showNavigationButtons" |
  "showPageSizeSelector" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxPagination extends AccessibleOptions {
  readonly instance?: Pagination;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowedPageSizes: Array,
    disabled: Boolean,
    displayMode: String,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    infoText: String,
    itemCount: Number,
    label: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    pageIndex: Number,
    pageSize: Number,
    rtlEnabled: Boolean,
    showInfo: Boolean,
    showNavigationButtons: Boolean,
    showPageSizeSelector: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowedPageSizes": null,
    "update:disabled": null,
    "update:displayMode": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:infoText": null,
    "update:itemCount": null,
    "update:label": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:pageIndex": null,
    "update:pageSize": null,
    "update:rtlEnabled": null,
    "update:showInfo": null,
    "update:showNavigationButtons": null,
    "update:showPageSizeSelector": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Pagination {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Pagination;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxPagination = defineComponent(componentConfig);

export default DxPagination;
export {
  DxPagination
};
import type * as DxPaginationTypes from "devextreme/ui/pagination_types";
export { DxPaginationTypes };
