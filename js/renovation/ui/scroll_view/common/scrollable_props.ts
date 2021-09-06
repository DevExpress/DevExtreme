import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import devices from '../../../../core/devices';
import browser from '../../../../core/utils/browser';
import { ScrollableSimulatedProps } from './simulated_strategy_props';
import { nativeScrolling } from '../../../../core/utils/support';

@ComponentBindings()
export class ScrollableProps extends ScrollableSimulatedProps {
  @OneWay() useSimulatedScrollbar = !!nativeScrolling
  && devices.real().platform === 'android'
  && !browser.mozilla;
}
