import $ from '@js/core/renderer';

// @ts-expect-error
import dxrAppointmentLayout from '../../../renovation/ui/scheduler/appointment/layout.j';
import { utils } from '../m_utils';

// This is temporary - to creating appointments from the old code
export const renderAppointments = (options) => {
  const {
    instance,
    $dateTable,
    viewModel,
  } = options;
  const container = getAppointmentsContainer($dateTable);
  utils.renovation.renderComponent(
    instance,
    container,
    dxrAppointmentLayout,
    'renovatedAppointments',
    viewModel,
  );
};

const getAppointmentsContainer = ($dateTable) => {
  let container = $('.dx-appointments-container');

  if (container.length === 0) {
    container = $('<div>')
      .addClass('dx-appointments-container')
      .appendTo($dateTable);
  }

  return container;
};
