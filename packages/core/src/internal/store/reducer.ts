import { DeepReadonly } from 'ts-essentials';
import { Action, ActionMap } from './types';

function createReducer<TAction extends string, TState>(
    actions: ActionMap<TAction, TState>
): (state: DeepReadonly<TState>, action: Action<TAction>) => DeepReadonly<TState> {
    const actionMap = actions;

    return (state: DeepReadonly<TState>, action: Action<TAction>) => {
        const handler = actionMap[action.type];

        if (!handler) {
            throw Error(`Handler for action ${action.type} not specified.`);
        }

        return handler(state, action);
    };
}

export { createReducer };
