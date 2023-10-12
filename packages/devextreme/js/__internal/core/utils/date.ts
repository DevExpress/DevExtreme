const addOffsets = (date: Date, offsets: number[]): Date => {
  const newDateMs = offsets.reduce(
    (result, offset) => result + offset,
    date.getTime(),
  );

  return new Date(newDateMs);
};

export const dateUtilsTs = {
  addOffsets,
};
