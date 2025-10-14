import { dateUtilsTs } from '@ts/core/utils/date';
import type { RenderStrategyName, SafeAppointment } from '@ts/scheduler/types';

import { adaptAgendaSettings } from './adapt_agenda_settings';
import { addCollector } from './add_collector';
import AgendaAppointmentsStrategy from './rendering_strategies/m_strategy_agenda';
import type BaseAppointmentsStrategy from './rendering_strategies/m_strategy_base';
import HorizontalAppointmentsStrategy from './rendering_strategies/m_strategy_horizontal';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/m_strategy_horizontal_month';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/m_strategy_horizontal_month_line';
import VerticalAppointmentsStrategy from './rendering_strategies/m_strategy_vertical';
import WeekAppointmentRenderingStrategy from './rendering_strategies/m_strategy_week';
import type { AppointmentViewModelInternal } from './types';

const RENDERING_STRATEGIES: Record<RenderStrategyName, typeof BaseAppointmentsStrategy> = {
  horizontal: HorizontalAppointmentsStrategy,
  horizontalMonth: HorizontalMonthAppointmentsStrategy,
  horizontalMonthLine: HorizontalMonthLineAppointmentsStrategy,
  vertical: VerticalAppointmentsStrategy,
  week: WeekAppointmentRenderingStrategy,
  agenda: AgendaAppointmentsStrategy,
};

export class AppointmentViewModelGenerator {
  renderingStrategy!: BaseAppointmentsStrategy;

  initRenderingStrategy(options) {
    const RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
    this.renderingStrategy = new RenderingStrategy(options);
  }

  getRenderingStrategy() {
    return this.renderingStrategy;
  }

  generate(filteredItems: SafeAppointment[], options) {
    const {
      viewOffset,
      appointmentRenderingStrategyName,
      dataAccessors,
      timeZoneCalculator,
    } = options;
    const appointments = filteredItems
      ? filteredItems.slice()
      : [];

    this.initRenderingStrategy(options);

    const renderingStrategy = this.getRenderingStrategy();
    const positionMap = renderingStrategy.createTaskPositionMap(appointments); // appointments are mutated inside!
    const shiftedViewModel = this.postProcess(appointments, positionMap);
    const viewModel = this.unshiftViewModelAppointmentsByViewOffset(shiftedViewModel, viewOffset);
    viewModel.forEach((item) => {
      item.settings.forEach((settings) => {
        settings.geometry = appointmentRenderingStrategyName === 'agenda'
          ? undefined
          : renderingStrategy.getAppointmentGeometry(settings);
      });
    });
    const viewModelPlain = appointmentRenderingStrategyName === 'agenda'
      ? adaptAgendaSettings(viewModel, dataAccessors, timeZoneCalculator)
      : addCollector(viewModel);

    return {
      positionMap,
      viewModel: viewModelPlain,
    };
  }

  postProcess(filteredItems: SafeAppointment[], positionMap): AppointmentViewModelInternal[] {
    const renderingStrategy = this.getRenderingStrategy();

    return filteredItems.map((data, index) => {
      // TODO research do we need this code
      if (!renderingStrategy.keepAppointmentSettings()) {
        delete data.settings;
      }

      // TODO Seems we can analize direction in the rendering strategies
      const appointmentSettings = positionMap[index];
      appointmentSettings.forEach((item) => {
        item.direction = renderingStrategy.getDirection() === 'vertical' && !item.allDay
          ? 'vertical'
          : 'horizontal';
      });

      const item: AppointmentViewModelInternal = {
        itemData: data,
        settings: appointmentSettings,
        needRepaint: true,
        needRemove: false,
      };

      return item;
    });
  }

  // NOTE: Unfortunately, we cannot implement immutable behavior here
  // because in this case it will break the refs (keys) of dataSource's appointments,
  // and it will break appointment updates :(
  private unshiftViewModelAppointmentsByViewOffset(
    viewModel: AppointmentViewModelInternal[],
    viewOffset: number,
  ): AppointmentViewModelInternal[] {
    const processedAppointments = new Set();

    // eslint-disable-next-line no-restricted-syntax
    for (const model of viewModel) {
      // eslint-disable-next-line no-restricted-syntax
      for (const setting of model.settings ?? []) {
        const appointment = setting?.info?.appointment as {
          startDate: Date;
          endDate: Date;
          normalizedEndDate: Date;
        } | undefined;

        if (appointment && !processedAppointments.has(appointment)) {
          appointment.startDate = dateUtilsTs
            .addOffsets(appointment.startDate, [viewOffset]);
          appointment.endDate = dateUtilsTs
            .addOffsets(appointment.endDate, [viewOffset]);
          appointment.normalizedEndDate = dateUtilsTs
            .addOffsets(appointment.normalizedEndDate, [viewOffset]);
          processedAppointments.add(appointment);
        }
      }
    }

    return viewModel;
  }
}
