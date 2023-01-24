import RadioButton, { Properties } from "../../jquery/lib/esm/radio-button";
import { createComponent } from "devextreme-vue/core/index";

type AccessibleOptions = Pick<Properties,
  "checked" |
  "defaultChecked" |
  "label" |
  "labelTemplate" |
  "name" |
  "onClick" |
  "onSelected" |
  "radioTemplate"
>;

interface DxRadioButton extends AccessibleOptions {
  readonly instance?: RadioButton;
}
const DxRadioButton = createComponent({
  props: {
    checked: Boolean,
    defaultChecked: Boolean,
    label: String,
    labelTemplate: Function,
    name: {},
    onClick: Function,
    onSelected: Function,
    radioTemplate: Function
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:checked": null,
    "update:defaultChecked": null,
    "update:label": null,
    "update:labelTemplate": null,
    "update:name": null,
    "update:onClick": null,
    "update:onSelected": null,
    "update:radioTemplate": null,
  },
  computed: {
    instance(): RadioButton {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = RadioButton;
    (this as any).$_hasAsyncTemplate = true;
  }
});

export default DxRadioButton;
export {
  DxRadioButton
};
