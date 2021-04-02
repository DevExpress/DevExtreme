import {
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
} from '../common/consts';

import {
  ScrollableDirection,
} from '../types.d';

export class ScrollDirection {
  direction: ScrollableDirection;

  readonly DIRECTION_HORIZONTAL = 'horizontal';

  readonly DIRECTION_VERTICAL = 'vertical';

  readonly DIRECTION_BOTH = 'both';

  constructor(direction?: ScrollableDirection) {
    this.direction = direction ?? DIRECTION_VERTICAL;
  }

  get isHorizontal(): boolean {
    return this.direction === DIRECTION_HORIZONTAL || this.direction === DIRECTION_BOTH;
  }

  get isVertical(): boolean {
    return this.direction === DIRECTION_VERTICAL || this.direction === DIRECTION_BOTH;
  }

  get isBoth(): boolean {
    return this.direction === DIRECTION_BOTH;
  }
}
