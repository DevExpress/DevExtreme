import { ObjectType, StateManager } from '@devexpress/core';
import { useEffect, useState } from 'react';

export function useCoreState<TState extends ObjectType>(
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
