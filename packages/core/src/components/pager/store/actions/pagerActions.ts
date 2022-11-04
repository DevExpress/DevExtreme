import { DeepPartial } from 'ts-essentials';
import { Action, ActionMap } from '../../../../internal/index';
import { PagerContracts } from '../../types/index';
import { PagerState } from '../state';
import { selectPageHandler } from './handlers/selectPage';
import { selectPageSizeHandler } from './handlers/selectPageSize';
import { updateFromContractsHandler } from './handlers/updateFromContracts';

enum PagerActions {
    updateFromContracts = 'PAGER_UPDATE_FROM_CONTRACTS',
    selectPage = 'PAGER_SELECT_PAGE',
    selectPageSize = 'PAGER_SELECT_PAGE_SIZE',
}

const PAGER_ACTIONS: ActionMap<PagerActions, PagerState> = {
    [PagerActions.updateFromContracts]: updateFromContractsHandler,
    [PagerActions.selectPage]: selectPageHandler,
    [PagerActions.selectPageSize]: selectPageSizeHandler
};

class UpdateFromContractsAction extends Action<PagerActions> {
    readonly type = PagerActions.updateFromContracts;

    constructor(public contracts: DeepPartial<PagerContracts>) {
        super();
    }
}

class SelectPageAction extends Action<PagerActions> {
    readonly type = PagerActions.selectPage;

    constructor(public selectedPage: number) {
        super();
    }
}

class SelectPageSizeAction extends Action<PagerActions> {
    readonly type = PagerActions.selectPageSize;

    constructor(public selectedPageSize: number) {
        super();
    }
}

export {
    PagerActions,
    PAGER_ACTIONS,
    UpdateFromContractsAction,
    SelectPageAction,
    SelectPageSizeAction
};
