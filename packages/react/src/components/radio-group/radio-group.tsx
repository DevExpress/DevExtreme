/* eslint-disable react/destructuring-assignment */
import {
  RadioGroupState,
  createRadioGroupCore,
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devexpress/components';
import { getKeys } from '@devexpress/core';
import React, { memo, useMemo } from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { Props } from '../../internal/props';
import { RadioGroupContext } from './radio-group-context';

function RadioGroupInternal<T>(
  props: RadioGroupProps<T>,
) {
  const controlledMode = useMemo(() => props.defaultValue === undefined, []);
  const valueChange = useCallbackRef(props.valueChange);

  const [stateManager, viewModelManager, dispatcher] = useMemo(() => createRadioGroupCore<T>({
    selectedOption: {
      id: undefined,
      value: controlledMode ? props.value : props.defaultValue,
    },
    options: {},
  }, {
    selectedOption: {
      controlledMode,
      changeCallback: (selectedOption) => { valueChange.current(selectedOption.value); },
    },
  }), []);

  useSecondEffect(() => {
    if (controlledMode) {
      stateManager.addUpdate((stateValue: RadioGroupState<T>) => {
        const { value } = props;
        const existingOptionId = getKeys(stateValue.options)
          .find((id) => stateValue.options[id] === value);

        return {
          selectedOption: {
            id: existingOptionId,
            value,
          },
        };
      });
    }
  }, [props.value]);

  return (
    <RadioGroupContext.Provider value={[viewModelManager, dispatcher]}>
      <div>
        {props.children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupProps<T> =
  React.PropsWithChildren<Props<ValueProps<T>, ReadonlyProps, TemplateProps>>;

export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
