import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
} from 'devextreme-generator/component_declaration/common';

import { ScrollableDirection, ScrollableShowScrollbar } from './types.d';
import { ScrollableInternalProps } from './scrollable_props';
import { EventCallback } from '../common/event_callback';
import { TopPocketState } from './common/consts';

@ComponentBindings()
export class ScrollbarProps extends ScrollableInternalProps {
  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() hoverStateEnabled?: boolean;

  @OneWay() expandable = true;

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() scaleRatio = 1;

  @OneWay() containerSize = 0;

  @OneWay() contentSize = 0;

  @OneWay() baseContainerSize = 0;

  @OneWay() baseContentSize = 0;

  @OneWay() topPocketSize = 0;

  @OneWay() bottomPocketSize = 0;

  @OneWay() scrollableOffset = 0;

  @OneWay() scrollByThumb = false;

  @OneWay() scrollScrollbar: ScrollableShowScrollbar = 'onScroll';

  @OneWay() isScrollableHovered = false;

  @OneWay() bounceEnabled = true;

  @OneWay() forceVisibility = false;

  @TwoWay() pocketState = TopPocketState.STATE_RELEASED;

  @Event() onAnimatorStart?: (animator: 'inertia'| 'bounce', velocity?: number, thumbScrolling?: boolean, crossThumbScrolling?: boolean) => void;

  @Event() onAnimatorCancel?: EventCallback;

  @Event() pocketStateChange?: EventCallback<number>;

  @Event() onPullDown?: EventCallback;

  @Event() onReachBottom?: EventCallback;

  @Event() onRelease?: EventCallback;
}
