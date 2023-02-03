import {
  ForwardedRef,
  forwardRef,
  PropsWithChildren, useContext, useEffect, useImperativeHandle, useMemo, useRef,
} from 'react';
import { ValidationEngineContext } from '../contexts/validation-engine-context';
import { ValidationGroupContext } from '../contexts/validation-group-context';
import { ValidationGroupId, ValidationGroupRef } from '../types';

type ValidationGroupProps = PropsWithChildren<{
  id?: ValidationGroupId
}>;

function ValidationGroupComponent(
  { id, children }: ValidationGroupProps,
  ref: ForwardedRef<ValidationGroupRef>,
) {
  const unnamedGroupSymbol = useRef(Symbol('validation-group'));
  const groupRef = useRef(id ?? unnamedGroupSymbol.current);
  const validationEngine = useContext(ValidationEngineContext);
  useEffect(() => {
    groupRef.current = id ?? unnamedGroupSymbol.current;
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

//* Component={"name":"ValidationGroup", "jQueryRegistered":true, "hasApiMethod":true}
export const ValidationGroup = forwardRef<ValidationGroupRef, ValidationGroupProps>(
  ValidationGroupComponent,
);
