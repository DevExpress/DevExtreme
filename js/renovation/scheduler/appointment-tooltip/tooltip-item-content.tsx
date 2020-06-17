/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import {
  TOOLTIP_APPOINTMENT_ITEM_CONTENT, TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT,
  TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE,
} from './consts';

export const viewFunction = (viewModel: TooltipItemContent) => (
  <div
    className={`${TOOLTIP_APPOINTMENT_ITEM_CONTENT} ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT}>{viewModel.props.text}</div>
    <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE}>
      {viewModel.props.formattedDate}
    </div>
  </div>
);

@ComponentBindings()
export class TooltipItemContentProps {
  @OneWay() className?: string = '';

  @OneWay() text?: string = '';

  @OneWay() formattedDate?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class TooltipItemContent extends JSXComponent(TooltipItemContentProps) {}
