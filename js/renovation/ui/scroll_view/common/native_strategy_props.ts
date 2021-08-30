import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { getDefaultUseSimulatedScrollbar } from '../utils/get_default_option_value';
import {
  BaseScrollableProps,
} from './base_scrollable_props';

@ComponentBindings()
export class ScrollableNativeProps extends BaseScrollableProps {
  @OneWay() useSimulatedScrollbar: boolean = getDefaultUseSimulatedScrollbar();
}
