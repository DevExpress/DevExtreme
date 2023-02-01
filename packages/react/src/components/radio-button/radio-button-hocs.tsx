import { createCheckedSelector, RADIO_GROUP_ACTIONS } from '@devextreme/components';
import {
  ComponentType,
  useState,
} from 'react';
import { useStoreSelector } from '../../internal/hooks';
import { RadioButtonInternal } from './radio-button-internal';
import {
  CoreBoundRadioButtonProps,
  RadioButtonRenderProps,
  RadioButtonRenderType,
  RadioTemplateProps,
  SelectedEventHandler,
} from './types';

//* Component={"name":"UncontrolledRadioButton"}
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

//* Component={"name":"CoreBoundRadioButton"}
function withRadioGroup<T>(RadioButton: RadioButtonRenderType<T>) {
  function CoreBoundRadioButton({
    store,
    value,
    ...props
  }: CoreBoundRadioButtonProps<T>) {
    const checked = useStoreSelector(store, createCheckedSelector, [value]);

    const handleSelected = () => {
      props.onSelected?.(value);
      store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(value));
      store.commitUpdates();
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
