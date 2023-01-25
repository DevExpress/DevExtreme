import { PropsWithChildren, useMemo } from 'react';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { createValidationEngine, ValidationEngine } from '../utils/validation-engine';

export function ValidationGroup({ children }: PropsWithChildren) {
  const validationEngine = useMemo<ValidationEngine>(createValidationEngine, []);

  return (
    <ValidationEngineContext.Provider value={validationEngine}>
      {children}
    </ValidationEngineContext.Provider>
  );
}
