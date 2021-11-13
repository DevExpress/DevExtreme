import {
  ComponentBindings,
  OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class ScrollbarProps {
  @OneWay() direction: 'vertical' | 'horizontal' = 'vertical';

  @OneWay() containerSize = 0;

  @OneWay() contentSize = 0;

  @OneWay() visible = false;

  @OneWay() containerHasSizes = false;

  @OneWay() scrollLocation = 0;

  @OneWay() minOffset = 0;

  @OneWay() maxOffset = 0;
}
