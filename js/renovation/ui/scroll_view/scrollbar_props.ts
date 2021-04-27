import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
} from '@devextreme-generator/declarations';

import { EventCallback } from '../common/event_callback';
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

  @TwoWay() pocketState = TopPocketState.STATE_RELEASED; // TODO: avoid twoWay

  @Event() onAnimatorStart?: (animator: 'inertia'| 'bounce', velocity?: number, thumbScrolling?: boolean, crossThumbScrolling?: boolean) => void;

  @Event() onAnimatorCancel?: EventCallback;

  @Event() pocketStateChange?: EventCallback<number>;

  @Event() onPullDown?: EventCallback;

  @Event() onReachBottom?: EventCallback;

  @Event() onRelease?: EventCallback;
}
