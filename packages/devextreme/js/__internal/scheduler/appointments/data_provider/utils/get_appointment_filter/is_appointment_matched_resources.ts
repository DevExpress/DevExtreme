import { equalByValue } from '@js/core/utils/common';

import type { SafeAppointment } from '../../../../types';
import type { ResourceLoader } from '../../../../utils/loader/resource_loader';
import { getAppointmentGroupValues } from '../../../../utils/resource_manager/appointment_groups_utils';

export const isAppointmentMatchedResources = (
  appointment: SafeAppointment,
  groupsResources: ResourceLoader[],
): boolean => {
  if (groupsResources.length === 0) {
    return true;
  }

  const appointmentGroupValues = getAppointmentGroupValues(appointment, groupsResources);

  return groupsResources.every((resource) => {
    const value = appointmentGroupValues[resource.resourceIndex];

    return value?.some(
      (id) => resource.items.some(
        (item) => equalByValue(id, item.id),
      ),
    );
  });
};
