import {
  Component, ComponentBindings, JSXComponent,
  OneWay, Template, Fragment, Event,
} from 'devextreme-generator/component_declaration/common';
import BaseComponent from '../../preact-wrapper/tooltip-item-content';
import noop from '../../utils/noop';
import { dxSchedulerAppointment } from '../../../ui/scheduler';
import {
  TOOLTIP_APPOINTMENT_ITEM, TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER,
} from './consts';
import { DeferredColor, AppointmentItem } from './types';
import Marker from './marker';
import DeleteButton from './delete-button';
import ItemContent from './tooltip-item-content';

type GetCurrentDataFn = (appointmentItem: AppointmentItem) => dxSchedulerAppointment;
type GetOnDeleteButtonClick = (
  props: TooltipItemLayoutProps, data: dxSchedulerAppointment, currentData: dxSchedulerAppointment,
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

export const viewFunction = (viewModel: TooltipItemLayout) => {
  const useTemplate = !!viewModel.props.itemContentTemplate;
  const onDeleteButtonClick = getOnDeleteButtonClick(
    viewModel.props, viewModel.data, viewModel.props.singleAppointmentData!,
  );

  return (
    <Fragment>
      {useTemplate && (
        <viewModel.props.itemContentTemplate
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
        <ItemContent
          appointmentData={viewModel.data}
          currentAppointmentData={viewModel.currentData}
          getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
        />
        {viewModel.props.showDeleteButton && (
        <div className={TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER}>
          <DeleteButton onClick={onDeleteButtonClick} />
        </div>

        )}
      </div>
      )}
    </Fragment>
  );
};

@ComponentBindings()
export class TooltipItemLayoutProps {
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
}
