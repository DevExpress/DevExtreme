import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { nativeScrolling } from '../../../../core/utils/support';
import devices from '../../../../core/devices';
import browser from '../../../../core/utils/browser';
import {
  BaseScrollableProps,
} from './base_scrollable_props';

@ComponentBindings()
export class ScrollableNativeProps extends BaseScrollableProps {
  @OneWay() useSimulatedScrollbar: boolean = !!nativeScrolling
  && devices.real().platform === 'android'
  && !browser.mozilla;

  @OneWay() showScrollbar = 'onScroll';
}
