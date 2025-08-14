import type { FilterOptions, MinimalAppointmentEntity } from '../types';
import { isAppointmentMatchedResources } from './is_appointment_matched_resources';

export const filterByAttributes = <T extends MinimalAppointmentEntity>(
  entities: T[],
  { resourceManager }: FilterOptions,
): T[] => entities.filter((appointment): boolean => {
    const isAppointmentVisible = appointment.visible ?? true;
    if (!isAppointmentVisible) {
      return false;
    }

    const resources = resourceManager.groupResources();
    return isAppointmentMatchedResources(appointment.itemData, resources);
  });
