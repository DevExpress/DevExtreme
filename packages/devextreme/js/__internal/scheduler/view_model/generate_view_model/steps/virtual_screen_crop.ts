import type { GroupIndex } from '../../types';
import type { Geometry, VirtualCropOptions } from './add_geometry/types';

export const cropByVirtualScreen = <T extends GroupIndex & Geometry>(
  entities: T[],
  { isVirtualScrolling, getVirtualScreen }: VirtualCropOptions,
): T[] => {
  if (!isVirtualScrolling) {
    return entities;
  }

  return entities.reduce<T[]>((acc, item) => {
    const screen = getVirtualScreen(item.groupIndex);
    const isInsideVirtualScreen = !(
      item.left + item.width < screen.left
      || item.left > screen.right
      || item.top + item.height < screen.top
      || item.top > screen.bottom
    );

    if (isInsideVirtualScreen) {
      const right = item.left + item.width;
      const bottom = item.top + item.height;
      const left = Math.max(screen.left, item.left);
      const top = Math.max(screen.top, item.top);
      const width = Math.min(screen.right, right) - left;
      const height = Math.min(screen.bottom, bottom) - top;

      acc.push({
        ...item, left, width, top, height,
      });
    }

    return acc;
  }, []);
};
