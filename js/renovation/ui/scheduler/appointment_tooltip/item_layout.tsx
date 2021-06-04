import {
  Component, ComponentBindings, JSXComponent,
  OneWay, Template, Event, JSXTemplate,
} from '@devextreme-generator/declarations';
import noop from '../../../utils/noop';
/* eslint-disable-next-line import/named */
import { dxSchedulerAppointment } from '../../../../ui/scheduler';
import {
  AppointmentItem,
  FormattedContent,
  GetTextAndFormatDateFn,
  CheckAndDeleteAppointmentFn,
  AppointmentTooltipTemplate,
} from './types.d';
import { Marker } from './marker';
import { Button } from '../../editors/button';
import { TooltipItemContent } from './item_content';
import getCurrentAppointment from './utils/get_current_appointment';
import { defaultGetTextAndFormatDate } from './utils/default_functions';

export const viewFunction = (viewModel: TooltipItemLayout): JSX.Element => {
  const ItemContentTemplate = viewModel.props.itemContentTemplate;

  return ItemContentTemplate ? (
    <ItemContentTemplate
      model={{
        appointmentData: viewModel.props.item.data,
        targetedAppointmentData: viewModel.currentAppointment,
      }}
      index={viewModel.props.index}
    />
  ) : (
    <div
      className={`dx-tooltip-appointment-item ${viewModel.props.className}`}
          // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
    >
      <Marker />
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
  );
};

@ComponentBindings()
export class TooltipItemLayoutProps {
  @OneWay() className?: string = '';

  @OneWay() item: AppointmentItem = { data: {} };

  @OneWay() index = 0;

  @OneWay() showDeleteButton?: boolean = true;

  @Template() itemContentTemplate?: JSXTemplate<AppointmentTooltipTemplate>;

  @Event() onDelete: CheckAndDeleteAppointmentFn = noop;

  @Event() onHide: () => void = noop;

  @OneWay() getTextAndFormatDate: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @OneWay() singleAppointment: dxSchedulerAppointment = {};
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TooltipItemLayout extends JSXComponent(TooltipItemLayoutProps) {
  get currentAppointment(): dxSchedulerAppointment {
    const { item } = this.props;

    return getCurrentAppointment(item);
  }

  get onDeleteButtonClick(): (e: { event: Event }) => void {
    const {
      singleAppointment, item, onHide, onDelete,
    } = this.props;

    return (e: { event: Event }): void => {
      onHide();
      e.event.stopPropagation();
      onDelete(item.data, singleAppointment);
    };
  }

  get formattedContent(): FormattedContent {
    const { getTextAndFormatDate, item } = this.props;
    const { data } = item;

    return getTextAndFormatDate(data, this.currentAppointment);
  }
}
