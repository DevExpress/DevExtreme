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

export const viewFunction = (viewModel: TooltipItemContent) => {
  const {
    text, formatDate: formattedDate,
  }: FormattedContent = viewModel.props.getTextAndFormatDate?.(
    viewModel.props.appointmentData, viewModel.props.currentAppointmentData,
  );

  return (
    <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT}>
      <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT}>{text}</div>
      <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE}>{formattedDate}</div>
    </div>
  );
};

@ComponentBindings()
export class TooltipItemContentProps {
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
export default class TooltipItemContent extends JSXComponent(TooltipItemContentProps) {}
