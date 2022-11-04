import { DeepReadonly } from 'ts-essentials';
import { StateValidator, ValidationFailCallback, ValidationFunc } from './types';

const createValidator = <TState>(
    validateFunc: ValidationFunc<TState>
): StateValidator<TState> => {
    let validationFailCallback: ValidationFailCallback<TState>;

    const setCallback = (func: ValidationFailCallback<TState>) => {
        validationFailCallback = func;
    };

    const validate = (state: DeepReadonly<TState>) => {
        const [fixedState, didFix] = validateFunc(state);
        didFix && validationFailCallback && validationFailCallback(fixedState);
        return fixedState;
    };

    return {
        setCallback,
        validate
    };
};

export { createValidator };
