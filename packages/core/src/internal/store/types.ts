import { DeepReadonly } from 'ts-essentials';
import { Observable } from '../utils/index';

/* actions */
abstract class Action<TAction extends string> {
    abstract type: TAction;
}

type ActionHandler<TAction extends string, TState> = (state: DeepReadonly<TState>, action: Action<TAction>) => DeepReadonly<TState>;
type ActionMap<TAction extends string, TState> = Record<TAction, ActionHandler<TAction, TState>>;

/* selectors */
type Comparer<T> = (prev: T, next: T) => boolean;
type Selector<TState, TResult> = (state: DeepReadonly<TState>) => DeepReadonly<TResult>;

/* validators */
type ValidationFailCallback<TState> = (fixedState: DeepReadonly<TState>) => void;
type ValidationFuncResult<TState> = [fixedState: DeepReadonly<TState>, didFix: boolean];
type ValidationFunc<TState> = (state: DeepReadonly<TState>) => ValidationFuncResult<TState>;
type StateValidator<TState> = {
    setCallback: (callback: ValidationFailCallback<TState>) => void,
    validate: (state: DeepReadonly<TState>) => DeepReadonly<TState>
};

/* store */
interface Store<TAction extends string, TState>
    extends Observable<TState> {
    dispatch: (action: Action<TAction>) => void;
    getState: () => DeepReadonly<TState>;
    reactive: (enabled: boolean) => void;
    pushChanges: () => void;
    validate: () => void;
    addValidators: (validators: StateValidator<TState>[]) => void;
    removeValidators: (validators: StateValidator<TState>[]) => void;
}

export type {
    ActionHandler,
    ActionMap,
    Comparer,
    Selector,
    ValidationFailCallback,
    ValidationFuncResult,
    ValidationFunc,
    StateValidator,
    Store
};

export {
    Action
};
