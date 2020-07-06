/* eslint-disable class-methods-use-this */
import {
  Component, ComponentBindings, JSXComponent, OneWay, Event, Template, Ref,
} from 'devextreme-generator/component_declaration/common';
import { getWindow } from '../../../core/utils/window';
import Overlay from '../../overlay';
import AppointmentList from './appointment-list';
import { OverlayProps } from './overlay-props';

const animationConfigProps: any = {
  show: {
    type: 'slide',
    duration: 300,
    from: { position: { my: 'top', at: 'bottom', of: getWindow() } },
    to: { position: { my: 'center', at: 'center', of: getWindow() } },
  },
  hide: {
    type: 'slide',
    duration: 300,
    to: { position: { my: 'top', at: 'bottom', of: getWindow() } },
    from: { position: { my: 'center', at: 'center', of: getWindow() } },
  },
};

const positionConfigProps: any = {
  my: 'bottom',
  at: 'bottom',
  of: getWindow(),
};
const MAX_OVERLAY_HEIGHT = 250;

export const viewFunction = (viewModel: MobileTooltip) => {
  console.log(viewModel.props.container);
  return (
    <Overlay
      shading={false}
      positionConfig={positionConfigProps}
      // animationConfig={animationConfigProps}
      target={viewModel.props.container}
      container={viewModel.props.container}
      closeOnOutsideClick
      width="100%"
      height={viewModel.height}
    // onContentReady={viewModel.onShowing}
      onHidden={viewModel.props.onHide}
      onShown={viewModel.onShowing}
      contentTemplate={() => (
        <AppointmentList
          ref={viewModel.listRef as never}
          appointments={viewModel.props.appointments}
          checkAndDeleteAppointment={viewModel.props.checkAndDeleteAppointment}
          showAppointmentPopup={viewModel.props.showAppointmentPopup}
          onHide={viewModel.props.onHide}
          itemContentTemplate={viewModel.props.itemContentTemplate}
          getTextAndFormatDate={viewModel.props.getTextAndFormatDate}
          // onShowing={viewModel.onShowing}
        />
      )}
    />
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class MobileTooltip extends JSXComponent(OverlayProps) {
  @Ref()
  listRef!: AppointmentList;

  height: string | number = 'auto';

  positionConfig: any;

  animationConfig: any;

  get onShowing(): () => void {
    return (): void => {
      // setTimeout(() => {
      const list = this.listRef.getHtmlElement();
      console.log(list.getBoundingClientRect().height);
      console.log(list);
      this.height = list.getClientRects()[0].height > MAX_OVERLAY_HEIGHT ? MAX_OVERLAY_HEIGHT : 'auto';
      console.log(this.height);
      debugger;
      // debugger;
      // });
    };
  }
}
