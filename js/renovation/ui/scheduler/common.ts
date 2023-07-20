import { utils } from '../../../ui/scheduler/utils';
import { DataAccessorsProps } from './props';
import { DataAccessorType } from './types';
import { ViewDataProviderValidationOptions } from './workspaces/types';
import { createExpressions } from '../../../ui/scheduler/resources/utils';

export const createDataAccessors = (
  dataAccessorsProps: DataAccessorsProps,
  forceIsoDateParsing = false,
): DataAccessorType => {
  const dataAccessors = utils.dataAccessors.create(
    {
      startDate: dataAccessorsProps.startDateExpr,
      endDate: dataAccessorsProps.endDateExpr,
      startDateTimeZone: dataAccessorsProps.startDateTimeZoneExpr,
      endDateTimeZone: dataAccessorsProps.endDateTimeZoneExpr,
      allDay: dataAccessorsProps.allDayExpr,
      text: dataAccessorsProps.textExpr,
      description: dataAccessorsProps.descriptionExpr,
      recurrenceRule: dataAccessorsProps.recurrenceRuleExpr,
      recurrenceException: dataAccessorsProps.recurrenceExceptionExpr,
    },
    null,
    forceIsoDateParsing,
    dataAccessorsProps.dateSerializationFormat,
  ) as DataAccessorType;

  // TODO move to the 'utils.dataAccessors.create'
  dataAccessors.resources = createExpressions(dataAccessorsProps.resources) as DataAccessorType;

  return dataAccessors;
};

export const isViewDataProviderConfigValid = (
  viewDataProviderConfig: ViewDataProviderValidationOptions | undefined,
  currentViewOptions: ViewDataProviderValidationOptions,
): boolean => {
  if (!viewDataProviderConfig) {
    return false;
  }

  let result = true;

  Object.entries(viewDataProviderConfig).forEach(([key, value]) => {
    if (value !== currentViewOptions[key]) {
      result = false;
    }
  });

  return result;
};
