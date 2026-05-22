import $ from '@js/core/renderer';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';

import type { AppointmentCollectorProperties } from '../appointment_collector';
import { AppointmentCollector } from '../appointment_collector';
import { mockGridViewModel } from './appointment_view_model';

export const getAppointmentCollectorProperties = (
  appointmentsData: SafeAppointment[],
): AppointmentCollectorProperties => {
  const targetedAppointmentData: TargetedAppointment = {
    ...appointmentsData[0],
    displayStartDate: appointmentsData[0].startDate as Date,
    displayEndDate: appointmentsData[0].endDate as Date,
  };

  const config: AppointmentCollectorProperties = {
    tabIndex: 0,
    sortedIndex: 0,
    items: appointmentsData.map((item) => mockGridViewModel(item)),
    isCompact: false,
    geometry: {
      height: 30,
      width: 30,
      top: 0,
      left: 0,
    },
    targetedAppointmentData,
    appointmentCollectorTemplate: new EmptyTemplate(),
    onFocusIn: () => {},
    onFocusOut: () => {},
    onKeyDown: () => {},
    onClick: () => {},
  };

  return config;
};

export const createAppointmentCollector = (
  properties: AppointmentCollectorProperties,
): AppointmentCollector => {
  const $element = $('.root');

  // @ts-expect-error
  return new AppointmentCollector($element, properties);
};
