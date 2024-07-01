"use client"
import dxValidator, {
    Properties
} from "devextreme/ui/validator";

import * as PropTypes from "prop-types";
import { ExtensionComponent as BaseComponent } from "./core/extension-component";
import { IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

type IValidatorOptions = React.PropsWithChildren<Properties & IHtmlOptions>

class Validator extends BaseComponent<React.PropsWithChildren<IValidatorOptions>> {

  public get instance(): dxValidator {
    return this._instance;
  }

  protected _WidgetClass = dxValidator;

  protected independentEvents = ["onDisposing","onInitialized","onValidated"];

  protected _expectedChildren = {
    adapter: { optionName: "adapter", isCollectionItem: false },
    AsyncRule: { optionName: "validationRules", isCollectionItem: true },
    CompareRule: { optionName: "validationRules", isCollectionItem: true },
    CustomRule: { optionName: "validationRules", isCollectionItem: true },
    EmailRule: { optionName: "validationRules", isCollectionItem: true },
    NumericRule: { optionName: "validationRules", isCollectionItem: true },
    PatternRule: { optionName: "validationRules", isCollectionItem: true },
    RangeRule: { optionName: "validationRules", isCollectionItem: true },
    RequiredRule: { optionName: "validationRules", isCollectionItem: true },
    StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
    validationRule: { optionName: "validationRules", isCollectionItem: true }
  };
}
(Validator as any).propTypes = {
  adapter: PropTypes.object,
  elementAttr: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  name: PropTypes.string,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValidated: PropTypes.func,
  validationGroup: PropTypes.string,
  validationRules: PropTypes.array,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Validator
type IAdapterProps = React.PropsWithChildren<{
  applyValidationResults?: (() => void);
  bypass?: (() => void);
  focus?: (() => void);
  getValue?: (() => void);
  reset?: (() => void);
  validationRequestsCallbacks?: Array<(() => void)>;
}>
class Adapter extends NestedOption<IAdapterProps> {
  public static OptionName = "adapter";
}

// owners:
// Validator
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
class AsyncRule extends NestedOption<IAsyncRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "async"
  };
}

// owners:
// Validator
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class CompareRule extends NestedOption<ICompareRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "compare"
  };
}

// owners:
// Validator
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
class CustomRule extends NestedOption<ICustomRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "custom"
  };
}

// owners:
// Validator
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class EmailRule extends NestedOption<IEmailRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "email"
  };
}

// owners:
// Validator
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class NumericRule extends NestedOption<INumericRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "numeric"
  };
}

// owners:
// Validator
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class PatternRule extends NestedOption<IPatternRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "pattern"
  };
}

// owners:
// Validator
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RangeRule extends NestedOption<IRangeRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "range"
  };
}

// owners:
// Validator
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RequiredRule extends NestedOption<IRequiredRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

// owners:
// Validator
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class StringLengthRule extends NestedOption<IStringLengthRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "stringLength"
  };
}

// owners:
// Validator
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  pattern?: RegExp | string;
}>
class ValidationRule extends NestedOption<IValidationRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

export default Validator;
export {
  Validator,
  IValidatorOptions,
  Adapter,
  IAdapterProps,
  AsyncRule,
  IAsyncRuleProps,
  CompareRule,
  ICompareRuleProps,
  CustomRule,
  ICustomRuleProps,
  EmailRule,
  IEmailRuleProps,
  NumericRule,
  INumericRuleProps,
  PatternRule,
  IPatternRuleProps,
  RangeRule,
  IRangeRuleProps,
  RequiredRule,
  IRequiredRuleProps,
  StringLengthRule,
  IStringLengthRuleProps,
  ValidationRule,
  IValidationRuleProps
};
import type * as ValidatorTypes from 'devextreme/ui/validator_types';
export { ValidatorTypes };

