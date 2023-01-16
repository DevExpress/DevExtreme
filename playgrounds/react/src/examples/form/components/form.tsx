import {
  FormEventHandler, useMemo, useRef, useState,
} from 'react';
import { FormContext } from './form-context';
import {
  FormItemValidator, FormProps, FormValidationResult, Rule,
} from './types';

export function Form({ children, onSubmit }: FormProps) {
  const [formValidationResult, setFormValidationResult] = useState<FormValidationResult>({});
  const formValues = useRef<Record<string, unknown>>({});
  const validationRules = useRef<Record<string, Rule[]>>({});
  const validateFormItemValue: FormItemValidator = (value, rules) => {
    const result: string[] = [];
    if (rules?.length) {
      rules.forEach((rule) => {
        if (!rule.validate(value)) {
          result.push(rule.message);
        }
      });
    }
    return result;
  };

  const formContextValue = useMemo(
    () => ({
      validationResult: formValidationResult,
      onValueChanged: (name: string, value: unknown) => {
        formValues.current = { ...formValues.current, [name]: value };
        const validationResult = validateFormItemValue(value, validationRules.current[name]);
        setFormValidationResult(previousResult => (
          { ...previousResult, [name]: validationResult }));
      },
      onValidationRulesInitialized: (name: string, rules: Rule[]) => {
        validationRules.current = { ...validationRules.current, [name]: rules };
      },
    }),
    [formValidationResult],
  );

  const validateForm = () => {
    let isValid = true;
    const validationResults: FormValidationResult = {};
    Object.keys(validationRules.current).forEach((name) => {
      validationResults[name] = validateFormItemValue(
        formValues.current[name],
        validationRules.current[name],
      );
      if (validationResults[name].length) {
        isValid = false;
      }
    });
    setFormValidationResult(validationResults);
    return isValid;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const isValid = validateForm();
    if (!isValid) {
      event.preventDefault();
    }
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
