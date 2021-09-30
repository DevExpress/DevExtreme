import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { BoxAlign, BoxDirection, BoxCrossAlign } from '../../../enums/enums';

@ComponentBindings()
export class BoxProps {
  @OneWay() direction: BoxDirection = 'row';

  @OneWay() align: BoxAlign = 'start';

  @OneWay() crossAlign: BoxCrossAlign = 'stretch';
}
