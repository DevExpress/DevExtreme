// NOTE: 60 minutes in hours * 60 seconds in minute * 1000 millisecond in second.
const MS_IN_HOUR = 60 * 60000;

function getAppointmentDurationInHours(
  startDate: Date,
  endDate: Date,
): number {
  return (endDate.getTime() - startDate.getTime()) / MS_IN_HOUR;
}

export default getAppointmentDurationInHours;
