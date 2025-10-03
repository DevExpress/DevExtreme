export const getValue = (value: string | undefined): string => value ?? '';

export const isValueChanged = (
  initialValue: string | undefined,
  currentValue: string | undefined,
): boolean => getValue(initialValue) !== getValue(currentValue);
