import ValidationGroup, { Properties } from "devextreme/ui/validation_group";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "elementAttr" |
  "height" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "width"
>;

interface DxValidationGroup extends AccessibleOptions {
  readonly instance?: ValidationGroup;
}
const DxValidationGroup = createComponent({
  props: {
    elementAttr: Object,
    height: [Function, Number, String],
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:width": null,
  },
  computed: {
    instance(): ValidationGroup {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ValidationGroup;
    (this as any).$_hasAsyncTemplate = true;
  }
});

export default DxValidationGroup;
export {
  DxValidationGroup
};
import type * as DxValidationGroupTypes from "devextreme/ui/validation_group_types";
export { DxValidationGroupTypes };
