import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import { getDefaultUseSimulatedScrollbar } from '../utils/get_default_option_value';
import { ScrollableSimulatedProps } from './simulated_strategy_props';

@ComponentBindings()
export class ScrollableProps extends ScrollableSimulatedProps {
  @OneWay() useSimulatedScrollbar = getDefaultUseSimulatedScrollbar();
}
