export function getElementOffset(elem?: Element):
{ top: number; left: number } | null {
  if (!elem) return null;

  const rect = elem.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}
