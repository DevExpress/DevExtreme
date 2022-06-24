import { isObject } from '../../../../core/utils/type';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type FilterItemType = Record<string, string | number> | string | number;

export const prepareItemForFilter = (
  item: FilterItemType,
): FilterItemType => (isObject(item)
  ? JSON.stringify(item)
  : item
);
