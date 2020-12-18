import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import { ScrollableDirection, ShowScrollBarMode } from './types.d';
import { ScrollableInternalProps } from './scrollable_props';

@ComponentBindings()
export class ScrollBarProps extends ScrollableInternalProps {
  @OneWay() showScrollbar?: ShowScrollBarMode;

  @OneWay() direction: ScrollableDirection = 'vertical';
}
