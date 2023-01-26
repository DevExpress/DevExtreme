import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (): JSX.Element => (
  <div
    className="dx-tooltip-appointment-item-marker"
  >
    <div
      className="dx-tooltip-appointment-item-marker-body"
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
}
