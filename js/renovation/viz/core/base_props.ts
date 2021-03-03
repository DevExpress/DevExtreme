import {
  OneWay,
  ComponentBindings,
  Slot,
  Event,
  TwoWay,
} from 'devextreme-generator/component_declaration/common';
import {
  Canvas,
  Margin,
  Size,
} from './common/types.d';

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

  @OneWay() defaultCanvas?: Canvas;

  @Event({
    actionConfig: { excludeValidators: ['disabled'] },
  }) onContentReady?: (e: any) => any;

  @TwoWay()
  canvas: Canvas = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

  @OneWay() pointerEvents?: string;
}
