import { PropsWithChildren, useMemo, useRef } from 'react';
import { ValidationGroupContext } from '../contexts/validation-group-context';

interface ValidationGroupProps extends PropsWithChildren {
  name?: string
}

export function ValidationGroup({ name, children }: ValidationGroupProps) {
  const groupRef = useRef(Symbol(name || 'validation-group'));
  const validationGroupContext = useMemo(() => ({ name, group: groupRef.current }), [name]);
  return (
    <ValidationGroupContext.Provider value={validationGroupContext}>
      {children}
    </ValidationGroupContext.Provider>
  );
}
