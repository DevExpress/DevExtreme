import type { TimeZoneCalculator } from '../../r1/timezone_calculator';
import { AppointmentAdapter } from '../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import { plainViewModel } from './plain_view_model';
import type { AppointmentAgendaViewModel, AppointmentViewModelInternal } from './types';

export const adaptAgendaSettings = (
  viewModel: AppointmentViewModelInternal[],
  dataAccessor: AppointmentDataAccessor,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentAgendaViewModel[] => {
  const settings = plainViewModel(viewModel);

  return settings.map((item) => {
    const { agendaSettings } = item;
    const adapterBySettings = new AppointmentAdapter(
      agendaSettings ?? item.itemData,
      dataAccessor,
    );
    const adapter = dataAccessor.isRecurrent(item.itemData)
      ? adapterBySettings
      : new AppointmentAdapter(
        item.itemData,
        dataAccessor,
      );

    return {
      isAgendaModel: true,
      itemData: item.itemData,
      allDay: Boolean(item.allDay),
      groupIndex: item.groupIndex,
      sortedIndex: item.sortedIndex,
      direction: item.direction,
      height: item.height,
      width: item.width,
      isLastInGroup: false,
      info: {
        sourceAppointment: {
          allDay: item.allDay,
          startDate: adapter.startDate,
          endDate: adapter.endDate,
        },
        appointment: {
          allDay: item.allDay,
          ...adapter.getCalculatedDates(timeZoneCalculator, 'toGrid'),
        },
        partialDates: {
          allDay: item.allDay,
          ...adapterBySettings.getCalculatedDates(timeZoneCalculator, 'toGrid'),
        },
      },
    };
  });
};
