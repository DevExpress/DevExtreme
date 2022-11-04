import { SlideToggleStore, UpdateValueAction } from '@devexpress/core/slideToggle';
import { callPropCallback } from '../../../internal/index';
import { DxSlideToggleProps } from '../types/public/index';

const valueChangeControlled = (props: DxSlideToggleProps): (value: boolean) => void => (value) => callPropCallback(props.valueChange, value);

const valueChangeUncontrolled = (
    store: SlideToggleStore,
    props: DxSlideToggleProps
): (value: boolean) => void => (value) => {
    store.dispatch(new UpdateValueAction(value));
    const newState = store.getState();
    callPropCallback(props.valueChange, newState.model.value);
};

export {
    valueChangeControlled,
    valueChangeUncontrolled
};
