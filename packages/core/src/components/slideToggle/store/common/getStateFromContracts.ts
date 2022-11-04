import { DeepPartial, DeepReadonly } from 'ts-essentials';
import { SlideToggleContracts } from '../../types/index';
import { SlideToggleState } from '../state';

const getStateFromContracts = (
    state: DeepReadonly<SlideToggleState>,
    contracts: DeepPartial<SlideToggleContracts>
): DeepReadonly<SlideToggleState> => ({
    model: {
        value: contracts.value ?? state.model.value
    },
    config: {
        text: contracts.text ?? state.config.text,
        textPosition: contracts.textPosition ?? state.config.textPosition
    },
    template: {
        indicatorView: contracts.indicatorView ?? state.template.indicatorView,
        textView: contracts.textView ?? state.template.textView
    }
});

export { getStateFromContracts };
