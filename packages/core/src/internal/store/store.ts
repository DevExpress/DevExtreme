import { DeepReadonly } from 'ts-essentials';
import { createObservable } from '../utils/index';
import { createReducer } from './reducer';
import {
    Action, ActionMap, StateValidator, Store
} from './types';

function createStore<TAction extends string, TState>(
    initialState: DeepReadonly<TState>,
    actions: ActionMap<TAction, TState>
): Store<TAction, TState> {
    const { emit, subscribe } = createObservable<TState>();
    const reducer = createReducer<TAction, TState>(actions);

    let reactiveEnabled = true;
    let validators: StateValidator<TState>[] = [];
    let state = initialState;

    const validate = () => {
        validators.forEach((validator) => {
            state = validator.validate(state);
        });
    };

    const addValidators = (newValidators: StateValidator<TState>[]) => {
        validators = [...validators, ...newValidators];
    };

    const removeValidators = (validatorsToRemove: StateValidator<TState>[]) => {
        const removeSet = new Set(validatorsToRemove);
        validators = validators.filter((validator) => !removeSet.has(validator));
    };

    const dispatch = (action: Action<TAction>) => {
        state = reducer(state, action);
        validate();
        reactiveEnabled && emit(state);
    };

    const reactive = (enabled: boolean) => {
        reactiveEnabled = enabled;
    };

    const pushChanges = () => {
        emit(state);
    };

    const getState = () => state;

    return {
        subscribe,
        dispatch,
        getState,
        reactive,
        pushChanges,
        validate,
        addValidators,
        removeValidators
    };
}

export {
    createStore
};
