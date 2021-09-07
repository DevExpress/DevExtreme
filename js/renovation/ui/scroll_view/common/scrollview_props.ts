import {
  OneWay,
  ComponentBindings,
} from '@devextreme-generator/declarations';
import { ScrollableProps } from './scrollable_props';

@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {
  @OneWay() pullDownEnabled = false;

  @OneWay() reachBottomEnabled = false;
}
