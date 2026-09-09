import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow, hasWindow } from '@js/core/utils/window';

export type ThemeMode = 'light' | 'dark';

/*
 * What a theme that ships more than one colour mode publishes on every scope it declares
 * (widgets/fluent-next/_design-system.scss). `dx-theme-mode-inverted` asks for the opposite of its
 * surroundings, so reading the classes on the way up never answers which mode an element ended up
 * in - only the cascade does, and this property is where it says so.
 */
export const THEME_MODE_PROPERTY = '--dx-theme-mode';

/**
 * The mode an element resolves to, or null when the theme scopes no modes and declares nothing.
 * A value naming no mode is treated the same way: the contract is `light` or `dark`.
 */
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
