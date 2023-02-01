import { ValidationResult } from '@devextreme/interim';
import {
  ForwardedRef, forwardRef,
  PropsWithChildren, useContext, useEffect, useImperativeHandle, useMemo, useRef,
} from 'react';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';

interface ValidationGroupProps extends PropsWithChildren {
  id?: string | symbol
}

function ValidationGroupComponent(
  { id, children }: ValidationGroupProps,
  imperativeRef: ForwardedRef<ValidationGroupRef>,
) {
  const unnamedGroupSymbol = Symbol('validation-group');
  const groupRef = useRef(id ?? unnamedGroupSymbol);
  const validationEngine = useContext(ValidationEngineContext);
  useEffect(() => {
    groupRef.current = id ?? unnamedGroupSymbol;
  }, [id]);
  useImperativeHandle(imperativeRef, () => ({
    validate: () => (validationEngine.validateGroup(groupRef.current)),
  }), [validationEngine]);

  const validationGroupContext = useMemo(() => (groupRef.current), [id]);
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
