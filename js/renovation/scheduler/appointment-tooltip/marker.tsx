/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent, Effect, OneWay,
} from 'devextreme-generator/component_declaration/common';
import {
  TOOLTIP_APPOINTMENT_ITEM_MARKER, TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY,
} from './consts';
import { DeferredColor, Color } from './types';

export const viewFunction = (viewModel: Marker) => (
  <div
    className={`${TOOLTIP_APPOINTMENT_ITEM_MARKER} ${viewModel.props.className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div
      className={TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY}
      style={{ background: viewModel.appointmentColor! }}
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
export default class Marker extends JSXComponent(MarkerProps) {
  appointmentColor!: Color;

  @Effect()
  colorEffect() {
    const { color } = this.props;
    color?.done((value) => {
      this.appointmentColor = value;
    });
  }
}
