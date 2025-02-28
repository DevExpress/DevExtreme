// TODO Vinogradov: Refactor offsets: number[] -> ...offsets: number[]
const addOffsets = (date: Date, offsets: number[]): Date => {
  const newDateMs = offsets.reduce(
    (result, offset) => result + offset,
    date.getTime(),
  );

  return new Date(newDateMs);
};
// eslint-disable-next-line @stylistic/max-len
const isValidDate = (date: unknown): boolean => Boolean(date && !isNaN(new Date(date as Date).valueOf()));

export const dateUtilsTs = {
  addOffsets,
  isValidDate,
};
