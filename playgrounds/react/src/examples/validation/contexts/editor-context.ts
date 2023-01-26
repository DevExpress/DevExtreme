import { createContext } from 'react';

interface EditorContextValue {
  editorName: string;
  editorValue: unknown;
}

export const EditorContext = createContext<EditorContextValue | undefined>(
  undefined,
);
