import { RadioGroupStore } from '@devextreme/components';
import { BehaviorSubject, Observable } from 'rxjs';
import { doIfContextExist, waitContextAndDo } from '../../internal';
// TODO: Move this code to separate directory radio-common in the future.

const DEFAULT_CHECKED_VALUE = false;

function createStandaloneStrategy(): RadioButtonStrategy {
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => { checkedSubject.next(true); };

  const setChecked = (value: boolean) => { checkedSubject.next(value); };

  const onInit = () => {};

  const onDestroy = () => {};

  return {
    checked$: checkedSubject.asObservable(),
    handleChange,
    setChecked,
    onInit,
    onDestroy,
  };
}

function createRadioGroupStrategy<T>(
  radioGroupCore$: Observable<RadioGroupStore<T> | undefined>,
  getRadioButtonValue: () => T,
): RadioButtonStrategy {
  let unsubscribe: () => void | undefined;
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => {
    radioGroupCore$.pipe(
      doIfContextExist(),
    ).subscribe((store) => {
      store.addUpdate(() => ({ value: getRadioButtonValue() }));
      store.commitUpdates();
    });
  };

  const setChecked = () => {};

  const onInit = () => {
    radioGroupCore$.pipe(waitContextAndDo())
      .subscribe((store) => {
        unsubscribe = store.subscribe(({ value }) => {
          checkedSubject.next(getRadioButtonValue() === value);
        });

        const { value } = store.getState();
        checkedSubject.next(getRadioButtonValue() === value);
      });
  };

  const onDestroy = () => { unsubscribe?.(); };

  return {
    checked$: checkedSubject.asObservable(),
    handleChange,
    setChecked,
    onInit,
    onDestroy,
  };
}

export interface RadioButtonStrategy {
  checked$: Observable<boolean>;
  handleChange(): void;
  setChecked(value: boolean): void;
  onInit(): void;
  onDestroy(): void;
}

export function createRadioButtonStrategy(
  radioGroupCore$: Observable<RadioGroupStore<unknown> | undefined> | undefined,
  getRadioButtonValue: () => unknown,
): RadioButtonStrategy {
  if (radioGroupCore$) {
    return createRadioGroupStrategy(radioGroupCore$, getRadioButtonValue);
  }

  return createStandaloneStrategy();
}
