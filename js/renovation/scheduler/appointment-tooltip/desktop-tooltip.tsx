import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import Tooltip from '../../tooltip';
import AppointmentList from './appointment-list';
import { OverlayProps } from './overlay-props';

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

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class DesktopTooltip extends JSXComponent(OverlayProps) {}
