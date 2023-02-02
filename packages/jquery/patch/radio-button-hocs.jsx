import { createCheckedSelector, RADIO_GROUP_ACTIONS } from '@devextreme/components';
import { HookContainer, useState } from '@devextreme/runtime/inferno-hooks';
import { useStoreSelector } from '../../internal/hooks';
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
  function CoreBoundRadioButton({ store, value, ...props }) {
      const checked = useStoreSelector(store, createCheckedSelector, [value]);
      const handleSelected = () => {
          props.onSelected?.(value);
          store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(value));
          store.commitUpdates();
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
