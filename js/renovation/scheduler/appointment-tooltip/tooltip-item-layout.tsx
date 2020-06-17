/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent,
  OneWay, Template, Fragment, Event,
} from 'devextreme-generator/component_declaration/common';
import BaseComponent from '../../preact-wrapper/tooltip-item-content';
import noop from '../../utils/noop';
import { dxSchedulerAppointment } from '../../../ui/scheduler';
import {
  TOOLTIP_APPOINTMENT_ITEM, TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER,
  TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON,
} from './consts';
import { AppointmentItem, FormattedContent } from './types';
import Marker from './marker';
import Button from '../../button';
import TooltipItemContent from './tooltip-item-content';

export const viewFunction = (viewModel: TooltipItemLayout) => {
  const useTemplate = !!viewModel.props.itemContentTemplate;

  return (
    <Fragment>
      {useTemplate && (
        <viewModel.props.itemContentTemplate
          model={{
            appointmentData: viewModel.props.item!.data,
            targetedAppointmentData: viewModel.currentAppointment,
          }}
          index={viewModel.props.index}
          parentRef={{
            current: viewModel.props.container,
          }}
        />
      )}
      {!useTemplate && (
        <div
          className={`${TOOLTIP_APPOINTMENT_ITEM} ${viewModel.props.className}`}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...viewModel.restAttributes}
        >
          <Marker color={viewModel.props.item!.color} />
          <TooltipItemContent
            text={viewModel.formattedContent.text}
            formattedDate={viewModel.formattedContent.formatDate}
          />
          {viewModel.props.showDeleteButton && (
            <div className={TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER}>
              <Button
                className={TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON}
                icon="trash"
                stylingMode="text"
                onClick={viewModel.onDeleteButtonClick}
              />
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

@ComponentBindings()
export class TooltipItemLayoutProps {
  @OneWay() className?: string = '';

  @OneWay() item?: AppointmentItem = { data: {} };

  @OneWay() index?: number;

  @OneWay() container?: HTMLDivElement;

  @OneWay() showDeleteButton?: boolean = true;

  @Template() itemContentTemplate?: any;

  @Event() onDelete?: (
    data?: dxSchedulerAppointment, currentData?: dxSchedulerAppointment,
  ) => void = noop;

  @Event() onHide?: () => void = noop;

  @Event() getTextAndFormatDate?: (
    data?: dxSchedulerAppointment, currentData?: dxSchedulerAppointment,
  ) => any = noop;

  @OneWay() singleAppointmentData?: dxSchedulerAppointment;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: BaseComponent,
  },
})
export default class TooltipItemLayout extends JSXComponent(TooltipItemLayoutProps) {
  get currentAppointment(): dxSchedulerAppointment {
    const { item } = this.props;

    const { settings, data, currentData } = item!;

    return settings?.targetedAppointmentData || currentData || data;
  }

  get onDeleteButtonClick(): (e: any) => void {
    const {
      singleAppointmentData, item, onHide, onDelete,
    } = this.props;

    return (e: any): void => {
      onHide!();
      e.event.stopPropagation();
      onDelete!(item!.data, singleAppointmentData);
    };
  }

  get formattedContent(): FormattedContent {
    const { getTextAndFormatDate, item } = this.props;
    const { data } = item!;

    return getTextAndFormatDate!(data, this.currentAppointment);
  }
}
