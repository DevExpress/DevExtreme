export const validateAppointmentFormDate = (
  value: Date | undefined,
  previousValue: Date | undefined,
): boolean => {
  const isCurrentDateCorrect = value === null || !!value;
  const isPreviousDateCorrect = previousValue === null || !!previousValue;

  return isCurrentDateCorrect || isPreviousDateCorrect;
};
