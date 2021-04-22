import {
  isNumeric,
} from '../../../../core/utils/type';

import {
  ScrollableLocation,
} from '../types';

export function getAugmentedLocation(
  location: number | Partial<ScrollableLocation>,
): ScrollableLocation {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    };
  }
  return { top: 0, left: 0, ...location };
}
