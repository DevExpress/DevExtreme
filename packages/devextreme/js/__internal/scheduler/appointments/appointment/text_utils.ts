import messageLocalization from '@js/common/core/localization/message';
import { isDefined } from '@js/core/utils/type';

import { formatImplicitSchedulerDate, formatImplicitSchedulerTime } from '../../utils/global_formats';
import type { AppointmentProperties } from './m_types';

const localizeDate = (date: Date): string => formatImplicitSchedulerDate(date);
const localizeTime = (date: Date): string => formatImplicitSchedulerTime(date);

const getDate = (options: AppointmentProperties, propName: 'endDate' | 'startDate'): Date => {
  const result = options.dataAccessors.get(propName, options.data);

  if (!result) {
    return result;
  }

  const date = new Date(result);
  const gridDate = options.timeZoneCalculator?.createDate(date, 'toGrid');

  return gridDate ?? date;
};

const getDateText = (options: AppointmentProperties): string => {
  const startDate = getDate(options, 'startDate');
  const endDate = getDate(options, 'endDate');
  const startDateText = localizeDate(startDate);
  const endDateText = localizeDate(endDate);
  const startTimeText = localizeTime(startDate);
  const endTimeText = localizeTime(endDate);
  const isAllDay = options.dataAccessors.get('allDay', options.data);
  const allDayText = messageLocalization.format('dxScheduler-allDay');

  if (startDateText === endDateText) {
    return isAllDay
      ? `${startDateText}, ${allDayText}`
      : `${startDateText}, ${startTimeText} - ${endTimeText}`;
  }

  return isAllDay
    ? `${startDateText} - ${endDateText}, ${allDayText}`
    : `${startDateText}, ${startTimeText} - ${endDateText}, ${endTimeText}`;
};

const getPartsText = (
  { partIndex, partTotalCount }: AppointmentProperties,
): string => (isDefined(partIndex) && partTotalCount > 0 ? ` (${partIndex + 1}/${partTotalCount})` : '');

export const getAriaLabel = (options: AppointmentProperties): string => {
  const name = options.dataAccessors.get('text', options.data) ?? '';
  const dates = getDateText(options);
  const parts = getPartsText(options);

  return `${name}: ${dates}${parts}`;
};

export const getReducedIconTooltip = (options: AppointmentProperties): string => {
  const tooltipLabel = messageLocalization.format('dxScheduler-editorLabelEndDate');
  const endDateText = localizeDate(getDate(options, 'endDate'));

  return `${tooltipLabel}: ${endDateText}`;
};

const getGroupText = (options: AppointmentProperties): string => {
  if (!options.groupTexts.length) {
    return '';
  }

  const groupText = options.groupTexts.join(', ');
  // @ts-ignore @ts-expect-error
  return messageLocalization.format('dxScheduler-appointmentAriaDescription-group', groupText);
};

const getResourceText = async (options: AppointmentProperties): Promise<string[]> => {
  const resourceManager = options.getResourceManager();
  const list = await resourceManager.getAppointmentResourcesValues(options.data);

  return list.map((item) => `${item.label}: ${item.values.join(', ')}`);
};

export const getAriaDescription = async (options: AppointmentProperties): Promise<string> => {
  const resources = await getResourceText(options);
  const text = [
    getGroupText(options),
    ...resources,
    options.allowDelete
      ? messageLocalization.format('dxScheduler-hotkeysAriaDescription-delete')
      : null,
    messageLocalization.format('dxScheduler-hotkeysAriaDescription-homeEnd'),
  ].filter(Boolean).join('; ');

  return text;
};
