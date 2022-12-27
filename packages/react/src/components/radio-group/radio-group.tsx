import {
  createRadioGroupCore, ReadonlyProps, TemplateProps, ValueProps,
} from '@devextreme/components';
import { memo, useMemo } from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { Props } from '../../internal/props';
import { RadioGroupContext } from '../radio-common';

function RadioGroupInternal<T>(props: RadioGroupProps<T>) {
  const controlledMode = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const radioGroupCore = useMemo(() => createRadioGroupCore<T>({
    value: controlledMode ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode,
      changeCallback: (value) => { valueChange.current(value); },
    },
  }), []);

  useSecondEffect(() => {
    if (controlledMode) {
      radioGroupCore.stateManager.addUpdate({ value: props.value });
    }

    radioGroupCore.stateManager.commitUpdates();
  }, [props.value]);

  return (
    <RadioGroupContext.Provider value={radioGroupCore}>
      <div>
        {props.children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupProps<T> =
  React.PropsWithChildren<Props<ValueProps<T>, ReadonlyProps, TemplateProps>>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
