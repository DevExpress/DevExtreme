import Validator, { Properties } from "devextreme/ui/validator";
import { defineComponent } from "vue";
import { prepareExtensionComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

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

const componentConfig = {
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
    (this as any).$_hasAsyncTemplate = true;
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
};

prepareExtensionComponentConfig(componentConfig);

const DxValidator = defineComponent(componentConfig);


const DxAdapterConfig = {
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
};

prepareConfigurationComponentConfig(DxAdapterConfig);

const DxAdapter = defineComponent(DxAdapterConfig);

(DxAdapter as any).$_optionName = "adapter";

const DxAsyncRuleConfig = {
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
    type: {},
    validationCallback: Function
  }
};

prepareConfigurationComponentConfig(DxAsyncRuleConfig);

const DxAsyncRule = defineComponent(DxAsyncRuleConfig);

(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};

const DxCompareRuleConfig = {
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
    comparisonType: {},
    ignoreEmptyValue: Boolean,
    message: String,
    type: {}
  }
};

prepareConfigurationComponentConfig(DxCompareRuleConfig);

const DxCompareRule = defineComponent(DxCompareRuleConfig);

(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};

const DxCustomRuleConfig = {
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
    type: {},
    validationCallback: Function
  }
};

prepareConfigurationComponentConfig(DxCustomRuleConfig);

const DxCustomRule = defineComponent(DxCustomRuleConfig);

(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};

const DxEmailRuleConfig = {
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
    type: {}
  }
};

prepareConfigurationComponentConfig(DxEmailRuleConfig);

const DxEmailRule = defineComponent(DxEmailRuleConfig);

(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};

const DxNumericRuleConfig = {
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
    type: {}
  }
};

prepareConfigurationComponentConfig(DxNumericRuleConfig);

const DxNumericRule = defineComponent(DxNumericRuleConfig);

(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};

const DxPatternRuleConfig = {
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
    pattern: [RegExp, String],
    type: {}
  }
};

prepareConfigurationComponentConfig(DxPatternRuleConfig);

const DxPatternRule = defineComponent(DxPatternRuleConfig);

(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};

const DxRangeRuleConfig = {
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
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    reevaluate: Boolean,
    type: {}
  }
};

prepareConfigurationComponentConfig(DxRangeRuleConfig);

const DxRangeRule = defineComponent(DxRangeRuleConfig);

(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};

const DxRequiredRuleConfig = {
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
    type: {}
  }
};

prepareConfigurationComponentConfig(DxRequiredRuleConfig);

const DxRequiredRule = defineComponent(DxRequiredRuleConfig);

(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};

const DxStringLengthRuleConfig = {
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
    type: {}
  }
};

prepareConfigurationComponentConfig(DxStringLengthRuleConfig);

const DxStringLengthRule = defineComponent(DxStringLengthRuleConfig);

(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};

const DxValidationRuleConfig = {
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
    comparisonType: {},
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    pattern: [RegExp, String],
    reevaluate: Boolean,
    trim: Boolean,
    type: {},
    validationCallback: Function
  }
};

prepareConfigurationComponentConfig(DxValidationRuleConfig);

const DxValidationRule = defineComponent(DxValidationRuleConfig);

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
