import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import LoadIndicator, { Properties } from "devextreme/ui/load_indicator";
import {
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
} from "devextreme/ui/load_indicator";

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
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    indicatorSrc: String,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
