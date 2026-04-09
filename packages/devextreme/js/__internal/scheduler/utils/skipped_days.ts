export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const isWeekdayIndex = (value: unknown): value is WeekdayIndex => (
  typeof value === 'number'
  && Number.isInteger(value)
  && value >= 0
  && value <= 6
);

export const isDateSkipped = (date: Date, skippedDays: WeekdayIndex[]): boolean => (
  skippedDays.includes(date.getDay() as WeekdayIndex)
);

export const getVisibleDaysOfWeek = (
  firstDayOfWeek: number,
  skippedDays: WeekdayIndex[],
): WeekdayIndex[] => {
  const result: WeekdayIndex[] = [];
  for (let count = 0; count < 7; count += 1) {
    const raw = firstDayOfWeek + count;
    const dayOfWeek = ((raw % 7) + 7) % 7 as WeekdayIndex;
    if (!skippedDays.includes(dayOfWeek)) {
      result.push(dayOfWeek);
    }
  }

  return result;
};

export const getFirstVisibleDate = (
  start: Date,
  skippedDays: WeekdayIndex[],
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
  skippedDays: WeekdayIndex[],
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
