import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import devices from '../../../../core/devices';
import browser from '../../../../core/utils/browser';
import { ScrollableSimulatedProps } from './simulated_strategy_props';
import { nativeScrolling } from '../../../../core/utils/support';
import { getDefaultUseNative, getDefaultNativeRefreshStrategy } from '../utils/get_default_option_value';
import { RefreshStrategy } from './types.d';

@ComponentBindings()
export class ScrollableProps extends ScrollableSimulatedProps {
  @OneWay() useNative = getDefaultUseNative();

  @OneWay() useSimulatedScrollbar = !!nativeScrolling
  && devices.real().platform === 'android'
  && !browser.mozilla;

  @OneWay() refreshStrategy: RefreshStrategy = getDefaultNativeRefreshStrategy();
}
