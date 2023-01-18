import {
  createRadioGroupCore,
} from '@devextreme/components';
import {
  Children, cloneElement, isValidElement, memo, useMemo,
} from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { EditorProps } from '../../internal/props';
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
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupProps<T> =
  React.PropsWithChildren<EditorProps<T>>;

//* Component={"name":"RadioGroup"}
export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
