import {
  Component, ComponentBindings, JSXComponent, OneWay, CSSAttributes,
} from 'devextreme-generator/component_declaration/common';
import { Color } from './types.d';

export const viewFunction = (viewModel: Marker): JSX.Element => (
  <div
    className={`dx-tooltip-appointment-item-marker ${viewModel.props.className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
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
