export { ExplicitTypes } from "devextreme/ui/validation_summary";
import ValidationSummary, { Properties } from "devextreme/ui/validation_summary";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "elementAttr" |
  "hoverStateEnabled" |
  "items" |
  "itemTemplate" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onOptionChanged" |
  "validationGroup"
>;

interface DxValidationSummary extends AccessibleOptions {
  readonly instance?: ValidationSummary;
}
const DxValidationSummary = createComponent({
  props: {
    elementAttr: Object,
    hoverStateEnabled: Boolean,
    items: Array,
    itemTemplate: {},
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onOptionChanged: Function,
    validationGroup: String
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:elementAttr": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onOptionChanged": null,
    "update:validationGroup": null,
  },
  computed: {
    instance(): ValidationSummary {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ValidationSummary;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
});

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

export default DxValidationSummary;
export {
  DxValidationSummary,
  DxItem
};
import type * as DxValidationSummaryTypes from "devextreme/ui/validation_summary_types";
export { DxValidationSummaryTypes };
