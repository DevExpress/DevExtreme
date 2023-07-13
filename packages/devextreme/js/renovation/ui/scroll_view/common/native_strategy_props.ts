import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

import {
  BaseScrollableProps,
} from './base_scrollable_props';
import { getDefaultNativeRefreshStrategy, getDefaultUseSimulatedScrollbar } from '../utils/get_default_option_value';
import {
  RefreshStrategy,
} from './types';

@ComponentBindings()
export class ScrollableNativeProps extends BaseScrollableProps {
  @OneWay() useSimulatedScrollbar = getDefaultUseSimulatedScrollbar();

  @OneWay() showScrollbar = 'onScroll';

  @OneWay() refreshStrategy: RefreshStrategy = getDefaultNativeRefreshStrategy();
}
