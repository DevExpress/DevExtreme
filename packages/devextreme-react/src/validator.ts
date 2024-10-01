"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxValidator, {
    Properties
} from "devextreme/ui/validator";

import { ExtensionComponent as BaseComponent } from "./core/extension-component";
import { IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ValidationRuleType, ComparisonOperator } from "devextreme/common";

type IValidatorOptions = React.PropsWithChildren<Properties & IHtmlOptions>

interface ValidatorRef {
  instance: () => dxValidator;
}

const _componentValidator = memo(
  forwardRef(
    (props: React.PropsWithChildren<IValidatorOptions>, ref: ForwardedRef<ValidatorRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onValidated"]), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IValidatorOptions>>, {
          WidgetClass: dxValidator,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IValidatorOptions> & { ref?: Ref<ValidatorRef> }) => ReactElement | null;

const Validator: typeof _componentValidator & { isExtensionComponent: boolean } = Object.assign(_componentValidator, {
  isExtensionComponent: true,
});


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
const _componentAdapter = memo(
  (props: IAdapterProps) => {
    return React.createElement(NestedOption<IAdapterProps>, { ...props });
  }
);

const Adapter: typeof _componentAdapter & IElementDescriptor = Object.assign(_componentAdapter, {
  OptionName: "adapter",
})

// owners:
// Validator
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
const _componentAsyncRule = memo(
  (props: IAsyncRuleProps) => {
    return React.createElement(NestedOption<IAsyncRuleProps>, { ...props });
  }
);

const AsyncRule: typeof _componentAsyncRule & IElementDescriptor = Object.assign(_componentAsyncRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "async"
  },
})

// owners:
// Validator
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentCompareRule = memo(
  (props: ICompareRuleProps) => {
    return React.createElement(NestedOption<ICompareRuleProps>, { ...props });
  }
);

const CompareRule: typeof _componentCompareRule & IElementDescriptor = Object.assign(_componentCompareRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "compare"
  },
})

// owners:
// Validator
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
const _componentCustomRule = memo(
  (props: ICustomRuleProps) => {
    return React.createElement(NestedOption<ICustomRuleProps>, { ...props });
  }
);

const CustomRule: typeof _componentCustomRule & IElementDescriptor = Object.assign(_componentCustomRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "custom"
  },
})

// owners:
// Validator
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentEmailRule = memo(
  (props: IEmailRuleProps) => {
    return React.createElement(NestedOption<IEmailRuleProps>, { ...props });
  }
);

const EmailRule: typeof _componentEmailRule & IElementDescriptor = Object.assign(_componentEmailRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "email"
  },
})

// owners:
// Validator
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentNumericRule = memo(
  (props: INumericRuleProps) => {
    return React.createElement(NestedOption<INumericRuleProps>, { ...props });
  }
);

const NumericRule: typeof _componentNumericRule & IElementDescriptor = Object.assign(_componentNumericRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "numeric"
  },
})

// owners:
// Validator
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: ValidationRuleType;
}>
const _componentPatternRule = memo(
  (props: IPatternRuleProps) => {
    return React.createElement(NestedOption<IPatternRuleProps>, { ...props });
  }
);

const PatternRule: typeof _componentPatternRule & IElementDescriptor = Object.assign(_componentPatternRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "pattern"
  },
})

// owners:
// Validator
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
}>
const _componentRangeRule = memo(
  (props: IRangeRuleProps) => {
    return React.createElement(NestedOption<IRangeRuleProps>, { ...props });
  }
);

const RangeRule: typeof _componentRangeRule & IElementDescriptor = Object.assign(_componentRangeRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "range"
  },
})

// owners:
// Validator
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentRequiredRule = memo(
  (props: IRequiredRuleProps) => {
    return React.createElement(NestedOption<IRequiredRuleProps>, { ...props });
  }
);

const RequiredRule: typeof _componentRequiredRule & IElementDescriptor = Object.assign(_componentRequiredRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "required"
  },
})

// owners:
// Validator
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentStringLengthRule = memo(
  (props: IStringLengthRuleProps) => {
    return React.createElement(NestedOption<IStringLengthRuleProps>, { ...props });
  }
);

const StringLengthRule: typeof _componentStringLengthRule & IElementDescriptor = Object.assign(_componentStringLengthRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "stringLength"
  },
})

// owners:
// Validator
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  pattern?: RegExp | string;
}>
const _componentValidationRule = memo(
  (props: IValidationRuleProps) => {
    return React.createElement(NestedOption<IValidationRuleProps>, { ...props });
  }
);

const ValidationRule: typeof _componentValidationRule & IElementDescriptor = Object.assign(_componentValidationRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "required"
  },
})

export default Validator;
export {
  Validator,
  IValidatorOptions,
  ValidatorRef,
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

