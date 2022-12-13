import { RadioGroupCore } from '@devextreme/components';
import { BehaviorSubject, Observable } from 'rxjs';
import { doIfContextExist, waitContextAndDo } from '../../internal';
// TODO: Move this code to separate directory radio-common in the future.
import { RadioGroupValue } from '../radio-group/types';

const DEFAULT_CHECKED_VALUE = false;

function createStandaloneStrategy(): RadioButtonStrategy {
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => {};

  const setChecked = (value: boolean) => { checkedSubject.next(value); };

  const onDestroy = () => {};

  return {
    checked$: checkedSubject.asObservable(),
    handleChange,
    setChecked,
    onDestroy,
  };
}

function createRadioGroupStrategy(
  radioGroupCore$: Observable<RadioGroupCore<RadioGroupValue> | undefined>,
  getRadioButtonValue: () => RadioGroupValue,
): RadioButtonStrategy {
  let unsubscribe: () => void | undefined;
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  radioGroupCore$.pipe(waitContextAndDo())
    .subscribe(({ stateManager }) => {
      unsubscribe = stateManager.subscribe(({ value }) => {
        checkedSubject.next(getRadioButtonValue() === value);
      });

      const { value } = stateManager.getState();
      checkedSubject.next(getRadioButtonValue() === value);
    });

  const handleChange = () => {
    radioGroupCore$.pipe(
      doIfContextExist(),
    ).subscribe(({ dispatcher }) => {
      dispatcher.dispatch('updateValue', { value: getRadioButtonValue() });
    });
  };

  const setChecked = () => {};

  const onDestroy = () => { unsubscribe?.(); };

  return {
    checked$: checkedSubject.asObservable(),
    handleChange,
    setChecked,
    onDestroy,
  };
}

export interface RadioButtonStrategy {
  checked$: Observable<boolean>;
  handleChange(): void;
  setChecked(value: boolean): void;
  onDestroy(): void;
}

export function createRadioButtonStrategy(
  radioGroupCore$: Observable<RadioGroupCore<RadioGroupValue> | undefined> | undefined,
  getRadioButtonValue: () => RadioGroupValue,
): RadioButtonStrategy {
  if (radioGroupCore$) {
    return createRadioGroupStrategy(radioGroupCore$, getRadioButtonValue);
  }

  return createStandaloneStrategy();
}
