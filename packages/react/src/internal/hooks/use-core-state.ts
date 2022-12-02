import { UnknownRecord, StateManager } from '@devexpress/core';
import { useEffect, useState } from 'react';

export function useCoreState<TState extends UnknownRecord>(
  stateManager: StateManager<TState>,
): TState {
  const [state, setState] = useState(stateManager.getState());

  useEffect(() => {
    const unsubscribe = stateManager.subscribe((stateValue) => {
      setState(stateValue);
    });

    return () => { unsubscribe(); };
  }, []);

  return state;
}
