import { useState, HookContainer } from '@devextreme/runtime/inferno-hooks';
import { useCoreState } from '../../internal/hooks';
import { RadioButtonInternal } from './radio-button-internal';

function withUncontrolledBehavior(RadioButton) {
    const component = ({ defaultChecked, ...props }) => {
        const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
        const handleChange = (event) => {
            setInternalChecked(event.target.checked);
            event.preventDefault();
            event.stopPropagation();
            props.onChange?.(event);
        };
        const renderRadioComponent = (RadioComponent) => (<RadioComponent checked={internalChecked} />);
        return (<RadioButton {...props} onChange={handleChange} renderRadioComponent={renderRadioComponent} />);
    };
    return (props, ref) => (
        <HookContainer renderFn={component} renderProps={props} renderRef={ref} />
    );
}

function withRadioGroup(RadioButton) {
    const component = ({ radioGroupCore: { dispatcher, stateManager }, value, ...props }) => {
        const coreState = useCoreState(stateManager);
        const checked = coreState.value === value;
        const handleChange = (event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatcher.dispatch('updateValue', { value });
        };
        return (<RadioButton {...props} value={value} checked={checked} onChange={handleChange} />);
    };
    return (props, ref) => (
        <HookContainer renderFn={component} renderProps={props} renderRef={ref} />
    );
}
export const CoreBoundRadioButton = withRadioGroup(RadioButtonInternal);
export const UncontrolledRadioButton = withUncontrolledBehavior(RadioButtonInternal);