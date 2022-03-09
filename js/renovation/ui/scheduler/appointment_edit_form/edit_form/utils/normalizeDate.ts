import dateSerialization from '../../../../../../core/utils/date_serialization';
import { validateAppointmentFormDate } from './validate';

export type FormDate = Date | undefined;

const normalizeNewDate = (
  newDate: FormDate,
  currentDate: FormDate,
  currentOppositeDate: FormDate,
  needCorrect: (startDate: Date, endDate: Date) => boolean,
): Date => {
  if (!validateAppointmentFormDate(newDate, currentDate)) {
    return currentDate as Date;
  }

  let result = newDate;

  const normalizedDate = dateSerialization.deserializeDate(newDate) as Date;
  const normalizedOppositeDate = dateSerialization.deserializeDate(currentOppositeDate) as Date;

  result = normalizedDate;

  if (needCorrect(normalizedOppositeDate, normalizedDate)) {
    const duration = currentDate
      ? normalizedOppositeDate.getTime() - normalizedDate.getTime()
      : 0;

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
