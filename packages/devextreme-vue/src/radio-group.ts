import RadioGroup, { Properties } from "devextreme/ui/radio_group";
import { defineComponent } from "vue";
import { prepareComponentConfig, prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "dataSource" |
  "disabled" |
  "displayExpr" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isDirty" |
  "isValid" |
  "items" |
  "itemTemplate" |
  "layout" |
  "name" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "tabIndex" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "valueExpr" |
  "visible" |
  "width"
>;

interface DxRadioGroup extends AccessibleOptions {
  readonly instance?: RadioGroup;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    dataSource: {},
    disabled: Boolean,
    displayExpr: [Function, String],
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    items: Array,
    itemTemplate: {},
    layout: String,
    name: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    tabIndex: Number,
    validationError: {},
    validationErrors: Array,
    validationMessageMode: String,
    validationMessagePosition: String,
    validationStatus: String,
    value: {},
    valueExpr: [Function, String],
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:displayExpr": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:layout": null,
    "update:name": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueExpr": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): RadioGroup {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = RadioGroup;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxRadioGroup = defineComponent(componentConfig);


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


export default DxRadioGroup;
export {
  DxRadioGroup,
  DxItem
};
import type * as DxRadioGroupTypes from "devextreme/ui/radio_group_types";
export { DxRadioGroupTypes };
