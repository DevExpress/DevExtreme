import {
  FormEventHandler, useContext, useMemo, useRef,
} from 'react';
import { ValidationGroup } from 'src/examples/validation/components/validation-group';
import { ValidationEngineContext } from 'src/examples/validation/contexts/validation-engine-context';
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
  const validationGroup = useRef(Symbol('form-validation-group'));
  const formContextValue = useMemo(
    () => ({
      onValueChanged: (name: string, value: unknown) => {
        formValues.current = { ...formValues.current, [name]: value };
      },
    }),
    [],
  );
  const validationEngine = useContext(ValidationEngineContext);
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const { isValid } = validationEngine.validateGroup(validationGroup.current);
    if (!isValid) {
      event.preventDefault();
    }
    onSubmit?.(event);
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <ValidationGroup id={validationGroup.current}>
        <form onSubmit={handleSubmit}>
          {children}
          <input type="submit" value="Submit" />
        </form>
      </ValidationGroup>
    </FormContext.Provider>
  );
}
