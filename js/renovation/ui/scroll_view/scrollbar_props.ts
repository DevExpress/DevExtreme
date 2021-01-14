import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import { ScrollableDirection, ScrollableShowScrollbar } from './types.d';
import { ScrollableInternalProps } from './scrollable_props';

@ComponentBindings()
export class ScrollbarProps extends ScrollableInternalProps {
  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() hoverStateEnabled?: boolean;

  @OneWay() expandable = true;

  @OneWay() visible = false;

  @OneWay() visibilityMode: ScrollableShowScrollbar = 'onScroll';

  @OneWay() direction: ScrollableDirection = 'vertical';
}
