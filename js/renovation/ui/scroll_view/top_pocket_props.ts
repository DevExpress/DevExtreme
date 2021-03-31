import {
  ComponentBindings,
  OneWay,
} from '@devextreme-generator/declarations';

import {
  RefreshStrategy,
} from './types.d';

export const TopPocketState = {
  STATE_RELEASED: 0,
  STATE_READY: 1,
  STATE_REFRESHING: 2,
  STATE_LOADING: 3,
};

@ComponentBindings()
export class TopPocketProps {
  @OneWay() refreshStrategy?: RefreshStrategy;

  @OneWay() pullingDownText?: string;

  @OneWay() pulledDownText?: string;

  @OneWay() refreshingText?: string;
}
