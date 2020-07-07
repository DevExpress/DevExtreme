import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Template, Event, Ref,
} from 'devextreme-generator/component_declaration/common';
import noop from '../../utils/noop';
import MobileTooltip from './mobile-tooltip';
import DesktopTooltip from './desktop-tooltip';
import {
  GetTextAndFormatDateFn, GetSingleAppointmentFn,
  CheckAndDeleteAppointmentFn, ShowAppointmentPopupFn, AppointmentItem,
} from './types';
import {
  defaultGetTextAndFormatDate, defaultGetSingleAppointment,
} from './utils/default-functions';
import { dxSchedulerAppointment } from '../../../ui/scheduler';

export const viewFunction = (viewModel: AppointmentTooltip) => {
  const Tooltip = viewModel.props.adaptivityEnabled ? MobileTooltip : DesktopTooltip;

  return viewModel.props.visible ? (
    <div
      className={viewModel.className}
      ref={viewModel.contentRef as any}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
    >
      <Tooltip
        appointments={viewModel.props.appointments}
        onHide={viewModel.onHide}
        target={viewModel.props.target}
        container={viewModel.props.container}
        checkAndDeleteAppointment={viewModel.props.checkAndDeleteAppointment}
        showAppointmentPopup={viewModel.props.showAppointmentPopup}
        itemContentTemplate={viewModel.props.contentTemplate}
        getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
        isAppointmentInAllDayPanel={viewModel.props.isAppointmentInAllDayPanel}
        getScrollableContainer={viewModel.props.getScrollableContainer}
        offset={viewModel.props.offset}
        dragBehavior={viewModel.props.dragBehavior}
      />
    </div>
  ) : null;
};

@ComponentBindings()
export class AppointmentTooltipProps {
  @OneWay() adaptivityEnabled?: boolean = false;

  @OneWay() container?: HTMLDivElement;

  @OneWay() target?: HTMLDivElement;

  @OneWay() appointments?: AppointmentItem[] = [];

  @OneWay() offset?: number;

  @TwoWay() visible?: boolean = true;

  @Template() contentTemplate?: any;

  @Event() checkAndDeleteAppointment?: CheckAndDeleteAppointmentFn = noop;

  @Event() getTextAndFormatDate?: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @Event() getSingleAppointmentData?: GetSingleAppointmentFn = defaultGetSingleAppointment;

  @Event() showAppointmentPopup?: ShowAppointmentPopupFn = noop;

  @Event() getScrollableContainer?: () => HTMLDivElement;

  @Event() isAppointmentInAllDayPanel?: (
    appointment: dxSchedulerAppointment,
  ) => boolean = () => false;

  @Event() dragBehavior?: () => void;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export default class AppointmentTooltip extends JSXComponent(AppointmentTooltipProps) {
  target?: HTMLDivElement;

  visible?: boolean;

  @Ref()
  contentRef?: HTMLDivElement;

  get className() {
    const { adaptivityEnabled } = this.props;
    return adaptivityEnabled ? 'dx-scheduler-overlay-panel' : 'dx-scheduler-appointment-tooltip-wrapper';
  }

  onHide() {
    this.visible = false;
  }
}
