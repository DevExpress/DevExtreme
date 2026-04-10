export const isValidWeekday = (value: unknown): value is number => (
  typeof value === 'number'
  && Number.isInteger(value)
  && value >= 0
  && value <= 6
);

export const isDateSkipped = (date: Date, skippedDays: number[]): boolean => (
  skippedDays.includes(date.getDay())
);

export const getVisibleDaysOfWeek = (
  firstDayOfWeek: number,
  skippedDays: number[],
): number[] => {
  const result: number[] = [];
  for (let count = 0; count < 7; count += 1) {
    const raw = firstDayOfWeek + count;
    const dayOfWeek = ((raw % 7) + 7) % 7;
    if (!skippedDays.includes(dayOfWeek)) {
      result.push(dayOfWeek);
    }
  }

  return result;
};

export const getFirstVisibleDate = (
  start: Date,
  skippedDays: number[],
  nextDate: (date: Date) => Date,
): Date => {
  let date = new Date(start);
  while (isDateSkipped(date, skippedDays)) {
    date = nextDate(date);
  }
  return date;
};

export const getDateAfterVisibleDays = (
  start: Date,
  visibleDayCount: number,
  skippedDays: number[],
  nextDate: (date: Date) => Date,
): Date => {
  if (visibleDayCount <= 0) {
    return new Date(start);
  }

  let date = new Date(start);
  let visited = 0;
  while (visited < visibleDayCount) {
    date = nextDate(date);
    if (!isDateSkipped(date, skippedDays)) {
      visited += 1;
    }
  }

  return date;
};
