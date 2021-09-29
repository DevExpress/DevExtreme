import {
  ScrollableDirection,
  ScrollOffset,
} from '../types.d';
import { ensureDefined } from '../../../../core/utils/common';
import {
  restoreLocation,
} from './restore_location';

export function getOffsetDistance(
  targetLocation: number | Partial<ScrollOffset>,
  direction: ScrollableDirection,
  scrollOffset: ScrollOffset,
):
  { left: number; top: number } {
  const location = restoreLocation(targetLocation, direction);

  const top = -scrollOffset.top - ensureDefined(location.top, -scrollOffset.top);
  const left = -scrollOffset.left - ensureDefined(location.left, -scrollOffset.left);

  return { top, left };
}
