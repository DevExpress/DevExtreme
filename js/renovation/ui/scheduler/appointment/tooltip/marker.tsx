import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: Marker): JSX.Element => (
  <div
    className="dx-tooltip-appointment-item-marker"
  >
    <div
      className="dx-tooltip-appointment-item-marker-body"
      style={viewModel.style}
    />
  </div>
);

@ComponentBindings()
export class MarkerProps {
  @OneWay() color?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Marker extends JSXComponent(MarkerProps) {
  get style(): CSSAttributes {
    return { background: this.props.color };
  }
}
