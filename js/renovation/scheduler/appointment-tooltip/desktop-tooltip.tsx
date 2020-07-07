import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import { touch } from '../../../core/utils/support';
import Tooltip from '../../tooltip';
import AppointmentList from './appointment-list';
import { OverlayProps } from './overlay-props';

const MAX_TOOLTIP_HEIGHT = 200;
const closeOnTargetScroll = () => false;

export const viewFunction = (viewModel: DesktopTooltip) => (
  <Tooltip
    className="dx-scheduler-appointment-tooltip-wrapper"
    position={viewModel.positionConfig}
    target={viewModel.props.target}
    maxHeight={MAX_TOOLTIP_HEIGHT}
    maxHeight={200}
    closeOnTargetScroll={closeOnTargetScroll}
    // onShowing={}
    contentTemplate={() => (
      <AppointmentList
        appointments={viewModel.props.appointments}
        checkAndDeleteAppointment={viewModel.props.checkAndDeleteAppointment}
        showAppointmentPopup={viewModel.props.showAppointmentPopup}
        onHide={viewModel.props.onHide}
        itemContentTemplate={viewModel.props.itemContentTemplate}
        getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
        showScrollbar={viewModel.showScrollbar}
        dragBehavior={viewModel.props.dragBehavior}
      />
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class DesktopTooltip extends JSXComponent(OverlayProps) {
  skipHidingOnScroll = false;

  boundary(): HTMLElement {
    const { getScrollableContainer, isAppointmentInAllDayPanel, appointments } = this.props;
    const appointmentInAllDayPanel = isAppointmentInAllDayPanel!(appointments![0].data);
    const result = appointmentInAllDayPanel ? this.props.container! : getScrollableContainer!();

    return result;
  }

  // @Effect()
  // initDragEffect() {
  //   setTimeout(() => {
  //     this.props.dragBehavior?.();
  //   }, 0);
  // }

  get positionConfig() {
    return {
      my: 'bottom',
      at: 'top',
      boundary: this.boundary(),
      offset: this.props.offset,
      collision: 'fit flipfit',
    };
  }

  get showScrollbar() {
    return touch ? 'always' : 'onHover';
  }

  // get onTooltipShowing() {

  // }
}
