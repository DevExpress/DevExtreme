import VerticalAppointmentsStrategy from './rendering_strategies/strategy_vertical';
import HorizontalAppointmentsStrategy from './rendering_strategies/strategy_horizontal';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month_line';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month';
import AgendaAppointmentsStrategy from './rendering_strategies/strategy_agenda';

const RENDERING_STRATEGIES = {
    'horizontal': HorizontalAppointmentsStrategy,
    'horizontalMonth': HorizontalMonthAppointmentsStrategy,
    'horizontalMonthLine': HorizontalMonthLineAppointmentsStrategy,
    'vertical': VerticalAppointmentsStrategy,
    'agenda': AgendaAppointmentsStrategy
};

export class AppointmentViewModel {
    initRenderingStrategy(options) {
        const RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
        this.renderingStrategy = new RenderingStrategy(options);
    }

    generate(filteredItems, options) {
        const {
            isRenovatedAppointments,
            appointmentRenderingStrategyName
        } = options;
        const appointments = filteredItems
            ? filteredItems.slice()
            : [];

        this.initRenderingStrategy(options);

        const renderingStrategy = this.getRenderingStrategy();
        const positionMap = renderingStrategy.createTaskPositionMap(appointments); // TODO - appointments are mutated inside!
        let viewModel = this.postProcess(appointments, positionMap, appointmentRenderingStrategyName, isRenovatedAppointments);

        if(isRenovatedAppointments) {
            // TODO this structure should be by default after remove old render
            viewModel = this.makeRenovatedViewModel(viewModel);
        }

        return {
            positionMap,
            viewModel
        };
    }
    postProcess(filteredItems, positionMap, appointmentRenderingStrategyName, isRenovatedAppointments) {
        return filteredItems.map((data, index) => {
            // TODO research do we need this code
            if(!this.getRenderingStrategy().keepAppointmentSettings()) {
                delete data.settings;
            }

            // TODO Seems we can analize direction in the rendering strategies
            const appointmentSettings = positionMap[index];
            appointmentSettings.forEach((item) => {
                item.direction = appointmentRenderingStrategyName === 'vertical' && !item.allDay
                    ? 'vertical'
                    : 'horizontal';
            });

            const item = {
                itemData: data,
                settings: appointmentSettings
            };

            if(!isRenovatedAppointments) {
                item.needRepaint = true;
                item.needRemove = false;
            }

            return item;
        });
    }
    makeRenovatedViewModel(viewModel) {
        const result = [];
        const strategy = this.getRenderingStrategy();

        viewModel.forEach(({ itemData, settings }) => {
            const items = settings.map((options) => {
                const geometry = strategy.getAppointmentGeometry(options);

                return {
                    appointment: itemData,
                    geometry: {
                        ...geometry,
                        // TODO move to the rendering strategies
                        leftVirtualWidth: options.leftVirtualWidth,
                        topVirtualHeight: options.topVirtualHeight
                    },
                    info: options.info
                };
            });

            result.push(...items);
        });

        return result;
    }

    getRenderingStrategy() {
        return this.renderingStrategy;
    }
}
