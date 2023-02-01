import { EditorProps } from '@devextreme/react';
import {
  ComponentType, useContext, useEffect,
} from 'react';
import { FormContext } from '../contexts/form-context';

export function withFormContext<T>(Editor: ComponentType<EditorProps<T>>) {
  function FormEditor(props: EditorProps<T>) {
    const formContext = useContext(FormContext);
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
    return (
      <Editor
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        valueChange={handleValueChange}
      />
    );
  }
  return FormEditor;
}
