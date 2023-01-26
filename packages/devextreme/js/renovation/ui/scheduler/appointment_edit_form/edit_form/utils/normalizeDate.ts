import dateSerialization from '../../../../../../core/utils/date_serialization';

export type FormDate = Date | undefined | null;

const validateAppointmentFormDate = (
  date: Date | undefined | null,
): boolean => date === null || (!!date && !!new Date(date).getDate());

const normalizeNewDate = (
  newDate: FormDate,
  currentDate: FormDate,
  currentOppositeDate: FormDate,
  needCorrect: (startDate: Date, endDate: Date) => boolean,
): Date => {
  if (!validateAppointmentFormDate(newDate)) {
    return currentDate as Date;
  }

  const normalizedDate = dateSerialization.deserializeDate(newDate) as Date;
  const normalizedOppositeDate = dateSerialization.deserializeDate(currentOppositeDate) as Date;

  let result = normalizedDate;

  if (
    normalizedOppositeDate
    && normalizedDate
    && needCorrect(normalizedOppositeDate, normalizedDate)
  ) {
    const duration = normalizedOppositeDate.getTime() - normalizedDate.getTime();
    result = new Date(normalizedDate.getTime() + duration);
  }

  return result;
};

export const normalizeNewStartDate = (
  newStartDate: FormDate,
  currentStartDate: FormDate,
  currentEndDate: FormDate,
): Date => normalizeNewDate(
  newStartDate,
  currentStartDate,
  currentEndDate,
  (endDate, startDate) => endDate < startDate,
);

export const normalizeNewEndDate = (
  newEndDate: FormDate,
  currentStartDate: FormDate,
  currentEndDate: FormDate,
): Date => normalizeNewDate(
  newEndDate,
  currentEndDate,
  currentStartDate,
  (startDate, endDate) => endDate < startDate,
);
