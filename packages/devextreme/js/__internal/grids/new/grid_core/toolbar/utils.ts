import type { ToolbarItems, ToolbarVisible } from './types';

export function isVisible(
  visibleConfig: ToolbarVisible,
  items: ToolbarItems,
): boolean {
  if (visibleConfig === undefined) {
    return items.length > 0;
  }

  return visibleConfig;
}
