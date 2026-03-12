const colors = [
  '#74d57b', '#1db2f5', '#f5564a', '#97c95c', '#ffc720', '#eb3573',
  '#a63db8', '#ffaa66', '#2dcdc4', '#c34cb9', '#3d44ec', '#4ddcca',
  '#2ec98d', '#ef9e44', '#45a5cc', '#a067bd', '#3d44ec', '#4ddcca',
  '#3ff6ca', '#f665aa', '#d1c974', '#ff6741', '#ee53dc', '#795ac3',
  '#ff7d8a', '#4cd482', '#9d67cc', '#5ab1ef', '#68e18f', '#4dd155',
];

export const resources = colors.map((color, index) => ({ text: `Resource ${index + 1}`, id: index + 1, color }));

const getPseudoRandomDuration = (durationState: number): number => {
  const durationMin = Math.floor((durationState % 23) / 3 + 5) * 15;

  return durationMin * 60 * 1000;
};

export const generateAppointmentsWithResources = (
  options: {
    startDay: Date;
    endDay: Date;
    startDayHour: number;
    endDayHour: number;
    resourceCount?: number;
  },
): any[] => {
  const {
    startDay, endDay, startDayHour, endDayHour,
  } = options;
  const resourceCount = options.resourceCount ?? resources.length;

  if (resourceCount && resourceCount > resources.length) {
    throw new Error(`Resource count should be less than or equal to ${resources.length}`);
  }

  let appointments: any[] = [];
  let durationState = 1;
  const durationIncrement = 19;

  resources.slice(0, resourceCount).forEach((resource) => {
    let startDate = startDay;

    while (startDate.getTime() < endDay.getTime()) {
      durationState += durationIncrement;
      const endDate = new Date(startDate.getTime() + getPseudoRandomDuration(durationState));

      appointments.push({
        startDate,
        endDate,
        resourceId: resource.id,
      });

      durationState += durationIncrement;
      startDate = new Date(endDate.getTime() + getPseudoRandomDuration(durationState));
    }
  });

  appointments = appointments.filter(({ startDate, endDate }) => (
    startDate.getDay() === endDate.getDay()
    && startDate.getHours() >= startDayHour - 1
    && endDate.getHours() <= endDayHour - 1));

  appointments = appointments.map((appointment, index) => ({ ...appointment, text: `[Appointment ${index + 1}]` }));

  return appointments;
};
