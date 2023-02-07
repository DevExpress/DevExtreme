import { createContext } from 'react';

interface EditorContextValue {
  editorName: string;
  editorValue: unknown;
  setEditorErrors: (errors: string[]) => void;
}

export const EditorContext = createContext<EditorContextValue | undefined>(
  undefined,
);
