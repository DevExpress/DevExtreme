/* eslint-disable react/destructuring-assignment */
import {
  Actions,
  RadioGroupCore,
} from '@devexpress/components';
import { memo, useCallback } from 'react';
import { useCoreState, useRequiredContext } from '../../internal/hooks';
import { RadioGroupContext } from './radio-group-context';

// NOTE: It's a temporary component for the RadioGroup development
function RadioButtonTmpInternal<T>(props: RadioButtonPropsTmp<T>) {
  const { stateManager, dispatcher } = useRequiredContext<RadioGroupCore<T>>(RadioGroupContext);
  const state = useCoreState(stateManager);

  const selectOption = useCallback(() => {
    dispatcher.dispatch(Actions.updateValue, { value: props.value });
  }, [props.value]);

  const checked = state.value === props.value;
  return (
    // eslint-disable-next-line
    <div
      onClick={selectOption}
      style={{ margin: '10px', cursor: 'pointer' }}
    >
      {checked ? '✅' : '❌'}
    </div>
  );
}

export type RadioButtonPropsTmp<T> = {
  value: T;
};

export const RadioButtonTmp = memo(RadioButtonTmpInternal) as typeof RadioButtonTmpInternal;
