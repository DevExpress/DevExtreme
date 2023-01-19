import { createRadioGroupStore, RADIO_GROUP_ACTIONS } from '@devextreme/components';
import {
  Children, cloneElement, isValidElement, memo, useMemo,
} from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { EditorProps } from '../../internal/props';
import { RadioGroupStoreContext } from '../radio-common';

function RadioGroupInternal<T>(props: RadioGroupProps<T>) {
  const controlledMode = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const store = useMemo(() => createRadioGroupStore<T>({
    value: controlledMode ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode,
      changeCallback: (value: T) => { valueChange.current(value); },
    },
  }), []);

  useSecondEffect(() => {
    if (controlledMode) {
      store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(props.value));
    }

    store.commitPropsUpdates();
  }, [props.value]);

  return (
    <RadioGroupStoreContext.Provider value={store}>
      <div>
        {props.name
          ? Children.map(
            props.children,
            child => (
              isValidElement<EditorProps<T>>(child)
                ? cloneElement(child, { name: props.name })
                : child
            ),
          )
          : props.children}
      </div>
    </RadioGroupStoreContext.Provider>
  );
}

export type RadioGroupProps<T> =
  React.PropsWithChildren<EditorProps<T>>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
