import { EditorProps } from '@devextreme/react';
import {
  ComponentType, useContext, useEffect, useMemo,
} from 'react';
import { ValidationResult } from '../components/validation-result';
import { ValidationContext } from '../contexts/validation-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { useValidation } from '../hooks/use-validation';

export function withValidation<T>(Editor: ComponentType<EditorProps<T>>) {
  function EditorWithValidation(props: EditorProps<T>) {
    const validationEngine = useContext(ValidationEngineContext);
    const { validateEditor, validationResult } = useValidation(validationEngine);
    useEffect(() => {
      if (props.name) {
        validateEditor(props.name, props.value || props.defaultValue);
      }
    }, []);

    const validationContextValue = useMemo(
      () => ({
        validationResult,
      }),
      [validationResult],
    );

    const handleValueChange = (newValue?: T) => {
      if (props.name) {
        validateEditor(props.name, newValue);
      }
      props.valueChange?.(newValue);
    };
    return (
      <ValidationContext.Provider value={validationContextValue}>
        <Editor
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          valueChange={handleValueChange}
        />
        {props.name ? <ValidationResult editorName={props.name} /> : null}
      </ValidationContext.Provider>
    );
  }
  return EditorWithValidation;
}
