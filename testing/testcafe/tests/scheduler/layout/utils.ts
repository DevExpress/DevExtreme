export const createDataSetForScreenShotTests = () => {
  const result: {
    text: string;
    startDate: Date;
    endDate: Date;
    priorityId: number;
    allDay?: boolean;
  }[] = [];
    // eslint-disable-next-line no-plusplus
  for (let day = 1; day < 25; day++) {
    result.push({
      text: '1 appointment',
      startDate: new Date(2020, 6, day, 0),
      endDate: new Date(2020, 6, day, 1),
      priorityId: 0,
    });

    result.push({
      text: '2 appointment',
      startDate: new Date(2020, 6, day, 1),
      endDate: new Date(2020, 6, day, 2),
      priorityId: 1,
    });

    result.push({
      text: '3 appointment',
      startDate: new Date(2020, 6, day, 3),
      endDate: new Date(2020, 6, day, 5),
      allDay: true,
      priorityId: 0,
    });
  }

  return result;
};
