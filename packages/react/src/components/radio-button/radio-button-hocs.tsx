import {
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
  SelectedEventHandler,
} from './types';

function withUncontrolledBehavior<T>(
  RadioButton: RadioButtonRenderType<T>,
) {
  function UncontrolledRadioButton({ defaultChecked, ...props }: RadioButtonRenderProps<T>) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const handleSelected: SelectedEventHandler<T> = (value) => {
      setInternalChecked(true);
      props.onSelected?.(value);
    };
    const renderRadioComponent = (
      RadioComponent: ComponentType<RadioTemplateProps>,
    ) => <RadioComponent checked={internalChecked} />;
    return (
      <RadioButton
          // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        onSelected={handleSelected}
        renderRadioComponent={renderRadioComponent}
      />
    );
  }
  return UncontrolledRadioButton;
}
function withRadioGroup<T>(RadioButton: RadioButtonRenderType<T>) {
  function CoreBoundRadioButton({
    radioGroupCore: { dispatcher, stateManager },
    value,
    ...props
  }: CoreBoundRadioButtonProps<T>) {
    const coreState = useCoreState(stateManager);

    const checked = coreState.value === value;
    const handleSelected = () => {
      props.onSelected?.(value);
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
        onSelected={handleSelected}
      />
    );
  }

  return CoreBoundRadioButton;
}

export const CoreBoundRadioButton = withRadioGroup(RadioButtonInternal);
export const UncontrolledRadioButton = withUncontrolledBehavior(RadioButtonInternal);
