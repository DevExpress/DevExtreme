import {
  ComponentBindings,
  OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class ScrollbarProps {
  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() hoverStateEnabled?: boolean;

  @OneWay() containerHasSizes = false;

  @OneWay() containerSize = 0;

  @OneWay() contentSize = 0;

  @OneWay() isScrollableHovered = false;

  @OneWay() forceVisibility = false;

  @OneWay() scrollLocation = 0;

  @OneWay() minOffset = 0;

  @OneWay() maxOffset = 0;
}
