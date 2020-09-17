import {
  Component, ComponentBindings, JSXComponent,
  OneWay, Template, Fragment, Event,
} from 'devextreme-generator/component_declaration/common';
import BaseComponent from '../../../preact_wrapper/tooltip_item_content';
import noop from '../../../utils/noop';
/* eslint-disable-next-line import/named */
import { dxSchedulerAppointment } from '../../../../ui/scheduler';
import {
  AppointmentItem, FormattedContent, GetTextAndFormatDateFn, CheckAndDeleteAppointmentFn,
} from './types.d';
import { Marker } from './marker';
import { Button } from '../../button';
import { TooltipItemContent } from './item_content';
import getCurrentAppointment from './utils/get_current_appointment';
import { defaultGetTextAndFormatDate } from './utils/default_functions';

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
        />
      )}
      {!useTemplate && (
        <div
          className={`dx-tooltip-appointment-item ${viewModel.props.className}`}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...viewModel.restAttributes}
        >
          <Marker color={viewModel.props.item!.color} />
          <TooltipItemContent
            text={viewModel.formattedContent.text}
            formattedDate={viewModel.formattedContent.formatDate}
          />
          {viewModel.props.showDeleteButton && (
            <div className="dx-tooltip-appointment-item-delete-button-container">
              <Button
                className="dx-tooltip-appointment-item-delete-button"
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

  @OneWay() showDeleteButton?: boolean = true;

  @Template() itemContentTemplate?: any;

  @Event() onDelete?: CheckAndDeleteAppointmentFn = noop;

  @Event() onHide?: () => void = noop;

  @OneWay() getTextAndFormatDate?: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @OneWay() singleAppointment?: dxSchedulerAppointment;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: BaseComponent,
  },
})
export class TooltipItemLayout extends JSXComponent(TooltipItemLayoutProps) {
  get currentAppointment(): dxSchedulerAppointment {
    const { item } = this.props;

    return getCurrentAppointment(item!);
  }

  get onDeleteButtonClick(): (e: any) => void {
    const {
      singleAppointment, item, onHide, onDelete,
    } = this.props;

    return (e: any): void => {
      onHide!();
      e.event.stopPropagation();
      onDelete!(item!.data, singleAppointment!);
    };
  }

  get formattedContent(): FormattedContent {
    const { getTextAndFormatDate, item } = this.props;
    const { data } = item!;

    return getTextAndFormatDate!(data, this.currentAppointment);
  }
}
