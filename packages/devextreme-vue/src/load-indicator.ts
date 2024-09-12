import LoadIndicator, { Properties } from "devextreme/ui/load_indicator";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "elementAttr" |
  "height" |
  "hint" |
  "indicatorSrc" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "rtlEnabled" |
  "visible" |
  "width"
>;

interface DxLoadIndicator extends AccessibleOptions {
  readonly instance?: LoadIndicator;
}

const componentConfig = {
  props: {
    elementAttr: Object,
    height: [Function, Number, String],
    hint: String,
    indicatorSrc: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hint": null,
    "update:indicatorSrc": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): LoadIndicator {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = LoadIndicator;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxLoadIndicator = defineComponent(componentConfig);

export default DxLoadIndicator;
export {
  DxLoadIndicator
};
import type * as DxLoadIndicatorTypes from "devextreme/ui/load_indicator_types";
export { DxLoadIndicatorTypes };
