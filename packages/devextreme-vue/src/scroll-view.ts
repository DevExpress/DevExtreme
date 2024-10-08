import { PropType } from "vue";
import { defineComponent } from "vue";
import ScrollView, { Properties } from "devextreme/ui/scroll_view";
import { prepareComponentConfig } from "./core/index";
import {
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 PullDownEvent,
 ReachBottomEvent,
 ScrollEvent,
 UpdatedEvent,
} from "devextreme/ui/scroll_view";

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

const componentConfig = {
  props: {
    bounceEnabled: Boolean,
    direction: String as PropType<"both" | "horizontal" | "vertical">,
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onPullDown: Function as PropType<(e: PullDownEvent) => void>,
    onReachBottom: Function as PropType<(e: ReachBottomEvent) => void>,
    onScroll: Function as PropType<(e: ScrollEvent) => void>,
    onUpdated: Function as PropType<(e: UpdatedEvent) => void>,
    pulledDownText: String,
    pullingDownText: String,
    reachBottomText: String,
    refreshingText: String,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    showScrollbar: String as PropType<"onScroll" | "onHover" | "always" | "never">,
    useNative: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxScrollView = defineComponent(componentConfig);

export default DxScrollView;
export {
  DxScrollView
};
import type * as DxScrollViewTypes from "devextreme/ui/scroll_view_types";
export { DxScrollViewTypes };
