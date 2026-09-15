import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow, hasWindow } from '@js/core/utils/window';

export type ThemeMode = 'light' | 'dark';

/*
 * Published by a theme on every mode scope it declares. `dx-theme-mode-inverted` asks for the
 * opposite of its surroundings, so ancestor classes never answer which mode an element ended up
 * in - only the cascade does, and this property is where it says so.
 */
export const THEME_MODE_PROPERTY = '--dx-theme-mode';

/** The mode an element resolves to; null when nothing declared one, or named no mode. */
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
