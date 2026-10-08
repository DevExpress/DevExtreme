export const a11yCheckConfig = {};

// The appointment title and date do not reach the AA contrast ratio:
// the date line is dimmed to 70% opacity over the accent-colored appointment.
export const a11yContext = {
  include: ['#container'],
  exclude: [
    '.dx-scheduler-appointment-title',
    '.dx-scheduler-appointment-content-date',
  ],
};
