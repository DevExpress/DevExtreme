import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../common/consts';
import { ScrollableDirection } from '../common/types';

export function permissibleWheelDirection(
  direction: ScrollableDirection,
  isShiftKey: boolean,
): ScrollableDirection {
  switch (direction) {
    case DIRECTION_HORIZONTAL:
      return DIRECTION_HORIZONTAL;
    case DIRECTION_VERTICAL:
      return DIRECTION_VERTICAL;
    default:
      return isShiftKey ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL;
  }
}
