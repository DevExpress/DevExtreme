import { equalByValue } from '../../../../core/utils/common';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type FilterItemType = Record<string, string | number> | string | number;

export const hasResourceValue = (
  resourceValues: FilterItemType[],
  itemValue: FilterItemType,
): boolean => resourceValues
  .filter((value) => equalByValue(value, itemValue))
  .length > 0;
