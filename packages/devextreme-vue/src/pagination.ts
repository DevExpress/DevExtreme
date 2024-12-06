import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Pagination, { Properties } from "devextreme/ui/pagination";
import  DOMComponent from "devextreme/core/dom_component";
import {
 DisplayMode,
} from "devextreme/common";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 Component,
} from "devextreme/core/component";

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
    allowedPageSizes: Array as PropType<Array<number | string>>,
    disabled: Boolean,
    displayMode: String as PropType<DisplayMode>,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    infoText: String,
    itemCount: Number,
    label: String,
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    pageIndex: Number,
    pageSize: Number,
    rtlEnabled: Boolean,
    showInfo: Boolean,
    showNavigationButtons: Boolean,
    showPageSizeSelector: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
