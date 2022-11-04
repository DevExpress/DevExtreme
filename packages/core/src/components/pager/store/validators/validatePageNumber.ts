import { DeepReadonly } from 'ts-essentials';
import { ValidationFunc, ValidationFuncResult } from '../../../../internal/index';
import { PagerState } from '../state';

const DEFAULT_PAGE_NUMBER = 1;

const validatePageNumber: ValidationFunc<PagerState> = (
    state: DeepReadonly<PagerState>
): ValidationFuncResult<PagerState> => {
    const { pageNumber } = state;
    const { selected, count } = pageNumber;

    if (selected < DEFAULT_PAGE_NUMBER || selected > count) {
        const fixedState = {
            ...state,
            pageNumber: {
                ...pageNumber,
                selected: DEFAULT_PAGE_NUMBER
            }
        };
        return [fixedState, true];
    }

    return [state, false];
};

export { validatePageNumber };
