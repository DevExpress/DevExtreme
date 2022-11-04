import { DeepReadonly } from 'ts-essentials';
import { Action, ActionHandler } from '../../../../../internal/index';
import { getStateFromContracts } from '../../common/getStateFromContracts';
import { PagerState } from '../../state';
import { PagerActions, UpdateFromContractsAction } from '../pagerActions';

const updateFromContractsHandler: ActionHandler<PagerActions, PagerState> = (state: DeepReadonly<PagerState>, action: Action<PagerActions>): DeepReadonly<PagerState> => {
    const { contracts } = action as UpdateFromContractsAction;
    return {
        ...state,
        ...getStateFromContracts(state, contracts)
    };
};

export { updateFromContractsHandler };
