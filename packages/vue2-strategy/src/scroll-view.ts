import ScrollView, { Properties } from "devextreme/ui/scroll_view";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "bounceEnabled" |
  "direction" |
  "disabled" |
  "elementAttr" |
  "height" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onPullDown" |
  "onReachBottom" |
  "onScroll" |
  "onUpdated" |
  "pulledDownText" |
  "pullingDownText" |
  "reachBottomText" |
  "refreshingText" |
  "rtlEnabled" |
  "scrollByContent" |
  "scrollByThumb" |
  "showScrollbar" |
  "useNative" |
  "width"
>;

interface DxScrollView extends AccessibleOptions {
  readonly instance?: ScrollView;
}
const DxScrollView = createComponent({
  props: {
    bounceEnabled: Boolean,
    direction: String,
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onPullDown: Function,
    onReachBottom: Function,
    onScroll: Function,
    onUpdated: Function,
    pulledDownText: String,
    pullingDownText: String,
    reachBottomText: String,
    refreshingText: String,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    showScrollbar: String,
    useNative: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:bounceEnabled": null,
    "update:direction": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onPullDown": null,
    "update:onReachBottom": null,
    "update:onScroll": null,
    "update:onUpdated": null,
    "update:pulledDownText": null,
    "update:pullingDownText": null,
    "update:reachBottomText": null,
    "update:refreshingText": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollByThumb": null,
    "update:showScrollbar": null,
    "update:useNative": null,
    "update:width": null,
  },
  computed: {
    instance(): ScrollView {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ScrollView;
  }
});

export default DxScrollView;
export {
  DxScrollView
};
import type * as DxScrollViewTypes from "devextreme/ui/scroll_view_types";
export { DxScrollViewTypes };
