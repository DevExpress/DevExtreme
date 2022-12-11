import { RadioGroupCore } from '@devextreme/components';
import { BehaviorSubject, Observable } from 'rxjs';
import { doIfContextExist, waitContextAndDo } from '../../internal';
import { RadioGroupValue } from './types';

const DEFAULT_CHECKED_VALUE = false;

function createStandaloneStrategy(): RadioButtonStrategy {
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => true;

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

  const handleChange = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    radioGroupCore$.pipe(
      doIfContextExist(),
    ).subscribe(({ dispatcher }) => {
      dispatcher.dispatch('updateValue', { value: getRadioButtonValue() });
    });

    return false;
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
  handleChange(event: Event): boolean;
  setChecked(value: boolean): void;
  onDestroy: () => void;
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
