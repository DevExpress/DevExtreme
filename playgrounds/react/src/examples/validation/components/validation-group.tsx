import { ValidationResult } from '@devextreme/interim';
import {
  ForwardedRef, forwardRef,
  PropsWithChildren, useContext, useEffect, useImperativeHandle, useMemo, useRef,
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
  const unnamedGroupSymbol = Symbol('validation-group');
  const groupRef = useRef(name ?? unnamedGroupSymbol);
  const validationEngine = useContext(ValidationEngineContext);
  useEffect(() => {
    groupRef.current = name ?? unnamedGroupSymbol;
  }, [name]);
  useImperativeHandle(imperativeRef, () => ({
    validate: () => (validationEngine.validateGroup(groupRef.current)),
  }), [validationEngine]);

  const validationGroupContext = useMemo(() => (groupRef.current), [name]);
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
