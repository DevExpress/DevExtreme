import { isDefined } from '../../../../core/utils/type';
import dateLocalization from '../../../../localization/date';

export const getFirstDayOfWeek = (
  firstDayOfWeek: number | undefined,
): number => (
  isDefined(firstDayOfWeek)
    ? firstDayOfWeek
    : dateLocalization.firstDayOfWeekIndex()
);
