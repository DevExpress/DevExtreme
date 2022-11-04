import { DeepPartial } from 'ts-essentials';
import { createStore, Store } from '../../../internal/index';
import { PagerContracts } from '../types/index';
import { PAGER_ACTIONS, PagerActions } from './actions/pagerActions';
import { getStateFromContracts } from './common/getStateFromContracts';
import { PAGER_DEFAULT_STATE, PagerState } from './state';

type PagerStore = Store<PagerActions, PagerState>;

function createPagerStore(
    contracts: DeepPartial<PagerContracts>
) {
    const initialState = getStateFromContracts(PAGER_DEFAULT_STATE, contracts);
    return createStore(initialState, PAGER_ACTIONS);
}

export type { PagerStore };
export { createPagerStore };
