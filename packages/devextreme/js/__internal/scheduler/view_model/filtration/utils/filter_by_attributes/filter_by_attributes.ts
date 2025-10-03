import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../../types';
import { isAppointmentMatchedResources } from './is_appointment_matched_resources';

export const filterByAttributes = <T extends MinimalAppointmentEntity & AllDayPanelOccupation>(
  entities: T[],
  { resourceManager, showAllDayPanel, supportAllDayPanel }: FilterOptions,
): T[] => entities.filter((appointment): boolean => {
    if (!appointment.visible) {
      return false;
    }

    const allDayPanelAppointmentHidden = Boolean(
      supportAllDayPanel
      && !showAllDayPanel
      && appointment.isAllDayPanelOccupied,
    );
    if (allDayPanelAppointmentHidden) {
      return false;
    }

    const resources = resourceManager.groupResources();
    return isAppointmentMatchedResources(appointment.itemData, resources);
  });
