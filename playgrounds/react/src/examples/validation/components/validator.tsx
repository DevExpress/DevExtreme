import { PropsWithChildren } from 'react';
import { useEditorValidationRulesInitialization } from '../hooks/use-validation-rules-extractor';

export function Validator({
  editorName,
  children,
}: PropsWithChildren & { editorName: string }) {
  useEditorValidationRulesInitialization(editorName, children);
  return null;
}
