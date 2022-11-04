import { DeepReadonly } from 'ts-essentials';
import { Action, ActionHandler } from '../../../../../internal/index';
import { SlideToggleState } from '../../state';
import { SlideToggleActions, UpdateValueAction } from '../slideToggleActions';

const updateValueHandler: ActionHandler<SlideToggleActions, SlideToggleState> = (state: DeepReadonly<SlideToggleState>, action: Action<SlideToggleActions>): DeepReadonly<SlideToggleState> => {
    const { value } = action as UpdateValueAction;
    return {
        ...state,
        model: {
            ...state.model,
            value
        }
    };
};

export {
    updateValueHandler
};
