import { Selector, createSelector } from '@devexpress/core';
import { RadioGroupState } from './state';

export type RadioGroupVMs<T> = Record<symbol, RadioButtonVM<T>>;

export type RadioButtonVM<T> = {
  selected: boolean;
  value: T;
};

export function createRadioButtonSelector<T>(
  optionId: symbol,
): Selector<RadioGroupState<T>, RadioButtonVM<T>> {
    return createSelector(
    (vm: RadioButtonVM<T>) => vm,
    // @ts-ignore
    ({ selectedOption: { id }, options }: RadioGroupState<T>) => ({
      selected: id === optionId,
      value: options[optionId],
    }),
  );
}
