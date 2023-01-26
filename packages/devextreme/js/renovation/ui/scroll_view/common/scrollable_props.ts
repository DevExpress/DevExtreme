import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import { ScrollableSimulatedProps } from './simulated_strategy_props';
import {
  getDefaultUseNative,
  getDefaultNativeRefreshStrategy,
  getDefaultUseSimulatedScrollbar,
} from '../utils/get_default_option_value';
import { RefreshStrategy } from './types';

@ComponentBindings()
export class ScrollableProps extends ScrollableSimulatedProps {
  @OneWay() useNative = getDefaultUseNative();

  @OneWay() useSimulatedScrollbar = getDefaultUseSimulatedScrollbar();

  @OneWay() refreshStrategy: RefreshStrategy = getDefaultNativeRefreshStrategy();
}
