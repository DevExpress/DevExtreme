import { DeepPartial } from 'ts-essentials';
import { Action, ActionMap } from '../../../../internal/index';
import { SlideToggleContracts } from '../../types/index';
import { SlideToggleState } from '../state';
import { updateFromContractsHandler } from './handlers/updateFromContracts';
import { updateValueHandler } from './handlers/updateValue';

enum SlideToggleActions {
    updateFromContracts = 'SLIDE_TOGGLE_UPDATE_FROM_CONTRACTS',
    updateValue = 'SLIDE_TOGGLE_UPDATE_VALUE',
}

const SLIDE_TOGGLE_ACTIONS: ActionMap<SlideToggleActions, SlideToggleState> = {
    [SlideToggleActions.updateValue]: updateValueHandler,
    [SlideToggleActions.updateFromContracts]: updateFromContractsHandler
};

class UpdateValueAction extends Action<SlideToggleActions> {
    readonly type = SlideToggleActions.updateValue;

    constructor(public value: boolean) {
        super();
    }
}

class UpdateFromContractsAction extends Action<SlideToggleActions> {
    readonly type = SlideToggleActions.updateFromContracts;

    constructor(public contracts: DeepPartial<SlideToggleContracts>) {
        super();
    }
}

export {
    SlideToggleActions,
    SLIDE_TOGGLE_ACTIONS,
    UpdateValueAction,
    UpdateFromContractsAction
};
