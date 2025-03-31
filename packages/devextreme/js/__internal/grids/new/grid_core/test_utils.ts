export function isRendererContains(
  element: string | Element | null,
  substring: string,
  matchCount?: number,
): boolean {
  let markup = '';
  if (element === null) {
    throw new Error('There is no such element');
  } else if (element instanceof Element) {
    markup = element.innerHTML;
  } else {
    markup = element;
  }

  const matches = markup.split(substring).length - 1;
  const result = matchCount === undefined ? matches > 0 : matches === matchCount;
  return result;
}
