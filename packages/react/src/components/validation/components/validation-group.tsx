import { ValidationResult } from '@devextreme/interim';
import {
  ForwardedRef,
  forwardRef,
  PropsWithChildren, useContext, useEffect, useImperativeHandle, useMemo, useRef,
} from 'react';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';

type ValidationGroupProps = PropsWithChildren<{
  id?: string | symbol
}>;

function ValidationGroupComponent(
  { id, children }: ValidationGroupProps,
  ref: ForwardedRef<ValidationGroupRef>,
) {
  const unnamedGroupSymbol = Symbol('validation-group');
  const groupRef = useRef(id ?? unnamedGroupSymbol);
  const validationEngine = useContext(ValidationEngineContext);
  useEffect(() => {
    groupRef.current = id ?? unnamedGroupSymbol;
  }, [id]);
  useImperativeHandle<ValidationGroupRef, ValidationGroupRef>(ref, () => ({
    validate: () => (validationEngine.validateGroup(groupRef.current)),
  }), [validationEngine]);

  const validationGroupContext = useMemo(() => (groupRef.current), [id]);
  return (
    <ValidationGroupContext.Provider value={validationGroupContext}>
      {children}
    </ValidationGroupContext.Provider>
  );
}

export type ValidationGroupRef = {
  validate: () => ValidationResult
};

//* Component={"name":"ValidationGroup", "jQueryRegistered":true, "hasApiMethod":true}
export const ValidationGroup = forwardRef<ValidationGroupRef, ValidationGroupProps>(
  ValidationGroupComponent,
);
