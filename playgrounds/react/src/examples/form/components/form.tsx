import {
  FormEventHandler, useMemo, useRef, useState,
} from 'react';
import { FormContext } from './form-context';
import {
  FormItemValidator, FormProps, FormValidationResult, Rule,
} from './types';

/*
Vitik: The previous form implements parts:
- formData collection
- item layout: a label for the editor, groups, columns, and tab panels,
- editor factory base on dataType 
- editors validation
The previous form doesn't allow the use of them separately the next form should allow this.
*/

export function Form({ children, onSubmit }: FormProps) {
  const [formValidationResult, setFormValidationResult] = useState<FormValidationResult>({});
  const formValues = useRef<Record<string, unknown>>({});
  const validationRules = useRef<Record<string, Rule[]>>({});
  const validateFormItemValue: FormItemValidator = (
    value, rules,
  ) => rules?.filter(({ validate }) => !validate(value)).map(({ message }) => message);

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
