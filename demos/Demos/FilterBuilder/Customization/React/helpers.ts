const TAB_SIZE = 4;

function prepareItem(item, spaces) {
  return Array.isArray(item[0])
    ? formatValue(item, spaces + TAB_SIZE)
    : JSON.stringify(item);
}

export function formatValue(value, spaces = TAB_SIZE) {
  if (value && Array.isArray(value[0])) {
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
