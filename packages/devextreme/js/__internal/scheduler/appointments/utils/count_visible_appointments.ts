import type { SafeAppointment } from '../../types';
import type {
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
} from '../../view_model/generate_view_model/types';

export const countVisibleAppointments = (items: AppointmentViewModelPlain[]): number => {
  const alreadyCountedPartHash = new Map<string, SafeAppointment[]>();
  const countPart = (item: AppointmentItemViewModel): boolean => {
    if (!item.partTotalCount) {
      return true;
    }

    const key = `${item.info.appointment.startDate.getTime()}${item.info.appointment.endDate.getTime()}`;
    const savedItems = alreadyCountedPartHash.get(key) ?? [];

    if (savedItems.includes(item.itemData)) {
      return false;
    }

    alreadyCountedPartHash.set(key, [...savedItems, item.itemData]);
    return true;
  };

  return items.reduce((count, item) => {
    if ('items' in item) {
      return count + item.items.filter(countPart).length;
    }

    if ('info' in item && !countPart(item)) {
      return count;
    }

    return count + 1;
  }, 0);
};
