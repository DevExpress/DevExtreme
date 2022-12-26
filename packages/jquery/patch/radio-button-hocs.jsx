import { HookContainer, useState } from '@devextreme/runtime/inferno-hooks';
import { useCoreState } from '../../internal/hooks';
import { RadioButtonInternal } from './radio-button-internal';

function withUncontrolledBehavior(RadioButton) {
  function UncontrolledRadioButton({ defaultChecked, ...props }) {
      const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
      const handleSelected = (value) => {
          setInternalChecked(true);
          props.onSelected?.(value);
      };
      const renderRadioComponent = (RadioComponent) => (<RadioComponent checked={internalChecked}/>);
      return (<RadioButton {...props} onSelected={handleSelected} renderRadioComponent={renderRadioComponent}/>);
  }
  function HooksUncontrolledRadioButton(props) {
      return (<HookContainer renderFn={UncontrolledRadioButton} renderProps={props}/>);
  }
  return HooksUncontrolledRadioButton;
}

function withRadioGroup(RadioButton) {
  function CoreBoundRadioButton({ radioGroupCore: { dispatcher, stateManager }, value, ...props }) {
      const coreState = useCoreState(stateManager);
      const checked = coreState.value === value;
      const handleSelected = () => {
          props.onSelected?.(value);
          dispatcher.dispatch('updateValue', { value });
      };
      return (<RadioButton {...props} value={value} checked={checked} onSelected={handleSelected}/>);
  }
  function HooksCoreBoundRadioButton(props) {
      return (<HookContainer renderFn={CoreBoundRadioButton} renderProps={props}/>);
  }
  return HooksCoreBoundRadioButton;
}

export const CoreBoundRadioButton = withRadioGroup(RadioButtonInternal);
export const UncontrolledRadioButton = withUncontrolledBehavior(RadioButtonInternal);
