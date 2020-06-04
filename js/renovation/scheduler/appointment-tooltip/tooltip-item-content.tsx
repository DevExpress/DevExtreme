import {
  Component, ComponentBindings, JSXComponent, OneWay, Template, Ref, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { dxSchedulerAppointment } from '../../../ui/scheduler';
import noop from '../../utils/noop';
import DeleteButton from './delete-button';
import {
  TOOLTIP_APPOINTMENT_ITEM, TOOLTIP_APPOINTMENT_ITEM_CONTENT,
  TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT, TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE,
} from './consts';
import { DeferredColor, AppointmentItem, FormattedContent } from './types';
import Marker from './marker';

type GetCurrentDataFn = (appointmentItem: AppointmentItem) => dxSchedulerAppointment;
type GetOnDeleteButtonClick = (
  props: TooltipItemContentProps, data: dxSchedulerAppointment, currentData: dxSchedulerAppointment,
) => (e: any) => void;

export const getCurrentData: GetCurrentDataFn = (appointmentItem) => {
  const { settings, data, currentData } = appointmentItem;

  return settings?.targetedAppointmentData || currentData || data;
};

export const getOnDeleteButtonClick: GetOnDeleteButtonClick = (
  { onDelete, onHide }, data, currentData,
) => (e: any): void => {
    onHide?.();
    e.event.stopPropagation();
    onDelete?.(data, currentData);
};

export const viewFunction = (viewModel: TooltipItemContent) => {
  const useTemplate = !!viewModel.props.itemContent;
  const { formattedData: { text, formatDate } } = viewModel;
  return (
    <Fragment>
      {useTemplate && (
        <viewModel.props.itemContent
          model={{
            appointmentData: viewModel.data,
            targetedAppointmentData: viewModel.currentData,
          }}
          index={viewModel.props.index}
          parentRef={{
            current: viewModel.props.container,
          }}
        />
      )}
      {!useTemplate && (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div className={TOOLTIP_APPOINTMENT_ITEM} {...viewModel.restAttributes}>
        <Marker color={viewModel.color} />
        <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT}>
          <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT}>{text}</div>
          <div className={TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE}>{formatDate}</div>
        </div>
        {viewModel.props.showDeleteButton && (
          <DeleteButton onClick={viewModel.onDeleteButtonClick} />
        )}
      </div>
      )}
    </Fragment>
  );
};

@ComponentBindings()
export class TooltipItemContentProps {
  @OneWay() item?: AppointmentItem = { data: {} };

  @OneWay() index?: number;

  @OneWay() container?: HTMLDivElement;

  @Template() itemContent?: any;

  @OneWay() onDelete?: (
    data?: dxSchedulerAppointment, currentData?: dxSchedulerAppointment,
  ) => void = noop;

  @OneWay() onHide?: () => void = noop;

  @OneWay() getTextAndFormatDate?: (
    data?: dxSchedulerAppointment, currentData?: dxSchedulerAppointment,
  ) => any = noop;

  @OneWay() showDeleteButton?: boolean = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export default class TooltipItemContent extends JSXComponent<TooltipItemContentProps> {
  @Ref()
  contentRef!: HTMLDivElement;

  get currentData(): dxSchedulerAppointment {
    const { item } = this.props;
    return getCurrentData(item!);
  }

  get data(): dxSchedulerAppointment {
    return this.props.item!.data;
  }

  get color(): DeferredColor | undefined {
    return this.props.item!.color;
  }

  get onDeleteButtonClick(): (e: any) => void {
    return getOnDeleteButtonClick(this.props, this.data, this.currentData);
  }

  get formattedData(): FormattedContent {
    const { getTextAndFormatDate } = this.props;
    return getTextAndFormatDate?.(this.data, this.currentData);
  }
}
