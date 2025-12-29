import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../../types';
import { isAppointmentMatchedResources } from './is_appointment_matched_resources';

export const filterByAttributes = <T extends MinimalAppointmentEntity & AllDayPanelOccupation>(
  entities: T[],
  {
    resourceManager, showAllDayPanel, supportAllDayPanel, viewDataProvider,
  }: FilterOptions,
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

    if (viewDataProvider && appointment.itemData) {
      const { startDate } = appointment.itemData;
      if (startDate && viewDataProvider.isSkippedDate(startDate)) {
        return false;
      }
    }

    const resources = resourceManager.groupResources();
    return isAppointmentMatchedResources(appointment.itemData, resources);
  });
