import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow, hasWindow } from '@js/core/utils/window';

export type ThemeMode = 'light' | 'dark';

export const THEME_MODE_PROPERTY = '--dx-theme-mode';

export function resolvedThemeMode(
  element: Element | dxElementWrapper,
): ThemeMode | null {
  const node = $(element).get(0);
  const window = hasWindow() ? getWindow() : undefined;

  if (!node || !window?.getComputedStyle) {
    return null;
  }

  const declared = window.getComputedStyle(node).getPropertyValue(THEME_MODE_PROPERTY).trim();

  return declared === 'light' || declared === 'dark' ? declared : null;
}
