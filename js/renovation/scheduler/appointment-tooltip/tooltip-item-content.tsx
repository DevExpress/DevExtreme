/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';
import noop from '../../utils/noop';
import { dxSchedulerAppointment } from '../../../ui/scheduler';
import {
  TOOLTIP_APPOINTMENT_ITEM_CONTENT, TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT,
  TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE,
} from './consts';
import { FormattedContent } from './types';

export const viewFunction = (viewModel: TooltipItemContent) => (
  <div
    className={`${TOOLTIP_APPOINTMENT_ITEM_CONTENT} ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT}>{viewModel.formattedData.text}</div>
    <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE}>
      {viewModel.formattedData.formatDate}
    </div>
  </div>
);

@ComponentBindings()
export class TooltipItemContentProps {
  @OneWay() className?: string = '';

  @OneWay() currentAppointmentData?: dxSchedulerAppointment = {};

  @OneWay() appointmentData?: dxSchedulerAppointment = {};

  @Event() getTextAndFormatDate?: (
    data?: dxSchedulerAppointment, currentData?: dxSchedulerAppointment,
  ) => any = noop;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class TooltipItemContent extends JSXComponent(TooltipItemContentProps) {
  get formattedData(): FormattedContent {
    const {
      getTextAndFormatDate, appointmentData, currentAppointmentData,
    } = this.props;

    return getTextAndFormatDate!(appointmentData, currentAppointmentData);
  }
}
