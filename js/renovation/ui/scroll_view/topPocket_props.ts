import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import {
  RefreshStrategy,
} from './types.d';

@ComponentBindings()
export class TopPocketProps {
  @OneWay() refreshStrategy?: RefreshStrategy;

  @OneWay() pullingDownText?: string;

  @OneWay() pulledDownText?: string;

  @OneWay() refreshingText?: string;
}
