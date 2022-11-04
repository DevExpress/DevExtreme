import { DeepReadonly } from 'ts-essentials';
import { ValidationFunc, ValidationFuncResult } from '../../../../internal/index';
import { PagerState } from '../state';

const DEFAULT_PAGE_SIZE = 1;

const validatePageSize: ValidationFunc<PagerState> = (
    state: DeepReadonly<PagerState>
): ValidationFuncResult<PagerState> => {
    const { pageSize } = state;
    const { selected, sizes } = pageSize;

    if (!sizes.find((size) => size === selected)) {
        const defaultSize = sizes[0] || DEFAULT_PAGE_SIZE;
        const fixedState = {
            ...state,
            pageSize: {
                ...pageSize,
                selected: defaultSize
            }
        };
        return [fixedState, true];
    }

    return [state, false];
};

export { validatePageSize };
