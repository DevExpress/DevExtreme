import type { GroupIndex } from '../../types';
import type { Geometry, VirtualCropOptions } from './add_geometry/types';

export const cropByVirtualScreen = <T extends GroupIndex & Geometry>(
  entities: T[],
  { isVirtualScrolling, getVirtualBounds }: VirtualCropOptions,
): T[] => {
  if (!isVirtualScrolling) {
    return entities;
  }

  return entities.reduce<T[]>((acc, item) => {
    const {
      hMax, hMin, vMax, vMin,
    } = getVirtualBounds(item.groupIndex);
    const isInsideVirtualScreen = !(
      item.left + item.width < hMin
      || item.left > hMax
      || item.top + item.height < vMin
      || item.top > vMax
    );

    if (isInsideVirtualScreen) {
      const right = item.left + item.width;
      const bottom = item.top + item.height;
      const left = Math.max(hMin, item.left);
      const top = Math.max(vMin, item.top);
      const width = Math.min(hMax, right) - left;
      const height = Math.min(vMax, bottom) - top;

      acc.push({
        ...item, left, width, top, height,
      });
    }

    return acc;
  }, []);
};
