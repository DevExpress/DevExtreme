import {
  Component, ComponentBindings, JSXComponent, OneWay, Event, Template,
} from 'devextreme-generator/component_declaration/common';
import noop from '../../utils/noop';
import Tooltip from '../../tooltip';
import AppointmentList from './appointment-list';
import {
  GetTextAndFormatDateFn, GetSingleAppointmentFn,
  CheckAndDeleteAppointmentFn, ShowAppointmentPopupFn, AppointmentItem,
} from './types';
import {
  defaultGetTextAndFormatDate, defaultGetSingleAppointment,
} from './utils/default-functions';

const MAX_TOOLTIP_HEIGHT = 200;
const closeOnTargetScroll = () => false;

export const viewFunction = (viewModel: DesktopTooltip) => (
  <Tooltip
    target={viewModel.props.target}
    maxHeight={MAX_TOOLTIP_HEIGHT}
    height={200}
    closeOnTargetScroll={closeOnTargetScroll}
    contentTemplate={() => (
      <AppointmentList
        appointments={viewModel.props.appointments}
        checkAndDeleteAppointment={viewModel.props.checkAndDeleteAppointment}
        showAppointmentPopup={viewModel.props.showAppointmentPopup}
        onHide={viewModel.props.onHide}
        itemContentTemplate={viewModel.props.itemContentTemplate}
        getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
      />
    )}
  />
);

@ComponentBindings()
export class DesktopTooltipProps {
  @OneWay() appointments?: AppointmentItem[];

  @OneWay() container?: HTMLDivElement;

  @OneWay() target?: HTMLDivElement;

  @Event() checkAndDeleteAppointment?: CheckAndDeleteAppointmentFn = noop;

  @Event() getTextAndFormatDate?: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @Event() getSingleAppointmentData?: GetSingleAppointmentFn = defaultGetSingleAppointment;

  @Event() showAppointmentPopup?: ShowAppointmentPopupFn = noop;

  @Event() onHide?: () => void = noop;

  @Template() itemContentTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class DesktopTooltip extends JSXComponent(DesktopTooltipProps) {}
