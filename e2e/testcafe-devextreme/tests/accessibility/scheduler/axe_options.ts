export const a11yCheckConfig = {};

// Appointments are painted with the accent color and their date line is dimmed to 70% opacity,
// so the title and the date do not reach the AA contrast ratio.
export const a11yContext = {
  include: ['#container'],
  exclude: ['.dx-scheduler-appointment'],
};
