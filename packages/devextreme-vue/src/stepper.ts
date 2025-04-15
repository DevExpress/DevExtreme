export { ExplicitTypes } from "devextreme/ui/stepper";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Stepper, { Properties } from "devextreme/ui/stepper";
import  DataSource from "devextreme/data/data_source";
import {
 dxStepperItem,
 DisposingEvent,
 InitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemRenderedEvent,
 OptionChangedEvent,
 SelectionChangedEvent,
 SelectionChangingEvent,
} from "devextreme/ui/stepper";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 Orientation,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "itemTemplate" |
  "linear" |
  "onDisposing" |
  "onInitialized" |
  "onItemClick" |
  "onItemContextMenu" |
  "onItemRendered" |
  "onOptionChanged" |
  "onSelectionChanged" |
  "onSelectionChanging" |
  "orientation" |
  "rtlEnabled" |
  "selectedIndex" |
  "selectedItem" |
  "selectOnFocus" |
  "tabIndex" |
  "visible" |
  "width"
>;

interface DxStepper extends AccessibleOptions {
  readonly instance?: Stepper;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    dataSource: [Array, Object, String] as PropType<Array<dxStepperItem> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<dxStepperItem>>,
    itemTemplate: {},
    linear: Boolean,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onSelectionChanging: Function as PropType<((e: SelectionChangingEvent) => void)>,
    orientation: String as PropType<Orientation>,
    rtlEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    selectOnFocus: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:dataSource": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:linear": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onSelectionChanging": null,
    "update:orientation": null,
    "update:rtlEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:selectOnFocus": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Stepper {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Stepper;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxStepper = defineComponent(componentConfig);


const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:hint": null,
    "update:icon": null,
    "update:isValid": null,
    "update:label": null,
    "update:optional": null,
    "update:template": null,
    "update:text": null,
  },
  props: {
    disabled: Boolean,
    hint: String,
    icon: String,
    isValid: Boolean,
    label: String,
    optional: Boolean,
    template: {},
    text: String
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

export default DxStepper;
export {
  DxStepper,
  DxItem
};
import type * as DxStepperTypes from "devextreme/ui/stepper_types";
export { DxStepperTypes };
