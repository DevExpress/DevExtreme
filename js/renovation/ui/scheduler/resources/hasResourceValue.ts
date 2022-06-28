import { isDefined } from '../../../../core/utils/type';
import { equalByValue } from '../../../../core/utils/common';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type FilterItemType = Record<string, string | number> | string | number;

export const hasResourceValue = (
  resourceValues: FilterItemType[],
  itemValue: FilterItemType,
): boolean => isDefined(resourceValues.find(
  (value) => equalByValue(value, itemValue),
));
