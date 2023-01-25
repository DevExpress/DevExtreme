import { useContext } from 'react';
import { ValidationContext } from '../contexts/validation-context';

export function ValidationResult({ editorName }: { editorName: string }) {
  const validationContext = useContext(ValidationContext);
  return (
    validationContext ? <span>{validationContext.validationResult?.[editorName]?.join('. ')}</span> : null
  );
}
