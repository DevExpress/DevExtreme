import { DeepReadonly } from 'ts-essentials';
import { Action, ActionHandler } from '../../../../../internal/index';
import { PagerState } from '../../state';
import { PagerActions, SelectPageAction } from '../pagerActions';

const selectPageHandler: ActionHandler<PagerActions, PagerState> = (state: DeepReadonly<PagerState>, action: Action<PagerActions>): DeepReadonly<PagerState> => {
    const { selectedPage } = action as SelectPageAction;
    return {
        ...state,
        pageNumber: {
            ...state.pageNumber,
            selected: selectedPage
        }
    };
};

export { selectPageHandler };
