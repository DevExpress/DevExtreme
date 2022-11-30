import { Handlers } from '@devexpress/core';
import { RadioGroupState } from './state';

export const ACTIONS = {
  selectOption: 'selectOption',
  addOption: 'addOption',
  updateOptionValue: 'updateOptionValue',
  removeOption: 'removeOption',
} as const;

export function selectOptionHandler<T>(
  state: RadioGroupState<T>,
  { optionId }: { optionId: symbol },
): Partial<RadioGroupState<T>> {
  if (!state.options[optionId]) {
    return state;
  }

  return {
    ...state,
    selectedOption: {
      id: optionId,
      value: state.options[optionId],
    },
  };
}

export function addOptionHandler<T>(
  stateValue: RadioGroupState<T>,
  { optionId, value }: { optionId: symbol, value: T },
): Partial<RadioGroupState<T>> {
  if (stateValue.options[optionId]) {
    throw Error(`option with ${optionId.toString()} already exists!`);
  }

  const selectedOption = value === stateValue.selectedOption.value
    ? { id: optionId, value }
    : stateValue.selectedOption;

  return {
    ...stateValue,
    selectedOption,
    options: {
      ...stateValue.options,
      [optionId]: value,
    },
  };
}

export function updateOptionValueHandler<T>(
  stateValue: RadioGroupState<T>,
  { optionId, value }: { optionId: symbol, value: T },
) {
  const selectedOption = value === stateValue.selectedOption.value
    ? { id: optionId, value }
    : stateValue.selectedOption;

  return {
    ...stateValue,
    selectedOption,
    options: {
      ...stateValue.options,
      [optionId]: value,
    },
  };
}

export function removeOptionHandler<T>(
  stateValue: RadioGroupState<T>,
  { optionId }: { optionId: symbol },
) {
  const { [optionId]: optionValue, ...newOptions } = stateValue.options;

  if (!optionValue) {
    return stateValue;
  }

  const selectedOption = optionValue === stateValue.selectedOption.value
    ? { id: undefined, value: undefined }
    : stateValue.selectedOption;

  return {
    ...stateValue,
    selectedOption,
    options: newOptions,
  };
}

export function createActionHandlers<T>(): Handlers<RadioGroupState<T>> {
  return {
    [ACTIONS.selectOption]: selectOptionHandler,
    [ACTIONS.addOption]: addOptionHandler,
    [ACTIONS.updateOptionValue]: updateOptionValueHandler,
    [ACTIONS.removeOption]: removeOptionHandler,
  };
}
