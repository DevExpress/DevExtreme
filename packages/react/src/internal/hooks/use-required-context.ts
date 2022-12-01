import React, { useContext } from 'react';

export function useRequiredContext<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coreContext: React.Context<any | null>,
) {
  const context = useContext(coreContext);

  if (!context) {
    throw Error(`Context ${coreContext} not provided!`);
  }

  return context as T;
}
