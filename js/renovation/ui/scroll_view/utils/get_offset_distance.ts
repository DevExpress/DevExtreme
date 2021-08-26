import {
  ScrollableDirection,
  ScrollOffset,
} from '../types.d';
import { ensureDefined } from '../../../../core/utils/common';
import {
  convertToLocation,
} from './convert_location';

export function getOffsetDistance(
  targetLocation: number | Partial<ScrollOffset>,
  direction: ScrollableDirection,
  scrollOffset: ScrollOffset,
):
  { left: number; top: number } {
  const location = convertToLocation(targetLocation, direction);

  const top = ensureDefined(location.top, scrollOffset.top) - scrollOffset.top;
  const left = ensureDefined(location.left, scrollOffset.left) - scrollOffset.left;

  return { top, left };
}
