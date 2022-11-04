import { DeepReadonly } from 'ts-essentials';
import { Action, ActionHandler } from '../../../../../internal/index';
import { PagerState } from '../../state';
import { PagerActions, SelectPageSizeAction } from '../pagerActions';

const selectPageSizeHandler: ActionHandler<PagerActions, PagerState> = (state: DeepReadonly<PagerState>, action: Action<PagerActions>): DeepReadonly<PagerState> => {
    const { selectedPageSize } = action as SelectPageSizeAction;
    return {
        ...state,
        pageSize: {
            ...state.pageSize,
            selected: selectedPageSize
        }
    };
};

export { selectPageSizeHandler };
