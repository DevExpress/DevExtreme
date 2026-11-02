import type { ScrollDirection as Direction } from '@js/common';
import {
  isDefined,
  isPlainObject,
} from '@js/core/utils/type';
import type {
  ScrollOffset,
} from '@ts/ui/scroll_view/types';

import {
  ScrollDirection,
} from './scroll_direction';

export function convertToLocation(
  location: number | Partial<ScrollOffset>,
  direction: Direction,
): Partial<ScrollOffset> {
  if (isPlainObject(location)) {
    const { left, top } = location;
    return {
      left: isDefined(left) ? left : undefined,
      top: isDefined(top) ? top : undefined,
    };
  }

  const { isVertical, isHorizontal } = new ScrollDirection(direction);
  return {
    left: isHorizontal && isDefined(location) ? location : undefined,
    top: isVertical && isDefined(location) ? location : undefined,
  };
}
