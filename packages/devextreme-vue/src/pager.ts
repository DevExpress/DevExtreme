import Pager, { Properties } from "devextreme/ui/pager";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowedPageSizes" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "itemCount" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "pageIndex" |
  "pageSize" |
  "rtlEnabled" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxPager extends AccessibleOptions {
  readonly instance?: Pager;
}
const DxPager = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowedPageSizes: Array,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    itemCount: Number,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    pageIndex: Number,
    pageSize: Number,
    rtlEnabled: Boolean,
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
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemCount": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:pageIndex": null,
    "update:pageSize": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Pager {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Pager;
    (this as any).$_hasAsyncTemplate = true;
  }
});

export default DxPager;
export {
  DxPager
};
import type * as DxPagerTypes from "devextreme/ui/pager_types";
export { DxPagerTypes };
