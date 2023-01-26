import {
  isNumeric,
} from '../../../../core/utils/type';

import {
  ScrollOffset,
} from '../common/types';

export function getAugmentedLocation(
  location: number | Partial<ScrollOffset>,
): ScrollOffset {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    };
  }
  return { top: 0, left: 0, ...location };
}
