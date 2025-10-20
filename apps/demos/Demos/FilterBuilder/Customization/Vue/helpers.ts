const TAB_SIZE = 4;

export function formatValue(value: string | Function | any[], spaces = TAB_SIZE): string {
  if (value && Array.isArray(value) && Array.isArray(value[0])) {
    return `[${getLineBreak(spaces)}${value.map((item) => (Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item))).join(`,${getLineBreak(spaces)}`)}${getLineBreak(spaces - TAB_SIZE)}]`;
  }
  return JSON.stringify(value);
}

function getLineBreak(spaces: number) {
  return `\r\n${new Array(spaces + 1).join(' ')}`;
}
