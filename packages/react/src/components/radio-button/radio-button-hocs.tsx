import {
  ChangeEventHandler,
  ComponentType,
  useState,
} from 'react';
import { useCoreState } from '../../internal/hooks';
import { RadioButtonInternal } from './radio-button-internal';
import {
  CoreBoundRadioButtonProps,
  RadioButtonRenderProps,
  RadioButtonRenderType,
  RadioTemplateProps,
} from './types';

function withUncontrolledBehavior(RadioButton: RadioButtonRenderType) {
  function UncontrolledRadioButton({ defaultChecked, ...props }: RadioButtonRenderProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setInternalChecked(event.target.checked);
      event.preventDefault();
      event.stopPropagation();
      props.onChange?.(event);
    };
    const renderRadioComponent = (
      RadioComponent: ComponentType<RadioTemplateProps>,
    ) => <RadioComponent checked={internalChecked} />;
    return (
      <RadioButton
          // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onChange={handleChange}
        renderRadioComponent={renderRadioComponent}
      />
    );
  }
  return UncontrolledRadioButton;
}
function withRadioGroup(RadioButton: RadioButtonRenderType) {
  function CoreBoundRadioButton({
    radioGroupCore: { dispatcher, stateManager },
    value,
    ...props
  }: CoreBoundRadioButtonProps) {
    const coreState = useCoreState(stateManager);

    const checked = coreState.value === value;
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      props.onChange?.(event);
      dispatcher.dispatch('updateValue', {
        value,
      });
    };

    return (
      <RadioButton
          // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
    );
  }

  return CoreBoundRadioButton;
}

export const CoreBoundRadioButton = withRadioGroup(RadioButtonInternal);
export const UncontrolledRadioButton = withUncontrolledBehavior(RadioButtonInternal);
