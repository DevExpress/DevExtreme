export { ExplicitTypes } from "devextreme/ui/validation_summary";
import { PropType } from "vue";
import ValidationSummary, { Properties } from "devextreme/ui/validation_summary";
import {
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 OptionChangedEvent,
} from "devextreme/ui/validation_summary";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
  props: {
    elementAttr: Object,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<any>>,
    itemTemplate: {},
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onItemClick: Function as PropType<(e: ItemClickEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
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
};

prepareComponentConfig(componentConfig);

const DxValidationSummary = defineComponent(componentConfig);


const DxItemConfig = {
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
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxValidationSummary;
export {
  DxValidationSummary,
  DxItem
};
import type * as DxValidationSummaryTypes from "devextreme/ui/validation_summary_types";
export { DxValidationSummaryTypes };
