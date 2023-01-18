import { EditorProps } from '@devextreme/react';
import {
  ComponentType, useContext, useEffect,
} from 'react';
import { FormContext } from '../contexts/form-context';
import { ValidationContext } from '../contexts/validation-context';

export function withFormContext<T>(Editor: ComponentType<EditorProps<T>>) {
  function FormEditor(props: EditorProps<T>) {
    const formContext = useContext(FormContext);
    const validationContext = useContext(ValidationContext);
    useEffect(() => {
      if (props.name) {
        formContext?.onValueChanged(props.name, props.value || props.defaultValue);
      }
    }, []);

    const handleValueChange = (newValue?: T) => {
      if (props.name) {
        formContext?.onValueChanged(props.name, newValue);
      }
      props.valueChange?.(newValue);
    };
    const renderValidation = () => (
      props.name
        ? <span>{validationContext?.validationResult?.[props.name]?.join('. ')}</span>
        : null
    );
    return (
      <>
        <Editor
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          valueChange={handleValueChange}
        />
        <span>{renderValidation()}</span>
      </>
    );
  }
  return FormEditor;
}
