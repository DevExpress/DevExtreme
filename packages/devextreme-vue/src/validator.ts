import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareExtensionComponentConfig } from "./core/index";
import Validator, { Properties } from "devextreme/ui/validator";
import  DOMComponent from "devextreme/core/dom_component";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 Component,
} from "devextreme/core/component";
import {
 ValidationStatus,
 ValidationRuleType,
 ComparisonOperator,
} from "devextreme/common";
import  * as CommonTypes from "devextreme/common";
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
    adapter: Object as PropType<Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    name: String,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    onValidated: Function as PropType<((validatedInfo: { brokenRule: CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule | CommonTypes.ValidationRule, brokenRules: Array<CommonTypes.ValidationRule>, isValid: boolean, name: string, status: ValidationStatus, validationRules: Array<CommonTypes.ValidationRule>, value: Record<string, any> }) => void)>,
    validationGroup: String,
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
    applyValidationResults: Function as PropType<(() => void)>,
    bypass: Function as PropType<(() => void)>,
    focus: Function as PropType<(() => void)>,
    getValue: Function as PropType<(() => void)>,
    reset: Function as PropType<(() => void)>,
    validationRequestsCallbacks: Array as PropType<Array<(() => void)>>
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
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any)>
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
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
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
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean)>
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
    type: String as PropType<ValidationRuleType>
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
    type: String as PropType<ValidationRuleType>
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
    type: String as PropType<ValidationRuleType>
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
    type: String as PropType<ValidationRuleType>
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
    type: String as PropType<ValidationRuleType>
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
    type: String as PropType<ValidationRuleType>
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
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    pattern: [RegExp, String],
    reevaluate: Boolean,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean)>
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
