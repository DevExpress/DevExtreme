import {
  ForwardedRef,
  forwardRef,
  PropsWithChildren, useContext, useImperativeHandle, useMemo, useRef,
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
  const groupId = id ?? unnamedGroupSymbol.current;
  const validationEngine = useContext(ValidationEngineContext);
  useImperativeHandle<ValidationGroupRef, ValidationGroupRef>(ref, () => ({
    validate: () => (validationEngine.validateGroup(groupId)),
  }), [validationEngine, groupId]);

  const validationGroupContext = useMemo(() => (groupId), [groupId]);
  return (
    <ValidationGroupContext.Provider value={validationGroupContext}>
      {children}
    </ValidationGroupContext.Provider>
  );
}

export const ValidationGroup = forwardRef<ValidationGroupRef, ValidationGroupProps>(
  ValidationGroupComponent,
);
