import { EditorContext, EditorProps } from '@devextreme/react';
import {
  ComponentType, useCallback, useMemo, useState,
} from 'react';

export function withEditor<T>(Component: ComponentType<EditorProps<T>>) {
  function Editor(props: EditorProps<T>) {
    const [editorValue, setEditorValue] = useState(props.value || props.defaultValue);
    const [editorErrors, setEditorErrors] = useState<string[]>();

    const setEditorErrorsCallback = useCallback((errors: string[]) => {
      setEditorErrors(errors);
    }, [setEditorErrors]);

    const editorContextValue = useMemo(
      () => ({ editorName: props.name || '', editorValue, setEditorErrors: setEditorErrorsCallback }), [editorValue, props.name],
    );

    const handleValueChange = (newValue?: T) => {
      if (props.name) {
        setEditorValue(newValue);
      }
      props.valueChange?.(newValue);
    };
    return (
      <EditorContext.Provider value={editorContextValue}>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          valueChange={handleValueChange}
          errors={editorErrors}
        />
        {editorErrors && Array.isArray(editorErrors) ? <div>{editorErrors.join('. ')}</div> : null}
      </EditorContext.Provider>
    );
  }
  return Editor;
}
