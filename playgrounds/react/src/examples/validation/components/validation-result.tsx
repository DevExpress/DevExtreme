import { useContext, useEffect, useState } from 'react';
import { ValidationContext } from '../contexts/validation-context';
import { ValidationEngineContext } from '../contexts/validation-engine-context';

export function ValidationResult({ editorName }: { editorName: string }) {
  const validationContext = useContext(ValidationContext);
  const validationEngineContext = useContext(ValidationEngineContext);
  const [validationEngineResult, setValidationEngineResult] = useState(
    validationEngineContext.validationResult,
  );
  useEffect(() => {
    setValidationEngineResult(validationEngineContext.getValidationResult());
  }, [validationEngineContext.validationResult]);
  const validationResult = validationContext?.validationResult
   ?? validationEngineResult.results;
  return (
    <span>{validationResult[editorName]?.join('. ')}</span>
  );
}
