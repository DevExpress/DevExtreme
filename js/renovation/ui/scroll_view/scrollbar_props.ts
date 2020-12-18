import {
  ComponentBindings,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import { ScrollableDirection, ScrollableShowScrollbar } from './types.d';
import { ScrollableInternalProps } from './scrollable_props';

@ComponentBindings()
export class ScrollbarProps extends ScrollableInternalProps {
  @OneWay() showScrollbar?: ScrollableShowScrollbar;

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() scrollByThumb = false;
}
