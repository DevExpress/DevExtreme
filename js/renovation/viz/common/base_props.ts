import {
  OneWay,
  ComponentBindings,
  Slot,
  TwoWay,
} from '@devextreme-generator/declarations';
import {
  Margin,
  Size,
} from './types.d';

@ComponentBindings()
export class BaseWidgetProps {
  @Slot({ isSVG: true })
  children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() size?: Size;

  @OneWay() margin?: Margin;

  @OneWay() disabled = false;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() classes? = '';

  @OneWay() className = '';

  @OneWay() defaultCanvas?: ClientRect;

  @TwoWay()
  canvas: ClientRect = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

  @OneWay() pointerEvents?: string;
}
