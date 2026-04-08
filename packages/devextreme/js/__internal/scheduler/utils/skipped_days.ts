export const isDateSkipped = (date: Date, skippedDays: number[]): boolean => (
  skippedDays.includes(date.getDay())
);

export const getVisibleDaysOfWeek = (
  firstDayOfWeek: number,
  skippedDays: number[],
): number[] => {
  const result: number[] = [];
  for (let count = 0; count < 7; count += 1) {
    const dayOfWeek = (firstDayOfWeek + count) % 7;
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

export const getDateAfterVisibleWeek = (
  start: Date,
  skippedDays: number[],
  nextDate: (date: Date) => Date,
): Date => {
  const visibleCount = 7 - skippedDays.length;
  if (visibleCount <= 0) {
    return new Date(start);
  }

  let date = new Date(start);
  let visited = 0;
  while (visited < visibleCount) {
    if (!isDateSkipped(date, skippedDays)) {
      visited += 1;
    }
    date = nextDate(date);
  }
  return date;
};
