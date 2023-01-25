import { FormEventHandler, useMemo, useRef } from 'react';
import { ValidationContext } from 'src/examples/validation/contexts/validation-context';
import { ValidationEngineContext } from 'src/examples/validation/contexts/validation-engine-context';
import { useValidation } from 'src/examples/validation/hooks/use-validation';
import { createValidationEngine, ValidationEngine } from 'src/examples/validation/utils/validation-engine';
import { FormContext } from './contexts/form-context';
import { FormProps } from './types';

/*
Vitik: The previous form implements parts:
- formData collection
- item layout: a label for the editor, groups, columns, and tab panels,
- editor factory base on dataType
- editors validation
The previous form doesn't allow the use of them separately the next form should allow this.
*/
export function Form({ children, onSubmit }: FormProps) {
  const formValues = useRef<Record<string, unknown>>({});
  const validationEngine = useMemo<ValidationEngine>(createValidationEngine, []);
  const { validationResult, validateAll, validateEditor } = useValidation(validationEngine);

  const formContextValue = useMemo(
    () => ({
      onValueChanged: (name: string, value: unknown) => {
        formValues.current = { ...formValues.current, [name]: value };
        validateEditor(name, value);
      },
    }),
    [validationResult],
  );

  const validationContextValue = useMemo(
    () => ({
      validationResult,
    }),
    [validationResult],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const isValid = validateAll(formValues.current);
    if (!isValid) {
      event.preventDefault();
    }
    onSubmit?.(event);
  };

  return (
    <ValidationEngineContext.Provider value={validationEngine}>
      <FormContext.Provider value={formContextValue}>
        <ValidationContext.Provider value={validationContextValue}>
          <form onSubmit={handleSubmit}>
            {children}
            <input type="submit" value="Submit" />
          </form>
        </ValidationContext.Provider>
      </FormContext.Provider>
    </ValidationEngineContext.Provider>
  );
}
