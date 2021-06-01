import {
  ComponentBindings,
  OneWay,
  Event,
} from '@devextreme-generator/declarations';

import noop from '../../utils/noop';
import { TopPocketState } from './common/consts';

@ComponentBindings()
export class ScrollbarProps {
  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() hoverStateEnabled?: boolean;

  @OneWay() containerSize = 0;

  @OneWay() contentSize = 0;

  @OneWay() topPocketSize = 0;

  @OneWay() bottomPocketSize = 0;

  @OneWay() scrollableOffset = 0;

  @OneWay() isScrollableHovered = false;

  @OneWay() forceVisibility = false;

  @OneWay() forceUpdateScrollbarLocation = false;

  @OneWay() scrollLocation = 0;

  @OneWay() pocketState = TopPocketState.STATE_RELEASED;

  @Event() onAnimatorStart?: (animator: 'inertia' | 'bounce', velocity?: number, thumbScrolling?: boolean, crossThumbScrolling?: boolean) => void;

  @Event() onAnimatorCancel?: () => void = noop;

  @Event() onPullDown?: () => void = noop;

  @Event() onReachBottom?: () => void = noop;

  @Event() onRelease?: () => void = noop;

  @Event() onScroll?: () => void = noop;

  @Event() onEnd?: (direction: string) => void = noop;
}
