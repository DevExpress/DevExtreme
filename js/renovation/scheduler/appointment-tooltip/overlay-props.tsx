import {
  ComponentBindings, OneWay, Event, Template,
} from 'devextreme-generator/component_declaration/common';
import {
  GetTextAndFormatDateFn, GetSingleAppointmentFn,
  CheckAndDeleteAppointmentFn, ShowAppointmentPopupFn, AppointmentItem,
} from './types';
import {
  defaultGetTextAndFormatDate, defaultGetSingleAppointment,
} from './utils/default-functions';
import noop from '../../utils/noop';

@ComponentBindings()
export class OverlayProps {
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
