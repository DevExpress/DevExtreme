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

export const getSkippedDaysCount = (
  start: Date,
  dayCount: number,
  skippedDays?: number[],
): number => {
  if (dayCount <= 0 || !skippedDays || skippedDays.length === 0) {
    return 0;
  }

  const date = new Date(start);
  let skippedCount = 0;

  for (let i = 0; i < dayCount; i += 1) {
    if (isDateSkipped(date, skippedDays)) {
      skippedCount += 1;
    }
    date.setDate(date.getDate() + 1);
  }

  return skippedCount;
};
