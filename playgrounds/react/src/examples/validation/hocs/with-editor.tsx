import { EditorProps } from '@devextreme/react';
import {
  ComponentType, useMemo, useState,
} from 'react';
import { EditorContext } from '../contexts/editor-context';

export function withEditor<T>(Component: ComponentType<EditorProps<T>>) {
  function Editor(props: EditorProps<T>) {
    const [editorValue, setEditorValue] = useState(props.value || props.defaultValue);
    const editorContextValue = useMemo(
      () => ({ editorName: props.name || '', editorValue }), [editorValue, props.name],
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
        />
      </EditorContext.Provider>
    );
  }
  return Editor;
}
