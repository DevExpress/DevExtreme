import type { FilterBuilderTypes } from 'devextreme-react/filter-builder';

type FilterValue = FilterBuilderTypes.Properties['value'];

const TAB_SIZE = 4;

function prepareItem(item: FilterValue, spaces: number): string {
  return Array.isArray(item) && Array.isArray(item[0])
    ? formatValue(item, spaces + TAB_SIZE)
    : JSON.stringify(item);
}

export function formatValue(value: FilterValue, spaces: number = TAB_SIZE): string {
  if (value && Array.isArray(value) && Array.isArray(value[0])) {
    const formattedValue = value
      .map((item) => prepareItem(item, spaces))
      .join(`,${getLineBreak(spaces)}`);

    return `[${getLineBreak(spaces)}${formattedValue}${getLineBreak(spaces - TAB_SIZE)}]`;
  }
  return JSON.stringify(value);
}

function getLineBreak(spaces: number) {
  return `\r\n${new Array(spaces + 1).join(' ')}`;
}
