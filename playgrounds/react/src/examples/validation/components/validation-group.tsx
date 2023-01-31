import { ValidationResult } from '@devextreme/interim';
import {
  ForwardedRef, forwardRef, PropsWithChildren, useContext, useImperativeHandle, useMemo, useRef,
} from 'react';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';

interface ValidationGroupProps extends PropsWithChildren {
  name?: string
}

function ValidationGroupComponent(
  { name, children }: ValidationGroupProps,
  imperativeRef: ForwardedRef<ValidationGroupRef>,
) {
  const groupRef = useRef(Symbol(name || 'validation-group'));
  const validationEngine = useContext(ValidationEngineContext);

  useImperativeHandle(imperativeRef, () => ({
    validate: () => (validationEngine.validateGroup(groupRef.current)),
  }), [validationEngine]);

  const validationGroupContext = useMemo(() => ({ name, group: groupRef.current }), [name]);
  return (
    <ValidationGroupContext.Provider value={validationGroupContext}>
      {children}
    </ValidationGroupContext.Provider>
  );
}

const ValidationGroup = forwardRef(ValidationGroupComponent);
export interface ValidationGroupRef {
  validate: () => ValidationResult
}

export { ValidationGroup };
