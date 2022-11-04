import { DeepReadonly } from 'ts-essentials';
import { Action, ActionHandler } from '../../../../../internal/index';
import { getStateFromContracts } from '../../common/getStateFromContracts';
import { SlideToggleState } from '../../state';
import { SlideToggleActions, UpdateFromContractsAction } from '../slideToggleActions';

const updateFromContractsHandler: ActionHandler<SlideToggleActions, SlideToggleState> = (state: DeepReadonly<SlideToggleState>, action: Action<SlideToggleActions>): DeepReadonly<SlideToggleState> => {
    const { contracts } = action as UpdateFromContractsAction;
    return getStateFromContracts(state, contracts);
};

export {
    updateFromContractsHandler
};
