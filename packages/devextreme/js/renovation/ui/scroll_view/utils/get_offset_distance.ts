import {
  ScrollOffset,
} from '../common/types';
import { ensureDefined } from '../../../../core/utils/common';

export function getOffsetDistance(
  targetLocation: Partial<ScrollOffset>,
  scrollOffset: ScrollOffset,
): { left: number; top: number } {
  return {
    top: ensureDefined(targetLocation.top, scrollOffset.top) - scrollOffset.top,
    left: ensureDefined(targetLocation.left, scrollOffset.left) - scrollOffset.left,
  };
}
