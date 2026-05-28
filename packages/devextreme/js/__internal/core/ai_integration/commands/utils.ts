/**
 * Matches "AIDate(year, month, day)" format used by the filtering command.
 * The year is the full year; month and day are 1-based.
 */
const AI_DATE_REGEX = /^AIDate\((\d+),\s*(\d+),\s*(\d+)\)$/;

export function parseDates(_key: string, value: unknown): unknown {
  if (typeof value === 'string') {
    const match = AI_DATE_REGEX.exec(value);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]) - 1;
      const day = Number(match[3]);
      const date = new Date(year, month, day);

      const isValid = date.getFullYear() === year
        && date.getMonth() === month
        && date.getDate() === day;

      if (!isValid) {
        return value;
      }

      return date;
    }
  }
  return value;
}
