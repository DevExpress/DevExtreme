export function formatValue(value, spaces) {
  if (value && Array.isArray(value[0])) {
    const TAB_SIZE = 4;
    spaces = spaces || TAB_SIZE;
    return `[${getLineBreak(spaces)}${value.map((item) => (Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item))).join(`,${getLineBreak(spaces)}`)}${getLineBreak(spaces - TAB_SIZE)}]`;
  }
  return JSON.stringify(value);
}

function getLineBreak(spaces) {
  return `\r\n${new Array(spaces + 1).join(' ')}`;
}
