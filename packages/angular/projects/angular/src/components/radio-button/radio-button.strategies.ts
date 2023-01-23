import {
  createCheckedSelector,
  RADIO_GROUP_ACTIONS,
  RadioGroupStore,
} from '@devextreme/components';
import {
  BehaviorSubject,
  Observable,
  Subject,
  take, takeUntil,
} from 'rxjs';
import { useSelector } from '../../internal';

const DEFAULT_CHECKED_VALUE = false;

function createStandaloneStrategy<T>(): RadioButtonStrategy<T> {
  const valueSubject = new BehaviorSubject<T | undefined>(undefined);
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => { checkedSubject.next(true); };

  const setChecked = (value: boolean) => { checkedSubject.next(value); };

  const setValue = () => {};

  const onInit = () => {};

  const onDestroy = () => {};

  return {
    checked$: checkedSubject.asObservable(),
    value$: valueSubject.asObservable(),
    handleChange,
    setChecked,
    setValue,
    onInit,
    onDestroy,
  };
}

function createRadioGroupStrategy<T>(
  store: RadioGroupStore<T>,
): RadioButtonStrategy<T> {
  const destroy$ = new Subject<void>();
  const valueSubject = new BehaviorSubject<T | undefined>(undefined);
  const checkedSubject = new BehaviorSubject<boolean>(DEFAULT_CHECKED_VALUE);

  const handleChange = () => {
    valueSubject.pipe(take(1)).subscribe((value) => {
      store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(value));
      store.commitUpdates();
    });
  };

  const setChecked = () => {};

  const setValue = (value: T | undefined) => { valueSubject.next(value); };

  const onInit = () => {
    useSelector(store, createCheckedSelector, [valueSubject])
      .pipe(takeUntil(destroy$))
      .subscribe((checked) => { checkedSubject.next(checked); });
  };

  const onDestroy = () => {
    destroy$.next();
    destroy$.complete();
  };

  return {
    checked$: checkedSubject.asObservable(),
    value$: valueSubject.asObservable(),
    handleChange,
    setChecked,
    setValue,
    onInit,
    onDestroy,
  };
}

export interface RadioButtonStrategy<T> {
  checked$: Observable<boolean>;
  value$: Observable<T | undefined>;
  handleChange(): void;
  setChecked(value: boolean): void;
  setValue(value: T | undefined): void;
  onInit(): void;
  onDestroy(): void;
}

export function createRadioButtonStrategy<T>(
  store: RadioGroupStore<T> | undefined,
): RadioButtonStrategy<T> {
  if (store) {
    return createRadioGroupStrategy(store);
  }

  return createStandaloneStrategy();
}
