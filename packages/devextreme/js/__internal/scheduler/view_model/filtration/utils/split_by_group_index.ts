import {
  getAppointmentGroupIndex,
  getAppointmentGroupValues,
} from '../../../utils/resource_manager/appointment_groups_utils';
import type { FilterOptions, GroupIndex, MinimalAppointmentEntity } from '../../types';

export const splitByGroupIndex = <T extends MinimalAppointmentEntity>(
  entities: T[],
  { resourceManager }: Pick<FilterOptions, 'resourceManager'>,
): (T & GroupIndex)[] => entities
    .reduce<(T & GroupIndex)[]>((result, entity) => {
      if (resourceManager.groupsLeafs.length === 0) {
        result.push({ ...entity, groupIndex: 0 });
        return result;
      }

      const groupValues = getAppointmentGroupValues(
        entity.itemData,
        resourceManager.resources,
      );
      const groupIndexes = getAppointmentGroupIndex(
        groupValues,
        resourceManager.groupsLeafs,
      );

      groupIndexes.forEach((groupIndex) => {
        result.push({ ...entity, groupIndex });
      });

      return result;
    }, []);
