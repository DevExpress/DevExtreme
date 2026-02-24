import {
  getAppointmentGroupIndex,
  getAppointmentGroupValues,
} from '../../../utils/resource_manager/appointment_groups_utils';
import type { FilterOptions, GroupIndex, MinimalAppointmentEntity } from '../../types';

export const splitByGroupIndex = <T extends MinimalAppointmentEntity>(
  appointments: T[],
  { resourceManager }: Pick<FilterOptions, 'resourceManager'>,
): (T & GroupIndex)[] => appointments
  .reduce<(T & GroupIndex)[]>((result, appointment) => {
    if (resourceManager.groupsLeafs.length === 0) {
      result.push({ ...appointment, groupIndex: 0 });
      return result;
    }

    const groupValues = getAppointmentGroupValues(
      appointment.itemData,
      resourceManager.resources,
    );
    const groupIndexes = getAppointmentGroupIndex(
      groupValues,
      resourceManager.groupsLeafs,
    );

    groupIndexes.forEach((groupIndex) => {
      result.push({ ...appointment, groupIndex });
    });

    return result;
  }, []);
