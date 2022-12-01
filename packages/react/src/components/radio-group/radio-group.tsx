/* eslint-disable react/destructuring-assignment */
import {
  createRadioGroupCore, ReadonlyProps, TemplateProps, ValueProps,
} from '@devexpress/components';
import React, { memo, useMemo } from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { Props } from '../../internal/props';
import { RadioGroupContext } from './radio-group-context';

function RadioGroupInternal<T>(props: RadioGroupProps<T>) {
  const controlledMode = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const { stateManager, viewModelManager, dispatcher } = useMemo(() => createRadioGroupCore<T>({
    value: controlledMode ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode,
      changeCallback: (value) => { valueChange.current(value); },
    },
  }), []);

  useSecondEffect(() => {
    if (controlledMode) {
      stateManager.addUpdate({ value: props.value });
    }

    stateManager.commitUpdates();
  }, [props.value]);

  return (
    <RadioGroupContext.Provider value={{ stateManager, viewModelManager, dispatcher }}>
      <div>
        {props.children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupProps<T> =
  React.PropsWithChildren<Props<ValueProps<T>, ReadonlyProps, TemplateProps>>;

export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
