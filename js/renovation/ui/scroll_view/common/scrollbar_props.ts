import {
  ComponentBindings,
  OneWay,
} from '@devextreme-generator/declarations';
import { ScrollableDirection } from './types';

@ComponentBindings()
export class ScrollbarProps {
  @OneWay() direction: Omit<ScrollableDirection, 'both'> = 'vertical';

  @OneWay() containerSize = 0;

  @OneWay() contentSize = 0;

  @OneWay() visible = false;

  @OneWay() containerHasSizes = false;

  @OneWay() scrollLocation = 0;

  @OneWay() minOffset = 0;

  @OneWay() maxOffset = 0;
}
