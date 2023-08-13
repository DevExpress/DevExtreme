import Validator, { Properties } from "devextreme/ui/validator";
import { createExtensionComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "adapter" |
  "elementAttr" |
  "height" |
  "name" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValidated" |
  "validationGroup" |
  "validationRules" |
  "width"
>;

interface DxValidator extends AccessibleOptions {
  readonly instance?: Validator;
}
const DxValidator = createExtensionComponent({
  props: {
    adapter: Object,
    elementAttr: Object,
    height: [Function, Number, String],
    name: String,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValidated: Function,
    validationGroup: String,
    validationRules: Array,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:adapter": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:name": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValidated": null,
    "update:validationGroup": null,
    "update:validationRules": null,
    "update:width": null,
  },
  computed: {
    instance(): Validator {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Validator;
    (this as any).$_expectedChildren = {
      adapter: { isCollectionItem: false, optionName: "adapter" },
      AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
      CompareRule: { isCollectionItem: true, optionName: "validationRules" },
      CustomRule: { isCollectionItem: true, optionName: "validationRules" },
      EmailRule: { isCollectionItem: true, optionName: "validationRules" },
      NumericRule: { isCollectionItem: true, optionName: "validationRules" },
      PatternRule: { isCollectionItem: true, optionName: "validationRules" },
      RangeRule: { isCollectionItem: true, optionName: "validationRules" },
      RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
      StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
      validationRule: { isCollectionItem: true, optionName: "validationRules" }
    };
  }
});

const DxAdapter = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:applyValidationResults": null,
    "update:bypass": null,
    "update:focus": null,
    "update:getValue": null,
    "update:reset": null,
    "update:validationRequestsCallbacks": null,
  },
  props: {
    applyValidationResults: Function,
    bypass: Function,
    focus: Function,
    getValue: Function,
    reset: Function,
    validationRequestsCallbacks: Array
  }
});
(DxAdapter as any).$_optionName = "adapter";
const DxAsyncRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};
const DxCompareRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    comparisonTarget: Function,
    comparisonType: String,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};
const DxCustomRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};
const DxEmailRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};
const DxNumericRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};
const DxPatternRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:pattern": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    pattern: {},
    type: String
  }
});
(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};
const DxRangeRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:reevaluate": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: {},
    message: String,
    min: {},
    reevaluate: Boolean,
    type: String
  }
});
(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};
const DxRequiredRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:message": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    message: String,
    trim: Boolean,
    type: String
  }
});
(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};
const DxStringLengthRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: Number,
    message: String,
    min: Number,
    trim: Boolean,
    type: String
  }
});
(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};
const DxValidationRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:pattern": null,
    "update:reevaluate": null,
    "update:trim": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    comparisonTarget: Function,
    comparisonType: String,
    ignoreEmptyValue: Boolean,
    max: {},
    message: String,
    min: {},
    pattern: {},
    reevaluate: Boolean,
    trim: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxValidationRule as any).$_optionName = "validationRules";
(DxValidationRule as any).$_isCollectionItem = true;
(DxValidationRule as any).$_predefinedProps = {
  type: "required"
};

export default DxValidator;
export {
  DxValidator,
  DxAdapter,
  DxAsyncRule,
  DxCompareRule,
  DxCustomRule,
  DxEmailRule,
  DxNumericRule,
  DxPatternRule,
  DxRangeRule,
  DxRequiredRule,
  DxStringLengthRule,
  DxValidationRule
};
import type * as DxValidatorTypes from "devextreme/ui/validator_types";
export { DxValidatorTypes };
