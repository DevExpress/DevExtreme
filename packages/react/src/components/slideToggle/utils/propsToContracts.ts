import { DeepPartial } from 'ts-essentials';
import {
    SlideToggleContractModels,
    SlideToggleContracts
} from '@devexpress/core/slideToggle';
import { DxSlideToggleProps } from '../types/public/index';
import { SLIDE_TOGGLE_DEFAULT_VIEWS } from '../views/index';

const getContractsModel = (
    props: DxSlideToggleProps,
    isInitState: boolean,
    isControlled: boolean
): DeepPartial<SlideToggleContractModels> => {
    switch (true) {
        case isControlled:
            return { value: props.value };
        case !isControlled && isInitState:
            return { value: props.defaultValue };
        default:
            return {};
    }
};

const propsToContracts = (
    props: DxSlideToggleProps,
    isInitState: boolean,
    isControlled: boolean
): DeepPartial<SlideToggleContracts> => ({
    ...getContractsModel(props, isInitState, isControlled),
    text: props.text,
    textPosition: props.textPosition,
    indicatorView: props.indicatorView || SLIDE_TOGGLE_DEFAULT_VIEWS.indicatorView,
    textView: props.textView || SLIDE_TOGGLE_DEFAULT_VIEWS.textView
});

export { propsToContracts };
