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
import { dxSchedulerAppointment } from '../../../ui/scheduler';

@ComponentBindings()
export class OverlayProps {
  @OneWay() appointments?: AppointmentItem[];

  @OneWay() container?: HTMLDivElement;

  @OneWay() target?: HTMLDivElement;

  @OneWay() offset?: number;

  @Event() checkAndDeleteAppointment?: CheckAndDeleteAppointmentFn = noop;

  @Event() getTextAndFormatDate?: GetTextAndFormatDateFn = defaultGetTextAndFormatDate;

  @Event() getSingleAppointmentData?: GetSingleAppointmentFn = defaultGetSingleAppointment;

  @Event() showAppointmentPopup?: ShowAppointmentPopupFn = noop;

  @Event() onHide?: () => void = noop;

  @Event() getScrollableContainer?: () => HTMLDivElement;

  @Event() isAppointmentInAllDayPanel?: (
    appointment: dxSchedulerAppointment,
  ) => boolean = () => false;

  @Event() dragBehavior?: () => void;

  @Template() itemContentTemplate?: any;
}
