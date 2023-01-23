import { PropsWithChildren } from 'react';
import { useEditorValidationRulesInitialization } from './hooks/use-validation-rules-extractor';

export function Validator({ name, children }: PropsWithChildren & { name: string }) {
  useEditorValidationRulesInitialization(name, children);
  return null;
}
