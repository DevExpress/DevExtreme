import {
  Component, ComponentBindings, JSXComponent, OneWay, CSSAttributes,
} from '@devextreme-generator/declarations';
import { Color } from './types.d';

export const viewFunction = (viewModel: Marker): JSX.Element => (
  <div
    className={`dx-tooltip-appointment-item-marker ${viewModel.props.className}`}
  >
    <div
      className="dx-tooltip-appointment-item-marker-body"
      style={viewModel.style}
    />
  </div>
);

@ComponentBindings()
export class MarkerProps {
  // @OneWay() color?: DeferredColor;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Marker extends JSXComponent(MarkerProps) {
  appointmentColor!: Color;

  get style(): CSSAttributes {
    return { background: this.appointmentColor };
  }
}
