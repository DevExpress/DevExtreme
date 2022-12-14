import {
  createRadioGroupCore, ReadonlyProps, TemplateProps, ValueProps,
} from '@devextreme/components';
import { AnyRecord, Dispatcher, UnknownRecord } from '@devextreme/core';
import { memo, useMemo } from 'react';
import { useCallbackRef, useSecondEffect } from '../../internal/hooks';
import { Props } from '../../internal/props';
import { RadioGroupContext } from './radio-group-context';

type Handler<TState, TValue> = (state: TState, value: TValue) => Partial<TState>;
type Handlers<
  TState extends UnknownRecord,
  TActions extends UnknownRecord = AnyRecord,
> = {
  [K in keyof TActions]: Handler<TState, TActions[K]>
};

function wrapUncontrolled<T, S extends UnknownRecord, H extends Handlers<S>>(
  dispatch: Dispatcher<S, H>['dispatch'],
  wrappedAction: string,
  controlled: boolean,
  changeHandler: RadioGroupProps<T>['valueChange'],
) {
  return <TAction extends keyof H>(
    action: TAction,
    value: Parameters<H[TAction]>[1],
  ) => {
    if (action === wrappedAction) {
      if (changeHandler) {
        changeHandler(value.value);
      }
      if (!controlled) {
        dispatch(action, value);
      }
    }
  };
}

function RadioGroupInternal<T extends RadioGroupValue>(props: RadioGroupProps<T>) {
  const controlledMode = useMemo(() => Object.hasOwnProperty.call(props, 'value'), []);
  const valueChange = useCallbackRef(props.valueChange);

  const { stateManager, viewModelManager, dispatcher } = useMemo(() => createRadioGroupCore<T>({
    value: controlledMode ? props.value : props.defaultValue,
  }, {
    value: {
      controlledMode: false,
      changeCallback: (value) => { valueChange.current(value); },
    },
  }), []);

  useSecondEffect(() => {
    if (controlledMode) {
      stateManager.addUpdate({ value: props.value });
    }

    stateManager.commitUpdates();
  }, [props.value]);

  dispatcher.dispatch = wrapUncontrolled(
    dispatcher.dispatch,
    'updateValue',
    controlledMode,
    valueChange.current,
  );

  return (
    <RadioGroupContext.Provider value={{ stateManager, viewModelManager, dispatcher }}>
      <div>
        {props.children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupValue = string | number;

export type RadioGroupProps<T> =
  React.PropsWithChildren<Props<ValueProps<T>, ReadonlyProps, TemplateProps>>;

export const RadioGroup = memo(RadioGroupInternal) as typeof RadioGroupInternal;
