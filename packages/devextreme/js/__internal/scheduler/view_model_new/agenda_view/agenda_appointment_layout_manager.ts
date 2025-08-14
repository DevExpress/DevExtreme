import { BaseAppointmentLayoutManager } from '../base_appointment_layout_manager';
import { getVisibleAppointmentsOccurrences } from '../filtration/get_visible_appointments_occurrences';
import type { ListEntity, MinimalAppointmentEntity } from '../types';
import { addSortedIndex } from '../utils/add_sorted_index';
import { sortByGroupIndex, sortByStartDate } from '../utils/sorting';
import { addLastInGroup } from './add_last_in_group';
import type { AgendaEntity } from './types';

export class AgendaAppointmentLayoutManager extends BaseAppointmentLayoutManager<
  ListEntity,
  AgendaEntity
> {
  isSupportAllDayPanel(): boolean { return false; }

  filterAppointments(items: MinimalAppointmentEntity[]): ListEntity[] {
    const options = this.getFilterOptions(true);
    return getVisibleAppointmentsOccurrences(items, options);
  }

  generateViewModel(entities: AgendaEntity[]): AgendaEntity[] {
    const height = this.scheduler.fire('getAgendaVerticalStepHeight');
    const withGeometry = entities.map((entity) => ({
      ...entity,
      height,
      width: '100%',
    }));
    sortByStartDate(withGeometry);
    sortByGroupIndex(withGeometry);
    const withLastGroup = addLastInGroup(withGeometry);
    return addSortedIndex(withLastGroup);
  }
}
