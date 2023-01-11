/* eslint-disable react/require-default-props */
// eslint-disable-next-line rulesdir/no-mixed-import
import React, {
  FormEventHandler, useMemo, useRef, useState,
} from 'react';
import { FormContext } from './form-context';
import { FormItemProps } from './form-item';
import { FormItemValidator, FormValidationResult, Rule } from './types';

interface FormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?:
  | React.ReactElement<FormItemProps>[]
  | React.ReactElement<FormItemProps>;
}

export function Form({ children, onSubmit }: FormProps) {
  const [validationResult, setValidationResult] = useState<FormValidationResult>({});
  const formValues = useRef<Record<string, unknown>>({});
  const validationRules = useRef<Record<string, Rule[]>>({});
  const formContextValue = useMemo(
    () => ({
      validationResult,
      onValueChanged: (name: string, value: unknown) => {
        formValues.current = { ...formValues.current, [name]: value };
      },
      onValidationRulesInitialized: (name: string, rules: Rule[]) => {
        validationRules.current = { ...validationRules.current, [name]: rules };
      },
    }),
    [validationResult],
  );

  const validateFormItemValue: FormItemValidator = (value, rules) => {
    const result: string[] = [];
    if (rules.length) {
      rules.forEach((rule) => {
        if (!rule.validate(value)) {
          result.push(rule.message);
        }
      });
    }
    return result;
  };

  const validateForm = () => {
    const validationResults: FormValidationResult = {};
    Object.keys(validationRules.current).forEach((name) => {
      validationResults[name] = validateFormItemValue(
        formValues.current[name],
        validationRules.current[name],
      );
    });
    setValidationResult(validationResults);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    validateForm();
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <form onSubmit={handleSubmit}>
        {children}
        <input type="submit" value="Submit" />
      </form>
    </FormContext.Provider>
  );
}
