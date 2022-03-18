import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
  InternalState,
} from '@devextreme-generator/declarations';
import { Popup } from '../../overlays/popup';
import {
  defaultAnimation,
  getPopupToolbarItems,
  isPopupFullScreenNeeded,
  IToolbarButtonConfig,
  getMaxWidth,
} from './popup_config';
// eslint-disable-next-line import/named
import { dxSchedulerAppointment } from '../../../../ui/scheduler';
import { AppointmentViewModel } from '../appointment/types';

const APPOINTMENT_POPUP_CLASS = 'dx-scheduler-appointment-popup';
const wrapperAttr = {
  class: APPOINTMENT_POPUP_CLASS,
};

export interface FormTemplate {
  model: {
    appointmentData: dxSchedulerAppointment;
    targetedAppointmentData: dxSchedulerAppointment;
  };
  index: number;
}

export const viewFunction = ({
  toolbarItems,
  props: {
    visible,
    fullScreen,
    maxWidth,
    onVisibleChange,
    formContentTemplate,
  },
}: AppointmentEditForm): JSX.Element => (
  <Popup
    className={APPOINTMENT_POPUP_CLASS}
    wrapperAttr={wrapperAttr}
    visible={visible}
    visibleChange={onVisibleChange}
    height="auto"
    fullScreen={fullScreen}
    maxWidth={maxWidth}
    showCloseButton={false}
    showTitle={false}
    toolbarItems={toolbarItems}
    animation={defaultAnimation}
    contentTemplate={formContentTemplate}
  />
);

@ComponentBindings()
export class AppointmentEditFormProps {
  @OneWay() visible!: boolean;

  @OneWay() allowUpdating!: boolean;

  @OneWay() onVisibleChange!: (value: boolean) => void;

  @OneWay() appointmentData!: AppointmentViewModel;

  @OneWay() fullScreen!: boolean;

  @OneWay() maxWidth!: number | string;

  @Template() formContentTemplate?: JSXTemplate<FormTemplate>;
}

@Component({ view: viewFunction })
export class AppointmentEditForm extends
  JSXComponent<
  AppointmentEditFormProps,
  'visible' | 'allowUpdating' | 'onVisibleChange' | 'appointmentData' | 'fullScreen' | 'maxWidth'
  >() {
  @InternalState() isFullScreen: boolean = isPopupFullScreenNeeded();

  @InternalState() maxWidth = getMaxWidth(
    isPopupFullScreenNeeded(),
  );

  get toolbarItems(): IToolbarButtonConfig[] {
    return getPopupToolbarItems(this.props.allowUpdating);
  }
}
