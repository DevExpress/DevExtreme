import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import { isDefined } from '@js/core/utils/type';
import { PathTimeZoneConversion } from '@ts/scheduler/r1/timezone_calculator/const';

import { getPathToLeaf } from '../../resources/m_utils';
import type { AppointmentProperties, LoadedResource } from './m_types';

const localizeDate = (date: Date): string => `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;
const localizeTime = (date: Date): string => `${dateLocalization.format(date, 'shorttime')}`;
const getDate = (options: AppointmentProperties, propName: 'endDate' | 'startDate'): Date => {
  const result = options.dataAccessors.get(propName, options.data);

  if (!result) {
    return result;
  }

  const date = new Date(result);
  const gridDate = options.timeZoneCalculator?.createDate(
    date,
    { path: PathTimeZoneConversion.fromSourceToGrid },
  );

  return gridDate ?? date;
};
const getDateText = (options: AppointmentProperties): string => {
  const startDate = getDate(options, 'startDate');
  const endDate = getDate(options, 'endDate');
  const startDateText = localizeDate(startDate);
  const endDateText = localizeDate(endDate);
  const startTimeText = localizeTime(startDate);
  const endTimeText = localizeTime(endDate);
  const isAllDay = Boolean(options.dataAccessors.get('allDay', options.data));
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
): string => (isDefined(partIndex) ? ` (${partIndex + 1}/${partTotalCount})` : '');

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

export const getGroupTexts = (
  groupIndex: number,
  loadedResources: LoadedResource[],
): string[] => {
  if (!loadedResources?.length) {
    return [];
  }

  const idPath: (string | number)[] = getPathToLeaf(groupIndex, loadedResources);
  const textPath = idPath.map(
    (id, index) => loadedResources[index].items.find(
      (item) => item.id === id,
    )?.text,
  ).filter(Boolean);

  return textPath as string[];
};
const getGroupText = (options: AppointmentProperties): string => {
  if (!options.groupTexts.length) {
    return '';
  }

  const groupText = options.groupTexts.join(', ');
  // @ts-ignore @ts-expect-error
  return messageLocalization.format('dxScheduler-appointmentAriaLabel-group', groupText);
};
const getResourceText = async (options: AppointmentProperties): Promise<string[]> => {
  const resourceProcessor = options.getResourceProcessor();
  const list = await resourceProcessor.getAppointmentResourcesValues(options.data);

  return list.map((item) => `${item.label}: ${item.values.join(', ')}`);
};

export const getAriaDescription = async (options: AppointmentProperties): Promise<string> => {
  const resources = await getResourceText(options);
  const texts = [
    getGroupText(options),
    ...resources,
  ].filter(Boolean);

  return texts.join('; ');
};
