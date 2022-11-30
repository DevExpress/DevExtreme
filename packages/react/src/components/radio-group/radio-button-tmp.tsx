/* eslint-disable react/destructuring-assignment */
import { ACTIONS, createRadioButtonSelector, RadioGroupContextData } from '@devexpress/components';
import React, {
  memo, useCallback, useEffect, useMemo,
} from 'react';
import { useCoreContext, useSecondEffect } from '../../internal/hooks';
import { useViewModel } from '../../internal/hooks/use-view-model';
import { RadioGroupContext } from './radio-group-context';

// NOTE: It's a temporary component for the RadioGroup development
function RadioButtonInternal<T>(props: RadioButtonPropsTmp<T>) {
  const [viewModelManager, dispatcher] = useCoreContext<RadioGroupContextData<T>>(
    RadioGroupContext,
  );

  // NOTE: Called twice in the StrictMode and causes a lot of problems.
  // So, we cannot create the unique id with a symbol here.
  const optionId = useMemo(() => Symbol('dxRadioButton'), []);
  const viewModel = useMemo(() => {
    dispatcher.dispatch(ACTIONS.addOption, { optionId, value: props.value });
    viewModelManager.add({
      [optionId]: createRadioButtonSelector<T>(optionId),
    });

    return viewModelManager.get()[optionId]!;
  }, []);
  const dataToRender = useViewModel(viewModel);

  useSecondEffect(() => {
    dispatcher.dispatch(ACTIONS.updateOptionValue, { optionId, value: props.value });
  }, [props.value]);

  useEffect(() => () => {
    dispatcher.dispatch(ACTIONS.removeOption, { optionId });
  }, []);

  const selectOption = useCallback(() => {
    dispatcher.dispatch(ACTIONS.selectOption, { optionId });
  }, []);

  return (
    // eslint-disable-next-line
    <div
      onClick={selectOption}
      style={{ margin: '10px', cursor: 'pointer' }}
    >
      {dataToRender.selected ? '✅' : '❌'}
    </div>
  );
}

export type RadioButtonPropsTmp<T> = {
  value: T;
};

export const RadioButtonTmp = memo(RadioButtonInternal) as typeof RadioButtonInternal;
