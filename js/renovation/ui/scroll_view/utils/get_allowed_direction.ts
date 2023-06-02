import { DIRECTION_BOTH, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../common/consts';
import { ScrollableDirection } from '../common/types';
import { ScrollDirection } from './scroll_direction';

export function allowedDirection(
  direction: ScrollableDirection,
  scrollTopMax: number,
  scrollLeftMax: number,
  bounceEnabled: boolean,
): ScrollableDirection | undefined {
  const { isVertical, isHorizontal, isBoth } = new ScrollDirection(direction);

  const vDirectionAllowed = isVertical && (scrollTopMax > 0 || bounceEnabled);
  const hDirectionAllowed = isHorizontal && (scrollLeftMax > 0 || bounceEnabled);

  if (isBoth && vDirectionAllowed && hDirectionAllowed) {
    return DIRECTION_BOTH;
  } if (isHorizontal && hDirectionAllowed) {
    return DIRECTION_HORIZONTAL;
  } if (isVertical && vDirectionAllowed) {
    return DIRECTION_VERTICAL;
  }
  return undefined;
}
