import {
  ComponentType, ForwardedRef, forwardRef, useCallback, useMemo, useState,
} from 'react';
import { EditorProps } from '../../../internal/props';
import { EditorContext } from '../contexts/editor-context';

type EditorType<T> = ComponentType<EditorProps<T> & { ref: ForwardedRef<unknown> }>;
// TODO: ref casted to any to work around bug with pulling types from inferno. Change it after fix.

export function withEditor<T>(Component: EditorType<T>) {
  function Editor<V extends T>(props: EditorProps<V>, ref: ForwardedRef<unknown>) {
    const [editorValue, setEditorValue] = useState(props.value || props.defaultValue);
    const [editorErrors, setEditorErrors] = useState<string[]>();

    const setEditorErrorsCallback = useCallback((errors: string[]) => {
      setEditorErrors(errors);
    }, [setEditorErrors]);

    const editorContextValue = useMemo(
      () => ({ editorName: props.name || '', editorValue, setEditorErrors: setEditorErrorsCallback }),
      [editorValue, props.name, setEditorErrorsCallback],
    );

    const handleValueChange = (newValue?: V) => {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          valueChange={handleValueChange as any}
          errors={editorErrors}
        />
        {editorErrors && Array.isArray(editorErrors) ? (
          <div>
            {editorErrors.join('. ')}
          </div>
        ) : null}
      </EditorContext.Provider>
    );
  }
  return forwardRef(Editor);
}
