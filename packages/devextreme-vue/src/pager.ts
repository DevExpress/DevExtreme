import Pager, { Properties } from "devextreme/ui/pager";
import { createComponent } from "./core/index";

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
  "label" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "rtlEnabled" |
  "showInfo" |
  "showNavigationButtons" |
  "showPageSizeSelector" |
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
    allowedPageSizes: [Array, String],
    disabled: Boolean,
    displayMode: String,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    infoText: String,
    label: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
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
    "update:label": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:showInfo": null,
    "update:showNavigationButtons": null,
    "update:showPageSizeSelector": null,
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
