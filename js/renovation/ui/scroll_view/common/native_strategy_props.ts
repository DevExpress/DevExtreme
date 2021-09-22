import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { nativeScrolling } from '../../../../core/utils/support';
import devices from '../../../../core/devices';
import browser from '../../../../core/utils/browser';
import {
  BaseScrollableProps,
} from './base_scrollable_props';
import { getDefaultNativeRefreshStrategy } from '../utils/get_default_option_value';
import {
  RefreshStrategy,
} from './types.d';

@ComponentBindings()
export class ScrollableNativeProps extends BaseScrollableProps {
  @OneWay() useSimulatedScrollbar: boolean = !!nativeScrolling
  && devices.real().platform === 'android'
  && !browser.mozilla;

  @OneWay() showScrollbar = 'onScroll';

  @OneWay() refreshStrategy: RefreshStrategy = getDefaultNativeRefreshStrategy();
}
