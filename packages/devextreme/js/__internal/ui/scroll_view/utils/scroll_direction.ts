import type { ScrollDirection as Direction } from '@js/common';

import {
  DIRECTION_BOTH,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
} from '../consts';

export class ScrollDirection {
  direction: Direction;

  readonly DIRECTION_HORIZONTAL = 'horizontal';

  readonly DIRECTION_VERTICAL = 'vertical';

  readonly DIRECTION_BOTH = 'both';

  constructor(direction?: Direction) {
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
