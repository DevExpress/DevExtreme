const addOffsets = (date: Date, ...offsets: number[]): Date => {
  const newDateMs = offsets.reduce(
    (result, offset) => result + offset,
    date.getTime(),
  );

  return new Date(newDateMs);
};

const isValidDate = (
  date: unknown,
): date is Date | string | number => Boolean(
  date && !isNaN(new Date(date as Date).valueOf()),
);

export const dateUtilsTs = {
  addOffsets,
  isValidDate,
};
