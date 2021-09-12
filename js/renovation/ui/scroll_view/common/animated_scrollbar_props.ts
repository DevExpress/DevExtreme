import {
  OneWay,
  ComponentBindings,
  Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';
import { ScrollbarProps } from './scrollbar_props';

@ComponentBindings()
export class AnimatedScrollbarProps extends ScrollbarProps {
  @OneWay() topPocketSize = 0;

  @OneWay() bottomPocketSize = 0;

  @OneWay() contentPaddingBottom = 0;

  @Event() onBounce?: EventCallback;

  @Event() onLock?: EventCallback;

  @Event() onUnlock?: EventCallback;

  @Event() onPullDown?: EventCallback;

  @Event() onReachBottom?: EventCallback;

  @Event() onRelease?: EventCallback;

  @Event() onEnd?: EventCallback<string>;
}
