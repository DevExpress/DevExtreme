import {
  createRadioGroupStore, RADIO_GROUP_ACTIONS,
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devextreme/components';
import { memo, useMemo } from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { Props } from '../../internal/props';
import { RadioGroupStoreContext } from '../radio-common';

function RadioGroupInternal<T>(props: RadioGroupProps<T>) {
  const controlledMode = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const store = useMemo(() => createRadioGroupStore<T>({
    value: controlledMode ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode,
      changeCallback: (value) => { valueChange.current(value); },
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
        {props.children}
      </div>
    </RadioGroupStoreContext.Provider>
  );
}

export type RadioGroupProps<T> =
  React.PropsWithChildren<Props<ValueProps<T>, ReadonlyProps, TemplateProps>>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
