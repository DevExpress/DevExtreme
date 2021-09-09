import { getWindow, hasWindow } from '../../core/utils/window';

const window = getWindow();
const DEFAULT_OFFSET = { top: 0, left: 0 };

export function getElementOffset(el: Element | null | undefined): { top: number; left: number } {
  if (el && hasWindow()) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
  }

  return DEFAULT_OFFSET;
}
