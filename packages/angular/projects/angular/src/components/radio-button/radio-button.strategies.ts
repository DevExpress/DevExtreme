import { createCheckedSelector, RADIO_GROUP_ACTIONS, RadioGroupStore } from '@devextreme/components';
import {
  BehaviorSubject, Observable, Subject, switchMap, takeUntil,
} from 'rxjs';
import { doIfContextExist, useStoreSelector, waitContextAndDo } from '../../internal';

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
  radioGroupStore$: Observable<RadioGroupStore<T> | undefined>,
  getRadioButtonValue: () => T,
): RadioButtonStrategy {
  const destroy$ = new Subject<void>();
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => {
    radioGroupStore$.pipe(
      doIfContextExist(),
    ).subscribe((store) => {
      store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(getRadioButtonValue()));
      store.commitUpdates();
    });
  };

  const setChecked = () => {};

  const onInit = () => {
    radioGroupStore$.pipe(
      waitContextAndDo(),
      switchMap((store) => useStoreSelector(store, createCheckedSelector(getRadioButtonValue()))),
      takeUntil(destroy$),
    ).subscribe((checked) => { checkedSubject.next(checked); });
  };

  const onDestroy = () => {
    destroy$.next();
    destroy$.complete();
  };

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
  radioGroupStore$: Observable<RadioGroupStore<unknown> | undefined> | undefined,
  getRadioButtonValue: () => unknown,
): RadioButtonStrategy {
  if (radioGroupStore$) {
    return createRadioGroupStrategy(radioGroupStore$, getRadioButtonValue);
  }

  return createStandaloneStrategy();
}
