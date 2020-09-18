import {
  Component, ComponentBindings, JSXComponent, Effect, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DeferredColor, Color } from './types.d';

export const viewFunction = (viewModel: Marker) => (
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
  @OneWay() color?: DeferredColor;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Marker extends JSXComponent(MarkerProps) {
  appointmentColor!: Color;

  @Effect()
  colorEffect(): void {
    const { color } = this.props;
    color?.done((value) => {
      this.appointmentColor = value;
    });
  }

  get style() {
    return { background: this.appointmentColor! };
  }
}
