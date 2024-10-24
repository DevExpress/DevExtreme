import Rating, { Properties } from "devextreme/ui/rating";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isDirty" |
  "isValid" |
  "itemCount" |
  "label" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "precision" |
  "readOnly" |
  "rtlEnabled" |
  "selectionMode" |
  "tabIndex" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "visible" |
  "width"
>;

interface DxRating extends AccessibleOptions {
  readonly instance?: Rating;
}
const DxRating = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    itemCount: Number,
    label: Object,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    precision: Number,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    selectionMode: String,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: Number,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:itemCount": null,
    "update:label": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:precision": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:selectionMode": null,
    "update:tabIndex": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): Rating {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Rating;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      label: { isCollectionItem: false, optionName: "label" }
    };
  }
});

const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:format": null,
  },
  props: {
    enabled: Boolean,
    format: [Function, String]
  }
});
(DxLabel as any).$_optionName = "label";

export default DxRating;
export {
  DxRating,
  DxLabel
};
import type * as DxRatingTypes from "devextreme/ui/rating_types";
export { DxRatingTypes };
