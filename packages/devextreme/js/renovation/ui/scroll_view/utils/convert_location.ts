import {
  isDefined,
  isPlainObject,
} from '../../../../core/utils/type';
import {
  ScrollableDirection,
  ScrollOffset,
} from '../common/types';
import { ensureDefined } from '../../../../core/utils/common';
import {
  ScrollDirection,
} from './scroll_direction';

export function convertToLocation(
  location: number | Partial<{ x: number; y: number; top: number; left: number }>,
  direction: ScrollableDirection,
): Partial<ScrollOffset> {
  if (isPlainObject(location)) {
    const left = ensureDefined(location.left, location.x);
    const top = ensureDefined(location.top, location.y);
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
